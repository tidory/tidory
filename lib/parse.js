/**
 * @param {string} $ - TIDORY Document
 * @param {string} tagName - Tag name
 * @param {Function} preprocessor - Preprocessor with element
 */
module.exports = ($, tagName, preprocessor) => {
  let separated = new String();
      scoped = 'scoped'
  ;
  $(tagName).each(function() {
    let target = $(this),
        attr = target.attr(scoped)
    ;
    preprocessor(target);
    if(typeof attr !== typeof undefined && attr !== false) {
      target.removeAttr(scoped);
    } else {
      separated += target.html();
      target.remove();
    }
  })
  return separated;
}