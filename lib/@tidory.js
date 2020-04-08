const path = require('path')
const fs = require('fs')

const tidoryConfig = require('../tidory.config')

/**
 * Pug alias
 *
 * @param {string} fn
 *
 * @return {string}
 */
module.exports = fn => {
  return fn.replace(/^(@tidory)(\/||\\)(.*)\.(.*)$/, (m, alias, sep, pkg, ext) => {
    const pkgPath = path.join('node_modules', alias, pkg)
    if (fs.existsSync(pkgPath) && fs.statSync(pkgPath).isDirectory()) {
      return path.join(pkgPath, tidoryConfig.path.template)
    } else {
      return `${pkgPath}.${ext}`
    }
  })
}
