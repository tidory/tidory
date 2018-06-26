/**
 * Base
 * @class
 */ 
class Base {
  /** 
   * Attribute
   * @public
   * 
   * @param _attribute {string} - Attribute Name
   * @param _target {JQuery Element} - target
   * @param _if {Function} - a Callback 
   * @param _else {Function} - if it is not, a Callback
   */
  static __attribute(_attribute, _target, _if, _else) {
    let _attr = _target.attr(_attribute);
    /** has the Directive correctly? */
    if(typeof _attr !== typeof undefined && _attr !== false) {
      _if();
    }
    else {
      if(_else !== undefined && _else) {
        _else();
      }
    }
  }
}

module.exports = Base;