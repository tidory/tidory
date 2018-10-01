const path = require('path');
const fs = require('fs');

module.exports = function(css, script) {
  /** Create style.css */
  fs.writeFileSync(path.join('./dist', 'style.css'), css);
  /** Create script.js */
  fs.writeFileSync(path.join('./dist', 'images/script.js'), script);
};