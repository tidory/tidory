const cheerio = require('cheerio')

const babel = require('babel-core')
const beautify = require('js-beautify').js

const CleanCss = require('clean-css')
const cssesc = require('cssesc')

const path = require('path')
const fs = require('fs')

const TistorySkin = require('tistory-skin')
const pretty = require('pretty')
const he = require('he')

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
    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-after-html-processing', async (htmlPluginData, callback) => {
        htmlPluginData.html = await this.html(htmlPluginData.html)
        callback(null, htmlPluginData)
      })
    })

    compiler.plugin('done', () => {
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
  extract (tag, callback) {
    const extractor = (extracted, e) => {
      const target = this.$(e)
      const attr = target.attr('scoped')

      target.html(callback(target))

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
   */
  setExtractedStyle () {
    this.extractedCss = this.extract('style', style => {
      const css = style.html().replace(/content:\s?'([^\\]*?)'/gim,
        (_, content) => `content:'${cssesc(content)}'`
      )

      return new CleanCss({ format: 'beautify' }).minify(css).styles
    })
  }

  /**
   * Extract 'script' tag
   */
  setExtractedScript () {
    this.extractedJs = this.extract('script:not([src])', script => {
      const js = babel.transform(script.html(), {
        presets: [
          'babel-preset-es2015-nostrict'
        ].map(require.resolve)
      }).code

      return beautify(js, { indent_size: 2 })
    })
  }

  /**
   * HTML
   */
  async html (html) {
    this.$ = cheerio.load(html)

    this.setExtractedStyle()

    if (this.env.production || this.env.preview) {
      this.$('head').append(`<link rel="stylesheet" href="${tidoryConfig.path.stylesheet}">`)
    } else {
      this.$('head').append(`<style>${this.extractedCss}</style>`)
    }

    this.setExtractedScript()

    if (this.env.preview || this.env.development) {
      this.$('body').append(`<script type="text/javascript">${this.extractedJs}</script>`)
    } else {
      this.$('body').append(`<script type="text/javascript" src="${tidoryConfig.path.script}">`)
    }
    if (this.env.preview) {
      /** Tistory Skin */
      const skin = new TistorySkin(tidoryConfig.url, tidoryConfig.ts_session)

      await skin.prepare()
      await skin.upload(path.join(process.cwd(), tidoryConfig.path.docs, 'index.xml'))
      await skin.change(pretty(he.decode(this.$.html()), { ocd: true }), this.extractedCss, true)

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
      const decodedHtml = he.decode(html)
      return this.env.production ? pretty(decodedHtml, { ocd: true }) : decodedHtml
    }
  }
}
