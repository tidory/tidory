const cssesc = require('cssesc')
const { css } = require('js-beautify')
const Extractor = require('./extractor')

module.exports = class {
  /**
   * @param {import('cheerio').CheerioAPI} $
   */
  constructor ($) {
    this.css = new Extractor($).extract('style')
  }

  /**
   * Get Css
   *
   * @returns {string}
   */
  get () {
    this.transform()

    return this.css
  }

  /**
   * Transform Css
   */
  transform () {
    this.cssesc().beautify()
  }

  /**
   * Cssesc
   *
   * @returns {this}
   */
  cssesc () {
    this.css = this.css.replace(
      /content:\s?'([^\\]*?)'/gim,
      (_, content) => `content:'${cssesc(content)}'`
    )

    return this
  }

  /**
   * Beautify
   *
   * @returns {this}
   */
  beautify () {
    this.css = css(this.css, { indent_size: 2 })

    return this
  }
}
