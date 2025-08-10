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
			// Legacy routes for backward compatibility
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
			// New context-aware routes
			[
				'path'     => '/context/(?P<context>[a-zA-Z0-9_-]+)/fields/(?P<panel>[a-zA-Z0-9_-]+)',
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => [ __CLASS__, 'get_fields_context' ],
			],
			[
				'path'     => '/context/(?P<context>[a-zA-Z0-9_-]+)/data/(?P<panel>[a-zA-Z0-9_-]+)',
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => [ __CLASS__, 'get_data_context' ],
			],
			[
				'path'     => '/context/(?P<context>[a-zA-Z0-9_-]+)/data/(?P<panel>[a-zA-Z0-9_-]+)',
				'methods'  => \WP_REST_Server::EDITABLE,
				'callback' => [ __CLASS__, 'save_data_context' ],
			],
			// Meta-specific routes
			[
				'path'     => '/meta/fields/(?P<panel>[a-zA-Z0-9_-]+)',
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => [ __CLASS__, 'get_meta_fields' ],
			],
			[
				'path'     => '/meta/data/(?P<panel>[a-zA-Z0-9_-]+)',
				'methods'  => \WP_REST_Server::READABLE,
				'callback' => [ __CLASS__, 'get_meta_data' ],
			],
			[
				'path'     => '/meta/data/(?P<panel>[a-zA-Z0-9_-]+)',
				'methods'  => \WP_REST_Server::EDITABLE,
				'callback' => [ __CLASS__, 'save_meta_data' ],
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
	 * REST API callback to get fields configuration with context.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error Response object.
	 */
	public static function get_fields_context( $request ) {
		$panel_id  = $request->get_param( 'panel' );
		$context_id = $request->get_param( 'context' );

		if ( empty( $panel_id ) ) {
			return Api_Handler::create_error(
				'missing_panel',
				__( 'Panel ID is required.', 'groundify' ),
				400
			);
		}

		if ( empty( $context_id ) ) {
			return Api_Handler::create_error(
				'missing_context',
				__( 'Context ID is required.', 'groundify' ),
				400
			);
		}

		$panel = Panel_Manager::get_panel( $panel_id );
		if ( ! $panel ) {
			return Api_Handler::create_error(
				'invalid_panel',
				sprintf( __( 'Panel "%s" not found.', 'groundify' ), $panel_id ),
				404
			);
		}

		// Verify panel context matches requested context
		if ( $panel->get_context_id() !== $context_id ) {
			return Api_Handler::create_error(
				'context_mismatch',
				sprintf( __( 'Panel "%s" does not use context "%s".', 'groundify' ), $panel_id, $context_id ),
				400
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
	 * REST API callback to get data with context.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error Response object.
	 */
	public static function get_data_context( $request ) {
		$panel_id   = $request->get_param( 'panel' );
		$context_id = $request->get_param( 'context' );

		if ( empty( $panel_id ) ) {
			return Api_Handler::create_error(
				'missing_panel',
				__( 'Panel ID is required.', 'groundify' ),
				400
			);
		}

		if ( empty( $context_id ) ) {
			return Api_Handler::create_error(
				'missing_context',
				__( 'Context ID is required.', 'groundify' ),
				400
			);
		}

		$panel = Panel_Manager::get_panel( $panel_id );
		if ( ! $panel ) {
			return Api_Handler::create_error(
				'invalid_panel',
				sprintf( __( 'Panel "%s" not found.', 'groundify' ), $panel_id ),
				404
			);
		}

		// Verify panel context matches requested context
		if ( $panel->get_context_id() !== $context_id ) {
			return Api_Handler::create_error(
				'context_mismatch',
				sprintf( __( 'Panel "%s" does not use context "%s".', 'groundify' ), $panel_id, $context_id ),
				400
			);
		}

		try {
			$context = $panel->get_context();
			$data    = $context->get_data( $panel->get_options_name(), [] );

			if ( ! is_array( $data ) ) {
				return Api_Handler::create_error(
					'invalid_data',
					__( 'Invalid data returned.', 'groundify' ),
					500
				);
			}

			return Api_Handler::create_success( $data );
		} catch ( \Exception $e ) {
			return Api_Handler::create_error(
				'data_error',
				sprintf( __( 'Error getting data: %s', 'groundify' ), $e->getMessage() ),
				500
			);
		}
	}

	/**
	 * REST API callback to save data with context.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error Response object.
	 */
	public static function save_data_context( $request ) {
		$panel_id   = $request->get_param( 'panel' );
		$context_id = $request->get_param( 'context' );
		$values     = $request->get_param( 'values' );

		if ( empty( $panel_id ) ) {
			return Api_Handler::create_error(
				'missing_panel',
				__( 'Panel ID is required.', 'groundify' ),
				400
			);
		}

		if ( empty( $context_id ) ) {
			return Api_Handler::create_error(
				'missing_context',
				__( 'Context ID is required.', 'groundify' ),
				400
			);
		}

		$panel = Panel_Manager::get_panel( $panel_id );
		if ( ! $panel ) {
			return Api_Handler::create_error(
				'invalid_panel',
				__( 'Invalid panel specified.', 'groundify' )
			);
		}

		// Verify panel context matches requested context
		if ( $panel->get_context_id() !== $context_id ) {
			return Api_Handler::create_error(
				'context_mismatch',
				sprintf( __( 'Panel "%s" does not use context "%s".', 'groundify' ), $panel_id, $context_id ),
				400
			);
		}

		// Sanitize and validate values.
		$sanitized_values  = $panel->sanitize_options( $values );
		$validation_result = $panel->validate_options( $sanitized_values );

		if ( is_wp_error( $validation_result ) ) {
			return $validation_result;
		}

		// Save data using context.
		$context = $panel->get_context();
		$result  = $context->update_data( $panel->get_options_name(), $sanitized_values );

		if ( ! $result ) {
			return Api_Handler::create_error(
				'save_failed',
				__( 'Failed to save data.', 'groundify' ),
				500
			);
		}

		return Api_Handler::create_success( [ 'values' => $sanitized_values ] );
	}

	/**
	 * REST API callback to get meta fields configuration.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error Response object.
	 */
	public static function get_meta_fields( $request ) {
		$panel_id = $request->get_param( 'panel' );

		if ( empty( $panel_id ) ) {
			return Api_Handler::create_error(
				'missing_panel',
				__( 'Panel ID is required.', 'groundify' ),
				400
			);
		}

		$panel = Panel_Manager::get_panel( $panel_id );
		if ( ! $panel ) {
			return Api_Handler::create_error(
				'invalid_panel',
				sprintf( __( 'Panel "%s" not found.', 'groundify' ), $panel_id ),
				404
			);
		}

		// Verify panel is a meta panel
		if ( ! $panel instanceof Abstract_Meta_Panel ) {
			return Api_Handler::create_error(
				'invalid_panel_type',
				sprintf( __( 'Panel "%s" is not a meta panel.', 'groundify' ), $panel_id ),
				400
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
	 * REST API callback to get meta data.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error Response object.
	 */
	public static function get_meta_data( $request ) {
		$panel_id = $request->get_param( 'panel' );
		$post_id  = $request->get_param( 'post_id' );

		if ( empty( $panel_id ) ) {
			return Api_Handler::create_error(
				'missing_panel',
				__( 'Panel ID is required.', 'groundify' ),
				400
			);
		}

		if ( empty( $post_id ) ) {
			return Api_Handler::create_error(
				'missing_post_id',
				__( 'Post ID is required.', 'groundify' ),
				400
			);
		}

		$panel = Panel_Manager::get_panel( $panel_id );
		if ( ! $panel ) {
			return Api_Handler::create_error(
				'invalid_panel',
				sprintf( __( 'Panel "%s" not found.', 'groundify' ), $panel_id ),
				404
			);
		}

		// Verify panel is a meta panel
		if ( ! $panel instanceof Abstract_Meta_Panel ) {
			return Api_Handler::create_error(
				'invalid_panel_type',
				sprintf( __( 'Panel "%s" is not a meta panel.', 'groundify' ), $panel_id ),
				400
			);
		}

		// Check if panel should be displayed for this post
		if ( ! $panel->should_display_for_post( $post_id ) ) {
			return Api_Handler::create_error(
				'invalid_post_type',
				sprintf( __( 'Panel "%s" is not available for this post type.', 'groundify' ), $panel_id ),
				400
			);
		}

		try {
			// Create context with specific post ID
			$context_config = [
				'post_type' => $panel->get_post_type(),
				'post_id'   => $post_id,
			];

			$context = new \Nilambar\Optify\Context\Meta_Context( $context_config );
			$data    = $context->get_data( $panel->get_meta_key(), [] );

			if ( ! is_array( $data ) ) {
				return Api_Handler::create_error(
					'invalid_data',
					__( 'Invalid data returned.', 'groundify' ),
					500
				);
			}

			return Api_Handler::create_success( $data );
		} catch ( \Exception $e ) {
			return Api_Handler::create_error(
				'data_error',
				sprintf( __( 'Error getting data: %s', 'groundify' ), $e->getMessage() ),
				500
			);
		}
	}

	/**
	 * REST API callback to save meta data.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_REST_Request $request Request object.
	 * @return \WP_REST_Response|\WP_Error Response object.
	 */
	public static function save_meta_data( $request ) {
		$panel_id = $request->get_param( 'panel' );
		$post_id  = $request->get_param( 'post_id' );
		$values   = $request->get_param( 'values' );

		if ( empty( $panel_id ) ) {
			return Api_Handler::create_error(
				'missing_panel',
				__( 'Panel ID is required.', 'groundify' ),
				400
			);
		}

		if ( empty( $post_id ) ) {
			return Api_Handler::create_error(
				'missing_post_id',
				__( 'Post ID is required.', 'groundify' ),
				400
			);
		}

		$panel = Panel_Manager::get_panel( $panel_id );
		if ( ! $panel ) {
			return Api_Handler::create_error(
				'invalid_panel',
				__( 'Invalid panel specified.', 'groundify' )
			);
		}

		// Verify panel is a meta panel
		if ( ! $panel instanceof Abstract_Meta_Panel ) {
			return Api_Handler::create_error(
				'invalid_panel_type',
				sprintf( __( 'Panel "%s" is not a meta panel.', 'groundify' ), $panel_id ),
				400
			);
		}

		// Check if panel should be displayed for this post
		if ( ! $panel->should_display_for_post( $post_id ) ) {
			return Api_Handler::create_error(
				'invalid_post_type',
				sprintf( __( 'Panel "%s" is not available for this post type.', 'groundify' ), $panel_id ),
				400
			);
		}

		// Sanitize and validate values.
		$sanitized_values  = $panel->sanitize_options( $values );
		$validation_result = $panel->validate_options( $sanitized_values );

		if ( is_wp_error( $validation_result ) ) {
			return $validation_result;
		}

		// Save data using context with specific post ID
		try {
			$context_config = [
				'post_type' => $panel->get_post_type(),
				'post_id'   => $post_id,
			];

			$context = new \Nilambar\Optify\Context\Meta_Context( $context_config );
			$result  = $context->update_data( $panel->get_meta_key(), $sanitized_values );

			if ( ! $result ) {
				return Api_Handler::create_error(
					'save_failed',
					__( 'Failed to save meta data.', 'groundify' ),
					500
				);
			}

			return Api_Handler::create_success( [ 'values' => $sanitized_values ] );
		} catch ( \Exception $e ) {
			return Api_Handler::create_error(
				'save_error',
				sprintf( __( 'Error saving data: %s', 'groundify' ), $e->getMessage() ),
				500
			);
		}
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
