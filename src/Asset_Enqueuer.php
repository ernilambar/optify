<?php
/**
 * Asset Enqueuer Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify;

/**
 * Generic Asset Enqueuer class for panel systems.
 *
 * @since 1.0.0
 */
class Asset_Enqueuer {

	/**
	 * Plugin file path.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private static $plugin_file;

	/**
	 * Asset configuration.
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	private static $asset_config;

	/**
	 * Initialize asset enqueuer.
	 *
	 * @since 1.0.0
	 *
	 * @param string $plugin_file Plugin file path.
	 * @param array  $asset_config Asset configuration.
	 */
	public static function init( $plugin_file, $asset_config = [] ) {
		self::$plugin_file  = $plugin_file;
		self::$asset_config = wp_parse_args(
			$asset_config,
			[
				'css_file'   => 'optify/assets/js/optify.css',
				'js_file'    => 'optify/assets/js/optify.js',
				'asset_file' => 'optify/assets/js/optify.asset.php',
			]
		);
	}

	/**
	 * Enqueue panel assets.
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook Current admin page hook.
	 * @param array  $panel_configs Panel configurations by location.
	 */
	public static function enqueue_panel_assets( $hook, $panel_configs = [] ) {
		// Initialize asset manager.
		Asset_Manager::init( self::$plugin_file );

		// Enqueue WordPress components styles.
		wp_enqueue_style( 'wp-components' );

		// Enqueue plugin assets.
		$asset_file = plugin_dir_path( self::$plugin_file ) . self::$asset_config['asset_file'];
		if ( file_exists( $asset_file ) ) {
			$asset = require $asset_file;

			// Enqueue main CSS file.
			wp_enqueue_style(
				'optify-admin-styles',
				plugin_dir_url( self::$plugin_file ) . self::$asset_config['css_file'],
				[],
				$asset['version']
			);

			// Enqueue options panel CSS file.
			wp_enqueue_style(
				'optify-options-panel-styles',
				plugin_dir_url( self::$plugin_file ) . 'optify/resources/css/options-panel.css',
				[],
				$asset['version']
			);

			wp_enqueue_script(
				'optify-admin-options',
				plugin_dir_url( self::$plugin_file ) . self::$asset_config['js_file'],
				$asset['dependencies'],
				$asset['version'],
				true
			);

			wp_localize_script(
				'optify-admin-options',
				'optifyAdmin',
				[
					'nonce'       => wp_create_nonce( 'wp_rest' ),
					'restUrl'     => rest_url( 'groundify/v1/' ),
					'currentPage' => $hook,
					'panels'      => $panel_configs,
				]
			);
		}
	}

	/**
	 * Get asset configuration.
	 *
	 * @since 1.0.0
	 *
	 * @return array Asset configuration.
	 */
	public static function get_asset_config() {
		return self::$asset_config;
	}

	/**
	 * Get plugin file path.
	 *
	 * @since 1.0.0
	 *
	 * @return string Plugin file path.
	 */
	public static function get_plugin_file() {
		return self::$plugin_file;
	}
}
