/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme :{
          primary : '#000',
          secondary : 'rgb(22, 22, 22)',
        },
        primary: {
          bg: 'rgba(255, 255, 0, 1)',
          text: '#000',              
        },
        secondary: {
          bg: '#fff', 
          text: '#000',
        },
        dark : '#636363',
        blue : '#091696'
      },
    },
  },
  plugins: [],
}

