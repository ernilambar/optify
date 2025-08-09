import React from 'react';
import { SelectControl } from '@wordpress/components';
import FieldWrapper from '../components/FieldWrapper';
import { extractHtmlAttributes } from '../utils/extract-html-attributes';

const SelectField = ( { field, value, onChange } ) => {
    const { name, label, description, choices = [] } = field;
    const attrs = extractHtmlAttributes( field );
    return (
        <FieldWrapper label={ label } description={ description } className="optify-field optify-field-type-select">
            <SelectControl label="" value={ value } options={ choices || [] } onChange={ ( newValue ) => onChange( name, newValue ) } { ...attrs } />
        </FieldWrapper>
    );
};

export default SelectField;


