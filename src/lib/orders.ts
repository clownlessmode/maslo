// "use server"

// import { Order, ShipmentMethod } from "@prisma/client"
// import { z } from "zod"
// import { db } from "@/db"
// import { calculateDeliveryPrice, registerCdekOrder } from "@/lib/cdek"
// import { sendTelegramMessage } from "@/lib/telegram"
// import formSchema from "@/app/checkout/schema"
// import { postOrder } from "./rus"

// // Types
// type CreateOrderData = z.infer<typeof formSchema> & {
//   quantity: number
//   amount: number
//   orderId: string
// }

// // Schemas
// const orderNotificationSchema = z.object({
//   OrderId: z.string(),
//   Status: z.string(),
//   PaymentId: z.string(),
//   Amount: z.number(),
// })

// // Constants
// const PRODUCT_WEIGHT_GRAMS = 1540
// const PRODUCT_SKU = "jacket-001"
// const PRODUCT_NAME = "Пуховик"

// // Logger
// const logger = {
//   info: (message: string, ...args: any[]) => {
//     const timestamp = new Date().toISOString()
//     console.log(`[INFO][${timestamp}] ${message}`, ...args)
//   },
//   error: (message: string, ...args: any[]) => {
//     const timestamp = new Date().toISOString()
//     console.error(`[ERROR][${timestamp}] ${message}`, ...args)
//   },
//   debug: (message: string, ...args: any[]) => {
//     const timestamp = new Date().toISOString()
//     console.log(`[DEBUG][${timestamp}] ${message}`, ...args)
//   },
// }

// // Notification Service
// class NotificationService {
//   static async sendOrderCreated(order: Order, formData: CreateOrderData) {
//     logger.info("📨 Отправка уведомления о новом заказе", { orderId: order.id })

//     const message = `
// 🛍 Новый заказ создан!

// ID: ${order.id}
// Имя: ${formData.name}
// Email: ${formData.email}
// Телефон: ${formData.phone}
// Город: ${formData.city}
// Количество: ${formData.quantity}
// Сумма: ${formData.amount / 100} руб.
//     `.trim()

//     logger.debug("Содержание уведомления:", message)

//     try {
//       await sendTelegramMessage({ message })
//       logger.info("✅ Уведомление успешно отправлено", { orderId: order.id })
//     } catch (error) {
//       logger.error("❌ Ошибка при отправке уведомления", {
//         orderId: order.id,
//         error,
//       })
//       throw error
//     }
//   }

//   static async sendOrderNotFound(orderId: string) {
//     logger.info("📨 Отправка уведомления о ненайденном заказе", { orderId })
//     await sendTelegramMessage({
//       message: `❌ Заказ не найден в базе данных!\nID: ${orderId}`,
//     })
//   }

//   static async sendShipmentCreated(
//     orderId: string,
//     trackingNumber: string,
//     result: any
//   ) {
//     logger.info("📨 Отправка уведомления о созданной доставке", {
//       orderId,
//       trackingNumber,
//     })
//     await sendTelegramMessage({
//       message: `📦 Создано отправление CDEK!`,
//     })
//   }

//   static async sendShipmentError(orderId: string, error: string) {
//     logger.info("📨 Отправка уведомления об ошибке доставки", {
//       orderId,
//       error,
//     })
//     await sendTelegramMessage({
//       message: `⚠️ Ошибка создания отправления CDEK!\n\nЗаказ: ${orderId}\nОшибка: ${error}`,
//     })
//   }
// }

// // Order Service
// class OrderService {
//   static async create(formData: CreateOrderData): Promise<Order> {
//     logger.info("🚀 Начало создания заказа", {
//       orderId: formData.orderId,
//       formData: {
//         name: formData.name,
//         email: formData.email,
//         city: formData.city,
//         quantity: formData.quantity,
//         amount: formData.amount,
//         shipmentMethod: formData.shipment,
//       },
//     })

//     try {
//       const order = await db.order.create({
//         data: {
//           id: formData.orderId,
//           customerName: formData.name,
//           customerEmail: formData.email,
//           customerPhone: formData.phone,
//           city: formData.city,
//           shipmentMethod: formData.shipment.toUpperCase() as ShipmentMethod,
//           pickupOffice: formData.pickup_office,
//           amount: formData.amount,
//           quantity: formData.quantity,
//         },
//       })

//       logger.info("📝 Заказ создан в базе данных", {
//         orderId: order.id,
//         status: order.status,
//         amount: order.amount,
//       })

