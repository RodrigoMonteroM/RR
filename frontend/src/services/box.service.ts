import api from '@/services/api';
import type { Box } from '@/types';

interface BoxCreate {
  name: string;
  description?: string;
}

export const boxService = {
  getBoxes: async (): Promise<Box[]> => {
    const { data } = await api.get<Box[]>('/boxes');
    return data;
  },

  getBox: async (id: string): Promise<Box> => {
    const { data } = await api.get<Box>(`/boxes/${id}`);
    return data;
  },

  createBox: async (payload: BoxCreate): Promise<Box> => {
    const { data } = await api.post<Box>('/boxes', payload);
    return data;
  },

  updateBox: async (id: string, payload: Partial<BoxCreate>): Promise<Box> => {
    const { data } = await api.put<Box>(`/boxes/${id}`, payload);
    return data;
  },

  deleteBox: async (id: string): Promise<void> => {
    await api.delete(`/boxes/${id}`);
  },

  changeVisibility: async (id: string): Promise<Box> => {
    const { data } = await api.put<Box>(`/boxes/${id}/visibility`);
    return data;
  },
};
