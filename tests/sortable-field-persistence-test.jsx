import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SortableField from '../resources/js/sortable-field';

// Mock the WordPress components
jest.mock( '@wordpress/components', () => ( {
	ToggleControl: ( { checked, onChange, label } ) => (
		<label>
			<input
				type="checkbox"
				checked={ checked }
				onChange={ ( e ) => onChange( e.target.checked ) }
			/>
			{ label }
		</label>
	),
} ) );

// Mock the drag and drop library
jest.mock( '@hello-pangea/dnd', () => ( {
	DragDropContext: ( { children, onDragEnd } ) => (
		<div data-testid="drag-drop-context" onDragEnd={ onDragEnd }>
			{ children }
		</div>
	),
	Droppable: ( { children, droppableId } ) => (
		<div data-testid={ `droppable-${ droppableId }` }>
			{ children( { provided: {}, snapshot: { isDraggingOver: false } } ) }
		</div>
	),
	Draggable: ( { children, draggableId, index } ) => (
		<div data-testid={ `draggable-${ draggableId }` } data-index={ index }>
			{ children( { provided: {}, snapshot: { isDragging: false } } ) }
		</div>
	),
} ) );

describe( 'SortableField Persistence', () => {
	const mockChoices = [
		{ value: 'item1', label: 'Item 1' },
		{ value: 'item2', label: 'Item 2' },
		{ value: 'item3', label: 'Item 3' },
		{ value: 'item4', label: 'Item 4' },
	];

	const mockOnChange = jest.fn();

	beforeEach( () => {
		mockOnChange.mockClear();
	} );

	it( 'maintains order after drag and drop operations', () => {
		const { rerender } = render(
			<SortableField
				label="Test Sortable"
				value={ [ 'item1', 'item2', 'item3' ] }
				choices={ mockChoices }
				onChange={ mockOnChange }
			/>
		);

		// Clear initial call
		mockOnChange.mockClear();

		// Simulate drag and drop (move item3 to first position)
		const dragDropContext = screen.getByTestId( 'drag-drop-context' );
		fireEvent.dragEnd( dragDropContext, {
			source: { index: 2 },
			destination: { index: 0 },
		} );

		// Should call onChange with reordered items
		expect( mockOnChange ).toHaveBeenCalledWith( [ 'item3', 'item1', 'item2' ] );

		// Re-render with the new value from parent
		rerender(
			<SortableField
				label="Test Sortable"
				value={ [ 'item3', 'item1', 'item2' ] }
				choices={ mockChoices }
				onChange={ mockOnChange }
			/>
		);

		// Should not call onChange again since value matches
		expect( mockOnChange ).toHaveBeenCalledTimes( 1 );
	} );

	it( 'maintains enabled/disabled state after toggle operations', () => {
		const { rerender } = render(
			<SortableField
				label="Test Sortable"
				value={ [ 'item1', 'item2' ] }
				choices={ mockChoices }
				onChange={ mockOnChange }
			/>
		);

		// Clear initial call
		mockOnChange.mockClear();

		// Simulate disabling item2
		const checkboxes = screen.getAllByRole( 'checkbox' );
		const item2Checkbox = checkboxes.find( ( checkbox ) =>
			checkbox.closest( 'label' ).textContent.includes( 'Item 2' )
		);

		if ( item2Checkbox ) {
			fireEvent.click( item2Checkbox );
		}

		// Should call onChange with item2 removed
		expect( mockOnChange ).toHaveBeenCalledWith( [ 'item1' ] );

		// Re-render with the new value from parent
		rerender(
			<SortableField
				label="Test Sortable"
				value={ [ 'item1' ] }
				choices={ mockChoices }
				onChange={ mockOnChange }
			/>
		);

		// Should not call onChange again since value matches
		expect( mockOnChange ).toHaveBeenCalledTimes( 1 );
	} );

	it( 'does not reset to original state after parent updates', () => {
		const { rerender } = render(
			<SortableField
				label="Test Sortable"
				value={ [ 'item1', 'item2', 'item3' ] }
				choices={ mockChoices }
				onChange={ mockOnChange }
			/>
		);

		// Clear initial call
		mockOnChange.mockClear();

		// Simulate drag and drop
		const dragDropContext = screen.getByTestId( 'drag-drop-context' );
		fireEvent.dragEnd( dragDropContext, {
			source: { index: 0 },
			destination: { index: 2 },
		} );

		// Should call onChange with reordered items
		expect( mockOnChange ).toHaveBeenCalledWith( [ 'item2', 'item3', 'item1' ] );

		// Simulate parent component updating with the new value
		rerender(
			<SortableField
				label="Test Sortable"
				value={ [ 'item2', 'item3', 'item1' ] }
				choices={ mockChoices }
				onChange={ mockOnChange }
			/>
		);

		// The component should maintain the new order and not reset
		// We can verify this by checking that onChange is not called again
		expect( mockOnChange ).toHaveBeenCalledTimes( 1 );
	} );
} );
