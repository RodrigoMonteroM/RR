import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import type { Item } from '@/types';

interface EditItemModalProps {
  open: boolean;
  onClose: () => void;
  item: Item;
  onUpdate: (id: string, content: string) => Promise<unknown>;
}

export default function EditItemModal({ open, onClose, item, onUpdate }: EditItemModalProps) {
  const [content, setContent] = useState(item.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxLength = 2000;

  useEffect(() => {
    setContent(item.content);
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();

    if (!trimmed) {
      toast.error('Il contenuto non può essere vuoto');
      return;
    }

    if (trimmed === item.content) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      await onUpdate(item.id, trimmed);
      toast.success('Ricordo aggiornato');
      onClose();
    } catch {
      toast.error('Errore nell\'aggiornamento del ricordo');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

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
              <FileText size={16} className="text-primary" />
            </div>
            <h2 className="font-display text-lg font-medium text-foreground">
              Modifica ricordo
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
            <Label htmlFor="edit-item-content">Contenuto</Label>
            <textarea
              id="edit-item-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={maxLength}
              rows={5}
              autoFocus
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
            <div className="flex justify-end">
              <span
                className={`text-[10px] tabular-nums ${
                  content.length > maxLength * 0.9
                    ? 'text-destructive'
                    : 'text-muted-foreground/50'
                }`}
              >
                {content.length}/{maxLength}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="flex-1 bg-primary hover:bg-primary/90 shadow-[0_2px_12px_rgba(180,117,122,0.30)]"
            >
              {isSubmitting ? 'Salvataggio...' : 'Salva'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
