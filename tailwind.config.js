/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: { primary: "#1E90FF" },
      fontFamily: { sans: ["'Plus Jakarta Sans'", "sans-serif"] }
    }
  },
  plugins: []
};
export default config;