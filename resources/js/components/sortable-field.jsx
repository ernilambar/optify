import React, { useState, useEffect, useCallback, useRef } from 'react';
import { __ } from '@wordpress/i18n';
import { Button, ToggleControl } from '@wordpress/components';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const SortableField = ( { label, value = [], choices = [], onChange, settings = {} } ) => {
	const [ items, setItems ] = useState( [] );
	const [ pendingUpdate, setPendingUpdate ] = useState( null );
	const lastValueRef = useRef( value );

	// Extract settings with defaults (handle both snake_case and camelCase)
	const showToggles =
		settings.show_toggles !== undefined
			? settings.show_toggles
			: settings.showToggles !== undefined
			? settings.showToggles
			: true;

	// Initialize items from choices and current value
	useEffect( () => {
		// Create items with enabled state
		const itemsWithState = choices.map( ( choice ) => ( {
			id: choice.value,
			label: choice.label,
			enabled: showToggles
				? Array.isArray( value )
					? value.includes( choice.value )
					: false
				: true, // All items enabled when toggles are disabled
		} ) );

		// Reorder items based on saved value order
		const reorderedItems = [];

		if ( showToggles ) {
			// With toggles: First, add enabled items in the order they appear in the saved value
			if ( Array.isArray( value ) ) {
				value.forEach( ( savedValue ) => {
					const item = itemsWithState.find( ( item ) => item.id === savedValue );
					if ( item ) {
						reorderedItems.push( item );
					}
				} );
			}

			// Then, add disabled items that weren't in the saved value
			itemsWithState.forEach( ( item ) => {
				if ( ! item.enabled ) {
					reorderedItems.push( item );
				}
			} );
		} else {
			// Without toggles: Use saved order or default to choice order
			if ( Array.isArray( value ) && value.length > 0 ) {
				// Use saved order
				value.forEach( ( savedValue ) => {
					const item = itemsWithState.find( ( item ) => item.id === savedValue );
					if ( item ) {
						reorderedItems.push( item );
					}
				} );

				// Add any remaining items that weren't in the saved value
				itemsWithState.forEach( ( item ) => {
					if ( ! value.includes( item.id ) ) {
						reorderedItems.push( item );
					}
				} );
			} else {
				// No saved values, use original choice order
				reorderedItems.push( ...itemsWithState );
			}
		}

		setItems( reorderedItems );
		lastValueRef.current = value;
	}, [ choices, value, showToggles ] );

	// Sync items when value prop changes (e.g., from parent component)
	useEffect( () => {
		if ( items.length > 0 ) {
			const valueChanged = JSON.stringify( value ) !== JSON.stringify( lastValueRef.current );
			if ( valueChanged ) {
				// Reorder items based on new value order
				const reorderedItems = [];

				// First, add enabled items in the order they appear in the new value
				if ( Array.isArray( value ) ) {
					value.forEach( ( savedValue ) => {
						const item = items.find( ( item ) => item.id === savedValue );
						if ( item ) {
							reorderedItems.push( {
								...item,
								enabled: true,
							} );
						}
					} );
				}

				// Then, add disabled items that weren't in the new value
				items.forEach( ( item ) => {
					if ( ! Array.isArray( value ) || ! value.includes( item.id ) ) {
						reorderedItems.push( {
							...item,
							enabled: false,
						} );
					}
				} );

				setItems( reorderedItems );
				lastValueRef.current = value;
			}
		}
	}, [ value, items.length ] );

	// Handle pending updates after render
	useEffect( () => {
		if ( pendingUpdate ) {
			let valuesToSend;

			if ( showToggles ) {
				// With toggles: Send only enabled items
				valuesToSend = pendingUpdate
					.filter( ( item ) => item.enabled )
					.map( ( item ) => item.id );
			} else {
				// Without toggles: Send all items in current order
				valuesToSend = pendingUpdate.map( ( item ) => item.id );
			}

			// Only call onChange if the values have actually changed
			const hasChanged =
				JSON.stringify( valuesToSend ) !== JSON.stringify( lastValueRef.current );

			if ( hasChanged ) {
				onChange( valuesToSend );
				lastValueRef.current = valuesToSend;
			}
			setPendingUpdate( null );
		}
	}, [ pendingUpdate, onChange, showToggles ] );

	// Helper function to update parent with current enabled values
	const updateParentValue = useCallback( ( newItems ) => {
		setPendingUpdate( newItems );
	}, [] );

	const handleDragEnd = ( result ) => {
		if ( ! result.destination ) {
			return;
		}

		const newItems = Array.from( items );
		const [ reorderedItem ] = newItems.splice( result.source.index, 1 );
		newItems.splice( result.destination.index, 0, reorderedItem );

		setItems( newItems );
		updateParentValue( newItems );
	};

	const toggleItemEnabled = ( itemId ) => {
		setItems( ( prevItems ) => {
			const newItems = prevItems.map( ( item ) =>
				item.id === itemId ? { ...item, enabled: ! item.enabled } : item
			);
			updateParentValue( newItems );
			return newItems;
		} );
	};

	const getItemStyle = ( isDragging, draggableStyle ) => ( {
		userSelect: 'none',
		padding: '8px',
		margin: '0 0 8px 0',
		background: isDragging ? '#f0f0f0' : '#ffffff',
		border: '1px solid #ddd',
		borderRadius: '4px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		...draggableStyle,
	} );

	const getListStyle = ( isDraggingOver ) => ( {
		background: isDraggingOver ? '#f9f9f9' : 'transparent',
		padding: '8px',
		border: '1px solid #ddd',
		borderRadius: '4px',
		minHeight: '50px',
	} );

	return (
		<div className="optify-field optify-field-type-sortable">
			{ label && <label className="optify-field-label">{ label }</label> }
			<div className="optify-sortable-container">
				<DragDropContext onDragEnd={ handleDragEnd }>
					<Droppable droppableId="sortable-list">
						{ ( provided, snapshot ) => (
							<div
								{ ...provided.droppableProps }
								ref={ provided.innerRef }
								style={ getListStyle( snapshot.isDraggingOver ) }
								className="optify-sortable-list"
							>
								{ items.map( ( item, index ) => (
									<Draggable
										key={ item.id }
										draggableId={ item.id }
										index={ index }
									>
										{ ( provided, snapshot ) => (
											<div
												ref={ provided.innerRef }
												{ ...provided.draggableProps }
												{ ...provided.dragHandleProps }
												style={ getItemStyle(
													snapshot.isDragging,
													provided.draggableProps.style
												) }
												className={ `optify-sortable-item ${
													item.enabled ? 'enabled' : 'disabled'
												}` }
											>
												<div className="optify-sortable-item-content">
													<span className="optify-sortable-item-label">
														{ item.label }
													</span>
													{ showToggles && (
														<div className="optify-sortable-item-controls">
															<ToggleControl
																checked={ item.enabled }
																onChange={ () =>
																	toggleItemEnabled( item.id )
																}
																label=""
																className="optify-sortable-toggle"
															/>
														</div>
													) }
												</div>
											</div>
										) }
									</Draggable>
								) ) }
								{ provided.placeholder }
							</div>
						) }
					</Droppable>
				</DragDropContext>
				{ items.length === 0 && (
					<div className="optify-sortable-empty">
						{ __( 'No items available', 'optify' ) }
					</div>
				) }
			</div>
		</div>
	);
};

export default SortableField;
