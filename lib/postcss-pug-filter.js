const postcss = require('postcss')
const path = require('path')

/**
 * PostCSS Pug Filter
 *
 * @param {string} text
 * @param {object} options
 * @returns string|Promise<string>
 */
module.exports = (text, options) => {
  options = {
    config: options.config || 'postcss.config.js'
  }
  const config = require(path.resolve(process.cwd(), options.config))

  return postcss(config.plugins).process(text).css
}
