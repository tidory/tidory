# Change Log

## 8.0.2

- tidory production 에서 ```defer, async, readonly``` 등 **boolean attributes** 에 대해 올바르게 변환되지 않았던 점이 수정되었습니다. 하지만 이 사항은 티스토리에서 사용하는 치환자 및 커스텀 속성에는 적용되지 않으며 이전과 마찬가지로 비어있는 상태로 나타납니다.

## 8.0.1

- HtmlWebpackPlugin 에서 HTML Comment 를 제거하던 것을 수정하였습니다.

## 8.0.0

- **Webpack 3** 에서 **Webpack 5** 로 업데이트 되었습니다.
- **Pug 2** 에서 **Pug 3** 로 업데이트 되었습니다.
- SPA(Single Page Application) 프레임워크, **Vue 3**, **Svelte 3**, **React 17** 를 지원합니다.
- **postcss** 를 사용할 수 있습니다. ```postcss.config.js``` 설정은 템플릿 내부 ```style``` 태그가 사용된 스타일에도 적용됩니다.
- **Node.js** 의 최소버전이 **12.0** 으로 업데이트 되었습니다.

## 7.5.1

- ```style```, ```script``` 태그가 올바르게 분리되지 않던 버그가 수정되었습니다.

## 7.5.0

- **tidory build** 명령어가 제거되었습니다.
- **tidory production** 을 진행할 때 ```ts_session``` 이 없으면 진행되지 않던 문제가 해결됩니다. 이제 ```ts_session``` 이 없으면 ```public_path``` 는 ```/``` 가 되며 존재하는 경우 자동으로 설정합니다.
- 이제 설정 파일에 대해 **tidory.config.js** 말고도 **tidory.config.example.js** 파일로도 설정을 불러올 수 있습니다. **tidory.config.js** 가 존재하지 않는 경우 **tidory.config.example.js** 를 불러오는 것을 시도합니다.
