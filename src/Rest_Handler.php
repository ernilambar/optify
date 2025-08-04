<?php
/**
 * REST Handler Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify;

/**
 * Generic REST Handler class for panel systems.
 *
 * @since 1.0.0
 */
class Rest_Handler {

	/**
	 * Register panel REST routes.
	 *
	 * @since 1.0.0
	 *
	 * @param string   $namespace REST namespace.
	 * @param string   $version REST version.
	 * @param callable $permission_callback Permission callback.
	 */
	public static function register_panel_routes( $namespace, $version, $permission_callback ) {
		$routes = [
			[
				'path'     => '/fields/(?P<panel>[a-zA-Z0-9_-]+)',
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => [ __CLASS__, 'get_fields' ],
			],
			[
				'path'     => '/options/(?P<panel>[a-zA-Z0-9_-]+)',
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => [ __CLASS__, 'get_options' ],
			],
			[
				'path'     => '/options/(?P<panel>[a-zA-Z0-9_-]+)',
				'methods'  => \WP_REST_Server::EDITABLE,
				'callback' => [ __CLASS__, 'save_options' ],
			],
		];

		Api_Handler::register_routes( $namespace, $version, $permission_callback, $routes );
	}

	/**
	 * REST API callback to get fields configuration.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error Response object.
	 */
	public static function get_fields( $request ) {
		$panel_id = $request->get_param( 'panel' );

		// Debug: Check if panel_id is received.
		if ( empty( $panel_id ) ) {
			return Api_Handler::create_error(
				'missing_panel',
				__( 'Panel ID is required.', 'groundify' ),
				400
			);
		}

		// Get the instance from the request context
		$instance_id = self::get_instance_from_request( $request );

		$panel = Panel_Manager::get_panel( $panel_id, $instance_id );
		if ( ! $panel ) {
			return Api_Handler::create_error(
				'invalid_panel',
				sprintf( __( 'Panel "%s" not found.', 'groundify' ), $panel_id ),
				404
			);
		}

		try {
			$fields = $panel->get_field_configuration();

			if ( ! is_array( $fields ) ) {
				return Api_Handler::create_error(
					'invalid_fields',
					__( 'Invalid field configuration returned.', 'groundify' ),
					500
				);
			}

			return Api_Handler::create_success( $fields );
		} catch ( \Exception $e ) {
			return Api_Handler::create_error(
				'field_error',
				sprintf( __( 'Error getting fields: %s', 'groundify' ), $e->getMessage() ),
				500
			);
		}
	}

	/**
	 * REST API callback to get options.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error Response object.
	 */
	public static function get_options( $request ) {
		$panel_id = $request->get_param( 'panel' );

		// Debug: Check if panel_id is received.
		if ( empty( $panel_id ) ) {
			return Api_Handler::create_error(
				'missing_panel',
				__( 'Panel ID is required.', 'groundify' ),
				400
			);
		}

		// Get the instance from the request context
		$instance_id = self::get_instance_from_request( $request );

		$panel = Panel_Manager::get_panel( $panel_id, $instance_id );
		if ( ! $panel ) {
			return Api_Handler::create_error(
				'invalid_panel',
				sprintf( __( 'Panel "%s" not found.', 'groundify' ), $panel_id ),
				404
			);
		}

		try {
			$options = Options_Manager::get_option( $panel->get_options_name(), [] );

			if ( ! is_array( $options ) ) {
				return Api_Handler::create_error(
					'invalid_options',
					__( 'Invalid options returned.', 'groundify' ),
					500
				);
			}

			return Api_Handler::create_success( $options );
		} catch ( \Exception $e ) {
			return Api_Handler::create_error(
				'options_error',
				sprintf( __( 'Error getting options: %s', 'groundify' ), $e->getMessage() ),
				500
			);
		}
	}

	/**
	 * REST API callback to save options.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error Response object.
	 */
	public static function save_options( $request ) {
		$panel_id = $request->get_param( 'panel' );
		$values   = $request->get_param( 'values' );

		// Get the instance from the request context
		$instance_id = self::get_instance_from_request( $request );

		$panel = Panel_Manager::get_panel( $panel_id, $instance_id );
		if ( ! $panel ) {
			return Api_Handler::create_error(
				'invalid_panel',
				__( 'Invalid panel specified.', 'groundify' )
			);
		}

		// Sanitize and validate values.
		$sanitized_values  = $panel->sanitize_options( $values );
		$validation_result = $panel->validate_options( $sanitized_values );

		if ( is_wp_error( $validation_result ) ) {
			return $validation_result;
		}

		// Save options.
		$result = Options_Manager::update_option( $panel->get_options_name(), $sanitized_values );

		if ( ! $result ) {
			return Api_Handler::create_error(
				'save_failed',
				__( 'Failed to save options.', 'groundify' ),
				500
			);
		}

		return Api_Handler::create_success( [ 'values' => $sanitized_values ] );
	}

	/**
	 * Get instance ID from request.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return string|null Instance ID or null if not found.
	 */
	private static function get_instance_from_request( $request ) {
		// Extract instance from the REST route
		$route = $request->get_route();

		// The route format is: /wp-json/{namespace}/{version}/fields/{panel}
		// We need to extract the namespace to determine the instance
		$route_parts = explode( '/', trim( $route, '/' ) );

		// Find the namespace part (should be after 'wp-json')
		$wp_json_index = array_search( 'wp-json', $route_parts );
		if ( $wp_json_index !== false && isset( $route_parts[ $wp_json_index + 1 ] ) ) {
			$namespace = $route_parts[ $wp_json_index + 1 ];

			// The namespace format is: {original_namespace}-{instance_id}
			// Extract the instance ID from the namespace
			$namespace_parts = explode( '-', $namespace );
			if ( count( $namespace_parts ) > 1 ) {
				return end( $namespace_parts );
			}
		}

		return null;
	}
}
