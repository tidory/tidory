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
  TistorySkin = require('tistory-skin')
;

const 
  separator = require('../src/separator'),
  cheerio = require('../src/cheerio')
;

const Transform = require('../src/transform');

/**
 * Tidory dev webpack plugin
 * @class
 */ 
class TidoryPreviewWebpackPlugin {
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
      compilation.plugin('html-webpack-plugin-after-html-processing', async function(htmlPluginData, callback) {
        let $ = cheerio(htmlPluginData.html);
        /** Separate Style, Script */
        let separated = separator($, { build: false });

        $('head').append(`<link rel="stylesheet" href="./style.css">`);
        $('body').append(`<script type="text/javascript">${separated.script}</script>`);

        let skin = new TistorySkin(process.env.BLOG_URL, process.env.TSSESSION);
        await skin.prepare();
        await skin.change(Transform.tistory($.html()), separated.css, true);

        /** Allocate to htmlPluginData */
        htmlPluginData.html = Transform.resolve(await skin.preview(process.env.MODE));

        callback(null, htmlPluginData);
      });
    });
  }
}

module.exports = TidoryPreviewWebpackPlugin;