import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { Panel, PanelBody, PanelRow, Button, Notice, Modal } from '@wordpress/components';
import Icon from './components/Icon';
import renderField from './field-renderer';
import { isFieldVisible, getFields, getOptions, saveOptions } from './utils/utils';

const OptionsPanel = ( {
	config,
	restUrl,
	nonce,
	panelId,
	onSave,
	onError,
	display = 'inline',
} ) => {
	const [ fields, setFields ] = useState( [] );
	const [ values, setValues ] = useState( {} );
	const [ originalValues, setOriginalValues ] = useState( {} );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ isSaved, setIsSaved ] = useState( false );
	const [ notice, setNotice ] = useState( null );
	const [ hasChanges, setHasChanges ] = useState( false );
	const [ isToggleExpanded, setIsToggleExpanded ] = useState( display !== 'toggle' );
	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ isToggleAnimating, setIsToggleAnimating ] = useState( false );

	const { panelTitle, saveButtonText, savingText, loadingText, messages } = config;

	// Get show_title setting from data attribute.
	const [ showTitle, setShowTitle ] = useState( true );
	useEffect( () => {
		const panelElement = document.getElementById( `optify-${ panelId }-panel` );
		if ( panelElement ) {
			const dataShowTitle = panelElement.getAttribute( 'data-show-title' );
			setShowTitle( dataShowTitle !== 'false' );
		}
	}, [ panelId ] );

	// Check if values have changed.
	useEffect( () => {
		const changed = Object.keys( values ).some( ( key ) => {
			return values[ key ] !== originalValues[ key ];
		} );
		setHasChanges( changed );
	}, [ values, originalValues ] );

	// Auto-restore save button state after successful save.
	useEffect( () => {
		if ( isSaved ) {
			const timer = setTimeout( () => {
				setIsSaved( false );
			}, 3000 ); // Restore after 3 seconds.

			return () => clearTimeout( timer );
		}
	}, [ isSaved ] );

	// (moved condition/comparison helpers to ./logic).

	// Fetch field configuration and current values.
	useEffect( () => {
		const fetchData = async () => {
			try {
				const fieldConfig = await getFields( restUrl, panelId, nonce );
				setFields( fieldConfig );

				const currentValues = await getOptions( restUrl, panelId, nonce );

				// Process values to ensure proper types for multi-check fields.
				const processedValues = {};
				Object.keys( currentValues ).forEach( ( key ) => {
					const field = fieldConfig.find( ( f ) => f.name === key );
					let value = currentValues[ key ];

					// Ensure multi-check fields are always arrays.
					if ( field && field.type === 'multi-check' ) {
						if ( ! Array.isArray( value ) ) {
							value = [];
						} else {
							// Filter out invalid values that don't exist in available choices.
							const validChoices = ( field.choices || [] ).map(
								( choice ) => choice.value
							);
							value = value.filter( ( val ) => validChoices.includes( val ) );

							// Log removed invalid values for debugging.
							const invalidValues = ( currentValues[ key ] || [] ).filter(
								( val ) => ! validChoices.includes( val )
							);
							if ( invalidValues.length > 0 ) {
								console.warn(
									`Multi-check field "${ key }" had invalid values removed:`,
									invalidValues,
									'Available choices:',
									validChoices
								);
							}
						}
					}

					processedValues[ key ] = value;
				} );

				setValues( processedValues );
				setOriginalValues( processedValues ); // Set original values on load.
			} catch ( error ) {
				setNotice( {
					type: 'error',
					message: messages.loadError,
				} );
				onError?.( error );
			} finally {
				setIsLoading( false );
			}
		};

		fetchData();
	}, [ restUrl, nonce, messages.loadError, onError, panelId ] );

	const handleFieldChange = ( fieldName, value ) => {
		// Find the field configuration to check if it's a multi-check field.
		const field = fields.find( ( f ) => f.name === fieldName );

		// Ensure multi-check fields always get array values.
		let processedValue = value;
		if ( field && field.type === 'multi-check' ) {
			// Convert null/undefined/empty string to empty array.
			if ( value === null || value === undefined || value === '' ) {
				processedValue = [];
			} else if ( ! Array.isArray( value ) ) {
				// This should never happen now, but log for debugging.
				console.error(
					`Multi-check field "${ fieldName }" received non-array value:`,
					value
				);
				processedValue = [];
			} else {
				// Filter out invalid values that don't exist in available choices
				const validChoices = ( field.choices || [] ).map( ( choice ) => choice.value );
				processedValue = value.filter( ( val ) => validChoices.includes( val ) );

				// Log removed invalid values for debugging
				const invalidValues = value.filter( ( val ) => ! validChoices.includes( val ) );
				if ( invalidValues.length > 0 ) {
					console.warn(
						`Multi-check field "${ fieldName }" had invalid values removed:`,
						invalidValues,
						'Available choices:',
						validChoices
					);
				}
			}
		}

		setValues( ( prev ) => ( {
			...prev,
			[ fieldName ]: processedValue,
		} ) );
	};

	const handleSave = async () => {
		setIsSaving( true );
		setNotice( null ); // Clear any existing notices.

		try {
			const savedValues = await saveOptions( restUrl, panelId, nonce, values );
			setOriginalValues( savedValues );
			setValues( savedValues );
			setHasChanges( false );
			setIsSaving( false );
			setIsSaved( true ); // Show saved state.

			onSave?.( savedValues );
		} catch ( error ) {
			setIsSaving( false );
			setNotice( {
				type: 'error',
				message: messages.saveError,
			} );
			onError?.( error );
		}
	};

	// Handle toggle animation.
	const handleToggleClick = () => {
		if ( isToggleAnimating ) {
			return; // Prevent multiple clicks during animation.
		}

		setIsToggleAnimating( true );
		const newExpandedState = ! isToggleExpanded;
		setIsToggleExpanded( newExpandedState );

		// Clear notice when closing the panel.
		if ( ! newExpandedState && notice ) {
			setNotice( null );
		}

		// Reset animation state after transition completes.
		setTimeout( () => {
			setIsToggleAnimating( false );
		}, 300 ); // Match CSS transition duration.
	};

	// Get save button content based on state.
	const getSaveButtonContent = () => {
		if ( isSaving ) {
			return (
				<>
					<Icon name="settings" className="optify-save-icon optify-save-icon--spinning" />
					{ savingText }
				</>
			);
		}

		if ( isSaved ) {
			return (
				<>
					<Icon name="check" className="optify-save-icon optify-save-icon--success" />
					{ __( 'Saved', 'optify' ) }
				</>
			);
		}

		return saveButtonText;
	};

	// Field renderer moved to ./field-renderer.

	// Render panel title component.
	const renderPanelTitle = () => {
		if ( ! showTitle ) {
			return null;
		}

		// Show title in inline mode.
		// Show title in toggle mode when expanded.
		// Don't show title in modal mode (no title outside form content).
		if ( display === 'modal' ) {
			return null;
		}

		// In toggle mode, only show title when expanded.
		if ( display === 'toggle' && ! isToggleExpanded ) {
			return null;
		}

		return (
			<div className="optify-panel-title">
				<h2>{ panelTitle }</h2>
			</div>
		);
	};

	if ( isLoading ) {
		return <div className="optify-loading">{ loadingText }</div>;
	}

	// Render modal button if display is modal.
	if ( display === 'modal' ) {
		return (
			<div className="optify-options-panel optify-options-panel--modal">
				{ /* Modal Button. */ }
				<div className="optify-modal-container">
					<Button
						variant="secondary"
						className="optify-modal-button"
						onClick={ () => setIsModalOpen( true ) }
						aria-label={ __( 'Open settings', 'optify' ) }
					>
						<Icon name="settings" className="optify-modal-icon" />
					</Button>
				</div>

				{ /* Modal Content. */ }
				{ isModalOpen && (
					<Modal
						title={ showTitle ? panelTitle : '' }
						onRequestClose={ () => setIsModalOpen( false ) }
						className="optify-modal"
					>
						{ /* Only show error notices. */ }
						{ notice && notice.type === 'error' && (
							<Notice status={ notice.type } onRemove={ () => setNotice( null ) }>
								{ notice.message }
							</Notice>
						) }

						<Panel>
							<PanelBody>
								{ renderPanelTitle() }
								{ fields.map( ( field ) => {
									// Check if field should be visible based on conditions
									if ( ! isFieldVisible( field, values, fields ) ) {
										return null; // Don't render hidden fields
									}

									return (
										<PanelRow key={ field.name }>
											{ renderField(
												field,
												values[ field.name ] !== undefined
													? values[ field.name ]
													: field.default,
												handleFieldChange
											) }
										</PanelRow>
									);
								} ) }
							</PanelBody>
						</Panel>

						<div className="optify-actions">
							<Button
								variant="primary"
								className={ `optify-save-button ${
									isSaving ? 'optify-save-button--saving' : ''
								} ${ isSaved ? 'optify-save-button--saved' : '' }` }
								onClick={ handleSave }
								disabled={ isSaving || ! hasChanges }
							>
								{ getSaveButtonContent() }
							</Button>

							{ /* Manual close button. */ }
							<Button
								variant="secondary"
								onClick={ () => setIsModalOpen( false ) }
								disabled={ isSaving }
							>
								{ __( 'Close', 'optify' ) }
							</Button>
						</div>
					</Modal>
				) }
			</div>
		);
	}

	// Render toggle icon if display is toggle.
	if ( display === 'toggle' ) {
		return (
			<div className="optify-options-panel optify-options-panel--toggle">
				{ /* Toggle Icon. */ }
				<div className="optify-toggle-container">
					<Button
						variant="secondary"
						className="optify-toggle-button"
						onClick={ handleToggleClick }
						aria-label={
							isToggleExpanded
								? __( 'Hide settings', 'optify' )
								: __( 'Show settings', 'optify' )
						}
					>
						<Icon
							name="settings"
							className={ `optify-toggle-icon ${
								isToggleExpanded ? 'optify-toggle-icon--expanded' : ''
							}` }
						/>
					</Button>
				</div>

				{ /* Expandable Content. */ }
				<div
					className={ `optify-panel-content ${
						! isToggleExpanded ? 'optify-panel-content--collapsed' : ''
					}` }
				>
					{ /* Only show error notices when panel is expanded. */ }
					{ isToggleExpanded && notice && notice.type === 'error' && (
						<Notice status={ notice.type } onRemove={ () => setNotice( null ) }>
							{ notice.message }
						</Notice>
					) }

					<Panel>
						<PanelBody>
							{ renderPanelTitle() }
							{ fields.map( ( field ) => {
								// Check if field should be visible based on conditions
								if ( ! isFieldVisible( field, values, fields ) ) {
									return null; // Don't render hidden fields
								}

								return (
									<PanelRow key={ field.name }>
										{ renderField(
											field,
											values[ field.name ] !== undefined
												? values[ field.name ]
												: field.default,
											handleFieldChange
										) }
									</PanelRow>
								);
							} ) }
						</PanelBody>
					</Panel>
					<div className="optify-actions">
						<Button
							variant="primary"
							className={ `optify-save-button ${
								isSaving ? 'optify-save-button--saving' : ''
							} ${ isSaved ? 'optify-save-button--saved' : '' }` }
							onClick={ handleSave }
							disabled={ isSaving || ! hasChanges }
						>
							{ getSaveButtonContent() }
						</Button>

						{ /* Manual close button. */ }
						<Button
							variant="secondary"
							onClick={ handleToggleClick }
							disabled={ isSaving }
						>
							{ __( 'Close', 'optify' ) }
						</Button>
					</div>
				</div>
			</div>
		);
	}

	// Default render (when display is 'inline').
	return (
		<div className="optify-options-panel">
			{ /* Only show error notices */ }
			{ notice && notice.type === 'error' && (
				<Notice status={ notice.type } onRemove={ () => setNotice( null ) }>
					{ notice.message }
				</Notice>
			) }
			<Panel>
				<PanelBody>
					{ renderPanelTitle() }
					{ fields.map( ( field ) => {
						// Check if field should be visible based on conditions
						if ( ! isFieldVisible( field, values, fields ) ) {
							return null; // Don't render hidden fields
						}

						return (
							<PanelRow key={ field.name }>
								{ renderField(
									field,
									values[ field.name ] !== undefined
										? values[ field.name ]
										: field.default,
									handleFieldChange
								) }
							</PanelRow>
						);
					} ) }
				</PanelBody>
			</Panel>
			<div className="optify-actions">
				<Button
					variant="primary"
					className={ `optify-save-button ${
						isSaving ? 'optify-save-button--saving' : ''
					} ${ isSaved ? 'optify-save-button--saved' : '' }` }
					onClick={ handleSave }
					disabled={ isSaving || ! hasChanges }
				>
					{ getSaveButtonContent() }
				</Button>
			</div>
		</div>
	);
};

export default OptionsPanel;
