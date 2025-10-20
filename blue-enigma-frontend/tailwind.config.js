/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          deep: '#004E7C',
          medium: '#0077B6',
          light: '#90E0EF',
        },
        teal: {
          accent: '#00B4D8',
        },
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0,0,0,0.1)',
        medium: '0 4px 14px rgba(0,0,0,0.15)',
        large: '0 10px 25px rgba(0,0,0,0.2)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // 👈 for markdown formatting
  ],
};
