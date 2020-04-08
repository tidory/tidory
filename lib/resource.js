const fs = require('fs')
const path = require('path')

const tidoryConfig = require('../tidory.config')

/**
 * Create resource files
 *
 * @param {string} css
 * @param {string} js
 * @param {object} env
 */
module.exports = (css, js, env) => {
  if (env.build || env.production) {
    fs.writeFileSync(path.join(tidoryConfig.path.dist, tidoryConfig.path.stylesheet), css)
    fs.writeFileSync(path.join(tidoryConfig.path.dist, tidoryConfig.path.script), js)
  }
}
