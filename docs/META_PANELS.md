# Meta Panels Documentation

## Overview

Meta panels allow you to create custom fields for WordPress posts using the Optify system. This provides a powerful way to extend post functionality with custom data storage.

## Features

- **Post-specific data storage** using WordPress post meta
- **Post type filtering** to show panels only for specific post types
- **Automatic post ID detection** from current context
- **Full field type support** with all existing field types
- **Conditional logic** for field visibility
- **Validation and sanitization** built-in

## Quick Start

### 1. Create a Meta Panel Class

```php
<?php
use Nilambar\Optify\Abstract_Meta_Panel;

class My_Post_Meta_Panel extends Abstract_Meta_Panel {

    public function get_field_configuration() {
        return [
            [
                'name'        => 'custom_field',
                'type'        => 'text',
                'label'       => 'Custom Field',
                'description' => 'Enter custom value',
                'default'     => '',
            ],
        ];
    }
}
```

### 2. Register the Meta Panel

```php
// Register for posts
Optify::register_panel('my_post_meta', 'My_Post_Meta_Panel', [
    'meta_key' => '_my_custom_meta',
    'post_type' => 'post'
]);

// Register for pages
Optify::register_panel('my_page_meta', 'My_Page_Meta_Panel', [
    'meta_key' => '_my_page_meta',
    'post_type' => 'page'
]);

// Register for custom post types
Optify::register_panel('my_product_meta', 'My_Product_Meta_Panel', [
    'meta_key' => '_my_product_meta',
    'post_type' => 'product'
]);
```

### 3. Render the Panel

```php
// In your theme or plugin
Optify::render_panel('my_post_meta', [
    'post_id' => get_the_ID(),
    'display' => 'inline'
]);
```

## API Reference

### Abstract_Meta_Panel

#### Constructor Parameters

```php
public function __construct(
    string $panel_id,      // Unique panel identifier
    string $panel_title,   // Panel display title
    string $meta_key,      // WordPress meta key
    string $post_type,     // Post type (default: 'post')
    int $post_id          // Post ID (optional)
);
```

#### Methods

- `get_post_type()` - Get the post type this panel is configured for
- `get_meta_key()` - Get the meta key used for data storage
- `should_display_for_post($post_id)` - Check if panel should display for a post
- `get_current_post_id()` - Get post ID from current context

### Registration Options

```php
Optify::register_panel($panel_id, $panel_class, [
    'meta_key' => '_my_meta_key',           // Required: Meta key for storage
    'post_type' => 'post',                  // Required: Post type
    'post_id' => 123,                       // Optional: Specific post ID
    'context' => 'meta',                    // Auto-set for meta panels
    'context_config' => [                   // Optional: Additional context config
        'post_type' => 'post',
        'post_id' => 123,
    ]
]);
```

## Field Types

All existing field types are supported:

- `text` - Single line text input
- `textarea` - Multi-line text input
- `email` - Email input with validation
- `url` - URL input with validation
- `number` - Numeric input
- `password` - Password input
- `select` - Dropdown selection
- `radio` - Radio button group
- `checkbox` - Single checkbox
- `multi-check` - Multiple checkboxes
- `toggle` - Toggle switch
- `buttonset` - Button group selection
- `heading` - Section heading
- `message` - Informational message

## Conditional Logic

Meta panels support conditional field visibility:

```php
[
    'name'        => 'conditional_field',
    'type'        => 'text',
    'label'       => 'Conditional Field',
    'conditions'  => [
        [
            'field'    => 'show_field',
            'operator' => '==',
            'value'    => true,
        ],
    ],
]
```

## Data Retrieval

### In PHP

```php
// Get meta data for a specific post
$meta_data = get_post_meta($post_id, '_my_meta_key', true);

// Using the context system
$context = new \Nilambar\Optify\Context\Meta_Context([
    'post_type' => 'post',
    'post_id' => $post_id
]);
$meta_data = $context->get_data('_my_meta_key', []);
```

### In JavaScript

```javascript
// The frontend automatically handles meta data retrieval
// when using the meta context
```

