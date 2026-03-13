import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyTelegramWebhook } from '@/lib/telegram'

export async function POST(req: Request) {
  try {
    // Verify webhook secret
    const secretToken = req.headers.get('X-Telegram-Bot-Api-Secret-Token')
    
    if (!verifyTelegramWebhook(secretToken)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    // Handle callback queries (inline keyboard button clicks)
    if (body.callback_query) {
      const { callback_query: { data, from } } = body
      
      if (data.startsWith('reply:')) {
        const messageId = data.split(':')[1]
        
        // Send prompt to admin to reply
        await sendTelegramPrompt(from.id, `Reply to message ${messageId}. Use format: /reply ${messageId} your message`)
        return NextResponse.json({ success: true })
      }
      
      if (data.startsWith('profile:')) {
        const userId = data.split(':')[1]
        
        const user = await prisma.user.findUnique({
          where: { id: userId },
        })

        if (user) {
          const profileText = `👤 <b>User Profile</b>\n\n` +
            `📧 Email: ${user.email}\n` +
            `🆔 ID: <code>${user.id}</code>\n` +
            `💳 Plan: ${user.plan}\n` +
            `🪙 Credits: ${user.credits}\n` +
            `📅 Joined: ${user.createdAt.toLocaleDateString()}`
          
          await sendTelegramMessageToAdmin(from.id, profileText)
        }
        
        return NextResponse.json({ success: true })
      }
    }

    // Handle messages (including replies)
    if (body.message) {
      const { message, message: { reply_to_message, text, from } } = body

      // If admin replies to a message in Telegram
      if (reply_to_message && text) {
        const originalMessageId = reply_to_message.message_id

        // Find the message in our database by telegram message ID
        const chatMessage = await prisma.chatMessage.findFirst({
          where: {
            telegramMessageId: originalMessageId.toString(),
          },
          include: {
            session: {
              include: {
                user: true,
              },
            },
          },
        })

        if (chatMessage) {
          // Save admin reply
          await prisma.chatMessage.create({
            data: {
              sessionId: chatMessage.sessionId,
              content: text,
              senderType: 'ADMIN',
            },
          })

          // Update session
          await prisma.chatSession.update({
            where: { id: chatMessage.sessionId },
            data: { updatedAt: new Date() },
          })

          return NextResponse.json({ success: true })
        }
      }

      // Handle /reply command
      if (text && text.startsWith('/reply')) {
        const parts = text.split(' ')
        if (parts.length >= 3) {
          const messageId = parts[1]
          const replyText = parts.slice(2).join(' ')

          // Find the chat session by message ID
          const chatMessage = await prisma.chatMessage.findUnique({
            where: { id: messageId },
            include: { session: { include: { user: true } } },
          })

          if (chatMessage && chatMessage.session) {
            await prisma.chatMessage.create({
              data: {
                sessionId: chatMessage.sessionId,
                content: replyText,
                senderType: 'ADMIN',
              },
            })

            await prisma.chatSession.update({
              where: { id: chatMessage.sessionId },
              data: { updatedAt: new Date() },
            })

            await sendTelegramConfirmation(from.id, `Reply sent to user ${chatMessage.session.user.email}`)
            return NextResponse.json({ success: true })
          }
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in Telegram webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function sendTelegramConfirmation(chatId: number, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) return

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`
  
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  })
}

async function sendTelegramPrompt(chatId: number, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) return

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`
  
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  })
}

async function sendTelegramMessageToAdmin(chatId: number, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  if (!botToken) return

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`
  
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  })
}
