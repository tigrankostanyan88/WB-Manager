import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'
import { Plan } from '@prisma/client'

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) return new Response('No webhook secret', { status: 500 })

  const sig = req.headers.get('stripe-signature')
  const body = await req.text()
  if (!sig) return new Response('No signature', { status: 400 })

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' as const })
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(`Webhook Error: ${message}`, { status: 400 })
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = sub.customer as string
      const planProduct = (sub.items.data[0]?.price.product as string) || ''
      const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } })
      if (!user) break
      let plan: Plan = Plan.PRO
      let credits = 500
      if (planProduct.toString().toLowerCase().includes('enterprise')) {
        plan = Plan.ENTERPRISE
        credits = -1
      } else if (planProduct.toString().toLowerCase().includes('free')) {
        plan = Plan.FREE
        credits = 10
      }
      await prisma.user.update({
        where: { id: user.id },
        data: {
          plan,
          credits: plan === Plan.ENTERPRISE ? user.credits : credits,
          stripeSubscriptionId: sub.id
        }
      })
      break
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string
      const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } })
      if (!user) break
      if (user.plan === 'PRO') {
        await prisma.user.update({ where: { id: user.id }, data: { credits: 500 } })
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = sub.customer as string
      const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } })
      if (!user) break
      await prisma.user.update({
        where: { id: user.id },
        data: { plan: Plan.FREE, credits: 10, stripeSubscriptionId: null }
      })
      break
    }
    default:
      break
  }
  return new Response('ok')
}
