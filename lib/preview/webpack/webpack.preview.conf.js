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
const merge = require('webpack-merge');
const webpackBaseConfig = require(path.resolve(__dirname, '../../../webpack.base.conf'));

module.exports = merge(webpackBaseConfig, {
	devtool: 'inline-source-map',
	devServer: {
		open: "http://localhost:8080",
		watchContentBase: true
	}
})