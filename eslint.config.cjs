const defaultConfig = require( '@wordpress/scripts/config/eslint.config.cjs' );

module.exports = [
	{
		ignores: [ 'assets/**' ],
	},
	...defaultConfig,
	{
		files: [ '**/*.jsx' ],
	},
];
