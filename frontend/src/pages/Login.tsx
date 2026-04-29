import { Mail, Lock } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import RRLogo from '@/components/ui/Logo'
import { useState, ChangeEvent, FormEvent } from 'react'
import { LoginFormData } from '@/types/auth'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { useNavigate, Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'


export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(state => state.setAuth)

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginFormData) => {
      return authService.login(credentials.email, credentials.password)
    },
    onMutate: () => {
      setErrorMessage(null);
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      navigate('/')
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || 'Credenziali errate');
    }
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    loginMutation.mutate(formData)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  return (
    <div className="flex min-h-screen">

      {/* ── Left panel ── */}
      <div
        className="hidden md:flex md:w-2/5 flex-col justify-between px-12 py-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #9e5a60 0%, #B4757A 45%, #cfa0a4 100%)' }}
      >
        {/* Dot grid overlay */}
        <div className="absolute inset-0 bg-dot-grid pointer-events-none" />

        {/* Decorative circles */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full border border-white/8 pointer-events-none" />

        {/* Logo top */}
        <div className="relative z-10 animate-fade-in">
          <RRLogo size="sm" />
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8 animate-fade-up">
          {/* Couple rings symbol */}
          <svg width="72" height="44" viewBox="0 0 72 44" fill="none" aria-hidden="true">
            <circle cx="24" cy="22" r="19" stroke="rgba(255,255,255,0.85)" strokeWidth="2" fill="none" />
            <circle cx="48" cy="22" r="19" stroke="rgba(255,255,255,0.85)" strokeWidth="2" fill="none" />
          </svg>

          <div className="text-white space-y-3">
            <p className="font-display text-[2.6rem] italic leading-[1.15] font-normal">
              Bentornato,<br />ci sei mancato.
            </p>
            <p className="text-sm text-white/60 leading-relaxed max-w-[200px] font-light">
              Accedi per continuare la tua avventura insieme.
            </p>
          </div>
        </div>

        {/* Bottom spacer */}
        <div className="relative z-10 text-white/30 text-xs font-light">
          Boxes · 2025
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 items-center justify-center bg-background px-6 py-12 relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm animate-fade-up">

          {/* Mobile logo */}
          <div className="flex justify-center mb-8 md:hidden">
            <RRLogo size="sm" />
          </div>

          {/* Card */}
          <div className="card-base px-8 py-10 space-y-6">

            {/* Header */}
            <div className="text-center space-y-1.5">
              <h1 className="font-display text-[2rem] font-normal tracking-tight text-foreground">
                Accedi
              </h1>
              <p className="text-sm text-muted-foreground">
                Inserisci le tue credenziali per accedere
              </p>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg text-center animate-in fade-in zoom-in duration-300">
                {errorMessage}
              </div>
            )}

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email">Indirizzo email</Label>
                <div className="relative group">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground
                               transition-colors duration-200 group-focus-within:text-primary z-10 pointer-events-none"
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="pl-9"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative group">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground
                               transition-colors duration-200 group-focus-within:text-primary z-10 pointer-events-none"
                  />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex justify-end">
                  <a
                    href="#"
                    className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors duration-200"
                  >
                    Hai dimenticato la password?
                  </a>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-primary hover:bg-[#9d6268] shadow-[0_2px_14px_rgba(180,117,122,0.38)]
                           hover:shadow-[0_4px_20px_rgba(180,117,122,0.48)] transition-all duration-200"
              >
                {loginMutation.isPending ? 'Accedendo...' : 'Accedi'}
              </Button>
            </form>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground/60">oppure</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Register link */}
            <p className="text-center text-sm text-muted-foreground">
              Non hai un account?{' '}
              <Link
                to="/register"
                className="font-medium text-primary hover:text-primary/80 hover:underline transition-colors duration-200"
              >
                Crea un account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
