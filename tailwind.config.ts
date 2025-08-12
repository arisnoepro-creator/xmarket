import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        muted: "#6B7280",
        brand: { light: "#E5C9A7", DEFAULT: "#E17A3C", dark: "#784F2B" },
        bg: "#FAF7F2",
        card: "#FFFFFF"
      },
      borderRadius: { xl: "14px", "2xl": "18px" }
    }
  },
  plugins: []
} satisfies Config;