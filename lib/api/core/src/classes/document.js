const cheerio = require('cheerio');

class Document {
// private:
  /** 
   * Create Document instance.
   * Don't create new instance outside
   * @public
   *
   * @param {string} html - Html string
   */
  constructor(html, options = {}) {
    /** 
     * cheerio
     * @private
     */

    options = {
      xmlMode: options.xmlMode || false,
      withDomLvl1: options.withDomLvl1 || true,
      normalizeWhitespace: options.normalizeWhitespace || false,
      decodeEntities: options.decodeEntities || true
    };

    this.$ = cheerio.load(html, options);
  }
}

module.exports = Document;