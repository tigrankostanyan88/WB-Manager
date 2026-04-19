import { z } from 'zod'

// Payment Form Validation
export const PaymentFormSchema = z.object({
  userId: z.string().min(1, 'Ընտրեք օգտատիրոջը'),
  courseId: z.string().min(1, 'Ընտրեք դասընթացը'),
  amount: z.number().positive('Գումարը պետք է լինի դրական'),
  paymentMethod: z.enum(['idram', 'ameria', 'acba']).refine((val) => ['idram', 'ameria', 'acba'].includes(val), {
    message: 'Ընտրեք վճարման եղանակը'
  })
})

export type PaymentFormData = z.infer<typeof PaymentFormSchema>

// Course Form Validation
export const CourseFormSchema = z.object({
  title: z.string().min(3, 'Վերնագիրը պետք է լինի առնվազն 3 նիշ').max(200, 'Վերնագիրը չպետք է գերազանցի 200 նիշը'),
  category: z.string().optional(),
  language: z.string().optional(),
  price: z.union([
    z.string().min(1, 'Մուտքագրեք գինը').regex(/^\d+$/, 'Գինը պետք է լինի թվային արժեք'),
    z.number().positive('Գինը պետք է լինի դրական')
  ]),
  discount: z.union([z.string(), z.number()]).optional().default(0),
  description: z.string().min(10, 'Նկարագրությունը պետք է լինի առնվազն 10 նիշ').max(5000, 'Նկարագրությունը չպետք է գերազանցի 5000 նիշը'),
  prerequisites: z.array(z.string()).optional().default([]),
  whatToLearn: z.array(z.string()).optional().default([]),
  image: z.union([z.string(), z.instanceof(File), z.null()]).optional()
})

export type CourseFormData = z.infer<typeof CourseFormSchema>

// Module Form Validation
export const ModuleFormSchema = z.object({
  courseId: z.string().min(1, 'Ընտրեք դասընթացը'),
  title: z.string().min(2, 'Անվանումը պետք է լինի առնվազն 2 նիշ').max(100, 'Անվանումը չպետք է գերազանցի 100 նիշը'),
  description: z.string().max(1000, 'Նկարագրությունը չպետք է գերազանցի 1000 նիշը').optional()
})

export type ModuleFormData = z.infer<typeof ModuleFormSchema>

// Bank Card Form Validation
export const BankCardFormSchema = z.object({
  bank_name: z.string().min(2, 'Բանկի անվանումը պետք է լինի առնվազն 2 նիշ').max(50, 'Բանկի անվանումը չպետք է գերազանցի 50 նիշը'),
  card_number: z.string()
    .min(4, 'Քարտի համարը պետք է լինի առնվազն 4 նիշ')
    .max(30, 'Քարտի համարը չպետք է գերազանցի 30 նիշը')
    .regex(/^[\d\s-]+$/, 'Քարտի համարը պետք է պարունակի միայն թվեր, բացատներ կամ գծիկներ'),
  is_active: z.boolean()
})

export type BankCardFormData = z.infer<typeof BankCardFormSchema>

// FAQ Form Validation
export const FaqFormSchema = z.object({
  title: z.string().min(5, 'Հարցը պետք է լինի առնվազն 5 նիշ').max(200, 'Հարցը չպետք է գերազանցի 200 նիշը'),
  text: z.string().min(10, 'Պատասխանը պետք է լինի առնվազն 10 նիշ').max(2000, 'Պատասխանը չպետք է գերազանցի 2000 նիշը')
})

export type FaqFormData = z.infer<typeof FaqFormSchema>

// Instructor Form Validation
export const InstructorFormSchema = z.object({
  title: z.string().min(2, 'Վերնագիրը պետք է լինի առնվազն 2 նիշ').max(50, 'Վերնագիրը չպետք է գերազանցի 50 նիշը'),
  name: z.string().min(2, 'Անունը պետք է լինի առնվազն 2 նիշ').max(50, 'Անունը չպետք է գերազանցի 50 նիշը'),
  profession: z.string().min(2, 'Մասնագիտությունը պետք է լինի առնվազն 2 նիշ').max(50, 'Մասնագիտությունը չպետք է գերազանցի 50 նիշը'),
  description: z.string().min(10, 'Նկարագրությունը պետք է լինի առնվազն 10 նիշ').max(500, 'Նկարագրությունը չպետք է գերազանցի 500 նիշը'),
  badgeText: z.string().max(20, 'Բեյջի տեքստը չպետք է գերազանցի 20 նիշը').optional(),
  stats: z.array(z.object({
    value: z.string().max(10, 'Արժեքը չպետք է գերազանցի 10 նիշը'),
    label: z.string().max(30, 'Պիտակը չպետք է գերազանցի 30 նիշը')
  })).max(4, 'Առավելագույնը 4 վիճակագրություն')
})

