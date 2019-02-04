# Tistory Skin

Javascript **Tistory Skin** package.

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

  let { skin, home, skinSettings } = await tistorySkin.settings();

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

### TistorySkin(BLOG_URL: string, TSSESSION: string)

Create TistorySkin Instance

#### Parameters

* BLOG_URL: **Tistory Blog URL**
* TESSESSION: WARNING: Tistory Login **Session Cookie**

#### Usage

```javascript
let skin = new TistorySkin('https://appwriter.tistory.com', '__TSSESSION__');
```

### TistorySkin.prepare(void)

Prepare TISTORY SKIN

#### Usage

```javascript
let response = await skin.prepare();
```

### TistorySkin.settings(void)

Get TISTORY SKIN settings

#### Usage

```javascript
let response = await skin.settings();
```

### TistorySkin.change(html: string, css: string, isPreview)

Change Tistory Skin

#### Parameters

* html: HTML String
* css: CSS String,
* isPreview: ```ture``` is preview mode, ```false``` is deploy mode

#### Usage

```javascript
await skin.prepare();
///

let response = await skin.change(
  '<html><head></head><body><h1>Hello, World!</h1></body></html>', // html
  'html{margin:0px;padding:0px;}', // css
  true // isPreview
);
```

### TistorySkin.upload(path: string)

Upload a File on file storage of Current Tistory Skin

#### parameters

* path: **local** file path

#### Usage

```javascript
let response = await skin.upload('./README.md');
```

### TistorySkin.unlink(path: string)

Delete a File on file storage of Current Tistory Skin

#### Parameters

* path: **tistory** file path.

#### Usage

```javascript
let response = await skin.unlink('images/README.md');
```

### TistorySkin.clear(void)

Delete all files on files storage of Current Tistory Skin

#### Usage

```javascript
await skin.clear();
```

### TistorySkin.set(skinname: string)

set Tistory Skin

#### Parameters

* skinname: Tistory Skin **Name**

#### Usage

```javascript
await skin.set('pg_Poster');
```

### TistorySkin.deploy(dist: string)

Deploy Tistory Skin

#### Parameters

* dist: **dist** Directory

#### Usage

```javascript
await skin.deploy('./dist');
```

### TistorySkin.preview(mode: string)

Get preview

#### Parameters

* mode: **preview** mode

mode is able to be **index**, **entry**, **category**, **tag**, **location**, **media**, **guestbook**

#### Usage

```javascript
let response = await skin.preview('index');
```

### TistorySkin.storage.upload(path: string)

Upload a File on Skin Storage

#### Parameters

* path: **local** file path

#### Usage

```javascript
let response = await skin.storage.upload('./README.md');
```

### TistorySkin.storage.unlink(filename: string)

Delete a File on Skin Storage

#### Parameters

* filename: DON'T USE FULL FILE PATH

#### Usage

```javascript
// images/README.md => incorrect
let response = await skin.storage.unlink('README.md');
```

### TistorySkin.storage.uploaded(void)

Get uploaded files on Skin Storage

#### Usage

```javascript
let response = await skin.storage.uploaded();
```

### TistorySkin.storage.clear(void)

Delete all files on Skin Storage

#### Usage

```javascript
await skin.storage.clear();
```

### TistorySkin.storage.remove(skinname: string)

Delete a Skin on Skin Storage

#### Parameters

* skinname: Tistory Skin **Name**

#### Usage

```javascript
await skin.storage.remove('2710108_1549285067');
```

### TistorySkin.storage.save(skinname: string)

Save a Tistory Skin on Skin Storage

#### Parameters

* skinname: Tistory Skin **Name**

#### Usage

```javascript
await skin.storage.upload('./skin.html');
// ...

let response = await skin.storage.save('TISTORY_SKIN');
```

### TistorySkin.storage.store(dist: string, skinname: string)

Store a Tistory Skin on Skin Storage

#### Parameters

* dist: **dist** Directory
* skinname: Tistory Skin **Name**

#### Usage

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
await skin.storage.store('./dist', 'TISTORY_SKIN');
```

### TistorySkin.storage.archive(void)

Get stored Tistory Skins on Skin Storage

#### Usage

```javascript
let response = await skin.storage.archive();
```