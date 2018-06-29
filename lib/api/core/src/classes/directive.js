const path = require('path');

const Base = require('../core/base');

let config = path.join(process.cwd(), 'config/tidory.config.js');

if(process.env.NODE_ENV == 'test') {
  config = path.join(process.cwd(), 'test/tidory.config.js');
}

/** 
 * Directive
 * @public
 * 
 * @param _document {Document} - TIDORY Document
 * @param _callback {Function} - Callback
 */
function __customDirective(_document, _callback) {
  const directive = require(config).Directive;
  let _self = _document;
  /** Getting registared directives */
  let _directives = directive._directives;
  _directives.forEach(function(directive, index) {
    /** Searching the directive */
    _self.$(`*[${directive._directive}]`).each(function(i, e) {
      let _target = _self.$(this);
      Base.__directive(directive._directive, _target, function(_attr) {
        let _params = null;
        if(_attr.length >= 1) {
          /** Getting parameters */
          _params = _attr.split(/\,\s?/);
        }
        /** Callback */
        _callback(_target, _params, directive);
      });
    });
  });
}

/**
 * Directive
 * @class
 */ 
class Directive {
  /** 
   * before is called before 'globalVariable' 
   * @public
   * 
   * @param _document {Document} - TIDORY Document
   */
  static bind(_document) {
    __customDirective(_document, function(_target, _attr, _directive) {
      /** Callback */
      _directive._bind(_target, _attr);
    })
  }
}

module.exports = Directive;