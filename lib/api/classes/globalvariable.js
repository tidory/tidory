const colors = require('colors');

/**
 * GlobalVariable instance
 * @static
 */ 
let _instance = null;


/** 
 * Setting Global variable
 * @private
 * 
 * @param _globalVariable {string} - GlobalVariable
 * @param _value {any} - value
 */
function __done(_globalVariable, _value) {
  let _isExist = false; 
  GlobalVariable.getInstance()._variables.forEach(function(e, i) {
    /** Compare Varivalbe name with GlobalVariable */
    if(e._globalVariable == _globalVariable) {
      console.log(`\t[Warning] already exists GlobalVariable '${_globalVariable}'`.yellow.bold);
      _isExist = true;
    }
  });
  if(!_isExist) {
    GlobalVariable.getInstance()._variables.push({ 
      _globalVariable: _globalVariable, 
      _value: _value 
    });
  }
}

/** 
 * Switch Global variable
 * @private
 * 
 * @param _globalVariable {string} - GlobalVariable
 * @param _value {any} - value
 */
function __switch(_globalVariable, _value) {
  let _isExist = false;
  GlobalVariable.getInstance()._variables.forEach(function(e, i) {
    /** Compare Varivalbe name with GlobalVariable */
    if(e._globalVariable == _globalVariable) {
      Object.assign(e, { 
        _globalVariable: _globalVariable,
        _value: _value
      });
      _isExist = true;
    }
  });
  if(!_isExist) {
    console.log(`\t[Warning] cannot find GlobalVariable '${_globalVariable}'`.yellow.bold);
  }
}

/**
 * GlobalVariable
 * @class
 */ 
class GlobalVariable {
// private:
  /** 
   * Create GlobalVariable instance.
   * Don't create new instance outside
   * @private
   */
  constructor() {
    this._variables = new Array();
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
      _instance = new GlobalVariable();
      return _instance;
    }
  }

  /** 
   * Setting Global variable
   * @public
   * 
   * @param _done {Function} - Done
   */
  register(_done) { _done(__done); }

  /** 
   * Getting Global variable
   * @public
   * 
   * @param _globalVariable {string} - Global variable
   * 
   * @return _value {string} - value
   */
  getVariable(_globalVariable) {
    let _value = new String();
    let _isExist = false;
    this._variables.forEach(function(e, i) {
      /** Compare Varivalbe name with GlobalVariable */
      if(e._globalVariable == _globalVariable) {
        _value = e._value;
        _isExist = true;
      }
    });
    if(_isExist) {
      return _value;
    }
    else {
      console.log(`\t[Warning] cannot find GlobalVariable '${_globalVariable}'`.yellow.bold);
    }
  }

  /** 
   * Switch Global variable
   * @public
   * 
   * @param _switch {Function} - Done
   */
  switch(_switch) { _switch(__switch); }
}

module.exports = GlobalVariable.getInstance();