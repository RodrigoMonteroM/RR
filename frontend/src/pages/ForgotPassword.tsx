import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import RRLogo from '@/components/ui/Logo'
import { useState, ChangeEvent, FormEvent } from 'react'
import { authService } from '@/services/auth.service'
import { Link } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const mutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onMutate: () => setErrorMessage(null),
    onSuccess: () => setSuccess(true),
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.error || 'Qualcosa è andato storto')
    },
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email.trim()) return
    mutation.mutate(email)
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
          {/* Key icon */}
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
            <circle cx="20" cy="20" r="15" stroke="rgba(255,255,255,0.85)" strokeWidth="2" fill="none" />
            <circle cx="20" cy="20" r="7" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" />
            <line x1="31" y1="31" x2="48" y2="48" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="40" x2="40" y2="46" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
            <line x1="44" y1="44" x2="44" y2="48" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
          </svg>

          <div className="text-white space-y-3">
            <p className="font-display text-[2.6rem] italic leading-[1.15] font-normal">
              Recupera<br />il tuo accesso.
            </p>
            <p className="text-sm text-white/60 leading-relaxed max-w-[200px] font-light">
              Ti invieremo un link per reimpostare la password.
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

            {success ? (
              /* ── Success state ── */
              <div className="space-y-6 text-center">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle size={28} className="text-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="font-display text-[2rem] font-normal tracking-tight text-foreground">
                    Email inviata
                  </h1>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Se l'email esiste nel sistema, riceverai un link per reimpostare la password entro qualche minuto.
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 hover:underline transition-colors duration-200"
                  >
                    <ArrowLeft size={14} />
                    Torna al login
                  </Link>
                </div>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                <div className="text-center space-y-1.5">
                  <h1 className="font-display text-[2rem] font-normal tracking-tight text-foreground">
                    Password dimenticata
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Inserisci la tua email per ricevere il link di recupero
                  </p>
                </div>

                {errorMessage && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-lg text-center animate-in fade-in zoom-in duration-300">
                    {errorMessage}
                  </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
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
                        value={email}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
                    {mutation.isPending ? 'Invio in corso...' : 'Invia link di recupero'}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 hover:underline transition-colors duration-200"
                  >
                    <ArrowLeft size={13} />
                    Torna al login
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
