const wd = process.cwd()

const path = require('path')
const fs = require('fs')
const cheerio = require('cheerio')
const minify = require('html-minifier-terser').minify
const babel = require('@babel/core')
const { js, html, css } = require('js-beautify')
const cssesc = require('cssesc')
const { Skin } = require('tistory-skin')
const postcss = require('postcss')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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

        data.html = await this.html()
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
   * Extract
   *
   * @param {string} tag
   * @param {(extracted: string, e: string) => string} transformer
   */
  extract (tag, transformer) {
    const extractor = (extracted, e) => {
      const target = this.$(e)

      const transformedContent = transformer(target)
      target.html(transformedContent)

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

    return this.$(tag).get().reduce(extractor, '')
  }

  /**
   * Extract 'style' tag
   */
  getExtractedStyle () {
    return this.extract('style', style => {
      let r = style.html().replace(/content:\s?'([^\\]*?)'/gim, (_, content) => `content:'${cssesc(content)}'`)

      r = postcss(postCssConfig.plugins).process(r, {
        map: postCssConfig.map,
        syntax: postCssConfig.syntax,
        parser: postCssConfig.parser,
        stringifier: postCssConfig.stringifier
      }).css

      return css(r, { indent_size: 2, end_with_newline: true })
    })
  }

  /**
   * Extract 'script' tag
   */
  getExtractedScript () {
    return this.extract('script:not([src])', script => {
      return js(babel.transformSync(script.html(), {
        presets: [[require.resolve('@babel/preset-env'), { modules: false }]]
      }).code, { indent_size: 2, end_with_newline: true })
    })
  }

  /**
   * HTML
   */
  async html () {
    this.extractedJs = this.getExtractedScript()

    if (this.env.preview || this.env.development) {
      this.$('body').append(`<script>${this.extractedJs}</script>`)
    } else {
      this.$('head').append(`<script defer src="${tidoryConfig.path.script}">`)
    }

    this.extractedCss = this.getExtractedStyle()

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
