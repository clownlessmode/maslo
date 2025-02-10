"use server"

export interface ProductDetails {
  id: string
  name: string
  description: string
  basePrice: number
  size: string
  maxQuantity: number
}

import { z } from "zod"

const productDetails = {
  id: "warm-butter-jacket",
  basePrice: 13590,
  maxQuantity: 5,
} as const

const quantitySchema = z.number().min(1).max(5)

export async function calculatePrice(
  quantity: number,
  promocode: string | undefined
) {
  const promoDiscounts = new Map([["maslow10", 0.1]])

  try {
    const validatedQuantity = quantitySchema.parse(quantity)
    const baseTotal = productDetails.basePrice * validatedQuantity

    // Проверяем есть ли промокод и применяем скидку
    let finalTotal = baseTotal
    if (promocode && promoDiscounts.has(promocode)) {
      const discount = promoDiscounts.get(promocode)!
      finalTotal = baseTotal * (1 - discount)
    }

    return {
      success: true,
      total: finalTotal,
      quantity: validatedQuantity,
    }
  } catch (error) {
    return {
      success: false,
      error: "Invalid quantity",
    }
  }
}
