import { Prisma } from "@prisma/client"
import { registerCdekOrder } from "@/lib/cdek"
import { z } from "zod"

const orderNotificationSchema = z.object({
  OrderId: z.string(),
  Status: z.string(),
  PaymentId: z.string(),
  Amount: z.number(),
})

const prisma = Prisma

export async function createOrder(formData: z.infer<typeof formSchema>) {
  const order = await prisma.order.create({
    data: {
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      city: formData.city,
      shipmentMethod: formData.shipment.toUpperCase(),
      pickupOffice: formData.pickup_office,
      amount: 1359000, // You should calculate this based on quantity
      quantity: 1, // You should get this from form data
    },
  })

  return order
}

export async function handlePaymentNotification(data: unknown) {
  const notification = orderNotificationSchema.parse(data)

  if (notification.Status === "CONFIRMED") {
    const order = await prisma.order.update({
      where: { paymentId: notification.PaymentId },
      data: {
        status: "PAID",
        updatedAt: new Date(),
      },
    })

    if (order.shipmentMethod === "CDEK") {
      await createCdekShipment(order)
    }
  }
}

async function createCdekShipment(order: Order) {
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
    await prisma.order.update({
      where: { id: order.id },
      data: {
        cdekOrderId: result.order.order_id,
        status: "SHIPPING",
      },
    })
  }
}
