import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3300',
  withCredentials: true
});

// No localStorage token - using httpOnly cookies only for security
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // Let browser set Content-Type with boundary for FormData
    if (config.headers) {
      delete config.headers['Content-Type']
      delete config.headers['content-type']
    }
  }
  return config;
});

export const userService = {
  // 1. Profile APIs
  getMe: () => api.get('/api/v1/users/me'),
  updateMe: (data: FormData | Record<string, unknown>) => api.patch('/api/v1/users/updateme', data),
  updatePassword: (data: Record<string, unknown>) => api.patch('/api/v1/users/updateMyPassword', data),
  deleteAvatar: () => api.delete('/api/v1/users/avatar'),

  // 2. Chat APIs
  getMessages: (userId: number | string) => api.get(`/api/v1/message/${userId}`),
  sendMessage: (data: { receiverId?: number; message: string }) => api.post('/api/v1/message', data),

  // 3. Admin User Management APIs
  getAllUsers: (params?: Record<string, unknown>) => api.get('/api/v1/users', { params }),
  getSuspendedUsers: () => api.get('/api/v1/users/suspended'),
  updateUser: (id: number | string, data: Record<string, unknown>) => api.patch(`/api/v1/users/${id}`, data),
  deleteUser: (id: number | string) => api.delete(`/api/v1/users/${id}`),
  restoreUser: (id: number | string) => api.patch(`/api/v1/users/${id}/restore`),
  permanentDeleteUser: (id: number | string) => api.delete(`/api/v1/users/${id}/permanent`),

  // 4. Payment APIs
  getPayments: () => api.get('/api/v1/payments'),
  createPayment: (data: { user_id: number | string; course_id: number | string; amount: number; payment_method: string }) => 
    api.post('/api/v1/payments', data),
  verifyPayment: (orderId: string, status?: 'success' | 'failed', transaction_id?: string) => 
    api.post(`/api/v1/payments/${orderId}/verify`, { status, transaction_id }),
};

export default api;
