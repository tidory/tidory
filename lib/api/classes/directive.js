const colors = require('colors');

/**
 * Directive instance
 * @static
 */ 
let _instance = null;

/**
 * Directive
 * @class
 */ 
class Directive {
// private:
  /** 
   * Create Directive instance.
   * Don't create new instance outside
   * @private
   */
  constructor() {
    this._directives = new Array();
    this._prefix = 't-';
  }
// public:
  /** 
   * Getting signleton instance
   * @public
   */
  static getInstance() {
    if(_instance !== undefined && _instance) {
      return _instance;
    }
    else {
      _instance = new Directive();
      return _instance;
    }
  }

  /** 
   * Directive registration
   * @public
   * 
   * @param _directive {string} - Directive Name
   * @param _bind {Function} - callback
   */
  register(_directive, _bind) {
    let _self = this, _isExist = false; 
    this._directives.forEach(function(e, i) {
      if(e._directive == (_self._prefix+_directive)) {
        console.log(`\t[Warning] already exists Directive '${_directive}'`.yellow.bold);
        _isExist = true;
      }
    });
    if(!_isExist) {
      this._directives.push({ 
        _directive: this._prefix+_directive,
        _bind: _bind,
      });
    }
  }
}

module.exports = Directive.getInstance();