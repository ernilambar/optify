import React, { useState, useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import {
	Panel,
	PanelBody,
	PanelRow,
	TextControl,
	RadioControl,
	CheckboxControl,
	SelectControl,
	Button,
	Notice,
	TextareaControl,
	ToggleControl,
	ButtonGroup,
} from '@wordpress/components';

const OptionsPanel = ( { config, restUrl, nonce, panelId, onSave, onError, underCog = false } ) => {
	const [ fields, setFields ] = useState( [] );
	const [ values, setValues ] = useState( {} );
	const [ originalValues, setOriginalValues ] = useState( {} );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ notice, setNotice ] = useState( null );
	const [ hasChanges, setHasChanges ] = useState( false );
	const [ isCogExpanded, setIsCogExpanded ] = useState( ! underCog );

	const { panelTitle, saveButtonText, savingText, loadingText, messages } = config;

	// Check if values have changed
	useEffect( () => {
		const changed = Object.keys( values ).some( ( key ) => {
			return values[ key ] !== originalValues[ key ];
		} );
		setHasChanges( changed );
	}, [ values, originalValues ] );

	// Fetch field configuration and current values
	useEffect( () => {
		const fetchData = async () => {
			try {
				// Use simplified REST API structure (panel ID only)
				const fieldsEndpoint = `fields/${ panelId }`;
				const optionsEndpoint = `options/${ panelId }`;

				// Fetch field configuration
				const fieldsResponse = await fetch( `${ restUrl }${ fieldsEndpoint }`, {
					headers: {
						'X-WP-Nonce': nonce,
						'Content-Type': 'application/json',
					},
				} );

				if ( ! fieldsResponse.ok ) {
					throw new Error( `Failed to fetch fields: ${ fieldsResponse.status }` );
				}

				const fieldsData = await fieldsResponse.json();
				const fieldConfig = fieldsData.data || [];
				setFields( fieldConfig );

				// Fetch current values
				const valuesResponse = await fetch( `${ restUrl }${ optionsEndpoint }`, {
					headers: {
						'X-WP-Nonce': nonce,
						'Content-Type': 'application/json',
					},
				} );

				if ( ! valuesResponse.ok ) {
					throw new Error( `Failed to fetch values: ${ valuesResponse.status }` );
				}

				const valuesData = await valuesResponse.json();
				const currentValues = valuesData.data || {};
				setValues( currentValues );
				setOriginalValues( currentValues ); // Set original values on load
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
		setValues( ( prev ) => ( {
			...prev,
			[ fieldName ]: value,
		} ) );
	};

	const handleSave = async () => {
		setIsSaving( true );
		try {
			// Use simplified REST API structure (panel ID only)
			const optionsEndpoint = `options/${ panelId }`;

			const response = await fetch( `${ restUrl }${ optionsEndpoint }`, {
				method: 'POST',
				headers: {
					'X-WP-Nonce': nonce,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( { values } ),
			} );

			const data = await response.json();

			if ( ! response.ok ) {
				throw new Error( data.message || `Failed to save: ${ response.status }` );
			}

			// Update original values with saved data
			const savedValues = data.data?.values || values;
			setOriginalValues( savedValues );
			setValues( savedValues );
			setHasChanges( false ); // Reset hasChanges after save

			setNotice( {
				type: 'success',
				message: messages.saveSuccess,
			} );

			onSave?.( savedValues );

			// Auto-close on successful save when underCog is enabled
			if ( underCog ) {
				// Small delay to show success message before closing
				setTimeout( () => {
					setIsCogExpanded( false );
					setNotice( null ); // Clear the notice when closing
				}, 1000 );
			}
		} catch ( error ) {
			setNotice( {
				type: 'error',
				message: messages.saveError,
			} );
			onError?.( error );
			// Keep open on error so user can fix and retry
		} finally {
			setIsSaving( false );
		}
	};

	// Render field based on type
	const renderField = ( field, value, handleFieldChange ) => {
		const { name, label, type, choices = [] } = field;

		// Extract all custom properties (anything beyond the core field properties)
		const customProps = { ...field };
		delete customProps.name;
		delete customProps.label;
		delete customProps.type;
		delete customProps.choices;
		delete customProps.default;
		delete customProps.required;

		// Helper function to get custom property with default
		const getCustomProp = ( propName, defaultValue = null ) => {
			return customProps[ propName ] !== undefined ? customProps[ propName ] : defaultValue;
		};

		switch ( type ) {
			case 'text':
				const textSettings = {
					readonly: false,
					size: 'medium',
					...field.settings,
				};

				return (
					<div className="optify-field optify-field-type-text">
						<label className="optify-field-label">{ label }</label>
						<input
							type="text"
							value={ value }
							readOnly={ textSettings.readonly }
							onChange={ ( e ) => handleFieldChange( name, e.target.value ) }
							className="optify-field-input"
						/>
						{ ( choices || [] ).length > 0 && (
							<div className="optify-field-quick-select">
								<span className="optify-field-quick-select-label">
									Quick select:
								</span>
								<ButtonGroup>
									{ ( choices || [] ).map( ( choice ) => (
										<Button
											key={ choice.value }
											variant={
												value === choice.value ? 'primary' : 'secondary'
											}
											size="small"
											onClick={ () =>
												handleFieldChange( name, choice.value )
											}
										>
											{ choice.label }
										</Button>
									) ) }
								</ButtonGroup>
							</div>
						) }
					</div>
				);
			case 'email':
				const emailSettings = {
					size: 'medium',
					...field.settings,
				};

				return (
					<div className="optify-field optify-field-type-email">
						<label className="optify-field-label">{ label }</label>
						<input
							type="email"
							value={ value }
							onChange={ ( e ) => handleFieldChange( name, e.target.value ) }
							className="optify-field-input"
						/>
					</div>
				);
			case 'url':
				return (
					<div className="optify-field optify-field-type-url">
						<TextControl
							label={ label }
							type="url"
							value={ value }
							onChange={ ( newValue ) => handleFieldChange( name, newValue ) }
						/>
					</div>
				);
			case 'number':
				const numberSettings = {
					size: 'medium',
					...field.settings,
				};

				return (
					<div className="optify-field optify-field-type-number">
						<label className="optify-field-label">{ label }</label>
						<input
							type="number"
							value={ value }
							onChange={ ( e ) => handleFieldChange( name, e.target.value ) }
							className="optify-field-input"
						/>
						{ ( choices || [] ).length > 0 && (
							<div className="optify-field-quick-select">
								<span className="optify-field-quick-select-label">
									Quick select:
								</span>
								<ButtonGroup>
									{ ( choices || [] ).map( ( choice ) => (
										<Button
											key={ choice.value }
											variant={
												value === choice.value ? 'primary' : 'secondary'
											}
											size="small"
											onClick={ () =>
												handleFieldChange( name, choice.value )
											}
										>
											{ choice.label }
										</Button>
									) ) }
								</ButtonGroup>
							</div>
						) }
					</div>
				);
			case 'password':
				return (
					<div className="optify-field optify-field-type-url">
						<TextControl
							label={ label }
							type="password"
							value={ value }
							onChange={ ( newValue ) => handleFieldChange( name, newValue ) }
						/>
					</div>
				);
			case 'textarea':
				const textareaSettings = {
					readonly: false,
					size: 'medium',
					...field.settings,
				};

				return (
					<div className="optify-field optify-field-type-textarea">
						<label className="optify-field-label">{ label }</label>
						<textarea
							value={ value }
							readOnly={ textareaSettings.readonly }
							onChange={ ( e ) => handleFieldChange( name, e.target.value ) }
							className="optify-field-textarea"
						/>
					</div>
				);
			case 'radio':
				const radioSettings = {
					layout: 'vertical',
					size: 'medium',
					style: 'default',
					spacing: 'normal',
					...field.settings, // Merge any custom settings
				};

				const radioGroupClass = `optify-field-radio-group optify-field-radio-group--${
					radioSettings.layout
				}${ radioSettings.spacing === 'tight' ? ' optify-field-radio-group--tight' : '' }`;

				return (
					<div className="optify-field optify-field-type-radio">
						<label className="optify-field-label">{ label }</label>
						<div className={ radioGroupClass }>
							{ ( choices || [] ).map( ( choice ) => (
								<label key={ choice.value } className="optify-field-radio-option">
									<input
										type="radio"
										name={ name }
										value={ choice.value }
										checked={ value === choice.value }
										onChange={ ( e ) =>
											handleFieldChange( name, e.target.value )
										}
									/>
									{ choice.label }
								</label>
							) ) }
						</div>
					</div>
				);
			case 'checkbox':
				return (
					<div className="optify-field optify-field-type-checkbox">
						<CheckboxControl
							label={ label }
							checked={ value }
							onChange={ ( newValue ) => handleFieldChange( name, newValue ) }
						/>
					</div>
				);
			case 'select':
				return (
					<div className="optify-field optify-field-type-select">
						<SelectControl
							label={ label }
							value={ value }
							options={ choices || [] }
							onChange={ ( newValue ) => handleFieldChange( name, newValue ) }
						/>
					</div>
				);
			case 'toggle':
				return (
					<div className="optify-field optify-field-type-toggle">
						<ToggleControl
							label={ label }
							checked={ !! value }
							onChange={ ( newValue ) => handleFieldChange( name, newValue ) }
						/>
					</div>
				);
			case 'multi-check':
				const multiCheckSettings = {
					layout: 'vertical',
					size: 'medium',
					style: 'default',
					spacing: 'normal',
					...field.settings,
				};

				const multiCheckGroupClass = `optify-field-multi-check-group optify-field-multi-check-group--${
					multiCheckSettings.layout
				}${
					multiCheckSettings.spacing === 'tight'
						? ' optify-field-multi-check-group--tight'
						: ''
				}`;

				return (
					<div className="optify-field optify-field-type-multi-check">
						<span className="optify-field-label">{ label }</span>
						<div className={ multiCheckGroupClass }>
							{ ( choices || [] ).map( ( choice ) => (
								<label
									key={ choice.value }
									className="optify-field-multi-check-option"
								>
									<input
										type="checkbox"
										value={ choice.value }
										checked={
											Array.isArray( value )
												? value.includes( choice.value )
												: false
										}
										onChange={ ( e ) => {
											let newValue = Array.isArray( value )
												? [ ...value ]
												: [];
											if ( e.target.checked ) {
												newValue.push( choice.value );
											} else {
												newValue = newValue.filter(
													( v ) => v !== choice.value
												);
											}
											handleFieldChange( name, newValue );
										} }
									/>
									{ choice.label }
								</label>
							) ) }
						</div>
					</div>
				);
			case 'buttonset':
				return (
					<div className="optify-field optify-field-type-buttonset">
						<span className="optify-field-label">{ label }</span>
						<ButtonGroup>
							{ ( choices || [] ).map( ( choice ) => (
								<Button
									key={ choice.value }
									variant={ value === choice.value ? 'primary' : 'secondary' }
									onClick={ () => handleFieldChange( name, choice.value ) }
								>
									{ choice.label }
								</Button>
							) ) }
						</ButtonGroup>
					</div>
				);
			case 'heading':
				return (
					<div className="optify-field optify-field-type-heading">
						<h3 className="optify-field-heading">{ label }</h3>
					</div>
				);
			case 'message':
				const messageStatus = field.status || 'info';
				if ( messageStatus === 'description' ) {
					return (
						<div className="optify-field optify-field-type-message">
							<div className="optify-field-message">{ label }</div>
						</div>
					);
				}
				return (
					<div className="optify-field optify-field-type-message">
						<Notice status={ messageStatus } isDismissible={ false }>
							{ label }
						</Notice>
					</div>
				);
			default:
				return null;
		}
	};

	if ( isLoading ) {
		return <div className="optify-loading">{ loadingText }</div>;
	}

	// Render cog icon if underCog is true
	if ( underCog ) {
		return (
			<div className="optify-options-panel optify-options-panel--under-cog">
				{ notice && (
					<Notice status={ notice.type } onRemove={ () => setNotice( null ) }>
						{ notice.message }
					</Notice>
				) }

				{ /* Cog Icon */ }
				<div className="optify-cog-container">
					<Button
						variant="secondary"
						className="optify-cog-button"
						onClick={ () => setIsCogExpanded( ! isCogExpanded ) }
						aria-label={
							isCogExpanded
								? __( 'Hide settings', 'optify' )
								: __( 'Show settings', 'optify' )
						}
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="currentColor"
							className={ `optify-cog-icon ${
								isCogExpanded ? 'optify-cog-icon--expanded' : ''
							}` }
						>
							<path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5A3.5 3.5 0 0 1 15.5 12A3.5 3.5 0 0 1 12 15.5M19.43 12.97C19.47 12.65 19.5 12.33 19.5 12C19.5 11.67 19.47 11.34 19.43 11L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.96 19.05 5.05L16.56 6.05C16.04 5.66 15.5 5.32 14.87 5.07L14.5 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.5 2.42L9.13 5.07C8.5 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.73 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.22 8.95 2.27 9.22 2.46 9.37L4.57 11C4.53 11.34 4.5 11.67 4.5 12C4.5 12.33 4.53 12.65 4.57 12.97L2.46 14.63C2.27 14.78 2.22 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.04 4.95 18.95L7.44 17.95C7.96 18.34 8.5 18.68 9.13 18.93L9.5 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.5 21.58L14.87 18.93C15.5 18.68 16.04 18.34 16.56 17.95L19.05 18.95C19.27 19.04 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.97Z" />
						</svg>
					</Button>
				</div>

				{ /* Expandable Content */ }
				{ isCogExpanded && (
					<div className="optify-panel-content">
						<Panel>
							<PanelBody>
								{ fields.map( ( field ) => (
									<PanelRow key={ field.name }>
										{ renderField(
											field,
											values[ field.name ],
											handleFieldChange
										) }
									</PanelRow>
								) ) }
							</PanelBody>
						</Panel>
						<div className="optify-actions">
							<Button
								variant="primary"
								isBusy={ isSaving }
								onClick={ handleSave }
								disabled={ isSaving || ! hasChanges }
							>
								{ isSaving ? savingText : saveButtonText }
							</Button>

							{ /* Manual close button */ }
							<Button
								variant="secondary"
								onClick={ () => setIsCogExpanded( false ) }
								disabled={ isSaving }
							>
								{ __( 'Close', 'optify' ) }
							</Button>
						</div>
					</div>
				) }
			</div>
		);
	}

	// Default render (when underCog is false or not passed)
	return (
		<div className="optify-options-panel">
			{ notice && (
				<Notice status={ notice.type } onRemove={ () => setNotice( null ) }>
					{ notice.message }
				</Notice>
			) }
			<Panel>
				<PanelBody>
					{ fields.map( ( field ) => (
						<PanelRow key={ field.name }>
							{ renderField( field, values[ field.name ], handleFieldChange ) }
						</PanelRow>
					) ) }
				</PanelBody>
			</Panel>
			<div className="optify-actions">
				<Button
					variant="primary"
					isBusy={ isSaving }
					onClick={ handleSave }
					disabled={ isSaving || ! hasChanges }
				>
					{ isSaving ? savingText : saveButtonText }
				</Button>
			</div>
		</div>
	);
};

export default OptionsPanel;
