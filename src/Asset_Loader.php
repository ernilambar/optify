<?php
/**
 * Asset Loader Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify;

/**
 * Generic Asset Loader class for panel systems.
 *
 * @since 1.0.0
 */
class Asset_Loader {

	/**
	 * Package directory path.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private static $package_dir_path;

	/**
	 * Package URL.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private static $package_url;

	/**
	 * REST API namespace.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private static $rest_namespace;

	/**
	 * REST API version.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private static $rest_version;

	/**
	 * Asset file paths.
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	private static $asset_files;

	/**
	 * Initialize asset enqueuer.
	 *
	 * @since 1.0.0
	 *
	 * @param string $package_dir Package directory path.
	 * @param string $package_url Package URL.
	 * @param string $rest_namespace REST API namespace.
	 * @param string $rest_version REST API version.
	 */
	public static function init( $package_dir, $package_url, $rest_namespace, $rest_version ) {
		// Remove trailing slashes from both path and URL.
		$package_dir = rtrim( $package_dir, '/' );
		$package_url = rtrim( $package_url, '/' );

		// Validate package directory exists.
		if ( ! is_dir( $package_dir ) ) {
			_doing_it_wrong(
				__METHOD__,
				sprintf(
					'Optify: Package directory does not exist: %s',
					esc_html( $package_dir )
				),
				'1.0.0'
			);
			return;
		}

		// Validate package directory contains required files.
		$required_files = [ 'src/Optify.php', 'assets/optify.asset.php' ];
		foreach ( $required_files as $file ) {
			if ( ! file_exists( $package_dir . '/' . $file ) ) {
				_doing_it_wrong(
					__METHOD__,
					sprintf(
						'Optify: Required file not found in package directory: %s',
						esc_html( $file )
					),
					'1.0.0'
				);
				return;
			}
		}

		self::$package_dir_path = $package_dir;
		self::$package_url      = $package_url;
		self::$rest_namespace   = $rest_namespace;
		self::$rest_version     = $rest_version;
		self::$asset_files      = [
			'css_file'   => 'assets/optify.css',
			'js_file'    => 'assets/optify.js',
			'asset_file' => 'assets/optify.asset.php',
		];
	}

	/**
	 * Get package directory path and URL.
	 *
	 * @since 1.0.0
	 *
	 * @return array Array with 'path' and 'url' keys.
	 */
	private static function get_package_paths() {
		// Check if initialization was successful.
		if ( empty( self::$package_dir_path ) || empty( self::$package_url ) ) {
			_doing_it_wrong(
				__METHOD__,
				'Optify: Asset enqueuer not properly initialized. Check package directory and URL.',
				'1.0.0'
			);
			return [
				'path' => '',
				'url'  => '',
			];
		}

		return [
			'path' => self::$package_dir_path, // Already normalized (no trailing slash)
			'url'  => self::$package_url,      // Already normalized (no trailing slash)
		];
	}

	/**
	 * Enqueue panel assets.
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook Current admin page hook.
	 * @param array  $panel_configs Panel configurations by location.
	 * @param string $global_var_name Global variable name for localization.
	 */
	public static function enqueue_panel_assets( $hook, $panel_configs = [], $global_var_name = 'optifyAdmin' ) {
		// Get package version and calculate priority.
		$version  = Optify::VERSION;
		$priority = self::version_to_priority( $version );

		// Hook with version-based priority (higher version = lower priority = wins).
		add_action(
			'admin_enqueue_scripts',
			function () use ( $hook, $panel_configs, $global_var_name ) {
				self::do_enqueue_assets( $hook, $panel_configs, $global_var_name );
			},
			$priority
		);
	}

	/**
	 * Do the actual asset enqueuing.
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook Current admin page hook.
	 * @param array  $panel_configs Panel configurations by location.
	 * @param string $global_var_name Global variable name for localization.
	 */
	private static function do_enqueue_assets( $hook, $panel_configs, $global_var_name ) {
		// Initialize asset manager.
		Asset_Manager::init();

		// Enqueue WordPress components styles.
		wp_enqueue_style( 'wp-components' );

		// Get package directory path and URL.
		$package_paths = self::get_package_paths();

		// Skip if initialization failed.
		if ( empty( $package_paths['path'] ) || empty( $package_paths['url'] ) ) {
			return;
		}

		// Enqueue plugin assets.
		$asset_file = $package_paths['path'] . '/' . self::$asset_files['asset_file'];
		if ( ! file_exists( $asset_file ) ) {
			_doing_it_wrong(
				__METHOD__,
				sprintf(
					'Optify: Asset file not found: %s. Make sure to run "pnpm run build" in the package directory.',
					esc_html( $asset_file )
				),
				'1.0.0'
			);
			return;
		}

		$asset = require $asset_file;

		// Enqueue main CSS file.
		$css_file = $package_paths['path'] . '/' . self::$asset_files['css_file'];
		if ( file_exists( $css_file ) ) {
			wp_enqueue_style(
				'optify-admin-styles',
				$package_paths['url'] . '/' . self::$asset_files['css_file'],
				[],
				$asset['version']
			);
		}

		// Enqueue JavaScript file.
		$js_file = $package_paths['path'] . '/' . self::$asset_files['js_file'];
		if ( file_exists( $js_file ) ) {
			wp_enqueue_script(
				'optify-admin-options',
				$package_paths['url'] . '/' . self::$asset_files['js_file'],
				$asset['dependencies'],
				$asset['version'],
				true
			);

			wp_localize_script(
				'optify-admin-options',
				$global_var_name,
				[
					'nonce'       => wp_create_nonce( 'wp_rest' ),
					'restUrl'     => rest_url( self::$rest_namespace . '/' . self::$rest_version . '/' ),
					'currentPage' => $hook,
					'panels'      => $panel_configs,
				]
			);
		}
	}



	/**
	 * Convert version to priority (higher version = lower priority = wins).
	 *
	 * @since 1.0.0
	 *
	 * @param string $version Package version.
	 * @return int Priority value.
	 */
	private static function version_to_priority( $version ) {
		// Extract version parts.
		$parts = explode( '.', $version );
		$major = (int) ( $parts[0] ?? 1 );
		$minor = (int) ( $parts[1] ?? 0 );
		$patch = (int) ( $parts[2] ?? 0 );

		// Calculate priority: 9999 - (major * 100 + minor * 10 + patch).
		// v1.0.0 = 9899, v1.1.0 = 9889, v1.2.0 = 9879, v2.0.0 = 9799.
		return 9999 - ( $major * 100 + $minor * 10 + $patch );
	}

	/**
	 * Get asset configuration.
	 *
	 * @since 1.0.0
	 *
	 * @return array Asset configuration.
	 */
	public static function get_asset_config() {
		return [
			'package_dir' => self::$package_dir_path,
			'package_url' => self::$package_url,
			'asset_files' => self::$asset_files,
		];
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
