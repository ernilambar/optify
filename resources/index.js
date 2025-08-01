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
	const { optifyAdmin } = window;

	if ( ! optifyAdmin || ! optifyAdmin.panels ) {
		return;
	}

	const { panels, restUrl, nonce } = optifyAdmin;

	// Use a single selector to get all panel containers
	const panelContainers = document.querySelectorAll( '[id^="optify-"][id$="-panel"]' );

	// Track processed containers to avoid duplicates
	const processedContainers = new Set();

	panelContainers.forEach( ( container ) => {
		// Skip if already processed
		if ( processedContainers.has( container ) ) {
			return;
		}

		const panelId = container.id.replace( 'optify-', '' ).replace( '-panel', '' );
		const display = container.dataset.display || 'inline';

		console.log( panels[ panelId ] );

		if ( panels[ panelId ] ) {
			try {
				// Mark container as processed
				processedContainers.add( container );

				createRoot( container ).render(
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
