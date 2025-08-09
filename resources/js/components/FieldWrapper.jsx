import React from 'react';

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
	return (
		<div className={ finalClassName }>
			{ label ? <LabelTag className="optify-field-label">{ label }</LabelTag> : null }
			{ description ? <div className="optify-field-description">{ description }</div> : null }
			{ children }
		</div>
	);
};

export default FieldWrapper;
