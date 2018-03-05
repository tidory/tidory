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

const path = require('path');

module.exports = {
	entry:  path.resolve(__dirname, './webpack.entry.js'),
	module: {
		rules: [
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'file-loader',
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'file-loader',
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'file-loader',
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
				test: /\.css$/,
				use:  ["style-loader", "css-loader"]
			},
			{
				test: /\.pug$/,
				use: ['pug-loader']
			}
		]
	}
}