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

const path = require('path');

const config = path.join(process.cwd(), 'config/tidory.config.js');
const event = require(config).Event;

const { Core } = require('../lib/api');
const { Transform } = require('../src/');
const Separator = require('./classes/seperator');

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
    let _self = this;
    compiler.plugin('compilation', function(compilation) {
      compilation.plugin('html-webpack-plugin-before-html-generation', function(htmlPluginData, callback) {
        /** BeforeCompiling */ 
        event.emit('BeforeCompiling');
        /** Finish! */
        callback(null, htmlPluginData);
      });
      compilation.plugin('html-webpack-plugin-after-html-processing', function(htmlPluginData, callback) {
        let _document = new Core.Document(htmlPluginData.html);
        /** BeforeHTMLProcessing */
        event.emit('BeforeHTMLProcessing', _document);
        /** Fetch */
        Core.Async.fetch(_document, function() {
          /** Directive */
          Core.Directive.bind(_document);
          /** AfterHTMLProcessing */
          event.emit('AfterHTMLProcessing', _document);
          /** CSS Separation */
          Separator.css(_document);
          /** Script Separation */
          Separator.script(_document);
          /** TISTORY attributes */
          let _html = Transform.tistory(_document.$.html());
          /** Allocate to htmlPluginData */
          htmlPluginData.html = _html;
          /** Finish! */
          callback(null, htmlPluginData);
        });
      });
    });
    compiler.plugin('done', function() {
      /** AfterGeneration */ 
      event.emit('AfterGeneration');
    });
  }
}

module.exports = TidoryDevWebpackPlugin;