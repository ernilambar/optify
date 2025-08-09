import React from 'react';
import fieldRegistry from './fields';

// Single export: render a field by type using registry lookup.
const renderField = ( field, value, onChange ) => {
	const Component = fieldRegistry[ field?.type ];
	if ( ! Component ) {
		return null;
	}
	return <Component field={ field } value={ value } onChange={ onChange } />;
};

export default renderField;
