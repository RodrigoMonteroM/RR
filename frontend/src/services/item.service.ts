import api from '@/services/api';
import type { Item } from '@/types';

export const itemService = {
  getItems: async (boxId: string): Promise<Item[]> => {
    const { data } = await api.get<Item[]>(`/boxes/${boxId}/items`);
    return data;
  },

  createItem: async (boxId: string, content: string): Promise<Item> => {
    const { data } = await api.post<Item>(`/boxes/${boxId}/items`, { content });
    return data;
  },

  updateItem: async (id: string, content: string): Promise<Item> => {
    const { data } = await api.put<Item>(`/items/${id}`, { content });
    return data;
  },

  deleteItem: async (id: string): Promise<void> => {
    await api.delete(`/items/${id}`);
  },

  toggleCompleted: async (id: string, completed: boolean): Promise<Item> => {
    const { data } = await api.patch<Item>(`/items/${id}/completed`, { completed });
    return data;
  },
};
