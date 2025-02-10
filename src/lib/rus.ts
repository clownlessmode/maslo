// rus.ts
"use server"

import { sendTelegramMessage } from "./telegram"

const AUTH_KEY = process.env.MAIL_RUSSIA_AUTHORIZATION
const X_USER_KEY = process.env.MAIL_RUSSIA_X_USER_KEY

interface OrderData {
  "address-type-to": string
  "given-name": string
  "house-to": string
  "index-to": number
  "mail-category": string
  "mail-direct": number
  "mail-type": string
  mass: number
  "middle-name": string
  "order-num": string
  "place-to": string
  "region-to": string
  "street-to": string
  surname: string
  "tel-address": number
  "transport-type": string
}

export async function postOrder(data: OrderData) {
  const json = JSON.stringify([data])

  try {
    const response = await fetch(
      "https://otpravka-api.pochta.ru/1.0/user/backlog",
      {
        method: "PUT",
        headers: {
          Authorization: `AccessToken ${AUTH_KEY}`,
          "X-User-Authorization": `Basic ${X_USER_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json;charset=UTF-8",
          "Content-Length": json.length.toString(),
        },
        body: json,
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    sendTelegramMessage({ message: `${JSON.stringify(result)}` })
    return result
  } catch (error) {
    console.error("Error:", error)
    throw error
  }
}
