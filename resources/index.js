import { createRoot } from 'react-dom/client';
import { __ } from '@wordpress/i18n';
import OptifyOptionsPanel from './js/options-panel';
import './css/admin.css';
import './css/options-panel.css';

const OptifyOptionsPanelWrapper = ({ config, restUrl, nonce, panelId, underCog = false }) => {
	if (!config || !restUrl || !nonce || !panelId) {
		return (
			<div className="optify-error">
				{__('Configuration not found. Please refresh the page.', 'optify')}
			</div>
		);
	}

	return (
		<OptifyOptionsPanel
			config={config}
			restUrl={restUrl}
			nonce={nonce}
			panelId={panelId}
			underCog={underCog}
			onSave={(values) => {
				// Handle save success
			}}
			onError={(error) => {
				// Handle save error
			}}
		/>
	);
};

document.addEventListener('DOMContentLoaded', () => {
	const { optifyAdmin } = window;

	if (!optifyAdmin || !optifyAdmin.panels) {
		return;
	}

	const { panels, restUrl, nonce } = optifyAdmin;

	const panelContainers = document.querySelectorAll('[id^="optify-"][id$="-panel"]');

	// Also look for panels inside dashboard widgets
	const dashboardWidgets = document.querySelectorAll('[data-location="dashboard_widget"]');
	const dashboardPanelContainers = document.querySelectorAll('#dashboard-widgets [id^="optify-"][id$="-panel"]');

	// Combine all panel containers
	const allPanelContainers = [...panelContainers, ...dashboardPanelContainers];

	allPanelContainers.forEach((container) => {
		const panelId = container.id.replace('optify-', '').replace('-panel', '');
		const location = container.dataset.location;
		const underCog = container.dataset.underCog === 'true';

		if (location && panels[location] && panels[location][panelId]) {
			try {
				createRoot(container).render(
					<OptifyOptionsPanelWrapper
						config={panels[location][panelId]}
						restUrl={restUrl}
						nonce={nonce}
						panelId={panelId}
						underCog={underCog}
					/>
				);
			} catch (error) {
				// Handle rendering error
			}
		}
	});
});
