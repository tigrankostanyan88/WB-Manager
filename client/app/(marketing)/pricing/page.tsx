export default function Page() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold">Pricing</h1>
      <p className="text-slate-600 mt-2">Choose a plan that fits your needs</p>
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="p-6 rounded-lg border">
          <div className="font-semibold">Free</div>
          <div className="text-sm text-slate-600">10 credits</div>
        </div>
        <div className="p-6 rounded-lg border">
          <div className="font-semibold">Pro</div>
          <div className="text-sm text-slate-600">500 credits / month</div>
        </div>
        <div className="p-6 rounded-lg border">
          <div className="font-semibold">Enterprise</div>
          <div className="text-sm text-slate-600">Unlimited</div>
        </div>
      </div>
    </section>
  )
}
