const js = require('@eslint/js')
const globals = require('globals')

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
]
