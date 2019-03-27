const load = require('pug-load');
const path = require('path');

/**
 * @param aliases {object} - Aliases
 */
module.exports = function(aliases) {
  return { 
    resolve(filename, source, loadOptions) {
      for(let i = 0; i < Object.keys(aliases).length; i++) {
        let alias = Object.keys(aliases)[i];
        if(new RegExp(`^${alias}(\/||\\).*\.pug$`).test(filename)) {
          return path.resolve(
            typeof aliases[alias] === 'function'
              ? aliases[alias](filename)
              : filename.replace(alias, aliases[alias])
          );
        }
      }
      return load.resolve(filename, source, loadOptions);
    }
  }
};