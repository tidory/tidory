const CleanCss = require('clean-css')
const cssesc = require('cssesc')

const separate = require('./separate')

/**
 * Separate 'style'
 *
 * @param {CheerioStatic} $
 * @param {object} env
 *
 * @return {string}
 */
module.exports = ($, env) => {
  return separate($, 'style', style => {
    style.html(style.html().replace(/content:\s?'([^\\]*?)'/gim,
      (_, content) => `content:'${cssesc(content)}'`
    ))
    style.html(new CleanCss({ format: env.build ? false : 'beautify' }).minify(style.html()).styles)
  }, env)
}
