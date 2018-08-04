const Base = require('../../src/core/base');

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
   */
  css(_document) {
    let _self = this, _attribute = 'inline';
    _document.$('style').each(function() {
      let _target = _document.$(this); 
      Base.__attribute(_attribute, _target, function() {
        _target.removeAttr(_attribute);
      }, function() {
        _target.appendTo('head');
      });
    });
  }

  /** 
   * Register "inline" Attribute, Minify
   * @private
   * 
   * @param _document {Document} - TIDORY Document
   */
  script(_document) {
    let _self = this, _attribute = 'inline';
    _document.$('script:not([src])').each(function() {
      let _target = _document.$(this);
      Base.__attribute(_attribute, _target, function() {
        _target.removeAttr(_attribute);
      }, function() {
        _target.appendTo('body');
      })
    });
  }
}

module.exports = Separator.getInstance();