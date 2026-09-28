/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glitch: {
          ink: '#050505',
          panel: '#0A0D14',
          surface: '#101420',
          card: '#0D111A',
          green: '#00FF66',
          'green-dark': '#00CC52',
          'green-light': '#33FF85',
          muted: '#737373',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        primary: {
          DEFAULT: '#00FF66',
          dark: '#00CC52',
          light: '#33FF85',
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
        },
        background: {
          DEFAULT: '#050505',
          dark: '#050505',
        },
        card: {
          DEFAULT: '#0A0D14',
          dark: '#0A0D14',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#A3A3A3',
          muted: '#737373',
        },
        success: {
          DEFAULT: '#00FF66',
          light: '#DCFCE7',
          dark: '#15803D',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
          dark: '#D97706',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
          dark: '#B91C1C',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(255, 255, 255, 0.1)',
        },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Anton', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.4)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.6)',
        'card-hover': '0 10px 30px -4px rgba(0, 255, 102, 0.15)',
        'glitch-glow': '0 0 25px rgba(0, 255, 102, 0.45)',
        'glitch-glow-sm': '0 0 12px rgba(0, 255, 102, 0.35)',
        'glitch-glow-lg': '0 0 45px rgba(0, 255, 102, 0.55)',
      },
    },
  },
  plugins: [],
}
