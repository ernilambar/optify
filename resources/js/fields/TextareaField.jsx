import React, { useEffect, useRef } from 'react';
import { TextareaControl } from '@wordpress/components';
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
			// Set height to scrollHeight to fit content, but maintain minimum height
			const minHeight = '4.5rem'; // 3 lines minimum
			const calculatedHeight = `${ textarea.scrollHeight }px`;
			textarea.style.height = `max(${ calculatedHeight }, ${ minHeight })`;
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
			<TextareaControl
				label=""
				value={ value }
				onChange={ ( newValue ) => onChange( name, newValue ) }
				rows={ 3 }
				style={ { minHeight: '4.5rem' } }
				{ ...attrs }
				ref={ textareaRef }
			/>
		</FieldWrapper>
	);
};

export default TextareaField;
