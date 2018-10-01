const cheerio = require('cheerio');

module.exports = function(html, options = {}) {
  /** 
   * cheerio
   */
  options = {
    xmlMode: options.xmlMode || false,
    withDomLvl1: options.withDomLvl1 || true,
    normalizeWhitespace: options.normalizeWhitespace || false,
    decodeEntities: options.decodeEntities || true
  };
  return cheerio.load(html, options);
};