// ============================================================================
// CONDITIONAL LOGIC UTILITIES
// ============================================================================

/**
 * Evaluate a single condition against field values.
 * @param {Object} condition - The condition object.
 * @param {Object} values - Current field values.
 * @param {Array} fields - All field configurations.
 * @returns {boolean} - Whether the condition is met.
 */
const evaluateSingleCondition = ( condition, values, fields ) => {
	const { field, operator, value: compareValue } = condition;

	// Find the field configuration to get its type.
	const fieldConfig = fields.find( ( f ) => f.name === field );
	const fieldType = fieldConfig?.type || 'text';
	const fieldValue = values[ field ];

	// Handle different operators.
	switch ( operator ) {
		case ' === ':
			// For multi-check fields, check if arrays have the same values.
			if (
				fieldType === 'multi-check' &&
				Array.isArray( fieldValue ) &&
				Array.isArray( compareValue )
			) {
				return (
					fieldValue.length === compareValue.length &&
					fieldValue.every( ( val ) => compareValue.includes( val ) )
				);
			}
			return fieldValue === compareValue;
		case ' !== ':
			// For multi-check fields, check if arrays have different values.
			if (
				fieldType === 'multi-check' &&
				Array.isArray( fieldValue ) &&
				Array.isArray( compareValue )
			) {
				return (
					fieldValue.length !== compareValue.length ||
					! fieldValue.every( ( val ) => compareValue.includes( val ) )
				);
			}
			return fieldValue !== compareValue;
		case ' == ':
			// eslint-disable-next-line eqeqeq
			return fieldValue == compareValue;
		case ' != ':
			// eslint-disable-next-line eqeqeq
			return fieldValue != compareValue;
		case ' > ':
			return parseFloat( fieldValue ) > parseFloat( compareValue );
		case ' >= ':
			return parseFloat( fieldValue ) >= parseFloat( compareValue );
		case ' < ':
			return parseFloat( fieldValue ) < parseFloat( compareValue );
		case ' <= ':
			return parseFloat( fieldValue ) <= parseFloat( compareValue );
		case ' in ':
			// For multi-check fields, check if any value is in the compare array.
			if ( fieldType === 'multi-check' && Array.isArray( fieldValue ) ) {
				return fieldValue.some( ( val ) => compareValue.includes( val ) );
			}
			return Array.isArray( compareValue ) && compareValue.includes( fieldValue );
		case ' not in ':
			// For multi-check fields, check if no value is in the compare array.
			if ( fieldType === 'multi-check' && Array.isArray( fieldValue ) ) {
				return ! fieldValue.some( ( val ) => compareValue.includes( val ) );
			}
			return Array.isArray( compareValue ) && ! compareValue.includes( fieldValue );
		case ' contains ':
			// For multi-check fields, check if the field contains the compare value.
			if ( fieldType === 'multi-check' && Array.isArray( fieldValue ) ) {
				return fieldValue.includes( compareValue );
			}
			return String( fieldValue ).includes( String( compareValue ) );
		case ' not contains ':
			// For multi-check fields, check if the field doesn't contain the compare value.
			if ( fieldType === 'multi-check' && Array.isArray( fieldValue ) ) {
				return ! fieldValue.includes( compareValue );
			}
			return ! String( fieldValue ).includes( String( compareValue ) );
		case ' starts_with ':
			return String( fieldValue ).startsWith( String( compareValue ) );
		case ' ends_with ':
			return String( fieldValue ).endsWith( String( compareValue ) );
		case ' is_empty ':
			return (
				! fieldValue ||
				fieldValue === '' ||
				( Array.isArray( fieldValue ) && fieldValue.length === 0 )
			);
		case ' is_not_empty ':
			return (
				fieldValue &&
				fieldValue !== '' &&
				( ! Array.isArray( fieldValue ) || fieldValue.length > 0 )
			);
		default:
			// Default to equality check.
			return fieldValue === compareValue;
	}
};

/**
 * Evaluate a complex condition (can be nested with AND/OR logic).
 * @param {Object|Array} condition - The condition object or array.
 * @param {Object} values - Current field values.
 * @param {Array} fields - All field configurations.
 * @returns {boolean} - Whether the condition is met.
 */
