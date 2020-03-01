const CleanCss = require('clean-css')
const cssesc = require('cssesc')

const parse = require('./parse')

/**
 * Parse 'style'
 *
 * @param {CheerioStatic} $ - Document
 * @param {Object} env - Webpack environment variables
 *
 * @return {String}
 */
module.exports = ($, env) => {
  let css = parse($, 'style', style => {
    style.html(style.html().replace(/content:\s?'(.*?)'/gim,
      (match, content, offset, string) => `content:'${cssesc(content)}'`
    ))
    if (env.MODE === 'build') {
      style.html((new CleanCss()).minify(style.html()).styles)
    }
  })
  if (env.MODE === 'production') {
    css = new CleanCss({
      format: 'beautify'
    }).minify(css).styles
  }
  return css
}
