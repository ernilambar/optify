import React from 'react';

const FieldWrapper = ( { label, description, className, children, labelElement = 'label' } ) => {
    const LabelTag = labelElement;
    return (
        <div className={ className }>
            { label ? (
                <LabelTag className="optify-field-label">{ label }</LabelTag>
            ) : null }
            { description ? (
                <div className="optify-field-description">{ description }</div>
            ) : null }
            { children }
        </div>
    );
};

export default FieldWrapper;


