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
        saffron: {
          50: '#fff8f0',
          100: '#feedd6',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        wisdom: {
          50: '#f4f6fd',
          100: '#e5eafd',
          500: '#3b82f6',
          800: '#1e1b4b',
          900: '#0f172a',
        },
        kids: {
          pink: '#ec4899',
          yellow: '#f59e0b',
          cyan: '#06b6d4',
          green: '#10b981',
          purple: '#8b5cf6'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        handwritten: ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
}
