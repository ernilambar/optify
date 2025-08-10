<?php
/**
 * Panel Manager Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify;

/**
 * Panel Manager class for handling panels independently of their location.
 *
 * @since 1.0.0
 */
class Panel_Manager {

	/**
	 * Registered panels.
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	private static $panels = [];

	/**
	 * Panel instances cache.
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	private static $instances = [];

	/**
	 * Register a panel.
	 *
	 * @since 1.0.0
	 *
	 * @param string $panel_id Panel identifier.
	 * @param string $panel_class Panel class name.
	 * @param array  $args Panel arguments.
	 */
	public static function register_panel( $panel_id, $panel_class, $args = [] ) {
		// Handle context creation if specified
		$context = null;
		if ( isset( $args['context'] ) && is_string( $args['context'] ) ) {
			$context_config = isset( $args['context_config'] ) ? $args['context_config'] : [];
			$context        = \Nilambar\Optify\Context\Context_Manager::get_context( $args['context'], $context_config );
		} elseif ( isset( $args['context'] ) && $args['context'] instanceof \Nilambar\Optify\Context\Context_Interface ) {
			$context = $args['context'];
		}

		// Add context to args if created
		if ( $context ) {
			$args['context'] = $context;
		}

		self::$panels[ $panel_id ] = [
			'class' => $panel_class,
			'args'  => $args,
		];
	}

	/**
	 * Get a panel instance.
	 *
	 * @since 1.0.0
	 *
	 * @param string $panel_id Panel identifier.
	 * @return Abstract_Panel|null Panel instance or null if not found.
	 */
	public static function get_panel( $panel_id ) {
		if ( ! isset( self::$panels[ $panel_id ] ) ) {
			return null;
		}

		if ( ! isset( self::$instances[ $panel_id ] ) ) {
			$panel_config = self::$panels[ $panel_id ];
			$panel_class  = $panel_config['class'];
			$args         = $panel_config['args'];

			if ( class_exists( $panel_class ) ) {
				self::$instances[ $panel_id ] = new $panel_class( ...$args );
			} else {
				return null;
			}
		}

		return self::$instances[ $panel_id ];
	}

	/**
	 * Get all registered panel IDs.
	 *
	 * @since 1.0.0
	 *
	 * @return array Array of panel IDs.
	 */
	public static function get_panel_ids() {
		return array_keys( self::$panels );
	}

	/**
	 * Get all registered panels.
	 *
	 * @since 1.0.0
	 *
	 * @return array Array of panel instances.
	 */
	public static function get_all_panels() {
		$panels = [];
		foreach ( self::get_panel_ids() as $panel_id ) {
			$panel = self::get_panel( $panel_id );
			if ( $panel ) {
				$panels[ $panel_id ] = $panel;
			}
		}
		return $panels;
	}

	/**
	 * Render a panel.
	 *
	 * @since 1.0.0
	 *
	 * @param string $panel_id Panel identifier.
	 * @param array  $args Render arguments.
	 * @param string $instance_id Optional instance identifier.
	 */
	public static function render_panel( $panel_id, $args = [], $instance_id = null ) {
		$panel = self::get_panel( $panel_id );
		if ( ! $panel ) {
			return;
		}

		$defaults = [
			'container_class' => 'optify-panel',
			'show_title'      => true,
			'location'        => 'standalone',
			'wrapper'         => true,
			'display'         => 'inline',
		];

		$args = wp_parse_args( $args, $defaults );

		if ( $args['wrapper'] ) {
			$display = $args['display'];

			$data_attributes = sprintf(
				'data-display="%s" data-show-title="%s"',
				esc_attr( $display ),
				esc_attr( $args['show_title'] ? 'true' : 'false' )
			);

			// Add instance data if provided
			if ( $instance_id ) {
				$data_attributes .= sprintf( ' data-instance="%s"', esc_attr( $instance_id ) );
			}

			printf(
				'<div id="optify-%s-panel" class="%s optify-panel-%s" %s>',
				esc_attr( $panel_id ),
				esc_attr( $args['container_class'] ),
				esc_attr( $panel_id ),
				$data_attributes
			);
		}

		echo '<div class="optify-panel-content">';
		echo '<p>' . esc_html__( 'Loading panel...', 'groundify' ) . '</p>';
		echo '</div>';

		if ( $args['wrapper'] ) {
			echo '</div>';
		}
	}

	/**
	 * Check if a panel exists.
	 *
	 * @since 1.0.0
	 *
	 * @param string $panel_id Panel identifier.
	 * @return bool True if panel exists.
	 */
	public static function panel_exists( $panel_id ) {
		return isset( self::$panels[ $panel_id ] );
	}
}
