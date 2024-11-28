module.exports = class {
  /**
   * @param {import('cheerio').CheerioAPI} $
   */
  constructor ($) {
    this.$ = $
    this.attrName = 'once'
  }

  /**
   * Run Once Filter
   */
  run () {
    this.$(`[${this.attrName}]`).each((_, element) => {
      const $element = this.$(element)

      this.once($element)
    })
  }

  /**
   * Once
   *
   * @param {import('cheerio').Cheerio<Element>} $element
   */
  once ($element) {
    const id = $element.attr(this.attrName)

    $element.removeAttr(this.attrName)
    this.$(`[${this.attrName}="${id}"]`).remove()
  }
}
