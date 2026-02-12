/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Permite alternar o tema usando a classe 'dark'
  theme: {
    extend: {
      // Aqui você pode adicionar cores ou fontes personalizadas no futuro
    },
  },
  plugins: [],
}