import React from 'react';
import { TextControl } from '@wordpress/components';
import FieldWrapper from '../components/FieldWrapper';
import { extractHtmlAttributes } from '../utils/extract-html-attributes';

const TextField = ( { field, value, onChange } ) => {
	const { name, label, description } = field;
	const attrs = extractHtmlAttributes( field );
	return (
		<FieldWrapper label={ label } description={ description } type="text">
			<TextControl
				label=""
				value={ value }
				onChange={ ( newValue ) => onChange( name, newValue ) }
				{ ...attrs }
			/>
		</FieldWrapper>
	);
};

export default TextField;
