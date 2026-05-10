import { Lock, AlertCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import RRLogo from '@/components/ui/Logo'
import { useState, ChangeEvent, FormEvent } from 'react'
import { authService } from '@/services/auth.service'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: () => authService.resetPassword(token!, password),
    onMutate: () => setErrorMessage(null),
    onSuccess: () => {
      navigate('/login', { state: { message: 'Password aggiornata! Puoi accedere con la nuova password.' } })
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.error || 'Qualcosa è andato storto')
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setErrorMessage('Le password non coincidono')
      return
    }
    if (password.length < 6) {
      setErrorMessage('La password deve avere almeno 6 caratteri')
      return
    }
    mutation.mutate()
  }

  /* ── No token in URL ── */
  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="card-base px-8 py-10 space-y-6 text-center">
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle size={28} className="text-destructive" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="font-display text-[2rem] font-normal tracking-tight text-foreground">
                Link non valido
              </h1>
              <p className="text-sm text-muted-foreground">
                Il link di recupero non è valido o è scaduto.
              </p>
            </div>
            <Link
              to="/forgot-password"
              className="inline-block text-sm text-primary hover:text-primary/80 hover:underline transition-colors duration-200"
            >
              Richiedi un nuovo link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">

      {/* ── Left panel ── */}
      <div
        className="hidden md:flex md:w-2/5 flex-col justify-between px-12 py-10 relative overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #9e5a60 0%, #B4757A 45%, #cfa0a4 100%)' }}
      >
        <div className="absolute inset-0 bg-dot-grid pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full border border-white/8 pointer-events-none" />

        <div className="relative z-10 animate-fade-in">
          <RRLogo size="sm" />
        </div>

        <div className="relative z-10 space-y-8 animate-fade-up">
          {/* Shield icon */}
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
            <path
              d="M26 4 L44 12 L44 28 C44 38 36 45 26 48 C16 45 8 38 8 28 L8 12 Z"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M18 26 L23 31 L34 20"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="text-white space-y-3">
            <p className="font-display text-[2.6rem] italic leading-[1.15] font-normal">
              Nuova<br />password.
            </p>
            <p className="text-sm text-white/60 leading-relaxed max-w-[200px] font-light">
              Scegli una password sicura per proteggere il tuo account.
            </p>
          </div>
        </div>

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

          <div className="card-base px-8 py-10 space-y-6">
            <div className="text-center space-y-1.5">
              <h1 className="font-display text-[2rem] font-normal tracking-tight text-foreground">
                Reimposta password
              </h1>
              <p className="text-sm text-muted-foreground">
                Inserisci la tua nuova password
              </p>
            </div>

            {errorMessage && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg text-center animate-in fade-in zoom-in duration-300">
                {errorMessage}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="password">Nuova password</Label>
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
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

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
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-primary hover:bg-[#9d6268] shadow-[0_2px_14px_rgba(180,117,122,0.38)]
                           hover:shadow-[0_4px_20px_rgba(180,117,122,0.48)] transition-all duration-200"
              >
                {mutation.isPending ? 'Aggiornamento...' : 'Aggiorna password'}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 hover:underline transition-colors duration-200"
              >
                Torna al login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
