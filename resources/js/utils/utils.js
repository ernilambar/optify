/**
 * Decode HTML entities in a string.
 * This function converts HTML entities like &amp;, &lt;, &gt;, &quot;, &#39;, &mdash; back to their original characters.
 *
 * @param {string} str - The string containing HTML entities to decode.
 * @returns {string} The decoded string.
 */
const decodeHtmlEntities = ( str ) => {
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
const processChoices = ( choices = [] ) => {
	return choices.map( ( choice ) => ( {
		...choice,
		label: decodeHtmlEntities( choice.label ),
	} ) );
};

/**
 * Helper to extract valid HTML attributes from field.attributes.
 *
 * @param {Object} fieldConfig - The field configuration object.
 * @returns {Object} Object containing valid HTML attributes.
 */
const extractHtmlAttributes = ( fieldConfig ) => {
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

	// Map HTML attribute names to React DOM prop names
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

export { decodeHtmlEntities, processChoices, extractHtmlAttributes };
