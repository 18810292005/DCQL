/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		13: 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/static/webpack/";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([1588,0]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 1588:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85);
__webpack_require__(86);
__webpack_require__(87);
module.exports = __webpack_require__(1852);


/***/ }),

/***/ 1592:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1852:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/style/index.js
var style = __webpack_require__(32);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/index.js
var lib_button = __webpack_require__(5);
var button_default = /*#__PURE__*/__webpack_require__.n(lib_button);

// EXTERNAL MODULE: ./node_modules/antd/lib/modal/style/index.js
var modal_style = __webpack_require__(45);

// EXTERNAL MODULE: ./node_modules/antd/lib/modal/index.js
var modal = __webpack_require__(15);
var modal_default = /*#__PURE__*/__webpack_require__.n(modal);

// EXTERNAL MODULE: ./node_modules/antd/lib/radio/style/index.js
var radio_style = __webpack_require__(117);

// EXTERNAL MODULE: ./node_modules/antd/lib/radio/index.js
var lib_radio = __webpack_require__(25);
var radio_default = /*#__PURE__*/__webpack_require__.n(lib_radio);

// EXTERNAL MODULE: ./node_modules/antd/lib/col/style/index.js
var col_style = __webpack_require__(142);

// EXTERNAL MODULE: ./node_modules/antd/lib/col/index.js
var col = __webpack_require__(14);
var col_default = /*#__PURE__*/__webpack_require__.n(col);

// EXTERNAL MODULE: ./node_modules/antd/lib/row/style/index.js
var row_style = __webpack_require__(143);

// EXTERNAL MODULE: ./node_modules/antd/lib/row/index.js
var row = __webpack_require__(35);
var row_default = /*#__PURE__*/__webpack_require__.n(row);

// EXTERNAL MODULE: ./node_modules/antd/lib/notification/style/index.js
var notification_style = __webpack_require__(60);

// EXTERNAL MODULE: ./node_modules/antd/lib/notification/index.js
var notification = __webpack_require__(10);
var notification_default = /*#__PURE__*/__webpack_require__.n(notification);

// EXTERNAL MODULE: delegated ./node_modules/react/index.js from dll-reference dll_library
var reactfrom_dll_reference_dll_library = __webpack_require__(0);
var reactfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(reactfrom_dll_reference_dll_library);

// EXTERNAL MODULE: delegated ./node_modules/react-dom/index.js from dll-reference dll_library
var react_domfrom_dll_reference_dll_library = __webpack_require__(11);
var react_domfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(react_domfrom_dll_reference_dll_library);

// EXTERNAL MODULE: ./node_modules/react-intl/lib/index.es.js + 1 modules
var index_es = __webpack_require__(2);

// EXTERNAL MODULE: ./components/layout/Breadcrumb.tsx
var Breadcrumb = __webpack_require__(27);

// EXTERNAL MODULE: ./components/layout/Container.tsx
var Container = __webpack_require__(79);

// EXTERNAL MODULE: ./components/layout/FormPage.tsx
var FormPage = __webpack_require__(263);

// EXTERNAL MODULE: ./components/layout/MgeLayout.tsx + 7 modules
var MgeLayout = __webpack_require__(48);

// EXTERNAL MODULE: ./components/layout/NavMenu.tsx
var NavMenu = __webpack_require__(120);

// EXTERNAL MODULE: ./node_modules/antd/lib/divider/style/index.js
var divider_style = __webpack_require__(144);

// EXTERNAL MODULE: ./node_modules/antd/lib/divider/index.js
var divider = __webpack_require__(43);
var divider_default = /*#__PURE__*/__webpack_require__.n(divider);

// EXTERNAL MODULE: ./node_modules/antd/lib/checkbox/style/index.js
var checkbox_style = __webpack_require__(129);

// EXTERNAL MODULE: ./node_modules/antd/lib/checkbox/index.js
var lib_checkbox = __webpack_require__(50);
var checkbox_default = /*#__PURE__*/__webpack_require__.n(lib_checkbox);

// EXTERNAL MODULE: ./apis/define/Export.ts
var Export = __webpack_require__(90);

// EXTERNAL MODULE: ./components/export/ConfigView.less
var export_ConfigView = __webpack_require__(1592);

