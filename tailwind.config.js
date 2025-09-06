/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { brand: { 600: "#2563eb", 700: "#1d4ed8" } },
      boxShadow: { soft: "0 10px 24px rgba(2,6,23,.08)" }
    }
  },
  plugins: [],
}
