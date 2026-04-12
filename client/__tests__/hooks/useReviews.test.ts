import { renderHook, act, waitFor } from '@testing-library/react'
import { useReviews } from '@/components/features/profile/hooks/useReviews'

// Mock API
jest.mock('@/lib/api', () => ({
  default: {
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}))

import api from '@/lib/api'

describe('useReviews', () => {
  const mockSetMyReview = jest.fn()
  const mockShowToast = jest.fn()

  const defaultProps = {
    myReview: null,
    setMyReview: mockSetMyReview,
    showToast: mockShowToast,
  }

  const existingReview = {
    id: 'review-1',
    rating: 5,
    comment: 'Շատ լավ դասընթաց էր:',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with empty review form', () => {
    const { result } = renderHook(() => useReviews(defaultProps))

    expect(result.current.reviewForm).toEqual({
      rating: 5,
      comment: '',
    })
    expect(result.current.isReviewSubmitting).toBe(false)
  })

  it('initializes with existing review data when available', () => {
    const { result } = renderHook(() =>
      useReviews({
        ...defaultProps,
        myReview: existingReview,
      })
    )

    expect(result.current.reviewForm).toEqual({
      rating: 5,
      comment: 'Շատ լավ դասընթաց էր:',
    })
  })

  it('updates review form on edit', () => {
    const { result } = renderHook(() => useReviews(defaultProps))

    act(() => {
      result.current.setReviewForm({
        rating: 4,
        comment: 'Լավ դասընթաց',
      })
    })

    expect(result.current.reviewForm).toEqual({
      rating: 4,
      comment: 'Լավ դասընթաց',
    })
  })

  it('handles successful review creation', async () => {
    const mockResponse = {
      data: {
        review: {
          id: 'new-review',
          rating: 5,
          comment: 'Հիանալի դասընթաց:',
        },
      },
    }
    ;(api.post as jest.Mock).mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useReviews(defaultProps))

    act(() => {
      result.current.setReviewForm({
        rating: 5,
        comment: 'Հիանալի դասընթաց:',
      })
    })

    await act(async () => {
      await result.current.handleSubmitReviewCreate()
    })

    await waitFor(() => {
      expect(mockSetMyReview).toHaveBeenCalledWith(mockResponse.data.review)
      expect(mockShowToast).toHaveBeenCalledWith('Կարծիքը հաջողությամբ ավելացվեց', 'success')
      expect(result.current.isReviewSubmitting).toBe(false)
    })
  })

  it('handles review creation error', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Սխալ է տեղի ունեցել',
        },
      },
    }
    ;(api.post as jest.Mock).mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useReviews(defaultProps))

    act(() => {
      result.current.setReviewForm({
        rating: 5,
        comment: 'Test comment',
      })
    })

    await act(async () => {
      await result.current.handleSubmitReviewCreate()
    })

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Սխալ է տեղի ունեցել', 'error')
      expect(result.current.isReviewSubmitting).toBe(false)
    })
  })

  it('handles successful review update', async () => {
    const mockResponse = {
      data: {
        review: {
          ...existingReview,
          rating: 4,
          comment: 'Թարմացված կարծիք',
        },
      },
    }
    ;(api.patch as jest.Mock).mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() =>
      useReviews({
        ...defaultProps,
        myReview: existingReview,
      })
    )

    act(() => {
      result.current.setReviewForm({
        rating: 4,
        comment: 'Թարմացված կարծիք',
      })
    })

    await act(async () => {
      await result.current.handleSubmitReviewUpdate()
    })

    await waitFor(() => {
      expect(mockSetMyReview).toHaveBeenCalledWith(mockResponse.data.review)
      expect(mockShowToast).toHaveBeenCalledWith('Կարծիքը հաջողությամբ թարմացվեց', 'success')
    })
  })

  it('handles review update error', async () => {
    const mockError = new Error('Network error')
    ;(api.patch as jest.Mock).mockRejectedValueOnce(mockError)

    const { result } = renderHook(() =>
      useReviews({
        ...defaultProps,
        myReview: existingReview,
      })
    )

    act(() => {
      result.current.setReviewForm({
        rating: 4,
        comment: 'Test update',
      })
    })

    await act(async () => {
      await result.current.handleSubmitReviewUpdate()
    })

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Կարծիքի թարմացումը ձախողվեց', 'error')
    })
  })

  it('sets isReviewSubmitting to true during submission', async () => {
    const mockResponse = { data: { review: {} } }
    ;(api.post as jest.Mock).mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useReviews(defaultProps))

    act(() => {
      result.current.handleSubmitReviewCreate()
    })

    expect(result.current.isReviewSubmitting).toBe(true)

    await waitFor(() => {
      expect(result.current.isReviewSubmitting).toBe(false)
    })
  })

  it('handles edit review action', () => {
    const { result } = renderHook(() =>
      useReviews({
        ...defaultProps,
        myReview: existingReview,
      })
    )

    act(() => {
      result.current.handleEditReview()
    })

    // Should initialize form with existing review data
    expect(result.current.reviewForm).toEqual({
      rating: 5,
      comment: 'Շատ լավ դասընթաց էր:',
    })
  })

  it('validates review form before submission', async () => {
    const { result } = renderHook(() => useReviews(defaultProps))

    act(() => {
      result.current.setReviewForm({
        rating: 0,
        comment: '',
      })
    })

    // API should not be called with invalid data
    ;(api.post as jest.Mock).mockRejectedValueOnce(new Error('Validation error'))

    await act(async () => {
      await result.current.handleSubmitReviewCreate()
    })

    expect(mockShowToast).toHaveBeenCalledWith('Կարծիքի սխալ', 'error')
  })
})