// EXTERNAL MODULE: ./apis/template/Get.ts
var Get = __webpack_require__(65);

// EXTERNAL MODULE: ./components/common/TemplateFieldTree.tsx
var TemplateFieldTree = __webpack_require__(720);

// EXTERNAL MODULE: ./components/common/FlexLoading.tsx
var FlexLoading = __webpack_require__(66);

// CONCATENATED MODULE: ./components/export/ConfigView.tsx









function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }








var ConfigView_ConfigView = function ConfigView(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(Export["a" /* Export */].Target.File),
      _useState2 = _slicedToArray(_useState, 2),
      target = _useState2[0],
      setTarget = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(Export["a" /* Export */].FileType.Excel),
      _useState4 = _slicedToArray(_useState3, 2),
      fileType = _useState4[0],
      setFileType = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState6 = _slicedToArray(_useState5, 2),
      flat = _useState6[0],
      setFlat = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState8 = _slicedToArray(_useState7, 2),
      partial = _useState8[0],
      setPartial = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState10 = _slicedToArray(_useState9, 2),
      templateContent = _useState10[0],
      setTemplateContent = _useState10[1];

  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState12 = _slicedToArray(_useState11, 2),
      checkedFields = _useState12[0],
      setCheckedFields = _useState12[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    if (!props.singleTemplate) {
      setTarget(Export["a" /* Export */].Target.File);
      setPartial(false);
      setFlat(false);
    }
  }, [props.singleTemplate]);
  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setCheckedFields(null);

    if (props.templateID != null) {
      setTemplateContent(null);
      setCheckedFields([]);
      Object(Get["b" /* GetTemplate */])(props.templateID).then(function (value) {
        setTemplateContent(value.content);
      });
    }
  }, [props.templateID]);

  var handleSetPartial = function handleSetPartial(value) {
    setPartial(value);
  };

  var handleCheckedFieldsChange = function handleCheckedFieldsChange(value) {
    setCheckedFields(value);
  };

  var handleButtonClick = function handleButtonClick() {
    if (partial) {
      if (checkedFields == null) return;else if (checkedFields.length === 0) return;
    }

    props.onExportClick({
      target: target,
      fileType: fileType,
      isFlat: flat,
      isPartial: partial,
      // TODO
      fieldPath: checkedFields
    });
  };

  var handleSJGClick = function handleSJGClick() {
    if (partial) {
      if (checkedFields == null) return;else if (checkedFields.length === 0) return;
    }

    props.onSjgClick();
  };

  var handleTargetChange = function handleTargetChange(newTarget) {
    setTarget(newTarget);

    if (newTarget === Export["a" /* Export */].Target.OCPMDM) {
      if (fileType === Export["a" /* Export */].FileType.Excel || fileType === Export["a" /* Export */].FileType.XML) {
        setFileType(Export["a" /* Export */].FileType.JSON);
      }

      setFlat(true);
      setPartial(true);
    }
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'column'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      flexGrow: 1,
      textAlign: 'center'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'ConfigView__header'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'export:form',
    defaultMessage: "\u5BFC\u51FA\u5F62\u5F0F"
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'ConfigView__body'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, {
    value: target,
    buttonStyle: "solid",
    onChange: function onChange(e) {
      return handleTargetChange(e.target.value);
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: Export["a" /* Export */].Target.File
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'export:file',
    defaultMessage: "\u6587\u4EF6"
  })))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'ConfigView__header'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'export:file_format',
    defaultMessage: "\u6587\u4EF6\u683C\u5F0F"
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'ConfigView__body'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, {
    value: fileType,
    buttonStyle: "solid",
    onChange: function onChange(e) {
      return setFileType(e.target.value);
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    disabled: target === Export["a" /* Export */].Target.OCPMDM,
    value: Export["a" /* Export */].FileType.Excel
  }, "Excel"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: Export["a" /* Export */].FileType.JSON
  }, "JSON"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    disabled: target === Export["a" /* Export */].Target.OCPMDM || flat,
    value: Export["a" /* Export */].FileType.XML
  }, "XML"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: Export["a" /* Export */].FileType.CSV
  }, "CSV"))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'ConfigView__header'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'export:other',
    defaultMessage: "\u5176\u5B83\u9009\u9879"
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'ConfigView__body'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(checkbox_default.a, {
    disabled: target === Export["a" /* Export */].Target.OCPMDM || !props.singleTemplate,
    onChange: function onChange(e) {
      return setFlat(e.target.checked);
    },
    checked: flat
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'export:2d',
    defaultMessage: "\u4E8C\u7EF4\u5E73\u94FA"
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(checkbox_default.a, {
    disabled: target === Export["a" /* Export */].Target.OCPMDM || !props.singleTemplate,
    onChange: function onChange(e) {
      return handleSetPartial(e.target.checked);
    },
    checked: partial
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'export:by_field',
    defaultMessage: "\u5206\u5B57\u6BB5\u5BFC\u51FA"
  }))), partial && props.templateID != null ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'ConfigView__header'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'export:select_field',
    defaultMessage: "\u9009\u62E9\u5B57\u6BB5"
  })) : null, partial && props.templateID != null ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'ConfigView__body',
    style: {
      textAlign: 'left'
    }
  }, templateContent == null ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(FlexLoading["a" /* FlexLoading */], null) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TemplateFieldTree["a" /* TemplateFieldTree */], {
    style: {
      maxHeight: '480px',
      overflowY: 'scroll'
    },
    allowArrayContent: true,
    mergeChecked: true,
    allowChecked: true,
    showFieldType: true,
    allowChildren: true,
    onChange: handleCheckedFieldsChange,
    template: templateContent,
    checkedFields: checkedFields
  })) : null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      textAlign: 'center',
      margin: '8px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'primary',
    size: 'large',
    style: {
      width: '240px'
    },
    loading: props.loading,
    disabled: props.loading,
    onClick: handleButtonClick
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'export',
    defaultMessage: "\u5BFC\u51FA"
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
    type: 'vertical'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
    type: 'vertical'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'primary',
    size: 'large',
    style: {
      width: '240px'
    },
    loading: props.loading,
    disabled: props.loading,
    onClick: handleSJGClick
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'export:data_view',
    defaultMessage: "\u6570\u636E\u89C2"
  }))));
};
// EXTERNAL MODULE: ./node_modules/antd/lib/icon/style/index.js
var icon_style = __webpack_require__(125);

