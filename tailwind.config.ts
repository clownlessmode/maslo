import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "mdx-components.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-vk-sans)", ...fontFamily.sans],
        display: ["var(--font-coolvetica)"],
      },
      fontSize: {
        sm: [
          "0.75rem",
          {
            lineHeight: "0.788rem",
            letterSpacing: "-0.04em",
          },
        ],
        md: [
          "0.875rem",
          {
            lineHeight: "0.913rem",
            letterSpacing: "-0.04em",
          },
        ],
        lg: [
          "1.125rem",
          {
            lineHeight: "1.013rem",
            letterSpacing: "-0.04em",
          },
        ],
        "2xl": [
          "1.5rem",
          {
            lineHeight: "1.35rem",
            letterSpacing: "-0.04em",
          },
        ],
        "3xl": [
          "1.875rem",
          {
            lineHeight: "1.688rem",
            letterSpacing: "-0.04em",
          },
        ],
        "4xl": [
          "2.25rem",
          {
            lineHeight: "2.7rem",
            letterSpacing: "-0.04em",
          },
        ],
      },
      screens: {
        sm: "536px",
      },
      colors: {
        brand: "#FFD972",
        background: {
          100: "#1B1B1B",
          200: "#141414",
        },
      },
      animation: {
        spin: "spin 1s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
