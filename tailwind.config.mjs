/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Marca Valdivia Automotores
        navy: {
          DEFAULT: "#1f2a52",
          light: "#2c3a6b",
          dark: "#151d3a",
        },
        brand: {
          DEFAULT: "#1f8fd6",
          light: "#3ba7ea",
          dark: "#1673ad",
        },
        ink: "#0f1526",
        cloud: "#f4f6fb",
        gold: "#f2b705",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 20px 45px -20px rgba(31, 42, 82, 0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(31, 143, 214, 0.5)" },
          "70%": { boxShadow: "0 0 0 14px rgba(31, 143, 214, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(31, 143, 214, 0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "pulse-ring": "pulse-ring 2s infinite",
      },
    },
  },
  plugins: [],
}
