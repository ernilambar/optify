<?php
/**
 * Options Context Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify\Context;

use Nilambar\Optify\Options_Manager;

/**
 * Options context implementation.
 *
 * @since 1.0.0
 */
class Options_Context implements Context_Interface {

	/**
	 * Context identifier.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	const CONTEXT_ID = 'options';

	/**
	 * Context display name.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	const CONTEXT_NAME = 'Options';

	/**
	 * Context configuration.
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	private $config;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param array $config Context configuration.
	 */
	public function __construct( $config = [] ) {
		$this->config = wp_parse_args( $config, [
			'context_id'   => self::CONTEXT_ID,
			'context_name' => self::CONTEXT_NAME,
		] );
	}

	/**
	 * Get data for a specific key.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Data key.
	 * @param mixed  $default Default value.
	 * @return mixed Data value.
	 */
	public function get_data( $key, $default = [] ) {
		return Options_Manager::get_option( $key, $default );
	}

	/**
	 * Update data for a specific key.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Data key.
	 * @param mixed  $value Data value.
	 * @return bool True on success, false on failure.
	 */
	public function update_data( $key, $value ) {
		return Options_Manager::update_option( $key, $value );
	}

	/**
	 * Delete data for a specific key.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Data key.
	 * @return bool True on success, false on failure.
	 */
	public function delete_data( $key ) {
		return Options_Manager::delete_option( $key );
	}

	/**
	 * Check if data exists for a specific key.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Data key.
	 * @return bool True if data exists.
	 */
	public function data_exists( $key ) {
		return Options_Manager::option_exists( $key );
	}

	/**
	 * Get context identifier.
	 *
	 * @since 1.0.0
	 *
	 * @return string Context identifier.
	 */
	public function get_context_id() {
		return $this->config['context_id'];
	}

	/**
	 * Get context display name.
	 *
	 * @since 1.0.0
	 *
	 * @return string Context display name.
	 */
	public function get_context_name() {
		return $this->config['context_name'];
	}

	/**
	 * Get context configuration.
	 *
	 * @since 1.0.0
	 *
	 * @return array Context configuration.
	 */
	public function get_context_config() {
		return $this->config;
	}
}
