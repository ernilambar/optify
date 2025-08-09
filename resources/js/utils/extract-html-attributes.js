// Helper to extract valid HTML attributes from field.attributes.
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

export default extractHtmlAttributes;
