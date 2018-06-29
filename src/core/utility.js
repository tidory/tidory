const UglifyJS = require("uglify-es");
const babel = require("babel-core");

/**
 * Tidory Utility Class
 * @class
 */ 
class Utility {
  /** 
   * Transform and minify ECMA6 to ECMA5
   * 
   * @param code {string} - Javascript code
   * 
   * @return script {string} - The code that is transformed
   */
  static toECMA5AndMinify(code) {
    let script = null;
    script = babel.transform(code, {
      "presets": [
        "es2015"
      ]
    }).code;
    script = UglifyJS.minify(script).code;
    return script;
  }
}

module.exports = Utility;