const path = require('path')
const fs = require('fs')
const cheerio = require('cheerio')
const Html = require('./lib/html')
const Js = require('./lib/js')
const Css = require('./lib/css')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * Tidory webpack tidory-webpack-plugin
 *
 * process.env.NODE_ENV
 * -> development
 * -> preview
 * -> production
 */
module.exports = class {
  /**
   * Create tidory webpack tidory-webpack-plugin instance
   *
   * @param {object} env
   * @param {object} config
   */
  constructor (env, config) {
    this.env = env
    this.config = config
  }

  /**
   * Apply tidory-webpack-plugin
   *
   * @param {object} compiler
   */
  apply (compiler) {
    compiler.hooks.compilation.tap('TidoryWebpackPlugin', compilation => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('TidoryWebpackPlugin', this.transform.bind(this))
    })
    compiler.hooks.done.tap('TidoryWebpackPlugin', this.assets.bind(this))
  }

  /**
   * Create asserts (style.css, script.js)
   */
  assets () {
    if (this.env.production) {
      fs.writeFileSync(path.join(this.config.path.dist, this.config.path.stylesheet), this.style)
      fs.writeFileSync(path.join(this.config.path.dist, this.config.path.script), this.script)
    }
  }

  /**
   * Transform
   *
   * @param data
   * @param callback
   * @returns {Promise<void>}
   */
  async transform (data, callback) {
    this.$ = cheerio.load(data.html)

    data.html = await this.css().js().html()
    callback(null, data)
  }

  /**
   * Set style
   *
   * @returns {this}
   */
  css () {
    this.style = new Css(this.$).get()

    if (this.env.production || this.env.preview) {
      /**
       * Preview?
       *
       * CSS will be sent to tistory server diractly by `TistorySkin.change()` method.
       * in order to access CSS, need to include './style.css'.
       */
      this.$('head').append(`<link rel="stylesheet" href="${this.config.path.stylesheet}">`)
    } else {
      this.$('head').append(`<style>${this.style}</style>`)
    }

    return this
  }

  /**
   * Set script
   *
   * @returns {this}
   */
  js () {
    this.script = new Js(this.$).get()

    if (this.env.preview || this.env.development) {
      this.$('body').append(`<script>${this.script}</script>`)
    } else {
      this.$('head').append(`<script defer src="${this.config.path.script}">`)
    }

    return this
  }

  /**
   * Get HTML
   *
   * @returns {Promise<*>}
   */
  async html () {
    const html = new Html(this.$)

    if (this.env.preview) {
      return await html.preview(this.style, this.config)
    }

    return html.get()
  }
}
