/**
 * Separate
 *
 * @param {CheerioStatic} $
 * @param {string} tagName
 * @param {Function} cb
 * @param {object} env
 *
 * @return {string}
 */
module.exports = ($, tagName, cb, env) => {
  return $(tagName).get().reduce((separated, e) => {
    const target = $(e)
    const attr = target.attr('scoped')
    cb(target)
    if (typeof attr !== typeof undefined && attr !== false) {
      target.removeAttr('scoped')
    } else {
      separated += target.html()
      if (env.production) {
        separated += '\n'
      }
      target.remove()
    }
    return separated
  }, '')
}
