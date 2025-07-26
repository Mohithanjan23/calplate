// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#9D50BB',
          light: '#A760C4',
          dark: '#6E48AA',
        },
        'background': '#121212', // Main dark background
        'surface': '#1E1E1E',   // A slightly lighter card background
        'text-primary': '#FFFFFF',
        'text-secondary': '#B3B3B3',
      }
    },
  },
  plugins: [],
}
