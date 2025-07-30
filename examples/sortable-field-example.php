<?php
/**
 * Example: Sortable Field Usage
 *
 * This example demonstrates how to use the new sortable field type
 * in your WordPress options panel configuration.
 */

// Example field configuration for a sortable field
$sortable_field_config = array(
    'name' => 'my_sortable_field',
    'label' => 'Sortable Items',
    'type' => 'sortable',
    'choices' => array(
        array(
            'value' => 'item_1',
            'label' => 'First Item'
        ),
        array(
            'value' => 'item_2',
            'label' => 'Second Item'
        ),
        array(
            'value' => 'item_3',
            'label' => 'Third Item'
        ),
        array(
            'value' => 'item_4',
            'label' => 'Fourth Item'
        ),
        array(
            'value' => 'item_5',
            'label' => 'Fifth Item'
        )
    ),
    'default' => array('item_1', 'item_3'), // Default enabled items
    'settings' => array(
        // Additional settings can be added here
        'show_drag_handle' => true,
        'allow_disable' => true
    )
);

// Example of how to use the sortable field in a panel configuration
$panel_config = array(
    'panelTitle' => 'My Options Panel',
    'saveButtonText' => 'Save Settings',
    'savingText' => 'Saving...',
    'loadingText' => 'Loading...',
    'messages' => array(
        'saveSuccess' => 'Settings saved successfully!',
        'saveError' => 'Error saving settings.',
        'loadError' => 'Error loading settings.'
    ),
    'fields' => array(
        // Other fields...
        array(
            'name' => 'page_elements',
            'label' => 'Page Elements Order',
            'type' => 'sortable',
            'choices' => array(
                array('value' => 'header', 'label' => 'Header'),
                array('value' => 'navigation', 'label' => 'Navigation Menu'),
                array('value' => 'sidebar', 'label' => 'Sidebar'),
                array('value' => 'content', 'label' => 'Main Content'),
                array('value' => 'footer', 'label' => 'Footer'),
                array('value' => 'widgets', 'label' => 'Widgets')
            ),
            'default' => array('header', 'navigation', 'content', 'sidebar', 'footer'),
            'description' => 'Drag and drop to reorder page elements. Toggle to enable/disable elements.'
        ),
        array(
            'name' => 'social_media',
            'label' => 'Social Media Links',
            'type' => 'sortable',
            'choices' => array(
                array('value' => 'facebook', 'label' => 'Facebook'),
                array('value' => 'twitter', 'label' => 'Twitter'),
                array('value' => 'instagram', 'label' => 'Instagram'),
                array('value' => 'linkedin', 'label' => 'LinkedIn'),
                array('value' => 'youtube', 'label' => 'YouTube'),
                array('value' => 'tiktok', 'label' => 'TikTok')
            ),
            'default' => array('facebook', 'twitter', 'instagram'),
            'description' => 'Select and order your social media links.'
        )
    )
);

// Example of how to retrieve and use the saved sortable field value
function get_sorted_elements() {
    $saved_value = get_option('my_plugin_page_elements', array());

    // $saved_value will be an array of enabled items in the order they were saved
    // Example: ['header', 'navigation', 'content', 'sidebar', 'footer']

    return $saved_value;
}

// Example of how to render elements based on the sortable field value
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
            case 'content':
                echo '<main>Main content</main>';
                break;
            case 'sidebar':
                echo '<aside>Sidebar content</aside>';
                break;
            case 'footer':
                echo '<footer>Footer content</footer>';
                break;
        }
    }
}

/**
 * Usage Notes:
 *
 * 1. The sortable field always returns an array of enabled item values in the order they were arranged.
 *
 * 2. The 'choices' array defines all available options that can be enabled/disabled and reordered.
 *
 * 3. The 'default' value should always be an array, even if empty.
 *
 * 4. Users can:
 *    - Drag and drop items to reorder them
 *    - Toggle items on/off using the toggle control
 *    - The saved value respects both the order and enabled state
 *
 * 5. The field uses the @hello-pangea/dnd library for smooth drag and drop functionality.
 *
 * 6. Styling is included in the optify.css file with proper WordPress admin styling.
 */
?>
