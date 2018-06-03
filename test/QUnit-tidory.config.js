const tidory = require('tidory');

/** 
 * tidory.config.js
 * 
 * Configuration for Tidory Framework
 * you can call APIs such as Directive, Event .etc
 * 
 * When sources will be compiled, this is referenced
 */

const directive = tidory.Directive;
const globalVariable = tidory.GlobalVariable;
const async = tidory.Async;

directive.register('test', function(el, value) {
  console.log('Directive::before');
}, function(el, value) {
  console.log('Directive::after');
});

globalVariable.register(function(done) {
  done('message', 'Tistory Skin');
});

const axios = require('axios');

async.fetch(function(document) {
  return axios.get('https://www.tistory.com/').then(function(res) {
    // console.log(res.data);
    console.log('Async::fetch');
  }).catch(function(err) {
    console.log(err);
  });
});

module.exports = tidory;