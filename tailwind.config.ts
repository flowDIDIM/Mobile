import { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#4F96FF",
        secondary: "#1875FF",
        error: "#FF4F52",

        main: "#F1F3F3", // gray-50
        sub: "#919DA1", // gray-400

        gray: {
          0: "#FFFFFF",
          50: "#F1F3F3",
          100: "#E3E7E8",
          200: "#C8CFD0",
          300: "#ACB6B9",
          400: "#919DA1",
          500: "#75838A",
          600: "#5E686E",
          700: "#464D53",
          800: "#2F3337",
          900: "#17191C",
          950: "#121316",
          1000: "#000000",
        },

        bg: {
          start: "#17191C",
          end: "rgba(28, 34, 45, 0.8)",
        },
      },

      fontSize: {
        // Title styles
        "title-1": ["1.125rem", { lineHeight: "1.5rem", fontWeight: "600" }], // 18/120
        "title-2": ["1rem", { lineHeight: "1.5rem", fontWeight: "600" }], // 16/120
        "title-3": ["0.875rem", { lineHeight: "1.5rem", fontWeight: "600" }], // 14/120
        "title-4": ["0.75rem", { lineHeight: "1.5rem", fontWeight: "600" }], // 12/120

        "desc-1": ["0.75rem", { lineHeight: "1.5rem", fontWeight: "400" }], // 12/120
        "desc-2": ["0.625rem", { lineHeight: "1.5rem", fontWeight: "400" }], // 10/120
        "desc-3": ["0.5rem", { lineHeight: "1.5rem", fontWeight: "400" }], // 8/120

        // Button text
        button: ["0.625rem", { lineHeight: "auto", fontWeight: "600" }], // 10/Auto

        // Body text
        "body-3": ["0.875rem", { lineHeight: "1.5rem", fontWeight: "400" }], // 14/120

        // Headline styles
        "headline-1": [
          "1.75rem",
          { lineHeight: "3.125rem", fontWeight: "600" },
        ], // 28/150
        "headline-2": ["1.5rem", { lineHeight: "3.125rem", fontWeight: "600" }], // 24/150
      },
    },
  },
  plugins: [],
} as const satisfies Config;
