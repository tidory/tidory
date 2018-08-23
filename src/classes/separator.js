const CleanCss = require('clean-css')
const cssesc = require('cssesc');

const Utility = require('../core/utility');
const Base = require('../core/base');

/**
 * Builder instance
 * @static
 */ 
let _instance = null;

/**
 * Builder
 * @class
 */ 
class Separator {
// private:
  /** 
   * Create Separator instance.
   * Don't create new instance outside
   * @private
   */
  constructor() {
    /** 
     * CSS String
     * @private
     */
    this._css = new String(); 

    /** 
     * Javascript String
     * @private
     */
    this._script = new String();
  }

// public:
  /** 
   * Getting signleton instance
   * @public
   */
  static getInstance() {
    if(_instance !== undefined && _instance) {
      return _instance;
    }
    else {
      _instance = new Separator();
      return _instance;
    }
  }

  /** 
   * Register "inline" Attribute, Minify
   * @private
   * 
   * @param _document {Document} - TIDORY Document
   * @param _options {Object} - TIDORY Webpack build options
   */
  css(_document, _options) {
    let _self = this, _attribute = 'inline';
    let _cleanCss = new CleanCss();
    _document.$('style').each(function() {
      let _target = _document.$(this); 
      Base.__attribute(_attribute, _target, function() {
        /** for Build */
        if(_options.build) {
          _target.html(_cleanCss.minify(_target.html()).styles);
        }
        _target.removeAttr(_attribute);
      }, function() {
        _self._css += _target.html();
        _target.remove();
      });
    });
    _self._css = _cleanCss.minify(_self._css).styles;
    /** Content escape */
    _self._css = _self._css.replace(/content:\'(.*?)\'/gim, 
      function(match, content, offset, string) {
        return `content:'${cssesc(content)}'`;
      }
    );
    /** for Production */
    if(!_options.build) {
      /** Beautify CSS string */
      _self._css = new CleanCss({
        format: 'beautify'
      }).minify(_self._css).styles;
    }
    _document.$('head').append(`<link rel="stylesheet" href="./style.css">`);
  }

  /** 
   * Register "inline" Attribute, Minify
   * @private
   * 
   * @param _document {Document} - TIDORY Document
   * @param _options {Object} - TIDORY Webpack build options
   */
  script(_document, _options) {
    let _self = this, _attribute = 'inline';
    _document.$('script:not([src])').each(function() {
      let _target = _document.$(this);
      Base.__attribute(_attribute, _target, function() {
        /** for Build */
        if(_options.build) {
          /** If keep using script tag in html, minify */
          _target.html(Utility.toECMA5AndMinify(_target.html()));
        }
        _target.removeAttr(_attribute)
      }, function() {
        _self._script += _target.html();
        _target.remove();
      })
    });
    /** for Build */
    if(_options.build) {
      /** Minify javscript string */
      _self._script = Utility.toECMA5AndMinify(_self._script);
    }
    else {
      _self._script = Utility.toECMA5AndMinify(_self._script, false);
    }
    _document.$('body').append(`<script type="text/javascript" src="./images/script.js">`);
  }
}

module.exports = Separator.getInstance();