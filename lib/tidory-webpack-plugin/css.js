const wd = process.cwd()

const path = require('path')
const cssesc = require('cssesc')
const { css } = require('js-beautify')
const postcss = require('postcss')
const Extractor = require('./extractor')

const postCssConfig = require(path.resolve(wd, 'postcss.config.js'))

module.exports = class {
  /**
   * @param {import('cheerio').CheerioAPI} $
   */
  constructor ($) {
    this.extractor = new Extractor($)
  }

  /**
   * Get Css
   *
   * @returns {Promise<*>}
   */
  async get () {
    const style = this.extractor.extract('style')

    return await this.transform(style)
  }

  /**
   * Transform Css
   *
   * @param {string} style
   * @returns {Promise<string>}
   */
  async transform (style) {
    style = style.replace(/content:\s?'([^\\]*?)'/gim, (_, content) => `content:'${cssesc(content)}'`)
    style = await postcss(postCssConfig.plugins)
      .process(style, { from: undefined, to: undefined })
      .then(result => result.css)

    return css(style, { indent_size: 2 })
  }
}
