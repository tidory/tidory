import React from 'react';

class References extends React.Component {
  render() {
    const references = [
      { text:"프로젝트 템플릿",  href:"https://github.com/pronist/tidory-starter-template" },
      { text:"티도리 모듈",  href:"https://www.npmjs.com/package/tidory" },
      { text:"티스토리 가이드",  href:"https://www.tistory.com/guide/skin/step0" }
    ];
    return pug`
      ul
        li: a(href="https://tidory.com")
          img(src=require("~/assets/images/logo.png"))
        each ref, index in references
          li(key=index): a(href=ref.href) #{ref.text}
    `
  }
}

module.exports = References;