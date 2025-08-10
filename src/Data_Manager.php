<?php
/**
 * Data Manager Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify;

use Nilambar\Optify\Context\Context_Interface;
use Nilambar\Optify\Context\Context_Manager;

/**
 * Generic data manager for handling data operations across different contexts.
 *
 * @since 1.0.0
 */
class Data_Manager {

	/**
	 * Get data for a specific key using a context.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Data key.
	 * @param string $context_id Context identifier.
	 * @param array  $context_config Context configuration.
	 * @param mixed  $default Default value.
	 * @return mixed Data value.
	 */
	public static function get_data( $key, $context_id = 'options', $context_config = [], $default = [] ) {
		$context = Context_Manager::get_context( $context_id, $context_config );
		if ( ! $context ) {
			return $default;
		}

		return $context->get_data( $key, $default );
	}

	/**
	 * Update data for a specific key using a context.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Data key.
	 * @param mixed  $value Data value.
	 * @param string $context_id Context identifier.
	 * @param array  $context_config Context configuration.
	 * @return bool True on success, false on failure.
	 */
	public static function update_data( $key, $value, $context_id = 'options', $context_config = [] ) {
		$context = Context_Manager::get_context( $context_id, $context_config );
		if ( ! $context ) {
			return false;
		}

		return $context->update_data( $key, $value );
	}

	/**
	 * Delete data for a specific key using a context.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Data key.
	 * @param string $context_id Context identifier.
	 * @param array  $context_config Context configuration.
	 * @return bool True on success, false on failure.
	 */
	public static function delete_data( $key, $context_id = 'options', $context_config = [] ) {
		$context = Context_Manager::get_context( $context_id, $context_config );
		if ( ! $context ) {
			return false;
		}

		return $context->delete_data( $key );
	}

	/**
	 * Check if data exists for a specific key using a context.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Data key.
	 * @param string $context_id Context identifier.
	 * @param array  $context_config Context configuration.
	 * @return bool True if data exists.
	 */
	public static function data_exists( $key, $context_id = 'options', $context_config = [] ) {
		$context = Context_Manager::get_context( $context_id, $context_config );
		if ( ! $context ) {
			return false;
		}

		return $context->data_exists( $key );
	}

	/**
	 * Get data using a context instance.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Data key.
	 * @param Context_Interface $context Context instance.
	 * @param mixed $default Default value.
	 * @return mixed Data value.
	 */
	public static function get_data_with_context( $key, Context_Interface $context, $default = [] ) {
		return $context->get_data( $key, $default );
	}

	/**
	 * Update data using a context instance.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Data key.
	 * @param mixed $value Data value.
	 * @param Context_Interface $context Context instance.
	 * @return bool True on success, false on failure.
	 */
	public static function update_data_with_context( $key, $value, Context_Interface $context ) {
		return $context->update_data( $key, $value );
	}

	/**
	 * Delete data using a context instance.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Data key.
	 * @param Context_Interface $context Context instance.
	 * @return bool True on success, false on failure.
	 */
	public static function delete_data_with_context( $key, Context_Interface $context ) {
		return $context->delete_data( $key );
	}

	/**
	 * Check if data exists using a context instance.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Data key.
	 * @param Context_Interface $context Context instance.
	 * @return bool True if data exists.
	 */
	public static function data_exists_with_context( $key, Context_Interface $context ) {
		return $context->data_exists( $key );
	}
}
