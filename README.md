# Tistory Skin

Javascript **Tistory Skin** package, DON'T USE ON FRONT-END

# Installation

```bash
npm install --save tistory-skin
```

# Getting Started

```javascript
const TistorySkin = require('tistory-skin');

(async function(TistorySkin) {

  /**
   * WARNING: TSSESSION is Tistory Session Cookie
   */
  const tistorySkin = new TistorySkin('__BLOG_URL__', '__TSSESSION__');

  let { skin, home, skinSettings, variables, variableSettings } = await tistorySkin.settings();

  // { name: ...., }
  console.log(skin);
 
  /**
   * MUST call 'prepare' before Changing
   */
  let { html, css, files } = await tistorySkin.prepare();

  // { list: [ ... ]}
  console.log(files);

  let previewURL = await tistorySkin.change(
    '<html><head></head><body><h1>Hello, World!</h1></body></html>', // html
    'html{margin:0px;padding:0px;}', // css
    true // isPreview
  );

  // __BLOG_URL__/manage/previewSkin.php?skin=...
  console.log(previewURL);

  /**
   * 'mode' is able to be
   * 'index', 'entry', 'category', 'tag', 'location', 'media', 'guestbook'
   */
  let previewHTML = await tistorySkin.preview('index');

  // <html> ... </html>
  console.log(previewHTML);

})(TistorySkin);
```

# Methods

|Name|Description|
|----|-----------|
|prepare(): object|Prepare for Editing|
|settings(): object|Get settings|
|change(html: string, css: string, boolean: isPreview): string|Change **Markup**, **CSS**|
|preview(mode: string): string|Get preview|