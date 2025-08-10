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
 * @param {string} contextId Optional context ID.
 * @param {number} postId Optional post ID for meta panels.
 * @returns {Promise<Array>}
 */
export const getFields = async ( restUrl, panelId, nonce, contextId = null, postId = null ) => {
	let url;
	if ( contextId === 'meta' ) {
		url = buildUrl( restUrl, `meta/fields/${ panelId }` );
	} else if ( contextId ) {
		url = buildUrl( restUrl, `context/${ contextId }/fields/${ panelId }` );
	} else {
		url = buildUrl( restUrl, `fields/${ panelId }` );
	}

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
 * @param {string} contextId Optional context ID.
 * @param {number} postId Optional post ID for meta panels.
 * @returns {Promise<Object>}
 */
export const getOptions = async ( restUrl, panelId, nonce, contextId = null, postId = null ) => {
	let url;
	if ( contextId === 'meta' ) {
		url = buildUrl( restUrl, `meta/data/${ panelId }` );
	} else if ( contextId ) {
		url = buildUrl( restUrl, `context/${ contextId }/data/${ panelId }` );
	} else {
		url = buildUrl( restUrl, `options/${ panelId }` );
	}

	// Add post_id parameter for meta requests
	const params = new URLSearchParams();
	if ( contextId === 'meta' && postId ) {
		params.append( 'post_id', postId.toString() );
	}

	if ( params.toString() ) {
		url += '?' + params.toString();
	}

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
 * @param {string} contextId Optional context ID.
 * @param {number} postId Optional post ID for meta panels.
 * @returns {Promise<Object>} Saved values
 */
export const saveOptions = async ( restUrl, panelId, nonce, values, contextId = null, postId = null ) => {
	let url;
	if ( contextId === 'meta' ) {
		url = buildUrl( restUrl, `meta/data/${ panelId }` );
	} else if ( contextId ) {
		url = buildUrl( restUrl, `context/${ contextId }/data/${ panelId }` );
	} else {
		url = buildUrl( restUrl, `options/${ panelId }` );
	}

	// Add post_id parameter for meta requests
	const params = new URLSearchParams();
	if ( contextId === 'meta' && postId ) {
		params.append( 'post_id', postId.toString() );
	}

	if ( params.toString() ) {
		url += '?' + params.toString();
	}

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
