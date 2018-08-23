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

globalVariable.register(function(done) {
  
  /** REFERENCES */
  done('references', [
    { text:"시작하기",  href:"/" },
    { text:"프로젝트 템플릿",  href:"https://github.com/pronist/tidory-starter-template" },
    { text:"티도리 모듈",  href:"https://www.npmjs.com/package/tidory" },
    { text:"티스토리 가이드",  href:"https://www.tistory.com/guide/skin/step0" }
  ])
})

module.exports = tidory;