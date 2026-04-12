'use client'

import { FormEvent, useEffect, useState } from 'react'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function Chat({ toolId, systemPrompt }: { toolId: string, systemPrompt: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Reset chat when tool changes
  useEffect(() => {
    setMessages([])
    setInput('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolId]) // Intentionally only resetting on toolId change, not systemPrompt

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: input.trim()
    }

    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai/stream', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          toolId,
          systemPrompt,
          messages: nextMessages.map(m => ({ role: m.role, content: m.content }))
        })
      })

      if (!res.ok) {
        setMessages(prev => [
          ...prev,
          {
            id: `${Date.now()}-error`,
            role: 'assistant',
            content: 'Error while generating response.'
          }
        ])
        return
      }

      const data = (await res.json()) as { content?: string }
      const content = data.content || ''
      if (content) {
        const assistantMessage: ChatMessage = {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content
        }
        setMessages(prev => [...prev, assistantMessage])
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="space-y-3 max-h-[50vh] overflow-auto">
        {messages.map(m => (
          <div key={m.id} className={m.role === 'user' ? 'text-slate-800' : 'text-slate-700'}>
            <div className="text-xs uppercase tracking-wide text-slate-500">{m.role}</div>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
        {isLoading ? <div className="text-slate-500 text-sm">Generating…</div> : null}
      </div>
      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded px-3 py-2"
          placeholder="Type your prompt…"
        />
        <button type="submit" disabled={isLoading} className="px-4 py-2 rounded bg-black text-white">
          Send
        </button>
      </form>
    </div>
  )
}
