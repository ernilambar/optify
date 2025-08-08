<?php
/**
 * Optify Instance Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify;

/**
 * Individual Optify instance for plugin isolation.
 *
 * @since 1.0.0
 */
class Optify_Instance {

	/**
	 * Instance identifier.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private $instance_id;

	/**
	 * REST API namespace.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private $rest_namespace;

	/**
	 * REST API version.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private $rest_version;

	/**
	 * Unique global variable name for this instance.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private $global_var_name;

	/**
	 * Panel configuration callback for this instance.
	 *
	 * @since 1.0.0
	 *
	 * @var callable|null
	 */
	private $panel_config_callback = null;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param string $instance_id Unique instance identifier.
	 * @param string $namespace REST API namespace.
	 * @param string $version REST API version.
	 */
	public function __construct( $instance_id, $namespace, $version ) {
		$this->instance_id     = $instance_id;
		$this->rest_namespace  = $namespace;
		$this->rest_version    = $version;
		$this->global_var_name = $this->generate_global_var_name( $instance_id );

		// Initialize REST API for this instance.
		$this->init_rest_api();
	}

	/**
	 * Generate unique global variable name for this instance.
	 *
	 * @since 1.0.0
	 *
	 * @param string $instance_id Instance identifier.
	 * @return string Global variable name.
	 */
	private function generate_global_var_name( $instance_id ) {
		// Sanitize instance ID for use as JavaScript variable name.
		$sanitized_id = preg_replace( '/[^a-zA-Z0-9_]/', '_', $instance_id );
		$sanitized_id = preg_replace( '/_+/', '_', $sanitized_id );
		$sanitized_id = trim( $sanitized_id, '_' );

		return 'optifyAdmin_' . $sanitized_id;
	}

	/**
	 * Initialize REST API for this instance.
	 *
	 * @since 1.0.0
	 */
	private function init_rest_api() {
		add_action(
			'rest_api_init',
			function () {
				Rest_Handler::register_panel_routes( $this->rest_namespace, $this->rest_version, [ Api_Handler::class, 'rest_permission_callback' ] );
			}
		);
	}

	/**
	 * Load assets for this instance.
	 *
	 * @since 1.0.0
	 *
	 * @param string $package_dir Package directory path.
	 * @param string $package_url Package URL.
	 */
	public function load_assets( $package_dir, $package_url ) {
		// Initialize asset loader with this instance's configuration.
		Asset_Loader::init( $package_dir, $package_url, $this->rest_namespace, $this->rest_version );

		// Hook into admin enqueue scripts with instance-specific callback.
		add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_panel_assets' ] );
	}

	/**
	 * Enqueue panel assets for this instance.
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook Current admin page hook.
	 */
	public function enqueue_panel_assets( $hook ) {
		// Generate panel configurations for this instance.
		$panel_configs = $this->generate_panel_configs();

		// Load assets for admin pages and dashboard with instance-specific global variable.
		Asset_Loader::enqueue_panel_assets( $hook, $panel_configs, $this->global_var_name );
	}

	/**
	 * Set panel configuration callback for this instance.
	 *
	 * @since 1.0.0
	 *
	 * @param callable $callback Callback function to generate panel configurations.
	 */
	public function set_panel_config_callback( $callback ) {
		$this->panel_config_callback = $callback;
	}

	/**
	 * Register a panel for this instance.
	 *
	 * @since 1.0.0
	 *
	 * @param string $panel_id Panel identifier.
	 * @param string $panel_class Panel class name.
	 * @param array  $args Panel arguments.
	 */
	public function register_panel( $panel_id, $panel_class, $args = [] ) {
		Panel_Manager::register_panel( $panel_id, $panel_class, $args, $this->instance_id );
	}

	/**
	 * Get a panel instance.
	 *
	 * @since 1.0.0
	 *
	 * @param string $panel_id Panel identifier.
	 * @return Abstract_Panel|null Panel instance or null if not found.
	 */
	public function get_panel( $panel_id ) {
		return Panel_Manager::get_panel( $panel_id, $this->instance_id );
	}

	/**
	 * Get all registered panel IDs.
	 *
	 * @since 1.0.0
	 *
	 * @return array Array of panel IDs.
	 */
	public function get_panel_ids() {
		return Panel_Manager::get_panel_ids( $this->instance_id );
	}

	/**
	 * Get all registered panels.
	 *
	 * @since 1.0.0
	 *
	 * @return array Array of panel instances.
	 */
	public function get_all_panels() {
		return Panel_Manager::get_all_panels( $this->instance_id );
	}

	/**
	 * Render a panel.
	 *
	 * @since 1.0.0
	 *
	 * @param string $panel_id Panel identifier.
	 * @param array  $args Render arguments.
	 */
	public function render_panel( $panel_id, $args = [] ) {
		Panel_Manager::render_panel( $panel_id, $args, $this->instance_id );
	}

	/**
	 * Check if a panel exists.
	 *
	 * @since 1.0.0
	 *
	 * @param string $panel_id Panel identifier.
	 * @return bool True if panel exists.
	 */
	public function panel_exists( $panel_id ) {
		return Panel_Manager::panel_exists( $panel_id, $this->instance_id );
	}

	/**
	 * Generate panel configurations for this instance.
	 *
	 * @since 1.0.0
	 *
	 * @return array Panel configurations.
	 */
	private function generate_panel_configs() {
		// Use instance-specific callback if provided.
		if ( $this->panel_config_callback && is_callable( $this->panel_config_callback ) ) {
			return call_user_func( $this->panel_config_callback );
		}

		// Simple approach: all panels available everywhere.
		$panel_configs = [];
		$all_panels    = Panel_Manager::get_all_panels( $this->instance_id );

		foreach ( $all_panels as $panel_id => $panel ) {
			$panel_configs[ $panel_id ] = $panel->get_react_config();
		}

		return $panel_configs;
	}

	/**
	 * Get instance identifier.
	 *
	 * @since 1.0.0
	 *
	 * @return string Instance identifier.
	 */
	public function get_instance_id() {
		return $this->instance_id;
	}

	/**
	 * Get REST namespace.
	 *
	 * @since 1.0.0
	 *
	 * @return string REST namespace.
	 */
	public function get_rest_namespace() {
		return $this->rest_namespace;
	}

	/**
	 * Get REST version.
	 *
	 * @since 1.0.0
	 *
	 * @return string REST version.
	 */
	public function get_rest_version() {
		return $this->rest_version;
	}

	/**
	 * Get global variable name for this instance.
	 *
	 * @since 1.0.0
	 *
	 * @return string Global variable name.
	 */
	public function get_global_var_name() {
		return $this->global_var_name;
	}
}
