import { useState, ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Mail, Lock, User } from 'lucide-react'
import { RegisterFormData } from '@/types/auth'
import { authService } from '@/services/auth.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import RRLogo from '@/components/ui/Logo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { toast } from 'sonner'

export default function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<RegisterFormData>({
    nickname: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  })

  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) => {
      return authService.register(data)
    },
    onMutate: () => {
      setErrorMessage(null)
    },
    onSuccess: () => {
      toast.success('Benvenuto! Il tuo account è pronto. Ora accedi.')
      setTimeout(() => navigate('/login'), 2000)
    },
    onError: (error: any) => {
      const data = error.response?.data;
      if (data?.errors && data.errors.length > 0) {
        setErrorMessage(data.errors[0].message)
      } else {
        setErrorMessage(data?.message || 'Registrazione fallita. Riprova.')
      }
    }
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formData.password !== confirmPassword) {
      setErrorMessage('Le password non corrispondono')
      return
    }
    registerMutation.mutate(formData)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null)
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
              La vostra storia<br />inizia qui.
            </p>
            <p className="text-sm text-white/60 leading-relaxed max-w-[200px] font-light">
              Crea il tuo account e inizia la tua avventura insieme.
            </p>
          </div>
        </div>

        {/* Bottom */}
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
                Crea un account
              </h1>
              <p className="text-sm text-muted-foreground">
                Compila i campi per registrarti
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
              {/* First + Last Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">Nome</Label>
                  <div className="relative group">
                    <User
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground
                                 transition-colors duration-200 group-focus-within:text-primary z-10 pointer-events-none"
                    />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Nome"
                      className="pl-9"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Cognome</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Cognome"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Nickname */}
              <div className="space-y-1.5">
                <Label htmlFor="nickname">Nickname</Label>
                <div className="relative group">
                  <User
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground
                               transition-colors duration-200 group-focus-within:text-primary z-10 pointer-events-none"
                  />
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="Il tuo nickname"
                    className="pl-9"
                    value={formData.nickname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

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
                    required
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
                    required
                  />
                </div>
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Conferma password</Label>
                <div className="relative group">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground
                               transition-colors duration-200 group-focus-within:text-primary z-10 pointer-events-none"
                  />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      setErrorMessage(null)
                    }}
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-primary hover:bg-[#9d6268] shadow-[0_2px_14px_rgba(180,117,122,0.38)]
                           hover:shadow-[0_4px_20px_rgba(180,117,122,0.48)] transition-all duration-200"
              >
                {registerMutation.isPending ? 'Registrazione in corso...' : 'Crea account'}
              </Button>
            </form>

            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground/60">oppure</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Login link */}
            <p className="text-center text-sm text-muted-foreground">
              Hai già un account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/80 hover:underline transition-colors duration-200"
              >
                Accedi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
