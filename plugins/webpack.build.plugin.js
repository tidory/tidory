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
  cheerio = require('../src/cheerio')
;

const Transform = require('../src/transform');

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
    /** Merge */
    this._options = Object.assign({}, options);
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
      compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData, callback) {
        let $ = cheerio(htmlPluginData.html);
        /** Separation */
        separated = separator($, self._options);
 
        $('head').append(`<link rel="stylesheet" href="./style.css">`);
        $('body').append(`<script type="text/javascript" src="./images/script.js">`);
        
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