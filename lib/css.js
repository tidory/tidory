const cssesc = require('cssesc')
const { css } = require('js-beautify')
const postcss = require('postcss')
const Extractor = require('./extractor')

module.exports = class {
  /**
   * @param {import('cheerio').CheerioAPI} $
   * @param {object} postCssConfig
   */
  constructor ($, postCssConfig) {
    this.css = new Extractor($).extract('style')
    this.postCssConfig = postCssConfig
  }

  /**
   * Get Css
   *
   * @returns {Promise<*>}
   */
  async get () {
    await this.transform()

    return this.css
  }

  /**
   * Transform Css
   */
  async transform () {
    (await this.postcss()).cssesc().beautify()
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
   * PostCSS
   *
   * @returns {this}
   */
  async postcss () {
    this.css = await postcss(this.postCssConfig.plugins)
      .process(this.css, { from: undefined, to: undefined })
      .then(result => result.css)

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
