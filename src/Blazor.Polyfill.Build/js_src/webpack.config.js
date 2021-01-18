const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = env => {

	return {
		resolve: {
			extensions: ['*', '.js']
		},
		devtool: 'inline-source-map',
		module: {
			rules: [
				{
					test: /\.(js)$/,
					exclude: /@babel(?:\/|\\{1,2})runtime|core-js|node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							"plugins": [],
							"presets": [[env.presetEnvPath,
							{
								targets: {
									browsers: ["ie 11"]
								}
							}
							], env.preset2015Path],
							"sourceType": "module"
						}
					},
				}
			]
		},
		entry: {
			'es5module': path.join(env.intermediatePath, '/es5module_entry.js'),
			'es5module.min': path.join(env.intermediatePath, '/es5module_entry.js')
		},
		output: {
			path: env.intermediatePath, filename: '[name].js'
		},
		plugins: [
			new webpack.optimize.UglifyJsPlugin({
				include: /\.min\.js$/,
				minimize: true
			})
		]
	};
};
