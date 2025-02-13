"use server"

import { promises as fs } from "fs"
import path from "path"

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

// In-memory storage
const promoUsageMemory = new Map<string, number>()

// File storage configuration
const PROMO_FILE_PATH = path.join(process.cwd(), "data", "promo-usage.json")
const MAX_PROMO_USES = 3
const promoDiscounts = new Map([["BUTTER25", 0.25]])

// Функция для чтения данных из файла
async function readPromoUsageFromFile(): Promise<Map<string, number>> {
  try {
    const data = await fs.readFile(PROMO_FILE_PATH, "utf-8")
    const jsonData = JSON.parse(data)
    return new Map(Object.entries(jsonData))
  } catch (error) {
    console.warn("Could not read promo file:", error)
    return new Map()
  }
}

// Функция для сохранения данных в файл
async function savePromoUsageToFile(
  promoUsage: Map<string, number>
): Promise<boolean> {
  try {
    await fs.mkdir(path.dirname(PROMO_FILE_PATH), { recursive: true })
    const jsonData = Object.fromEntries(Array.from(promoUsage.entries()))
    await fs.writeFile(PROMO_FILE_PATH, JSON.stringify(jsonData, null, 2))
    return true
  } catch (error) {
    console.error("Error saving promo usage to file:", error)
    return false
  }
}

// Функция для получения количества использований промокода
async function getPromoUsageCount(promocode: string): Promise<number> {
  try {
    // Пробуем получить данные из обоих источников
    const memoryCount = promoUsageMemory.get(promocode) || 0
    const fileData = await readPromoUsageFromFile()
    const fileCount = fileData.get(promocode) || 0

    // Берем максимальное значение из двух источников для надежности
    return Math.max(memoryCount, fileCount)
  } catch (error) {
    // В случае ошибки возвращаем значение из памяти
    return promoUsageMemory.get(promocode) || 0
  }
}

// Функция для увеличения счетчика использований
async function incrementPromoUsage(promocode: string): Promise<void> {
  const currentUses = await getPromoUsageCount(promocode)
  const newCount = currentUses + 1

  // Обновляем оба хранилища независимо
  promoUsageMemory.set(promocode, newCount)

  // Если сохранение в файл не удалось, просто логируем ошибку
  const fileSaved = await savePromoUsageToFile(
    new Map(Array.from(promoUsageMemory.entries()))
  )
  if (!fileSaved) {
    console.warn(
      "Failed to save promo usage to file, but memory storage is updated"
    )
  }
}

export async function calculatePrice(
  quantity: number,
  deliveryType: string,
  promocode: string | undefined
) {
  try {
    const validatedQuantity = quantitySchema.parse(quantity)
    let shipment = 0
    if (deliveryType !== "selfpickup") {
      shipment = deliveryType === "pochta" ? 200 : 500
    }
    const baseTotal = productDetails.basePrice * validatedQuantity + shipment

    let finalTotal = baseTotal
    if (promocode && promoDiscounts.has(promocode)) {
      const currentUses = await getPromoUsageCount(promocode)

      if (currentUses >= MAX_PROMO_USES) {
        return {
          success: false,
          error: "Promo code limit exceeded",
          total: baseTotal,
          quantity: validatedQuantity,
        }
      }

      const discount = promoDiscounts.get(promocode)!
      finalTotal = baseTotal * (1 - discount)

      // Увеличиваем счетчик использований
      await incrementPromoUsage(promocode)
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

// Получение оставшихся использований промокода
export async function getRemainingPromoUses(
  promocode: string
): Promise<number> {
  if (!promoDiscounts.has(promocode)) return 0
  const used = await getPromoUsageCount(promocode)
  return Math.max(0, MAX_PROMO_USES - used)
}

// Сброс использований промокодов
export async function resetPromoUsage(): Promise<void> {
  promoUsageMemory.clear()
  await savePromoUsageToFile(new Map())
}

// Функция для объединения массивов без дубликатов
function uniqueArray(arr1: string[], arr2: string[]): string[] {
  const uniqueMap: { [key: string]: boolean } = {}
  arr1.forEach((item) => (uniqueMap[item] = true))
  arr2.forEach((item) => (uniqueMap[item] = true))
  return Object.keys(uniqueMap)
}

// Функция для синхронизации хранилищ
export async function syncStorages(): Promise<void> {
  try {
    const fileData = await readPromoUsageFromFile()

    // Для каждого промокода берем максимальное значение из двух хранилищ
    const syncedData = new Map<string, number>()
    const memoryKeys = Array.from(promoUsageMemory.keys())
    const fileKeys = Array.from(fileData.keys())
    const allPromoCodes = uniqueArray(memoryKeys, fileKeys)

    allPromoCodes.forEach((code) => {
      const memoryCount = promoUsageMemory.get(code) || 0
      const fileCount = fileData.get(code) || 0
      const maxCount = Math.max(memoryCount, fileCount)
      syncedData.set(code, maxCount)
    })

    // Обновляем оба хранилища
    promoUsageMemory.clear()
    Array.from(syncedData.entries()).forEach(([code, count]) => {
      promoUsageMemory.set(code, count)
    })

    await savePromoUsageToFile(syncedData)
  } catch (error) {
    console.error("Error during storage synchronization:", error)
  }
}
