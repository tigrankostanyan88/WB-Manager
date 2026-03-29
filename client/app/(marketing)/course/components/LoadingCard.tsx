export function LoadingCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-full">
      <div className="h-48 bg-slate-200 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-slate-200 rounded animate-pulse" />
        <div className="h-3 bg-slate-200 rounded animate-pulse w-5/6" />
        <div className="pt-4 border-t border-slate-100 flex justify-between">
          <div className="h-6 bg-slate-200 rounded animate-pulse w-20" />
          <div className="h-8 bg-slate-200 rounded animate-pulse w-24" />
        </div>
      </div>
    </div>
  )
}
