import { z } from "zod"
import { calculatePrice } from "@/lib/checkout"
import { generateToken } from "@/helpers/token"
import { sendTelegramMessage } from "@/lib/telegram"

const paymentDataSchema = z.object({
  Email: z.string().email(),
  Phone: z.string(),
  Quantity: z.number().min(1).max(5),
  promocode: z.string().optional(),
})

interface TBankResponse {
  Success: boolean
  PaymentURL?: string
  ErrorCode?: string
}

function generateOrderId(data: z.infer<typeof paymentDataSchema>): string {
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).slice(2, 6)
  const emailPrefix = data.Email.split("@")[0].slice(0, 4)

  return `${emailPrefix}-${timestamp}-${randomSuffix}`
}

export async function createTBankSession(
  data: z.infer<typeof paymentDataSchema>
) {
  console.log("💳 Создание платежной сессии...", {
    email: data.Email,
    quantity: data.Quantity,
  })

  try {
    const validatedData = paymentDataSchema.parse(data)
    const orderId = generateOrderId(data)

    // Recalculate price server-side to prevent manipulation
    console.log("💰 Расчет стоимости заказа...")
    const priceResult = await calculatePrice(
      validatedData.Quantity,
      validatedData.promocode
    )
    if (!priceResult.success || !priceResult.total || !priceResult.quantity) {
      throw new Error("Invalid price calculation")
    }

    const amount = priceResult.total * 100 // Теперь TypeScript уверен, что total существует
    const quantity = priceResult.quantity

    const terminalKey = process.env.TBANK_TERMINAL_KEY
    const password = process.env.TBANK_PASSWORD

    if (!terminalKey || !password) {
      throw new Error("Missing payment provider credentials")
    }

    console.log("🔑 Генерация токена для оплаты...")
    const token = await generateToken({
      TerminalKey: terminalKey,
      Amount: amount,
      OrderId: orderId,
      Description: `Пуховик x${quantity}`,
      Password: password,
    })

    console.log("🌐 Отправка запроса в платежный шлюз...")
    const response = await fetch("https://securepay.tinkoff.ru/v2/Init", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        TerminalKey: terminalKey,
        Amount: amount,
        OrderId: orderId,
        Description: `Пуховик x${quantity}`,
        Token: token,
        DATA: {
          Email: data.Email,
        },
        Receipt: {
          Taxation: "osn",
          Email: data.Email,
          Items: [
            {
              Name: "Пуховик",
              Price: amount / quantity, // Цена за единицу
              Quantity: quantity,
              Amount: amount,
              Tax: "vat10",
            },
          ],
        },
      }),
    })

    const responseData = (await response.json()) as TBankResponse

    if (!responseData.Success) {
      console.error("❌ Ошибка платежного шлюза:", responseData.ErrorCode)
      await sendTelegramMessage({
        message: `⚠️ Ошибка создания платежа!\n\nEmail: ${data.Email}\nОшибка: ${responseData.ErrorCode}`,
      })
      return { success: false as const, error: "Payment initialization failed" }
    }

    console.log("✅ Платежная сессия создана успешно")
    await sendTelegramMessage({
      message: `💳 Создана платежная сессия!\n\nEmail: ${data.Email}\nСумма: ${
        amount / 100
      } руб.`,
    })

    return {
      success: true as const,
      url: responseData.PaymentURL,
      orderId: orderId,
    }
  } catch (error) {
    // Log error securely
    console.error("Payment session creation error:", {
      timestamp: new Date().toISOString(),
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    })

    return {
      success: false as const,
      error: "Unable to process payment request",
    }
  }
}
