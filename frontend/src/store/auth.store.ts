import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

const storeDefinition: StateCreator<AuthStore> = (set) => ({
  user: null,
  token: null,

  setAuth: (user, token) =>
    set({ user, token }),

  clearAuth: function () {
    return set({ user: null, token: null })
  }
});

export const useAuthStore = create<AuthStore>()(
  persist(storeDefinition, {
    name: 'box-auth'
  })
);
