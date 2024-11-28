const wd = process.cwd()

const path = require('path')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const webpackBaseConfig = require('./webpack.base.conf')
const tidoryConfig = require('../tidory.config')

module.exports = async env => {
  return merge(await webpackBaseConfig(env), {
    mode: 'development',
    cache: false,
    devServer: {
      magicHtml: false,
      watchFiles: tidoryConfig.path.devServer.watchFiles,
      hot: false,
      liveReload: true,
      port: env.development ? '8080' : '3000',
      devMiddleware: {
        index: tidoryConfig.path.index
      },
      static: {
        directory: path.resolve(wd, tidoryConfig.path.devServer.static.directory),
        publicPath: tidoryConfig.path.devServer.static.publicPath
      }
    },
    output: {
      filename: '[name].[fullhash].js'
    },
    devtool: 'source-map',
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(wd, tidoryConfig.path.template),
        filename: tidoryConfig.path.index,
        inject: true,
        scriptLoading: 'defer'
      })
    ]
  })
}
