module.exports = class {
  /**
   * @param {import('cheerio').CheerioAPI} $
   */
  constructor ($) {
    this.$ = $
    this.content = ''
    this.ids = []
  }

  /**
   * Get Extracted Content
   *
   * @returns {string}
   */
  get (selector) {
    this.extract(selector)

    return this.content
  }

  /**
   * Extract
   *
   * @param {string} selector
   */
  extract (selector) {
    this.$(selector).each((_, element) => {
      const $element = this.$(element)

      this.once($element)
    })

    this.$(selector).each((_, element) => {
      const $element = this.$(element)

      this.fixed($element)
    })
  }

  /**
   * Once
   *
   * @param {import('cheerio').Cheerio<Element>} $element
   */
  once ($element) {
    const attrName = 'once'

    if (! this.hasAttr($element, attrName)) {
      return
    }

    const id = $element.attr(attrName)

    if (this.ids.includes(id)) {
      return
    }

    this.ids.push(id)

    $element.removeAttr(attrName)
    this.$(`[${attrName}="${id}"]`).remove()
  }

  /**
   * Fixed
   *
   * @param {import('cheerio').Cheerio<Element>} $element
   */
  fixed ($element) {
    const attrName = 'fixed'

    if (this.hasAttr($element, attrName)) {
      $element.removeAttr(attrName)

      return
    }

    this.content += `${$element.html()}\n`

    $element.remove()
  }

  /**
   * Has attr
   *
   * @param {import('cheerio').Cheerio<Element>} $element
   * @param {string} attrName
   * @returns {boolean}
   */
  hasAttr ($element, attrName) {
    return $element.attr(attrName) !== undefined
  }
}
