export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
        <p className="text-slate-500 font-medium">Բեռնում...</p>
      </div>
    </div>
  )
}
