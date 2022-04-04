module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      minHeight: {
        "24": "96px"
      }
    },
  },

  variants: {
    extend: {
      visibility: ["group-hover"],
    },
  },
};
