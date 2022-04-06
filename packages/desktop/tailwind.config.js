module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00AAE0",
          solid: "#544EFD",
        },
        error: "#CD403A",
        info: "#544EFD",
        success: "#55C090",
        purple: "#544EFD12",
        dark: "#CDA7861A",
        gray: "#121212",
      },
    },
    minWidth: {
      sideRight: "347px",
      sideLeft: "305px",
    },
  },
  plugins: [],
};
