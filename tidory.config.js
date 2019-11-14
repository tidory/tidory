const wd = process.cwd();
const path = require('path');

const tidoryConfig = require(path.resolve(wd, './tidory.config'));

module.exports = Object.assign(Object.assign({
  name: new String(),
  ts_session: new String(),
  url: new String(),
  preview: {
    mode: 'index'
  },
  alias: new Object(),
  build: {
    public_path: new String()
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
});