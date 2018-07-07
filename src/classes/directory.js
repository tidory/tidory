const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');

const config = require('../core/config');

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
    fs.writeFileSync(path.join(config.distribution, config.stylesheet), _css);
    /** Create script.js */
    fs.writeFileSync(path.join(config.distribution, config.script), _script);
    /** Callback */
    _callback();
  }
}

module.exports = Directory;