// EXTERNAL MODULE: ./node_modules/antd/lib/icon/index.js
var icon = __webpack_require__(28);
var icon_default = /*#__PURE__*/__webpack_require__.n(icon);

// EXTERNAL MODULE: ./node_modules/antd/lib/tree/style/index.js
var tree_style = __webpack_require__(288);

// EXTERNAL MODULE: ./node_modules/antd/lib/tree/index.js
var tree = __webpack_require__(109);
var tree_default = /*#__PURE__*/__webpack_require__.n(tree);

// EXTERNAL MODULE: ./utils/ShoppingCart.ts
var ShoppingCart = __webpack_require__(81);

// EXTERNAL MODULE: ./apis/template/GetTemplateNames.ts + 2 modules
var GetTemplateNames = __webpack_require__(460);

// EXTERNAL MODULE: ./apis/Urls.ts
var Urls = __webpack_require__(4);

// CONCATENATED MODULE: ./components/export/CartView.tsx





function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = CartView_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || CartView_unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return CartView_arrayLikeToArray(arr); }

function CartView_slicedToArray(arr, i) { return CartView_arrayWithHoles(arr) || CartView_iterableToArrayLimit(arr, i) || CartView_unsupportedIterableToArray(arr, i) || CartView_nonIterableRest(); }

function CartView_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function CartView_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return CartView_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return CartView_arrayLikeToArray(o, minLen); }

function CartView_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function CartView_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function CartView_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }





var TreeNode = tree_default.a.TreeNode;

var CartView_TreeNodeContent = function TreeNodeContent(props) {
  var handleClick = function handleClick(e) {
    e.stopPropagation();
    props.onDelete();
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      flexGrow: 1,
      overflow: 'hidden'
    }
  }, props.title), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      flexGrow: 0
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(icon_default.a, {
    type: "close",
    onClick: handleClick
  })));
};

