import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useBoxes } from '@/hooks/useBoxes'
import { toast } from 'sonner'
import type { Box } from '@/types'

interface EditBoxModalProps {
  open: boolean
  onClose: () => void
  box: Box
}

export default function EditBoxModal({ open, onClose, box }: EditBoxModalProps) {
  const [name, setName] = useState(box.name)
  const [description, setDescription] = useState(box.description ?? '')
  const { updateBox } = useBoxes()

  useEffect(() => {
    setName(box.name)
    setDescription(box.description ?? '')
  }, [box])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('Il nome è obbligatorio')
      return
    }

    try {
      await updateBox({
        id: box.id,
        name: name.trim(),
        description: description.trim() || undefined,
      })
      toast.success('Box aggiornato con successo')
      onClose()
    } catch {
      toast.error('Errore nell\'aggiornamento del box')
    }
  }

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md my-auto bg-card rounded-2xl border border-border/50 shadow-[0_8px_40px_rgba(180,117,122,0.15)] animate-in zoom-in-95 fade-in duration-200 max-h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package size={16} className="text-primary" />
            </div>
            <h2 className="font-display text-lg font-medium text-foreground">
              Modifica Box
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-box-name">Nome</Label>
            <Input
              id="edit-box-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-box-description">Descrizione <span className="text-muted-foreground font-normal">(opzionale)</span></Label>
            <Input
              id="edit-box-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Annulla
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 shadow-[0_2px_12px_rgba(180,117,122,0.30)]"
            >
              Salva
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
