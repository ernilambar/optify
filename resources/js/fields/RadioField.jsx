import React from 'react';
import { RadioControl } from '@wordpress/components';
import FieldWrapper from '../components/FieldWrapper';

const RadioField = ( { field, value, onChange } ) => {
	const { name, label, description, choices = [], settings = {} } = field;

	// Extract layout setting with default
	const layout = settings.layout || 'vertical';

	// Create CSS class for layout
	const containerClass = `optify-field-radio-group optify-field-radio-group--${ layout }`;

	return (
		<FieldWrapper label={ label } description={ description } type="radio">
			<div className={ containerClass }>
				<RadioControl
					selected={ value }
					options={ choices || [] }
					onChange={ ( newValue ) => onChange( name, newValue ) }
				/>
			</div>
		</FieldWrapper>
	);
};

export default RadioField;
