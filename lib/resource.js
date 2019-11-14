const fs = require('fs');
const path = require('path');

/** 
 * Create resource files
 * 
 * @param {Object} env - Webpack environment variables
 * @param {String} css - Css string
 * @param {String} js - Javascript string
 */
module.exports = (env, css, js) => {
  if(env.MODE == 'build' || env.MODE == 'production') {
    /** Create style.css */
    fs.writeFileSync(path.join('./dist', 'style.css'), css);
    /** Create script.js */
    fs.writeFileSync(path.join('./dist', 'images/script.js'), js);
  }
}