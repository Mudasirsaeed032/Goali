module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      animation: {
        // for shadcn/ui components
        accordion: 'accordion-down 0.2s ease-out',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
}
