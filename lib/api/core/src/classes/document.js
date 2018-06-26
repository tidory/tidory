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
  constructor(html) {
    /** 
     * cheerio
     * @private
     */
    this.$ = cheerio.load(html);
  }
}

module.exports = Document;