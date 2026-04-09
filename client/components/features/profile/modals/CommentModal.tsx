'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { X, Trophy, TrendingUp, Calendar, BookOpen } from 'lucide-react'

interface CommentItem {
  id: string
  course: string
  rating: number
  date: string
  likes: number
  text: string
}

interface CommentModalProps {
  open: boolean
  comment: CommentItem | null
  onClose: () => void
  onEdit?: (comment: CommentItem) => void
  onDelete?: (commentId: string) => void
}

export function CommentModal({ open, comment, onClose, onEdit, onDelete }: CommentModalProps) {
  if (!comment) return null

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-100 p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-slate-600 text-xs font-medium uppercase tracking-wider">{comment.course}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Trophy
                          key={i}
                          className={`w-4 h-4 ${i < comment.rating ? 'text-slate-600 fill-slate-600' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center transition-colors"
                  aria-label="Փակել"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Comment Text */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Մեկնաբանություն</p>
                <p className="text-base font-medium text-slate-700 leading-relaxed italic border-l-4 border-slate-200 pl-4 py-2">
                  &quot;{comment.text}&quot;
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 py-4 border-y border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">{comment.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-600">{comment.likes} հավանում</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={onClose}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl h-12 font-bold"
                >
                  Փակել
                </Button>
                {onEdit && (
                  <Button
                    onClick={() => onEdit(comment)}
                    className="flex-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl h-12 font-bold"
                  >
                    Խմբագրել
                  </Button>
                )}
                {onDelete && (
                  <Button
                    onClick={() => onDelete(comment.id)}
                    className="flex-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl h-12 font-bold"
                  >
                    Ջնջել
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