const evaluateCondition = ( condition, values, fields ) => {
	// Handle array of conditions (AND logic).
	if ( Array.isArray( condition ) ) {
		return condition.every( ( cond ) => evaluateCondition( cond, values, fields ) );
	}

	// Handle object with AND/OR logic.
	if ( condition.and ) {
		return condition.and.every( ( cond ) => evaluateCondition( cond, values, fields ) );
	}

	if ( condition.or ) {
		return condition.or.some( ( cond ) => evaluateCondition( cond, values, fields ) );
	}

	// Handle single condition.
	return evaluateSingleCondition( condition, values, fields );
};

/**
 * Check if a field should be visible based on its conditions.
 * @param {Object} field - The field configuration.
 * @param {Object} values - Current field values.
 * @param {Array} fields - All field configurations.
 * @returns {boolean} - Whether the field should be visible.
 */
export const isFieldVisible = ( field, values, fields ) => {
	if ( ! field.condition ) {
		return true; // No condition means always visible.
	}

	return evaluateCondition( field.condition, values, fields );
};

/**
 * Compare number values for equality.
 * @param {*} inputValue - The input value to compare.
 * @param {*} choiceValue - The choice value to compare against.
 * @returns {boolean} - Whether the values are numerically equal.
 */
export const isNumberValueEqual = ( inputValue, choiceValue ) => {
	// Convert both to numbers for comparison.
	const inputNum = parseFloat( inputValue );
	const choiceNum = parseFloat( choiceValue );

	// Check if both are valid numbers and equal.
	return ! isNaN( inputNum ) && ! isNaN( choiceNum ) && inputNum === choiceNum;
};

// ============================================================================
// HTML ENTITY DECODING UTILITIES
// ============================================================================

/**
 * Decode HTML entities in a string.
 * This function converts HTML entities like &amp;, &lt;, &gt;, &quot;, &#39;, &mdash; back to their original characters.
 *
 * @param {string} str - The string containing HTML entities to decode.
 * @returns {string} The decoded string.
 */
export const decodeHtmlEntities = ( str ) => {
	if ( typeof str !== 'string' ) {
		return str;
	}

	// Create a temporary DOM element to decode HTML entities.
	const textarea = document.createElement( 'textarea' );
	textarea.innerHTML = str;
	return textarea.value;
};

/**
 * Process choices array to decode HTML entities in labels.
 * This is useful for field components that need to display HTML entities properly.
 *
 * @param {Array} choices - Array of choice objects with label and value properties.
 * @returns {Array} Processed choices array with decoded labels.
 */
export const processChoices = ( choices = [] ) => {
	return choices.map( ( choice ) => ( {
		...choice,
		label: decodeHtmlEntities( choice.label ),
	} ) );
};

// ============================================================================
// HTML ATTRIBUTES UTILITIES
// ============================================================================

/**
 * Helper to extract valid HTML attributes from field.attributes.
 * @param {Object} fieldConfig - The field configuration object.
 * @returns {Object} - Object containing valid HTML attributes.
 */
export const extractHtmlAttributes = ( fieldConfig ) => {
	const htmlAttributes = {};

	const attributesSource = fieldConfig?.attributes;
	if ( ! attributesSource || typeof attributesSource !== 'object' ) {
		return htmlAttributes;
	}

	const validHtmlAttributes = [
		'placeholder',
		'readonly',
		'disabled',
		'required',
		'maxlength',
		'minlength',
		'pattern',
		'autocomplete',
		'autofocus',
		'form',
		'list',
		'multiple',
		'name',
		'size',
		'step',
		'type',
		'value',
		'accept',
		'alt',
		'checked',
		'dirname',
		'formaction',
		'formenctype',
		'formmethod',
		'formnovalidate',
		'formtarget',
		'height',
		'max',
		'min',
		'src',
		'width',
		'rel',
		'target',
		'aria-label',
		'aria-describedby',
		'aria-required',
		'aria-invalid',
		'data-*',
	];

	// Map HTML attribute names to React DOM prop names.
	const reactPropMap = {
		readonly: 'readOnly',
		maxlength: 'maxLength',
		minlength: 'minLength',
		autocomplete: 'autoComplete',
		autofocus: 'autoFocus',
		formaction: 'formAction',
		formenctype: 'formEncType',
		formmethod: 'formMethod',
		formnovalidate: 'formNoValidate',
		formtarget: 'formTarget',
	};

	Object.keys( attributesSource ).forEach( ( key ) => {
		if ( key.startsWith( 'data-' ) ) {
			htmlAttributes[ key ] = attributesSource[ key ];
			return;
		}
		if ( key.startsWith( 'aria-' ) ) {
			htmlAttributes[ key ] = attributesSource[ key ];
			return;
		}
		if ( validHtmlAttributes.includes( key ) ) {
			const reactKey = reactPropMap[ key ] || key;
			htmlAttributes[ reactKey ] = attributesSource[ key ];
		}
	} );

	return htmlAttributes;
};

