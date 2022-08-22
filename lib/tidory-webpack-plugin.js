const path = require('path')
const fs = require('fs')
const cheerio = require('cheerio')
const minify = require('html-minifier-terser').minify
const babel = require('@babel/core')
const { js, html, css } = require('js-beautify')
const cssesc = require('cssesc')
const { Skin } = require('tistory-skin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const tidoryConfig = require('../tidory.config')

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

        data.html = await this.style().script().html()
        callback(null, data)
      })
    })
    compiler.hooks.done.tap('TidoryWebpackPlugin', stats => {
      if (this.env.production) {
        fs.writeFileSync(path.join(tidoryConfig.path.dist, tidoryConfig.path.stylesheet), this.extractedCss)
        fs.writeFileSync(path.join(tidoryConfig.path.dist, tidoryConfig.path.script), this.extractedJs)
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
      if (this.env.production) extracted += '\n'

      // Don't need the tag anymore after extracting contents.
      target.remove()
    }

    return extracted
  }

  /**
   * Extractor
   *
   * @param {function(target): string} transformer
   * @returns {function(extracted: string, e: string): string}
   */
  transform (transformer) {
    return (extracted, e) => {
      const target = this.$(e)

      const transformedContent = transformer(target)
      target.html(transformedContent)

      return this.scoped(extracted, target)
    }
  }

  /**
   * Extract
   *
   * @param {string} tag
   * @param {function(target): string} transformer
   *
   * @returns {string}
   */
  extract (tag, transformer) {
    return this.$(tag).get().reduce(this.transform(transformer), '')
  }

  /**
   * Extract 'style' tag
   *
   * @returns {string}
   */
  extractedStyle () {
    return this.extract('style', style => {
      const r = style.html().replace(
        /content:\s?'([^\\]*?)'/gim,
        (_, content) => `content:'${cssesc(content)}'`
      )

      return css(r, { indent_size: 2, end_with_newline: true })
    })
  }

  /**
   * Extract 'script' tag
   *
   * @returns {string}
   */
  extractedScript () {
    return this.extract('script:not([src])', script => {
      return js(babel.transformSync(script.html(), {
        presets: [[require.resolve('@babel/preset-env'), { modules: false }]]
      }).code, { indent_size: 2, end_with_newline: true })
    })
  }

  /**
   * Script
   *
   * @returns {this}
   */
  script () {
    this.extractedJs = this.extractedScript()

    if (this.env.preview || this.env.development) {
      this.$('body').append(`<script>${this.extractedJs}</script>`)
    } else {
      this.$('head').append(`<script defer src="${tidoryConfig.path.script}">`)
    }

    return this
  }

  /**
   * Style
   *
   * @returns {this}
   */
  style () {
    this.extractedCss = this.extractedStyle()

    if (this.env.production || this.env.preview) {
      /**
       * Preview?
       *
       * CSS will be sent to tistory server diractly by `TistorySkin.change()` method.
       * in order to access CSS, need to include './style.css'.
       */
      this.$('head').append(`<link rel="stylesheet" href="${tidoryConfig.path.stylesheet}">`)
    } else {
      this.$('head').append(`<style>${this.extractedCss}</style>`)
    }

    return this
  }

  /**
   * HTML
   *
   * @returns {Promise<*|string>}
   */
  async html () {
    const minifiedHTML = minify(this.$.html(), {
      decodeEntities: true,
      collapseBooleanAttributes: true
    })

    const htmlBeautifierOptions = {
      indent_size: 2,
      indent_inner_html: true
    }

    if (this.env.preview) {
      /** Tistory Skin */
      const skin = new Skin(tidoryConfig.url, tidoryConfig.ts_session)

      await skin.prepare()
      await skin.upload(path.join(process.cwd(), tidoryConfig.path.docs, 'index.xml'))
      await skin.change(html(minifiedHTML, htmlBeautifierOptions), this.extractedCss, true)

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
    } else {
      return this.env.production ? html(minifiedHTML, htmlBeautifierOptions) : minifiedHTML
    }
  }
}
