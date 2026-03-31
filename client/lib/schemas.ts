import { z } from 'zod'

// JWT token payload schema
export const JwtPayloadSchema = z.object({
  id: z.string().optional(),
  sub: z.string().optional(),
}).refine((data) => data.id || data.sub, {
  message: 'JWT must contain either id or sub',
})

// User from database schema
export const DbUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  isPaid: z.boolean().nullable().optional(),
  course_ids: z.array(z.union([z.string(), z.number()])).nullable().optional(),
  files: z.array(z.object({
    name_used: z.string().optional(),
    name: z.string().optional(),
    ext: z.string().optional(),
    table_name: z.string().optional(),
  })).nullable().optional(),
  createdAt: z.date().nullable().optional(),
  updatedAt: z.date().nullable().optional(),
})

// Settings schema
export const SettingsSchema = z.object({
  siteName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  bankCard: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  telegram: z.string().optional(),
  whatsapp: z.string().optional(),
  workingHours: z.string().optional(),
  logo: z.string().optional(),
})

export type JwtPayload = z.infer<typeof JwtPayloadSchema>
export type DbUser = z.infer<typeof DbUserSchema>
export type Settings = z.infer<typeof SettingsSchema>
