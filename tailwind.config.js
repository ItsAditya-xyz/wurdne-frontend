module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      minHeight: {
        "24": "96px"
      },
      colors: {
        "semi-transparent": "rgba(0, 0, 0, 0.5)"
      }
    },
  },

  variants: {
    extend: {
      visibility: ["group-hover"],
    },
  },
};
