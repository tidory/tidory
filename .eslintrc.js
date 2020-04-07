module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'node/no-deprecated-api': 0
  }
}
