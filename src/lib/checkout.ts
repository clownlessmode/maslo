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

export async function calculatePrice(quantity: number) {
  try {
    const validatedQuantity = quantitySchema.parse(quantity)
    return {
      success: true,
      total: productDetails.basePrice * validatedQuantity,
      quantity: validatedQuantity,
    }
  } catch (error) {
    return {
      success: false,
      error: "Invalid quantity",
    }
  }
}
