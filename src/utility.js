const UglifyJS = require("uglify-es");
const babel = require("babel-core");

/**
 * Utility
 * @class
 */ 
class Utility {
  /**
   * if 'scoped' attribute exist
   * 
   * @param $ {object} - TIDORY Document
   * @param tag {string} - target tag name
   * @param _if {Function} - has attribute
   * @param _else {Function} - doesn't have attribute
   */
  static ifScopedAttributeExist($, tag, _if, _else) {
    let scoped = 'scoped';
    $(tag).each(function() {
      let
        target = $(this),
        attr = target.attr(scoped)
      ;
      if(typeof attr !== typeof undefined && attr !== false) {
        _if(target);
        target.removeAttr(scoped);
      }
      else {
        _else(target);
      }
    });
  }
  
  /** 
   * Transform and minify ECMA6 to ECMA5
   * @static
   * 
   * @param code {string} - Javascript code
   * 
   * @return script {string} - The code that is transformed
   */
  static toECMA5AndMinify(code, minify = true) {
    let script = null;
    script = babel.transform(code, {
      "presets": [
        "babel-preset-es2015"
      ].map(require.resolve)
    }).code;

    if(minify) {
      script = UglifyJS.minify(script).code;
    }
    return script;
  }
}

module.exports = Utility;