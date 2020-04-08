const UglifyJS = require('uglify-es')
const babel = require('babel-core')
const beautify = require('js-beautify').js

const separate = require('./separate')

/**
 * Separate 'script'
 *
 * @param {CheerioStatic} $
 * @param {object} env
 *
 * @return {string}
 */
module.exports = ($, env) => {
  return separate($, 'script:not([src])', js => {
    js.html(babel.transform(js.html(), {
      presets: [
        'babel-preset-es2015-nostrict'
      ].map(require.resolve)
    }).code)
    js.html(env.build ? UglifyJS.minify(js.html()).code : beautify(js.html(), { indent_size: 2 }))
  }, env)
}
