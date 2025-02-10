"use server"

import { RussianPostData } from "./orders"
import { sendTelegramMessage } from "./telegram"

const AUTH_KEY = process.env.MAIL_RUSSIA_AUTHORIZATION
const X_USER_KEY = process.env.MAIL_RUSSIA_X_USER_KEY

export async function postOrder(data: RussianPostData) {
  const json = JSON.stringify([data])

  try {
    await sendTelegramMessage({
      message: `Starting request with JSON: ${json}`,
    })

    // Проверка токенов
    if (!AUTH_KEY || !X_USER_KEY) {
      throw new Error("Authorization tokens are missing")
    }

    const headers = {
      Authorization: `AccessToken ${AUTH_KEY}`,
      "X-User-Authorization": `Basic ${X_USER_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json;charset=UTF-8",
      "Content-Length": json.length.toString(),
    }

    await sendTelegramMessage({
      message: `Headers prepared: ${JSON.stringify(headers)}`,
    })

    const response = await fetch(
      "https://otpravka-api.pochta.ru/1.0/user/backlog",
      {
        method: "PUT",
        headers,
        body: json,
      }
    )

    const responseText = await response.text()
    await sendTelegramMessage({
      message: `Response status: ${response.status}, body: ${responseText}`,
    })

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}, response: ${responseText}`
      )
    }

    const result = JSON.parse(responseText)
    await sendTelegramMessage({
      message: `Success result: ${JSON.stringify(result)}`,
    })
    return result
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : "Unknown error occurred"

    await sendTelegramMessage({ message: `ERROR: ${errorMessage}` })
    console.error("Error details:", error)
    throw error
  }
}
