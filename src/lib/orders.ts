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
    tariff_code: number
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
  info: (message: string, ...args: any[]) => {
    const timestamp = new Date().toISOString()
    console.log(`[INFO][${timestamp}] ${message}`, ...args)
  },
  error: (message: string, ...args: any[]) => {
    const timestamp = new Date().toISOString()
    console.error(`[ERROR][${timestamp}] ${message}`, ...args)
  },
  debug: (message: string, ...args: any[]) => {
    const timestamp = new Date().toISOString()
    console.log(`[DEBUG][${timestamp}] ${message}`, ...args)
  },
}

// Notification Service
class NotificationService {
  static async sendOrderCreated(order: Order, formData: CreateOrderData) {
    logger.info("📨 Отправка уведомления о новом заказе", { orderId: order.id })

    const message = `
🛍 Новый заказ создан!

ID: ${order.id}
Имя: ${formData.name}
Email: ${formData.email}
Телефон: ${formData.phone}
Город: ${formData.city}
Количество: ${formData.quantity}
Сумма: ${formData.amount / 100} руб.
    `.trim()

    logger.debug("Содержание уведомления:", message)

    try {
      await sendTelegramMessage({ message })
      logger.info("✅ Уведомление успешно отправлено", { orderId: order.id })
    } catch (error) {
      logger.error("❌ Ошибка при отправке уведомления", {
        orderId: order.id,
        error,
      })
      throw error
    }
  }

  static async sendOrderNotFound(orderId: string) {
    logger.info("📨 Отправка уведомления о ненайденном заказе", { orderId })
    await sendTelegramMessage({
      message: `❌ Заказ не найден в базе данных!\nID: ${orderId}`,
    })
  }

  static async sendShipmentCreated(orderId: string, trackingNumber: string) {
    logger.info("📨 Отправка уведомления о созданной доставке", {
      orderId,
      trackingNumber,
    })
    await sendTelegramMessage({
      message: `📦 Создано отправление CDEK!\n\nЗаказ: ${orderId}\nТрек-номер: ${trackingNumber}`,
    })
  }

  static async sendShipmentError(orderId: string, error: string) {
    logger.info("📨 Отправка уведомления об ошибке доставки", {
      orderId,
      error,
    })
    await sendTelegramMessage({
      message: `⚠️ Ошибка создания отправления CDEK!\n\nЗаказ: ${orderId}\nОшибка: ${error}`,
    })
  }
}

