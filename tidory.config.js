module.exports = {
  /**
   * Tistory session cookie value
   * '195fd2d417429d34ce6ced9a2a460fe55b69f6a3'
   */
  ts_session: null,

  /**
   * Tistory blog URL
   * 'https://appwriter.tistory.com'
   */
  url: null,

  /** 
   * Preview
   */
  preview: {
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
   * Build
   */
  build: {
    /**
     * Assets public path
     * 'https://tistory2.daumcdn.net/tistory/2710108/skin/images/'
     */
    public_path: null
  },

  /**
   * Webpack configuration extends
   */
  extends(webpackConfig) {
    webpackConfig.module.rules.push({
      test: /\.styl(us)?$/,
      use: [
        'vue-style-loader',
        'css-loader',
        'stylus-loader'
      ]
    });
  }
};