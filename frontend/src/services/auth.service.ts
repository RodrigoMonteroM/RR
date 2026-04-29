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


};
