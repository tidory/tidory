const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app.pug', './index.pug', './views/**/*.pug'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Noto Sans KR',
          ...defaultTheme.fontFamily.sans
        ]
      }
    }
  },
  plugins: []
}
