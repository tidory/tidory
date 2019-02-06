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
  cheerio = require('../src/cheerio')
;

const Transform = require('../src/transform');

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
      compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData, callback) {
        let $ = cheerio(htmlPluginData.html);
        /** Separate Style, Script */
        let separated = separator($, { build: false });

        $('head').append(`<style>${separated.css}</style>`);
        $('body').append(`<script type="text/javascript">${separated.script}</script>`);

        /** Allocate to htmlPluginData */
        htmlPluginData.html = Transform.tistory($.html());
        /** Finish! */
        callback(null, htmlPluginData);
      });
    });
  }
}

module.exports = TidoryDevWebpackPlugin;