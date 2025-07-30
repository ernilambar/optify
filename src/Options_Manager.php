<?php
/**
 * Options Manager Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify;

/**
 * Generic options manager for WordPress options.
 *
 * @since 1.0.0
 */
class Options_Manager {

	/**
	 * Get option value.
	 *
	 * @since 1.0.0
	 *
	 * @param string $option_name Option name.
	 * @param mixed  $default Default value.
	 * @return mixed Option value.
	 */
	public static function get_option( $option_name, $default = [] ) {
		return get_option( $option_name, $default );
	}

	/**
	 * Update option value.
	 *
	 * @since 1.0.0
	 *
	 * @param string $option_name Option name.
	 * @param mixed  $value Option value.
	 * @return bool True on success, false on failure.
	 */
	public static function update_option( $option_name, $value ) {
		return update_option( $option_name, $value );
	}

	/**
	 * Delete option.
	 *
	 * @since 1.0.0
	 *
	 * @param string $option_name Option name.
	 * @return bool True on success, false on failure.
	 */
	public static function delete_option( $option_name ) {
		return delete_option( $option_name );
	}

	/**
	 * Get multiple options.
	 *
	 * @since 1.0.0
	 *
	 * @param array $option_names Array of option names.
	 * @return array Array of option values.
	 */
	public static function get_options( $option_names ) {
		$options = [];

		foreach ( $option_names as $option_name ) {
			$options[ $option_name ] = self::get_option( $option_name );
		}

		return $options;
	}

	/**
	 * Update multiple options.
	 *
	 * @since 1.0.0
	 *
	 * @param array $options Array of option name => value pairs.
	 * @return array Array of results for each option.
	 */
	public static function update_options( $options ) {
		$results = [];

		foreach ( $options as $option_name => $value ) {
			$results[ $option_name ] = self::update_option( $option_name, $value );
		}

		return $results;
	}

	/**
	 * Delete multiple options.
	 *
	 * @since 1.0.0
	 *
	 * @param array $option_names Array of option names.
	 * @return array Array of results for each option.
	 */
	public static function delete_options( $option_names ) {
		$results = [];

		foreach ( $option_names as $option_name ) {
			$results[ $option_name ] = self::delete_option( $option_name );
		}

		return $results;
	}

	/**
	 * Check if option exists.
	 *
	 * @since 1.0.0
	 *
	 * @param string $option_name Option name.
	 * @return bool True if option exists.
	 */
	public static function option_exists( $option_name ) {
		return false !== get_option( $option_name );
	}

	/**
	 * Get option with autoload check.
	 *
	 * @since 1.0.0
	 *
	 * @param string $option_name Option name.
	 * @param mixed  $default Default value.
	 * @return mixed Option value.
	 */
	public static function get_option_autoload( $option_name, $default = [] ) {
		global $wpdb;

		$value = $wpdb->get_var(
			$wpdb->prepare(
				"SELECT option_value FROM {$wpdb->options} WHERE option_name = %s",
				$option_name
			)
		);

		return null !== $value ? maybe_unserialize( $value ) : $default;
	}

	/**
	 * Set option with autoload.
	 *
	 * @since 1.0.0
	 *
	 * @param string $option_name Option name.
	 * @param mixed  $value Option value.
	 * @param bool   $autoload Whether to autoload the option.
	 * @return bool True on success, false on failure.
	 */
	public static function set_option( $option_name, $value, $autoload = true ) {
		return add_option( $option_name, $value, '', $autoload );
	}
}
