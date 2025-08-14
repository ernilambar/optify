import React from 'react';
import { SelectControl } from '@wordpress/components';
import FieldWrapper from '../components/FieldWrapper';
import { extractHtmlAttributes } from '../utils/extract-html-attributes';
import { processChoices } from '../utils/utils';

const SelectField = ( { field, value, onChange } ) => {
	const { name, label, description, choices = [] } = field;
	const attrs = extractHtmlAttributes( field );

	// Process choices to decode HTML entities in labels.
	const processedChoices = processChoices( choices );

	return (
		<FieldWrapper label={ label } description={ description } type="select">
			<SelectControl
				label=""
				value={ value }
				options={ processedChoices || [] }
				onChange={ ( newValue ) => onChange( name, newValue ) }
				{ ...attrs }
			/>
		</FieldWrapper>
	);
};

export default SelectField;
