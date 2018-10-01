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

const merge = require('webpack-merge');
const webpackMinifyConfig = require('./webpack.minify.conf');
const TidoryBuildWebpackPlugin = require('./webpack.build.plugin');

module.exports = merge({
	customizeArray: merge.unique(
    'plugins',
    ['TidoryBuildWebpackPlugin'],
    plugin => plugin.constructor && plugin.constructor.name
	)
})({
	plugins: [
	  new TidoryBuildWebpackPlugin({ build: false })
  ]
}, webpackMinifyConfig);