var CartView_CartView = function CartView(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState2 = CartView_slicedToArray(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState4 = CartView_slicedToArray(_useState3, 2),
      templateList = _useState4[0],
      setTemplateList = _useState4[1];

  var handleDataSourceChange = function handleDataSourceChange() {
    setLoading(true);
    var tids = ShoppingCart["a" /* Cart */].Instance.GetTemplateList();
    GetTemplateNames["a" /* GetTemplateNames */].apply(void 0, _toConsumableArray(tids)).then(function (value) {
      var newList = tids.map(function (tid) {
        return {
          id: tid,
          title: value.Get(String(tid)),
          data: ShoppingCart["a" /* Cart */].Instance.GetDataList(tid).map(function (id) {
            return {
              id: id,
              title: ShoppingCart["a" /* Cart */].Instance.GetDataTitle(id, tid)
            };
          })
        };
      });
      setTemplateList(newList);
      setLoading(false);
      var count = new Set();
      var remained = props.selected.filter(function (dataID) {
        var _iterator = _createForOfIteratorHelper(newList),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var template = _step.value;

            var _iterator2 = _createForOfIteratorHelper(template.data),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var data = _step2.value;

                if (data.id === dataID) {
                  count.add(template.id);
                  return true;
                }
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        return false;
      });
      props.update(remained, count.size < 2, count.size === 1 ? count.values().next().value : null);
    });
  };

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    handleDataSourceChange();
  }, []);
  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    var add = function add() {
      handleDataSourceChange();
    };

    var remove = function remove() {
      handleDataSourceChange();
    };

    var removeTemplate = function removeTemplate() {
      handleDataSourceChange();
    };

    ShoppingCart["a" /* Cart */].Instance.AddOnAddDataListener(add);
    ShoppingCart["a" /* Cart */].Instance.AddOnRemoveDataListener(remove);
    ShoppingCart["a" /* Cart */].Instance.AddOnRemoveTempalteListener(removeTemplate);
    return function () {
      ShoppingCart["a" /* Cart */].Instance.RemoveOnAddDataListener(add);
      ShoppingCart["a" /* Cart */].Instance.RemoveOnRemoveDataListener(remove);
      ShoppingCart["a" /* Cart */].Instance.RemoveOnRemoveTempalteListener(removeTemplate);
    };
  });

  var handleOnCheck = function handleOnCheck(keys) {
    var tids = keys.filter(function (v) {
      return v.startsWith('t');
    });
    var dids = keys.filter(function (v) {
      return !v.startsWith('t');
    }).map(Number);
    var tid = tids.length === 1 ? Number(tids[0].slice(1)) : null;
    props.update(dids, tids.length < 2, tid);
  };

  var handleDeleteTemplate = function handleDeleteTemplate(tid) {
    ShoppingCart["a" /* Cart */].Instance.RemoveTemplate(tid);
  };

  var handleDeleteData = function handleDeleteData(did, tid) {
    ShoppingCart["a" /* Cart */].Instance.RemoveData(did, tid);
  };

  var handleDataClick = function handleDataClick(e, id) {
    e.stopPropagation();
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      padding: '0 32px'
    }
  }, loading ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(tree_default.a, {
    onCheck: handleOnCheck,
    blockNode: true,
    selectable: false,
    expandedKeys: templateList.map(function (t) {
      return "t".concat(t.id);
    }),
    checkable: true,
    checkedKeys: props.selected.map(String)
  }, templateList.map(function (t) {
    var content = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CartView_TreeNodeContent, {
      title: t.title,
      onDelete: function onDelete() {
        return handleDeleteTemplate(t.id);
      }
    });
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TreeNode, {
      title: content,
      key: "t".concat(t.id)
    }, t.data.map(function (d) {
      var url = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        target: '_blank',
        style: {
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        },
        href: Urls["b" /* default */].storage.show_data(d.id),
        onClick: function onClick(e) {
          return handleDataClick(e, d.id);
        }
      }, ShoppingCart["a" /* Cart */].Instance.GetDataTitle(d.id, t.id));
      var dataContent = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CartView_TreeNodeContent, {
        title: url,
        onDelete: function onDelete() {
          return handleDeleteData(d.id, t.id);
        }
      });
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TreeNode, {
        title: dataContent,
        key: String(d.id)
      });
    }));
  })));
};
// EXTERNAL MODULE: ./components/export/SavedSearchListView.tsx + 1 modules
var SavedSearchListView = __webpack_require__(662);

