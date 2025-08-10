<?php
/**
 * Abstract Meta Panel Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify;

use Nilambar\Optify\Context\Meta_Context;

/**
 * Abstract meta panel class for handling post meta panels.
 *
 * @since 1.0.0
 */
abstract class Abstract_Meta_Panel extends Abstract_Panel {

	/**
	 * Post type for this meta panel.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $post_type;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param string $panel_id Panel identifier.
	 * @param string $panel_title Panel title.
	 * @param string $meta_key Meta key.
	 * @param string $post_type Post type.
	 * @param int    $post_id Post ID (optional).
	 */
	public function __construct( $panel_id, $panel_title, $meta_key, $post_type = 'post', $post_id = 0 ) {
		// Create meta context
		$context_config = [
			'post_type' => $post_type,
			'post_id'   => $post_id,
		];

		$context = new Meta_Context( $context_config );

		// Call parent constructor with meta context
		parent::__construct( $panel_id, $panel_title, $meta_key, $context );

		$this->post_type = $post_type;
	}

	/**
	 * Get post type.
	 *
	 * @since 1.0.0
	 *
	 * @return string Post type.
	 */
	public function get_post_type() {
		return $this->post_type;
	}

	/**
	 * Get meta key.
	 *
	 * @since 1.0.0
	 *
	 * @return string Meta key.
	 */
	public function get_meta_key() {
		return $this->get_options_name();
	}

	/**
	 * Get React configuration for this panel.
	 *
	 * @since 1.0.0
	 *
	 * @return array React configuration.
	 */
	public function get_react_config() {
		$config = parent::get_react_config();

		// Add meta-specific configuration
		$config['metaKey']   = $this->get_meta_key();
		$config['postType']  = $this->get_post_type();
		$config['contextId'] = 'meta';

		return $config;
	}

	/**
	 * Check if this panel should be displayed for the current post.
	 *
	 * @since 1.0.0
	 *
	 * @param int $post_id Post ID.
	 * @return bool True if panel should be displayed.
	 */
	public function should_display_for_post( $post_id ) {
		if ( empty( $post_id ) ) {
			return false;
		}

		$post = get_post( $post_id );
		if ( ! $post ) {
			return false;
		}

		// Check if post type matches
		if ( $post->post_type !== $this->post_type ) {
			return false;
		}

		return true;
	}

	/**
	 * Get post ID from current context.
	 *
	 * @since 1.0.0
	 *
	 * @return int Post ID.
	 */
	public function get_current_post_id() {
		global $post;

		if ( $post && is_object( $post ) ) {
			return $post->ID;
		}

		// Try to get from query vars
		$post_id = get_query_var( 'p' );
		if ( ! empty( $post_id ) ) {
			return intval( $post_id );
		}

		// Try to get from request
		if ( isset( $_REQUEST['post_id'] ) ) {
			return intval( $_REQUEST['post_id'] );
		}

		return 0;
	}
}
