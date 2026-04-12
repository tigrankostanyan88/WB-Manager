'use client'

import type React from 'react'

interface CourseDescriptionProps {
  description?: React.ReactNode
}

export function CourseDescription({ description }: CourseDescriptionProps) {
  if (description) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Նկարագրություն</h2>
        <div className="prose prose-slate max-w-none text-slate-600">{description}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-black text-slate-900">Նկարագրություն</h2>
      <div className="prose prose-slate max-w-none text-slate-600">
        <p>
          Wildberries-ը ԱՊՀ երկրների ամենամեծ մարքեթփլեյսն է, որը հնարավորություն է տալիս հազարավոր վաճառողներին դուրս գալ միջազգային շուկա։ Այս դասընթացը
          ստեղծված է հատուկ նրանց համար, ովքեր ցանկանում են սկսել իրենց բիզնեսը զրոյից կամ մասշտաբավորել գործող վաճառքները։
        </p>
        <p>
          Մենք կանցնենք ամբողջ ճանապարհը՝ ապրանքի ընտրությունից մինչև առաջին վաճառք և հետագա աճ։ Դուք կսովորեք ոչ միայն տեխնիկական մասը, այլև բիզնես
          մտածելակերպը, որը անհրաժեշտ է հաջողության հասնելու համար։
        </p>
        <p className="font-bold text-slate-900">Դասընթացը հարմար է՝</p>
        <ul>
          <li>Սկսնակների համար, ովքեր չունեն փորձ</li>
          <li>Գործող բիզնեսների համար, որոնք ուզում են մտնել օնլայն շուկա</li>
          <li>Մարքեթոլոգների համար, ովքեր ուզում են նոր հմտություններ</li>
        </ul>
      </div>
    </div>
  )
}

