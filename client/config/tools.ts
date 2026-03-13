export type ToolId = 'writer' | 'coder' | 'repurposer'

export type Tool = {
  id: ToolId
  name: string
  description: string
  icon: string
  defaultSystemPrompt: string
}

export const TOOLS: Tool[] = [
  {
    id: 'writer',
    name: 'AI Writer',
    description: 'Long-form writing, blogs, emails, social posts',
    icon: '📝',
    defaultSystemPrompt:
      'You are a helpful writing assistant who produces concise, useful, and engaging content.'
  },
  {
    id: 'coder',
    name: 'Code Assistant',
    description: 'Explain, refactor, and generate code with care',
    icon: '💻',
    defaultSystemPrompt:
      'You are a meticulous senior engineer. Explain reasoning succinctly and write correct code.'
  },
  {
    id: 'repurposer',
    name: 'Content Repurposer',
    description: 'Turn long-form into multi-platform social formats',
    icon: '✨',
    defaultSystemPrompt:
      'You are a content repurposing assistant that outputs structured, platform-specific formats.'
  }
] satisfies Tool[]
