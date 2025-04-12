/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // ✅ Must be at the root level
  theme: {
    extend: {
      // Uncomment this section if you want to use CSS variables for dynamic theming
      // colors: {
      //   background: "var(--background)",
      //   foreground: "var(--foreground)",
      // },

      colors: {
        lightHover: "#fcf4ff",
        // darkHover: "#2a004a",
        darkHover: "#1C1917",
        // darkTheme: "#11001f",
        darkTheme: "#1C1917",
      },
      fontFamily: {
        Outfit: ["Outfit", "sans-serif"],
        Ovo: ["Ovo", "serif"],
      },
      boxShadow: {
        black: "4px 4px 0 #000",
        white: "4px 4px 0 #fff",
      },
    },
  },
  plugins: [], // ✅ Also at the root level
};
