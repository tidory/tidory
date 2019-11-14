const path = require('path');
const fs = require('fs');

/**
 * Pug alias
 * 
 * @param {String} fn - filename
 * 
 * @return {String}
 */
module.exports = fn => {
  return fn.replace(/^(@tidory)(\/||\\)(.*)\.(.*)$/, (m, alias, sep, pkg, ext) => {
    const pkgPath = path.join('node_modules', alias, pkg);
    if(fs.existsSync(pkgPath) && fs.statSync(pkgPath).isDirectory()) {
      return path.join('node_modules', alias, pkg, 'index.pug');
    } else {
      return `${pkgPath}.${ext}`;
    }
  });
}