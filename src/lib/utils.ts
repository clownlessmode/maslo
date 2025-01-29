import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateOrderId(email: string): string {
  const emailPrefix = email.split("@")[0].slice(0, 4)
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).slice(2, 4)
  return `${emailPrefix}-${timestamp}-${randomSuffix}`
}
