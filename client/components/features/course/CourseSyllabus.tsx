import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { FileText, Play } from 'lucide-react'

export interface ModuleItem {
  title: string
  type: 'video' | 'file'
  time: string
}

export interface Module {
  title: string
  lectures: number
  duration: string
  items: ModuleItem[]
}

interface CourseSyllabusProps {
  syllabus: Module[]
}

export function CourseSyllabus({ syllabus }: CourseSyllabusProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-slate-900">Դասընթացի բովանդակությունը</h2>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600 mb-4">
        <span className="font-bold text-slate-900">{syllabus.length} բաժին</span>
        <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline-block"></span>
        <span className="font-bold text-slate-900">{syllabus.reduce((acc, curr) => acc + curr.lectures, 0)} դասախոսություն</span>
        <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline-block"></span>
        <span>6 ժամ 10 րոպե ընդհանուր տևողություն</span>
      </div>

      <Accordion type="single" collapsible className="space-y-3 w-full">
        {syllabus.map((module, i) => (
          <AccordionItem key={i} value={`module-${i}`} className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
            <AccordionTrigger className="px-6 py-4 hover:bg-slate-50 hover:no-underline transition-colors">
              <div className="flex items-center gap-4 text-left w-full">
                <span className="font-black text-slate-900 text-lg flex-1">{module.title}</span>
                <span className="text-xs font-medium text-slate-500 hidden sm:block shrink-0">
                  {module.lectures} դաս • {module.duration}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-slate-50/50 border-t border-slate-100">
              {module.items.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                  {module.items.map((item, idx) => (
                    <li key={idx} className="px-6 py-3 flex items-center justify-between hover:bg-slate-100/50 transition-colors">
                      <div className="flex items-center gap-3">
                        {item.type === 'video' ? (
                          <Play className="w-4 h-4 text-slate-400 fill-current" />
                        ) : (
                          <FileText className="w-4 h-4 text-slate-400" />
                        )}
                        <span className="text-sm text-slate-700 font-medium">{item.title}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{item.time}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-6 py-4 text-sm text-slate-500 italic">
                  Վիդեո դասեր չկան
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
