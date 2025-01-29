"use server"
import { Order, Prisma, ShipmentMethod } from "@prisma/client"
import { registerCdekOrder } from "@/lib/cdek"
import { z } from "zod"
import formSchema from "@/app/checkout/schema"
import { db } from "@/db"
import { sendTelegramMessage } from "@/lib/telegram"

const orderNotificationSchema = z.object({
  OrderId: z.string(),
  Status: z.string(),
  PaymentId: z.string(),
  Amount: z.number(),
})

const prisma = db

export async function createOrder(
  formData: z.infer<typeof formSchema> & { quantity: number; amount: number }
) {
  console.log("🚀 Создание нового заказа...", {
    name: formData.name,
    email: formData.email,
    shipmentMethod: formData.shipment,
  })

  const order = await prisma.order.create({
    data: {
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
    console.log("✅ Оплата подтверждена для заказа:", notification.OrderId)

    const order = await prisma.order.update({
      where: { paymentId: notification.PaymentId },
      data: {
        status: "PAID",
        updatedAt: new Date(),
      },
    })

    await sendTelegramMessage({
      message: `💳 Получена оплата!\n\nЗаказ: ${notification.OrderId}\nСумма: ${
        notification.Amount / 100
      } руб.`,
    })

    if (order.shipmentMethod === "CDEK") {
      console.log("📦 Создание отправления CDEK...")
      await createCdekShipment(order)
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
