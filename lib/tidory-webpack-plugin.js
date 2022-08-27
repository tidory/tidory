const wd = process.cwd()

const path = require('path')
const fs = require('fs')
const cheerio = require('cheerio')
const minify = require('html-minifier-terser').minify
const babel = require('@babel/core')
const { js, html, css } = require('js-beautify')
const cssesc = require('cssesc')
const { Skin } = require('tistory-skin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const postcss = require('postcss')

const tidoryConfig = require('../tidory.config')
const postCssConfig = require(path.resolve(wd, 'postcss.config.js'))

/**
 * Tidory webpack plugin
 *
 * process.env.NODE_ENV
 * -> development
 * -> preview
 * -> production
 */
module.exports = class {
  /**
   * Create tidory webpack plugin instance
   *
   * @param {object} env
   */
  constructor (env) {
    this.env = env
  }

  /**
   * Apply plugin
   *
   * @param {object} compiler
   */
  apply (compiler) {
    compiler.hooks.compilation.tap('TidoryWebpackPlugin', compilation => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('TidoryWebpackPlugin', async (data, callback) => {
        this.$ = cheerio.load(data.html)

        data.html = this.setStyle(await this.css())
          .setScript(this.js())
          .html()

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
   * Scoped
   *
   * @param {string} extracted
   * @param target
   * @returns {string}
   */
  scoped (extracted, target) {
    /**
     * When using 'style' and 'script' with 'scoped' attribute,
     * the tags will not extract to associated asset files
     *
     * @example
     * <style scoped> ... </style>
     */
    const attr = target.attr('scoped')

    if (typeof attr !== typeof undefined && attr !== false) {
      /**
       * If tag is used with 'scoped',
       * don't need to extract.
       */
      target.removeAttr('scoped')
    } else {
      extracted += target.html()
      extracted += '\n'

      // Don't need the tag anymore after extracting contents.
      target.remove()
    }

    return extracted
  }

  /**
   * Extract
   *
   * @param {string} tag
   *
   * @returns {string}
   */
  extract (tag) {
    return this.$(tag).get().reduce((extracted, element) => this.scoped(extracted, this.$(element)), '')
  }

  /**
   * js-beautify options
   *
   * @returns {object}
   */
  beautifierOptions () {
    return {
      css: { indent_size: 2 },
      js: { indent_size: 2, space_before_conditional: true, max_preserve_newlines: '-1' },
      html: { indent_size: 2, indent_inner_html: true }
    }
  }

  /**
   * Get extracted css
   *
   * @returns {string}
   */
  async css () {
    let style = this.extract('style')

    style = style.replace(
      /content:\s?'([^\\]*?)'/gim,
      (_, content) => `content:'${cssesc(content)}'`
    )

    style = await postcss(postCssConfig.plugins)
      .process(style, { from: undefined, to: undefined })
      .then(result => {
        return result.css
      })

    return css(style, this.beautifierOptions().css)
  }

  /**
   * Get extracted js
   *
   * @returns {string}
   */
  js () {
    let script = this.extract('script:not([src])')

    script = babel.transformSync(script, {
      presets: [[require.resolve('@babel/preset-env'), { modules: false }]]
    }).code

    return js(script, this.beautifierOptions().js)
  }

  /**
   * Set style
   *
   * @param {string} style
   * @returns {this}
   */
  setStyle (style) {
    if (this.env.production || this.env.preview) {
      /**
       * Preview?
       *
       * CSS will be sent to tistory server diractly by `TistorySkin.change()` method.
       * in order to access CSS, need to include './style.css'.
       */
      this.$('head').append(`<link rel="stylesheet" href="${tidoryConfig.path.stylesheet}">`)
    } else {
      this.$('head').append(`<style>${style}</style>`)
    }

    this.style = style

    return this
  }

  /**
   * Set script
   *
   * @param {string} script
   * @returns {this}
   */
  setScript (script) {
    if (this.env.preview || this.env.development) {
      this.$('body').append(`<script>${script}</script>`)
    } else {
      this.$('head').append(`<script defer src="${tidoryConfig.path.script}">`)
    }

    this.script = script

    return this
  }

  /**
   * Get HTML
   *
   * @returns {Promise<*|string>}
   */
  html () {
    const minifiedHTML = minify(this.$.html(), {
      decodeEntities: true,
      collapseBooleanAttributes: true
    })

    if (this.env.preview) {
      return this.previewHtml(minifiedHTML)
    }

    return this.env.production
      ? html(minifiedHTML, this.beautifierOptions().html)
      : minifiedHTML
  }

  /**
   * Get preview HTML
   *
   * @param rawHtml
   * @returns {Promise<*>}
   */
  async previewHtml (rawHtml) {
    const skin = new Skin(tidoryConfig.url, tidoryConfig.ts_session)

    await skin.prepare()
    await skin.upload(path.join(process.cwd(), tidoryConfig.path.docs, 'index.xml'))
    await skin.change(html(rawHtml, this.beautifierOptions().html), this.style, true)

    /**
     * FOR PREVIEW
     *
     * Replace TISTORY CDN PATH to local for preview
     *
     * <img src="https://tistory1.daumcdn.net/tistory/2710108/skin/images/logo.png" /> -> <img src="images/logo.png" />
     */
    const { data } = await skin.preview(tidoryConfig.preview)

    return data.replace(
      /(src|href)=["']https?:\/\/tistory[0-9]{1}.daumcdn.net\/tistory\/[0-9]*\/skin\/(images\/.*?)["']/gim,
      '$1="$2"'
    )
  }
}
