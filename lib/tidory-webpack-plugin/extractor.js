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
   * @returns {string}
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
    const attr = target.attr(attrName)

    if (typeof attr !== typeof undefined && attr !== false) {
      target.removeAttr(attrName)
    } else {
      extracted += target.html()
      extracted += '\n'

      target.remove()
    }

    return extracted
  }
}