// Order Service
class OrderService {
  static async create(formData: CreateOrderData): Promise<Order> {
    logger.info("🚀 Начало создания заказа", {
      orderId: formData.orderId,
      formData: {
        name: formData.name,
        email: formData.email,
        city: formData.city,
        quantity: formData.quantity,
        amount: formData.amount,
        shipmentMethod: formData.shipment,
      },
    })

    try {
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

      logger.info("📝 Заказ создан в базе данных", {
        orderId: order.id,
        status: order.status,
        amount: order.amount,
      })

      await NotificationService.sendOrderCreated(order, formData)
      logger.info("✅ Процесс создания заказа успешно завершен", {
        orderId: order.id,
      })
      return order
    } catch (error) {
      logger.error("❌ Ошибка при создании заказа", {
        orderId: formData.orderId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }

  static async updatePaymentStatus(
    orderId: string,
    paymentId: string
  ): Promise<Order> {
    logger.info("💳 Обновление статуса оплаты", { orderId, paymentId })

    try {
      const order = await db.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paymentId,
          updatedAt: new Date(),
        },
      })

      logger.info("✅ Статус оплаты обновлен", {
        orderId,
        status: order.status,
        paymentId: order.paymentId,
      })

      return order
    } catch (error) {
      logger.error("❌ Ошибка при обновлении статуса оплаты", {
        orderId,
        paymentId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }

  static async getRecentOrders(limit = 5) {
    logger.info("📊 Запрос последних заказов", { limit })

    try {
      const orders = await db.order.findMany({
        take: limit,
        orderBy: { createdAt: "desc" },
      })

      logger.info("✅ Получены последние заказы", {
        count: orders.length,
        orderIds: orders.map((o) => o.id),
      })

      return orders
    } catch (error) {
      logger.error("❌ Ошибка при получении последних заказов", {
        limit,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }
}

// Shipment Service
class ShipmentService {
  static prepareCdekData(order: Order): any {
    logger.info("📦 Подготовка данных для CDEK", { orderId: order.id })

    const phoneNumber = order.customerPhone.replace(/\D/g, "").slice(-10)
    logger.debug("Обработанный номер телефона", {
      original: order.customerPhone,
      processed: phoneNumber,
    })

    const cdekData = {
      recipient: {
        name: order.customerName,
        phones:
          phoneNumber.length === 10 ? [{ number: "+7" + phoneNumber }] : [], // TODO: было number2 )
      },
      from_location: {
        city: "Москва",
        address: "Колымажный переулок, 10, Москва", // TODO: заменить на необходимое
      },
      to_location: {
        city: order.city,
        address: "улица имени Калинина, 189, Краснодар", // TODO: заменить на необходимое
      },
      tariff_code: 136,
      packages: [
        {
          number: order.id,
          weight: PRODUCT_WEIGHT_GRAMS,
          items: [
            {
              name: PRODUCT_NAME,
              ware_key: PRODUCT_SKU,
              cost: Math.max(order.amount / 100, 1),
              weight: PRODUCT_WEIGHT_GRAMS,
              amount: Math.max(order.quantity, 1),
              payment: {
                value: 13500, // TODO: заменить на необходимое
              },
            },
          ],
        },
      ],
    }

    logger.debug("Подготовленные данные для CDEK", cdekData)
    return cdekData
  }

  static async createShipment(order: Order) {
    logger.info("🚚 Начало создания отправления CDEK", { orderId: order.id })

    try {
      const cdekOrderData = this.prepareCdekData(order)
      logger.debug(
        "Данные для API CDEK:",
        JSON.stringify(cdekOrderData, null, 2)
      )

      const result = await registerCdekOrder(cdekOrderData)
      logger.debug("Ответ от API CDEK:", result)

      if (!result.success) {
        logger.error("❌ Ошибка от API CDEK", {
          orderId: order.id,
          error: result.error,
        })
        await NotificationService.sendShipmentError(order.id, result.error)
        throw new Error(`Failed to create CDEK shipment: ${result.error}`)
      }

      const updatedOrder = await db.order.update({
        where: { id: order.id },
        data: {
          cdekOrderId: result.order.order_id,
          status: "SHIPPING",
        },
      })

      logger.info("✅ Отправление CDEK успешно создано", {
        orderId: order.id,
        cdekOrderId: result.order.order_id,
      })

      await NotificationService.sendShipmentCreated(
        order.id,
        result.order.order_id
      )

      return result.order
    } catch (error) {
      logger.error("❌ Ошибка при создании отправления", {
        orderId: order.id,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }
}

// Main handlers
export async function createOrder(formData: CreateOrderData) {
  logger.info("➡️ Вход в обработчик createOrder", { orderId: formData.orderId })
  try {
    const order = await OrderService.create(formData)
    logger.info("⬅️ Выход из обработчика createOrder", {
      orderId: order.id,
      status: "success",
    })
    return order
  } catch (error) {
    logger.error("⬅️ Выход из обработчика createOrder с ошибкой", {
      orderId: formData.orderId,
      error: error instanceof Error ? error.message : "Unknown error",
    })
    throw error
  }
}

export async function handlePaymentNotification(data: unknown) {
  logger.info("➡️ Вход в обработчик платежного уведомления", { data })

  try {
    const notification = orderNotificationSchema.parse(data)
    logger.info("✅ Уведомление прошло валидацию", {
      orderId: notification.OrderId,
      status: notification.Status,
    })

    if (notification.Status !== "CONFIRMED") {
      logger.info("⏭️ Пропуск обработки: статус не CONFIRMED", {
        status: notification.Status,
      })
      return
    }

    const existingOrder = await db.order.findUnique({
      where: { id: notification.OrderId },
    })

    if (!existingOrder) {
      logger.error("❌ Заказ не найден", { orderId: notification.OrderId })
      await NotificationService.sendOrderNotFound(notification.OrderId)
      return
    }

    logger.info("📝 Заказ найден, обновление статуса", {
      orderId: existingOrder.id,
    })

    const updatedOrder = await OrderService.updatePaymentStatus(
      existingOrder.id,
      notification.PaymentId
    )

    logger.info("🚚 Создание отправления", { orderId: updatedOrder.id })
    await ShipmentService.createShipment(updatedOrder)

    logger.info("⬅️ Выход из обработчика платежного уведомления", {
      orderId: notification.OrderId,
      status: "success",
    })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка"
    logger.error("❌ Ошибка в обработчике платежного уведомления", {
      error: errorMessage,
      data,
    })
    throw error
  }
}
