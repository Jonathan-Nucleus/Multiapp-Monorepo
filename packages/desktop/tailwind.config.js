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
      },
    },
  },
  plugins: [],
};
