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
          light: '#fdf2f8',
          DEFAULT: '#fbcfe8',
          dark: '#f472b6',
        },
        secondary: {
          light: '#f3e8ff',
          DEFAULT: '#e9d5ff',
          dark: '#c084fc',
        },
        success: '#22c55e',
        warning: '#f97316',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
