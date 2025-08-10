<?php
/**
 * Meta Context Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify\Context;

/**
 * Meta context implementation.
 *
 * @since 1.0.0
 */
class Meta_Context implements Context_Interface {

	/**
	 * Context identifier.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	const CONTEXT_ID = 'meta';

	/**
	 * Context display name.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	const CONTEXT_NAME = 'Meta';

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
			'post_type'    => 'post',
			'post_id'      => 0,
		] );
	}

	/**
	 * Get post ID from context or current post.
	 *
	 * @since 1.0.0
	 *
	 * @return int Post ID.
	 */
	private function get_post_id() {
		$post_id = $this->config['post_id'];

		// If no post ID specified, try to get from current post
		if ( empty( $post_id ) ) {
			global $post;
			if ( $post && is_object( $post ) ) {
				$post_id = $post->ID;
			}
		}

		// If still no post ID, try to get from query vars
		if ( empty( $post_id ) ) {
			$post_id = get_query_var( 'p' );
		}

		// If still no post ID, try to get from request
		if ( empty( $post_id ) && isset( $_REQUEST['post_id'] ) ) {
			$post_id = intval( $_REQUEST['post_id'] );
		}

		return intval( $post_id );
	}

	/**
	 * Validate post ID and post type.
	 *
	 * @since 1.0.0
	 *
	 * @param int $post_id Post ID.
	 * @return bool True if valid.
	 */
	private function validate_post( $post_id ) {
		if ( empty( $post_id ) ) {
			return false;
		}

		$post = get_post( $post_id );
		if ( ! $post ) {
			return false;
		}

		// Check if post type matches configured post type
		$expected_post_type = $this->config['post_type'];
		if ( ! empty( $expected_post_type ) && $post->post_type !== $expected_post_type ) {
			return false;
		}

		return true;
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
		$post_id = $this->get_post_id();

		if ( ! $this->validate_post( $post_id ) ) {
			return $default;
		}

		$meta_value = get_post_meta( $post_id, $key, true );

		// Return default if meta is empty or false
		if ( false === $meta_value || '' === $meta_value ) {
			return $default;
		}

		return $meta_value;
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
		$post_id = $this->get_post_id();

		if ( ! $this->validate_post( $post_id ) ) {
			return false;
		}

		$result = update_post_meta( $post_id, $key, $value );

		// update_post_meta returns meta_id on success, false on failure
		return false !== $result;
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
		$post_id = $this->get_post_id();

		if ( ! $this->validate_post( $post_id ) ) {
			return false;
		}

		$result = delete_post_meta( $post_id, $key );

		// delete_post_meta returns true on success, false on failure
		return $result;
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
		$post_id = $this->get_post_id();

		if ( ! $this->validate_post( $post_id ) ) {
			return false;
		}

		$meta_value = get_post_meta( $post_id, $key, true );

		// Check if meta exists and is not empty
		return false !== $meta_value && '' !== $meta_value;
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
