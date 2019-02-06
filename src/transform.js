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

  static resolve(html) {
    /**
     * FOR PREVIEW
     * 
     * Replace TISTORY CDN PATH to local for preview
     *
     * <img src="https://tistory1.daumcdn.net/tistory/2710108/skin/images/logo.png" /> -> <img src="images/logo.png" />
     */
    return html.replace(/(src|href)=[\"\']https?:\/\/tistory[0-9]{1}.daumcdn.net\/tistory\/[0-9]*\/skin\/(images\/.*?)[\"\']/gim, "$1=\"$2\"");
  }
}

module.exports = Transform;