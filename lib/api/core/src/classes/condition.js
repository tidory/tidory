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
class Condition {
  /** 
   * Condition
   * @public
   * 
   * @param _document {Document} - TIDORY Document
   */
  static translate(_document) {
    let _self = _document;
    let _conditions = [
      't-if',
      't-else-if',
      't-else'
    ];
    /** Searching the directive */
    _self.$(`*[${_conditions[0]}]`).each(function(i, e) {
      let _target = _self.$(this);
      Base.__directive(_conditions[0], _target, function(_attr) {
        /** t-if = "true" */
        if(_attr == "true") {
          _target.nextUntil(`*[${_conditions[0]}]`).each(function(i, e) {
            let __target = _self.$(this);
            /** REMOVE t-else-if */
            Base.__directive(_conditions[1], __target, function(_attr) {
              __target.remove();
            })
            /** REMOVE t-else */
            Base.__directive(_conditions[2], __target, function(_attr) {
              __target.remove();
            })
          })
          _target.removeAttr(`${_conditions[0]}`);
        }
        /** t-if = "false" */
        else if(_attr == "false") {
          let isElseIf = false;
          /** t-else-if */
          _target.nextUntil(`*[${_conditions[0]}]`).each(function(i, e) {
            let __target = _self.$(this);
            Base.__directive(_conditions[1], __target, function(_attr) {
              isElseIf = true;
              if(_attr == "true") {
                __target.removeAttr(`${_conditions[1]}`);
                __target.nextUntil(`*[${_conditions[0]}]`).each(function(i, e) {
                  let ___target = _self.$(this);
                  /** REMOVE t-else-if's' */
                  Base.__directive(_conditions[1], ___target, function(_attr) {
                    ___target.remove();
                  });
                });
              }
              if(_attr == "false") {
                /** REMOVE t-else-if */
                __target.remove();
              }
            });
          })
          /** t-else */
          _target.nextUntil(`*[${_conditions[0]}]`).each(function(i, e) {
            let __target = _self.$(this);
            Base.__directive(_conditions[2], __target, function(_attr) {
              if(isElseIf) {
                /** REMOVE t-else */
                __target.remove();
              }
              else {
                __target.removeAttr(`${_conditions[2]}`);
              }
            });
          });
          /** REMOVE t-if */
          _target.remove();
        }
      });
    });
  }
}

module.exports = Condition;