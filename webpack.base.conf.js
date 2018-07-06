/**
 * @author Mansu Jeong
 * @description 
 * Copyright (c) Mansu Jeong. All rights reserved.
 * 
 * Ref. https://webpack.js.org/configuration/dev-server/
 * Webpack. https://webpack.js.org/
 * 
 * Author. Mansu Jeong
 * Homepage. http://www.tidory.com
 * Github. https://github.com/pronist/
 */

const wd = process.cwd();

const path = require('path');
const merge = require('webpack-merge');
const webpackBaseConfig = require(path.resolve(wd, './webpack.base.conf'));

const pugLoader = path.join(__dirname, './loaders/pug-loader/index.js');

function __resolve(_path) {
  return path.resolve(wd, _path);
}

const assets = {
  tidory: [
    __resolve('./webpack.entry.js'),
    __resolve('./routes/index.js')
  ]
};

module.exports = merge(webpackBaseConfig, {
  entry: assets,
  resolve: {
    alias: {
      "~": __resolve("."),
      "@assets": __resolve("./assets"),
      "@controllers": __resolve("./routes/controllers"),
      "@middlewares": __resolve("./routes/middlewares"),
      "@models": __resolve("./database/models"),
      "@schemas": __resolve("./database/schemas")
    }
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [ pugLoader ]
      }
    ]
  }
});