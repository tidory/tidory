const path = require('path');
const cheerio = require('cheerio');

let config = path.join(process.cwd(), 'tidory.config.js');

const Utility = require('../core/utility');

if(process.env.NODE_ENV == 'test') {
  config = path.join(process.cwd(), 'test/QUnit-tidory.config.js');
}

/**
 * GlobalVariable
 * @class
 */ 
class GlobalVariable {
  /** 
   * GlobalVariable
   * @public
   * 
   * @param _document {Document} - TIDORY Document
   */
  static translate(_document) {
    const globalvariable = require(config).GlobalVariable;
    let _self = _document;
    let _html = _self.$.html();
    /** Searching the GlobalVariable in HTML string */
    let _matches = _html.match(/(\@\{)(.*?)(\})/gim);
    if(_matches !== undefined && _matches) {
      _matches.forEach(function(e, i) {
        /** Replacement Varivalbe name */
        let _variable = e.replace(/(\@\{)(.*?)(\})/, "$2");
        _variable = Utility.escapeRegExp(_variable);
        globalvariable._variables.forEach(function(e, i) {
          /** Compare Varivalbe name with GlobalVariable */
          if(_variable.indexOf(`${e._globalVariable}`) > -1) {
            let __regex = new RegExp(`(\\@\\{)([^\\{\\}]*?(${_variable}).*?)(\\})`, 'gm');
            _html = _html.replace(__regex, (str, p1, item) => eval(item.replace(e._globalVariable, "e._value"))); 
          }
        });
      });
    }
    _document.$ = cheerio.load(_html);
  }
}

module.exports = GlobalVariable;