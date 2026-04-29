import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { RegisterFormData } from '@/types/auth';

export function useAuth() {
  const { user, token, setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: ({ user, token }) => setAuth(user, token),
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterFormData) =>
      authService.register(userData),
    onSuccess: ({ user, token }) => setAuth(user, token),
  });



  return {
    user,
    token,
    isAuthenticated: !!token,
    login: loginMutation.mutateAsync,
    loginPending: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    registerPending: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: clearAuth,
  };
}
