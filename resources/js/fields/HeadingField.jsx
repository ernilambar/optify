import React from 'react';

const HeadingField = ( { field } ) => {
    const { label, description } = field;
    return (
        <div className="optify-field optify-field-type-heading">
            <h3 className="optify-field-heading">{ label }</h3>
            { description ? (
                <div className="optify-field-description">{ description }</div>
            ) : null }
        </div>
    );
};

export default HeadingField;


