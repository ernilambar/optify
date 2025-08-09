import React from 'react';
import {
	TextControl,
	CheckboxControl,
	SelectControl,
	ToggleControl,
	Button,
	ButtonGroup,
	Notice,
} from '@wordpress/components';
import SortableField from './sortable-field';
import { isNumberValueEqual } from './logic';

// Helper to extract valid HTML attributes from field.attributes.
const extractHtmlAttributes = ( fieldConfig ) => {
	const htmlAttributes = {};

	const attributesSource = fieldConfig?.attributes;
	if ( ! attributesSource || typeof attributesSource !== 'object' ) {
		return htmlAttributes;
	}

	const validHtmlAttributes = [
		'placeholder',
		'readonly',
		'disabled',
		'required',
		'maxlength',
		'minlength',
		'pattern',
		'autocomplete',
		'autofocus',
		'form',
		'list',
		'multiple',
		'name',
		'size',
		'step',
		'type',
		'value',
		'accept',
		'alt',
		'checked',
		'dirname',
		'formaction',
		'formenctype',
		'formmethod',
		'formnovalidate',
		'formtarget',
		'height',
		'max',
		'min',
		'src',
		'width',
		'rel',
		'target',
		'aria-label',
		'aria-describedby',
		'aria-required',
		'aria-invalid',
		'data-*',
	];

	Object.keys( attributesSource ).forEach( ( key ) => {
		if ( key.startsWith( 'data-' ) ) {
			htmlAttributes[ key ] = attributesSource[ key ];
		} else if ( key.startsWith( 'aria-' ) ) {
			htmlAttributes[ key ] = attributesSource[ key ];
		} else if ( validHtmlAttributes.includes( key ) ) {
			htmlAttributes[ key ] = attributesSource[ key ];
		}
	} );

	return htmlAttributes;
};

