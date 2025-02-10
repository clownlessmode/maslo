"use server"

import { RussianPostData } from "./orders"
import { sendTelegramMessage } from "./telegram"

const AUTH_KEY = process.env.MAIL_RUSSIA_AUTHORIZATION
const X_USER_KEY = process.env.MAIL_RUSSIA_X_USER_KEY

export async function postOrder(data: RussianPostData) {
  const json = JSON.stringify([data])
  sendTelegramMessage({ message: `${json}` })

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
    sendTelegramMessage({ message: `${JSON.stringify(response)}` })

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
