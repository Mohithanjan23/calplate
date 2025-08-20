// D:\calplate\calplate-frontend\tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      colors: {
        brand: {
          green: "#16a34a",
          blue: "#2563eb",
        },
      },
    },
  },
  plugins: [],
};
