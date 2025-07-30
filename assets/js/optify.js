/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/client.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/client.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) // removed by dead control flow
{} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ }),

/***/ "./resources/css/admin.css":
/*!*********************************!*\
  !*** ./resources/css/admin.css ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/css/options-panel.css":
/*!*****************************************!*\
  !*** ./resources/css/options-panel.css ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/js/options-panel.jsx":
/*!****************************************!*\
  !*** ./resources/js/options-panel.jsx ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);




const OptionsPanel = ({
  config,
  restUrl,
  nonce,
  panelId,
  onSave,
  onError,
  underCog = false
}) => {
  const [fields, setFields] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [values, setValues] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [originalValues, setOriginalValues] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({});
  const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(true);
  const [isSaving, setIsSaving] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [notice, setNotice] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [hasChanges, setHasChanges] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [isCogExpanded, setIsCogExpanded] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!underCog);
  const {
    panelTitle,
    saveButtonText,
    savingText,
    loadingText,
    messages
  } = config;

  // Check if values have changed
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const changed = Object.keys(values).some(key => {
      return values[key] !== originalValues[key];
    });
    setHasChanges(changed);
  }, [values, originalValues]);

  // Fetch field configuration and current values
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const fetchData = async () => {
      try {
        // Use simplified REST API structure (panel ID only)
        const fieldsEndpoint = `fields/${panelId}`;
        const optionsEndpoint = `options/${panelId}`;

        // Fetch field configuration
        const fieldsResponse = await fetch(`${restUrl}${fieldsEndpoint}`, {
          headers: {
            'X-WP-Nonce': nonce,
            'Content-Type': 'application/json'
          }
        });
        if (!fieldsResponse.ok) {
          throw new Error(`Failed to fetch fields: ${fieldsResponse.status}`);
        }
        const fieldsData = await fieldsResponse.json();
        const fieldConfig = fieldsData.data || [];
        setFields(fieldConfig);

        // Fetch current values
        const valuesResponse = await fetch(`${restUrl}${optionsEndpoint}`, {
          headers: {
            'X-WP-Nonce': nonce,
            'Content-Type': 'application/json'
          }
        });
        if (!valuesResponse.ok) {
          throw new Error(`Failed to fetch values: ${valuesResponse.status}`);
        }
        const valuesData = await valuesResponse.json();
        const currentValues = valuesData.data || {};
        setValues(currentValues);
        setOriginalValues(currentValues); // Set original values on load
      } catch (error) {
        setNotice({
          type: 'error',
          message: messages.loadError
        });
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [restUrl, nonce, messages.loadError, onError, panelId]);
  const handleFieldChange = (fieldName, value) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Use simplified REST API structure (panel ID only)
      const optionsEndpoint = `options/${panelId}`;
      const response = await fetch(`${restUrl}${optionsEndpoint}`, {
        method: 'POST',
        headers: {
          'X-WP-Nonce': nonce,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `Failed to save: ${response.status}`);
      }

      // Update original values with saved data
      const savedValues = data.data?.values || values;
      setOriginalValues(savedValues);
      setValues(savedValues);
      setHasChanges(false); // Reset hasChanges after save

      setNotice({
        type: 'success',
        message: messages.saveSuccess
      });
      onSave?.(savedValues);

      // Auto-close on successful save when underCog is enabled
      if (underCog) {
        // Small delay to show success message before closing
        setTimeout(() => {
          setIsCogExpanded(false);
          setNotice(null); // Clear the notice when closing
        }, 1000);
      }
    } catch (error) {
      setNotice({
        type: 'error',
        message: messages.saveError
      });
      onError?.(error);
      // Keep open on error so user can fix and retry
    } finally {
      setIsSaving(false);
    }
  };

  // Render field based on type
  const renderField = (field, value, handleFieldChange) => {
    const {
      name,
      label,
      type,
      choices = []
    } = field;

    // Extract all custom properties (anything beyond the core field properties)
    const customProps = {
      ...field
    };
    delete customProps.name;
    delete customProps.label;
    delete customProps.type;
    delete customProps.choices;
    delete customProps.default;
    delete customProps.required;

    // Helper function to get custom property with default
    const getCustomProp = (propName, defaultValue = null) => {
      return customProps[propName] !== undefined ? customProps[propName] : defaultValue;
    };
    switch (type) {
      case 'text':
        const textSettings = {
          readonly: false,
          size: 'medium',
          ...field.settings
        };
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "optify-field optify-field-type-text"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          className: "optify-field-label"
        }, label), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          type: "text",
          value: value,
          readOnly: textSettings.readonly,
          onChange: e => handleFieldChange(name, e.target.value),
          className: "optify-field-input"
        }), (choices || []).length > 0 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "optify-field-quick-select"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: "optify-field-quick-select-label"
        }, "Quick select:"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ButtonGroup, null, (choices || []).map(choice => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          key: choice.value,
          variant: value === choice.value ? 'primary' : 'secondary',
          size: "small",
          onClick: () => handleFieldChange(name, choice.value)
        }, choice.label)))));
      case 'email':
        const emailSettings = {
          size: 'medium',
          ...field.settings
        };
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "optify-field optify-field-type-email"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          className: "optify-field-label"
        }, label), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          type: "email",
          value: value,
          onChange: e => handleFieldChange(name, e.target.value),
          className: "optify-field-input"
        }));
      case 'url':
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: label,
          type: "url",
          value: value,
          onChange: newValue => handleFieldChange(name, newValue)
        });
      case 'number':
        const numberSettings = {
          size: 'medium',
          ...field.settings
        };
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "optify-field optify-field-type-number"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          className: "optify-field-label"
        }, label), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          type: "number",
          value: value,
          onChange: e => handleFieldChange(name, e.target.value),
          className: "optify-field-input"
        }), (choices || []).length > 0 && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "optify-field-quick-select"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: "optify-field-quick-select-label"
        }, "Quick select:"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ButtonGroup, null, (choices || []).map(choice => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          key: choice.value,
          variant: value === choice.value ? 'primary' : 'secondary',
          size: "small",
          onClick: () => handleFieldChange(name, choice.value)
        }, choice.label)))));
      case 'password':
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
          label: label,
          type: "password",
          value: value,
          onChange: newValue => handleFieldChange(name, newValue)
        });
      case 'textarea':
        const textareaSettings = {
          readonly: false,
          size: 'medium',
          ...field.settings
        };
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "optify-field optify-field-type-textarea"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          className: "optify-field-label"
        }, label), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("textarea", {
          value: value,
          readOnly: textareaSettings.readonly,
          onChange: e => handleFieldChange(name, e.target.value),
          className: "optify-field-textarea"
        }));
      case 'radio':
        const radioSettings = {
          layout: 'vertical',
          size: 'medium',
          style: 'default',
          spacing: 'normal',
          ...field.settings // Merge any custom settings
        };
        const radioGroupClass = `optify-field-radio-group optify-field-radio-group--${radioSettings.layout}${radioSettings.spacing === 'tight' ? ' optify-field-radio-group--tight' : ''}`;
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "optify-field optify-field-type-radio"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: "optify-field-label"
        }, label), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: radioGroupClass
        }, (choices || []).map(choice => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          key: choice.value,
          className: "optify-field-radio-option"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          type: "radio",
          name: name,
          value: choice.value,
          checked: value === choice.value,
          onChange: e => handleFieldChange(name, e.target.value)
        }), choice.label))));
      case 'checkbox':
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "optify-field optify-field-type-checkbox"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CheckboxControl, {
          label: label,
          checked: value,
          onChange: newValue => handleFieldChange(name, newValue)
        }));
      case 'select':
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "optify-field optify-field-type-select"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.SelectControl, {
          label: label,
          value: value,
          options: choices || [],
          onChange: newValue => handleFieldChange(name, newValue)
        }));
      case 'toggle':
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "optify-field optify-field-type-toggle"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ToggleControl, {
          label: label,
          checked: !!value,
          onChange: newValue => handleFieldChange(name, newValue)
        }));
      case 'multi-check':
        const multiCheckSettings = {
          layout: 'vertical',
          size: 'medium',
          style: 'default',
          spacing: 'normal',
          ...field.settings // Merge any custom settings
        };
        const multiCheckGroupClass = `optify-field-multi-check-group optify-field-multi-check-group--${multiCheckSettings.layout}${multiCheckSettings.spacing === 'tight' ? ' optify-field-multi-check-group--tight' : ''}`;
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "optify-field optify-field-type-multi-check"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: "optify-field-label"
        }, label), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: multiCheckGroupClass
        }, (choices || []).map(choice => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", {
          key: choice.value,
          className: "optify-field-multi-check-option"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
          type: "checkbox",
          value: choice.value,
          checked: Array.isArray(value) ? value.includes(choice.value) : false,
          onChange: e => {
            let newValue = Array.isArray(value) ? [...value] : [];
            if (e.target.checked) {
              newValue.push(choice.value);
            } else {
              newValue = newValue.filter(v => v !== choice.value);
            }
            handleFieldChange(name, newValue);
          }
        }), choice.label))));
      case 'buttonset':
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "optify-field optify-field-type-buttonset"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
          className: "optify-field-label"
        }, label), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.ButtonGroup, null, (choices || []).map(choice => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
          key: choice.value,
          variant: value === choice.value ? 'primary' : 'secondary',
          onClick: () => handleFieldChange(name, choice.value)
        }, choice.label))));
      case 'heading':
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "optify-field optify-field-type-heading"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", {
          className: "optify-field-heading"
        }, label));
      case 'message':
        const messageStatus = field.status || 'info';
        if (messageStatus === 'description') {
          return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
            className: "optify-field optify-field-type-message"
          }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
            className: "optify-field-message"
          }, label));
        }
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
          className: "optify-field optify-field-type-message"
        }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Notice, {
          status: messageStatus,
          isDismissible: false
        }, label));
      default:
        return null;
    }
  };
  if (isLoading) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "optify-loading"
    }, loadingText);
  }

  // Render cog icon if underCog is true
  if (underCog) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "optify-options-panel optify-options-panel--under-cog"
    }, notice && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Notice, {
      status: notice.type,
      onRemove: () => setNotice(null)
    }, notice.message), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "optify-cog-container"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      className: "optify-cog-button",
      onClick: () => setIsCogExpanded(!isCogExpanded),
      "aria-label": isCogExpanded ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hide settings', 'optify') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show settings', 'optify')
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      className: `optify-cog-icon ${isCogExpanded ? 'optify-cog-icon--expanded' : ''}`
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5A3.5 3.5 0 0 1 15.5 12A3.5 3.5 0 0 1 12 15.5M19.43 12.97C19.47 12.65 19.5 12.33 19.5 12C19.5 11.67 19.47 11.34 19.43 11L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.96 19.05 5.05L16.56 6.05C16.04 5.66 15.5 5.32 14.87 5.07L14.5 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.5 2.42L9.13 5.07C8.5 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.73 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.22 8.95 2.27 9.22 2.46 9.37L4.57 11C4.53 11.34 4.5 11.67 4.5 12C4.5 12.33 4.53 12.65 4.57 12.97L2.46 14.63C2.27 14.78 2.22 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.04 4.95 18.95L7.44 17.95C7.96 18.34 8.5 18.68 9.13 18.93L9.5 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.5 21.58L14.87 18.93C15.5 18.68 16.04 18.34 16.56 17.95L19.05 18.95C19.27 19.04 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.97Z"
    })))), isCogExpanded && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "optify-panel-content"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Panel, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, null, fields.map(field => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelRow, {
      key: field.name
    }, renderField(field, values[field.name], handleFieldChange))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "optify-actions"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "primary",
      isBusy: isSaving,
      onClick: handleSave,
      disabled: isSaving || !hasChanges
    }, isSaving ? savingText : saveButtonText), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
      variant: "secondary",
      onClick: () => setIsCogExpanded(false),
      disabled: isSaving
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Close', 'optify')))));
  }

  // Default render (when underCog is false or not passed)
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "optify-options-panel"
  }, notice && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Notice, {
    status: notice.type,
    onRemove: () => setNotice(null)
  }, notice.message), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Panel, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, null, fields.map(field => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelRow, {
    key: field.name
  }, renderField(field, values[field.name], handleFieldChange))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "optify-actions"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: "primary",
    isBusy: isSaving,
    onClick: handleSave,
    disabled: isSaving || !hasChanges
  }, isSaving ? savingText : saveButtonText)));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (OptionsPanel);

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./resources/js/index.js ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/.pnpm/react-dom@18.3.1_react@18.3.1/node_modules/react-dom/client.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _options_panel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./options-panel */ "./resources/js/options-panel.jsx");
/* harmony import */ var _css_admin_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../css/admin.css */ "./resources/css/admin.css");
/* harmony import */ var _css_options_panel_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../css/options-panel.css */ "./resources/css/options-panel.css");






