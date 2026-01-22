/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff5005', // Orange from ShaderGradient
          dark: '#e64500',
        },
        accent: '#dbba95', // Tan from ShaderGradient
        background: '#030303',
        surface: 'rgba(255, 255, 255, 0.03)',
        'surface-light': 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'DM Sans', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
        heading: ['Instrument Serif', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'nebula-spin': 'nebula-spin 20s linear infinite',
      },
      keyframes: {
        'nebula-spin': {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        }
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
