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

const Dotenv = require('dotenv-webpack');

function __resolve(_path) {
  return path.resolve(wd, _path);
}

const assets = {
  app: [
    __resolve('./webpack.entry.js')
  ]
};

module.exports = merge(webpackBaseConfig, {
  entry: assets,
  resolve: {
    alias: {
      "~": __resolve(".")
    }
  },
  plugins: [
    new Dotenv()
  ]
});