<?php
/**
 * Sanitizer Class
 *
 * @package Optify
 * @since 1.0.0
 */

namespace Nilambar\Optify;

/**
 * Generic data sanitizer.
 *
 * @since 1.0.0
 */
class Sanitizer {

	/**
	 * Sanitize field value based on type.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed  $value Field value.
	 * @param string $type Field type.
	 * @return mixed Sanitized value.
	 */
	public static function sanitize_field( $value, $type ) {
		switch ( $type ) {
			case 'text':
				return sanitize_text_field( $value );

			case 'textarea':
				return sanitize_textarea_field( $value );

			case 'email':
				return sanitize_email( $value );

			case 'url':
				return esc_url_raw( $value );

			case 'number':
				return is_numeric( $value ) ? (int) $value : 0;
			case 'password':
			case 'checkbox':
			case 'toggle':
				return (bool) $value;

			case 'radio':
			case 'select':
			case 'buttonset':
				return sanitize_text_field( $value );

			case 'multi-check':
				return is_array( $value ) ? array_map( 'sanitize_text_field', $value ) : [];

			case 'sortable':
				return is_array( $value ) ? array_map( 'sanitize_text_field', $value ) : [];

			case 'array':
				return is_array( $value ) ? array_map( 'sanitize_text_field', $value ) : [];

			default:
				return sanitize_text_field( $value );
		}
	}

	/**
	 * Sanitize multiple fields based on configuration.
	 *
	 * @since 1.0.0
	 *
	 * @param array $values Values to sanitize.
	 * @param array $fields Field configuration.
	 * @return array Sanitized values.
	 */
	public static function sanitize_fields( $values, $fields ) {
		if ( ! is_array( $values ) ) {
			return [];
		}

		$sanitized_values = [];

		foreach ( $fields as $field ) {
			$field_name = $field['name'];

			if ( isset( $values[ $field_name ] ) ) {
				$sanitized_values[ $field_name ] = self::sanitize_field(
					$values[ $field_name ],
					$field['type']
				);
			}
		}

		return $sanitized_values;
	}

	/**
	 * Sanitize HTML content.
	 *
	 * @since 1.0.0
	 *
	 * @param string $content Content to sanitize.
	 * @param array  $allowed_tags Allowed HTML tags.
	 * @return string Sanitized content.
	 */
	public static function sanitize_html( $content, $allowed_tags = [] ) {
		if ( empty( $allowed_tags ) ) {
			$allowed_tags = [
				'a'      => [
					'href'  => [],
					'title' => [],
				],
				'br'     => [],
				'em'     => [],
				'strong' => [],
				'p'      => [],
			];
		}

		return wp_kses( $content, $allowed_tags );
	}
}
