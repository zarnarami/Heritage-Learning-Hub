/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        royal: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          800: '#1e3a8a',
          900: '#0f2c59',
          950: '#071630',
        },
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
        gold: {
          100: '#fef9c3',
          200: '#fef08a',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          amber: '#d4af37',
        },
        cream: {
          50: '#fdfbf7',
          100: '#f8f5ee',
          200: '#f1ede2',
          300: '#e7e0d0',
        },
        warmbrown: {
          800: '#451a03',
          900: '#381404',
        },
      },
      fontFamily: {
        serif: ['"Cinzel"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'mandala-pattern': "radial-gradient(#d4af37 0.75px, transparent 0.75px), radial-gradient(#d4af37 0.75px, #0f2c59 0.75px)",
      },
    },
  },
  plugins: [],
};
