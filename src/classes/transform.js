const wd = process.cwd();

const fs = require('fs');
const path = require('path');

const pretty = require('pretty');
const he = require('he');
const pug = require('pug');

const config = require('../core/config');

/**
 * Transform
 * @class
 */ 
class Transform {
  /** 
   * Modify TISTORY attributes
   * @private
   * 
   * @param _html {string} - HTML String
   * 
   * @return html - HTML String
   */
  static tistory(_html) {
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
    return _html.replace(/(\[##_.*?_##\])(\=\"\")?/gim, "$1");
  }

  /**
   * HTML optimaize
   * @private
   * 
   * @param _options {Object} - TIDORY Webpack build options
   * @param _html {string} - HTML String
   * 
   * @return html - HTML String
   */
  static html(_options, _html) {
    /** for Production */
    if(!_options.build) {
      /** Beautify html string */
      _html = pretty(_html, {
        ocd: false
      });
      /** Decode html string */
      _html = he.decode(_html);
    };
    return _html;
  }
}

module.exports = Transform;