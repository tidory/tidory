const babel = require('@babel/core')
const { js } = require('js-beautify')
const Extractor = require('./extractor')

module.exports = class {
  /**
   * @param {import('cheerio').CheerioAPI} $
   */
  constructor ($) {
    this.js = new Extractor($).extract('script:not([src])')
  }

  /**
   * Get Js
   *
   * @returns {string}
   */
  get () {
    this.transform()

    return this.js
  }

  /**
   * Transform
   */
  transform () {
    this.babel().beautify()
  }

  /**
   * Babel
   *
   * @returns {this}
   */
  babel () {
    this.js = babel.transformSync(this.js, {
      presets: [[require.resolve('@babel/preset-env'), { modules: false }]]
    }).code

    return this
  }

  /**
   * Beautify
   *
   * @returns {this}
   */
  beautify () {
    this.js = js(this.js, {
      indent_size: 2,
      space_before_conditional: true,
      max_preserve_newlines: '-1'
    })

    return this
  }
}
