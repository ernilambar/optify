<?php
/**
 * Meta REST Handler Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify;

/**
 * Meta-specific REST Handler class for post meta panels.
 *
 * @since 1.0.0
 */
class Meta_Rest_Handler extends Rest_Handler {

	/**
	 * Register meta panel REST routes.
	 *
	 * @since 1.0.0
	 *
	 * @param string   $namespace REST namespace.
	 * @param string   $version REST version.
	 * @param callable $permission_callback Permission callback.
	 */
	public static function register_meta_routes( $namespace, $version, $permission_callback ) {
		$routes = [
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
}
