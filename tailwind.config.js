/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#0c0d0f",
          900: "#121316",
          850: "#16171c",
          800: "#1c1d24",
          700: "#272932",
          600: "#363945",
          500: "#4f5263",
          400: "#75798e",
          300: "#9ea3b8",
          200: "#c7cbe0",
          100: "#e5e7f2",
        },
        purple: {
          brand: "#9333ea",
          light: "#a855f7",
          muted: "#7e22ce",
          soft: "#c084fc",
          dim: "#3b1754",
        },
        emerald: {
          brand: "#10b981",
          light: "#34d399",
          muted: "#059669",
          soft: "#6ee7b7",
          dim: "#064e3b",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.15)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.15)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
};

