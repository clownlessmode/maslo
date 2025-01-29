interface TelegramMessage {
  message: string
}

async function sendTelegramMessage({ message }: TelegramMessage) {
  const chatId = process.env.CHATID
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

  try {
    const response = await fetch(TELEGRAM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Telegram API Error: ${error.description}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Failed to send Telegram message:", error)
    throw error
  }
}

export { sendTelegramMessage }
