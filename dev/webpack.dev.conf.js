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
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBaseConfig = require(path.resolve(__dirname, '../webpack.base.conf'));
const HtmlWebpackWatchPlugin = require('html-webpack-watch-plugin');
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
    filename: 'images/[name].js',
    publicPath: '/'
  },  
  plugins: [
    new HtmlWebpackWatchPlugin({
      template: path.join(wd, './index.pug'),
      filename: "skin.html",
      inject: true,
      watchOptions: {
        files: [ 
          path.resolve(wd, './routes/views/**/*.pug') 
        ]
      }
    }),
    new TidoryDevWebpackPlugin()
  ]
});