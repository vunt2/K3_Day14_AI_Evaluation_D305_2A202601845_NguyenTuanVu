/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#07111f",
        surface: {
          DEFAULT: "#0f1c2e",
          light: "#17263a",
          lighter: "#1e3047",
        },
        brand: {
          primary: "#38bdf8",
          secondary: "#818cf8",
          accent: "#c084fc",
        },
        status: {
          success: "#22c55e",
          warning: "#f59e0b",
          danger: "#ef4444",
          neutral: "#64748b",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
