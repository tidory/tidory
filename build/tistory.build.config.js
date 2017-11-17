/**
 * @author Mansu Jeong
 * @description 
 *      Copyright (c) Mansu Jeong. All rights reserved.
 * 
 *      Ref. https://webpack.js.org/configuration/dev-server/
 *      Webpack. https://webpack.js.org/
 * 
 *      Author. Mansu Jeong
 *      Alias. App Writer
 *      Homepage. http://appwriter.tistory.com
 *      Github. https://github.com/pronist/
 */

const path = require('path');

function resolve(__path) {
    return path.resolve(__dirname, __path);
}

const config = {
    pugTemplate: resolve('../src/index.pug'),
    exportHtmlFileName: resolve('../dist/skin.html'),
    build: {
        filename: 'app.bundle.js',
        publicPath: 'images/',
        path: resolve('../dist/images'),
        staticCopyFrom: 'images',
        staticCopyTo : './',
        style: "../style.css"
    },
    dev: {
        filename: 'app.bundle.js',
        publicPath: '/',
        path: resolve('../dist'),
        index: 'skin.html'
    }
}

module.exports = config;