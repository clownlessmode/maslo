"use server"

import { RussianPostData } from "./orders"
import { sendTelegramMessage } from "./telegram"

const AUTH_KEY = process.env.MAIL_RUSSIA_AUTHORIZATION
const X_USER_KEY = process.env.MAIL_RUSSIA_X_USER_KEY

// Add timeout wrapper for fetch
const fetchWithTimeout = async (
  resource: string,
  options: RequestInit & { timeout?: number } = {}
) => {
  const { timeout = 30000, ...fetchOptions } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(resource, {
      ...fetchOptions,
      signal: controller.signal,
    })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

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

      // Add more detailed error handling and timeout
      const response = await fetchWithTimeout(
        "https://otpravka-api.pochta.ru/1.0/user/backlog",
        {
          method: "PUT",
          headers,
          body: json,
          timeout: 30000, // 30 second timeout
        }
      )

      await sendTelegramMessage({
        message: `Fetch completed, status: ${response.status}`,
      })

      const responseText = await response.text()

      // Log response headers for debugging
      const responseHeaders = Object.fromEntries(response.headers.entries())
      await sendTelegramMessage({
        message: `Response headers: ${JSON.stringify(responseHeaders)}`,
      })

      await sendTelegramMessage({
        message: `Response body: ${responseText}`,
      })

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}, response: ${responseText}`
        )
      }

      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        await sendTelegramMessage({
          message: `Failed to parse response as JSON: ${responseText}`,
        })
        throw parseError
      }

      await sendTelegramMessage({
        message: `Success result: ${JSON.stringify(result)}`,
      })
      return result
    } catch (fetchError) {
      await sendTelegramMessage({
        message: "Request timed out after 30 seconds",
      })

      await sendTelegramMessage({
        message: `Fetch error: ${
          fetchError instanceof Error
            ? `${fetchError.name}: ${fetchError.message}`
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
