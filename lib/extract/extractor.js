module.exports = class {
  /**
   * @param {import('cheerio').CheerioAPI} $
   */
  constructor ($) {
    this.$ = $
    this.attrName = 'fixed'
  }

  /**
   * Extract
   *
   * @param selector
   * @returns {string}
   */
  extract (selector) {
    return this.$(selector).get().reduce(this.process.bind(this), '')
  }

  /**
   * Process
   *
   * @param {string} extracted
   * @param {HTMLElement} element
   * @returns {string}
   */
  process (extracted, element) {
    const target = this.$(element)

    if (this.hasAttr(target)) {
      target.removeAttr(this.attrName)
    } else {
      extracted += target.html()
      extracted += '\n'

      target.remove()
    }

    return extracted
  }

  /**
   * Has attr
   *
   * @param {import('cheerio').Element} target
   * @returns {boolean}
   */
  hasAttr (target) {
    return target.attr(this.attrName) !== undefined
  }
}
