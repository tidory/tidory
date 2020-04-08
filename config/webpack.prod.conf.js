const wd = process.cwd()

const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const webpackBaseConfig = require('./webpack.base.conf')
const tidoryConfig = require('../tidory.config')

module.exports = async env => {
  return merge(await webpackBaseConfig(env), {
    resolve: {
      alias: {
        vue: path.resolve(wd, 'node_modules/vue/dist/vue.min.js')
      }
    },
    output: {
      filename: '[name].[hash].js',
      path: path.resolve(wd, tidoryConfig.path.dist, tidoryConfig.path.publicPath),
      publicPath: tidoryConfig.path.publicPath
    },
    stats: 'errors-only',
    plugins: [
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
          ecma: 5
        },
        sourceMap: true
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { discardComments: { removeAll: true } },
        canPrint: true
      }),
      new CopyWebpackPlugin([{ from: tidoryConfig.path.publicPath, to: './' }]),
      new CopyWebpackPlugin([{ from: tidoryConfig.path.docs, to: '../' }]),
      new HtmlWebpackPlugin({
        template: path.resolve(wd, tidoryConfig.path.template),
        filename: path.resolve(wd, tidoryConfig.path.dist, tidoryConfig.path.index),
        inject: true,
        dev: false,
        minify: {
          removeComments: false,
          collapseWhitespace: true,
          caseSensitive: true
        }
      }),
      new CleanWebpackPlugin([tidoryConfig.path.dist], {
        root: wd,
        verbose: false,
        dry: false
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ]
  })
}
