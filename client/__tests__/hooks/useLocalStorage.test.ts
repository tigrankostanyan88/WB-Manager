import { renderHook, act } from '@testing-library/react'
import { useLocalStorage, useReadLocalStorage } from '@/hooks/useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('initializes with default value when localStorage is empty', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default-value')
    )

    expect(result.current.value).toBe('default-value')
    expect(result.current.isHydrated).toBe(true)
  })

  it('reads existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'))

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default-value')
    )

    expect(result.current.value).toBe('stored-value')
  })

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial')
    )

    act(() => {
      result.current.setValue('new-value')
    })

    expect(result.current.value).toBe('new-value')
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'))
  })

  it('handles function updates', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0))

    act(() => {
      result.current.setValue((prev) => prev + 1)
    })

    expect(result.current.value).toBe(1)
  })

  it('removes value from localStorage', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial')
    )

    act(() => {
      result.current.setValue('new-value')
    })

    act(() => {
      result.current.removeValue()
    })

    expect(result.current.value).toBe('initial')
    expect(localStorage.getItem('test-key')).toBeNull()
  })

  it('handles complex objects', () => {
    const defaultValue = { name: 'Test', items: [1, 2, 3] }
    const { result } = renderHook(() =>
      useLocalStorage('object-key', defaultValue)
    )

    act(() => {
      result.current.setValue({ name: 'Updated', items: [4, 5] })
    })

    expect(result.current.value).toEqual({ name: 'Updated', items: [4, 5] })
  })

  it('handles localStorage errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })

    const { result } = renderHook(() => useLocalStorage('test-key', 'value'))

    act(() => {
      result.current.setValue('new-value')
    })

    // Should not throw, just silently fail
    expect(result.current.value).toBe('new-value')

    consoleSpy.mockRestore()
  })

  it('handles invalid JSON in localStorage', () => {
    localStorage.setItem('test-key', 'invalid-json')

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default')
    )

    // Should fall back to default value
    expect(result.current.value).toBe('default')
  })

  it('updates when key changes', () => {
    const { result, rerender } = renderHook(
      ({ key }) => useLocalStorage(key, 'default'),
      { initialProps: { key: 'key-1' } }
    )

    localStorage.setItem('key-2', JSON.stringify('value-2'))

    rerender({ key: 'key-2' })

    expect(result.current.value).toBe('value-2')
  })
})

describe('useReadLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('reads value from localStorage', () => {
    localStorage.setItem('read-key', JSON.stringify('stored'))

    const { result } = renderHook(() =>
      useReadLocalStorage('read-key', 'default')
    )

    expect(result.current.value).toBe('stored')
    expect(result.current.isHydrated).toBe(true)
  })

  it('uses default when localStorage is empty', () => {
    const { result } = renderHook(() =>
      useReadLocalStorage('non-existent', 'fallback')
    )

    expect(result.current.value).toBe('fallback')
  })

  it('does not write to localStorage', () => {
    renderHook(() => useReadLocalStorage('read-only', 'value'))

    // Hook should not write anything
    expect(localStorage.getItem('read-only')).toBeNull()
  })
})
