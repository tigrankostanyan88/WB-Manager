'use client'

import { useState, useCallback } from 'react'
import { z, ZodSchema } from 'zod'

interface UseZodFormOptions<T> {
  schema: ZodSchema<T>
  initialValues: T
  onSubmit: (values: T) => void | Promise<void>
}

interface FormErrors {
  [key: string]: string
}

interface UseZodFormReturn<T> {
  values: T
  errors: FormErrors
  touched: { [K in keyof T]?: boolean }
  isSubmitting: boolean
  isValid: boolean
  setValue: <K extends keyof T>(field: K, value: T[K]) => void
  setValues: (values: Partial<T>) => void
  handleSubmit: (e?: React.FormEvent) => Promise<void>
  validate: () => boolean
  validateField: <K extends keyof T>(field: K) => boolean
  reset: () => void
  clearErrors: () => void
  getFieldError: (field: keyof T) => string | undefined
}

export function useZodForm<T extends Record<string, unknown>>({
  schema,
  initialValues,
  onSubmit
}: UseZodFormOptions<T>): UseZodFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<{ [K in keyof T]?: boolean }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = useCallback((): boolean => {
    const result = schema.safeParse(values)
    
    if (!result.success) {
      const newErrors: FormErrors = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        if (!newErrors[field]) {
          newErrors[field] = issue.message
        }
      })
      setErrors(newErrors)
      return false
    }
    
    setErrors({})
    return true
  }, [schema, values])

  const validateField = useCallback(<K extends keyof T>(field: K): boolean => {
    const result = schema.safeParse(values)
    
    if (!result.success) {
      const fieldIssue = result.error.issues.find(i => i.path[0] === field)
      if (fieldIssue) {
        setErrors(prev => ({ ...prev, [field]: fieldIssue.message }))
        return false
      }
    }
    
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field as string]
      return newErrors
    })
    return true
  }, [schema, values])

  const setValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }))
    setTouched(prev => ({ ...prev, [field]: true }))
    
    // Clear error for this field when user types
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field as string]
        return newErrors
      })
    }
  }, [errors])

  const setValuesHandler = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({ ...prev, ...newValues }))
  }, [])

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (!validate()) {
      // Mark all fields as touched to show errors
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key as keyof T] = true
        return acc
      }, {} as { [K in keyof T]?: boolean })
      setTouched(allTouched)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } finally {
      setIsSubmitting(false)
    }
  }, [validate, values, onSubmit])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  const getFieldError = useCallback((field: keyof T): string | undefined => {
    return touched[field] ? errors[field as string] : undefined
  }, [errors, touched])

  const isValid = Object.keys(errors).length === 0

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    setValue,
    setValues: setValuesHandler,
    handleSubmit,
    validate,
    validateField,
    reset,
    clearErrors,
    getFieldError
  }
}
