module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#121212",
          header: "#181727",
          card: "#171622",
          modal: "#19192C",
          popover: "#1A192E",
        },
        surface: {
          DEFAULT: "#121212",
          light10: "#19182a",
        },
        primary: {
          DEFAULT: "#00AAE0",
          solid: "#544EFD",
          overlay: "#57B1FF",
          medium: "#A5A1FF",
        },
        secondary: {
          DEFAULT: "#0067E0",
          overlay: "#A5A5A5",
        },
        error: "#CD403A",
        info: "#544EFD",
        success: "#55C090",
        purple: "#181725",
        dark: "#CDA7861A",
        gray: "#121212",
      },
    },
  },
  plugins: [],
};
