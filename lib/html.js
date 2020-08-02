const path = require('path')

const TistorySkin = require('tistory-skin')
const pretty = require('pretty')
const he = require('he')

const tidoryConfig = require('../tidory.config')

/**
 * HTML
 *
 * @param {CheerioStatic} $
 * @param {string} css
 * @param {string} js
 * @param {object} env
 *
 * @return {string}
 */
module.exports = async ($, css, js, env) => {
  if (env.build || env.production || env.preview) {
    $('head').append(`<link rel="stylesheet" href="${tidoryConfig.path.stylesheet}">`)
  } else {
    $('head').append(`<style>${css}</style>`)
  }
  if (env.preview || env.development) {
    $('body').append(`<script type="text/javascript">${js}</script>`)
  } else {
    $('body').append(`<script type="text/javascript" src="${tidoryConfig.path.script}">`)
  }
  if (env.preview) {
    /** Tistory Skin */
    const skin = new TistorySkin(tidoryConfig.url, tidoryConfig.ts_session)

    await skin.prepare()
    await skin.upload(path.join(process.cwd(), tidoryConfig.path.docs, 'index.xml'))
    await skin.change(pretty(he.decode($.html()), { ocd: true }), css, true)

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
    const html = he.decode($.html())
    return env.production ? pretty(html, { ocd: true }) : html
  }
}
