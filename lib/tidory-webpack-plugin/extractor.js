const cheerio = require('cheerio')

module.exports = class {
  /**
   * {cheerio.Cheerio} $
   */
  constructor ($) {
    this.$ = $
  }

  /**
   * Scoped
   *
   * @param {string} extracted
   * @param {cheerio.Cheerio} target
   * @param {string} attrName
   * @returns {string}
   */
  process (extracted, target, attrName) {
    /**
     * When using 'style' and 'script' with <attrName> attribute,
     * the tags will not extract to associated asset files
     *
     * @example
     * <style <attrName>> ... </style>
     */
    const attr = target.attr(attrName)

    if (typeof attr !== typeof undefined && attr !== false) {
      /**
       * If tag is used with <attrName>,
       * don't need to extract.
       */
      target.removeAttr(attrName)
    } else {
      extracted += target.html()
      extracted += '\n'

      // Don't need the tag anymore after extracting contents.
      target.remove()
    }

    return extracted
  }

  /**
   * Extract
   *
   * @param {string} tag
   *
   * @returns {string}
   */
  extract (tag) {
    return this.$(tag).get().reduce((extracted, element) => {
      return this.process(extracted, this.$(element), 'scoped')
    }, '')
  }
}
