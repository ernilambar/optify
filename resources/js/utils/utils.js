/**
 * Decode HTML entities in a string.
 * This function converts HTML entities like &amp;, &lt;, &gt;, &quot;, &#39;, &mdash; back to their original characters.
 *
 * @param {string} str - The string containing HTML entities to decode.
 * @returns {string} The decoded string.
 */
const decodeHtmlEntities = ( str ) => {
	if ( typeof str !== 'string' ) {
		return str;
	}

	// Create a temporary DOM element to decode HTML entities.
	const textarea = document.createElement( 'textarea' );
	textarea.innerHTML = str;
	return textarea.value;
};

/**
 * Process choices array to decode HTML entities in labels.
 * This is useful for field components that need to display HTML entities properly.
 *
 * @param {Array} choices - Array of choice objects with label and value properties.
 * @returns {Array} Processed choices array with decoded labels.
 */
const processChoices = ( choices = [] ) => {
	return choices.map( ( choice ) => ( {
		...choice,
		label: decodeHtmlEntities( choice.label ),
	} ) );
};

export default {
	decodeHtmlEntities,
	processChoices,
};
