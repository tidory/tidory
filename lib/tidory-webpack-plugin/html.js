const { Skin } = require('tistory-skin')
const path = require('path')
const { html } = require('js-beautify')
const { minify } = require('html-minifier-terser')

const tidoryConfig = require('../../tidory.config')

module.exports = class {
  /**
   * @param {import('cheerio').CheerioAPI} $
   */
  constructor ($) {
    this.$ = $
  }

  /**
   * Get Html
   *
   * @returns {Promise<*>}
   */
  async get () {
    return await this.transform(this.$.html())
  }

  /**
   * Get preview HTML
   *
   * @param {string} css
   * @returns {Promise<*>}
   */
  async preview (css) {
    const skin = new Skin(tidoryConfig.url, tidoryConfig.ts_session)

    await skin.prepare()
    await skin.upload(path.join(process.cwd(), tidoryConfig.path.docs, 'index.xml'))
    await skin.change(await this.get(), css, true)

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

  /**
   * Transform
   *
   * @param htmlString
   * @returns {Promise<*>}
   */
  async transform (htmlString) {
    htmlString = await minify(htmlString, {
      decodeEntities: true,
      collapseBooleanAttributes: true
    })

    return html(htmlString, { indent_size: 2, indent_inner_html: true })
  }
}
