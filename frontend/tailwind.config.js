/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5ff',
          100: '#dbe6fe',
          500: '#3b5bdb',
          600: '#2f4bc2',
          700: '#263c9c',
        },
      },
    },
  },
  plugins: [],
};
