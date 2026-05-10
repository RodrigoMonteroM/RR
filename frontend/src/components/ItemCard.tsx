import { useState } from 'react';
import { Pencil, Trash2, Heart } from 'lucide-react';
import { toast } from 'sonner';
import type { Item } from '@/types';
import ConfirmDialog from './ConfirmDialog';
import EditItemModal from './EditItemModal';

interface ItemCardProps {
  item: Item;
  onUpdate: (id: string, content: string) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
  onToggle: (id: string, completed: boolean) => Promise<unknown>;
}

export function ItemCard({ item, onUpdate, onDelete, onToggle }: ItemCardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const date = new Date(item.createdAt).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const handleDelete = async () => {
    try {
      await onDelete(item.id);
      toast.success('Ricordo eliminato');
    } catch {
      toast.error('Errore nell\'eliminazione del ricordo');
    }
  };

  const handleToggle = async () => {
    try {
      await onToggle(item.id, !item.completed);
    } catch {
      toast.error('Errore nell\'aggiornamento dello stato');
    }
  };

  return (
    <div className="group card-base px-5 py-4 animate-fade-up transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(180,117,122,0.10)]">
      <div className="flex items-start gap-3">
        {/* Toggle completato */}
        <button
          onClick={handleToggle}
          className={`mt-0.5 shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
            item.completed
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10'
          }`}
          title={item.completed ? 'Marcato come preferito' : 'Marca come preferito'}
        >
          {item.completed ? <Heart size={12} fill="currentColor" /> : <Heart size={12} />}
        </button>

        <div className="flex-1 min-w-0">
          <p
            className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
              item.completed ? 'text-muted-foreground line-through opacity-60' : 'text-foreground'
            }`}
          >
            {item.content}
          </p>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-[11px] md:text-xs text-muted-foreground/70">
              <span className="font-medium text-primary/80">@{item.createdBy.nickname}</span>
              <span>·</span>
              <span>{date}</span>
            </div>

            <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setShowEdit(true)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                title="Modifica"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => setShowDelete(true)}
                className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Elimina"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditItemModal
        open={showEdit}
        onClose={() => setShowEdit(false)}
        item={item}
        onUpdate={onUpdate}
      />

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Elimina ricordo"
        message="Sei sicuro di voler eliminare questo ricordo? Questa azione non può essere annullata."
        confirmText="Elimina"
        variant="destructive"
      />
    </div>
  );
}
