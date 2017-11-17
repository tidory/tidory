/**
 * @author Mansu Jeong
 * @description 
 *      Copyright (c) Mansu Jeong. All rights reserved.
 * 
 *      Ref. https://webpack.js.org/configuration/dev-server/
 *      Webpack. https://webpack.js.org/
 * 
 *      Author. Mansu Jeong
 *      Alias. App Writer
 *      Homepage. http://appwriter.tistory.com
 *      Github. https://github.com/pronist/
 */

const webpack = require('webpack')
const path = require('path');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.conf');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./tistory.build.config');

module.exports = merge(webpackBaseConfig, {
    output: {
        filename: config.build.filename,
        publicPath: config.build.publicPath,
        path: config.build.path,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                  fallback: "style-loader",
                  use: "css-loader"
                }),
            },
            {
                test: /\.less$/i,
                use: ExtractTextPlugin.extract([ 'css-loader', 'less-loader' ]),
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
              },
            sourceMap: true
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new CopyWebpackPlugin([           
            {
                from: config.build.staticCopyFrom,
                to: config.build.staticCopyTo,
            },
        ]),
        new CopyWebpackPlugin([           
            {
                from: config.build.indexCopyFrom,
                to: config.build.indexCopyTo,
            },
        ]),
        new HtmlWebpackPlugin({
            template: config.pugTemplate,
            filename: config.exportHtmlFileName,
            inject: false
        }),
        new ExtractTextPlugin(config.build.style)
    ]
});