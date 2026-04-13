'use server'

import { auth } from '@clerk/nextjs/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

export async function createCheckoutSessionForCurrentUser() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) throw new Error('User not found')

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-06-20' as const
  })
  const customerId =
    user.stripeCustomerId ||
    (await (async () => {
      const c = await stripe.customers.create({ email: user.email, metadata: { userId: user.id } })
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: c.id } })
      return c.id
    })())

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: process.env.STRIPE_PRICE_PRO_ID, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?status=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?status=cancel`
  })
  return session.url || null
}

export async function createBillingPortalForCurrentUser() {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user || !user.stripeCustomerId) throw new Error('No customer')
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2024-06-20' as const
  })
  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`
  })
  return portal.url
}
