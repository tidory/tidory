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

const tidoryConfig = require(path.resolve(wd, './tidory.config'));

/**
 * Tidory webpack plugin
 * @class
 */ 
class TidoryWebpackPlugin {
  /** 
   * Create TidoryWebpackPlugin Instance
   * 
   * @param {Object} env - Webpack environment variables
   */
  constructor(env) {
    /**
     * @var {Object}
     */
    this._env = env;

    /**
     * @var {Object}
     */
    this._$ = null;

    /**
     * @var {String}
     */
    this._css = new String();

    /**
     * @var {String}
     */
    this._js = new String();
  }

  /**
   * Parse element with tag name
   * 
   * @param {String} tagName - Tag name
   * @param {Function} cb - callback with element
   * 
   * @return {String}
   */
  _parse(tagName, cb) {
    let self = this,
        separated = new String(),
        scoped = 'scoped'
    ;
    this._$(tagName).each(function() {
      let target = self._$(this),
          attr = target.attr(scoped)
      ;
      cb(target);
      if(typeof attr !== typeof undefined && attr !== false) {
        target.removeAttr(scoped);
      } else {
        separated += target.html();
        target.remove();
      }
    })
    return separated;
  };

  /**
   * Separate 'style'
   */
  _style() {
    let css = this._parse('style', style => {
      style.html(style.html().replace(/content:\'(.*?)\'/gim,
        (match, content, offset, string) => `content:'${cssesc(content)}'`
      ));
      if(this._env.MODE == 'build') {
        style.html((new CleanCss()).minify(style.html()).styles);
      }
    });
    if(this._env.MODE == 'production') {
      css = new CleanCss({
        format: 'beautify'
      }).minify(css).styles;
    }
    this._css = css;
  }

  /**
   * Separate 'script'
   */
  _script() {
    this._js = this._parse('script:not([src])', script => {
      /** to ECMA5 Script */
      script.html(babel.transform(script.html(), {
        "presets": [
          "babel-preset-es2015"
        ].map(require.resolve)
      }).code);
      if(this._env.MODE == 'build') {
        script.html(UglifyJS.minify(script.html()).code);
      }
    });
  }

  /** 
   * Add resources 
   */
  _resource() {
    /**
     * Mode
     * 
     * production
     * build
     * development
     * preview
     */
    if(this._env.MODE == 'build' || this._env.MODE == 'production' || this._env.MODE == 'preview') {
      this._$('head').append(`<link rel="stylesheet" href="./style.css">`);
    } else {
      this._$('head').append(`<style>${this._css}</style>`);
    }
    if(this._env.MODE == 'preview' || this._env.MODE == 'development') {
      this._$('body').append(`<script type="text/javascript">${this._js}</script>`);
    } else {
      this._$('body').append(`<script type="text/javascript" src="./images/script.js">`);
    }
  }

  /**
   * Optimize HTML
   * 
   * @return {String}
   */
  async _html() {
    if(this._env.MODE == 'preview') {
      /** Tistory Skin */
      let skin = new TistorySkin(tidoryConfig.url, tidoryConfig.ts_session);
      await skin.prepare();
      await skin.change(this._$.html(), this._css, true);
      /**
       * FOR PREVIEW
       * 
       * Replace TISTORY CDN PATH to local for preview
       *
       * <img src="https://tistory1.daumcdn.net/tistory/2710108/skin/images/logo.png" /> -> <img src="images/logo.png" />
       */
      return (await skin.preview(tidoryConfig.preview.mode)).replace(
        /(src|href)=[\"\']https?:\/\/tistory[0-9]{1}.daumcdn.net\/tistory\/[0-9]*\/skin\/(images\/.*?)[\"\']/gim, 
        "$1=\"$2\""
      );
    } else if(this._env.MODE == 'production') {
      return he.decode(pretty(this._$.html(), { ocd: false }));
    } else {
      return this._$.html();
    }
  }

  /**
   * Write '.css', '.script'
   */
  _writeStyleAndScript() {
    if(this._env.MODE == 'build' || this._env.MODE == 'production') {
      /** Create style.css */
      fs.writeFileSync(path.join('./dist', 'style.css'), this._css);
      /** Create script.js */
      fs.writeFileSync(path.join('./dist', 'images/script.js'), this._js);
    }
  }

  /** 
   * For Webpack plugin.
   * Reference webpack document; part of Events
   */
  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-after-html-processing', async (htmlPluginData, cb) => {
        /** Load raw HTML */
        this._$ = cheerio.load(htmlPluginData.html);
        /** Separate 'style', 'script' Tags */
        this._style(); this._script();
        /** Add resources according to MODE */
        this._resource();
        /** Finish! */
        htmlPluginData.html = this._html();
        cb(null, htmlPluginData);
      });
    });
    compiler.plugin('done', () => this._writeStyleAndScript());
  }
}

module.exports = TidoryWebpackPlugin;