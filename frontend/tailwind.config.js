/** @type {import('tailwindcss').Config} */
const plugin = require('tailwind-scrollbar');
module.exports = {
  content:  ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        saira: ["Saira Stencil One", 'serif'],
        indie: ["Indie Flower", 'serif']
      },
    },
  },
  plugins: [plugin],
}

