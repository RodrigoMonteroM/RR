interface AvatarProps {
  initials: string
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({ initials, size = 'md' }: AvatarProps) {
  const dim =
    size === 'sm' ? 'w-8 h-8 text-xs' :
    size === 'lg' ? 'w-12 h-12 text-base' :
                   'w-10 h-10 text-sm'

  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}
      style={{ background: 'linear-gradient(135deg, #B4757A 0%, #D4A5A8 100%)' }}
    >
      {initials}
    </div>
  )
}
