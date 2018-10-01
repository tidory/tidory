const Utility = require('../../src/utility');

/**
 * Separate
 * 
 * @param $ {object} - TIDORY Document
 * @param tag {string} - target tag name
 * @param appendTo {string} - append tag name
 */
function separate($, tag, appendTo) {
  Utility.ifScopedAttributeExist($, tag, new Function(), function(target) {
    target.appendTo(appendTo);
  })
}

/** 
 * Separator
 * 
 * @param $ {object} - TIDORY Document
 */
module.exports = function($) {
  separate($, 'style', 'head');
  separate($, 'script:not([src])', 'body');
}