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
const tidoryConfig = require(path.resolve(wd, './tidory.config'));
const Dotenv = require('dotenv-webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const fs = require('fs');
const pugPluginAlias = require('pug-alias');

let WebpackBaseConfig = {
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
        test: /\.vue$/,
        use: {
          loader: require.resolve('vue-loader')
        }
      },
      {
        /** https://vue-loader.vuejs.org/guide/pre-processors.html#pug */
        test: /\.pug$/,
        use: [
          {
            loader: require.resolve('raw-loader')
          },
          {
            loader: require.resolve('pug-plain-loader'),
            options: {
              plugins: [pugPluginAlias(Object.assign(tidoryConfig.alias || {}, {
                '@tidory': function(filename) {
                  // @tidory/my-package -> node_modules/@tidory/my-package/index.pug
                  return filename.replace(/^(@tidory)\/(.*).pug$/, function(m, alias, pkg) {
                    const pkgPath = path.join('node_modules', alias, pkg);
                    if(fs.existsSync(pkgPath) && fs.statSync(pkgPath).isDirectory()) {
                      return path.join('node_modules', alias, pkg, 'index.pug');
                    } else {
                      return pkgPath + '.pug';
                    }
                  });
                }}))
              ],
              basedir: wd
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: function(modulePath) {
          return /(node_modules||bower_components)/.test(modulePath) && !/node_modules\\@tidory/.test(modulePath);
        },
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: ['babel-preset-es2015', 'babel-preset-react'].map(require.resolve)
          }
        }
      }
    ]
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