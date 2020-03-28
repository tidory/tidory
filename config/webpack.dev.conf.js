const wd = process.cwd()

const path = require('path')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const TidoryWebpackPlugin = require('../lib/tidory-webpack-plugin')
const webpackBaseConfig = require('./webpack.base.conf')
const tidoryConfig = require('../tidory.config')

module.exports = async env => {
  return merge(await webpackBaseConfig(env), {
    devtool: 'inline-source-map',
    resolve: {
      alias: {
        vue: path.resolve(wd, 'node_modules/vue/dist/vue.js')
      }
    },
    devServer: {
      watchContentBase: true,
      index: tidoryConfig.path.public.index,
      open: true,
      port: env.MODE === 'development' ? '8080' : '3000',
      stats: 'errors-only'
    },
    output: {
      filename: '[name].[hash].js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(wd, tidoryConfig.path.build.template),
        filename: tidoryConfig.path.public.index,
        inject: true
      }),
      new TidoryWebpackPlugin(env)
    ]
  })
}
