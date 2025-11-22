/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'primary': '#DD0000',
        'primary-yellow': '#FFCC00',
        'primary-black': '#000000',
        'background-light': '#F8F9FA',
        'background-dark': '#121212',
        'surface-light': '#FFFFFF',
        'surface-dark': '#1A1A1A',
        'text-primary-light': '#1A1A1A',
        'text-primary-dark': '#FFFFFF',
        'text-secondary-light': '#6B7280',
        'text-secondary-dark': '#9CA3AF',
        'border-light': '#E5E7EB',
        'border-dark': '#374151',
        'accent-red': '#DD0000',
        'accent-green': '#22c55e',
      },
      fontFamily: {
        'display': ['Lexend', 'sans-serif'],
        'sans': ['Work Sans', 'Noto Sans', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
}
