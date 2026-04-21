import axios from 'axios';
import type { 
  User, 
  UpdateMeData, 
  UpdatePasswordData, 
  Payment, 
  CreatePaymentData, 
  Message, 
  SendMessageData 
} from './api-types';

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

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error status codes
    if (error.response) {
      const status = error.response.status;
      
      switch (status) {
        case 401:
          // Unauthorized - normal when logged out
          // Let the auth context handle session state
          break;
          
        case 403:
          // Forbidden - user doesn't have permission
          break;
          
        case 500:
          // Server error - handled by components
          break;
          
        default:
          // Other errors - handled by individual components
          break;
      }
    }
    
    return Promise.reject(error);
  }
);

export const userService = {
  // 1. Profile APIs
  getMe: () => api.get('/api/v1/users/me'),
  updateMe: (data: FormData | UpdateMeData) => api.patch('/api/v1/users/updateme', data),
  updatePassword: (data: UpdatePasswordData) => api.patch('/api/v1/users/updateMyPassword', data),
  deleteAvatar: () => api.delete('/api/v1/users/avatar'),

  // 2. Chat APIs
  getMessages: (userId: number | string) => api.get<Message[]>(`/api/v1/message/${userId}`),
  sendMessage: (data: SendMessageData) => api.post<Message>('/api/v1/message', data),

  // 3. Admin User Management APIs
  getAllUsers: (params?: Record<string, unknown>) => api.get<User[]>('/api/v1/users', { params }),
  getSuspendedUsers: () => api.get<User[]>('/api/v1/users/suspended'),
  updateUser: (id: number | string, data: Partial<User>) => api.patch(`/api/v1/users/${id}`, data),
  deleteUser: (id: number | string) => api.delete(`/api/v1/users/${id}`),
  restoreUser: (id: number | string) => api.patch(`/api/v1/users/${id}/restore`),
  permanentDeleteUser: (id: number | string) => api.delete(`/api/v1/users/${id}/permanent`),

  // 4. Payment APIs
  getPayments: () => api.get<Payment[]>('/api/v1/payments'),
  createPayment: (data: CreatePaymentData) => api.post<Payment>('/api/v1/payments', data),
  verifyPayment: (orderId: string, status?: 'success' | 'failed', transaction_id?: string) => 
    api.post(`/api/v1/payments/${orderId}/verify`, { status, transaction_id }),
};

export default api;
