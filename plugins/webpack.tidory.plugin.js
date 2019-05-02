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

const wd = process.cwd();

const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const TistorySkin = require('tistory-skin');
const pretty = require('pretty');
const he = require('he');
const CleanCss = require('clean-css');
const cssesc = require('cssesc');
const UglifyJS = require("uglify-es");
const babel = require("babel-core");

const parse = require('../lib/parse');
const tidoryConfig = require(path.resolve(wd, './tidory.config'));

/**
 * Tidory webpack plugin
 * @class
 */ 
class TidoryWebpackPlugin {
  /** 
   * Create TidoryWebpackPlugin Instance
   * 
   * @param {object} env - Webpack environment variables
   */
  constructor(env) {
    this.env = env;
  }

  /** 
   * For Webpack plugin.
   * Reference webpack document; part of Events
   */
  apply(compiler) {
    let css = new String(),
        js = new String(),
        self = this
    ;
    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-after-html-processing', async (htmlPluginData, callback) => {
        /**
         * Mode
         * 
         * production
         * build
         * development
         * preview
         */
        let $ = cheerio.load(htmlPluginData.html);

        /**
         * Parse style, script tags
         */
        css = parse($, 'style', style => {
          style.html(style.html().replace(/content:\'(.*?)\'/gim,
            function(match, content, offset, string) {
              return `content:'${cssesc(content)}'`;
            }
          ));
          if(self.env.MODE == 'build') {
            style.html((new CleanCss()).minify(style.html()).styles);
          }
        });
        if(self.env.MODE == 'production') {
          css = new CleanCss({
            format: 'beautify'
          }).minify(css).styles;
        }  

        js = parse($, 'script:not([src])', script => {
          /** to ECMA5 Script */
          script.html(babel.transform(script.html(), {
            "presets": [
              "babel-preset-es2015"
            ].map(require.resolve)
          }).code);
          if(self.env.MODE == 'build') {
            script.html(UglifyJS.minify(script.html()).code);
          }
        });

        /** 
         * Add resources 
         */
        if(self.env.MODE == 'build' || self.env.MODE == 'production' || self.env.MODE == 'preview') {
          $('head').append(`<link rel="stylesheet" href="./style.css">`);
        } else {
          $('head').append(`<style>${css}</style>`);
        }
        if(self.env.MODE == 'preview' || self.env.MODE == 'development') {
          $('body').append(`<script type="text/javascript">${js}</script>`);
        } else {
          $('body').append(`<script type="text/javascript" src="./images/script.js">`);
        }

        /** 
         * Allocate to htmlPluginData 
         */
        if(self.env.MODE == 'preview') {
          /** Tistory Skin */
          let skin = new TistorySkin(tidoryConfig.url, tidoryConfig.ts_session);
          await skin.prepare();
          await skin.change($.html(), css, true);
          /**
           * FOR PREVIEW
           * 
           * Replace TISTORY CDN PATH to local for preview
           *
           * <img src="https://tistory1.daumcdn.net/tistory/2710108/skin/images/logo.png" /> -> <img src="images/logo.png" />
           */
          htmlPluginData.html = (await skin.preview(tidoryConfig.preview.mode)).replace(
            /(src|href)=[\"\']https?:\/\/tistory[0-9]{1}.daumcdn.net\/tistory\/[0-9]*\/skin\/(images\/.*?)[\"\']/gim, 
            "$1=\"$2\""
          );
        } else if(self.env.MODE == 'production') {
          htmlPluginData.html = he.decode(pretty($.html(), { ocd: false }));
        } else {
          htmlPluginData.html = $.html();
        }
        /** Finish! */
        callback(null, htmlPluginData);
      });
    });
    compiler.plugin('done', () => {
      if(self.env.MODE == 'build' || self.env.MODE == 'production') {
        /** Create style.css */
        fs.writeFileSync(path.join('./dist', 'style.css'), css);
        /** Create script.js */
        fs.writeFileSync(path.join('./dist', 'images/script.js'), js);
      }
    });
  }
}

module.exports = TidoryWebpackPlugin;