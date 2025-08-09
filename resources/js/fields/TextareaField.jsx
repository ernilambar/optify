import React, { useEffect, useRef } from 'react';
import FieldWrapper from '../components/FieldWrapper';
import { extractHtmlAttributes } from '../utils/extract-html-attributes';

const TextareaField = ( { field, value, onChange } ) => {
	const { name, label, description } = field;
	const attrs = extractHtmlAttributes( field );
	const textareaRef = useRef( null );

	// Function to adjust textarea height based on content
	const adjustTextareaHeight = () => {
		if ( textareaRef.current ) {
			const textarea = textareaRef.current;
			// Reset height to auto to get the correct scrollHeight
			textarea.style.height = 'auto';
			// Set height to scrollHeight to fit content
			textarea.style.height = `${ textarea.scrollHeight }px`;
		}
	};

	// Adjust height when value changes or when readonly
	useEffect( () => {
		if ( attrs.readOnly && value ) {
			adjustTextareaHeight();
		}
	}, [ value, attrs.readOnly ] );

	return (
		<FieldWrapper label={ label } description={ description } type="textarea">
			<textarea
				ref={ textareaRef }
				value={ value }
				onChange={ ( e ) => onChange( name, e.target.value ) }
				className="optify-field-textarea"
				{ ...attrs }
			/>
		</FieldWrapper>
	);
};

export default TextareaField;
