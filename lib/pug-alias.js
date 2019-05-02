const wd = process.cwd();

const path = require('path');
const fs = require('fs');
const pugPluginAlias = require('pug-alias');

const tidoryConfig = require(path.resolve(wd, './tidory.config'));

module.exports = pugPluginAlias(Object.assign(tidoryConfig.alias || {}, {
  '@tidory': function(filename) {
    return filename.replace(/^(@tidory)\/(.*)\.(.*)$/, function(m, alias, pkg, ext) {
      const pkgPath = path.join('node_modules', alias, pkg);
      if(fs.existsSync(pkgPath) && fs.statSync(pkgPath).isDirectory()) {
        return path.join('node_modules', alias, pkg, 'index.pug');
      } else {
        return `${pkgPath}.${ext}`;
      }
    });
  }
}))