// Single export: render a field by type.
const renderField = ( field, value, onChange ) => {
	const { name, label, type, choices = [], description } = field;

	const renderDescription = () => {
		if ( ! description ) {
			return null;
		}
		return <div className="optify-field-description">{ description }</div>;
	};

	switch ( type ) {
		case 'text': {
			const textHtmlAttributes = extractHtmlAttributes( field );
			return (
				<div className="optify-field optify-field-type-text">
					<label className="optify-field-label">{ label }</label>
					{ renderDescription() }
					<input
						type="text"
						value={ value }
						onChange={ ( e ) => onChange( name, e.target.value ) }
						className="optify-field-input"
						{ ...textHtmlAttributes }
					/>
				</div>
			);
		}
		case 'email': {
			const emailHtmlAttributes = extractHtmlAttributes( field );
			return (
				<div className="optify-field optify-field-type-email">
					<label className="optify-field-label">{ label }</label>
					{ renderDescription() }
					<input
						type="email"
						value={ value }
						onChange={ ( e ) => onChange( name, e.target.value ) }
						className="optify-field-input"
						{ ...emailHtmlAttributes }
					/>
				</div>
			);
		}
		case 'url': {
			const urlHtmlAttributes = extractHtmlAttributes( field );
			return (
				<div className="optify-field optify-field-type-url">
					<label className="optify-field-label">{ label }</label>
					{ renderDescription() }
					<TextControl
						label=""
						type="url"
						value={ value }
						onChange={ ( newValue ) => onChange( name, newValue ) }
						{ ...urlHtmlAttributes }
					/>
				</div>
			);
		}
		case 'number': {
			const numberHtmlAttributes = extractHtmlAttributes( field );
			return (
				<div className="optify-field optify-field-type-number">
					<label className="optify-field-label">{ label }</label>
					{ renderDescription() }
					<input
						type="number"
						value={ value }
						onChange={ ( e ) => onChange( name, e.target.value ) }
						className="optify-field-input"
						{ ...numberHtmlAttributes }
					/>
					{ ( choices || [] ).length > 0 && (
						<div className="optify-field-quick-select">
							<span className="optify-field-quick-select-label">Quick select:</span>
							<ButtonGroup>
								{ ( choices || [] ).map( ( choice ) => (
									<Button
										key={ choice.value }
										variant={
											isNumberValueEqual( value, choice.value )
												? 'primary'
												: 'secondary'
										}
										size="small"
										onClick={ () => onChange( name, choice.value ) }
									>
										{ choice.label }
									</Button>
								) ) }
							</ButtonGroup>
						</div>
					) }
				</div>
			);
		}
		case 'password': {
			const passwordHtmlAttributes = extractHtmlAttributes( field );
			return (
				<div className="optify-field optify-field-type-password">
					<label className="optify-field-label">{ label }</label>
					{ renderDescription() }
					<TextControl
						label=""
						type="password"
						value={ value }
						onChange={ ( newValue ) => onChange( name, newValue ) }
						{ ...passwordHtmlAttributes }
					/>
				</div>
			);
		}
		case 'textarea': {
			const textareaHtmlAttributes = extractHtmlAttributes( field );
			return (
				<div className="optify-field optify-field-type-textarea">
					<label className="optify-field-label">{ label }</label>
					{ renderDescription() }
					<textarea
						value={ value }
						onChange={ ( e ) => onChange( name, e.target.value ) }
						className="optify-field-textarea"
						{ ...textareaHtmlAttributes }
					/>
				</div>
			);
		}
		case 'radio': {
			const radioSettings = {
				layout: 'vertical',
				size: 'medium',
				style: 'default',
				spacing: 'normal',
				...field.settings,
			};
			const radioHtmlAttributes = extractHtmlAttributes( field );
			const radioGroupClass = `optify-field-radio-group optify-field-radio-group--${
				radioSettings.layout
			}${ radioSettings.spacing === 'tight' ? ' optify-field-radio-group--tight' : '' }`;
			return (
				<div className="optify-field optify-field-type-radio">
					<label className="optify-field-label">{ label }</label>
					{ renderDescription() }
					<div className={ radioGroupClass }>
						{ ( choices || [] ).map( ( choice ) => (
							<label key={ choice.value } className="optify-field-radio-option">
								<input
									type="radio"
									name={ name }
									value={ choice.value }
									checked={ value === choice.value }
									onChange={ ( e ) => onChange( name, e.target.value ) }
									{ ...radioHtmlAttributes }
								/>
								{ choice.label }
							</label>
						) ) }
					</div>
				</div>
			);
		}
		case 'checkbox': {
			const checkboxHtmlAttributes = extractHtmlAttributes( field );
			return (
				<div className="optify-field optify-field-type-checkbox">
					<label className="optify-field-label">{ label }</label>
					{ renderDescription() }
					<CheckboxControl
						label=""
						checked={ value }
						onChange={ ( newValue ) => onChange( name, newValue ) }
						{ ...checkboxHtmlAttributes }
					/>
				</div>
			);
		}
		case 'select': {
			const selectHtmlAttributes = extractHtmlAttributes( field );
			return (
				<div className="optify-field optify-field-type-select">
					<label className="optify-field-label">{ label }</label>
					{ renderDescription() }
					<SelectControl
						label=""
						value={ value }
						options={ choices || [] }
						onChange={ ( newValue ) => onChange( name, newValue ) }
						{ ...selectHtmlAttributes }
					/>
				</div>
			);
		}
		case 'toggle': {
			const toggleHtmlAttributes = extractHtmlAttributes( field );
			return (
				<div className="optify-field optify-field-type-toggle">
					<label className="optify-field-label">{ label }</label>
					{ renderDescription() }
					<ToggleControl
						label=""
						checked={ !! value }
						onChange={ ( newValue ) => onChange( name, newValue ) }
						{ ...toggleHtmlAttributes }
					/>
				</div>
			);
		}
		case 'multi-check': {
			const multiCheckSettings = {
				layout: 'vertical',
				size: 'medium',
				style: 'default',
				spacing: 'normal',
				...field.settings,
			};
			const multiCheckHtmlAttributes = extractHtmlAttributes( field );
			const multiCheckGroupClass = `optify-field-multi-check-group optify-field-multi-check-group--${
				multiCheckSettings.layout
			}${
				multiCheckSettings.spacing === 'tight'
					? ' optify-field-multi-check-group--tight'
					: ''
			}`;
			const multiCheckValue = Array.isArray( value ) ? value : field.default || [];
			const validChoices = ( choices || [] ).map( ( choice ) => choice.value );
			const filteredValue = multiCheckValue.filter( ( val ) => validChoices.includes( val ) );

			if ( process.env.NODE_ENV === 'development' ) {
				// eslint-disable-next-line no-console
				console.log(
					`Multi-check field "${ name }" value:`,
					value,
					'processed as:',
					filteredValue
				);
			}

			return (
				<div className="optify-field optify-field-type-multi-check">
					<span className="optify-field-label">{ label }</span>
					{ renderDescription() }
					<div className={ multiCheckGroupClass }>
						{ ( choices || [] ).map( ( choice ) => (
							<label key={ choice.value } className="optify-field-multi-check-option">
								<input
									type="checkbox"
									value={ choice.value }
									checked={ filteredValue.includes( choice.value ) }
									onChange={ ( e ) => {
										let newValue = [ ...filteredValue ];
										if ( e.target.checked ) {
											newValue.push( choice.value );
										} else {
											newValue = newValue.filter(
												( v ) => v !== choice.value
											);
										}
										onChange( name, newValue );
									} }
									{ ...multiCheckHtmlAttributes }
								/>
								{ choice.label }
							</label>
						) ) }
					</div>
				</div>
			);
		}
		case 'buttonset': {
			return (
				<div className="optify-field optify-field-type-buttonset">
					<span className="optify-field-label">{ label }</span>
					{ renderDescription() }
					<ButtonGroup>
						{ ( choices || [] ).map( ( choice ) => (
							<Button
								key={ choice.value }
								variant={ value === choice.value ? 'primary' : 'secondary' }
								onClick={ () => onChange( name, choice.value ) }
							>
								{ choice.label }
							</Button>
						) ) }
					</ButtonGroup>
				</div>
			);
		}
		case 'sortable': {
			return (
				<div className="optify-field optify-field-type-sortable">
					<label className="optify-field-label">{ label }</label>
					{ renderDescription() }
					<SortableField
						label=""
						value={ Array.isArray( value ) ? value : field.default || [] }
						choices={ choices || [] }
						onChange={ ( newValue ) => onChange( name, newValue ) }
						settings={ field.settings || {} }
					/>
				</div>
			);
		}
		case 'heading': {
			return (
				<div className="optify-field optify-field-type-heading">
					<h3 className="optify-field-heading">{ label }</h3>
					{ renderDescription() }
				</div>
			);
		}
		case 'message': {
			const messageStatus = field.status || 'info';
			if ( messageStatus === 'description' ) {
				return (
					<div className="optify-field optify-field-type-message">
						<div className="optify-field-message">{ label }</div>
						{ renderDescription() }
					</div>
				);
			}
			return (
				<div className="optify-field optify-field-type-message">
					<Notice status={ messageStatus } isDismissible={ false }>
						{ label }
					</Notice>
					{ renderDescription() }
				</div>
			);
		}
		default:
			return null;
	}
};

export default renderField;
