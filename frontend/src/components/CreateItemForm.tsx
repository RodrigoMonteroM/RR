import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreateItemFormProps {
  onSubmit: (content: string) => Promise<unknown>;
  isLoading?: boolean;
}

export function CreateItemForm({ onSubmit, isLoading }: CreateItemFormProps) {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 2000;

  // auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;
    await onSubmit(trimmed);
    setContent('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card-base px-4 py-3 flex items-end gap-3 animate-fade-up-1"
    >
      <div className="flex-1 min-w-0">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Scrivi un ricordo..."
          maxLength={maxLength}
          rows={1}
          className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none py-1"
        />
        <div className="flex justify-end mt-1">
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

      <Button
        type="submit"
        size="icon"
        disabled={!content.trim() || isLoading}
        className="shrink-0 rounded-full bg-primary hover:bg-primary/90 shadow-[0_2px_12px_rgba(180,117,122,0.30)] disabled:opacity-40 disabled:shadow-none"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send size={16} />
        )}
      </Button>
    </form>
  );
}
