'use client'

import { motion } from 'framer-motion'
import { Plus, Smile, TrendingUp, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CommentItem {
  id: string
  course: string
  rating: number
  date: string
  likes: number
  text: string
  [key: string]: unknown
}

interface CommentsTabProps {
  userComments: CommentItem[]
}

export default function CommentsTab({ userComments }: CommentsTabProps) {
  return (
    <motion.div
      key="comments"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between px-2">
        <h3 className="text-4xl font-black text-slate-900 tracking-tight">Իմ մեկնաբանությունները</h3>
        <div className="flex items-center gap-3 text-sm font-black text-slate-500 bg-white px-6 py-3 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-50">
          <Smile className="w-5 h-5 text-violet-600" />
          <span>{userComments.length} ՄԵԿՆԱԲԱՆՈՒԹՅՈՒՆ</span>
        </div>
      </div>

      {userComments.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {userComments.map((comment) => (
            <Card key={comment.id} className="shadow-xl shadow-slate-200/30 rounded-2xl bg-white overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-slate-100/50">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-black text-violet-600 uppercase tracking-widest">{comment.course}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Trophy key={i} className={cn('w-4 h-4', i < comment.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200')} />
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-slate-400">{comment.date}</p>
                    <div className="flex items-center gap-1.5 justify-end mt-1">
                      <TrendingUp className="w-3 h-3 text-emerald-500" />
                      <span className="text-[10px] font-black text-emerald-500">{comment.likes} հավանում</span>
                    </div>
                  </div>
                </div>
                <p className="text-base font-medium text-slate-600 leading-relaxed italic border-l-4 border-violet-100 pl-6 py-2">&quot;{comment.text}&quot;</p>
                <div className="mt-8 pt-6 border-t border-slate-50 flex justify-end gap-3">
                  <Button className="bg-slate-50 hover:bg-slate-100 text-slate-500 text-[11px] font-black rounded-xl h-10 px-6 transition-all">Խմբագրել</Button>
                  <Button className="bg-red-50 hover:bg-red-100 text-red-500 text-[11px] font-black rounded-xl h-10 px-6 transition-all">Ջնջել</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl p-10 border border-dashed border-slate-200 text-center space-y-4 group hover:border-violet-300 transition-colors">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mx-auto group-hover:scale-110 transition-transform">
          <Plus className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <p className="text-slate-900 font-black tracking-tight">Թողնել նոր մեկնաբանություն</p>
          <p className="text-slate-400 text-xs font-medium">Կիսվեք ձեր կարծիքով դասընթացների մասին</p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-12 px-8 font-black text-xs shadow-lg shadow-violet-200">Ավելացնել</Button>
      </div>
    </motion.div>
  )
}
