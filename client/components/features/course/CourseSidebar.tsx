'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Award, BookOpen, Check, Clock, FileText, Infinity, Smartphone } from 'lucide-react'

interface CourseSidebarProps {
  price: string
  originalPrice: string
  discount: string
  includes: string[]
  isEnrolled?: boolean
  onConsultationClick?: () => void
}

export function CourseSidebar({ price, originalPrice, discount, includes, isEnrolled = false, onConsultationClick }: CourseSidebarProps) {
  return (
    <div className="lg:w-1/3 relative">
      <div className="sticky top-24 space-y-4">
        <Card className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-6 space-y-5">
            {/* Price Section */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{price}</span>
                {originalPrice && (
                  <span className="text-lg text-slate-400 line-through font-medium">{originalPrice}</span>
                )}
              </div>
              {discount && (
                <span className="inline-block text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {discount}
                </span>
              )}
            </div>

            {/* CTA Button */}
            <div className="space-y-2">
              {isEnrolled ? (
                <Button 
                  disabled 
                  className="w-full h-11 rounded-xl bg-emerald-500 text-white text-sm font-semibold cursor-default"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Ակտիվ
                </Button>
              ) : (
                <Button className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-sm font-semibold shadow-md shadow-violet-200 hover:shadow-lg hover:shadow-violet-200 transition-all">
                  Գրանցվել հիմա
                </Button>
              )}
              <p className="text-center text-xs text-slate-400">30-օրյա գումարի վերադարձի երաշխիք</p>
            </div>

            {/* Includes List */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="font-semibold text-slate-900 text-sm">Դասընթացն ներառում է՝</h4>
              <ul className="space-y-2.5">
                {includes.map((text, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                    <div className="p-1.5 rounded-lg bg-violet-50 text-violet-600 shrink-0 mt-0.5">
                      {idx === 0 ? (
                        <Clock className="w-3.5 h-3.5" />
                      ) : idx === 1 ? (
                        <FileText className="w-3.5 h-3.5" />
                      ) : idx === 2 ? (
                        <Infinity className="w-3.5 h-3.5" />
                      ) : idx === 3 ? (
                        <Smartphone className="w-3.5 h-3.5" />
                      ) : (
                        <Award className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span className="leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Other Courses Card */}
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 text-white text-center space-y-3 shadow-lg shadow-violet-200">
          <div className="w-12 h-12 mx-auto rounded-full bg-white/20 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-bold text-base">Այլ դասընթացներ</h4>
          <p className="text-violet-100 text-xs leading-relaxed">Տես մեր այլ դասընթացները և ընդլայնիր գիտելիքները</p>
          <Button 
            variant="outline" 
            size="sm"
            className="w-full border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white text-xs h-9 font-medium"
            onClick={onConsultationClick}
          >
            Դիտել բոլոր դասընթացները
          </Button>
        </div>
      </div>
    </div>
  )
}

