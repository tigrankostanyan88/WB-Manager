import { renderHook, act } from '@testing-library/react'
import { useZodForm } from '@/hooks/useZodForm'
import { z } from 'zod'

describe('useZodForm', () => {
  const testSchema = z.object({
    name: z.string().min(2, 'Անունը պետք է լինի առնվազն 2 նիշ'),
    email: z.string().email('Սխալ էլ. փոստ'),
  })

  const mockSubmit = jest.fn()

  beforeEach(() => {
    mockSubmit.mockClear()
  })

  it('initializes with initial values', () => {
    const { result } = renderHook(() =>
      useZodForm({
        schema: testSchema,
        initialValues: { name: 'John', email: 'john@example.com' },
        onSubmit: mockSubmit,
      })
    )

    expect(result.current.values).toEqual({ name: 'John', email: 'john@example.com' })
    expect(result.current.errors).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
  })

  it('updates value on setValue', () => {
    const { result } = renderHook(() =>
      useZodForm({
        schema: testSchema,
        initialValues: { name: '', email: '' },
        onSubmit: mockSubmit,
      })
    )

    act(() => {
      result.current.setValue('name', 'Jane')
    })

    expect(result.current.values.name).toBe('Jane')
  })

  it('shows validation errors on invalid submit', async () => {
    const { result } = renderHook(() =>
      useZodForm({
        schema: testSchema,
        initialValues: { name: 'J', email: 'invalid' },
        onSubmit: mockSubmit,
      })
    )

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.errors.name).toBe('Անունը պետք է լինի առնվազն 2 նիշ')
    expect(mockSubmit).not.toHaveBeenCalled()
  })

  it('calls onSubmit with valid data', async () => {
    const { result } = renderHook(() =>
      useZodForm({
        schema: testSchema,
        initialValues: { name: 'John', email: 'john@example.com' },
        onSubmit: mockSubmit,
      })
    )

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John',
      email: 'john@example.com',
    })
  })

  it('resets form to initial values', () => {
    const { result } = renderHook(() =>
      useZodForm({
        schema: testSchema,
        initialValues: { name: '', email: '' },
        onSubmit: mockSubmit,
      })
    )

    act(() => {
      result.current.setValue('name', 'Test')
    })

    expect(result.current.values.name).toBe('Test')

    act(() => {
      result.current.reset()
    })

    expect(result.current.values).toEqual({ name: '', email: '' })
    expect(result.current.errors).toEqual({})
  })
})