//       await NotificationService.sendOrderCreated(order, formData)
//       logger.info("✅ Процесс создания заказа успешно завершен", {
//         orderId: order.id,
//       })
//       return order
//     } catch (error) {
//       logger.error("❌ Ошибка при создании заказа", {
//         orderId: formData.orderId,
//         error: error instanceof Error ? error.message : "Unknown error",
//       })
//       throw error
//     }
//   }

//   static async updatePaymentStatus(
//     orderId: string,
//     paymentId: string
//   ): Promise<Order> {
//     logger.info("💳 Обновление статуса оплаты", { orderId, paymentId })

//     try {
//       const order = await db.order.update({
//         where: { id: orderId },
//         data: {
//           status: "PAID",
//           paymentId,
//           updatedAt: new Date(),
//         },
//       })

//       logger.info("✅ Статус оплаты обновлен", {
//         orderId,
//         status: order.status,
//         paymentId: order.paymentId,
//       })

//       return order
//     } catch (error) {
//       logger.error("❌ Ошибка при обновлении статуса оплаты", {
//         orderId,
//         paymentId,
//         error: error instanceof Error ? error.message : "Unknown error",
//       })
//       throw error
//     }
//   }

//   static async getRecentOrders(limit = 5) {
//     logger.info("📊 Запрос последних заказов", { limit })

//     try {
//       const orders = await db.order.findMany({
//         take: limit,
//         orderBy: { createdAt: "desc" },
//       })

//       logger.info("✅ Получены последние заказы", {
//         count: orders.length,
//         orderIds: orders.map((o) => o.id),
//       })

//       return orders
//     } catch (error) {
//       logger.error("❌ Ошибка при получении последних заказов", {
//         limit,
//         error: error instanceof Error ? error.message : "Unknown error",
//       })
//       throw error
//     }
//   }
// }

// // Shipment Service
// class ShipmentService {
//   static async preparePostData(order: Order) {
//     logger.info("📦 Подготовка данных для Почты России", {
//       orderId: order.id,
//     })

//     const phoneNumber = order.customerPhone.replace(/\D/g, "")
//     const [firstName, lastName = ""] = order.customerName.split(" ")

//     logger.debug("Обработанный номер телефона", {
//       original: order.customerPhone,
//       processed: phoneNumber,
//     })

//     const postData: RussianPostData = {
//       "address-type-to": "DEFAULT",
//       "given-name": firstName,
//       "house-to": "123", // Требуется уточнение адреса
//       "index-to": 650066, // Требуется уточнение индекса
//       "mail-category": "ORDINARY",
//       "mail-direct": 643,
//       "mail-type": "POSTAL_PARCEL",
//       mass: PRODUCT_WEIGHT_GRAMS,
//       "middle-name": "", // Требуется уточнение отчества
//       "order-num": order.id,
//       "place-to": order.city,
//       "postoffice-code": 140007,
//       "region-to": "Кемеровская область", // Требуется определение региона по городу
//       "street-to": "Волгоградская", // Требуется уточнение улицы
//       surname: lastName,
//       "tel-address": phoneNumber,
//       "transport-type": "SURFACE",
//     }

//     logger.debug("Подготовленные данные для Почты России", postData)
//     return postData
//   }

//   static async prepareCdekData(order: Order) {
//     logger.info("📦 Подготовка данных для CDEK", { orderId: order.id })

//     const phoneNumber = order.customerPhone.replace(/\D/g, "").slice(-10)
//     logger.debug("Обработанный номер телефона", {
//       original: order.customerPhone,
//       processed: phoneNumber,
//     })

//     const deliveryPrice = await calculateDeliveryPrice(Number(order.city))

//     const fromPvzCode = "LSG6"
//     const cdekData = {
//       recipient: {
//         name: order.customerName,
//         phones: [{ number: "+7" + phoneNumber }],
//       },
//       shipment_point: fromPvzCode,
//       delivery_point: order.pickupOffice,
//       tariff_code: 136,
//       packages: [
//         {
//           number: order.id,
//           weight: PRODUCT_WEIGHT_GRAMS,
//           items: [
//             {
//               name: PRODUCT_NAME,
//               ware_key: PRODUCT_SKU,
//               cost: Math.max(order.amount / 100, 1),
//               weight: PRODUCT_WEIGHT_GRAMS,
//               amount: Math.max(order.quantity, 1),
//               payment: {
//                 value: deliveryPrice,
//               },
//             },
//           ],
//           items4: [],
//         },
//       ],
//     }

