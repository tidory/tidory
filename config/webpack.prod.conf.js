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
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

const webpackBaseConfig = require('./webpack.base.conf');
const TidoryWebpackPlugin = require('../plugins/webpack.tidory.plugin');

module.exports = env => {
  return merge(webpackBaseConfig(env), {
    resolve: {
      alias: {
        'vue': path.resolve(wd, 'node_modules/vue/dist/vue.min.js')
      }
    },
    output: {
      filename: '[name].[hash].js',
      path: path.resolve(wd, './dist/images'),
      publicPath: "./images/"
    },
    stats: "errors-only",
    plugins: [
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
          ecma: 5,
        },
        sourceMap: true
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true
      }),
      new CopyWebpackPlugin([{ from: './images', to: './' }]),
      new CopyWebpackPlugin([{ from: 'docs', to: '../' }]),
      new HtmlWebpackPlugin({
        template: path.resolve(wd, './index.pug'),
        filename: path.resolve(wd, './dist/skin.html'),
        inject: true,
        dev: false,
        minify: {
          removeComments: false,
          collapseWhitespace: true,
          caseSensitive: true
        }
      }),
      new CleanWebpackPlugin(['dist'], {
        root: wd,
        verbose: false,
        dry: false
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new TidoryWebpackPlugin(env)
    ]
  });
}