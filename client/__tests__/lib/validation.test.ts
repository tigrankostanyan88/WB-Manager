import { z } from 'zod'
import {
  PaymentFormSchema,
  CourseFormSchema,
  BankCardFormSchema,
  FaqFormSchema,
  SignInSchema,
  SignUpSchema,
  ContactFormSchema,
} from '@/lib/validation'

describe('Validation Schemas', () => {
  describe('PaymentFormSchema', () => {
    it('validates correct payment data', () => {
      const validData = {
        userId: 'user-123',
        courseId: 'course-456',
        amount: 1000,
        paymentMethod: 'idram' as const,
      }

      const result = PaymentFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('fails on empty userId', () => {
      const invalidData = {
        userId: '',
        courseId: 'course-456',
        amount: 1000,
        paymentMethod: 'idram' as const,
      }

      const result = PaymentFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Ընտրեք օգտատիրոջը')
      }
    })

    it('fails on negative amount', () => {
      const invalidData = {
        userId: 'user-123',
        courseId: 'course-456',
        amount: -100,
        paymentMethod: 'idram' as const,
      }

      const result = PaymentFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Գումարը պետք է լինի դրական')
      }
    })
  })

  describe('CourseFormSchema', () => {
    it('validates correct course data', () => {
      const validData = {
        title: 'Wildberries դասընթաց',
        price: '180000',
        description: 'Ամբողջական դասընթաց WB-ի մասին',
      }

      const result = CourseFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('fails on short title', () => {
      const invalidData = {
        title: 'AB',
        price: '180000',
        description: 'Նկարագրություն',
      }

      const result = CourseFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('fails on long title', () => {
      const invalidData = {
        title: 'A'.repeat(201),
        price: '180000',
        description: 'Նկարագրություն',
      }

      const result = CourseFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('BankCardFormSchema', () => {
    it('validates correct bank card data', () => {
      const validData = {
        bank_name: 'Ameria Bank',
        card_number: '1234 5678 9012 3456',
        is_active: true,
      }

      const result = BankCardFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('fails on invalid card number format', () => {
      const invalidData = {
        bank_name: 'Ameria Bank',
        card_number: 'abc123',
        is_active: true,
      }

      const result = BankCardFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('fails on short bank name', () => {
      const invalidData = {
        bank_name: 'A',
        card_number: '1234567890',
        is_active: true,
      }

      const result = BankCardFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('FaqFormSchema', () => {
    it('validates correct FAQ data', () => {
      const validData = {
        title: 'Ինչպես գրանցվել դասընթացին?',
        text: 'Գրանցվելու համար անհրաժեշտ է լրացնել ձևը...',
      }

      const result = FaqFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('fails on short question', () => {
      const invalidData = {
        title: 'Hi?',
        text: 'Պատասխանը այստեղ է...',
      }

      const result = FaqFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('fails on short answer', () => {
      const invalidData = {
        title: 'Ինչպես գրանցվել?',
        text: 'Hi',
      }

      const result = FaqFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('SignInSchema', () => {
    it('validates correct signin data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = SignInSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('fails on empty email', () => {
      const invalidData = {
        email: '',
        password: 'password123',
      }

      const result = SignInSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('fails on invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      }

      const result = SignInSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('fails on short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '12345',
      }

      const result = SignInSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('SignUpSchema', () => {
    it('validates correct signup data', () => {
      const validData = {
        name: 'Արմեն Արմենյան',
        email: 'test@example.com',
        phone: '091234567',
        address: 'ք. Երևան',
        password: 'password123',
      }

      const result = SignUpSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('fails on invalid phone format', () => {
      const invalidData = {
        name: 'Արմեն Արմենյան',
        email: 'test@example.com',
        phone: '12345',
        address: 'ք. Երևան',
        password: 'password123',
      }

      const result = SignUpSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('fails on short name', () => {
      const invalidData = {
        name: 'A',
        email: 'test@example.com',
        phone: '091234567',
        address: 'ք. Երևան',
        password: 'password123',
      }

      const result = SignUpSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('ContactFormSchema', () => {
    it('validates correct contact form data', () => {
      const validData = {
        name: 'Արմեն Արմենյան',
        email: 'test@example.com',
        subject: 'Հարց դասընթացի մասին',
        message: 'Ողջույն, ունեմ հարց դասընթացի վերաբերյալ...',
      }

      const result = ContactFormSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('fails on short message', () => {
      const invalidData = {
        name: 'Արմեն Արմենյան',
        email: 'test@example.com',
        subject: 'Հարց',
        message: 'Hi',
      }

      const result = ContactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })

    it('fails on empty required fields', () => {
      const invalidData = {
        name: '',
        email: '',
        subject: '',
        message: '',
      }

      const result = ContactFormSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })
})
