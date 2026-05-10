import { Search, Plus, Heart, LogOut, Package, Loader2, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import RRLogo from '@/components/ui/Logo'
import { useAuthStore } from '@/store/auth.store'
import { Avatar } from '@/components/Avatar'
import { SectionHeader } from '@/components/SectionHeader'
import { useEffect, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { User, Box } from '@/types'
import { userService } from '@/services/user.service'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useBoxes } from '@/hooks/useBoxes'
import CreateBoxModal from '@/components/CreateBoxModal'
import EditBoxModal from '@/components/EditBoxModal'
import ConfirmDialog from '@/components/ConfirmDialog'
import { toast } from 'sonner'

export default function HomePage() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showCreateBox, setShowCreateBox] = useState(false);
  const [editingBox, setEditingBox] = useState<Box | null>(null);
  const [deletingBox, setDeletingBox] = useState<Box | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { boxes, isLoading: boxesLoading, deleteBox, changeVisibility } = useBoxes();

  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedSearchQuery.length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const users = await userService.searchUsers(debouncedSearchQuery)
        setSearchResults(users)
      } catch (error) {
        console.error('Error searching users:', error)
      } finally {
        setIsSearching(false)
      }
    }

    fetchUsers()
  }, [debouncedSearchQuery])


  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  const handleDeleteBox = async () => {
    if (!deletingBox) return
    try {
      await deleteBox(deletingBox.id)
      toast.success('Box eliminato')
      setDeletingBox(null)
    } catch {
      toast.error('Errore nell\'eliminazione del box')
    }
  }

  const handleToggleVisibility = async (boxId: string) => {
    try {
      await changeVisibility(boxId)
      toast.success('Visibilità aggiornata')
    } catch {
      toast.error('Errore nel cambiare la visibilità')
    }
  }

  const userInitials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  return (
    <div className="min-h-screen bg-background">

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <nav className="bg-card/75 backdrop-blur-md border-b border-border/50 sticky top-0 z-10 shadow-[0_1px_12px_rgba(180,117,122,0.07)]">
        <div className="max-w-5xl mx-auto px-6 h-15 flex items-center justify-between" style={{ height: '3.75rem' }}>
          <div className="flex items-center gap-3">
            <RRLogo size="sm" />
            <span className="font-display text-xl font-medium text-foreground tracking-wide">RR</span>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2.5">
              <Avatar initials={userInitials} size="sm" />
              <span className="text-sm font-medium text-foreground hidden sm:block">
                {user?.name ?? 'Utente'}
              </span>
            </div>
            <button
              className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
              title="Esci"
              onClick={handleLogout}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">

        {/* ── Main content ────────────────────────────────────────────────── */}
        <main className="flex-1 space-y-5 min-w-0">

          {/* ── Partner search ──────────────────────────────────────────── */}
          <div className="card-base card-hover px-6 py-5 animate-fade-up">
            <SectionHeader title="Cerca un partner" />

            <div className="relative group mb-4">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-primary pointer-events-none z-10"
              />
              <Input
                placeholder="Cerca per nickname o email…"
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Results */}
            <div className="space-y-3">
              {isSearching && (
                <div className="text-center py-4 text-xs text-muted-foreground animate-pulse">
                  Cercando...
                </div>
              )}

              {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  <Search size={24} className="mx-auto mb-2 opacity-20" />
                  Nessun utente trovato
                </div>
              )}

              {searchResults.map((foundUser) => {
                const initials = (foundUser.nickname ?? foundUser.email ?? '?').slice(0, 2).toUpperCase()
                return (
                  <div key={foundUser.id} className="border border-border/60 rounded-xl p-4 flex items-center gap-4 bg-secondary/20 animate-in fade-in slide-in-from-top-1 duration-200">
                    <Avatar initials={initials} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{foundUser.nickname ?? foundUser.email}</p>
                      <p className="text-xs text-muted-foreground truncate">{foundUser.email}</p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-[#9d6268] shadow-[0_2px_12px_rgba(180,117,122,0.30)] text-xs whitespace-nowrap transition-all duration-200"
                    >
                      <Heart size={12} className="mr-1.5" />
                      Invia Richiesta
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── Boxes ───────────────────────────────────────────────────── */}
          <div className="card-base card-hover px-6 py-5 animate-fade-up-1">
            <SectionHeader
              title="Le mie Boxes"
              action={
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-primary/40 text-primary hover:bg-primary/5 hover:border-primary/60 transition-all duration-200"
                  onClick={() => setShowCreateBox(true)}
                >
                  <Plus size={12} className="mr-1" />
                  Crea Box
                </Button>
              }
            />

            {/* Loading */}
            {boxesLoading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={24} className="text-muted-foreground animate-spin" />
              </div>
            )}

            {/* Empty state */}
            {!boxesLoading && boxes.length === 0 && (
              <div className="text-center py-10">
                <Package size={32} className="mx-auto mb-3 text-muted-foreground opacity-30" />
                <p className="text-sm text-muted-foreground mb-1">Nessun box creato</p>
                <p className="text-xs text-muted-foreground/60">
                  Crea il tuo primo box per iniziare a raccogliere ricordi
                </p>
              </div>
            )}

            {/* Box list */}
            {!boxesLoading && boxes.length > 0 && (
              <div className="space-y-2.5">
                {boxes.map(box => (
                  <div
                    key={box.id}
                    className="border border-border/50 rounded-xl p-4 transition-all duration-200 hover:border-primary/30 hover:bg-secondary/20 group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 cursor-pointer"
                        onClick={() => navigate(`/boxes/${box.id}`)}
                      >
                        <Package size={14} className="text-primary" />
                      </div>
                      <span
                        className="font-semibold text-sm text-foreground flex-1 min-w-0 truncate cursor-pointer"
                        onClick={() => navigate(`/boxes/${box.id}`)}
                      >
                        {box.name}
                      </span>

                      {/* Action buttons - always visible on mobile, hover on desktop */}
                      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggleVisibility(box.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-200"
                          title={box.coupleId ? 'Rendi personale' : 'Condividi con la coppia'}
                        >
                          {box.coupleId ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                        <button
                          onClick={() => setEditingBox(box)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-200"
                          title="Modifica"
                        >
                          <Pencil size={12} />
                        </button>
                        <button
                          onClick={() => setDeletingBox(box)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
                          title="Elimina"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {box.description && (
                      <p className="text-xs text-muted-foreground ml-9 truncate">
                        {box.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* ── Sidebar ───────────────────────────────────────────────────────── */}
        <aside className="w-full lg:w-64 space-y-4 flex-shrink-0">

          {/* Profile card */}
          <div className="card-base px-5 py-5 animate-fade-up">
            <div className="flex flex-col items-center text-center gap-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-[0_4px_20px_rgba(180,117,122,0.35)] ring-4 ring-secondary"
                style={{ background: 'linear-gradient(135deg, #B4757A 0%, #D4A5A8 100%)' }}
              >
                {userInitials}
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{user?.name ?? 'Utente'}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{user?.email ?? ''}</p>
              </div>
              <div className="w-full border-t border-border/60 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Stato coppia</span>
                  {user?.couple ? (
                    <span className="font-medium text-primary flex items-center gap-1">
                      <Heart size={10} fill="currentColor" /> Connesso
                    </span>
                  ) : (
                    <span className="text-muted-foreground/50">Non connesso</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats card */}
          <div className="card-base px-5 py-4 animate-fade-up-1">
            <p className="font-display text-base font-normal text-foreground mb-3 tracking-wide">
              Riepilogo
            </p>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Boxes</span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: 'linear-gradient(135deg, #B4757A, #D4A5A8)' }}
                >
                  {boxes.length}
                </span>
              </div>
            </div>
          </div>

          {/* Tips card */}
          <div
            className="rounded-2xl px-5 py-4 text-white animate-fade-up-2 relative overflow-hidden"
            style={{ background: 'linear-gradient(150deg, #9e5a60 0%, #B4757A 50%, #cfa0a4 100%)' }}
          >
            <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />
            <div className="relative z-10">
              <p className="font-display text-base italic font-normal opacity-95 mb-2">Suggerimento</p>
              <p className="text-xs leading-relaxed opacity-80 font-light">
                Cerca il tuo partner per email e invia una richiesta per condividere le tue boxes.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* ── Create Box Modal ──────────────────────────────────────────────── */}
      <CreateBoxModal open={showCreateBox} onClose={() => setShowCreateBox(false)} />

      {/* ── Edit Box Modal ────────────────────────────────────────────────── */}
      {editingBox && (
        <EditBoxModal
          open={!!editingBox}
          onClose={() => setEditingBox(null)}
          box={editingBox}
        />
      )}

      {/* ── Delete Confirmation ───────────────────────────────────────────── */}
      <ConfirmDialog
        open={!!deletingBox}
        onClose={() => setDeletingBox(null)}
        onConfirm={handleDeleteBox}
        title="Elimina Box"
        message={deletingBox ? `Sei sicuro di voler eliminare "${deletingBox.name}"? Questa azione non può essere annullata.` : ''}
        confirmText="Elimina"
        variant="destructive"
      />
    </div>
  )
}
