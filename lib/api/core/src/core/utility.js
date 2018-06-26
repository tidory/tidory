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
  static escapeRegExp(string){
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
}

module.exports = Utility;