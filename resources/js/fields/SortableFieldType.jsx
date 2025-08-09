import React from 'react';
import FieldWrapper from '../components/FieldWrapper';
import SortableField from '../components/sortable-field';

const SortableFieldType = ( { field, value, onChange } ) => {
	const { name, label, description, choices = [], settings = {} } = field;
	return (
		<FieldWrapper label={ label } description={ description } type="sortable">
			<SortableField
				label=""
				value={ Array.isArray( value ) ? value : field.default || [] }
				choices={ choices || [] }
				onChange={ ( newValue ) => onChange( name, newValue ) }
				settings={ settings || {} }
			/>
		</FieldWrapper>
	);
};

export default SortableFieldType;
