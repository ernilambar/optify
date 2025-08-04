import { createRoot } from 'react-dom/client';
import { __ } from '@wordpress/i18n';
import OptifyOptionsPanel from './js/options-panel';
import './css/optify.css';

const OptifyOptionsPanelWrapper = ( { config, restUrl, nonce, panelId, display = 'inline' } ) => {
	if ( ! config || ! restUrl || ! nonce || ! panelId ) {
		return (
			<div className="optify-error">
				{ __( 'Configuration not found. Please refresh the page.', 'optify' ) }
			</div>
		);
	}

	return (
		<OptifyOptionsPanel
			config={ config }
			restUrl={ restUrl }
			nonce={ nonce }
			panelId={ panelId }
			display={ display }
			onSave={ ( values ) => {
				// Handle save success
			} }
			onError={ ( error ) => {
				// Handle save error
			} }
		/>
	);
};

document.addEventListener( 'DOMContentLoaded', () => {
	// Find all optifyAdmin global variables (supporting multiple instances)
	const optifyInstances = {};

	// Get all global variables that start with 'optifyAdmin'
	Object.keys( window ).forEach( ( key ) => {
		if ( key.startsWith( 'optifyAdmin' ) && window[ key ] && window[ key ].panels ) {
			optifyInstances[ key ] = window[ key ];
		}
	} );

	// If no instances found, return early
	if ( Object.keys( optifyInstances ).length === 0 ) {
		return;
	}

	// Track React roots to prevent duplicate creation
	const reactRoots = new Map();

	// Process each instance
	Object.entries( optifyInstances ).forEach( ( [ globalVarName, instanceData ] ) => {
		const { panels, restUrl, nonce } = instanceData;

		// Get panel containers for this specific instance
		// Look for containers that have data-instance matching this global variable name
		let panelContainers = document.querySelectorAll(
			`[id^="optify-"][id$="-panel"][data-instance="${ globalVarName }"]`
		);

		// If no instance-specific containers found, fall back to containers without instance data
		// This provides backward compatibility for panels that don't have instance data
		if ( panelContainers.length === 0 ) {
			panelContainers = document.querySelectorAll(
				`[id^="optify-"][id$="-panel"]:not([data-instance])`
			);
		}

		// Track processed containers to avoid duplicates
		const processedContainers = new Set();

		panelContainers.forEach( ( container ) => {
			// Skip if already processed
			if ( processedContainers.has( container ) ) {
				return;
			}

			const panelId = container.id.replace( 'optify-', '' ).replace( '-panel', '' );
			const display = container.dataset.display || 'inline';

			// Check if this panel belongs to this instance
			if ( panels[ panelId ] ) {
				try {
					// Mark container as processed
					processedContainers.add( container );

					// Check if a React root already exists for this container
					let root = reactRoots.get( container );

					if ( ! root ) {
						// Create new React root only if one doesn't exist
						root = createRoot( container );
						reactRoots.set( container, root );
					}

					// Render the component using the existing or new root
					root.render(
						<OptifyOptionsPanelWrapper
							config={ panels[ panelId ] }
							restUrl={ restUrl }
							nonce={ nonce }
							panelId={ panelId }
							display={ display }
						/>
					);
				} catch ( error ) {
					console.error( 'Error rendering panel:', error );
				}
			}
		} );
	} );
} );
