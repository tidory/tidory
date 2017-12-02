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
 *      Homepage. http://www.tidory.com
 *      Github. https://github.com/pronist/
 */

const webpack = require('webpack')
const path = require('path');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const config = require('./tistory.build.config');

module.exports = merge(webpackBaseConfig, {
    devtool: 'inline-source-map',
    devServer: {
        quiet: true,
        hot: true,
		watchContentBase: true,   
        index: config.dev.index
    },
    output: {
        filename: config.dev.filename,
        publicPath: config.dev.publicPath,
		path: config.dev.path
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use:  ["style-loader", "css-loader"]
            },
            {
                test: /\.less$/,
                use: ["style-loader" ,"css-loader", "less-loader"]
            }
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('dev')
        }),
        new HtmlWebpackPlugin({
            template: config.pugTemplate,
            filename: config.exportHtmlFileName,
            inject: true
		})
    ]
});