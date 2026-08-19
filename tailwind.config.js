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
        pixel: {
          dark: '#0f0a1e',
          panel: '#1a103c',
          card: '#261754',
          border: '#4c2889',
          green: '#00ff88',
          yellow: '#ffcc00',
          pink: '#ff0077',
          cyan: '#00e5ff',
          purple: '#9d00ff',
        }
      },
      fontFamily: {
        sans: ['"Pixelify Sans"', 'cursive', 'sans-serif'],
        pixel: ['"Pixelify Sans"', 'cursive', 'sans-serif'],
        arcade: ['"Press Start 2P"', 'cursive', 'monospace'],
        retro: ['"VT323"', 'monospace'],
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0, 0, 0, 0.8), inset -2px -2px 0px 0px rgba(0, 0, 0, 0.4)',
        'pixel-lg': '6px 6px 0px 0px #000000, inset -3px -3px 0px 0px rgba(0,0,0,0.5)',
        'pixel-green': '4px 4px 0px 0px #00ff88',
        'pixel-yellow': '4px 4px 0px 0px #ffcc00',
        'pixel-pink': '4px 4px 0px 0px #ff0077',
      }
    },
  },
  plugins: [],
}
