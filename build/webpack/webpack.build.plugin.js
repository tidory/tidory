/**
 * @author Mansu Jeong
 * @description 
 * Copyright (c) Mansu Jeong. All rights reserved.
 * 
 * Ref. https://github.com/jantimon/html-webpack-plugin
 * Webpack. https://webpack.js.org/
 * 
 * Author. Mansu Jeong
 * Homepage. http://www.tidory.com
 * Github. https://github.com/pronist/
 */

const 
  separator = require('../src/separator'),
  dist = require('../src/dist'),
  cheerio = require('../../src/cheerio')
;

const Transform = require('../../src/transform');

/**
 * Tidory build webpack plugin
 * @class
 */ 
class TidoryBuildWebpackPlugin {
  /** 
   * Initialize plugin options
   * 
   * @param {object} options - Plugin options
   */
  constructor(options) {
    /** 
     * Default options 
     * @private
     */
    this._options = { build: true };
    /** Merge */
    this._options = Object.assign(this._options, options);
  }

  /** 
   * For Webpack plugin.
   * Reference webpack document; part of Events
   */
  apply(compiler) {
    let 
      self = this,
      separated = new Object()
    ;
    compiler.plugin('compilation', function(compilation) {
      compilation.plugin('html-webpack-plugin-before-html-generation', function(htmlPluginData, callback) {
        /** Finish! */
        callback(null, htmlPluginData);
      });
      compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData, callback) {
        let $ = cheerio(htmlPluginData.html);
        /** Separation */
        separated = separator($, self._options);
        /** Allocate to htmlPluginData */
        htmlPluginData.html = Transform.html(self._options, Transform.tistory($.html()));
        /** Finish! */
        callback(null, htmlPluginData);
      });
    });
    compiler.plugin('done', function() {
      dist(separated.css, separated.script);
    });
  }
}

module.exports = TidoryBuildWebpackPlugin;