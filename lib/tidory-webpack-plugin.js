const wd = process.cwd()

const cheerio = require('cheerio')

const babel = require('@babel/core')
const { js, html, css } = require('js-beautify')

const cssesc = require('cssesc')

const path = require('path')
const fs = require('fs')

const TistorySkin = require('tistory-skin')
const he = require('he')

const tidoryConfig = require('../tidory.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const postcss = require('postcss')
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
   * @param {Function} callback
   *
   * @return {string}
   */
  extract (tag, transformer) {
    const extractor = (extracted, e) => {
      const target = this.$(e)

      const transformedContent = transformer(target)
      target.html(transformedContent)

      const attr = target.attr('scoped')

      if (typeof attr !== typeof undefined && attr !== false) {
        target.removeAttr('scoped')
      } else {
        extracted += target.html()
        if (this.env.production) extracted += '\n'

        target.remove()
      }

      return extracted
    }

    return this.$(tag).get().reduce(extractor, '')
  }

  /**
   * Extract 'style' tag
   *
   * @return {string}
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
      r = css(r, { indent_size: 2, end_with_newline: true })

      return r
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
    this.extractedCss = this.getExtractedStyle()

    if (this.env.production || this.env.preview) {
      this.$('head').append(`<link rel="stylesheet" href="${tidoryConfig.path.stylesheet}">`)
    } else {
      this.$('head').append(`<style>${this.extractedCss}</style>`)
    }

    this.extractedJs = this.getExtractedScript()

    if (this.env.preview || this.env.development) {
      this.$('body').append(`<script>${this.extractedJs}</script>`)
    } else {
      this.$('body').append(`<script src="${tidoryConfig.path.script}">`)
    }

    const htmlBeautifierOptions = {
      indent_size: 2,
      indent_inner_html: true
    }
    if (this.env.preview) {
      /** Tistory Skin */
      const skin = new TistorySkin(tidoryConfig.url, tidoryConfig.ts_session)

      await skin.prepare()
      await skin.upload(path.join(process.cwd(), tidoryConfig.path.docs, 'index.xml'))
      await skin.change(html(he.decode(this.$.html()), htmlBeautifierOptions), this.extractedCss, true)

      /**
       * FOR PREVIEW
       *
       * Replace TISTORY CDN PATH to local for preview
       *
       * <img src="https://tistory1.daumcdn.net/tistory/2710108/skin/images/logo.png" /> -> <img src="images/logo.png" />
       */
      return (await skin.preview(tidoryConfig.preview)).replace(
        /(src|href)=["']https?:\/\/tistory[0-9]{1}.daumcdn.net\/tistory\/[0-9]*\/skin\/(images\/.*?)["']/gim,
        '$1="$2"'
      )
    } else {
      const decodedHtml = he.decode(this.$.html())
      return this.env.production ? html(decodedHtml, htmlBeautifierOptions) : decodedHtml
    }
  }
}
