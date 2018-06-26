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
    let _self = this;
    /** Remove distribution directory for new files */
    rimraf(config.distribution, function() {
      /** Create distribution directories */
      fs.mkdirSync(config.distribution);
      fs.mkdirSync(path.join(config.distribution, config.assets));
      /** Create source files */
      fs.writeFileSync(path.join(config.distribution, config.stylesheet), _css);
      fs.writeFileSync(path.join(config.distribution, config.script), _script);
      /** Callback */
      _callback();
    })
  }
}

module.exports = Directory;