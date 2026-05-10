import { createPortal } from 'react-dom'
import { X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive'
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Conferma',
  cancelText = 'Annulla',
  variant = 'default',
}: ConfirmDialogProps) {
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-sm my-auto bg-card rounded-2xl border border-border/50 shadow-[0_8px_40px_rgba(180,117,122,0.15)] animate-in zoom-in-95 fade-in duration-200 max-h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            {variant === 'destructive' && (
              <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle size={16} className="text-destructive" />
              </div>
            )}
            <h2 className="font-display text-lg font-medium text-foreground">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {message}
          </p>

          <div className="flex gap-3 mt-5">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              {cancelText}
            </Button>
            <Button
              variant={variant === 'destructive' ? 'destructive' : 'default'}
              className="flex-1"
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
