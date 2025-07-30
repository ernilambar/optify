<?php
/**
 * Asset Manager Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify;

/**
 * Generic asset manager for enqueuing scripts and styles.
 *
 * @since 1.0.0
 */
class Asset_Manager {

	/**
	 * Package directory path.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private static $package_dir_path;

	/**
	 * Initialize asset manager.
	 *
	 * @since 1.0.0
	 */
	public static function init() {
		self::$package_dir_path = dirname( __DIR__ );
	}

	/**
	 * Enqueue script with asset file support.
	 *
	 * @since 1.0.0
	 *
	 * @param string $handle Script handle.
	 * @param string $asset_path Asset file path relative to plugin.
	 * @param string $script_path Script file path relative to plugin.
	 * @param array  $localize_data Data to localize.
	 */
	public static function enqueue_script( $handle, $asset_path, $script_path, $localize_data = [] ) {
		// Get package directory path and URL from Asset_Loader.
		$package_paths = Asset_Loader::get_package_paths();

		$asset_file = $package_paths['path'] . '/' . $asset_path;

		if ( file_exists( $asset_file ) ) {
			$asset = require $asset_file;

			wp_enqueue_script(
				$handle,
				$package_paths['url'] . $script_path,
				$asset['dependencies'] ?? [],
				$asset['version'] ?? '1.0.0',
				true
			);

			if ( ! empty( $localize_data ) ) {
				wp_localize_script( $handle, $handle . 'Data', $localize_data );
			}
		}
	}

	/**
	 * Enqueue style.
	 *
	 * @since 1.0.0
	 *
	 * @param string $handle Style handle.
	 * @param string $style_path Style file path relative to plugin.
	 * @param array  $dependencies Dependencies.
	 * @param string $version Version.
	 */
	public static function enqueue_style( $handle, $style_path, $dependencies = [], $version = '1.0.0' ) {
		wp_enqueue_style(
			$handle,
			plugin_dir_url( self::$plugin_file ) . $style_path,
			$dependencies,
			$version
		);
	}

	/**
	 * Enqueue admin styles.
	 *
	 * @since 1.0.0
	 *
	 * @param string $style_path Style file path relative to plugin.
	 * @param string $version Version.
	 */
	public static function enqueue_admin_style( $style_path, $version = '1.0.0' ) {
		self::enqueue_style( 'optify-admin-styles', $style_path, [], $version );
	}

	/**
	 * Enqueue admin assets conditionally.
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook Current admin page hook.
	 * @param array  $config Asset configuration.
	 */
	public static function enqueue_admin_assets( $hook, $config ) {
		foreach ( $config as $asset ) {
			if ( isset( $asset['script'] ) ) {
				self::enqueue_script(
					$asset['handle'],
					$asset['asset_path'],
					$asset['script_path'],
					$asset['localize_data'] ?? []
				);
			}

			if ( isset( $asset['style'] ) ) {
				self::enqueue_style(
					$asset['handle'],
					$asset['style_path'],
					$asset['dependencies'] ?? [],
					$asset['version'] ?? '1.0.0'
				);
			}
		}
	}

	/**
	 * Get asset URL.
	 *
	 * @since 1.0.0
	 *
	 * @param string $path Asset path relative to plugin.
	 * @return string Asset URL.
	 */
	public static function get_asset_url( $path ) {
		$package_paths = Asset_Loader::get_package_paths();
		return $package_paths['url'] . '/' . $path;
	}

	/**
	 * Get asset path.
	 *
	 * @since 1.0.0
	 *
	 * @param string $path Asset path relative to plugin.
	 * @return string Asset path.
	 */
	public static function get_asset_path( $path ) {
		$package_paths = Asset_Loader::get_package_paths();
		return $package_paths['path'] . '/' . $path;
	}
}
