import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  // ─── Dark mode ────────────────────────────────────────────────────────────
  darkMode: ['class'],

  // ─── Archivos donde Tailwind busca clases ─────────────────────────────────
  content: ['./index.html', './src/**/*.{ts,tsx}'],

  theme: {
    // ─── Container global ─────────────────────────────────────────────────
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },

    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      // ─── Colores (variables CSS de shadcn) ──────────────────────────────
      // Se definen como hsl(var(--nombre)) para que shadcn pueda
      // sobreescribirlos por tema sin tocar el config.
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },

      // ─── Border radius ────────────────────────────────────────────────
      // Usa --radius para que sea consistente con el tema shadcn
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // ─── Animaciones (usadas por componentes shadcn como Accordion) ───
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.55s cubic-bezier(0.16,1,0.3,1) both',
        'fade-up-1': 'fade-up 0.55s cubic-bezier(0.16,1,0.3,1) 0.1s both',
        'fade-up-2': 'fade-up 0.55s cubic-bezier(0.16,1,0.3,1) 0.2s both',
        'fade-in': 'fade-in 0.4s ease-out both',
        'float': 'float 5s ease-in-out infinite',
      },
    },
  },

  plugins: [tailwindcssAnimate],
}

export default config
