import React from 'react';
import { TextControl, Button, ButtonGroup } from '@wordpress/components';
import FieldWrapper from '../components/FieldWrapper';
import { extractHtmlAttributes } from '../utils/extract-html-attributes';
import { isNumberValueEqual } from '../utils/logic';

const NumberField = ( { field, value, onChange } ) => {
	const { name, label, choices = [], description } = field;
	const attrs = extractHtmlAttributes( field );
	const hasChoices = ( choices || [] ).length > 0;

	return (
		<FieldWrapper label={ label } description={ description } type="number">
			<TextControl
				label=""
				type="number"
				value={ value }
				onChange={ ( newValue ) => onChange( name, newValue ) }
				{ ...attrs }
			/>
			{ hasChoices && (
				<div className="optify-field-quick-select">
					<span className="optify-field-quick-select-label">Quick select:</span>
					<ButtonGroup>
						{ ( choices || [] ).map( ( choice ) => (
							<Button
								key={ choice.value }
								variant={
									isNumberValueEqual( value, choice.value )
										? 'primary'
										: 'secondary'
								}
								size="small"
								onClick={ () => onChange( name, choice.value ) }
							>
								{ choice.label }
							</Button>
						) ) }
					</ButtonGroup>
				</div>
			) }
		</FieldWrapper>
	);
};

export default NumberField;
