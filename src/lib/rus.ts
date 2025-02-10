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

    try {
      await sendTelegramMessage({ message: "Starting fetch..." })
      const response = await fetch(
        "https://otpravka-api.pochta.ru/1.0/user/backlog",
        {
          method: "PUT",
          headers,
          body: json,
        }
      )
      await sendTelegramMessage({
        message: `Fetch completed, status: ${response.status}`,
      })

      const responseText = await response.text()
      await sendTelegramMessage({
        message: `Response body: ${responseText}`,
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
    } catch (fetchError) {
      await sendTelegramMessage({
        message: `Fetch error: ${
          fetchError instanceof Error
            ? fetchError.message
            : "Unknown fetch error"
        }`,
      })
      throw fetchError
    }
  } catch (error) {
    await sendTelegramMessage({
      message: `General error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    })
    throw error
  }
}
