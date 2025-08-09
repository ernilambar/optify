import React from 'react';
import FieldWrapper from '../components/FieldWrapper';
import SortableField from '../sortable-field';

const SortableFieldType = ( { field, value, onChange } ) => {
    const { name, label, description, choices = [], settings = {} } = field;
    return (
        <div className="optify-field optify-field-type-sortable">
            <FieldWrapper label={ label } description={ description } className="">
                <SortableField
                    label=""
                    value={ Array.isArray( value ) ? value : field.default || [] }
                    choices={ choices || [] }
                    onChange={ ( newValue ) => onChange( name, newValue ) }
                    settings={ settings || {} }
                />
            </FieldWrapper>
        </div>
    );
};

export default SortableFieldType;


