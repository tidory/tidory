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
 */

const wd = process.cwd();

const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackBaseConfig = require('./webpack.base.conf');
const TidoryWebpackPlugin = require('../plugins/webpack.tidory.plugin');

module.exports = env => {
  return merge(webpackBaseConfig, {
    devtool: 'inline-source-map',
    resolve: {
      alias: {
        'vue': path.resolve(wd, 'node_modules/vue/dist/vue.js')
      }
    },
    devServer: {
      watchContentBase: true,
      index: 'skin.html',
      open: true,
      port: env.MODE == 'development'? '8080': '3000',
      stats: "errors-only"
    },
    output: {
      filename: '[name].[hash].js'
    },  
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(wd, './index.pug'),
        filename: "skin.html",
        inject: true
      }),
      new TidoryWebpackPlugin(env)
    ]
  });
}