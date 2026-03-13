import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

interface WhatYouLearnProps {
  learn: string[]
}

export default function WhatYouLearn({ learn }: WhatYouLearnProps) {
  return (
    <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-2xl font-black text-slate-900 mb-6">Ինչ կսովորես</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learn.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-slate-900 mt-0.5 shrink-0" />
              <span className="text-slate-700 text-sm font-medium leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

