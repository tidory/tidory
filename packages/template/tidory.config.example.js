const ESLintPlugin = require('eslint-webpack-plugin')

/**
 * Tidory Configuration
 * @see https://tidory.github.io/docs/configuration/
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
     * tag
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
      new ESLintPlugin({ configType: 'flat' }),
      ...webpackConfig.plugins
    ]
  }
}
