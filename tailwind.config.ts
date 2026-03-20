import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Glassmorphism base colors
        glass: {
          light: 'rgba(255, 255, 255, 0.7)',
          lighter: 'rgba(255, 255, 255, 0.85)',
          dark: 'rgba(0, 0, 0, 0.1)',
          darker: 'rgba(0, 0, 0, 0.05)',
        },
        // Neumorphism highlight/shadow
        neuro: {
          light: 'rgba(255, 255, 255, 0.9)',
          shadow: 'rgba(0, 0, 0, 0.15)',
        },
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        // Glassmorphism shadows
        'glass-sm': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-md': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
        'glass-lg': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        // Neumorphism shadows
        'neuro-sm': '4px 4px 8px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.7)',
        'neuro-md': '6px 6px 12px rgba(0, 0, 0, 0.12), -6px -6px 12px rgba(255, 255, 255, 0.8)',
        'neuro-lg': '8px 8px 16px rgba(0, 0, 0, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.85)',
        // Dark mode neumorphism
        'neuro-dark-sm': '4px 4px 8px rgba(0, 0, 0, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.05)',
        'neuro-dark-md': '6px 6px 12px rgba(0, 0, 0, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.08)',
        'neuro-dark-lg': '8px 8px 16px rgba(0, 0, 0, 0.7), -8px -8px 16px rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        display: ['var(--font-orbitron)', 'sans-serif'],
        body:    ['var(--font-orbitron)', 'sans-serif'],
        sans:    ['var(--font-orbitron)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
