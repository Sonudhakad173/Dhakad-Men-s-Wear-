/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: "#C6A75E",
        emerald: "#0F3D3E",
      },
      boxShadow: {
        "soft-xl": "0 18px 45px rgba(15, 61, 62, 0.14)",
      },
      backgroundImage: {
        "lux-gradient": "linear-gradient(135deg, rgba(15,61,62,0.18), rgba(198,167,94,0.18))",
      },
    },
  },
  plugins: [],
};