# Tistory Skin API for Javascript

**비공식** 티스토리 API 입니다. 티스토리 스킨 파일을 업로드하거나 블로그에 적용시키는 등 스킨과 아카이브를 조작하고 제어할 수 있습니다.

## 설치

```bash
npm install --save tistory-skin
```

## 시작하기

```javascript
const { Skin, Archive } = require('./index');

(async () => {
  const skin = new Skin('__BLOG_URL__', '__TSSESSION__')

  let { data } = await skin.settings()

  // { name: ...., }
  console.log(data.skin)
})()
```

[Skin](https://github.com/tidory/tistory-skin/blob/master/lib/skin.js) 을 사용하면 **티스토리 스킨**을 조작할 수 있고, 배포하거나 파일을 업로드하고 프리뷰를 볼 수 도 있습니다. [Archive](https://github.com/tidory/tistory-skin/blob/master/lib/archive.js) 는 **티스토리 스킨 저장소**에 대응하며 스킨 저장소에 파일을 배포하고 저장하는 메서드를 제공합니다. 사용할 수 있는 메서드는 링크를 참고하시면 되겠습니다.

## 저작권

[MIT](https://github.com/tidory/tistory-skin/blob/master/LICENSE)

Copyright 2019-2021. [SangWoo Jeong](https://github.com/pronist). All rights reserved.
