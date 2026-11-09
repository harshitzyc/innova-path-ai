/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          500: '#334e68',
          800: '#102a43',
          900: '#061523',
        },
        saffron: '#FF9933',
        indiaGreen: '#138808',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}