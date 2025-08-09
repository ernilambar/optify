import React from 'react';
import FieldWrapper from '../components/FieldWrapper';
import { extractHtmlAttributes } from '../utils/extract-html-attributes';

const RadioField = ( { field, value, onChange } ) => {
    const { name, label, description, choices = [] } = field;
    const settings = {
        layout: 'vertical',
        size: 'medium',
        style: 'default',
        spacing: 'normal',
        ...( field.settings || {} ),
    };
    const attrs = extractHtmlAttributes( field );
    const groupClass = `optify-field-radio-group optify-field-radio-group--${ settings.layout }${ settings.spacing === 'tight' ? ' optify-field-radio-group--tight' : '' }`;

    return (
        <div className="optify-field optify-field-type-radio">
            <FieldWrapper label={ label } description={ description } className="">
                <div className={ groupClass }>
                    { ( choices || [] ).map( ( choice ) => (
                        <label key={ choice.value } className="optify-field-radio-option">
                            <input
                                type="radio"
                                name={ name }
                                value={ choice.value }
                                checked={ value === choice.value }
                                onChange={ ( e ) => onChange( name, e.target.value ) }
                                { ...attrs }
                            />
                            { choice.label }
                        </label>
                    ) ) }
                </div>
            </FieldWrapper>
        </div>
    );
};

export default RadioField;


