const path = require('path');

let config = path.join(process.cwd(), 'config/tidory.config.js');

if(process.env.NODE_ENV == 'test') {
  config = path.join(process.cwd(), 'test/tidory.config.js');
}

/**
 * Async
 * @class
 */ 
class Async {
  /** 
   * Async
   * @public
   * 
   * @param _document {Document} - TIDORY Document
   */
  static fetch(_document, _callback) {
    const async = require(config).Async;
    if(async._fetchCallback !== undefined && async._fetchCallback) {
      /** fetch MUST BE RETURN 'Promise' */
      async._fetchCallback(_document).then(function() {
        _callback();
      });
    }
    else {
      _callback();
    }
  }
}

module.exports = Async;