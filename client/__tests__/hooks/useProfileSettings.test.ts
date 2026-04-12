import { renderHook, act, waitFor } from '@testing-library/react'
import { useProfileSettings } from '@/components/features/profile/hooks/useProfileSettings'

// Mock API
jest.mock('@/lib/api', () => ({
  default: {
    patch: jest.fn(),
    post: jest.fn(),
  },
}))

import api from '@/lib/api'

describe('useProfileSettings', () => {
  const mockSetPasswordData = jest.fn()
  const mockSetShowPasswordModal = jest.fn()
  const mockSetIsUploadingAvatar = jest.fn()
  const mockSetAvatarPreview = jest.fn()
  const mockSetUser = jest.fn()
  const mockSetAuthUser = jest.fn()
  const mockShowToast = jest.fn()

  const defaultPasswordData = {
    passwordCurrent: '',
    password: '',
    passwordConfirm: '',
  }

  const defaultProps = {
    passwordData: defaultPasswordData,
    setPasswordData: mockSetPasswordData,
    setShowPasswordModal: mockSetShowPasswordModal,
    setIsUploadingAvatar: mockSetIsUploadingAvatar,
    setAvatarPreview: mockSetAvatarPreview,
    setUser: mockSetUser,
    setAuthUser: mockSetAuthUser,
    showToast: mockShowToast,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with isUpdating false', () => {
    const { result } = renderHook(() => useProfileSettings(defaultProps))
    
    expect(result.current.isUpdating).toBe(false)
  })

  it('handles successful profile update', async () => {
    const mockResponse = {
      data: {
        user: {
          id: '1',
          name: 'Updated Name',
          email: 'test@example.com',
          phone: '+37499123456',
          address: 'Yerevan',
        },
      },
    }
    ;(api.patch as jest.Mock).mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useProfileSettings(defaultProps))

    await act(async () => {
      await result.current.handleUpdateProfile({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>)
    })

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Տվյալները հաջողությամբ թարմացվեցին', 'success')
      expect(mockSetUser).toHaveBeenCalled()
      expect(mockSetAuthUser).toHaveBeenCalled()
    })
  })

  it('handles profile update error', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Սխալ է տեղի ունեցել',
        },
      },
    }
    ;(api.patch as jest.Mock).mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useProfileSettings(defaultProps))

    await act(async () => {
      await result.current.handleUpdateProfile({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>)
    })

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Սխալ է տեղի ունեցել', 'error')
    })
  })

  it('handles successful avatar upload', async () => {
    const mockResponse = {
      data: {
        user: {
          id: '1',
          name: 'Test User',
          files: [
            { name_used: 'user_img', name: 'avatar', ext: 'jpg' },
          ],
        },
      },
    }
    ;(api.post as jest.Mock).mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useProfileSettings(defaultProps))
    const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })

    await act(async () => {
      await result.current.handleAvatarUpload(file)
    })

    await waitFor(() => {
      expect(mockSetIsUploadingAvatar).toHaveBeenCalledWith(true)
      expect(mockSetIsUploadingAvatar).toHaveBeenCalledWith(false)
      expect(mockShowToast).toHaveBeenCalledWith('Նկարը հաջողությամբ թարմացվեց', 'success')
    })
  })

  it('handles avatar upload error', async () => {
    ;(api.post as jest.Mock).mockRejectedValueOnce(new Error('Upload failed'))

    const { result } = renderHook(() => useProfileSettings(defaultProps))
    const file = new File(['test'], 'avatar.jpg', { type: 'image/jpeg' })

    await act(async () => {
      await result.current.handleAvatarUpload(file)
    })

    await waitFor(() => {
      expect(mockSetIsUploadingAvatar).toHaveBeenCalledWith(false)
      expect(mockShowToast).toHaveBeenCalledWith('Նկարի բեռնումը ձախողվեց', 'error')
    })
  })

  it('handles successful password update', async () => {
    const mockResponse = { data: { message: 'Password updated' } }
    ;(api.patch as jest.Mock).mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() =>
      useProfileSettings({
        ...defaultProps,
        passwordData: {
          passwordCurrent: 'oldpass',
          password: 'newpass',
          passwordConfirm: 'newpass',
        },
      })
    )

    await act(async () => {
      await result.current.handleUpdatePassword()
    })

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Գաղտնաբառը հաջողությամբ թարմացվեց', 'success')
      expect(mockSetPasswordData).toHaveBeenCalledWith(defaultPasswordData)
      expect(mockSetShowPasswordModal).toHaveBeenCalledWith(false)
    })
  })

  it('handles password update error with message', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Հին գաղտնաբառը սխալ է',
        },
      },
    }
    ;(api.patch as jest.Mock).mockRejectedValueOnce(mockError)

    const { result } = renderHook(() =>
      useProfileSettings({
        ...defaultProps,
        passwordData: {
          passwordCurrent: 'wrongpass',
          password: 'newpass',
          passwordConfirm: 'newpass',
        },
      })
    )

    await act(async () => {
      await result.current.handleUpdatePassword()
    })

    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Հին գաղտնաբառը սխալ է', 'error')
    })
  })

  it('sets isUpdating to true during operations', async () => {
    const mockResponse = { data: { user: {} } }
    ;(api.patch as jest.Mock).mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useProfileSettings(defaultProps))

    expect(result.current.isUpdating).toBe(false)

    act(() => {
      result.current.handleUpdateProfile({
        preventDefault: jest.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>)
    })

    expect(result.current.isUpdating).toBe(true)

    await waitFor(() => {
      expect(result.current.isUpdating).toBe(false)
    })
  })
})
