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
  separator = require('../src/seperator'),
  cheerio = require('../../src/cheerio')
;

const Transform = require('../../src/transform');

/**
 * Tidory dev webpack plugin
 * @class
 */ 
class TidoryDevWebpackPlugin {
  /** 
   * Initialize plugin options
   */
  constructor() {}

  /** 
   * For Webpack plugin.
   * Reference webpack document; part of Events
   */
  apply(compiler) {
    compiler.plugin('compilation', function(compilation) {
      compilation.plugin('html-webpack-plugin-before-html-generation', function(htmlPluginData, callback) {
        /** Finish! */
        callback(null, htmlPluginData);
      });
      compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData, callback) {
        let $ = cheerio(htmlPluginData.html);
        /** Separate Style, Script */
        separator($);
        /** Allocate to htmlPluginData */
        htmlPluginData.html = Transform.tistory($.html());
        /** Finish! */
        callback(null, htmlPluginData);
      });
    });
  }
}

module.exports = TidoryDevWebpackPlugin;