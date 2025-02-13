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

// Создаем Map для хранения количества использований промокодов
const promoUsageCount = new Map<string, number>()
const MAX_PROMO_USES = 3

const promoDiscounts = new Map([["BUTTER25", 0.25]])

export async function calculatePrice(
  quantity: number,
  deliveryType: string,
  promocode: string | undefined
) {
  try {
    const validatedQuantity = quantitySchema.parse(quantity)
    let shipment = 0
    if (deliveryType !== "selfpickup") {
      shipment = deliveryType === "pochta" ? 0 : 0
    }
    const baseTotal = productDetails.basePrice * validatedQuantity + shipment

    // Проверяем промокод и его количество использований
    let finalTotal = baseTotal
    if (promocode && promoDiscounts.has(promocode)) {
      // Получаем текущее количество использований
      const currentUses = promoUsageCount.get(promocode) || 0

      // Проверяем, не превышен ли лимит использований
      if (currentUses >= MAX_PROMO_USES) {
        return {
          success: false,
          error: "Promo code limit exceeded",
          total: baseTotal,
          quantity: validatedQuantity,
        }
      }

      // Применяем скидку и увеличиваем счетчик использований
      const discount = promoDiscounts.get(promocode)!
      finalTotal = baseTotal * (1 - discount)
      promoUsageCount.set(promocode, currentUses + 1)
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

// Вспомогательная функция для проверки оставшихся использований промокода
export async function getRemainingPromoUses(promocode: string) {
  if (!promoDiscounts.has(promocode)) return 0
  const used = promoUsageCount.get(promocode) || 0
  return Math.max(0, MAX_PROMO_USES - used)
}
