const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
	...defaultConfig,
	entry: {
		'optify': './resources/index.js',
	},
	output: {
		...defaultConfig.output,
		filename: '[name].js',
		path: require('path').resolve(__dirname, 'assets'),
	},
};
