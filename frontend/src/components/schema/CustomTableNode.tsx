import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { TableNode } from '@/data/schemaData'
import { Database, Key, Link2 } from 'lucide-react'

const TypeColors: Record<string, string> = {
  String: 'text-emerald-600 dark:text-emerald-400',
  'String?': 'text-emerald-500/60 dark:text-emerald-400/50',
  DateTime: 'text-sky-600 dark:text-sky-400',
  'DateTime?': 'text-sky-500/60 dark:text-sky-400/50',
  Int: 'text-amber-600 dark:text-amber-400',
}

function fieldTypeColor(type: string) {
  return TypeColors[type] ?? 'text-foreground'
}

export default function CustomTableNode({ data }: NodeProps<TableNode>) {
  return (
    <div className="min-w-[220px] rounded-xl border border-border/60 bg-card shadow-[0_2px_20px_rgba(180,117,122,0.1),0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden group hover:shadow-[0_6px_32px_rgba(180,117,122,0.18),0_2px_6px_rgba(0,0,0,0.06)] transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-gradient-to-r from-primary/8 to-primary/3">
        <Database size={14} className="text-primary shrink-0" />
        <span className="font-display text-[1.05rem] italic tracking-tight text-foreground">
          {data.label}
        </span>
      </div>

      {/* Fields */}
      <div className="divide-y divide-border/20">
        {data.fields.map((field) => (
          <div
            key={field.name}
            className="flex items-center gap-2 px-4 py-1.5 text-xs hover:bg-primary/5 transition-colors duration-150"
          >
            {/* Icon */}
            <span className="shrink-0 w-3.5 flex items-center justify-center">
              {field.isPk ? (
                <Key size={11} className="text-amber-500" />
              ) : field.isFk ? (
                <Link2 size={11} className="text-primary" />
              ) : (
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              )}
            </span>

            {/* Name */}
            <span
              className={`flex-1 font-mono ${
                field.isPk
                  ? 'font-semibold text-amber-700 dark:text-amber-300'
                  : field.isFk
                    ? 'font-medium text-primary'
                    : 'text-foreground'
              }`}
            >
              {field.name}
            </span>

            {/* Modifiers */}
            <span className="flex gap-1 shrink-0">
              {field.isPk && (
                <span className="px-1 py-px rounded text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                  PK
                </span>
              )}
              {field.isFk && (
                <span className="px-1 py-px rounded text-[9px] font-bold uppercase tracking-wider bg-primary/15 text-primary">
                  FK
                </span>
              )}
              {field.isUnique && !field.isPk && (
                <span className="px-1 py-px rounded text-[9px] font-bold uppercase tracking-wider bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                  UQ
                </span>
              )}
            </span>

            {/* Type */}
            <span className={`font-mono text-[10px] ${fieldTypeColor(field.type)}`}>
              {field.type}
            </span>
          </div>
        ))}
      </div>

      {/* Handles */}
      {data.fields
        .filter((f) => f.isPk || f.isFk)
        .map((field) => (
          <Handle
            key={field.name}
            type="source"
            position={Position.Right}
            id={`${field.name}-src`}
            style={{ top: 'auto', background: 'hsl(355 30% 58%)', width: 8, height: 8, border: '2px solid hsl(var(--card))' }}
            className="!right-[-4px]"
          />
        ))}
      {data.fields
        .filter((f) => f.isFk)
        .map((field) => (
          <Handle
            key={field.name}
            type="target"
            position={Position.Left}
            id={field.name}
            style={{ top: 'auto', background: 'hsl(355 30% 58%)', width: 8, height: 8, border: '2px solid hsl(var(--card))' }}
            className="!left-[-4px]"
          />
        ))}
    </div>
  )
}