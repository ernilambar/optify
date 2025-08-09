import React from 'react';
import FieldWrapper from '../components/FieldWrapper';
import { extractHtmlAttributes } from '../utils/extract-html-attributes';

const TextField = ( { field, value, onChange } ) => {
	const { name, label, description } = field;
	const attrs = extractHtmlAttributes( field );
	return (
		<FieldWrapper label={ label } description={ description } type="text">
			<input
				type="text"
				value={ value }
				onChange={ ( e ) => onChange( name, e.target.value ) }
				className="optify-field-input"
				{ ...attrs }
			/>
		</FieldWrapper>
	);
};

export default TextField;
