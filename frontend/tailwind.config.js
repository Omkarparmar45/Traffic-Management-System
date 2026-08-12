/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'os-bg': '#0f141e',
        'os-card': '#1a202c',
        'os-blue': '#2563eb',
        'os-blue-hover': '#1d4ed8',
        'os-text': '#e2e8f0',
        'os-text-muted': '#94a3b8',
        'os-green': '#10b981',
        'os-red': '#ef4444',
        'os-yellow': '#f59e0b'
      }
    },
  },
  plugins: [],
}