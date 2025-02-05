import { handlePaymentNotification } from "@/lib/orders"
import { NextResponse } from "next/server"
import { sendTelegramMessage } from "@/lib/telegram"
import { z } from "zod"
import { db } from "@/db"

// Validation schema for payment notification
const paymentNotificationSchema = z.object({
  Status: z.enum([
    "AUTHORIZED",
    "CONFIRMED",
    "PARTIAL_REVERSED",
    "REVERSED",
    "CANCELED",
    "PARTIAL_REFUNDED",
    "REFUNDED",
    "REJECTED",
    "DEADLINE_EXPIRED",
  ]),
  OrderId: z.string(),
  PaymentId: z.union([z.string(), z.number()]),
  Amount: z.number(),
  Pan: z.string().optional(),
  ExpDate: z.string().optional(),
  Success: z.boolean().optional(),
  ErrorCode: z.string().optional(),
  TerminalKey: z.string().optional(),
  Token: z.string().optional(),
})

const getStatusEmoji = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "✅"
    case "AUTHORIZED":
      return "🔄"
    case "CANCELED":
      return "❌"
    case "REJECTED":
      return "⛔"
    case "REFUNDED":
      return "💰"
    case "DEADLINE_EXPIRED":
      return "⏰"
    default:
      return "ℹ️"
  }
}

const getStatusMessage = (status: string) => {
  switch (status) {
    case "CONFIRMED":
      return "Оплата успешно получена"
    case "AUTHORIZED":
      return "Платёж авторизован"
    case "CANCELED":
      return "Платёж отменён"
    case "REJECTED":
      return "Платёж отклонён"
    case "REFUNDED":
      return "Платёж возвращён"
    case "DEADLINE_EXPIRED":
      return "Время на оплату истекло"
    default:
      return "Статус платежа изменён"
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("📥 Получены данные уведомления:", data)

    const validatedData = paymentNotificationSchema.safeParse(data)

    if (!validatedData.success) {
      console.error("❌ Ошибка валидации данных:", {
        error: validatedData.error,
        receivedData: data,
      })

      await sendTelegramMessage({
        message: `
⚠️ Ошибка валидации платежного уведомления

❌ Ошибка: ${JSON.stringify(validatedData.error.errors)}
📦 Полученные данные: ${JSON.stringify(data)}
⏱ Время: ${new Date().toLocaleString("ru-RU")}
        `.trim(),
      })

      return new NextResponse("Invalid notification data", { status: 400 })
    }

    const { Status, OrderId, Amount } = validatedData.data

    const emoji = getStatusEmoji(Status)
    const statusMessage = getStatusMessage(Status)

    // Формируем красивое сообщение для Telegram
    const message = `
${emoji} ${statusMessage}

🔖 Заказ: #${OrderId}
💵 Сумма: ${Amount ? (Amount / 100).toLocaleString("ru-RU") + " ₽" : "н/д"}
${
  validatedData.data.Pan
    ? "💳 Карта: " +
      validatedData.data.Pan.replace(/^(\d{6})\d+(\d{4})$/, "$1******$2")
    : ""
}
⏱ Время: ${new Date().toLocaleString("ru-RU")}
    `.trim()

    await sendTelegramMessage({ message })

    // Обрабатываем подтверждённые платежи
    if (Status === "CONFIRMED") {
      console.log("✅ Обработка подтверждённого платежа:", OrderId)
      await andlePaymentNotification({
        ...validatedData.data,
        PaymentId: String(validatedData.data.PaymentId),
      })
    }

    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("❌ Ошибка обработки уведомления:", error)

    await sendTelegramMessage({
      message: `
⚠️ Ошибка обработки платежа

❌ Ошибка: ${error instanceof Error ? error.message : "Неизвестная ошибка"}
⏱ Время: ${new Date().toLocaleString("ru-RU")}
      `.trim(),
    })

    return new NextResponse("Error processing notification", { status: 500 })
  }
}
