module.exports = class {
  /**
   * @param {import('cheerio').CheerioAPI} $
   */
  constructor ($) {
    this.$ = $
  }

  /**
   * Extract
   *
   * @param selector
   * @returns {unknown}
   */
  extract (selector) {
    return this.$(selector).get().reduce((extracted, element) => {
      return this.process(extracted, this.$(element), 'scoped')
    }, '')
  }

  /**
   * Process
   *
   * @param {string} extracted
   * @param {import('cheerio').Cheerio<Element>} target
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
}
