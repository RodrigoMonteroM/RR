interface SectionHeaderProps {
  title: string
  action?: React.ReactNode
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <span className="w-1 h-4 rounded-full bg-primary/60 flex-shrink-0" />
        <h2 className="font-display text-xl font-normal text-foreground tracking-wide">{title}</h2>
      </div>
      {action}
    </div>
  )
}
