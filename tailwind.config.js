/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#191A1A", // Perplexity Black
        secondary: "#202222", // Perplexity Dark Grey
        tertiary: "#8D9191", // Perplexity Light Grey
        quaterternary: "#249BAA", // Perplexity Blue
      },
    },
  },
  plugins: [],
};
