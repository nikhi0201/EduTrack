/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36a8f7',
          500: '#0c8ce9',
          600: '#026fc7',
          700: '#0358a1',
          800: '#074b84',
          900: '#0c3f6e',
          950: '#082849',
        },
        slate: {
          850: '#111c2e',
          900: '#0b1321',
          950: '#060a12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'collide-left': 'collideLeft 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'collide-right': 'collideRight 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        collideLeft: {
          '0%': { transform: 'translateX(-120%) scale(0.8)', opacity: '0' },
          '60%': { transform: 'translateX(10%) scale(1.1)', opacity: '1' },
          '100%': { transform: 'translateX(0%) scale(1)', opacity: '1' },
        },
        collideRight: {
          '0%': { transform: 'translateX(120%) scale(0.8)', opacity: '0' },
          '60%': { transform: 'translateX(-10%) scale(1.1)', opacity: '1' },
          '100%': { transform: 'translateX(0%) scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 15px rgba(12, 140, 233, 0.8))' },
          '50%': { opacity: '0.9', filter: 'drop-shadow(0 0 35px rgba(54, 168, 247, 1))' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
