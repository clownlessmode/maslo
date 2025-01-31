import { Order } from "@prisma/client"
import { getCdekToken } from "./cdek"
import { db } from "@/db"

// Constants
const PRODUCT_WEIGHT_GRAMS = 1540
const PRODUCT_SKU = "jacket-001"
const PRODUCT_NAME = "Пуховик"

// Define NotificationService interface
interface NotificationService {
  sendShipmentError: (orderId: string, error: string) => Promise<void>
  sendShipmentCreated: (orderId: string, shipmentId: string) => Promise<void>
}

// Type definitions for CDEK API
interface CdekOrderData {
  type: number
  tariff_code: number
  number: string
  delivery_point?: string | null
  to_location?: {
    city: string
  }
  recipient: {
    name: string
    phones: Array<{
      number2: string
    }>
    email: string
  }
  packages: Array<{
    number: string
    weight: number
    items: Array<{
      name: string
      ware_key: string
      payment: {
        value: number
      }
      cost: number
      weight: number
      amount: number
    }>
  }>
}

interface CdekApiResponse {
  entity?: {
    uuid: string
    [key: string]: any
  }
}

// Logger with context
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

export function prepareCdekOrderData(order: Order): CdekOrderData {
  logger.info("📦 Подготовка данных для отправки в CDEK API", {
    orderId: order.id,
    city: order.city,
  })

  const phoneNumber = order.customerPhone.replace(/\D/g, "").slice(-10)
  logger.debug("Обработанный номер телефона", {
    original: order.customerPhone,
    processed: phoneNumber,
  })

  // Prepare base order data
  const orderData: CdekOrderData = {
    type: 1, // Договор "интернет-магазин"
    tariff_code: 136,
    number: order.id,
    delivery_point: order.pickupOffice,

    recipient: {
      name: order.customerName,
      phones: [
        {
          number2:
            phoneNumber.length === 10
              ? `+7${phoneNumber}`
              : order.customerPhone,
        },
      ],
      email: order.customerEmail,
    },

    packages: [
      {
        number: "1",
        weight: PRODUCT_WEIGHT_GRAMS,
        items: [
          {
            name: PRODUCT_NAME,
            ware_key: PRODUCT_SKU,
            payment: {
              value: order.amount / 100, // Конвертируем копейки в рубли
            },
            cost: order.amount / 100,
            weight: PRODUCT_WEIGHT_GRAMS,
            amount: order.quantity,
          },
        ],
      },
    ],
  }

  // If we have city name but no delivery_point, use to_location
  if (!order.pickupOffice && order.city) {
    delete orderData.delivery_point
    orderData.to_location = {
      city: order.city,
    }
  }

  logger.debug(
    "Подготовленные данные для CDEK:",
    JSON.stringify(orderData, null, 2)
  )

  return orderData
}

export async function registerCdekOrder(
  data: CdekOrderData
): Promise<
  | { success: true; order: CdekApiResponse["entity"] }
  | { success: false; error: string }
> {
  logger.info("🚀 Отправка заказа в CDEK API")

  try {
    const token = await getCdekToken()
    logger.debug("Получен токен CDEK")

    const isProduction = process.env.NODE_ENV === "production"
    const url = isProduction
      ? "https://api.cdek.ru/v2/orders"
      : "https://api.edu.cdek.ru/v2/orders"

    logger.debug("Отправка запроса в CDEK", {
      url,
      data: JSON.stringify(data, null, 2),
    })

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    const responseData: CdekApiResponse = await response.json()
    logger.debug("Получен ответ от CDEK:", responseData)

    if (!response.ok) {
      logger.error("❌ Ошибка от API CDEK", {
        status: response.status,
        error: responseData,
      })
      return {
        success: false,
        error: `Failed to create CDEK order: ${JSON.stringify(responseData)}`,
      }
    }

    logger.info("✅ Заказ успешно создан в CDEK", {
      orderId: responseData.entity?.uuid,
    })

    return {
      success: true,
      order: responseData.entity,
    }
  } catch (error) {
    logger.error("❌ Ошибка при регистрации заказа в CDEK", {
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return {
      success: false,
      error: "Failed to process CDEK order registration",
    }
  }
}

export class ShipmentService {
  private static notificationService: NotificationService

  static initialize(notificationService: NotificationService) {
    this.notificationService = notificationService
  }

  static async createShipment(order: Order) {
    logger.info("🚚 Начало создания отправления CDEK", { orderId: order.id })

    try {
      const cdekOrderData = prepareCdekOrderData(order)
      const result = await registerCdekOrder(cdekOrderData)

      if (!result.success) {
        await this.notificationService.sendShipmentError(order.id, result.error)
        throw new Error(result.error)
      }

      const updatedOrder = await db.order.update({
        where: { id: order.id },
        data: {
          cdekOrderId: result.order.uuid,
          status: "SHIPPING",
        },
      })

      logger.info("✅ Отправление CDEK успешно создано", {
        orderId: order.id,
        cdekOrderId: result.order.uuid,
      })

      await this.notificationService.sendShipmentCreated(
        order.id,
        result.order.uuid
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
