import React from 'react';
import { Button, ButtonGroup } from '@wordpress/components';
import FieldWrapper from '../components/FieldWrapper';

const ButtonsetField = ( { field, value, onChange } ) => {
	const { name, label, description, choices = [] } = field;
	return (
		<FieldWrapper
			label={ label }
			description={ description }
			type="buttonset"
			labelElement="span"
		>
			<ButtonGroup>
				{ ( choices || [] ).map( ( choice ) => (
					<Button
						key={ choice.value }
						variant={ value === choice.value ? 'primary' : 'secondary' }
						onClick={ () => onChange( name, choice.value ) }
					>
						{ choice.label }
					</Button>
				) ) }
			</ButtonGroup>
		</FieldWrapper>
	);
};

export default ButtonsetField;
