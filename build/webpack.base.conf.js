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

module.exports = {
    entry: './src/main.js',
    module: {
        rules: [
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['es2015']
                  }
                }
            },
            {
                test: /\.pug$/,
                use: ['pug-loader']
            }
        ]
    }
}