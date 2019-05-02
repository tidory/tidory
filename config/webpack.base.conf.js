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
require('dotenv').config()

const wd = process.cwd();
const path = require('path');
const Dotenv = require('dotenv-webpack');

const pugAlias = require('../lib/pug-alias');
const tidoryConfig = require(path.resolve(wd, './tidory.config'));

let webpackBaseConfig = {
  entry: {
    app: path.resolve(wd, './assets/app.js')
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
        test: /\.pug$/,
        use: [
          {
            loader: require.resolve('raw-loader')
          },
          {
            loader: require.resolve('pug-plain-loader'),
            options: {
              plugins: [
                pugAlias
              ],
              basedir: wd
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: modulePath => {
          return /(node_modules||bower_components)/.test(modulePath) && !/node_modules\\@tidory/.test(modulePath);
        },
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: ['babel-preset-es2015', 'babel-preset-react'].map(require.resolve)
          }
        }
      },
      {
        test: /\.vue$/,
        use: {
          loader: require.resolve('vue-loader'),
          options: {
            loaders: {
              js: require.resolve('babel-loader')
            }
          }
        }
      },
    ]
  },
  plugins: [
    new Dotenv()
  ]
}

if(tidoryConfig.extends && typeof tidoryConfig.extends === 'function') {
  tidoryConfig.extends(webpackBaseConfig);
}

module.exports = webpackBaseConfig;