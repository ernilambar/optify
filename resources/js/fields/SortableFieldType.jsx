import React from 'react';
import FieldWrapper from '../components/FieldWrapper';
import SortableField from '../components/sortable-field';
import { processChoices } from '../utils/utils';

const SortableFieldType = ( { field, value, onChange } ) => {
	const { name, label, description, choices = [], settings = {} } = field;

	// Process choices to decode HTML entities in labels.
	const processedChoices = processChoices( choices );

	return (
		<FieldWrapper label={ label } description={ description } type="sortable">
			<SortableField
				label=""
				value={ Array.isArray( value ) ? value : field.default || [] }
				choices={ processedChoices || [] }
				onChange={ ( newValue ) => onChange( name, newValue ) }
				settings={ settings || {} }
			/>
		</FieldWrapper>
	);
};

export default SortableFieldType;
