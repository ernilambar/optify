import React from 'react';
import { Notice } from '@wordpress/components';

const MessageField = ( { field } ) => {
    const { label, description } = field;
    const status = field.status || 'info';

    if ( status === 'description' ) {
        return (
            <div className="optify-field optify-field-type-message">
                <div className="optify-field-message">{ label }</div>
                { description ? (
                    <div className="optify-field-description">{ description }</div>
                ) : null }
            </div>
        );
    }

    return (
        <div className="optify-field optify-field-type-message">
            <Notice status={ status } isDismissible={ false }>
                { label }
            </Notice>
            { description ? (
                <div className="optify-field-description">{ description }</div>
            ) : null }
        </div>
    );
};

export default MessageField;


