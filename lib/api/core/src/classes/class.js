const path = require('path');

const Base = require('../core/base');

let config = path.join(process.cwd(), 'tidory.config.js');

if(process.env.NODE_ENV == 'test') {
  config = path.join(process.cwd(), 'test/QUnit-tidory.config.js');
}

/**
 * Condition
 * @class
 */ 
class Class {
  /** 
   * Condition
   * @public
   * 
   * @param _document {Document} - TIDORY Document
   */
  static bind(_document) {
    let _self = _document;
    let _directive = 't-class';
    /** Searching the directive */
    _self.$(`*[${_directive}]`).each(function(i, e) {
      let _target = _self.$(this);
      Base.__directive(_directive, _target, function(_attr) {
        let classes = JSON.parse(_attr);    
        Object.keys(classes).forEach(function(key) {
          if(classes[key] == "true") {
            _target.addClass(key);
          }
        });
        _target.removeAttr(_directive);
      });
    });
  }
}

module.exports = Class;