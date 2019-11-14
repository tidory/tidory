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

const tidoryConfig = require(path.resolve(wd, './tidory.config'));
const pugAliasPlugin = require('../lib/pug-alias-plugin');

module.exports = env => {
  let fileLoaderConfig = {
    loader: require.resolve('file-loader'),
    options: {
      publicPath: (env.MODE == 'build' || env.MODE == 'production')
        ? tidoryConfig.build.public_path
        : '/'
    }
  };
  let webpackBaseConfig = { 
    entry: {
      app: path.resolve(wd, './assets/app.js')
    },
    module: {
      rules: [
        {
          test: /.(png|jpe?g|gif|svg)(\?.*)?$/,
          ...fileLoaderConfig
        },
        {
          test: /.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          ...fileLoaderConfig
        },
        {
          test: /.(woff2?|eot|ttf|otf)(\?.*)?$/,
          ...fileLoaderConfig
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
                basedir: wd,
                plugins: [
                  pugAliasPlugin(Object.assign(tidoryConfig.alias || {}, 
                    {
                      '@tidory': require('../lib/@tidory')
                    }
                  ))
                ]
              }
            }
          ]
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules(?!(\/|\\)@tidory)/,
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
  return webpackBaseConfig;
};