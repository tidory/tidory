const TistorySkin = require('tistory-skin')
const pretty = require('pretty')
const he = require('he')

const tidoryConfig = require('../tidory.config')

/**
 * HTML
 *
 * @param {CheerioStatic} $ - Document
 * @param {Object} env - Webpack environment variables
 * @param {String} css - Css string
 * @param {String} js- Javascript string
 *
 * @return {String}
 */
module.exports = async ($, env, css, js) => {
  if (env.MODE === 'build' || env.MODE === 'production' || env.MODE === 'preview') {
    $('head').append(`<link rel="stylesheet" href="${tidoryConfig.path.public.stylesheet}">`)
  } else {
    $('head').append(`<style>${css}</style>`)
  }
  if (env.MODE === 'preview' || env.MODE === 'development') {
    $('body').append(`<script type="text/javascript">${js}</script>`)
  } else {
    $('body').append(`<script type="text/javascript" src="${tidoryConfig.path.public.script}">`)
  }
  if (env.MODE === 'preview') {
    /** Tistory Skin */
    const skin = new TistorySkin(tidoryConfig.url, tidoryConfig.ts_session)
    await skin.prepare()
    await skin.change($.html(), css, true)
    /**
     * FOR PREVIEW
     *
     * Replace TISTORY CDN PATH to local for preview
     *
     * <img src="https://tistory1.daumcdn.net/tistory/2710108/skin/images/logo.png" /> -> <img src="images/logo.png" />
     */
    return (await skin.preview(tidoryConfig.preview.mode)).replace(
      /(src|href)=["']https?:\/\/tistory[0-9]{1}.daumcdn.net\/tistory\/[0-9]*\/skin\/(images\/.*?)["']/gim,
      '$1="$2"'
    )
  } else if (env.MODE === 'production') {
    return he.decode(pretty($.html(), { ocd: false }))
  } else {
    return $.html()
  }
}
