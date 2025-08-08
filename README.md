# Optify - WordPress Panel System

A flexible WordPress panel system for React-based options that can be used in any WordPress plugin.

## Features

- **Generic Panel System**: Create panels that can be rendered anywhere
- **React Integration**: Built-in React frontend for form handling
- **REST API**: Automatic REST endpoints for panel data
- **Asset Management**: Automatic CSS/JS enqueuing
- **Flexible Rendering**: Render panels in admin pages, dashboard widgets, metaboxes, etc.
- **Simplified API**: Single `Panel_Manager::render_panel()` method for all rendering contexts
- **Unique CSS Classes**: Each panel gets a unique CSS class for easy styling (`optify-panel-{panel_id}`)

## Complete Example

Here's a complete example of how to use Optify in your WordPress plugin:

```php
<?php
/**
 * Plugin Name: My Plugin with Optify
 * Description: Example plugin using Optify panel system
 * Version: 1.0.0
 */

// Prevent direct access.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define plugin constants.
define( 'MY_PLUGIN_FILE', __FILE__ );

// Autoload Optify package.
require_once plugin_dir_path( __FILE__ ) . 'vendor/autoload.php';

// Initialize Optify panel system.
use Nilambar\Optify\Optify;

// Initialize the panel system (REST API only)
Optify::init( 'my-plugin', 'v1' );

// Load assets (required for frontend functionality)
Optify::load_assets(
    plugin_dir_path( MY_PLUGIN_FILE ) . 'vendor/ernilambar/optify',
    plugin_dir_url( MY_PLUGIN_FILE ) . 'vendor/ernilambar/optify/'
);

// Register your panels.
Optify::register_panel( 'main', MyMainPanel::class );

// Add admin menu.
add_action( 'admin_menu', function() {
    add_options_page(
        'My Plugin Settings',
        'My Plugin',
        'manage_options',
        'my-plugin-settings',
        'my_plugin_settings_page'
    );
} );

function my_plugin_settings_page() {
    ?>
    <div class="wrap">
        <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
        <?php
        // Render the panel.
        \Nilambar\Optify\Panel_Manager::render_panel( 'main', [
            'container_class' => 'optify-panel-admin',
            'show_title'      => true,
            'location'        => 'admin_page',
        ] );
        ?>
    </div>
    <?php
}

// Panel class.
class MyMainPanel extends \Nilambar\Optify\Abstract_Panel {
    public function __construct() {
        parent::__construct(
            'main',
            'General Settings',
            'my_plugin_options'
        );
    }

    public function get_field_configuration() {
        return [
            [
                'name'    => 'site_title',
                'label'   => 'Site Title',
                'type'    => 'text',
                'default' => '',
            ],
            [
                'name'        => 'enable_feature',
                'label'       => 'Enable Feature',
                'type'        => 'toggle',
                'default'     => false,
                'description' => 'Turn this on to enable the new feature.',
            ],
        ];
    }
}
```

### 5. Render Panels

```php
use Nilambar\Optify\Panel_Manager;

// Render in admin page
Panel_Manager::render_panel( 'main', [
    'container_class' => 'optify-panel-admin',
    'show_title'      => false,
] );
```

## REST API Endpoints

The system automatically provides these REST endpoints:

- **GET** `/your-namespace/v1/fields/{panel_id}` - Get field configuration
- **GET** `/your-namespace/v1/options/{panel_id}` - Get current options
- **POST** `/your-namespace/v1/options/{panel_id}` - Save options

## Field Descriptions

All field types support an optional `description` property that provides additional context or help text for users:

```php
[
    'name'        => 'site_title',
    'label'       => 'Site Title',
    'type'        => 'text',
    'default'     => '',
    'description' => 'Enter the title that will appear in browser tabs and bookmarks.',
],
```

The description appears between the field label and input, styled in a subtle italic font.

## Field Types

Supported field types (all support optional `description` property):

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
- `sortable` - Drag and drop sortable list
- `buttonset` - Button group
- `heading` - Display-only heading text
- `message` - Message with status (info, success, warning, error, description)




## License

MIT

## Installation

```bash
composer require ernilambar/optify
```

## Basic Usage

### 1. Initialize the Panel System

```php
use Nilambar\Optify\Optify;

// Initialize the panel system (REST API only)
Optify::init( 'your-namespace', 'v1' );

// Load assets (required for frontend functionality)
Optify::load_assets(
    plugin_dir_path( __FILE__ ) . 'vendor/ernilambar/optify',
    plugin_dir_url( __FILE__ ) . 'vendor/ernilambar/optify/'
);
```

### 2. Load Assets with Custom Configuration

If you need custom asset paths:

```php
// Load assets with custom paths
Optify::load_assets(
    '/custom/path/to/optify',
    'https://your-site.com/custom/optify/'
);
```

**Asset Configuration:**
- `package_dir`: Package directory path (required)
- `package_url`: Package URL (required)
- Asset files are auto-detected from the package directory

### 3. Create Panel Classes

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

### 4. Register Panels

```php
// Register panels
Optify::register_panel( 'main', MainPanel::class );
Optify::register_panel( 'advanced', AdvancedPanel::class );
```