// EXTERNAL MODULE: ./utils/SavedSearch.ts
var SavedSearch = __webpack_require__(61);

// EXTERNAL MODULE: ./apis/export/ExportData.ts
var ExportData = __webpack_require__(92);

// CONCATENATED MODULE: ./entry/export_data_v2.tsx













function export_data_v2_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = export_data_v2_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function export_data_v2_slicedToArray(arr, i) { return export_data_v2_arrayWithHoles(arr) || export_data_v2_iterableToArrayLimit(arr, i) || export_data_v2_unsupportedIterableToArray(arr, i) || export_data_v2_nonIterableRest(); }

function export_data_v2_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function export_data_v2_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return export_data_v2_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return export_data_v2_arrayLikeToArray(o, minLen); }

function export_data_v2_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function export_data_v2_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function export_data_v2_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
















var export_data_v2_ExportDataEntry = function ExportDataEntry() {
  // 导出来源：搜索/单个数据
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])('data'),
      _useState2 = export_data_v2_slicedToArray(_useState, 2),
      srcType = _useState2[0],
      setSrcType = _useState2[1]; // 购物车的状态


  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState4 = export_data_v2_slicedToArray(_useState3, 2),
      cartSelected = _useState4[0],
      setCartSelected = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState6 = export_data_v2_slicedToArray(_useState5, 2),
      single = _useState6[0],
      setSingle = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState8 = export_data_v2_slicedToArray(_useState7, 2),
      templateID = _useState8[0],
      setTemplateID = _useState8[1]; // 搜索结果列表的状态


  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])('data'),
      _useState10 = export_data_v2_slicedToArray(_useState9, 2),
      searchSelMode = _useState10[0],
      setSearchSelMode = _useState10[1];

  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState12 = export_data_v2_slicedToArray(_useState11, 2),
      searchSelID = _useState12[0],
      setSearchSelID = _useState12[1];

  var _useState13 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState14 = export_data_v2_slicedToArray(_useState13, 2),
      searchSelDataList = _useState14[0],
      setSearchSelDataList = _useState14[1];

  var _useState15 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState16 = export_data_v2_slicedToArray(_useState15, 2),
      searchSelTemplate = _useState16[0],
      setSearchSelTemplate = _useState16[1];

  var _useState17 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState18 = export_data_v2_slicedToArray(_useState17, 2),
      loading = _useState18[0],
      setLoading = _useState18[1];

  var _useState19 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState20 = export_data_v2_slicedToArray(_useState19, 2),
      modalVisible = _useState20[0],
      setModalVisible = _useState20[1];

  var _useState21 = Object(reactfrom_dll_reference_dll_library["useState"])( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null)),
      _useState22 = export_data_v2_slicedToArray(_useState21, 2),
      modalContent = _useState22[0],
      setModalContent = _useState22[1];

  var handleExport = function handleExport(config) {
    setLoading(true);

    var handleResult = function handleResult(result) {
      var content = result.async ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: "/task"
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'export:task',
        defaultMessage: "\u5BFC\u51FA\u4EFB\u52A1\u5DF2\u6DFB\u52A0\uFF0C\u53BB\u4EFB\u52A1\u9875\u9762\u67E5\u770B\u8FDB\u5EA6"
      }))) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: result.result
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'export:task',
        defaultMessage: "\u5BFC\u51FA\u5B8C\u6210\uFF0C\u70B9\u6B64\u4E0B\u8F7D"
      })));
      setModalContent(content);
      setModalVisible(true);
      setLoading(false);
    };

    if (srcType === 'data') {
      // 旧版导出
      if (cartSelected.length === 0) {
        return;
      } // 整体导出


      Object(ExportData["b" /* ExportData2 */])({
        fields: config.isPartial ? config.fieldPath : undefined,
        toOCPMDM: config.target === Export["a" /* Export */].Target.OCPMDM,
        dataIDs: cartSelected,
        format: config.fileType,
        flat: config.isFlat
      }).then(handleResult)["catch"](function () {
        setLoading(false);
      });
    } else {
      // TODO 新版
      if (searchSelMode === 'data') {
        if (searchSelDataList.length === 0) return;
        Object(ExportData["b" /* ExportData2 */])({
          fields: config.isPartial ? config.fieldPath : undefined,
          toOCPMDM: config.target === Export["a" /* Export */].Target.OCPMDM,
          dataIDs: searchSelDataList,
          format: config.fileType,
          flat: config.isFlat
        }).then(handleResult)["catch"](function () {
          setLoading(false);
        });
      } else {
        Object(ExportData["b" /* ExportData2 */])({
          fields: config.isPartial ? config.fieldPath : undefined,
          toOCPMDM: config.target === Export["a" /* Export */].Target.OCPMDM,
          dataIDs: searchSelDataList,
          format: config.fileType,
          flat: config.isFlat,
          query_id: searchSelID,
          tid: searchSelTemplate
        }).then(handleResult)["catch"](function () {
          setLoading(false);
        });
      }
    }
  };

  var handleSJGExport = function handleSJGExport() {
    if (srcType === 'data') {
      // 旧版导出
      if (cartSelected.length === 0) {
        notification_default.a.error({
          message: '数据为空，请先选择数据'
        });

        return;
      } // 整体导出


      Object(ExportData["c" /* ExportSJG */])(cartSelected)["catch"](function (reason) {
        notification_default.a.error({
          message: reason.message
        });
      });
    } else if (searchSelDataList.length === 0) {
      notification_default.a.error({
        message: '数据为空，请先选择数据'
      });

      return;
    } else {
      Object(ExportData["c" /* ExportSJG */])(searchSelDataList)["catch"](function (reason) {
        notification_default.a.error({
          message: reason.message
        });
      });
    }
  };

  var handleCartUpdate = function handleCartUpdate(selected, single, tid) {
    setCartSelected(selected);
    setSingle(single);
    setTemplateID(tid);
  };

  var handleSearchListUpdate = function handleSearchListUpdate(mode, selID, dataList, template) {
    setSearchSelMode(mode);
    setSearchSelID(selID);
    setSearchSelDataList(dataList);
    setSearchSelTemplate(template);
  };

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    var listener = function listener() {
      var all = Object(SavedSearch["b" /* GetAllSavedResult */])();

      var _iterator = export_data_v2_createForOfIteratorHelper(all),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var i = _step.value;

          if (i.id === searchSelID) {
            return;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      setSearchSelID(null);
      setSearchSelMode('data');
      setSearchSelDataList([]);
      setSearchSelTemplate(null);
    };

    Object(SavedSearch["a" /* AddOnChangeListener */])(listener);
    return function () {
      Object(SavedSearch["c" /* RemoveOnChangeListener */])(listener);
    };
  });

  var handleModeChange = function handleModeChange(newMode) {
    setSrcType(newMode);
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeLayout["a" /* MgeLayout */], {
    loginRequired: true,
    reloadOnSwitchLocale: true,
    selectedMenu: NavMenu["a" /* MenuKey */].Export
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Breadcrumb["a" /* Breadcrumb */], {
    items: [Breadcrumb["a" /* Breadcrumb */].MGED, Breadcrumb["a" /* Breadcrumb */].MDB, Breadcrumb["a" /* Breadcrumb */].DataExport]
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Container["a" /* Container */], null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(FormPage["a" /* FormPage */], {
    style: {
      display: 'flex',
      flexDirection: 'column'
    },
    title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'export:data',
      defaultMessage: "\u6570\u636E\u5BFC\u51FA"
    })
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, {
    style: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'row'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
    span: 12,
    style: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      textAlign: 'center',
      margin: '8px 0'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, {
    buttonStyle: 'solid',
    value: srcType,
    onChange: function onChange(e) {
      return handleModeChange(e.target.value);
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: 'data'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'data',
    defaultMessage: "\u6570\u636E"
  }), " "), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: 'search'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'search:result',
    defaultMessage: "\u641C\u7D22\u7ED3\u679C"
  })))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, srcType === 'data' ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CartView_CartView, {
    selected: cartSelected,
    update: handleCartUpdate
  }) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SavedSearchListView["a" /* SavedSearchListView */], {
    update: handleSearchListUpdate,
    mode: searchSelMode,
    selected: searchSelID,
    dataList: searchSelDataList,
    template: searchSelTemplate
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
    span: 12,
    style: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ConfigView_ConfigView, {
    onExportClick: handleExport,
    singleTemplate: srcType === 'data' ? single : searchSelTemplate !== null,
    loading: loading,
    onSjgClick: handleSJGExport,
    templateID: srcType === 'data' ? templateID : searchSelTemplate
  }))))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'export:success',
      defaultMessage: "\u5BFC\u51FA\u6210\u529F"
    }),
    visible: modalVisible,
    footer: [/*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      onClick: function onClick() {
        setModalVisible(false);
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'ok',
      defaultMessage: "\u786E\u8BA4"
    }))]
  }, modalContent));
};

react_domfrom_dll_reference_dll_library_default.a.render( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(export_data_v2_ExportDataEntry, null), document.getElementById('wrap'));

/***/ }),

