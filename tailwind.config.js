/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customRed: "#DC2626",
        customBlack: "#000000",
        customWhite: "#FFFFFF"
      }
    }
  },
  plugins: []
};