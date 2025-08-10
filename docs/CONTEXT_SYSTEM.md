# Context System Documentation

## Overview

The Optify system now supports multiple data storage contexts through a flexible context system. This allows panels to work with different types of data storage (options, meta, etc.) while maintaining a consistent API.

## Architecture

### Core Components

1. **Context_Interface** - Defines the contract for context implementations
2. **Context_Manager** - Manages context creation and caching
3. **Options_Context** - Implementation for WordPress options
4. **Meta_Context** - Implementation for WordPress meta (placeholder for future)
5. **Data_Manager** - Generic interface for data operations

### Context Flow

```
Panel Registration → Context Creation → Data Operations → Storage
```

## Usage Examples

### Current Usage (Backward Compatible)

```php
// Existing code continues to work unchanged
Optify::register_panel('my_panel', 'My_Panel_Class', [
    'options_name' => 'my_options'
]);
```

### New Context-Aware Usage

#### Options Context (Explicit)
```php
Optify::register_panel('my_options_panel', 'My_Options_Panel_Class', [
    'options_name' => 'my_options',
    'context' => 'options',
    'context_config' => [
        // Additional context configuration if needed
    ]
]);
```

#### Meta Context (Available Now)
```php
// Meta context API for post meta
Optify::register_panel('my_meta_panel', 'My_Meta_Panel_Class', [
    'context' => 'meta',
    'meta_key' => 'my_meta_key',
    'post_type' => 'post'
]);

// Or use the dedicated meta panel class
class My_Meta_Panel extends Abstract_Meta_Panel {
    public function get_field_configuration() {
        return [
            // Your field configuration
        ];
    }
}

Optify::register_panel('my_meta_panel', 'My_Meta_Panel', [
    'meta_key' => 'my_meta_key',
    'post_type' => 'post'
]);
```

#### Custom Context Instance
```php
$custom_context = new My_Custom_Context(['config' => 'value']);

Optify::register_panel('my_custom_panel', 'My_Custom_Panel_Class', [
    'options_name' => 'my_data_key',
    'context' => $custom_context
]);
```

## API Changes

### Backend API

#### Legacy Endpoints (Unchanged)
- `GET /wp-json/{namespace}/v1/fields/{panel}`
- `GET /wp-json/{namespace}/v1/options/{panel}`
- `POST /wp-json/{namespace}/v1/options/{panel}`

#### New Context-Aware Endpoints
- `GET /wp-json/{namespace}/v1/context/{context}/fields/{panel}`
- `GET /wp-json/{namespace}/v1/context/{context}/data/{panel}`
- `POST /wp-json/{namespace}/v1/context/{context}/data/{panel}`

#### Meta-Specific Endpoints
- `GET /wp-json/{namespace}/v1/meta/fields/{panel}`
- `GET /wp-json/{namespace}/v1/meta/data/{panel}?post_id={post_id}`
- `POST /wp-json/{namespace}/v1/meta/data/{panel}?post_id={post_id}`

### Frontend API

The frontend automatically detects the context from the panel configuration and uses the appropriate endpoints.

## Creating Custom Contexts

### 1. Implement Context_Interface

```php
class My_Custom_Context implements \Nilambar\Optify\Context\Context_Interface {
    const CONTEXT_ID = 'custom';
    const CONTEXT_NAME = 'Custom';

    private $config;

    public function __construct($config = []) {
        $this->config = $config;
    }

    public function get_data($key, $default = []) {
        // Implement data retrieval logic
        return $this->custom_get_data($key, $default);
    }

    public function update_data($key, $value) {
        // Implement data update logic
        return $this->custom_update_data($key, $value);
    }

    public function delete_data($key) {
        // Implement data deletion logic
        return $this->custom_delete_data($key);
    }

    public function data_exists($key) {
        // Implement data existence check
        return $this->custom_data_exists($key);
    }

    public function get_context_id() {
        return $this->config['context_id'] ?? self::CONTEXT_ID;
    }

    public function get_context_name() {
        return $this->config['context_name'] ?? self::CONTEXT_NAME;
    }

    public function get_context_config() {
        return $this->config;
    }
}
```

### 2. Register the Context

```php
\Nilambar\Optify\Context\Context_Manager::register_context('custom', My_Custom_Context::class);
```

### 3. Use the Context

```php
Optify::register_panel('my_panel', 'My_Panel_Class', [
    'options_name' => 'my_data_key',
    'context' => 'custom',
    'context_config' => [
        'custom_setting' => 'value'
    ]
]);
```

## Migration Guide

### For Existing Code

No changes required! Existing code continues to work as before.

### For New Features

1. **Options Panels**: Use the new context-aware API for better clarity
2. **Meta Panels**: Wait for Phase 2 implementation
3. **Custom Storage**: Implement custom contexts as needed

## Future Enhancements (Phase 3)

- User meta support
- Term meta support
- Comment meta support
- Advanced meta queries
- Meta data import/export
- Meta data migration tools

## Best Practices

1. **Always specify context explicitly** for new code
2. **Use descriptive context names** for custom contexts
3. **Validate context configuration** in custom implementations
4. **Handle context errors gracefully** in your code
5. **Document custom context requirements** clearly

## Troubleshooting

### Common Issues

1. **Context not found**: Ensure the context is registered before use
2. **Context mismatch**: Verify panel context matches requested context
3. **Configuration errors**: Check context configuration format

### Debug Information

```php
// Check available contexts
$contexts = \Nilambar\Optify\Context\Context_Manager::get_available_contexts();

// Check if context exists
$exists = \Nilambar\Optify\Context\Context_Manager::context_exists('my_context');

// Get context instance
$context = \Nilambar\Optify\Context\Context_Manager::get_context('my_context');
```