/***/ 59:
/***/ (function(module, exports) {

module.exports = dll_library;

/***/ }),

/***/ 662:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* binding */ SavedSearchListView_SavedSearchListView; });

// EXTERNAL MODULE: delegated ./node_modules/react/index.js from dll-reference dll_library
var reactfrom_dll_reference_dll_library = __webpack_require__(0);
var reactfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(reactfrom_dll_reference_dll_library);

// EXTERNAL MODULE: ./utils/SavedSearch.ts
var SavedSearch = __webpack_require__(61);

// EXTERNAL MODULE: ./node_modules/react-intl/lib/index.es.js + 1 modules
var index_es = __webpack_require__(2);

// EXTERNAL MODULE: ./apis/Urls.ts
var Urls = __webpack_require__(4);

// EXTERNAL MODULE: ./node_modules/antd/lib/radio/style/index.js
var style = __webpack_require__(117);

// EXTERNAL MODULE: ./node_modules/antd/lib/radio/index.js
var lib_radio = __webpack_require__(25);
var radio_default = /*#__PURE__*/__webpack_require__.n(lib_radio);

// EXTERNAL MODULE: ./node_modules/antd/lib/checkbox/style/index.js
var checkbox_style = __webpack_require__(129);

// EXTERNAL MODULE: ./node_modules/antd/lib/checkbox/index.js
var lib_checkbox = __webpack_require__(50);
var checkbox_default = /*#__PURE__*/__webpack_require__.n(lib_checkbox);

