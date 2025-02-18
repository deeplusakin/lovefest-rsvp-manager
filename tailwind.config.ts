
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1A1F2C",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#8E9196",
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#9b87f5",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#D6BCFA",
          foreground: "#1A1F2C",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        serif: ["Italiana", ...fontFamily.serif],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
