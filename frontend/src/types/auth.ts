export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  nickname: string
  firstName: string
  lastName: string
  avatarUrl?: string
}

export interface AuthResponse {
  user: { id: string; email: string; name: string }
  token: string
}

export interface FormState {
  isLoading: boolean
  error: string | null
}
