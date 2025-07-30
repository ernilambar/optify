<?php
/**
 * Panel Renderer Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify;

/**
 * Panel Renderer class for rendering panels in different contexts.
 *
 * @since 1.0.0
 */
class Panel_Renderer {

	/**
	 * Render a panel in admin page.
	 *
	 * @since 1.0.0
	 *
	 * @param string $panel_id Panel identifier.
	 * @param array  $args Admin page arguments.
	 */
	public static function render_admin_page( $panel_id, $args = [] ) {
		$defaults = [
			'container_class' => 'optify-panel-admin',
			'show_title'      => true,
			'location'        => 'admin_page',
			'under_cog'       => false,
		];

		$args = wp_parse_args( $args, $defaults );

		Panel_Manager::render_panel( $panel_id, $args );
	}

	/**
	 * Render a panel in dashboard widget.
	 *
	 * @since 1.0.0
	 *
	 * @param string $panel_id Panel identifier.
	 * @param array  $args Dashboard widget arguments.
	 */
	public static function render_dashboard_widget( $panel_id, $args = [] ) {
		$defaults = [
			'container_class' => 'optify-panel-dashboard',
			'show_title'      => false,
			'location'        => 'dashboard_widget',
			'under_cog'       => false,
		];

		$args = wp_parse_args( $args, $defaults );

		Panel_Manager::render_panel( $panel_id, $args );
	}

	/**
	 * Render a panel in metabox.
	 *
	 * @since 1.0.0
	 *
	 * @param string $panel_id Panel identifier.
	 * @param array  $args Metabox arguments.
	 */
	public static function render_metabox( $panel_id, $args = [] ) {
		$defaults = [
			'container_class' => 'optify-panel-metabox',
			'show_title'      => false,
			'location'        => 'metabox',
			'under_cog'       => false,
		];

		$args = wp_parse_args( $args, $defaults );

		Panel_Manager::render_panel( $panel_id, $args );
	}
}
