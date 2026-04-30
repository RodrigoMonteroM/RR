import api from '@/services/api';
import type { RegisterFormData, AuthResponse } from '@/types/auth';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    return data;
  },

  register: async (formData: RegisterFormData): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', formData);
    return data;
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>('/auth/forgot-password', { email });
    return data;
  },

  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    const { data } = await api.post<{ message: string }>('/auth/reset-password', { token, password });
    return data;
  },
};
