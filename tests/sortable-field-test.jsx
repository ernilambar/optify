import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

describe( 'SortableField', () => {
	const mockChoices = [
		{ value: 'item1', label: 'Item 1' },
		{ value: 'item2', label: 'Item 2' },
		{ value: 'item3', label: 'Item 3' },
	];

	const mockOnChange = jest.fn();

	beforeEach( () => {
		mockOnChange.mockClear();
	} );

	it( 'renders without crashing', () => {
		render(
			<SortableField
				label="Test Sortable"
				value={ [] }
				choices={ mockChoices }
				onChange={ mockOnChange }
			/>
		);

		expect( screen.getByText( 'Test Sortable' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Item 1' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Item 2' ) ).toBeInTheDocument();
		expect( screen.getByText( 'Item 3' ) ).toBeInTheDocument();
	} );

	it( 'initializes with correct enabled state', () => {
		render(
			<SortableField
				label="Test Sortable"
				value={ [ 'item1', 'item3' ] }
				choices={ mockChoices }
				onChange={ mockOnChange }
			/>
		);

		// Should call onChange with enabled items after initialization
		expect( mockOnChange ).toHaveBeenCalledWith( [ 'item1', 'item3' ] );
	} );

	it( 'does not cause infinite re-renders', () => {
		const { rerender } = render(
			<SortableField
				label="Test Sortable"
				value={ [] }
				choices={ mockChoices }
				onChange={ mockOnChange }
			/>
		);

		// Clear the initial call
		mockOnChange.mockClear();

		// Re-render with same props
		rerender(
			<SortableField
				label="Test Sortable"
				value={ [] }
				choices={ mockChoices }
				onChange={ mockOnChange }
			/>
		);

		// Should not call onChange again for same props
		expect( mockOnChange ).not.toHaveBeenCalled();
	} );

	it( 'handles empty choices gracefully', () => {
		render(
			<SortableField
				label="Test Sortable"
				value={ [] }
				choices={ [] }
				onChange={ mockOnChange }
			/>
		);

		expect( screen.getByText( 'Test Sortable' ) ).toBeInTheDocument();
		expect( mockOnChange ).toHaveBeenCalledWith( [] );
	} );
} );
