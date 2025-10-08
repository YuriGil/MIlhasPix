/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/styles/**/*.{css,scss}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E90FF",
        "primary-light": "#CAE6FB",
        "primary-bg": "#F6FBFF",
        "success-bg": "#D1FAE5",
        "success-text": "#065F46",
        "info-bg": "#C1D8EE",
        "info-text": "#002040",
        border: "#D9D9D9",
        muted: "#6B7280",
      },
      fontFamily: {
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
        dm: ["DM Sans", "sans-serif"],
      },
      boxShadow: {
        focus: "0 0 0 3px rgba(30,144,255,0.25)",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