## REST API Endpoints

### Get Fields Configuration
```
GET /wp-json/{namespace}/v1/meta/fields/{panel}
```

### Get Meta Data
```
GET /wp-json/{namespace}/v1/meta/data/{panel}?post_id={post_id}
```

### Save Meta Data
```
POST /wp-json/{namespace}/v1/meta/data/{panel}?post_id={post_id}
Body: { "values": { "field_name": "value" } }
```

## Integration Examples

### WordPress Admin Integration

```php
// Add meta box to post edit screen
add_action('add_meta_boxes', function() {
    add_meta_box(
        'my_meta_panel',
        'Custom Settings',
        function($post) {
            Optify::render_panel('my_post_meta', [
                'post_id' => $post->ID,
                'display' => 'inline'
            ]);
        },
        'post',
        'normal',
        'high'
    );
});
```

### Frontend Integration

```php
// Display meta panel in theme
if (is_single()) {
    Optify::render_panel('my_post_meta', [
        'post_id' => get_the_ID(),
        'display' => 'toggle'
    ]);
}
```

### Custom Post Type Integration

```php
// Register meta panel for custom post type
add_action('init', function() {
    Optify::register_panel('product_meta', 'Product_Meta_Panel', [
        'meta_key' => '_product_meta',
        'post_type' => 'product'
    ]);
});

// Add to custom post type edit screen
add_action('add_meta_boxes', function() {
    add_meta_box(
        'product_meta_panel',
        'Product Settings',
        function($post) {
            Optify::render_panel('product_meta', [
                'post_id' => $post->ID,
                'display' => 'inline'
            ]);
        },
        'product',
        'normal',
        'high'
    );
});
```

## Best Practices

### 1. Meta Key Naming

Use descriptive, prefixed meta keys:

```php
// Good
'_my_plugin_featured_image'
'_my_plugin_custom_title'
'_my_plugin_sidebar_settings'

// Avoid
'featured_image'
'custom_title'
'settings'
```

### 2. Post Type Specificity

Create separate panels for different post types:

```php
// Separate panels for different post types
Optify::register_panel('post_meta', 'Post_Meta_Panel', [
    'meta_key' => '_post_meta',
    'post_type' => 'post'
]);

Optify::register_panel('page_meta', 'Page_Meta_Panel', [
    'meta_key' => '_page_meta',
    'post_type' => 'page'
]);
```

### 3. Data Validation

Always validate and sanitize data:

```php
// The system automatically handles validation
// but you can add custom validation in your panel class
public function validate_options($values) {
    $errors = new \WP_Error();

    if (!empty($values['custom_url']) && !filter_var($values['custom_url'], FILTER_VALIDATE_URL)) {
        $errors->add('invalid_url', 'Invalid URL provided');
    }

    return $errors;
}
```

### 4. Performance Considerations

- Use appropriate meta keys for efficient queries
- Consider using single meta keys for complex data
- Cache meta data when appropriate

## Troubleshooting

### Common Issues

1. **Panel not displaying**: Check post type configuration
2. **Data not saving**: Verify meta key and permissions
3. **Fields not showing**: Check conditional logic
4. **REST API errors**: Verify endpoint configuration

### Debug Information

```php
// Check if panel exists
$panel = Optify::get_panel('my_panel');

// Check panel type
if ($panel instanceof Abstract_Meta_Panel) {
    echo 'This is a meta panel';
}

// Check post compatibility
$should_display = $panel->should_display_for_post($post_id);
```

## Migration from Options Panels

If you have existing options panels and want to convert them to meta panels:

1. **Create new meta panel class** extending `Abstract_Meta_Panel`
2. **Copy field configuration** from existing panel
3. **Register new meta panel** with appropriate meta key
4. **Migrate existing data** if needed
5. **Update rendering code** to use new panel
6. **Test thoroughly** before removing old panel

## Future Enhancements

- User meta support
- Term meta support
- Comment meta support
- Advanced meta queries
- Meta data import/export
- Meta data migration tools