// EXTERNAL MODULE: ./apis/search/v2/Query.ts + 1 modules
var Query = __webpack_require__(9);

// EXTERNAL MODULE: ./components/common/FlexLoading.tsx
var FlexLoading = __webpack_require__(66);

// CONCATENATED MODULE: ./components/export/SearchItem.tsx





function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }







var radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px'
};
var SearchItem_SearchItem = function SearchItem(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState2 = _slicedToArray(_useState, 2),
      download = _useState2[0],
      setDownload = _useState2[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    Object(Query["g" /* GetQueryDownload */])(props.value.id).then(function (value) {
      setDownload(value);
    });
  }, []);
  var borderColor = props.selected ? '#1890ff' : '#E9E9E9';

  var handleButtonClick = function handleButtonClick(e) {
    e.stopPropagation();
  };

  var handleDelete = function handleDelete(e) {
    e.stopPropagation();
    Object(SavedSearch["d" /* RemoveSearchResult */])(props.value.id);
  };

  var handleRadioChange = function handleRadioChange(e) {
    e.stopPropagation();
    props.update('template', [], e.target.value);
  };

  var handleCheckboxChange = function handleCheckboxChange(id, value, t) {
    var s = new Set(props.selectedDataList);
    if (value) s.add(id);else s["delete"](id);
    var templates = new Set([]);

    var _iterator = _createForOfIteratorHelper(download.download.data.include),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var i = _step.value;

        if (s.has(i.id)) {
          templates.add(i.template);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    if (templates.size > 1) {
      props.update('data', Array.from(s), null);
    } else {
      props.update('data', Array.from(s), Array.from(templates)[0]);
    }
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      margin: '8px 0',
      padding: '8px',
      border: "2px solid ".concat(borderColor),
      borderRadius: '4px',
      cursor: 'pointer',
      position: 'relative'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    onClick: props.onClick
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
    style: {
      fontWeight: 'bold'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'data:keywords',
    defaultMessage: "\u5173\u952E\u8BCD"
  }), " "), "\uFF1A", props.value.value, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
    style: {
      "float": 'right',
      color: 'red',
      marginLeft: '8px'
    },
    href: 'javascript:void(0)',
    onClick: handleDelete
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'dash:delete',
    defaultMessage: "\u5220\u9664"
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
    style: {
      "float": 'right'
    },
    target: '_blank',
    href: "".concat(Urls["b" /* default */].search.index, "#/").concat(props.value.id, "/"),
    onClick: handleButtonClick
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'export:view',
    defaultMessage: "\u67E5\u770B"
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      height: props.selected ? 'auto' : '0',
      transition: 'height 0.3s ease-in-out',
      overflow: 'hidden'
    }
  }, props.selected ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, download == null ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(FlexLoading["a" /* FlexLoading */], null) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'data',
    defaultMessage: "\u6570\u636E"
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, download.download.data.include.map(function (value) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(checkbox_default.a, {
      onChange: function onChange(e) {
        return handleCheckboxChange(value.id, e.target.checked, value.template);
      },
      key: value.id,
      style: {
        display: 'block',
        marginLeft: 0
      },
      checked: props.selectedDataList.includes(value.id)
    }, value.title, "/", value.id);
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'template',
    defaultMessage: "\u6A21\u677F"
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, {
    value: props.selectedTemplate,
    onChange: handleRadioChange
  }, download.download.template.include.map(function (value) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a, {
      style: radioStyle,
      key: value.id,
      value: value.id
    }, value.title);
  }))))) : null));
};
// CONCATENATED MODULE: ./components/export/SavedSearchListView.tsx
function SavedSearchListView_slicedToArray(arr, i) { return SavedSearchListView_arrayWithHoles(arr) || SavedSearchListView_iterableToArrayLimit(arr, i) || SavedSearchListView_unsupportedIterableToArray(arr, i) || SavedSearchListView_nonIterableRest(); }

