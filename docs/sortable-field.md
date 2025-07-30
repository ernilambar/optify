# Sortable Field Component

The Sortable Field component provides a drag-and-drop interface for ordering and enabling/disabling items in WordPress Gutenberg components.

## Features

- **Drag and Drop**: Reorder items by dragging them up or down
- **Enable/Disable**: Toggle items on or off using WordPress ToggleControl
- **Order Preservation**: Saved value respects the exact order of enabled items
- **WordPress Styling**: Matches WordPress admin design patterns
- **Accessibility**: Full keyboard navigation and screen reader support

## Installation

The sortable field uses the `@hello-pangea/dnd` library for drag and drop functionality. It's already included in the project dependencies.

## Usage

### Field Configuration

```php
$field_config = array(
    'name' => 'my_sortable_field',
    'label' => 'Sortable Items',
    'type' => 'sortable',
    'choices' => array(
        array('value' => 'item_1', 'label' => 'First Item'),
        array('value' => 'item_2', 'label' => 'Second Item'),
        array('value' => 'item_3', 'label' => 'Third Item'),
        // ... more choices
    ),
    'default' => array('item_1', 'item_3'), // Default enabled items
    'settings' => array(
        // Additional settings can be added here
    )
);
```

### Field Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | Yes | Unique field identifier |
| `label` | string | Yes | Field label displayed to users |
| `type` | string | Yes | Must be `'sortable'` |
| `choices` | array | Yes | Array of choice objects with `value` and `label` |
| `default` | array | No | Array of default enabled item values |
| `settings` | array | No | Additional field settings |

### Choice Object Structure

```php
array(
    'value' => 'unique_identifier',
    'label' => 'Display Label'
)
```

## Return Value

The sortable field always returns an **array** of enabled item values in the order they were arranged.

**Example:**
```php
// If user enabled items 2, 1, 4 in that order
$value = array('item_2', 'item_1', 'item_4');
```

## Examples

### Page Elements Ordering

```php
$fields = array(
    array(
        'name' => 'page_elements',
        'label' => 'Page Elements Order',
        'type' => 'sortable',
        'choices' => array(
            array('value' => 'header', 'label' => 'Header'),
            array('value' => 'navigation', 'label' => 'Navigation Menu'),
            array('value' => 'sidebar', 'label' => 'Sidebar'),
            array('value' => 'content', 'label' => 'Main Content'),
            array('value' => 'footer', 'label' => 'Footer')
        ),
        'default' => array('header', 'navigation', 'content', 'sidebar', 'footer')
    )
);
```

### Social Media Links

```php
$fields = array(
    array(
        'name' => 'social_media',
        'label' => 'Social Media Links',
        'type' => 'sortable',
        'choices' => array(
            array('value' => 'facebook', 'label' => 'Facebook'),
            array('value' => 'twitter', 'label' => 'Twitter'),
            array('value' => 'instagram', 'label' => 'Instagram'),
            array('value' => 'linkedin', 'label' => 'LinkedIn')
        ),
        'default' => array('facebook', 'twitter')
    )
);
```

## Working with Saved Values

### Retrieving Values

```php
function get_sorted_elements() {
    $saved_value = get_option('my_plugin_page_elements', array());
    return $saved_value;
}
```

### Rendering Based on Order

```php
function render_page_elements() {
    $elements = get_sorted_elements();

    foreach ($elements as $element) {
        switch ($element) {
            case 'header':
                echo '<header>Header content</header>';
                break;
            case 'navigation':
                echo '<nav>Navigation menu</nav>';
                break;
            // ... handle other elements
        }
    }
}
```

## Styling

The sortable field includes comprehensive CSS styling that:

- Matches WordPress admin design patterns
- Provides visual feedback during drag operations
- Shows enabled/disabled states clearly
- Includes hover effects and transitions
- Is fully responsive

### Custom Styling

You can override styles using the following CSS classes:

- `.optify-field-type-sortable` - Main container
- `.optify-sortable-list` - Drop zone
- `.optify-sortable-item` - Individual items
- `.optify-sortable-item.enabled` - Enabled items
- `.optify-sortable-item.disabled` - Disabled items

## Accessibility

The sortable field includes:

- Keyboard navigation support
- Screen reader announcements
- ARIA labels and roles
- Focus management
- High contrast mode support

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- `@hello-pangea/dnd` - Drag and drop functionality
- `@wordpress/components` - WordPress UI components
- `@wordpress/i18n` - Internationalization

## Troubleshooting

### Common Issues

1. **Items not saving in correct order**
   - Ensure the field type is set to `'sortable'`
   - Check that the default value is an array

2. **Drag and drop not working**
   - Verify `@hello-pangea/dnd` is installed
   - Check for JavaScript console errors

3. **Styling issues**
   - Ensure the CSS file is properly loaded
   - Check for CSS conflicts with other plugins

4. **Infinite re-renders or performance issues**
   - The component uses a callback-based approach to avoid useEffect loops
   - Changes are only propagated when items are actually modified
   - If you experience issues, check that the `onChange` callback is stable

5. **"Cannot update a component while rendering a different component" error**
   - The component uses a pending update state to defer onChange calls until after render
   - This prevents setState calls during the render phase
   - All state updates are properly batched and handled in useEffect

6. **Items reset to original order after drag and drop**
   - The component uses a ref to track the last value and prevent unnecessary re-initialization
   - Only calls onChange when values have actually changed
   - Prevents conflicts between local state and prop updates

### Debug Mode

Enable WordPress debug mode to see detailed error messages:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

## Changelog

### Version 1.0.0
- Initial release
- Drag and drop functionality
- Enable/disable toggles
- WordPress admin styling
- Full accessibility support
