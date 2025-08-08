<?php
/**
 * Generic Optify Panel System Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify;

/**
 * Generic Optify panel system initialization class.
 * This class provides generic functionality that any panel system can use.
 *
 * @since 1.0.0
 */
class Optify {

	/**
	 * Panel configuration callback.
	 *
	 * @since 1.0.0
	 *
	 * @var callable|null
	 */
	private static $panel_config_callback = null;

	/**
	 * REST API namespace.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private static $rest_namespace;

	/**
	 * REST API version.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	private static $rest_version;

	/**
	 * Registered instances.
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	private static $instances = [];

	/**
	 * Initialize the panel system.
	 *
	 * @since 1.0.0
	 *
	 * @param string $namespace REST API namespace.
	 * @param string $version REST API version.
	 */
	public static function init( $namespace, $version ) {
		// Store REST API configuration.
		self::$rest_namespace = $namespace;
		self::$rest_version   = $version;

		// Initialize REST API routes.
		self::init_rest_api( $namespace, $version );
	}

	/**
	 * Get an existing instance or create a new one.
	 *
	 * @since 1.0.0
	 *
	 * @param string $namespace REST API namespace.
	 * @param string $version REST API version.
	 * @return Optify_Instance Instance object.
	 */
	public static function get_instance( $namespace, $version ) {
		$instance_id = self::generate_instance_id( $namespace, $version );

		if ( isset( self::$instances[ $instance_id ] ) ) {
			return self::$instances[ $instance_id ];
		}

		return self::create_instance( $namespace, $version );
	}

	/**
	 * Create a new Optify instance.
	 *
	 * @since 1.0.0
	 *
	 * @param string $namespace REST API namespace.
	 * @param string $version REST API version.
	 * @return Optify_Instance Instance object.
	 */
	protected static function create_instance( $namespace, $version ) {
		$instance_id = self::generate_instance_id( $namespace, $version );

		// Check if instance already exists.
		if ( isset( self::$instances[ $instance_id ] ) ) {
			_doing_it_wrong(
				__METHOD__,
				sprintf(
					'Optify: Instance for namespace "%s" and version "%s" already exists.',
					esc_html( $namespace ),
					esc_html( $version )
				),
				'1.0.0'
			);
			return self::$instances[ $instance_id ];
		}

		// Create new instance.
		$instance = new Optify_Instance( $instance_id, $namespace, $version );

		self::$instances[ $instance_id ] = $instance;

		return $instance;
	}

	/**
	 * Get an existing instance only.
	 *
	 * @since 1.0.0
	 *
	 * @param string $namespace REST API namespace.
	 * @param string $version REST API version.
	 * @return Optify_Instance|null Instance object or null if not found.
	 */
	protected static function get_existing_instance( $namespace, $version ) {
		$instance_id = self::generate_instance_id( $namespace, $version );
		return isset( self::$instances[ $instance_id ] ) ? self::$instances[ $instance_id ] : null;
	}

	/**
	 * Get all registered instances.
	 *
	 * @since 1.0.0
	 *
	 * @return array Array of instance objects.
	 */
	public static function get_all_instances() {
		return self::$instances;
	}

	/**
	 * Remove an instance.
	 *
	 * @since 1.0.0
	 *
	 * @param string $namespace REST API namespace.
	 * @param string $version REST API version.
	 * @return bool True if instance was removed.
	 */
	protected static function remove_instance( $namespace, $version ) {
		$instance_id = self::generate_instance_id( $namespace, $version );
		if ( isset( self::$instances[ $instance_id ] ) ) {
			unset( self::$instances[ $instance_id ] );
			return true;
		}

		return false;
	}

	/**
	 * Load assets with configuration.
	 *
	 * @since 1.0.0
	 *
	 * @param string $package_dir Package directory path.
	 * @param string $package_url Package URL.
	 */
	public static function load_assets( $package_dir, $package_url ) {
		// Initialize asset loader with configuration.
		Asset_Loader::init( $package_dir, $package_url, self::$rest_namespace, self::$rest_version );

		// Hook into admin enqueue scripts.
		add_action( 'admin_enqueue_scripts', [ __CLASS__, 'enqueue_panel_assets' ] );
	}

	/**
	 * Initialize REST API for panel system.
	 *
	 * @since 1.0.0
	 *
	 * @param string $namespace REST API namespace.
	 * @param string $version REST API version.
	 */
	private static function init_rest_api( $namespace, $version ) {
		add_action(
			'rest_api_init',
			function () use ( $namespace, $version ) {
				Rest_Handler::register_panel_routes( $namespace, $version, [ Api_Handler::class, 'rest_permission_callback' ] );
			}
		);
	}

	/**
	 * Enqueue panel assets.
	 *
	 * @since 1.0.0
	 *
	 * @param string $hook Current admin page hook.
	 */
	public static function enqueue_panel_assets( $hook ) {
		// Generate panel configurations.
		$panel_configs = self::generate_panel_configs();

		// Load assets for admin pages and dashboard.
		Asset_Loader::enqueue_panel_assets( $hook, $panel_configs );
	}

	/**
	 * Set panel configuration callback.
	 *
	 * @since 1.0.0
	 *
	 * @param callable $callback Callback function to generate panel configurations.
	 */
	public static function set_panel_config_callback( $callback ) {
		self::$panel_config_callback = $callback;
	}

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
		Panel_Manager::register_panel( $panel_id, $panel_class, $args );
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
		return Panel_Manager::get_panel( $panel_id );
	}

	/**
	 * Get all registered panel IDs.
	 *
	 * @since 1.0.0
	 *
	 * @return array Array of panel IDs.
	 */
	public static function get_panel_ids() {
		return Panel_Manager::get_panel_ids();
	}

	/**
	 * Get all registered panels.
	 *
	 * @since 1.0.0
	 *
	 * @return array Array of panel instances.
	 */
	public static function get_all_panels() {
		return Panel_Manager::get_all_panels();
	}

	/**
	 * Render a panel.
	 *
	 * @since 1.0.0
	 *
	 * @param string $panel_id Panel identifier.
	 * @param array  $args Render arguments.
	 */
	public static function render_panel( $panel_id, $args = [] ) {
		Panel_Manager::render_panel( $panel_id, $args );
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
		return Panel_Manager::panel_exists( $panel_id );
	}

		/**
		 * Generate panel configurations.
		 *
		 * @since 1.0.0
		 *
		 * @return array Panel configurations.
		 */
	private static function generate_panel_configs() {
		// Use custom callback if provided.
		if ( self::$panel_config_callback && is_callable( self::$panel_config_callback ) ) {
			return call_user_func( self::$panel_config_callback );
		}

		// Simple approach: all panels available everywhere.
		$panel_configs = [];
		$all_panels    = Panel_Manager::get_all_panels();

		foreach ( $all_panels as $panel_id => $panel ) {
			$panel_configs[ $panel_id ] = $panel->get_react_config();
		}

		return $panel_configs;
	}

	/**
	 * Generate instance ID from namespace and version.
	 *
	 * @since 1.0.0
	 *
	 * @param string $namespace REST API namespace.
	 * @param string $version REST API version.
	 * @return string Instance identifier.
	 */
	private static function generate_instance_id( $namespace, $version ) {
		return $namespace . '-' . $version;
	}
}
