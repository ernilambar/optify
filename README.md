# Optify - WordPress Panel System

A flexible WordPress panel system for React-based options that can be used in any WordPress plugin.

## Features

- **Generic Panel System**: Create panels that can be rendered anywhere
- **React Integration**: Built-in React frontend for form handling
- **REST API**: Automatic REST endpoints for panel data
- **Asset Management**: Automatic CSS/JS enqueuing
- **Flexible Rendering**: Render panels in admin pages, dashboard widgets, metaboxes, etc.

## Installation

```bash
composer require ernilambar/optify
```

## Basic Usage

### 1. Initialize the Panel System

```php
use Nilambar\Optify\Optify;

// Initialize the panel system
Optify::init( 'your-namespace', 'v1', YOUR_PLUGIN_FILE );
```

### 2. Create Panel Classes

```php
<?php
namespace YourPlugin\Panels;

use Nilambar\Optify\Abstract_Panel;

class MainPanel extends Abstract_Panel {
    public function __construct() {
        parent::__construct(
            'main',
            __( 'General Settings', 'your-plugin' ),
            'your_plugin_options'
        );
    }

    public function get_field_configuration() {
        return [
            [
                'name'    => 'site_title',
                'label'   => __( 'Site Title', 'your-plugin' ),
                'type'    => 'text',
                'default' => '',
            ],
            // ... more fields
        ];
    }
}
```

### 3. Register Panels

```php
// Register panels
Optify::register_panel( 'main', MainPanel::class );
Optify::register_panel( 'advanced', AdvancedPanel::class );
```

### 4. Render Panels

```php
use Nilambar\Optify\Panel_Renderer;

// Render in admin page
Panel_Renderer::render_admin_page( 'main' );

// Render in dashboard widget
Panel_Renderer::render_dashboard_widget( 'main' );

// Render in metabox
Panel_Renderer::render_metabox( 'main' );
```

## REST API Endpoints

The system automatically provides these REST endpoints:

- **GET** `/your-namespace/v1/fields/{panel_id}` - Get field configuration
- **GET** `/your-namespace/v1/options/{panel_id}` - Get current options
- **POST** `/your-namespace/v1/options/{panel_id}` - Save options

## Field Types

Supported field types:

- `text` - Text input
- `email` - Email input
- `url` - URL input
- `number` - Number input (with optional predefined value buttons)
- `password` - Password input
- `textarea` - Textarea
- `select` - Dropdown select
- `radio` - Radio buttons
- `checkbox` - Checkbox
- `toggle` - Toggle switch
- `multi-check` - Multiple checkboxes
- `buttonset` - Button group
- `heading` - Display-only heading text
- `message` - Message with status (info, success, warning, error, description)

## Custom Panel Configuration

```php
// Set custom panel configuration callback
Optify::set_panel_config_callback( function() {
    $panel_configs = [];
    $all_panels = Optify::get_all_panels();

    foreach ( $all_panels as $panel_id => $panel ) {
        // Admin pages: all panels
        $panel_configs['admin_page'][ $panel_id ] = $panel->get_react_config();

        // Dashboard widgets: only specific panels
        if ( in_array( $panel_id, [ 'main', 'quick' ] ) ) {
            $panel_configs['dashboard_widget'][ $panel_id ] = $panel->get_react_config();
        }
    }

    return $panel_configs;
} );
```

## License

MIT
