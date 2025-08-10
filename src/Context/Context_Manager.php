<?php
/**
 * Context Manager Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify\Context;

/**
 * Context manager for handling different data storage contexts.
 *
 * @since 1.0.0
 */
class Context_Manager {

	/**
	 * Available contexts.
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	private static $available_contexts = [
		'options' => Options_Context::class,
		'meta'    => Meta_Context::class,
	];

	/**
	 * Context instances cache.
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	private static $instances = [];

	/**
	 * Get a context instance.
	 *
	 * @since 1.0.0
	 *
	 * @param string $context_id Context identifier.
	 * @param array  $config Context configuration.
	 * @return Context_Interface|null Context instance or null if not found.
	 */
	public static function get_context( $context_id, $config = [] ) {
		$cache_key = $context_id . '_' . md5( serialize( $config ) );

		if ( isset( self::$instances[ $cache_key ] ) ) {
			return self::$instances[ $cache_key ];
		}

		if ( ! isset( self::$available_contexts[ $context_id ] ) ) {
			return null;
		}

		$context_class = self::$available_contexts[ $context_id ];
		$context       = new $context_class( $config );

		self::$instances[ $cache_key ] = $context;

		return $context;
	}

	/**
	 * Get default context (options).
	 *
	 * @since 1.0.0
	 *
	 * @param array $config Context configuration.
	 * @return Context_Interface Context instance.
	 */
	public static function get_default_context( $config = [] ) {
		return self::get_context( 'options', $config );
	}

	/**
	 * Check if a context is available.
	 *
	 * @since 1.0.0
	 *
	 * @param string $context_id Context identifier.
	 * @return bool True if context is available.
	 */
	public static function context_exists( $context_id ) {
		return isset( self::$available_contexts[ $context_id ] );
	}

	/**
	 * Get all available context IDs.
	 *
	 * @since 1.0.0
	 *
	 * @return array Array of context IDs.
	 */
	public static function get_available_contexts() {
		return array_keys( self::$available_contexts );
	}

	/**
	 * Register a new context.
	 *
	 * @since 1.0.0
	 *
	 * @param string $context_id Context identifier.
	 * @param string $context_class Context class name.
	 */
	public static function register_context( $context_id, $context_class ) {
		if ( ! class_exists( $context_class ) ) {
			_doing_it_wrong(
				__METHOD__,
				sprintf(
					'Context class "%s" does not exist.',
					esc_html( $context_class )
				),
				'1.0.0'
			);
			return;
		}

		if ( ! is_subclass_of( $context_class, Context_Interface::class ) ) {
			_doing_it_wrong(
				__METHOD__,
				sprintf(
					'Context class "%s" must implement Context_Interface.',
					esc_html( $context_class )
				),
				'1.0.0'
			);
			return;
		}

		self::$available_contexts[ $context_id ] = $context_class;
	}

	/**
	 * Clear context instances cache.
	 *
	 * @since 1.0.0
	 */
	public static function clear_cache() {
		self::$instances = [];
	}
}
