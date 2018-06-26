/**
 * Async instance
 * @static
 */ 
let _instance = null;

/**
 * Async
 * @class
 */ 
class Async {
// private:
  /** 
   * Create Directive instance.
   * Don't create new instance outside
   * @private
   */
  constructor() {
    this._fetchCallback = null;
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
      _instance = new Async();
      return _instance;
    }
  }


  /**
   * Fetch
   * @public
   * 
   * @param callback {Function} - Fetch Callback 
   */
  fetch(callback) {
    this._fetchCallback = callback;  
  }
}

module.exports = Async.getInstance();