<?php
/**
 * API Handler Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify;

/**
 * Generic API handler for REST operations.
 *
 * @since 1.0.0
 */
class Api_Handler {

	/**
	 * Register REST routes.
	 *
	 * @since 1.0.0
	 *
	 * @param string   $namespace REST namespace.
	 * @param string   $version REST version.
	 * @param callable $permission_callback Permission callback.
	 * @param array    $routes Routes array.
	 */
	public static function register_routes( $namespace, $version, $permission_callback, $routes ) {
		foreach ( $routes as $route ) {
			register_rest_route(
				$namespace . '/' . $version,
				$route['path'],
				[
					'methods'             => $route['methods'],
					'callback'            => $route['callback'],
					'permission_callback' => $permission_callback,
				]
			);
		}
	}

	/**
	 * Create error response.
	 *
	 * @since 1.0.0
	 *
	 * @param string $code Error code.
	 * @param string $message Error message.
	 * @param int    $status HTTP status code.
	 * @return \WP_Error Error object.
	 */
	public static function create_error( $code, $message, $status = 400 ) {
		return new \WP_Error( $code, $message, [ 'status' => $status ] );
	}

	/**
	 * Create success response.
	 *
	 * @since 1.0.0
	 *
	 * @param array $data Response data.
	 * @return \WP_REST_Response Response object.
	 */
	public static function create_success( $data ) {
		return rest_ensure_response( [ 'data' => $data ] );
	}

	/**
	 * Check if user has capability.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @param string           $capability Capability to check.
	 * @return bool True if user has capability.
	 */
	public static function check_permission( $request = null, $capability = 'manage_options' ) {
		return current_user_can( $capability );
	}

	/**
	 * REST API permission callback.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return bool True if user has capability.
	 */
	public static function rest_permission_callback( $request ) {
		return current_user_can( 'manage_options' );
	}
}
