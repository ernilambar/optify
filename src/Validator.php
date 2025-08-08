<?php
/**
 * Validator Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify;

/**
 * Validator class for field validation.
 *
 * @since 1.0.0
 */
class Validator {

	/**
	 * Validate fields based on configuration.
	 *
	 * @since 1.0.0
	 *
	 * @param array $values Values to validate.
	 * @param array $fields Field configuration.
	 * @return true|\WP_Error True on success, WP_Error on failure.
	 */
	public static function validate_fields( $values, $fields ) {
		$errors = [];

		foreach ( $fields as $field ) {
			$field_name  = $field['name'];
			$field_value = isset( $values[ $field_name ] ) ? $values[ $field_name ] : null;

			// Check if field is required.
			if ( ! empty( $field['required'] ) && ( null === $field_value || '' === $field_value ) ) {
				$errors[] = sprintf(
					esc_html__( 'Field "%s" is required.', 'optify' ),
					$field['label']
				);
				continue;
			}

			// Skip validation if field is empty and not required.
			if ( null === $field_value || '' === $field_value ) {
				continue;
			}

			// Validate based on field type.
			$validation_result = self::validate_field( $field_value, $field );
			if ( is_wp_error( $validation_result ) ) {
				$errors[] = $validation_result->get_error_message();
			}
		}

		if ( ! empty( $errors ) ) {
			return new \WP_Error( 'validation_failed', implode( ' ', $errors ) );
		}

		return true;
	}

	/**
	 * Validate a single field.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $value Field value.
	 * @param array $field Field configuration.
	 * @return true|\WP_Error True on success, WP_Error on failure.
	 */
	private static function validate_field( $value, $field ) {
		$field_type = $field['type'] ?? 'text';

		switch ( $field_type ) {
			case 'email':
				if ( ! is_email( $value ) ) {
					return new \WP_Error(
						'invalid_email',
						sprintf(
							esc_html__( 'Invalid email address for field "%s".', 'optify' ),
							$field['label']
						)
					);
				}
				break;

			case 'url':
				if ( ! filter_var( $value, FILTER_VALIDATE_URL ) ) {
					return new \WP_Error(
						'invalid_url',
						sprintf(
							esc_html__( 'Invalid URL for field "%s".', 'optify' ),
							$field['label']
						)
					);
				}
				break;

			case 'number':
				if ( ! empty( $field['required'] ) && ( empty( $value ) || ! is_numeric( $value ) ) ) {
					return new \WP_Error(
						'invalid_number',
						sprintf(
							esc_html__( 'Valid number is required for field "%s".', 'optify' ),
							$field['label']
						)
					);
				}
				// Validate against predefined choices if provided
				$choices = $field['choices'] ?? [];
				if ( ! empty( $choices ) ) {
					$valid_values = array_column( $choices, 'value' );
					if ( ! in_array( $value, $valid_values, true ) ) {
						return new \WP_Error(
							'invalid_number_choice',
							sprintf(
								esc_html__( 'Invalid value for field "%s".', 'optify' ),
								$field['label']
							)
						);
					}
				}
				break;

			case 'password':
				// Password validation - ensure it's not empty if required.
				if ( ! empty( $field['required'] ) && empty( $value ) ) {
					return new \WP_Error(
						'invalid_password',
						sprintf(
							esc_html__( 'Password is required for field "%s".', 'optify' ),
							$field['label']
						)
					);
				}
				break;
			case 'checkbox':
			case 'toggle':
				if ( ! is_bool( $value ) && ! in_array( $value, [ '0', '1', 0, 1 ], true ) ) {
					return new \WP_Error(
						'invalid_checkbox',
						sprintf(
							esc_html__( 'Invalid value for field "%s".', 'optify' ),
							$field['label']
						)
					);
				}
				break;
			case 'select':
			case 'radio':
			case 'buttonset':
				$choices      = $field['choices'] ?? [];
				$valid_values = array_column( $choices, 'value' );
				if ( ! in_array( $value, $valid_values, true ) ) {
					return new \WP_Error(
						'invalid_choice',
						sprintf(
							esc_html__( 'Invalid value for field "%s".', 'optify' ),
							$field['label']
						)
					);
				}
				break;

			case 'multi-check':
				$choices      = $field['choices'] ?? [];
				$valid_values = array_column( $choices, 'value' );

				// Convert only null/empty string to empty array
				if ( null === $value || '' === $value ) {
					$value = [];
				}

				// Multi-check fields must always be arrays
				if ( ! is_array( $value ) ) {
					return new \WP_Error(
						'invalid_multicheck_type',
						sprintf(
							esc_html__( 'Field "%1$s" must be an array. Received %2$s.', 'optify' ),
							$field['label'],
							gettype( $value )
						)
					);
				}

				// If array is empty, that's valid (no checkboxes selected)
				if ( empty( $value ) ) {
					break;
				}

				// Validate each value against available choices
				foreach ( $value as $v ) {
					if ( ! in_array( $v, $valid_values, true ) ) {
						return new \WP_Error(
							'invalid_multicheck_choice',
							sprintf(
								esc_html__( 'Invalid value "%1$s" for field "%2$s". Value must be one of the available choices.', 'optify' ),
								$v,
								$field['label']
							)
						);
					}
				}

				// Remove duplicates
				$value = array_unique( $value );
				break;

			case 'sortable':
				$choices      = $field['choices'] ?? [];
				$valid_values = array_column( $choices, 'value' );
				if ( ! is_array( $value ) ) {
					return new \WP_Error(
						'invalid_sortable',
						sprintf(
							esc_html__( 'Invalid value for field "%s". Sortable field must be an array.', 'optify' ),
							$field['label']
						)
					);
				}
				foreach ( $value as $v ) {
					if ( ! in_array( $v, $valid_values, true ) ) {
						return new \WP_Error(
							'invalid_sortable_choice',
							sprintf(
								esc_html__( 'Invalid value "%1$s" for field "%2$s". Value must be one of the available choices.', 'optify' ),
								$v,
								$field['label']
							)
						);
					}
				}
				break;
		}

		return true;
	}

