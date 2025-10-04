const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font--geistsans)"],
      },
      keyframes: {
        "fade-in": {
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          },
        },
        blink: {
          "0%": { opacity: 0.2 },
          "20%": { opacity: 1 },
          "100%": { opacity: 0.2 },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-in-out",
        blink: "blink 1.4s infinite both",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "animation-delay": (value) => {
            return {
              animationDelay: value,
            };
          },
        },
        {
          values: theme("transitionDelay"),
        }
      );
    }),
  ],
};
