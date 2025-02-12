"use server"

export interface RussianPostData {
  "address-type-to": string
  "given-name": string
  "house-to": string
  "index-to": number
  "mail-category": string
  "mail-direct": number
  "mail-type": string
  mass: number
  "middle-name": string
  "order-num": string
  "place-to": string
  "region-to": string
  "street-to": string
  surname: string
  "tel-address": string
  "transport-type": string
  "postoffice-code": number
}

import { Order, ShipmentMethod } from "@prisma/client"
import { z } from "zod"
import { db } from "@/db"
import { calculateDeliveryPrice, registerCdekOrder } from "@/lib/cdek"
import { sendTelegramMessage } from "@/lib/telegram"
import formSchema from "@/app/checkout/schema"
import { postOrder } from "./rus"

// Types and Schemas
type CreateOrderData = z.infer<typeof formSchema> & {
  quantity: number
  amount: number
  orderId: string
}

const orderNotificationSchema = z.object({
  OrderId: z.string(),
  Status: z.string(),
  PaymentId: z.string(),
  Amount: z.number(),
})

// Constants
const CONSTANTS = {
  PRODUCT: {
    WEIGHT_GRAMS: 1540,
    SKU: "jacket-001",
    NAME: "Пуховик",
  },
  SHIPPING: {
    DEFAULT_PVZ_CODE: "LSG6",
    CDEK_TARIFF_CODE: 136,
  },
}

// Logger Service
class LoggerService {
  private static async logToTelegram(
    level: string,
    message: string,
    data?: any
  ) {
    const timestamp = new Date().toISOString()
    const formattedData = data ? `\n${JSON.stringify(data, null, 2)}` : ""
    await sendTelegramMessage({
      message: `[${level}][${timestamp}] ${message}${formattedData}`,
    })
  }

  static async info(message: string, data?: any) {
    console.log(`[INFO] ${message}`, data)
    await this.logToTelegram("INFO", message, data)
  }

  static async error(message: string, data?: any) {
    console.error(`[ERROR] ${message}`, data)
    await this.logToTelegram("ERROR", message, data)
  }

  static async debug(message: string, data?: any) {
    console.log(`[DEBUG] ${message}`, data)
    await this.logToTelegram("DEBUG", message, data)
  }
}

// Notification Service
class NotificationService {
  static async sendShipmentError(orderId: string, error: any) {
    await LoggerService.error("Ошибка создания отправления!", {
      orderId,
      error: error instanceof Error ? error.message : error,
    })
  }
}

// Russian Post Service
class RussianPostService {
  static async createShipment(order: Order) {
    try {
      const result = await postOrder(order)

      await db.order.update({
        where: { id: order.id },
        data: { status: "SHIPPING" },
      })

      return result
    } catch (error) {
      await LoggerService.error(
        "Ошибка при создании отправления Почты России",
        {
          orderId: order.id,
          error,
        }
      )
      throw error
    }
  }
}

// CDEK Service
class CDEKService {
  static async createShipment(order: Order) {
    try {
      const cdekData = await this.prepareCdekData(order)

      const result = await registerCdekOrder(cdekData)

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

      return result.order
    } catch (error) {
      await LoggerService.error("Ошибка при создании отправления CDEK", {
        orderId: order.id,
        error,
      })
      throw error
    }
  }

  private static async prepareCdekData(order: Order) {
    const phoneNumber = order.customerPhone.replace(/\D/g, "").slice(-10)
    const deliveryPrice = await calculateDeliveryPrice(Number(order.city))

    return {
      recipient: {
        name: order.customerName,
        phones: [{ number: "+7" + phoneNumber }],
      },
      shipment_point: CONSTANTS.SHIPPING.DEFAULT_PVZ_CODE,
      delivery_point: order.pickupOffice,
      tariff_code: CONSTANTS.SHIPPING.CDEK_TARIFF_CODE,
      packages: [
        {
          number: order.id,
          weight: CONSTANTS.PRODUCT.WEIGHT_GRAMS,
          items: [
            {
              name: CONSTANTS.PRODUCT.NAME,
              ware_key: CONSTANTS.PRODUCT.SKU,
              cost: Math.max(order.amount / 100, 1),
              weight: CONSTANTS.PRODUCT.WEIGHT_GRAMS,
              amount: Math.max(order.quantity, 1),
              payment: {
                value: deliveryPrice,
              },
            },
          ],
          items4: [],
        },
      ],
    }
  }
}

// Order Service
class OrderService {
  static async create(formData: CreateOrderData): Promise<Order> {
    try {
      const order = await db.order.create({
        data: {
          street: formData.street || "",
          apartment: formData.apartment || "",
          house: formData.house || "",
          index: formData.postalCode || "",
          oblast: formData.oblast || "",
          postalCode: formData.postalCode || "",
          promocode: formData.promocode || "",
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

      return order
    } catch (error) {
      await LoggerService.error("Ошибка при создании заказа", {
        orderId: formData.orderId,
        error,
      })
      throw error
    }
  }

  static async updatePaymentStatus(
    orderId: string,
    paymentId: string
  ): Promise<Order> {
    try {
      const order = await db.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paymentId,
          updatedAt: new Date(),
        },
      })

      return order
    } catch (error) {
      await LoggerService.error("Ошибка при обновлении статуса оплаты", {
        orderId,
        paymentId,
        error,
      })
      throw error
    }
  }
}

class ShippingFactory {
  static async createShipment(order: Order) {
    switch (order.shipmentMethod) {
      case ShipmentMethod.SELFPICKUP:
        await LoggerService.info("Заказ на самовывоз", { order })
        return

      case ShipmentMethod.CDEK:
        return await CDEKService.createShipment(order)

      case ShipmentMethod.POCHTA:
        return await RussianPostService.createShipment(order)

      default:
        throw new Error(`Unsupported shipping method: ${order.shipmentMethod}`)
    }
  }
}

// Main handlers
export async function createOrder(formData: CreateOrderData) {
  try {
    const order = await OrderService.create(formData)
    return order
  } catch (error) {
    await LoggerService.error("Ошибка в обработчике createOrder", {
      orderId: formData.orderId,
      error,
    })
    throw error
  }
}

export async function handlePaymentNotification(data: unknown) {
  try {
    const notification = orderNotificationSchema.parse(data)

    if (notification.Status !== "CONFIRMED") {
      return
    }

    const existingOrder = await db.order.findUnique({
      where: { id: notification.OrderId },
    })

    if (!existingOrder) {
      return
    }

    const updatedOrder = await OrderService.updatePaymentStatus(
      existingOrder.id,
      notification.PaymentId
    )

    return await ShippingFactory.createShipment(updatedOrder)
  } catch (error) {
    throw error
  }
}