const OptifyOptionsPanelWrapper = ({
  config,
  restUrl,
  nonce,
  panelId,
  underCog = false
}) => {
  if (!config || !restUrl || !nonce || !panelId) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "optify-error"
    }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Configuration not found. Please refresh the page.', 'optify'));
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_options_panel__WEBPACK_IMPORTED_MODULE_3__["default"], {
    config: config,
    restUrl: restUrl,
    nonce: nonce,
    panelId: panelId,
    underCog: underCog,
    onSave: values => {
      // Handle save success
    },
    onError: error => {
      // Handle save error
    }
  });
};
document.addEventListener('DOMContentLoaded', () => {
  const {
    optifyAdmin
  } = window;
  if (!optifyAdmin || !optifyAdmin.panels) {
    return;
  }
  const {
    panels,
    restUrl,
    nonce
  } = optifyAdmin;
  const panelContainers = document.querySelectorAll('[id^="optify-"][id$="-panel"]');

  // Also look for panels inside dashboard widgets
  const dashboardWidgets = document.querySelectorAll('[data-location="dashboard_widget"]');
  const dashboardPanelContainers = document.querySelectorAll('#dashboard-widgets [id^="optify-"][id$="-panel"]');

  // Combine all panel containers
  const allPanelContainers = [...panelContainers, ...dashboardPanelContainers];
  allPanelContainers.forEach(container => {
    const panelId = container.id.replace('optify-', '').replace('-panel', '');
    const location = container.dataset.location;
    const underCog = container.dataset.underCog === 'true';
    if (location && panels[location] && panels[location][panelId]) {
      try {
        (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(container).render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(OptifyOptionsPanelWrapper, {
          config: panels[location][panelId],
          restUrl: restUrl,
          nonce: nonce,
          panelId: panelId,
          underCog: underCog
        }));
      } catch (error) {
        // Handle rendering error
      }
    }
  });
});
})();

/******/ })()
;
//# sourceMappingURL=optify.js.map