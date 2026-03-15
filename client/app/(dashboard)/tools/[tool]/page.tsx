import { notFound } from 'next/navigation'
import { TOOLS } from '@/config/tools'
import { Chat } from './_components/ui' // moved here

export default function ToolPage({ params }: { params: { tool: string } }) {
  const tool = TOOLS.find(t => t.id === params.tool)
  if (!tool) return notFound()
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold flex items-center gap-2">{tool.icon} {tool.name}</h1>
      <p className="text-slate-600 mt-1">{tool.description}</p>
      <div className="mt-6">
        <Chat toolId={tool.id} systemPrompt={tool.defaultSystemPrompt} />
      </div>
    </div>
  )
}
