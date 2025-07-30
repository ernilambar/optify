import React, { useState, useEffect, useCallback, useRef } from 'react';
import { __ } from '@wordpress/i18n';
import { Button, ToggleControl } from '@wordpress/components';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const SortableField = ( { label, value = [], choices = [], onChange, settings = {} } ) => {
	const [ items, setItems ] = useState( [] );
	const [ pendingUpdate, setPendingUpdate ] = useState( null );
	const lastValueRef = useRef( value );

	// Initialize items from choices and current value - only on first load or when choices change
	useEffect( () => {
		const initialItems = choices.map( ( choice ) => ( {
			id: choice.value,
			label: choice.label,
			enabled: Array.isArray( value ) ? value.includes( choice.value ) : false,
		} ) );
		setItems( initialItems );
		lastValueRef.current = value;
	}, [ choices, value ] );

	// Handle pending updates after render
	useEffect( () => {
		if ( pendingUpdate ) {
			const enabledValues = pendingUpdate
				.filter( ( item ) => item.enabled )
				.map( ( item ) => item.id );

			// Only call onChange if the values have actually changed
			const hasChanged =
				JSON.stringify( enabledValues ) !== JSON.stringify( lastValueRef.current );

			if ( hasChanged ) {
				onChange( enabledValues );
				lastValueRef.current = enabledValues;
			}
			setPendingUpdate( null );
		}
	}, [ pendingUpdate, onChange ] );

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
			<label className="optify-field-label">{ label }</label>
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
													<div className="optify-sortable-item-controls">
														<ToggleControl
															checked={ item.enabled }
															onChange={ () =>
																toggleItemEnabled( item.id )
															}
															label={ __( 'Enable', 'optify' ) }
															className="optify-sortable-toggle"
														/>
													</div>
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
