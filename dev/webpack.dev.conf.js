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
const webpackBaseConfig = require(path.resolve(__dirname, '../webpack.base.conf'));
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TidoryDevWebpackPlugin = require('./webpack.dev.plugin');

module.exports = merge(webpackBaseConfig, {
  devtool: 'inline-source-map',
  resolve: {
    alias: {
      'vue': path.resolve(wd, 'node_modules/vue/dist/vue.js')
    }
  },
  devServer: {
    watchContentBase: true,
    index: 'skin.html',
    open: 'http://localhost:8080',
    stats: "errors-only"
  },
  output: {
    filename: '[name].js'
  },  
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(wd, './index.pug'),
      filename: "skin.html",
      inject: true
    }),
    new TidoryDevWebpackPlugin()
  ]
});