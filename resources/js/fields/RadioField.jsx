import React from 'react';
import { RadioControl } from '@wordpress/components';
import FieldWrapper from '../components/FieldWrapper';
import { processChoices } from '../utils/utils';

const RadioField = ( { field, value, onChange } ) => {
	const { name, label, description, choices = [], settings = {} } = field;

	// Extract layout setting with default
	const layout = settings.layout || 'vertical';

	// Create CSS class for layout
	const containerClass = `optify-field-radio-group optify-field-radio-group--${ layout }`;

	// Process choices to decode HTML entities
	const processedChoices = processChoices( choices );

	return (
		<FieldWrapper label={ label } description={ description } type="radio">
			<div className={ containerClass }>
				<RadioControl
					selected={ value }
					options={ processedChoices }
					onChange={ ( newValue ) => onChange( name, newValue ) }
				/>
			</div>
		</FieldWrapper>
	);
};

export default RadioField;
