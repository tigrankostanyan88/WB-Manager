import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

// No localStorage token - using httpOnly cookies only for security
api.interceptors.request.use((config) => {
  // Cookies are automatically sent with withCredentials: true
  // No need to manually set Authorization header
  if (config.data instanceof FormData) {
    if (config.headers && 'Content-Type' in config.headers) {
      delete (config.headers as any)['Content-Type'];
    }
    if (config.headers && 'content-type' in config.headers) {
      delete (config.headers as any)['content-type'];
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
  updateUser: (id: number | string, data: Record<string, unknown>) => api.patch(`/api/v1/users/${id}`, data),
  deleteUser: (id: number | string) => api.delete(`/api/v1/users/${id}`),
};

export default api;
