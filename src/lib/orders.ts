"use server"

import { Order, ShipmentMethod } from "@prisma/client"
import { z } from "zod"
import { db } from "@/db"
import { registerCdekOrder } from "@/lib/cdek"
import { sendTelegramMessage } from "@/lib/telegram"
import formSchema from "@/app/checkout/schema"

// Types
type CreateOrderData = z.infer<typeof formSchema> & {
  quantity: number
  amount: number
  orderId: string
}

type CdekShipmentData = {
  recipient: {
    name: string
    phones: { number2: string }[]
  }
  to_location: {
    city: string
  }
  packages: {
    number: string
    weight: number
    items: {
      name: string
      ware_key: string
      cost: number
      weight: number
      amount: number
    }[]
  }[]
}

// Schemas
const orderNotificationSchema = z.object({
  OrderId: z.string(),
  Status: z.string(),
  PaymentId: z.string(),
  Amount: z.number(),
})

// Constants
const PRODUCT_WEIGHT_GRAMS = 1540
const PRODUCT_SKU = "jacket-001"
const PRODUCT_NAME = "Пуховик"

// Logger
const logger = {
  info: (message: string, ...args: any[]) => console.log(message, ...args),
  error: (message: string, ...args: any[]) => console.error(message, ...args),
}

// Notification Service
class NotificationService {
  static async sendOrderCreated(order: Order, formData: CreateOrderData) {
    await sendTelegramMessage({
      message: `
🛍 Новый заказ создан!

ID: ${order.id}
Имя: ${formData.name}
Email: ${formData.email}
Телефон: ${formData.phone}
Город: ${formData.city}
Количество: ${formData.quantity}
Сумма: ${formData.amount / 100} руб.
      `.trim(),
    })
  }

  static async sendOrderNotFound(orderId: string) {
    await sendTelegramMessage({
      message: `❌ Заказ не найден в базе данных!\nID: ${orderId}`,
    })
  }

  static async sendShipmentCreated(orderId: string, trackingNumber: string) {
    await sendTelegramMessage({
      message: `📦 Создано отправление CDEK!\n\nЗаказ: ${orderId}\nТрек-номер: ${trackingNumber}`,
    })
  }

  static async sendShipmentError(orderId: string, error: string) {
    await sendTelegramMessage({
      message: `⚠️ Ошибка создания отправления CDEK!\n\nЗаказ: ${orderId}\nОшибка: ${error}`,
    })
  }
}

// Order Service
class OrderService {
  static async create(formData: CreateOrderData): Promise<Order> {
    logger.info("🚀 Создание заказа с ID:", formData.orderId)

    const order = await db.order.create({
      data: {
        id: formData.orderId,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        city: formData.city,
        shipmentMethod: formData.shipment.toUpperCase() as ShipmentMethod,
        pickupOffice: formData.pickup_office,
        amount: formData.amount,
        quantity: formData.quantity,
      },
    })

    await NotificationService.sendOrderCreated(order, formData)
    logger.info("✅ Заказ успешно создан:", order.id)
    return order
  }

  static async updatePaymentStatus(
    orderId: string,
    paymentId: string
  ): Promise<Order> {
    return await db.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        paymentId,
        updatedAt: new Date(),
      },
    })
  }

  static async getRecentOrders(limit = 5) {
    return await db.order.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
    })
  }
}

// Shipment Service
class ShipmentService {
  static prepareCdekData(order: Order): CdekShipmentData {
    return {
      recipient: {
        name: order.customerName,
        phones: [{ number2: order.customerPhone }],
      },
      to_location: {
        city: order.city,
      },
      packages: [
        {
          number: order.id,
          weight: PRODUCT_WEIGHT_GRAMS,
          items: [
            {
              name: PRODUCT_NAME,
              ware_key: PRODUCT_SKU,
              cost: order.amount / 100,
              weight: PRODUCT_WEIGHT_GRAMS,
              amount: order.quantity,
            },
          ],
        },
      ],
    }
  }

  static async createShipment(order: Order) {
    logger.info("📦 Формирование данных для CDEK...", order.id)

    const cdekOrderData = this.prepareCdekData(order)
    const result = await registerCdekOrder(cdekOrderData)

    if (!result.success) {
      await NotificationService.sendShipmentError(order.id, result.error)
      throw new Error(`Failed to create CDEK shipment: ${result.error}`)
    }

    await db.order.update({
      where: { id: order.id },
      data: {
        cdekOrderId: result.order.order_id,
        status: "SHIPPING",
      },
    })

    await NotificationService.sendShipmentCreated(
      order.id,
      result.order.order_id
    )
    return result.order
  }
}

// Main handlers
export async function createOrder(formData: CreateOrderData) {
  return await OrderService.create(formData)
}

export async function handlePaymentNotification(data: unknown) {
  logger.info("💰 Получено уведомление об оплате:", data)

  const notification = orderNotificationSchema.parse(data)
  if (notification.Status !== "CONFIRMED") {
    return
  }

  const existingOrder = await db.order.findUnique({
    where: { id: notification.OrderId },
  })

  if (!existingOrder) {
    await NotificationService.sendOrderNotFound(notification.OrderId)
    return
  }

  try {
    const updatedOrder = await OrderService.updatePaymentStatus(
      existingOrder.id,
      notification.PaymentId
    )
    await ShipmentService.createShipment(updatedOrder)
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка"
    logger.error("❌ Ошибка при обработке заказа:", errorMessage)
    throw error
  }
}
