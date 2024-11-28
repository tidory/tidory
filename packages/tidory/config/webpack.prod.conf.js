const wd = process.cwd()

const path = require('path')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const webpackBaseConfig = require('./webpack.base.conf')
const tidoryConfig = require('../tidory.config')

module.exports = async env => {
  return merge(await webpackBaseConfig(env), {
    mode: 'production',
    output: {
      filename: '[name].[fullhash].js',
      path: path.resolve(wd, tidoryConfig.path.dist, tidoryConfig.path.publicPath),
      publicPath: tidoryConfig.path.publicPath,
      asyncChunks: false
    },
    plugins: [
      new CopyPlugin({ patterns: [{ from: tidoryConfig.path.publicPath, to: './' }] }),
      new CopyPlugin({ patterns: [{ from: tidoryConfig.path.docs, to: '../' }] }),
      new HtmlWebpackPlugin({
        template: path.resolve(wd, tidoryConfig.path.template),
        filename: path.resolve(wd, tidoryConfig.path.dist, tidoryConfig.path.index),
        inject: true,
        scriptLoading: 'defer',
        minify: {
          collapseWhitespace: true,
          keepClosingSlash: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        }
      }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: [path.resolve(wd, tidoryConfig.path.dist, '**/*')]
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ],
    optimization: {
      minimizer: [new TerserPlugin({ terserOptions: { ecma: 5 } })]
    }
  })
}
