<?php
/**
 * Simple Metabox Integration
 *
 * @package YourPlugin
 * @since 1.0.0
 */

namespace YourPlugin;

use Nilambar\Optify\Abstract_Metabox_Panel;
use Nilambar\Optify\Optify_Instance;
use Nilambar\Optify\Panel_Manager;

/**
 * Simple metabox integration using Optify.
 *
 * @since 1.0.0
 */
class Simple_Metabox_Integration {

	/**
	 * Initialize the integration.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		add_action( 'add_meta_boxes', [ $this, 'add_metabox' ] );
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Add the metabox.
	 *
	 * @since 1.0.0
	 */
	public function add_metabox() {
		add_meta_box(
			'optify-post-settings',
			__( 'Post Settings', 'your-plugin' ),
			[ $this, 'render_metabox' ],
			'post',
			'normal',
			'default'
		);
	}

	/**
	 * Render the metabox.
	 *
	 * @since 1.0.0
	 *
	 * @param \WP_Post $post Post object.
	 */
	public function render_metabox( $post ) {
		// Create the panel
		$panel = new Post_Settings_Panel( $post->ID );

		// Register it with the manager
		Panel_Manager::register_panel( $panel );

		// Get Optify instance
		$optify = Optify_Instance::get_instance( 'your-plugin' );

		// Render the panel using Optify's built-in rendering
		$optify->render_panel( $panel, [
			'context' => 'metabox',
			'post_id' => $post->ID,
		] );
	}

	/**
	 * Enqueue assets.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_assets() {
		global $post_type;

		if ( 'post' === $post_type && is_admin() ) {
			// Enqueue Optify assets
			$optify = Optify_Instance::get_instance( 'your-plugin' );
			$optify->enqueue_assets();
		}
	}
}

/**
 * Post Settings Panel.
 *
 * @since 1.0.0
 */
class Post_Settings_Panel extends Abstract_Metabox_Panel {

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param int $post_id Post ID.
	 */
	public function __construct( $post_id ) {
		parent::__construct(
			'post-settings',
			__( 'Post Settings', 'your-plugin' ),
			'_post_settings',
			$post_id
		);
	}

	/**
	 * Get field configuration.
	 *
	 * @since 1.0.0
	 *
	 * @return array Field configuration.
	 */
	public function get_field_configuration() {
		return [
			[
				'name'        => 'custom_title',
				'type'        => 'text',
				'label'       => __( 'Custom Title', 'your-plugin' ),
				'description' => __( 'Override the default post title.', 'your-plugin' ),
			],
			[
				'name'        => 'hide_title',
				'type'        => 'toggle',
				'label'       => __( 'Hide Title', 'your-plugin' ),
				'description' => __( 'Hide the post title on the frontend.', 'your-plugin' ),
			],
			[
				'name'        => 'layout',
				'type'        => 'select',
				'label'       => __( 'Layout', 'your-plugin' ),
				'description' => __( 'Choose the post layout.', 'your-plugin' ),
				'choices'     => [
					[ 'label' => __( 'Default', 'your-plugin' ), 'value' => 'default' ],
					[ 'label' => __( 'Full Width', 'your-plugin' ), 'value' => 'full-width' ],
					[ 'label' => __( 'Narrow', 'your-plugin' ), 'value' => 'narrow' ],
				],
				'default'     => 'default',
			],
			[
				'name'        => 'sidebar_position',
				'type'        => 'radio',
				'label'       => __( 'Sidebar Position', 'your-plugin' ),
				'description' => __( 'Choose where to display the sidebar.', 'your-plugin' ),
				'choices'     => [
					[ 'label' => __( 'Left', 'your-plugin' ), 'value' => 'left' ],
					[ 'label' => __( 'Right', 'your-plugin' ), 'value' => 'right' ],
					[ 'label' => __( 'None', 'your-plugin' ), 'value' => 'none' ],
				],
				'default'     => 'right',
			],
		];
	}
}

// Initialize
new Simple_Metabox_Integration();
