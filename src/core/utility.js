const UglifyJS = require("uglify-es");
const babel = require("babel-core");
const path = require('path');

require('dotenv').config();

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
  static toECMA5AndMinify(code, minify = true) {
    let script = null;
    script = babel.transform(code, {
      "presets": [
        "es2015"
      ]
    }).code;
    if(minify) {
      script = UglifyJS.minify(script).code;
    }
    return script;
  }

  /** 
   * Getting global variables
   * 
   * @param isObject {boolean} - return type?
   * 
   * @return {string|object} - The code that is transformed
   */
  static getGlobalVariables(isObject) {
    /** CUSTOMIZE */
    const config = require(path.join(process.cwd(), '/config/tidory.config'));

    /** Getting globalVariables */
    const variables = config.GlobalVariable._variables;
    let result = new String();
  
    isObject? result += "{": result += "var TIDORY = {";
    /** to Raw object string */
    variables.forEach(function(e, i) {
      result += `"${e._globalVariable}": ${JSON.stringify(e._value)},`;
    });
    if(isObject) {
      /** End */
      result = result.substring(0, result.length-1);
      result += "}";

      return { "process.env": process.env, "TIDORY": JSON.parse(result) };
    }
    else {
      /** End */
      result += "};";
      return `process.env = ${JSON.stringify(process.env)};` + result;
    }
  }
}

module.exports = Utility;