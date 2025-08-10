import React from 'react';
import { Notice } from '@wordpress/components';

const MessageField = ( { field } ) => {
	const { label } = field;
	const status = field.status || 'info';

	if ( status === 'description' ) {
		return (
			<div className="optify-field optify-field-type-message">
				<div className="optify-field-message">{ label }</div>
			</div>
		);
	}

	return (
		<div className="optify-field optify-field-type-message">
			<Notice status={ status } isDismissible={ false }>
				{ label }
			</Notice>
		</div>
	);
};

export default MessageField;
