<?php
/**
 * Abstract Panel Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify;

/**
 * Abstract panel class for handling single panel functionality.
 *
 * @since 1.0.0
 */
abstract class Abstract_Panel {

	/**
	 * Panel identifier.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $panel_id;

	/**
	 * Panel title.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $panel_title;

	/**
	 * Options name for this panel.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $options_name;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param string $panel_id Panel identifier.
	 * @param string $panel_title Panel title.
	 * @param string $options_name Options name.
	 */
	public function __construct( $panel_id, $panel_title, $options_name ) {
		$this->panel_id     = $panel_id;
		$this->panel_title  = $panel_title;
		$this->options_name = $options_name;
	}

	/**
	 * Get panel identifier.
	 *
	 * @since 1.0.0
	 *
	 * @return string Panel identifier.
	 */
	public function get_panel_id() {
		return $this->panel_id;
	}

	/**
	 * Get panel title.
	 *
	 * @since 1.0.0
	 *
	 * @return string Panel title.
	 */
	public function get_panel_title() {
		return $this->panel_title;
	}

	/**
	 * Get options name.
	 *
	 * @since 1.0.0
	 *
	 * @return string Options name.
	 */
	public function get_options_name() {
		return $this->options_name;
	}

	/**
	 * Get field configuration for this panel.
	 *
	 * @since 1.0.0
	 *
	 * @return array Field configuration.
	 */
	abstract public function get_field_configuration();

	/**
	 * Get React configuration for this panel.
	 *
	 * @since 1.0.0
	 *
	 * @return array React configuration.
	 */
	public function get_react_config() {
		$fields = $this->get_field_configuration();

		return [
			'optionsName'    => $this->options_name,
			'fieldsConfig'   => $fields,
			'panelTitle'     => $this->panel_title,
			'saveButtonText' => esc_html__( 'Save Changes', 'optify' ),
			'savingText'     => esc_html__( 'Saving...', 'optify' ),
			'loadingText'    => esc_html__( 'Loading...', 'optify' ),
			'messages'       => [
				'saveSuccess' => esc_html__( 'Settings saved.', 'optify' ),
				'saveError'   => esc_html__( 'Failed to save settings.', 'optify' ),
			],
		];
	}

	/**
	 * Sanitize options values.
	 *
	 * @since 1.0.0
	 *
	 * @param array $values Values to sanitize.
	 * @return array Sanitized values.
	 */
	public function sanitize_options( $values ) {
		$fields = $this->get_field_configuration();
		return Sanitizer::sanitize_fields( $values, $fields );
	}

	/**
	 * Validate options values.
	 *
	 * @since 1.0.0
	 *
	 * @param array $values Values to validate.
	 * @return true|\WP_Error True on success, WP_Error on failure.
	 */
	public function validate_options( $values ) {
		$fields = $this->get_field_configuration();
		return Validator::validate_fields( $values, $fields );
	}
}
