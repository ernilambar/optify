/** @type {import('postcss-load-config').Config} */
const config = {
	plugins: [
		require( 'postcss-preset-env' ),
		require( 'postcss-nested' ),
		require( 'postcss-import' ),
	],
};

module.exports = config;
