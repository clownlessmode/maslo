import { handlePaymentNotification } from "@/lib/orders"
import { NextResponse } from "next/server"
import { sendTelegramMessage } from "@/lib/telegram"
import { z } from "zod"

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
})

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const validatedData = paymentNotificationSchema.safeParse(data)

    if (!validatedData.success) {
      console.error("Invalid notification data:", validatedData.error)
      return new NextResponse("Invalid notification data", { status: 400 })
    }

    // Process confirmed payments
    if (validatedData.data.Status === "CONFIRMED") {
      await handlePaymentNotification(validatedData.data)
    }

    // Log notification for debugging
    await sendTelegramMessage({
      message: `Payment ${validatedData.data.Status}: Order ${validatedData.data.OrderId}`,
    })

    // Return OK in uppercase as required by the payment system
    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("Payment notification error:", error)
    return new NextResponse("Error processing notification", { status: 500 })
  }
}
