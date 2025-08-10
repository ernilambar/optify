<?php
/**
 * Example Post Meta Panel
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify\Examples;

use Nilambar\Optify\Abstract_Meta_Panel;

/**
 * Example post meta panel implementation.
 *
 * @since 1.0.0
 */
class Post_Meta_Panel extends Abstract_Meta_Panel {

	/**
	 * Get field configuration for this panel.
	 *
	 * @since 1.0.0
	 *
	 * @return array Field configuration.
	 */
	public function get_field_configuration() {
		return [
			[
				'name'        => 'featured_image',
				'type'        => 'url',
				'label'       => __( 'Featured Image URL', 'optify' ),
				'description' => __( 'Enter the URL for the featured image.', 'optify' ),
				'default'     => '',
			],
			[
				'name'        => 'custom_title',
				'type'        => 'text',
				'label'       => __( 'Custom Title', 'optify' ),
				'description' => __( 'Override the default post title.', 'optify' ),
				'default'     => '',
			],
			[
				'name'        => 'show_sidebar',
				'type'        => 'toggle',
				'label'       => __( 'Show Sidebar', 'optify' ),
				'description' => __( 'Enable sidebar for this post.', 'optify' ),
				'default'     => false,
			],
			[
				'name'        => 'sidebar_position',
				'type'        => 'select',
				'label'       => __( 'Sidebar Position', 'optify' ),
				'description' => __( 'Choose the sidebar position.', 'optify' ),
				'choices'     => [
					[
						'label' => __( 'Left', 'optify' ),
						'value' => 'left',
					],
					[
						'label' => __( 'Right', 'optify' ),
						'value' => 'right',
					],
				],
				'default'     => 'right',
				'conditions'  => [
					[
						'field'    => 'show_sidebar',
						'operator' => '==',
						'value'    => true,
					],
				],
			],
			[
				'name'        => 'custom_css',
				'type'        => 'textarea',
				'label'       => __( 'Custom CSS', 'optify' ),
				'description' => __( 'Add custom CSS for this post.', 'optify' ),
				'default'     => '',
			],
			[
				'name'        => 'meta_tags',
				'type'        => 'multi-check',
				'label'       => __( 'Meta Tags', 'optify' ),
				'description' => __( 'Select relevant meta tags.', 'optify' ),
				'choices'     => [
					[
						'label' => __( 'Technology', 'optify' ),
						'value' => 'technology',
					],
					[
						'label' => __( 'Design', 'optify' ),
						'value' => 'design',
					],
					[
						'label' => __( 'Development', 'optify' ),
						'value' => 'development',
					],
					[
						'label' => __( 'WordPress', 'optify' ),
						'value' => 'wordpress',
					],
				],
				'default'     => [],
			],
		];
	}
}
