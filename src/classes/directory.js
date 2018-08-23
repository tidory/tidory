const path = require('path');
const fs = require('fs');

/**
 * Builder
 * @class
 */ 
class Directory {
  /**
   * Remove distribution directory for new files
   * @private
   * 
   * @param _callback {Function} - The callback which will be excuted after Creating directoies
   */
  static distribution(_css, _script, _callback) {
    /** Create style.css */
    fs.writeFileSync(path.join('./dist', 'style.css'), _css);
    /** Create script.js */
    fs.writeFileSync(path.join('./dist', 'images/script.js'), _script);
    /** Callback */
    _callback();
  }
}

module.exports = Directory;