const ESLintPlugin = require('eslint-webpack-plugin')

/**
 * Tidory Configuration
 * https://tidory.com/docs/configuration
 */
module.exports = {
  ts_session: '',
  url: '',

  preview: {
    /**
     * homeType
     *
     * NONE
     * COVER
     */
    homeType: 'NONE',

    /**
     * Preview Mode
     *
     * index
     * entry
     * category
     * tag,
     * location
     * media,
     * guestbook
     */
    mode: 'index'
  },

  /**
   * Alias
   */
  alias: {
    '@': 'assets'
  },

  /**
   * Webpack Configuration
   *
   * @param {object} webpackConfig
   */
  extends (webpackConfig) {
    webpackConfig.plugins = [
      new ESLintPlugin(),
      ...webpackConfig.plugins
    ]
  }
}
