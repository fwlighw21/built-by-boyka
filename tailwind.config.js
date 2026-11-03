/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary, #7547F5)",
          hover: "var(--color-primary-hover, #6532eb)",
          glow: "var(--color-primary-glow, rgba(117, 71, 245, 0.45))",
        },
        secondary: {
          DEFAULT: "var(--color-secondary, #9B7BFF)",
          hover: "var(--color-secondary-hover, #8963ff)",
          glow: "var(--color-secondary-glow, rgba(155, 123, 255, 0.35))",
        },
        accent: {
          DEFAULT: "var(--color-accent, #C9B9FF)",
          glow: "var(--color-accent-glow, rgba(201, 185, 255, 0.35))",
        },
        highlight: {
          DEFAULT: "var(--color-highlight, #F0EAFF)",
        },
        brandDeep: {
          DEFAULT: "#5424D8",
        },
        dark: {
          950: "#05030a",
          900: "#0a0614",
          850: "#0e071e",
          800: "#160c2e",
          700: "#241548",
          600: "#38236d",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans, Inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading, Outfit)", "system-ui", "sans-serif"],
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-reverse": "floatReverse 10s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
        "spin-slow": "spin 25s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-20px) translateX(15px)" },
        },
        floatReverse: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(25px) translateX(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.08)" },
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-glow": "0 0 35px -5px var(--color-primary-glow, rgba(6, 182, 212, 0.3))",
        "glass-hover": "0 14px 40px -10px rgba(0, 0, 0, 0.6), 0 0 25px -5px var(--color-primary-glow, rgba(6, 182, 212, 0.4))",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
