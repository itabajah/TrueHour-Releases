/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        deep: "var(--color-deep)",
        surface: "var(--color-surface)",
        card: "var(--color-card)",
        primary: {
          DEFAULT: "#0f3460",
          light: "#3b82f6",
        },
        accent: {
          DEFAULT: "#e94560",
          hover: "#c23152",
        },
        muted: "var(--color-muted)",
        success: "#27ae60",
        body: "var(--color-body-text)",
        heading: "var(--color-heading)",
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
