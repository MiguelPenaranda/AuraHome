/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'aura-blue': '#D1E9FF',
        'aura-green': '#D1FADF',
        'aura-yellow': '#FEF0C7',
        'aura-red': '#FEE4E2',
        'aura-purple': '#EBE9FE',
        background: '#F9FBFF',
      },
    },
  },
  darkMode: 'media',
  plugins: [],
};
