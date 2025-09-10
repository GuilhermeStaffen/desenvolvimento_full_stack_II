module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        sea: '#0ea5a4',
        deepsea: '#065f46',
        accent: '#06b6d4',
        highlight: '#f97316'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      }
    }
  },
  plugins: [],
}
