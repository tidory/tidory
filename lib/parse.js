/**
 * Parse element with tag name
 *
 * @param {CheerioStatic} $ - Document
 * @param {String} tagName - Tag name
 * @param {Function} cb - Callback with element
 *
 * @return {String}
 */
module.exports = ($, tagName, cb) => {
  const scoped = 'scoped'
  let separated = ''

  $(tagName).each(function () {
    const target = $(this)
    const attr = target.attr(scoped)
    cb(target)
    if (typeof attr !== typeof undefined && attr !== false) {
      target.removeAttr(scoped)
    } else {
      separated += target.html()
      target.remove()
    }
  })
  return separated
}
