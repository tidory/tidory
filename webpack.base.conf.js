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
const tidoryConfig = require(path.resolve(wd, './tidory.config'));
const Dotenv = require('dotenv-webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

function resolve(...paths) {
  return path.resolve(wd, ...paths);
}

let WebpackBaseConfig = {
  entry: {
    app: [].concat(resolve('./assets/app.js'))
  },
  module: {
    rules: [
      {
        test: /.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: require.resolve('file-loader'),
        options: {
          publicPath: tidoryConfig.build.public_path
        }
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: require.resolve('file-loader'),
        options: {
          publicPath: tidoryConfig.build.public_path
        }
      },
      {
        test: /.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: require.resolve('file-loader'),
        options: {
          publicPath: tidoryConfig.build.public_path
        }
      },
      {
        test: /\.css$/,
        use:  ["style-loader", "css-loader"].map(require.resolve)
      },
      {
        test: /\.vue$/,
        use: {
          loader: require.resolve('vue-loader')
        }
      },
      {
        /** https://vue-loader.vuejs.org/guide/pre-processors.html#pug */
        test: /\.pug$/,
        oneOf: [
          // this applies to `<template lang="pug">` in Vue components
          {
            resourceQuery: /^\?vue/,
            use: {
              loader: require.resolve('pug-plain-loader'),
              options: {
                basedir: wd
              }
            }
          },
          // this applies to pug imports inside JavaScript
          {
            use: [
              {
                loader: require.resolve('raw-loader')
              },
              {
                loader: require.resolve('pug-plain-loader'),
                options: {
                  basedir: wd
                }
              }
            ]
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: ['babel-preset-es2015', 'babel-preset-react'].map(require.resolve),
            /** https://github.com/pugjs/babel-plugin-transform-react-pug */
            plugins: [
              "babel-plugin-transform-react-pug",
              "babel-plugin-transform-react-jsx",
              /** https://github.com/ezhlobo/babel-plugin-transform-jsx-classname-components */
              "babel-plugin-transform-jsx-classname-components"
            ].map(require.resolve)
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      "~": resolve(".")
    }
  },
  plugins: [
    new Dotenv(),
    new VueLoaderPlugin()
  ]
};

if(tidoryConfig.extends && typeof tidoryConfig.extends === 'function') {
  tidoryConfig.extends(WebpackBaseConfig);
}

module.exports = WebpackBaseConfig;