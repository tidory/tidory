const path = require('path')
const load = require('pug-load')

/**
 * Alias Pug Plugin
 *
 * @param {object} aliases
 */
module.exports = aliases => ({
  resolve (filename, source, loadOptions) {
    for (const alias in aliases) {
      if (filename.indexOf(alias) === 0) {
        return path.resolve(
          aliases[alias] instanceof Function
            ? aliases[alias](filename)
            : filename.replace(alias, aliases[alias])
        )
      }
    }

    return load.resolve(filename, source, loadOptions)
  }
})