// ============================================================================
// API UTILITIES
// ============================================================================

/**
 * Build full endpoint URL.
 * @param {string} restUrl - The base REST URL.
 * @param {string} path - The endpoint path.
 * @returns {string} - The complete URL.
 */
const buildUrl = ( restUrl, path ) => {
	const base = restUrl.endsWith( '/' ) ? restUrl : `${ restUrl }/`;
	return `${ base }${ path }`;
};

/**
 * Perform a JSON request with WP nonce headers.
 * @param {string} url - The URL to request.
 * @param {Object} options - Fetch options.
 * @returns {Promise<any>} - The response data.
 */
const requestJson = async ( url, options = {} ) => {
	const response = await fetch( url, options );
	let data;
	try {
		data = await response.json();
	} catch ( e ) {
		// Fallback when no JSON body.
		data = null;
	}

	if ( ! response.ok ) {
		const message =
			( data && ( data.message || data.error ) ) || `Request failed: ${ response.status }`;
		throw new Error( message );
	}

	return data;
};

/**
 * Fetch field configuration for a panel.
 * @param {string} restUrl - The base REST URL.
 * @param {string} panelId - The panel ID.
 * @param {string} nonce - The WordPress nonce.
 * @returns {Promise<Array>} - The field configuration array.
 */
export const getFields = async ( restUrl, panelId, nonce ) => {
	const url = buildUrl( restUrl, `fields/${ panelId }` );
	const data = await requestJson( url, {
		headers: {
			'X-WP-Nonce': nonce,
			'Content-Type': 'application/json',
		},
	} );
	return data?.data || [];
};

/**
 * Fetch options (current values) for a panel.
 * @param {string} restUrl - The base REST URL.
 * @param {string} panelId - The panel ID.
 * @param {string} nonce - The WordPress nonce.
 * @returns {Promise<Object>} - The current option values.
 */
export const getOptions = async ( restUrl, panelId, nonce ) => {
	const url = buildUrl( restUrl, `options/${ panelId }` );
	const data = await requestJson( url, {
		headers: {
			'X-WP-Nonce': nonce,
			'Content-Type': 'application/json',
		},
	} );
	return data?.data || {};
};

/**
 * Save options for a panel.
 * @param {string} restUrl - The base REST URL.
 * @param {string} panelId - The panel ID.
 * @param {string} nonce - The WordPress nonce.
 * @param {Object} values - The values to save.
 * @returns {Promise<Object>} - The saved values.
 */
export const saveOptions = async ( restUrl, panelId, nonce, values ) => {
	const url = buildUrl( restUrl, `options/${ panelId }` );
	const data = await requestJson( url, {
		method: 'POST',
		headers: {
			'X-WP-Nonce': nonce,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify( { values } ),
	} );

	// Prefer returned values if present.
	return data?.data?.values || values || {};
};

// ============================================================================
// DEFAULT EXPORTS
// ============================================================================

export default {
	// Conditional logic.
	isFieldVisible,
	isNumberValueEqual,

	// HTML entity decoding.
	decodeHtmlEntities,
	processChoices,

	// HTML attributes.
	extractHtmlAttributes,

	// API functions.
	getFields,
	getOptions,
	saveOptions,
};
