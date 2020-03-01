const wd = process.cwd()
const path = require('path')

const tidoryConfig = require(path.resolve(wd, './tidory.config'))

module.exports = Object.assign(Object.assign({
  name: null,
  ts_session: null,
  url: null,
  preview: {
    mode: 'index'
  },
  alias: null,
  build: {
    public_path: null
  }
}, tidoryConfig || {}), {
  /**
   * PATH CONFIGURATION
   */
  path: {
    /**
     * ./ -> Project directory
     */
    build: {
      dist: './dist',
      entry: './assets/app.js',
      template: './index.pug',
      docs: './docs'
    },

    /**
     * ./ -> dist
     */
    public: {
      index: './skin.html',
      stylesheet: './style.css',
      script: './images/script.js',
      publicPath: './images'
    }
  }
})