function SavedSearchListView_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function SavedSearchListView_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return SavedSearchListView_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return SavedSearchListView_arrayLikeToArray(o, minLen); }

function SavedSearchListView_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function SavedSearchListView_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function SavedSearchListView_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }






var SavedSearchListView_SavedSearchListView = function SavedSearchListView(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = SavedSearchListView_slicedToArray(_useState, 2),
      list = _useState2[0],
      setList = _useState2[1];

  var handleClick = function handleClick(id) {
    props.update('data', id, [], null);
  };

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setList(Object(SavedSearch["b" /* GetAllSavedResult */])());
  }, []);
  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    var listener = function listener() {
      setList(Object(SavedSearch["b" /* GetAllSavedResult */])());
    };

    Object(SavedSearch["a" /* AddOnChangeListener */])(listener);
    return function () {
      Object(SavedSearch["c" /* RemoveOnChangeListener */])(listener);
    };
  });

  var handleUpdate = function handleUpdate(mode, dataList, template) {
    props.update(mode, props.selected, dataList, template);
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      margin: '16px'
    }
  }, list.length !== 0 ? null : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
    href: Urls["b" /* default */].search.index
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'export:add',
    defaultMessage: "\u53BB\u641C\u7D22\u9875\u9762\u6DFB\u52A0\u66F4\u591A\u6570\u636E"
  }))), list.map(function (value) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SearchItem_SearchItem, {
      key: value.id,
      update: value.id === props.selected ? handleUpdate : function () {},
      selectedTemplate: value.id === props.selected ? props.template : null,
      selectedDataList: value.id === props.selected ? props.dataList : [],
      onClick: function onClick() {
        return handleClick(value.id);
      },
      value: value,
      selected: props.selected === value.id
    });
  }));
};

/***/ }),

/***/ 90:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Export; });
var Export;

(function (Export) {
  var Target;

  (function (Target) {
    Target[Target["File"] = 0] = "File";
    Target[Target["OCPMDM"] = 1] = "OCPMDM";
  })(Target = Export.Target || (Export.Target = {}));

  var FileType;

  (function (FileType) {
    FileType["Excel"] = "XLSX";
    FileType["JSON"] = "JSON";
    FileType["XML"] = "XML";
    FileType["CSV"] = "CSV";
  })(FileType = Export.FileType || (Export.FileType = {}));
})(Export || (Export = {}));

/***/ })

/******/ });