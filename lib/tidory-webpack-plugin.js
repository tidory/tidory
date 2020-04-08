const cheerio = require('cheerio')

const script = require('./script')
const style = require('./style')
const resource = require('./resource')
const html = require('./html')

/**
 * Tidory webpack plugin
 *
 * process.env.NODE_ENV
 * -> development
 * -> preview
 * -> build
 * -> production
 */
module.exports = class {
  /**
   * Create tidory webpack plugin instance
   *
   * @param {object} env
   */
  constructor (env) {
    /**
     * Webpack Environment
     *
     * @member {object}
     */
    this.env = env

    /**
     * @member {object} $
     */
    this.$ = null

    /**
     * @member {object} css
     */
    this.css = null

    /**
     * @member {string} js
     */
    this.js = null
  }

  /**
   * Apply plugin
   *
   * @param {object} compiler
   */
  apply (compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-after-html-processing', async (htmlPluginData, cb) => {
        this.$ = cheerio.load(htmlPluginData.html)
        this.css = style(this.$, this.env)
        this.js = script(this.$, this.env)
        htmlPluginData.html = await html(this.$, this.css, this.js, this.env)
        cb(null, htmlPluginData)
      })
    })
    compiler.plugin('done', () => resource(this.css, this.js, this.env))
  }
}
