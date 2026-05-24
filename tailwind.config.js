/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff8f0',
          100: '#ffedd5',
          200: '#ffd9a8',
          300: '#ffb866',
          400: '#ff9933',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        gold: {
          400: '#ffd700',
          500: '#f5c518',
          600: '#d4a017',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
