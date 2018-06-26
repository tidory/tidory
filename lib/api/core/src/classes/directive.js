const path = require('path');

const Base = require('../core/base');

let config = path.join(process.cwd(), 'tidory.config.js');

if(process.env.NODE_ENV == 'test') {
  config = path.join(process.cwd(), 'test/QUnit-tidory.config.js');
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
  static before(_document) {
    __customDirective(_document, function(_target, _attr, _directive) {
      /** Callback */
      _directive._before(_target, _attr);
    })
  }

  /** 
   * after is called after 'globalVariable' 
   * @public
   * 
   * @param _document {Document} - TIDORY Document
   */
  static after(_document) {
    __customDirective(_document, function(_target, _attr, _directive) {
      if(_directive._after !== undefined && _directive._after) {
        _directive._after(_target, _attr);
      }
      /** Remove directive attribute */
      _target.removeAttr(_directive._directive);
    });
  }
}

module.exports = Directive;