import React from 'react';
import { Button, ButtonGroup } from '@wordpress/components';
import FieldWrapper from '../components/FieldWrapper';

const ButtonsetField = ( { field, value, onChange } ) => {
    const { name, label, description, choices = [] } = field;
    return (
        <div className="optify-field optify-field-type-buttonset">
            <FieldWrapper label={ label } description={ description } className="" labelElement="span">
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
        </div>
    );
};

export default ButtonsetField;


