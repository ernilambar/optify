// Minimal logic utilities extracted from options panel.

export const validateComparisonForFieldType = ( fieldType, compare, value ) => {
	// For fields with fixed options (radio, select, checkbox, toggle, multi-check, sortable)
	const fixedOptionFields = [
		'radio',
		'select',
		'checkbox',
		'toggle',
		'multi-check',
		'sortable',
	];

	if ( fixedOptionFields.includes( fieldType ) ) {
		// Only allow specific comparisons for fixed option fields
		const allowedComparisons = [
			' === ',
			' !== ',
			' == ',
			' != ',
			' in ',
			' not in ',
			' contains ',
			' not contains ',
			undefined, // No compare specified (truthy check)
		];

		return allowedComparisons.includes( compare );
	}

	// For other field types, allow all comparisons
	return true;
};

export const evaluateCondition = ( condition, values, fields ) => {
	if ( ! condition || ! Array.isArray( condition ) ) {
		return true; // No condition means always show
	}

	// If we don't have fields or values yet, don't evaluate conditions
	// This prevents conditional fields from being hidden during initial load
	if ( ! fields || fields.length === 0 || ! values || Object.keys( values ).length === 0 ) {
		return true;
	}

	// All conditions in the array must be true (AND logic)
	return condition.every( ( rule ) => {
		const { key, compare, value } = rule;

		if ( ! key ) {
			return true; // No key specified, condition is always true
		}

		const fieldValue = values[ key ];

		// If no compare or value specified, check if field value is truthy
		if ( compare === undefined && value === undefined ) {
			return !! fieldValue;
		}

		// Find the field configuration to check its type
		const targetField = fields.find( ( field ) => field.name === key );
		const fieldType = targetField?.type;

		// Validate comparison operators based on field type
		const isValidComparison = validateComparisonForFieldType( fieldType, compare, value );
		if ( ! isValidComparison ) {
			console.warn( `Invalid comparison "${ compare }" for field type "${ fieldType }"` );
			return false;
		}

		const compareValue = value;

		switch ( compare?.trim() || ' === ' ) {
			case ' === ':
				// For multi-check fields, check if arrays have same values
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
				// For multi-check fields, check if arrays have different values
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
				// For multi-check fields, check if any value is in the compare array
				if ( fieldType === 'multi-check' && Array.isArray( fieldValue ) ) {
					return fieldValue.some( ( val ) => compareValue.includes( val ) );
				}
				return Array.isArray( compareValue ) && compareValue.includes( fieldValue );
			case ' not in ':
				// For multi-check fields, check if no value is in the compare array
				if ( fieldType === 'multi-check' && Array.isArray( fieldValue ) ) {
					return ! fieldValue.some( ( val ) => compareValue.includes( val ) );
				}
				return Array.isArray( compareValue ) && ! compareValue.includes( fieldValue );
			case ' contains ':
				// For multi-check fields, check if the field contains the compare value
				if ( fieldType === 'multi-check' && Array.isArray( fieldValue ) ) {
					return fieldValue.includes( compareValue );
				}
				return String( fieldValue ).includes( String( compareValue ) );
			case ' not contains ':
				// For multi-check fields, check if the field doesn't contain the compare value
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
				// Default to equality check
				return fieldValue === compareValue;
		}
	} );
};

export const isFieldVisible = ( field, values, fields ) => {
	if ( ! field.condition ) {
		return true; // No condition means always visible
	}

	// If we don't have fields or values yet, show the field
	// This prevents conditional fields from being hidden during initial load
	if ( ! fields || fields.length === 0 || ! values || Object.keys( values ).length === 0 ) {
		return true;
	}

	return evaluateCondition( field.condition, values, fields );
};

export const isNumberValueEqual = ( inputValue, choiceValue ) => {
	// Convert both to numbers for comparison
	const inputNum = parseFloat( inputValue );
	const choiceNum = parseFloat( choiceValue );

	// Check if both are valid numbers and equal
	return ! isNaN( inputNum ) && ! isNaN( choiceNum ) && inputNum === choiceNum;
};
