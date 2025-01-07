import { z } from "zod"
import { calculatePrice } from "@/lib/checkout"
import { generateToken } from "@/helpers/token"

const paymentDataSchema = z.object({
  Email: z.string().email(),
  Phone: z.string(),
  Quantity: z.number().min(1).max(5),
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
  try {
    // Validate input data
    const validatedData = paymentDataSchema.parse(data)
    const orderId = generateOrderId(data)
    // Recalculate price server-side to prevent manipulation
    const priceResult = await calculatePrice(validatedData.Quantity)
    if (!priceResult.success) throw new Error("Invalid price calculation")

    // Use environment variables for sensitive data
    const terminalKey = process.env.TBANK_TERMINAL_KEY
    const password = process.env.TBANK_PASSWORD

    if (!terminalKey || !password) {
      throw new Error("Missing payment provider credentials")
    }

    const token = await generateToken({
      TerminalKey: terminalKey,
      Amount: 1359000,
      OrderId: orderId,
      Description: `Пуховик x1`,
      Password: password,
    })

    const response = await fetch("https://securepay.tinkoff.ru/v2/Init", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        TerminalKey: terminalKey,
        Amount: 1359000,
        OrderId: orderId,
        Description: `Пуховик x1`,
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
              Price: 1359000, // Price per item
              Quantity: 1,
              Amount: 1359000,
              Tax: "vat10",
            },
          ],
        },
      }),
    })

    const responseData = (await response.json()) as TBankResponse

    if (!responseData.Success) {
      // Log error securely without exposing sensitive data
      console.error("Payment provider error:", {
        errorCode: responseData.ErrorCode,
        orderId: orderId,
        timestamp: new Date().toISOString(),
      })
      return { success: false as const, error: "Payment initialization failed" }
    }

    return {
      success: true as const,
      url: responseData.PaymentURL,
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
