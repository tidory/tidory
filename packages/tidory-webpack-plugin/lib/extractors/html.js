const { Skin } = require('tistory-skin')
const path = require('path')
const { html } = require('js-beautify')
const { minify } = require('html-minifier-terser')

module.exports = class {
  /**
   * @param {import('cheerio').CheerioAPI} $
   */
  constructor ($) {
    this.html = $.html()
  }

  /**
   * Get Html
   *
   * @returns {Promise<*>}
   */
  async get () {
    await this.transform()

    return this.html
  }

  /**
   * Get preview HTML
   *
   * @param {string} css
   * @param {object} config
   * @param {boolean} old
   * @returns {Promise<*>}
   */
  async preview (css, config, old) {
    const skin = new Skin(config.url, config.ts_session)

    await skin.prepare()
    await skin.upload(path.join(process.cwd(), config.path.docs, 'index.xml'))
    await skin.change(await this.get(), css, true)

    /**
     * FOR PREVIEW
     *
     * Replace TISTORY CDN PATH to local for preview
     *
     * <img src="https://tistory1.daumcdn.net/tistory/2710108/skin/images/logo.png" /> -> <img src="images/logo.png" />
     */
    const { data } = old ? await skin.preview(config.preview) : await skin.preview2(config.preview)

    return data.replace(
      /(src|href)=["']https?:\/\/tistory[0-9]{1}.daumcdn.net\/tistory\/[0-9]*\/skin\/(images\/.*?)["']/gim,
      '$1="$2"'
    )
  }

  /**
   * Transform
   */
  async transform () {
    await this.beautify().minify()
  }

  /**
   * Minify
   *
   * @returns {this}
   */
  async minify () {
    this.html = await minify(this.html, {
      decodeEntities: true,
      collapseBooleanAttributes: true
    })

    return this
  }

  /**
   * Beautify
   *
   * @returns {this}
   */
  beautify () {
    this.html = html(this.html, {
      indent_size: 2,
      indent_inner_html: true
    })

    return this
  }
}
