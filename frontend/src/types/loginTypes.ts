
export interface LoginFormData {
    email: string
    password: string
}


export interface LoginResponse {
    user: { id: string; email: string; name: string }
    token: string
}


export interface FormState {
    isLoading: boolean
    error: string | null
}
