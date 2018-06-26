/**
 * Base
 * @class
 */ 
class Base {
  /** 
   * Directive
   * @public
   * 
   * @param _directive {string} - Directive Name
   * @param _target {JQuery Element} - target
   * @param _if {Function} - a Callback 
   */
  static __directive(_directive, _target, _if) {
    let _attr = _target.attr(_directive);
    /** has the Directive correctly? */
    if(typeof _attr !== typeof undefined && _attr !== false) {
      _if(_attr);
    }
  }
}

module.exports = Base;