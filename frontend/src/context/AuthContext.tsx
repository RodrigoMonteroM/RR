import { createContext, useContext } from 'react';
import { useAuthStore } from '@/store/auth.store';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, token, clearAuth } = useAuthStore();

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!token, logout: clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider');
  return ctx;
}
