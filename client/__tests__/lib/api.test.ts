import api, { userService } from '@/lib/api'
import axios from 'axios'

// Mock axios
jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    document.cookie = 'jwt=test-token'
  })

  describe('axios instance', () => {
    it('has correct baseURL', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: expect.any(String),
          withCredentials: true,
        })
      )
    })
  })

  describe('userService', () => {
    it('getMe calls correct endpoint', async () => {
      const mockResponse = { data: { user: { id: '1', name: 'Test' } } }
      mockedAxios.get.mockResolvedValueOnce(mockResponse)

      const result = await userService.getMe()

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/users/me')
      expect(result).toEqual(mockResponse)
    })

    it('updateMe sends FormData correctly', async () => {
      const formData = new FormData()
      formData.append('name', 'New Name')
      
      const mockResponse = { data: { user: { id: '1', name: 'New Name' } } }
      mockedAxios.patch.mockResolvedValueOnce(mockResponse)

      await userService.updateMe(formData)

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        '/api/v1/users/updateme',
        formData,
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'Content-Type': expect.any(String),
          }),
        })
      )
    })

    it('handles 401 unauthorized', async () => {
      const error = {
        response: { status: 401, data: { message: 'Unauthorized' } },
      }
      mockedAxios.get.mockRejectedValueOnce(error)
      mockedAxios.isAxiosError = jest.fn().mockReturnValue(true)

      // Should redirect to home on 401
      const mockHref = jest.fn()
      Object.defineProperty(window, 'location', {
        value: { href: { set: mockHref }, pathname: '/dashboard' },
        writable: true,
      })

      await expect(userService.getMe()).rejects.toEqual(error)

      // Check that cookie was cleared
      expect(document.cookie).toContain('jwt=')
    })

    it('getAllUsers accepts query params', async () => {
      const mockResponse = { data: { users: [] } }
      mockedAxios.get.mockResolvedValueOnce(mockResponse)

      await userService.getAllUsers({ role: 'admin', page: 1 })

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/users', {
        params: { role: 'admin', page: 1 },
      })
    })

    it('deleteUser calls correct endpoint', async () => {
      mockedAxios.delete.mockResolvedValueOnce({ data: {} })

      await userService.deleteUser('123')

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/v1/users/123')
    })

    it('getPayments returns payments array', async () => {
      const mockPayments = [
        { id: '1', amount: 100, status: 'success' },
        { id: '2', amount: 200, status: 'pending' },
      ]
      mockedAxios.get.mockResolvedValueOnce({ data: { payments: mockPayments } })

      const result = await userService.getPayments()

      expect(result.data.payments).toEqual(mockPayments)
    })

    it('createPayment sends correct data', async () => {
      const paymentData = {
        userId: '1',
        amount: 100,
        courseId: 'course-123',
      }
      const mockResponse = { data: { payment: { id: 'pay-123' } } }
      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      await userService.createPayment(paymentData)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/v1/payments',
        paymentData
      )
    })

    it('sendMessage creates message', async () => {
      const messageData = {
        to: '2',
        content: 'Hello',
      }
      mockedAxios.post.mockResolvedValueOnce({ data: { message: { id: '1' } } })

      await userService.sendMessage(messageData)

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/v1/message', messageData)
    })
  })
})
