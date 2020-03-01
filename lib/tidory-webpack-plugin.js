const cheerio = require('cheerio')

const script = require('./script')
const style = require('./style')
const resource = require('./resource')
const html = require('./html')

/**
 * Tidory webpack plugin
 *
 * env.MODE
 * -> development
 * -> preview
 * -> build
 * -> production
 */
module.exports = class {
  /**
   * Create tidory webpack plugin instance
   *
   * @param {Object} env - Webpack environment variables
   */
  constructor (env) {
    /**
     * @member {Object} env
     */
    this.env = env

    /**
     * @member {Object} $
     */
    this.$ = null

    /**
     * @member {String} css
     */
    this.css = null

    /**
     * @member {String} js
     */
    this.js = null
  }

  /**
   * Apply plugin
   *
   * @param {Object} compiler - Webpack compiler
   */
  apply (compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-after-html-processing', async (htmlPluginData, cb) => {
        this.$ = cheerio.load(htmlPluginData.html)
        this.css = style(this.$, this.env)
        this.js = script(this.$, this.env)
        htmlPluginData.html = await html(this.$, this.env, this.css, this.js)
        cb(null, htmlPluginData)
      })
    })
    compiler.plugin('done', () => resource(this.env, this.css, this.js))
  }
}
