/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1e293b',
          red: '#dc2626',
          yellow: '#facc15'
        }
      }
    },
  },
  plugins: [],
}
