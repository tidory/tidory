const pretty = require('pretty');
const he = require('he');

/**
 * Transform
 * @class
 */ 
class Transform {
  /** 
   * Modify TISTORY attributes
   * @static
   * 
   * @param html {string} - HTML String
   * 
   * @return html - HTML String
   */
  static tistory(html) {
    /**
     * IMPORTANT
     * 
     * When pug file transform to html, some TISTORY attributes is inapposite
     * so modify TISTORY attributes
     * 
     * it's not good
     * a([##_paging_rep_link_##]) -> <a [##_paging_rep_link_##]=""></a> 
     * 
     * it's correct transform
     * a([##_paging_rep_link_##]) -> <a [##_paging_rep_link_##]></a> 
     */
    return html.replace(/(\[##_.*?_##\])(\=\"\")?/gim, "$1");
  }

  /**
   * HTML optimaize
   * @static
   * 
   * @param options {Object} - TIDORY Webpack build options
   * @param html {string} - HTML String
   * 
   * @return html - HTML String
   */
  static html(options, html) {
    /** for Production */
    if(!options.build) {
      /** Beautify html string */
      html = pretty(html, {
        ocd: false
      });
      /** Decode html string */
      html = he.decode(html);
    };
    return html;
  }
}

module.exports = Transform;