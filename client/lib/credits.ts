import { prisma } from '@/lib/db'
import { Plan } from '@prisma/client'

export async function canUseCredits(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { plan: true, credits: true } })
  if (!user) return false
  if (user.plan === Plan.ENTERPRISE) return true
  return user.credits > 0
}

export async function decrementCredit(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: 1 } },
    select: { credits: true, plan: true }
  })
}