export type InstructorFormData = z.infer<typeof InstructorFormSchema>

// User Edit Form Validation
export const UserEditFormSchema = z.object({
  name: z.string().min(2, 'Անունը պետք է լինի առնվազն 2 նիշ').max(50, 'Անունը չպետք է գերազանցի 50 նիշը').optional(),
  email: z.string().email('Սխալ էլ. փոստի ձևաչափ'),
  phone: z.string().regex(/^[\d\s+()-]*$/, 'Հեռախոսահամարի սխալ ձևաչափ').optional(),
  address: z.string().max(200, 'Հասցեն չպետք է գերազանցի 200 նիշը').optional()
})

export type UserEditFormData = z.infer<typeof UserEditFormSchema>

// Auth Form Validation - MOST CRITICAL
export const SignInSchema = z.object({
  email: z.string()
    .min(1, 'Մուտքագրեք էլ. հասցեն')
    .email('Սխալ էլ. հասցեի ձևաչափ'),
  password: z.string()
    .min(1, 'Մուտքագրեք գաղտնաբառը')
    .min(6, 'Գաղտնաբառը պետք է լինի առնվազն 6 նիշ')
})

export type SignInData = z.infer<typeof SignInSchema>

export const SignUpSchema = z.object({
  name: z.string()
    .min(2, 'Անունը պետք է լինի առնվազն 2 նիշ')
    .max(50, 'Անունը չպետք է գերազանցի 50 նիշը'),
  email: z.string()
    .min(1, 'Մուտքագրեք էլ. հասցեն')
    .email('Սխալ էլ. հասցեի ձևաչափ'),
  phone: z.string()
    .min(1, 'Մուտքագրեք հեռախոսահամարը')
    .regex(/^0\d{8}$/, 'Հեռախոսահամարը պետք լինի 0-ով սկսվող 9 նիշ'),
  address: z.string().max(200, 'Հասցեն չպետք է գերազանցի 200 նիշը').optional(),
  password: z.string()
    .min(1, 'Մուտքագրեք գաղտնաբառը')
    .min(6, 'Գաղտնաբառը պետք է լինի առնվազն 6 նիշ')
    .max(50, 'Գաղտնաբառը չպետք է գերազանցի 50 նիշը')
})

export type SignUpData = z.infer<typeof SignUpSchema>

// Course Registration Form
export const CourseRegistrationSchema = z.object({
  course_id: z.number().min(1, 'Ընտրեք դասընթացը'),
  name: z.string()
    .min(2, 'Անունը պետք է լինի առնվազն 2 նիշ')
    .max(50, 'Անունը չպետք է գերազանցի 50 նիշը'),
  phone: z.string()
    .min(1, 'Մուտքագրեք հեռախոսահամարը')
    .regex(/^0\d{8}$/, 'Հեռախոսահամարը պետք լինի 0-ով սկսվող 9 նիշ')
})

export type CourseRegistrationData = z.infer<typeof CourseRegistrationSchema>

// Contact Form
export const ContactFormSchema = z.object({
  name: z.string()
    .min(2, 'Անունը պետք է լինի առնվազն 2 նիշ')
    .max(50, 'Անունը չպետք է գերազանցի 50 նիշը'),
  email: z.string()
    .min(1, 'Մուտքագրեք էլ. հասցեն')
    .email('Սխալ էլ. հասցեի ձևաչափ'),
  phone: z.string()
    .regex(/^0\d{8}$/, 'Հեռախոսահամարը պետք լինի 0-ով սկսվող 9 նիշ')
    .optional()
    .or(z.literal('')),
  subject: z.string()
    .min(5, 'Վերնագիրը պետք է լինի առնվազն 5 նիշ')
    .max(100, 'Վերնագիրը չպետք է գերազանցի 100 նիշը'),
  message: z.string()
    .min(10, 'Հաղորդագրությունը պետք է լինի առնվազն 10 նիշ')
    .max(2000, 'Հաղորդագրությունը չպետք է գերազանցի 2000 նիշը')
})

export type ContactFormData = z.infer<typeof ContactFormSchema>
