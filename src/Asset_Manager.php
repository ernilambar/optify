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
	 * Plugin file path.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private static $plugin_file;

	/**
	 * Initialize asset manager.
	 *
	 * @since 1.0.0
	 *
	 * @param string $plugin_file Plugin file path.
	 */
	public static function init( $plugin_file ) {
		self::$plugin_file = $plugin_file;
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
		$asset_file = plugin_dir_path( self::$plugin_file ) . $asset_path;

		if ( file_exists( $asset_file ) ) {
			$asset = require $asset_file;

			wp_enqueue_script(
				$handle,
				plugin_dir_url( self::$plugin_file ) . $script_path,
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
			if ( isset( $asset['pages'] ) && ! in_array( $hook, $asset['pages'], true ) ) {
				continue;
			}

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
		return plugin_dir_url( self::$plugin_file ) . $path;
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
		return plugin_dir_path( self::$plugin_file ) . $path;
	}
}
