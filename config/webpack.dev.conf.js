const wd = process.cwd()

const path = require('path')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const webpackBaseConfig = require('./webpack.base.conf')
const tidoryConfig = require('../tidory.config')

module.exports = async env => {
  return merge(await webpackBaseConfig(env), {
    mode: 'development',
    devServer: {
      watchContentBase: true,
      index: tidoryConfig.path.index,
      hot: true,
      port: env.development ? '8080' : '3000',
      stats: 'normal'
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
        scriptLoading: 'blocking'
      })
    ]
  })
}
