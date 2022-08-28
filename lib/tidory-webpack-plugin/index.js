const path = require('path')
const fs = require('fs')
const cheerio = require('cheerio')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Html = require('./html')
const Js = require('./js')
const Css = require('./css')

const tidoryConfig = require('../../tidory.config')

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
   */
  constructor (env) {
    this.env = env
  }

  /**
   * Apply tidory-webpack-plugin
   *
   * @param {object} compiler
   */
  apply (compiler) {
    compiler.hooks.compilation.tap('TidoryWebpackPlugin', compilation => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('TidoryWebpackPlugin', async (data, callback) => {
        this.$ = cheerio.load(data.html)

        await this.css()
        this.js()

        data.html = await this.html()

        callback(null, data)
      })
    })
    compiler.hooks.done.tap('TidoryWebpackPlugin', () => {
      if (this.env.production) {
        fs.writeFileSync(path.join(tidoryConfig.path.dist, tidoryConfig.path.stylesheet), this.style)
        fs.writeFileSync(path.join(tidoryConfig.path.dist, tidoryConfig.path.script), this.script)
      }
    })
  }

  /**
   * Set style
   *
   * @returns {void}
   */
  async css () {
    this.style = await new Css(this.$).get()

    if (this.env.production || this.env.preview) {
      /**
       * Preview?
       *
       * CSS will be sent to tistory server diractly by `TistorySkin.change()` method.
       * in order to access CSS, need to include './style.css'.
       */
      this.$('head').append(`<link rel="stylesheet" href="${tidoryConfig.path.stylesheet}">`)
    } else {
      this.$('head').append(`<style>${this.style}</style>`)
    }
  }

  /**
   * Set script
   *
   * @returns {void}
   */
  js () {
    this.script = new Js(this.$).get()

    if (this.env.preview || this.env.development) {
      this.$('body').append(`<script>${this.script}</script>`)
    } else {
      this.$('head').append(`<script defer src="${tidoryConfig.path.script}">`)
    }
  }

  /**
   * Get HTML
   *
   * @returns {string|Promise<*>}
   */
  async html () {
    const html = new Html(this.$)

    if (this.env.preview) {
      return await html.preview(this.style)
    }

    return html.get()
  }
}
