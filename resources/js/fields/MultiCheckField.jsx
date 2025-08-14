import React from 'react';
import FieldWrapper from '../components/FieldWrapper';
import { extractHtmlAttributes } from '../utils/utils';

const MultiCheckField = ( { field, value, onChange } ) => {
	const { name, label, description, choices = [] } = field;
	const settings = {
		layout: 'vertical',
		size: 'medium',
		style: 'default',
		...( field.settings || {} ),
	};
	const attrs = extractHtmlAttributes( field );

	const validChoices = ( choices || [] ).map( ( choice ) => choice.value );
	const baseValue = Array.isArray( value ) ? value : field.default || [];
	const filteredValue = baseValue.filter( ( val ) => validChoices.includes( val ) );

	const groupClass = `optify-field-multi-check-group optify-field-multi-check-group--${ settings.layout }`;

	return (
		<FieldWrapper
			label={ label }
			description={ description }
			className="optify-field optify-field-type-multi-check"
			labelElement="span"
		>
			<div className={ groupClass }>
				{ ( choices || [] ).map( ( choice ) => (
					<label key={ choice.value } className="optify-field-multi-check-option">
						<input
							type="checkbox"
							value={ choice.value }
							checked={ filteredValue.includes( choice.value ) }
							onChange={ ( e ) => {
								let newValue = [ ...filteredValue ];
								if ( e.target.checked ) {
									newValue.push( choice.value );
								} else {
									newValue = newValue.filter( ( v ) => v !== choice.value );
								}
								onChange( name, newValue );
							} }
							{ ...attrs }
						/>
						{ choice.label }
					</label>
				) ) }
			</div>
		</FieldWrapper>
	);
};

export default MultiCheckField;
