import React from 'react';
import { decodeHtmlEntities } from '../utils/utils';

const FieldWrapper = ( {
	label,
	description,
	type,
	className,
	children,
	labelElement = 'label',
} ) => {
	const LabelTag = labelElement;
	const baseClass = `optify-field${ type ? ` optify-field-type-${ type }` : '' }`;
	const finalClassName = [ baseClass, className ].filter( Boolean ).join( ' ' );

	// Decode HTML entities in label and description.
	const decodedLabel = decodeHtmlEntities( label );
	const decodedDescription = decodeHtmlEntities( description );

	return (
		<div className={ finalClassName }>
			{ decodedLabel ? (
				<LabelTag className="optify-field-label">{ decodedLabel }</LabelTag>
			) : null }
			{ decodedDescription ? (
				<div className="optify-field-description">{ decodedDescription }</div>
			) : null }
			{ children }
		</div>
	);
};

export default FieldWrapper;
