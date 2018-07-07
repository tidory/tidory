const tidory = require('tidory');

/** 
 * tidory.config.js
 * 
 * Configuration for Tidory Framework
 * you can call APIs such as Directive, Event .etc
 * 
 * When sources will be compiled, this is referenced
 */

const globalVariable = tidory.GlobalVariable;
const Directive = tidory.Directive;

globalVariable.register(function(done) {
  /** FONT_COLOR */
  done('FONT_COLOR', '#525252');
});

module.exports = tidory;