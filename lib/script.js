const UglifyJS = require('uglify-es')
const babel = require('babel-core')

const parse = require('./parse')

/**
 * Parse 'script'
 *
 * @param {CheerioStatic} $ - Document
 * @param {Object} env - Webpack environment variables
 *
 * @return {String}
 */
module.exports = ($, env) => {
  return parse($, 'script:not([src])', script => {
    /** to ECMA5 Script */
    script.html(babel.transform(script.html(), {
      presets: [
        'babel-preset-es2015'
      ].map(require.resolve)
    }).code)
    if (env.MODE === 'build') {
      script.html(UglifyJS.minify(script.html()).code)
    }
  })
}
