import React from 'react';
import FieldWrapper from '../components/FieldWrapper';
import { extractHtmlAttributes } from '../utils/extract-html-attributes';

const TextareaField = ( { field, value, onChange } ) => {
	const { name, label, description } = field;
	const attrs = extractHtmlAttributes( field );
	return (
		<FieldWrapper label={ label } description={ description } type="textarea">
			<textarea
				value={ value }
				onChange={ ( e ) => onChange( name, e.target.value ) }
				className="optify-field-textarea"
				{ ...attrs }
			/>
		</FieldWrapper>
	);
};

export default TextareaField;
