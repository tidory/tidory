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
  let separated = new String(),
      scoped = 'scoped'
  ;
  $(tagName).each(function() {
    let target = $(this),
        attr = target.attr(scoped)
    ;
    cb(target);
    if(typeof attr !== typeof undefined && attr !== false) {
      target.removeAttr(scoped);
    } else {
      separated += target.html();
      target.remove();
    }
  })
  return separated;
}