/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
   
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust this based on your file structure
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Your primary color
      },backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
      }
    }}

}