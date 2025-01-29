"use server"
import { Order, Prisma, ShipmentMethod } from "@prisma/client"
import { registerCdekOrder } from "@/lib/cdek"
import { z } from "zod"
import formSchema from "@/app/checkout/schema"
import { db } from "@/db"
import { sendTelegramMessage } from "@/lib/telegram"
import { generateOrderId } from "@/lib/utils"

const orderNotificationSchema = z.object({
  OrderId: z.string(),
  Status: z.string(),
  PaymentId: z.string(),
  Amount: z.number(),
})

const prisma = db

export async function createOrder(
  formData: z.infer<typeof formSchema> & {
    quantity: number
    amount: number
  }
) {
  console.log("🚀 Создание нового заказа...", {
    name: formData.name,
    email: formData.email,
    shipmentMethod: formData.shipment,
  })

  const tinkoffOrderId = generateOrderId(formData.email)

  const order = await prisma.order.create({
    data: {
      id: tinkoffOrderId,
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

  await sendTelegramMessage({
    message: `🛍 Новый заказ создан!\n\nИмя: ${formData.name}\nEmail: ${
      formData.email
    }\nТелефон: ${formData.phone}\nГород: ${formData.city}\nКоличество: ${
      formData.quantity
    }\nСумма: ${formData.amount / 100} руб.`,
  })

  console.log("✅ Заказ успешно создан:", order.id)
  return order
}

export async function handlePaymentNotification(data: unknown) {
  console.log("💰 Получено уведомление об оплате:", data)

  const notification = orderNotificationSchema.parse(data)

  if (notification.Status === "CONFIRMED") {
    await sendTelegramMessage({
      message: `
🔍 Поиск заказа...
ID для поиска: ${notification.OrderId}
PaymentId: ${notification.PaymentId}
Сумма: ${notification.Amount / 100} ₽
      `.trim(),
    })

    // Получаем все последние заказы
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    })

    await sendTelegramMessage({
      message: `
📋 Последние заказы в базе:
${recentOrders
  .map(
    (order) => `
- ID: ${order.id}
  Статус: ${order.status}
  Клиент: ${order.customerName}
  Сумма: ${order.amount / 100} ₽
  Создан: ${order.createdAt.toLocaleString("ru-RU")}`
  )
  .join("\n")}
      `.trim(),
    })

    const existingOrder = await prisma.order.findUnique({
      where: { id: notification.OrderId },
    })

    await sendTelegramMessage({
      message: `
${existingOrder ? "✅" : "❌"} Результат поиска заказа:
Искомый ID: ${notification.OrderId}
${
  existingOrder
    ? `Найден заказ:
  - ID: ${existingOrder.id}
  - Статус: ${existingOrder.status}
  - Клиент: ${existingOrder.customerName}
  - Email: ${existingOrder.customerEmail}
  - Сумма: ${existingOrder.amount / 100} ₽`
    : "Заказ не найден в базе данных!"
}
      `.trim(),
    })

    if (!existingOrder) {
      console.error("❌ Заказ не найден в базе данных")
      return
    }

    try {
      const order = await prisma.order.update({
        where: { id: existingOrder.id },
        data: {
          status: "PAID",
          paymentId: notification.PaymentId,
          updatedAt: new Date(),
        },
      })

      await sendTelegramMessage({
        message: `
✅ Заказ успешно обновлён:
ID: ${order.id}
Новый статус: ${order.status}
PaymentId: ${order.paymentId}
        `.trim(),
      })
    } catch (error) {
      await sendTelegramMessage({
        message: `
❌ Ошибка при обновлении заказа:
ID: ${existingOrder.id}
Ошибка: ${error instanceof Error ? error.message : "Неизвестная ошибка"}
        `.trim(),
      })
      throw error
    }
  }
}

async function createCdekShipment(order: Order) {
  console.log("📦 Формирование данных для CDEK...", order.id)

  const cdekOrderData = {
    recipient: {
      name: order.customerName,
      phones: [
        {
          number2: order.customerPhone,
        },
      ],
    },
    to_location: {
      city: order.city,
    },
    packages: [
      {
        number: order.id,
        weight: 1000, // Weight in grams
        items: [
          {
            name: "Пуховик",
            ware_key: "jacket-001",
            cost: order.amount / 100, // Convert from kopeks to rubles
            weight: 1000,
            amount: order.quantity,
          },
        ],
      },
    ],
  }

  const result = await registerCdekOrder(cdekOrderData)

  if (result.success) {
    console.log("✅ Отправление CDEK создано:", result.order.order_id)

    await prisma.order.update({
      where: { id: order.id },
      data: {
        cdekOrderId: result.order.order_id,
        status: "SHIPPING",
      },
    })

    await sendTelegramMessage({
      message: `📦 Создано отправление CDEK!\n\nЗаказ: ${order.id}\nТрек-номер: ${result.order.order_id}`,
    })
  } else {
    console.error("❌ Ошибка создания отправления CDEK:", result.error)

    await sendTelegramMessage({
      message: `⚠️ Ошибка создания отправления CDEK!\n\nЗаказ: ${order.id}\nОшибка: ${result.error}`,
    })
  }
}
