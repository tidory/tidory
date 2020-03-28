require('dotenv').config()

const wd = process.cwd()
const path = require('path')
const Dotenv = require('dotenv-webpack')

const pugAliasPlugin = require('../lib/pug-alias-plugin')
const publicPath = require('../lib/publicPath')

const tidoryConfig = require('../tidory.config')

module.exports = async env => {
  const fileLoaderConfig = {
    loader: require.resolve('file-loader'),
    options: {
      publicPath: (env.MODE === 'build' || env.MODE === 'production')
        ? tidoryConfig.build.public_path || await publicPath(tidoryConfig)
        : '/'
    }
  }
  const webpackBaseConfig = {
    entry: {
      app: path.resolve(wd, tidoryConfig.path.build.entry)
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
          use: ['style-loader', 'css-loader'].map(require.resolve)
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
              presets: ['babel-preset-es2015-nostrict', 'babel-preset-react'].map(require.resolve)
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
        }
      ]
    },
    plugins: [
      new Dotenv()
    ]
  }
  if (tidoryConfig.extends && typeof tidoryConfig.extends === 'function') {
    tidoryConfig.extends(webpackBaseConfig)
  }
  return webpackBaseConfig
}
