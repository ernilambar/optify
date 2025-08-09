import React from 'react';
import { CheckboxControl } from '@wordpress/components';
import FieldWrapper from '../components/FieldWrapper';
import { extractHtmlAttributes } from '../utils/extract-html-attributes';

const CheckboxField = ( { field, value, onChange } ) => {
    const { name, label, description } = field;
    const attrs = extractHtmlAttributes( field );
    return (
        <FieldWrapper label={ label } description={ description } className="optify-field optify-field-type-checkbox">
            <CheckboxControl label="" checked={ !! value } onChange={ ( newValue ) => onChange( name, newValue ) } { ...attrs } />
        </FieldWrapper>
    );
};

export default CheckboxField;


