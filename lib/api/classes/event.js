const EventEmitter = require('events');

/**
 * Event instance
 * @static
 */ 
let _instance = null;

/**
 * Event
 * @class
 */ 
class Event extends EventEmitter {
// private:
  /** 
   * Create Event instance.
   * Don't create new instance outside
   * @private
   */
  constructor() {
    super();
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
      _instance = new Event();
      return _instance;
    }
  }
}

module.exports = Event.getInstance();