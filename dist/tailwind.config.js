/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#000000', // Black background
        'surface': '#1A1A1A',   // A slightly lighter black for cards
        'primary': '#8A2BE2',   // Violet for primary actions and highlights
        'text-primary': '#FFFFFF',
        'text-secondary': '#A9A9A9',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};