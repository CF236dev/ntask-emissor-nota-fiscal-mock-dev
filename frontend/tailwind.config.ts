import type { Config } from "tailwindcss";

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        "ntask-blue": "#2C5CC5",
        "ntask-blue-dark": "#1e3d8a",
      },
    },
  },
  plugins: [],
} satisfies Config;
