// Helper to extract valid HTML attributes from field.attributes.
export const extractHtmlAttributes = ( fieldConfig ) => {
    const htmlAttributes = {};

    const attributesSource = fieldConfig?.attributes;
    if ( ! attributesSource || typeof attributesSource !== 'object' ) {
        return htmlAttributes;
    }

    const validHtmlAttributes = [
        'placeholder',
        'readonly',
        'disabled',
        'required',
        'maxlength',
        'minlength',
        'pattern',
        'autocomplete',
        'autofocus',
        'form',
        'list',
        'multiple',
        'name',
        'size',
        'step',
        'type',
        'value',
        'accept',
        'alt',
        'checked',
        'dirname',
        'formaction',
        'formenctype',
        'formmethod',
        'formnovalidate',
        'formtarget',
        'height',
        'max',
        'min',
        'src',
        'width',
        'rel',
        'target',
        'aria-label',
        'aria-describedby',
        'aria-required',
        'aria-invalid',
        'data-*',
    ];

    Object.keys( attributesSource ).forEach( ( key ) => {
        if ( key.startsWith( 'data-' ) ) {
            htmlAttributes[ key ] = attributesSource[ key ];
        } else if ( key.startsWith( 'aria-' ) ) {
            htmlAttributes[ key ] = attributesSource[ key ];
        } else if ( validHtmlAttributes.includes( key ) ) {
            htmlAttributes[ key ] = attributesSource[ key ];
        }
    } );

    return htmlAttributes;
};

export default extractHtmlAttributes;


