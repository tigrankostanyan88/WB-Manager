/**
 * Server-only Prisma client
 * WARNING: This module must ONLY be imported in Server Components or API routes
 * Importing in Client Components will cause build errors and security issues
 */

import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : []
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
