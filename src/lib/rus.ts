"use server"

import { Order } from "@prisma/client"
import { RussianPostData } from "./orders"
import { sendTelegramMessage } from "./telegram"
import axios from "axios"

const AUTH_KEY = process.env.MAIL_RUSSIA_AUTHORIZATION
const X_USER_KEY = process.env.MAIL_RUSSIA_X_USER_KEY
function splitFullName(fullName: string) {
  const nameParts = fullName.split(" ")

  return {
    surname: nameParts[0], // Фамилия
    givenName: nameParts[1], // Имя
    middleName: nameParts[2], // Отчество
  }
}
export async function postOrder(order: Order) {
  const { surname, givenName, middleName } = splitFullName(order.customerName)

  try {
    await sendTelegramMessage({
      message: `🚀 Начинаем отправку заказа!\n📦 Данные: ${order}`,
    })

    const headers = {
      Authorization: `AccessToken ${AUTH_KEY}`,
      "X-User-Authorization": `Basic ${X_USER_KEY}`,
    }

    await sendTelegramMessage({
      message: `🛠 Заголовки подготовлены:\n🔑 ${JSON.stringify(headers)}`,
    })

    try {
      await sendTelegramMessage({
        message: "⏳ Выполняем запрос к API Почты России...",
      })

      const response = await axios.put(
        "https://otpravka-api.pochta.ru/1.0/user/backlog",
        [
          {
            "address-type-to": "DEFAULT",
            "given-name": givenName,
            "house-to": order.house,
            "index-to": order.index,
            "mail-category": "ORDINARY",
            "mail-direct": 643,
            "mail-type": "POSTAL_PARCEL",
            mass: 1540,
            "middle-name": middleName,
            "order-num": order.id,
            "place-to": order.city,
            "postoffice-code": 140007,
            "region-to": order.oblast,
            "street-to": order.street,
            surname: surname,
            "tel-address": order.customerPhone.replace(/\D/g, "").slice(-10),
            "transport-type": "SURFACE",
          },
        ],
        { headers }
      )

      await sendTelegramMessage({
        message: `✅ Запрос выполнен!\n📡 Статус ответа: ${response.status}`,
      })

      const responseText = await response.data

      await sendTelegramMessage({
        message: `📥 Ответ сервера:\n${JSON.stringify(responseText, null, 2)}`,
      })

      if (!response.status.toString().startsWith("2")) {
        throw new Error(
          `🚨 Ошибка HTTP!\n❌ Статус: ${response.status}\n🔄 Ответ: ${responseText}`
        )
      }

      let result
      try {
        result = JSON.parse(JSON.stringify(responseText))
      } catch (parseError) {
        await sendTelegramMessage({
          message: `⚠️ Ошибка парсинга JSON:\n${responseText}`,
        })
        throw parseError
      }

      await sendTelegramMessage({
        message: `🎉 Успех! Полученный результат:\n${JSON.stringify(
          result,
          null,
          2
        )}`,
      })

      return result
    } catch (fetchError) {
      await sendTelegramMessage({
        message: "⏳ Тайм-аут: запрос выполнялся более 30 секунд! ❌",
      })

      await sendTelegramMessage({
        message: `⚠️ Ошибка запроса: ${
          fetchError instanceof Error
            ? `${fetchError.name}: ${fetchError.message}`
            : "Неизвестная ошибка запроса"
        }`,
      })
      throw fetchError
    }
  } catch (error) {
    await sendTelegramMessage({
      message: `🔥 Общая ошибка:\n${
        error instanceof Error ? error.message : "Неизвестная ошибка"
      }`,
    })
    throw error
  }
}
