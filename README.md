# Tistory Skin API for Javascript

Unofficial **Tistory Skin API** for Javascript

## Installation

```bash
npm install --save tistory-skin
```

## Getting Started

```javascript
const TistorySkin = require('tistory-skin');

(async function (TistorySkin) {
  /**
   * WARNING: TSSESSION is Tistory Session Cookie
   */
  const tistorySkin = new TistorySkin('__BLOG_URL__', '__TSSESSION__')

  const { skin, home, skinSettings } = await tistorySkin.settings()

  // { name: ...., }
  console.log(skin)

  /**
   * MUST call 'prepare' before Changing
   */
  const { html, css, files } = await tistorySkin.prepare()

  // { list: [ ... ]}
  console.log(files)

  const previewURL = await tistorySkin.change(
    '<html><head></head><body><h1>Hello, World!</h1></body></html>', // html
    'html{margin:0px;padding:0px;}', // css
    true // isPreview
  )

  // __BLOG_URL__/manage/previewSkin.php?skin=...
  console.log(previewURL)

  /**
   * 'mode' is able to be
   * 'index', 'entry', 'category', 'tag', 'location', 'media', 'guestbook'
   */
  const previewHTML = await tistorySkin.preview('index')

  // <html> ... </html>
  console.log(previewHTML)
})(TistorySkin)
```

## Methods

### TistorySkin(BLOG_URL: string, TSSESSION: string)

Create TistorySkin Instance

* BLOG_URL: **Tistory Blog URL**
* TESSESSION: WARNING: Tistory Login **Session Cookie**

```javascript
new TistorySkin('https://appwriter.tistory.com', '__TSSESSION__');
```

### TistorySkin.prepare(void)

Prepare TISTORY SKIN

```javascript
skin.prepare();
```

### TistorySkin.settings(void)

Get TISTORY SKIN settings

```javascript
skin.settings();
```

### TistorySkin.config(settings: object)

Set TISTORY SKIN settings

* settings: Tistory Skin **settings**

```javascript
skin.config({ homeType: 'NONE' });
```

### TistorySkin.change(html: string, css: string, isPreview)

Change Tistory Skin

* html: HTML String
* css: CSS String,
* isPreview: ```ture``` is preview mode, ```false``` is deploy mode

```javascript
skin.change(
  '<html><head></head><body><h1>Hello, World!</h1></body></html>', // html
  'html{margin:0px;padding:0px;}', // css
  true // isPreview
);
```

### TistorySkin.upload(path: string)

Upload a File on file storage of Current Tistory Skin

* path: **local** file path

```javascript
skin.upload('./README.md');
```

### TistorySkin.unlink(path: string)

Delete a File on file storage of Current Tistory Skin

* path: **tistory** file path.

```javascript
skin.unlink('images/README.md');
```

### TistorySkin.clear(void)

Delete all files on files storage of Current Tistory Skin

```javascript
skin.clear();
```

### TistorySkin.set(skinname: string)

set Tistory Skin

* skinname: Tistory Skin **Name**

```javascript
skin.set('pg_Poster');
```

### TistorySkin.deploy(dist: string)

Deploy Tistory Skin

* dist: **dist** Directory

```javascript
skin.deploy('./dist');
```

### TistorySkin.preview(settings: object)

Get preview

* settings: Tistory Skin **preview settings**

```javascript
skin.preview({ mode: 'index' });
```

### TistorySkin.storage.upload(path: string)

Upload a File on Skin Storage

* path: **local** file path

```javascript
skin.storage.upload('./README.md');
```

### TistorySkin.storage.unlink(filename: string)

Delete a File on Skin Storage

* filename: DON'T USE FULL FILE PATH

```javascript
// images/README.md => incorrect
skin.storage.unlink('README.md');
```

### TistorySkin.storage.uploaded(void)

Get uploaded files on Skin Storage

```javascript
skin.storage.uploaded();
```

### TistorySkin.storage.clear(void)

Delete all files on Skin Storage

```javascript
skin.storage.clear();
```

### TistorySkin.storage.remove(skinname: string)

Delete a Skin on Skin Storage

* skinname: Tistory Skin **Name**

```javascript
skin.storage.remove('2710108_1549285067');
```

### TistorySkin.storage.save(skinname: string)

Save a Tistory Skin on Skin Storage

* skinname: Tistory Skin **Name**

```javascript
skin.storage.save('TISTORY_SKIN');
```

### TistorySkin.storage.store(dist: string, skinname: string)

Store a Tistory Skin on Skin Storage

* dist: **dist** Directory
* skinname: Tistory Skin **Name**

```javascript
/**
 * - dist
 *  skin.html
 *  style.css
 *  index.xml
 *  preview*.jpg
 *  - images
 *    script.js
 *    ...
 */
skin.storage.store('./dist', 'TISTORY_SKIN');
```

### TistorySkin.storage.archive(void)

Get stored Tistory Skins on Skin Storage

```javascript
skin.storage.archive();
```

## License

[MIT](https://github.com/tidory/tistory-skin/blob/master/LICENSE)

Copyright 2019-2020. [SangWoo Jeong](https://github.com/pronist). All rights reserved.
