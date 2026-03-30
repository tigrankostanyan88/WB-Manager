const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID

if (!TELEGRAM_BOT_TOKEN && process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.warn('TELEGRAM_BOT_TOKEN is not set')
}

if (!TELEGRAM_ADMIN_CHAT_ID && process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line no-console
  console.warn('TELEGRAM_ADMIN_CHAT_ID is not set')
}

export interface SendTelegramOptions {
  inlineKeyboard?: Array<Array<{ text: string; callback_data: string }>>
  replyToMessageId?: number
}

export async function sendTelegramMessage(
  text: string,
  userId: string,
  messageId: string,
  options: SendTelegramOptions = {}
): Promise<{ messageId: number; success: boolean }> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_CHAT_ID) {
    throw new Error('Telegram configuration is missing')
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

  const inlineKeyboard = options.inlineKeyboard || [
    [
      {
        text: '✏️ Reply',
        callback_data: `reply:${userId}:${messageId}`,
      },
    ],
    [
      {
        text: '👤 View Profile',
        callback_data: `profile:${userId}`,
      },
    ],
  ]

  const body: Record<string, unknown> = {
    chat_id: TELEGRAM_ADMIN_CHAT_ID,
    text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  }

  if (options.replyToMessageId) {
    body.reply_to_message_id = options.replyToMessageId
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Telegram API error: ${error}`)
  }

  const data = await response.json()

  if (!data.ok) {
    throw new Error(`Telegram API error: ${data.description}`)
  }

  return {
    messageId: data.result.message_id,
    success: true,
  }
}

export async function setTelegramWebhook(webhookUrl: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN is not set')
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ['message', 'callback_query'],
      secret_token: process.env.TELEGRAM_WEBHOOK_SECRET,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to set webhook: ${error}`)
  }

  const data = await response.json()

  if (!data.ok) {
    throw new Error(`Failed to set webhook: ${data.description}`)
  }
}

export function verifyTelegramWebhook(secretToken: string | null): boolean {
  if (!secretToken) return false
  const expectedToken = process.env.TELEGRAM_WEBHOOK_SECRET
  return secretToken === expectedToken
}
