const { Directive, GlobalVariable, Async, Event } = require('tidory');

/** 
 * tidory.config.js
 * 
 * Configuration for Tidory Framework
 * you can call APIs such as Directive, Event .etc
 * 
 * When sources will be compiled, this is referenced
 */

const axios = require('axios');

Async.fetch(function(document) {
  return axios.get('https://www.tistory.com/').then(function(res) {
    // console.log(res.data); // -> HTML String
    document.$('p').text('TIDORY');
  }).catch(function(err) {
    console.log(err);
  });
});

Directive.register('test', function(el, params) {
  /** Directive parameters in template */
  // console.log(params); // -> [ 'TIDORY' ]
  /** JQuery Document */
  el.text('TIDORY');
});

module.exports = { Directive, GlobalVariable, Async, Event };