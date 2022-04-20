module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        tiny: "0.625rem",
      },
      boxShadow: {
        DEFAULT:
          "0px 2px 2px rgba(0, 0, 0, 0.14), 0px 3px 1px rgba(0, 0, 0, 0.12), 0px 1px 5px rgba(0, 0, 0, 0.2);",
      },
      colors: {
        background: {
          DEFAULT: "#121212",
          header: "#181727",
          card: "#171622",
          cardDark: "#15151E",
          modal: "#19192C",
          popover: "#1A192E",
          blue: "#22214B",
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
        elevation: {
          overlay: "#1C1B35",
        },
        error: "#CD403A",
        info: "#544EFD",
        success: "#55C090",
        purple: {
          DEFAULT: "#544EFD12",
          secondary: "#714EFD",
          dark: "#212249",
        },
        dark: "#CDA7861A",
        gray: {
          DEFAULT: "#121212",
          600: "#747474",
        },
        brand: {
          overlay: "#CDA786",
        },
      },
    },
  },
  plugins: [],
};
