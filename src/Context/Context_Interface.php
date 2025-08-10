<?php
/**
 * Context Interface
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify\Context;

/**
 * Interface for context implementations.
 *
 * @since 1.0.0
 */
interface Context_Interface {

	/**
	 * Get data for a specific key.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Data key.
	 * @param mixed  $default Default value.
	 * @return mixed Data value.
	 */
	public function get_data( $key, $default = [] );

	/**
	 * Update data for a specific key.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Data key.
	 * @param mixed  $value Data value.
	 * @return bool True on success, false on failure.
	 */
	public function update_data( $key, $value );

	/**
	 * Delete data for a specific key.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Data key.
	 * @return bool True on success, false on failure.
	 */
	public function delete_data( $key );

	/**
	 * Check if data exists for a specific key.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Data key.
	 * @return bool True if data exists.
	 */
	public function data_exists( $key );

	/**
	 * Get context identifier.
	 *
	 * @since 1.0.0
	 *
	 * @return string Context identifier.
	 */
	public function get_context_id();

	/**
	 * Get context display name.
	 *
	 * @since 1.0.0
	 *
	 * @return string Context display name.
	 */
	public function get_context_name();

	/**
	 * Get context configuration.
	 *
	 * @since 1.0.0
	 *
	 * @return array Context configuration.
	 */
	public function get_context_config();
}
