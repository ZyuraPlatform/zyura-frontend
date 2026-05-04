/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        button: {
          primary: 'bg-primary text-white hover:bg-primary/90',
          secondary: 'rounded-lg border border-white/70 px-5 py-2.5 font-sora text-sm font-semibold text-white transition hover:bg-white/10',
        },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        sora: ['Sora', 'sans-serif'],
        pattaya: ['Pattaya', 'sans-serif'],
      },
      colors: {
        primary: '#063C79',
        dark: '#1C1E23',
        blackLight: '#2b3441',
        brand: '#063C79',
        surface: {
          lemon: '#F6F8E9',
          mint: '#E9F8EF',
          sky: '#E0EAF9',
          pink: '#F8E9F3',
          steel: '#E6EFF2',
          azure: '#E1EEFD',
          lavender: '#E6E9F2',
        },
      },
      backgroundImage: {
        gradient: 'linear-gradient(135deg, #aa3bff 0%, #6b6375 100%)',
        'brand-gradient': 'linear-gradient(to bottom right, #0059C0, #063C79)',
        'brand-gradient-hover': 'linear-gradient(to bottom right, #4397F8, #063C79)',
      },
    },
  },
  plugins: [],
}
