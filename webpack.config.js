const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

module.exports = {
	...defaultConfig,
	entry: {
		optify: './resources/index.js',
	},
	output: {
		...defaultConfig.output,
		filename: '[name].js',
		chunkFilename: '[name].js',
		path: require( 'path' ).resolve( __dirname, 'assets' ),
		// Don't clean output directory - let webpack handle file replacement.
		clean: false,
	},
	optimization: {
		...defaultConfig.optimization,
		// Disable chunk splitting - bundle everything into one file.
		splitChunks: false,
	},
	// Enable persistent caching .
	cache: {
		type: 'filesystem',
		buildDependencies: {
			config: [ __filename ],
		},
	},
};
