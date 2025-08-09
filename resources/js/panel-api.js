// Centralized API helpers to keep fetch details out of components.

/**
 * Build full endpoint URL.
 * @param {string} restUrl
 * @param {string} path
 * @returns {string}
 */
const buildUrl = ( restUrl, path ) => {
	const base = restUrl.endsWith( '/' ) ? restUrl : `${ restUrl }/`;
	return `${ base }${ path }`;
};

/**
 * Perform a JSON request with WP nonce headers.
 * @param {string} url
 * @param {object} options
 * @returns {Promise<any>}
 */
const requestJson = async ( url, options = {} ) => {
	const response = await fetch( url, options );
	let data;
	try {
		data = await response.json();
	} catch ( e ) {
		// Fallback when no JSON body.
		data = null;
	}

	if ( ! response.ok ) {
		const message =
			( data && ( data.message || data.error ) ) || `Request failed: ${ response.status }`;
		throw new Error( message );
	}

	return data;
};

/**
 * Fetch field configuration for a panel.
 * @param {string} restUrl
 * @param {string} panelId
 * @param {string} nonce
 * @returns {Promise<Array>}
 */
export const getFields = async ( restUrl, panelId, nonce ) => {
	const url = buildUrl( restUrl, `fields/${ panelId }` );
	const data = await requestJson( url, {
		headers: {
			'X-WP-Nonce': nonce,
			'Content-Type': 'application/json',
		},
	} );
	return data?.data || [];
};

/**
 * Fetch options (current values) for a panel.
 * @param {string} restUrl
 * @param {string} panelId
 * @param {string} nonce
 * @returns {Promise<Object>}
 */
export const getOptions = async ( restUrl, panelId, nonce ) => {
	const url = buildUrl( restUrl, `options/${ panelId }` );
	const data = await requestJson( url, {
		headers: {
			'X-WP-Nonce': nonce,
			'Content-Type': 'application/json',
		},
	} );
	return data?.data || {};
};

/**
 * Save options for a panel.
 * @param {string} restUrl
 * @param {string} panelId
 * @param {string} nonce
 * @param {Object} values
 * @returns {Promise<Object>} Saved values
 */
export const saveOptions = async ( restUrl, panelId, nonce, values ) => {
	const url = buildUrl( restUrl, `options/${ panelId }` );
	const data = await requestJson( url, {
		method: 'POST',
		headers: {
			'X-WP-Nonce': nonce,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify( { values } ),
	} );

	// Prefer returned values if present.
	return data?.data?.values || values || {};
};

export default {
	getFields,
	getOptions,
	saveOptions,
};
