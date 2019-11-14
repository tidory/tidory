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
 */
const cheerio = require('cheerio');

const script = require('./script');
const style = require('./style');
const resource = require('./resource');
const html = require('./html');

/**
 * Tidory webpack plugin
 * 
 * env.MODE
 * -> development
 * -> preview
 * -> build
 * -> production
 */
module.exports = class {
  /**
   * Create tidory webpack plugin instance
   * 
   * @param {Object} env - Webpack environment variables
   */
  constructor(env) {
    this.env = env;
  }

  /**
   * Apply plugin
   * 
   * @param {Object} compiler - Webpack compiler
   */
  apply(compiler) {
    let $ = null, css = new String(), js = new String();
    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-after-html-processing', async (htmlPluginData, cb) => {
        $ = cheerio.load(htmlPluginData.html);
        css = style($, this.env);
        js = script($, this.env);
        htmlPluginData.html = await html($, this.env, css, js);
        cb(null, htmlPluginData);
      });
    });
    compiler.plugin('done', () => resource(this.env, css, js));
  }
};