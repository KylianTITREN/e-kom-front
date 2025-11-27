import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette inspirée de Capuchadou
        primary: {
          DEFAULT: "#3d2817", // Marron foncé principal
          dark: "#2a1a0f",
          light: "#5a3d28",
        },
        accent: {
          DEFAULT: "#b8906b", // Cuivre/doré
          light: "#d4b896",
          dark: "#9a7555",
        },
        background: {
          DEFAULT: "#ffffff", // Blanc
          light: "#fafafa", // Gris très clair
          card: "#ffffff",
        },
        text: {
          DEFAULT: "#3d2817",
          secondary: "#6b5d4f",
          muted: "#9a8a7a",
        },
      },
      fontFamily: {
    title: ["Cormorant Garamond", "serif"],
    sans: ["Montserrat", "ui-sans-serif", "system-ui"],
    paragraph: ["Montserrat", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
export default config;