	/**
	 * Validate required fields.
	 *
	 * @since 1.0.0
	 *
	 * @param array $values Values to validate.
	 * @param array $fields Field configuration.
	 * @return true|\WP_Error True on success, WP_Error on failure.
	 */
	public static function validate_required_fields( $values, $fields ) {
		$errors = [];

		foreach ( $fields as $field ) {
			if ( ! empty( $field['required'] ) ) {
				$field_name  = $field['name'];
				$field_value = isset( $values[ $field_name ] ) ? $values[ $field_name ] : null;

				// Check if field is empty based on its type
				$is_empty = false;

				if ( null === $field_value || '' === $field_value ) {
					$is_empty = true;
				} elseif ( 'multi-check' === $field['type'] && is_array( $field_value ) && empty( $field_value ) ) {
					// For multi-check fields, empty array means not filled
					$is_empty = true;
				} elseif ( 'sortable' === $field['type'] && is_array( $field_value ) && empty( $field_value ) ) {
					// For sortable fields, empty array means not filled
					$is_empty = true;
				}

				if ( $is_empty ) {
					$errors[] = sprintf(
						esc_html__( 'Field "%s" is required.', 'optify' ),
						$field['label']
					);
				}
			}
		}

		if ( ! empty( $errors ) ) {
			return new \WP_Error( 'required_fields_missing', implode( ' ', $errors ) );
		}

		return true;
	}

	/**
	 * Validate field values against allowed values.
	 *
	 * @since 1.0.0
	 *
	 * @param array $values Values to validate.
	 * @param array $fields Field configuration.
	 * @return true|\WP_Error True on success, WP_Error on failure.
	 */
	public static function validate_field_values( $values, $fields ) {
		$errors = [];

		foreach ( $fields as $field ) {
			$field_name  = $field['name'];
			$field_value = isset( $values[ $field_name ] ) ? $values[ $field_name ] : null;

			if ( null !== $field_value && '' !== $field_value ) {
				$validation_result = self::validate_field( $field_value, $field );
				if ( is_wp_error( $validation_result ) ) {
					$errors[] = $validation_result->get_error_message();
				}
			}
		}

		if ( ! empty( $errors ) ) {
			return new \WP_Error( 'invalid_values', implode( ' ', $errors ) );
		}

		return true;
	}
}
