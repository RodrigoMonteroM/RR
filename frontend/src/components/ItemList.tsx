import { Package, Loader2 } from 'lucide-react';
import type { Item } from '@/types';
import { ItemCard } from './ItemCard';

interface ItemListProps {
  items: Item[];
  isLoading: boolean;
  onUpdate: (id: string, content: string) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
  onToggle: (id: string, completed: boolean) => Promise<unknown>;
}

export function ItemList({ items, isLoading, onUpdate, onDelete, onToggle }: ItemListProps) {
  if (isLoading) {
    return (
      <div className="card-base px-6 py-10 flex flex-col items-center justify-center gap-3 animate-fade-up-1">
        <Loader2 size={24} className="text-muted-foreground animate-spin" />
        <p className="text-sm text-muted-foreground">Caricamento ricordi...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card-base px-6 py-12 animate-fade-up-1">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Package size={24} className="text-primary/60" />
          </div>
          <p className="text-sm text-foreground font-medium mb-1">
            Questo box è vuoto
          </p>
          <p className="text-xs text-muted-foreground">
            Scrivi il tuo primo ricordo qui sopra per iniziare a riempirlo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="animate-fade-up"
          style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
        >
          <ItemCard
            item={item}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        </div>
      ))}
    </div>
  );
}
