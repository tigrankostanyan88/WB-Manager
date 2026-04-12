'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Quote,
  Undo,
  Redo
} from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  minHeight?: number
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Start typing...',
  className,
  minHeight = 150
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Update editor content when value changes (e.g., from API)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false)
    }
  }, [editor, value])

  if (!editor) {
    return null
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive, 
    icon: Icon, 
    label 
  }: { 
    onClick: () => void
    isActive: boolean
    icon: React.ElementType
    label: string
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "h-8 w-8 p-0",
        isActive && "bg-slate-200"
      )}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )

  return (
    <div className={cn("border rounded-lg overflow-hidden bg-white", className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-slate-50">
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            icon={Bold}
            label="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            icon={Italic}
            label="Italic"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            icon={Underline}
            label="Underline"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            icon={Strikethrough}
            label="Strikethrough"
          />
        </div>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon={List}
            label="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon={ListOrdered}
            label="Numbered List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            icon={Quote}
            label="Quote"
          />
        </div>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            isActive={false}
            icon={Undo}
            label="Undo"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            isActive={false}
            icon={Redo}
            label="Redo"
          />
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="p-4 [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[150px] [&_.ProseMirror]:text-sm [&_.ProseMirror]:leading-relaxed [&_.ProseMirror_p]:my-2 [&_.ProseMirror_ul]:my-2 [&_.ProseMirror_ol]:my-2 [&_.ProseMirror_blockquote]:my-2 [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-slate-300 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_ul]:pl-4 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ol]:pl-4 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_p.is-editor-empty]:before:text-slate-400 [&_.ProseMirror_p.is-editor-empty]:before:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty]:before:float-left [&_.ProseMirror_p.is-editor-empty]:before:h-0 [&_.ProseMirror_p.is-editor-empty]:before:pointer-events-none"
        style={{ minHeight: `${minHeight}px` }}
      />
    </div>
  )
}
