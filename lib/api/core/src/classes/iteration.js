const path = require('path');

const Base = require('../core/base');
const Utility = require('../core/utility');

let config = path.join(process.cwd(), 'tidory.config.js');

if(process.env.NODE_ENV == 'test') {
  config = path.join(process.cwd(), 'test/QUnit-tidory.config.js');
}

/**
 * GlobalVariable
 * @class
 */ 
class Iteration {
  /** 
   * Iteration
   * @public
   * 
   * @param _document {Document} - TIDORY Document
   */
  static translate(_document) {
    const globalvariable = require(config).GlobalVariable;
    let _self = _document;
    let _directive = 't-for';
    _document.$(`*[${_directive}]`).each(function(i, e) {
      let _target = _self.$(this);
      Base.__directive(_directive, _target, function(_attr) {
        _target.removeAttr(_directive);
        let _regex = /(.*)(\sin\s)(\@\{)(.*?)(\})/;
        /** Iteration base */
        let __base = function(_item, callback) {
          _item = Utility.escapeRegExp(_item);
          /** Getting HTML */
          let _html = _self.$.html(_target);
          let __regex = new RegExp(`(\\@\\{)([^\\{\\}]*?(${_item}).*?)(\\})`, "gm");
          /** Replacement local variable in Children */
          _html = _html.replace(__regex, function(str, p1, item) {
            return callback(item);
          });
          /** Insert new Child */
          _target.before(_self.$(_html));
        }
        /** with GlobalVariable */
        if(_regex.test(_attr)) {
          let _item = _attr.replace(_regex, "$1");
          let _variable = _attr.replace(_regex, "$4");
          globalvariable._variables.forEach(function(e, i) {
            /** Compare Varivalbe name with GlobalVariable */
            if(e._globalVariable == _variable) {
              Object.keys(e._value).forEach(function(key) {
                __base(_item, (__item) => eval(__item.replace(_item, "e._value[key]")));
              });
            }
          });
        }
        else {
          let _regex = /(.*)(\sin\s)(\[)(.*?)(\])/;
          /** Literal */
          if(_regex.test(_attr)) {
            let _item = _attr.replace(_regex, "$1");
            let _literal = (_attr.replace(_regex, "$4")).split(',');
            for(let i=0; i<_literal.length; i++) {
              __base(_item, (__item) => eval(__item.replace(_item, "_literal[i].trim()")));
            }
          }
        }
        _target.remove();
      });
    });
  }
}

module.exports = Iteration;