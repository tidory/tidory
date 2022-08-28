const babel = require('@babel/core')
const { js } = require('js-beautify')
const Extractor = require('./extractor')

module.exports = class {
  /**
   * {cheerio.Cheerio} $
   */
  constructor ($) {
    this.extractor = new Extractor($)
  }

  /**
   * Get extracted js
   *
   * @returns {string}
   */
  get () {
    const script = this.extractor.extract('script:not([src])')

    return this.transform(script)
  }

  /**
   * Transform
   *
   * @param {string} script
   * @returns {string}
   */
  transform (script) {
    script = babel.transformSync(script, {
      presets: [[require.resolve('@babel/preset-env'), { modules: false }]]
    }).code

    return js(script, { indent_size: 2, space_before_conditional: true, max_preserve_newlines: '-1' })
  }
}
