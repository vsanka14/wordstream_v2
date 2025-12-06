/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: "#00ffff",
          pink: "#ff00ff",
          green: "#00ff00",
          purple: "#9d00ff",
          blue: "#0080ff",
          yellow: "#ffff00",
        },
      },
    },
  },
  plugins: [],
};
