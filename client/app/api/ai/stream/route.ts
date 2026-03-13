import { auth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import { OpenAI } from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'
import { aiRatelimit } from '@/lib/rate-limit'
import { prisma } from '@/lib/db'
import { canUseCredits, decrementCredit } from '@/lib/credits'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return new Response('Unauthorized', { status: 401 })

  const { success } = await aiRatelimit.limit(`ai:${userId}`)
  if (!success) return new Response('Rate limit exceeded', { status: 429 })

  const body = (await req.json()) as {
    messages: { role: 'user' | 'assistant' | 'system'; content: string }[]
    toolId: string
    systemPrompt?: string
  }
  const { messages, toolId, systemPrompt } = body

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser) return new Response('User not found', { status: 404 })
  const allowed = await canUseCredits(dbUser.id)
  if (!allowed) return new Response('Insufficient credits', { status: 402 })

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const sys = systemPrompt || 'You are a helpful AI assistant.'
  const finalMessages: ChatCompletionMessageParam[] = [
    { role: 'system', content: sys },
    ...messages.map(m => ({ role: m.role, content: m.content }))
  ]

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: finalMessages
  })

  const content = completion.choices[0]?.message?.content || ''

  await decrementCredit(dbUser.id)
  await prisma.generation.create({
    data: {
      userId: dbUser.id,
      toolId,
      prompt: JSON.stringify(messages),
      output: content,
      tokens: Math.max(1, Math.floor(content.length / 4))
    }
  })

  return new Response(JSON.stringify({ content }), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  })
}
