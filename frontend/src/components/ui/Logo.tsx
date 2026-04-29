export default function RRLogo({ size = 'md' }: { size?: 'sm' | 'md' }) {
    const dim = size === 'sm' ? 40 : 56

    return (
        <div
            className="rounded-full bg-white flex items-center justify-center flex-shrink-0"
            style={{
                width: dim,
                height: dim,
                boxShadow: '0 2px 16px rgba(180,117,122,0.22), 0 1px 3px rgba(180,117,122,0.12)',
            }}
        >
            <svg
                width={dim * 0.58}
                height={dim * 0.48}
                viewBox="0 0 32 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="RR logo"
            >
                <text
                    x="0"
                    y="18"
                    fontFamily="'Cormorant Garamond', Georgia, serif"
                    fontStyle="italic"
                    fontWeight="500"
                    fontSize="20"
                    fill="#B4757A"
                    letterSpacing="1"
                >
                    RR
                </text>
                <line x1="0" y1="21" x2="30" y2="21" stroke="#D4A5A8" strokeWidth="1" opacity="0.7" />
            </svg>
        </div>
    )
}