//     logger.debug("Подготовленные данные для CDEK", cdekData)
//     return cdekData
//   }

//   static async createShipmentСDEK(order: Order) {
//     logger.info("🚚 Создание отправления", {
//       orderId: order.id,
//       method: order.shipmentMethod,
//     })

//     try {
//       const cdekOrderData = await this.prepareCdekData(order)
//       logger.debug(
//         "Данные для API CDEK:",
//         JSON.stringify(cdekOrderData, null, 2)
//       )

//       const result = await registerCdekOrder(cdekOrderData)

//       console.log("Ответ от API CDEK:", result)
//       logger.info("🚚 Ответ от API CDEK:", result)

//       if (!result.success) {
//         logger.error("❌ Ошибка от API CDEK", {
//           orderId: order.id,
//           error: result.error,
//         })
//         await NotificationService.sendShipmentError(order.id, result.error)
//         throw new Error(`Failed to create CDEK shipment: ${result.error}`)
//       }

//       await db.order.update({
//         where: { id: order.id },
//         data: {
//           cdekOrderId: result.order.order_id,
//           status: "SHIPPING",
//         },
//       })

//       logger.info("✅ Отправление CDEK успешно создано", {
//         orderId: order.id,
//         cdekOrderId: result.order.order_id,
//       })

//       await NotificationService.sendShipmentCreated(
//         order.id,
//         result.order.order_id,
//         result
//       )

//       return result.order
//     } catch (error) {
//       logger.error("❌ Ошибка при создании отправления", {
//         orderId: order.id,
//         error: error instanceof Error ? error.message : "Unknown error",
//       })
//       throw error
//     }
//   }
// }

// // Main handlers
// export async function createOrder(formData: CreateOrderData) {
//   logger.info("➡️ Вход в обработчик createOrder", { orderId: formData.orderId })
//   try {
//     const order = await OrderService.create(formData)
//     logger.info("⬅️ Выход из обработчика createOrder", {
//       orderId: order.id,
//       status: "success",
//     })
//     return order
//   } catch (error) {
//     logger.error("⬅️ Выход из обработчика createOrder с ошибкой", {
//       orderId: formData.orderId,
//       error: error instanceof Error ? error.message : "Unknown error",
//     })
//     throw error
//   }
// }

// export async function handlePaymentNotification(data: unknown) {
//   logger.info("➡️ Вход в обработчик платежного уведомления", { data })

//   try {
//     const notification = orderNotificationSchema.parse(data)
//     logger.info("✅ Уведомление прошло валидацию", {
//       orderId: notification.OrderId,
//       status: notification.Status,
//     })

//     if (notification.Status !== "CONFIRMED") {
//       logger.info("⏭️ Пропуск обработки: статус не CONFIRMED", {
//         status: notification.Status,
//       })
//       return
//     }

//     const existingOrder = await db.order.findUnique({
//       where: { id: notification.OrderId },
//     })

//     if (!existingOrder) {
//       logger.error("❌ Заказ не найден", { orderId: notification.OrderId })
//       await NotificationService.sendOrderNotFound(notification.OrderId)
//       return
//     }

//     logger.info("📝 Заказ найден, обновление статуса", {
//       orderId: existingOrder.id,
//     })

//     const updatedOrder = await OrderService.updatePaymentStatus(
//       existingOrder.id,
//       notification.PaymentId
//     )

//     logger.info("🚚 Создание отправления", {
//       orderId: updatedOrder.id,
//       method: updatedOrder.shipmentMethod,
//     })
//     try {
//       switch (updatedOrder.shipmentMethod) {
//         case ShipmentMethod.SELFPICKUP:
//           return await sendTelegramMessage({
//             message: `САМОВЫВОЗ: ${JSON.stringify(updatedOrder)}`,
//           })

//         case ShipmentMethod.CDEK:
//           return await ShipmentService.createShipmentСDEK(updatedOrder)

//         case ShipmentMethod.POCHTA:
//           const postData = await ShipmentService.preparePostData(updatedOrder)

//           const result = await postOrder(postData)

//           await db.order.update({
//             where: { id: updatedOrder.id },
//             data: {
//               status: "SHIPPING",
//             },
//           })

//           return result

