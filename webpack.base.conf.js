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
const Util = require('./src/core/utility');

const pugLoader = path.join(__dirname, './loaders/pug-loader');

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
      "~": __resolve("."),
      "@models": __resolve("./database/models"),
      "@schemas": __resolve("./database/schemas"),
      "@config": __resolve("./routes/config"),
      "@controllers": __resolve("./routes/controllers"),
      "@middlewares": __resolve("./routes/middlewares"),
      "@views": __resolve("./routes/views")
    }
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        oneOf: [
          {
            resourceQuery: /^\?vue/,
            use: {
              loader: 'pug-plain-loader',
              options: {
                data: Util.getGlobalVariables(true)
              } 
            }
          },
          {
            include: [__resolve('routes/views')],
            use: [
              'raw-loader',
              {
                loader: 'pug-plain-loader',
                options: {
                  data: Util.getGlobalVariables(true)
                }
              } 
            ]
          },
          {
            use: {
              loader: pugLoader,
              options: {
                root: __resolve(".")
              }
            }
          }
        ]
      }
    ]
  }
});