import { z } from 'zod'
import {
  PaymentFormSchema,
  CourseFormSchema,
  BankCardFormSchema,
  FaqFormSchema,
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
})