//         default:
//           throw new Error(
//             `Unsupported shipping method: ${updatedOrder.shipmentMethod}`
//           )
//       }
//     } catch (error) {
//       logger.error("❌ Ошибка создания отправления", {
//         orderId: updatedOrder.id,
//         method: updatedOrder.shipmentMethod,
//         error: error instanceof Error ? error.message : "Unknown error",
//       })
//       throw error
//     }
//   } catch (error) {
//     const errorMessage =
//       error instanceof Error ? error.message : "Неизвестная ошибка"
//     logger.error("❌ Ошибка в обработчике платежного уведомления", {
//       error: errorMessage,
//       data,
//     })
//     throw error
//   }
// }

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

;("use server")

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
  static async sendOrderCreated(order: Order, formData: CreateOrderData) {
    await LoggerService.info("Новый заказ создан!", {
      orderId: order.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      quantity: formData.quantity,
      amount: formData.amount / 100,
    })
  }

  static async sendOrderNotFound(orderId: string) {
    await LoggerService.error("Заказ не найден в базе данных!", { orderId })
  }

  static async sendShipmentCreated(
    orderId: string,
    trackingNumber: string,
    result: any
  ) {
    await LoggerService.info("Создано отправление!", {
      orderId,
      trackingNumber,
      shippingDetails: result,
    })
  }

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
    await LoggerService.info("Создание отправления Почты России", {
      orderId: order.id,
    })

    try {
      const postData = await this.preparePostData(order)
      await LoggerService.debug(
        "Подготовленные данные для Почты России",
        postData
      )

      const result = await postOrder(postData)
      await LoggerService.info("Ответ от API Почты России", result)

      await db.order.update({
        where: { id: order.id },
        data: { status: "SHIPPING" },
      })

      await NotificationService.sendShipmentCreated(
        order.id,
        result.trackingNumber,
        result
      )
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

  private static async preparePostData(order: Order): Promise<RussianPostData> {
    const phoneNumber = order.customerPhone.replace(/\D/g, "")
    const [firstName, lastName = ""] = order.customerName.split(" ")

    return {
      "address-type-to": "DEFAULT",
      "given-name": firstName,
      "house-to": "123",
      "index-to": 650066,
      "mail-category": "ORDINARY",
      "mail-direct": 643,
      "mail-type": "POSTAL_PARCEL",
      mass: CONSTANTS.PRODUCT.WEIGHT_GRAMS,
      "middle-name": "",
      "order-num": order.id,
      "place-to": order.city,
      "postoffice-code": 140007,
      "region-to": "Кемеровская область",
      "street-to": "Волгоградская",
      surname: lastName,
      "tel-address": phoneNumber,
      "transport-type": "SURFACE",
    }
  }
}

// CDEK Service
class CDEKService {
  static async createShipment(order: Order) {
    await LoggerService.info("Создание отправления CDEK", { orderId: order.id })

    try {
      const cdekData = await this.prepareCdekData(order)
      await LoggerService.debug("Подготовленные данные для CDEK", cdekData)

      const result = await registerCdekOrder(cdekData)
      await LoggerService.info("Ответ от API CDEK", result)

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
        result.order.order_id,
        result
      )

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
    await LoggerService.info("Начало создания заказа", {
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

      await NotificationService.sendOrderCreated(order, formData)
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
    await LoggerService.info("Обновление статуса оплаты", {
      orderId,
      paymentId,
    })

    try {
      const order = await db.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          paymentId,
          updatedAt: new Date(),
        },
      })

      await LoggerService.info("Статус оплаты обновлен", {
        orderId,
        status: order.status,
        paymentId: order.paymentId,
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

// Shipping Factory
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
  await LoggerService.info("Вход в обработчик createOrder", {
    orderId: formData.orderId,
  })

  try {
    const order = await OrderService.create(formData)
    await LoggerService.info("Заказ успешно создан", { orderId: order.id })
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
  await LoggerService.info("Получено платежное уведомление", { data })

  try {
    const notification = orderNotificationSchema.parse(data)

    if (notification.Status !== "CONFIRMED") {
      await LoggerService.info("Пропуск обработки: статус не CONFIRMED", {
        status: notification.Status,
      })
      return
    }

    const existingOrder = await db.order.findUnique({
      where: { id: notification.OrderId },
    })

    if (!existingOrder) {
      await NotificationService.sendOrderNotFound(notification.OrderId)
      return
    }

    const updatedOrder = await OrderService.updatePaymentStatus(
      existingOrder.id,
      notification.PaymentId
    )

    return await ShippingFactory.createShipment(updatedOrder)
  } catch (error) {
    await LoggerService.error("Ошибка в обработчике платежного уведомления", {
      error,
      data,
    })
    throw error
  }
}
