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
/******/ 		12: 0
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
/******/ 	deferredModules.push([1789,0]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 1789:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85);
__webpack_require__(86);
__webpack_require__(87);
module.exports = __webpack_require__(1847);


/***/ }),

/***/ 1790:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1847:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/antd/lib/radio/style/index.js
var style = __webpack_require__(117);

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

// EXTERNAL MODULE: ./node_modules/antd/lib/modal/style/index.js
var modal_style = __webpack_require__(45);

// EXTERNAL MODULE: ./node_modules/antd/lib/modal/index.js
var modal = __webpack_require__(15);
var modal_default = /*#__PURE__*/__webpack_require__.n(modal);

// EXTERNAL MODULE: delegated ./node_modules/react/index.js from dll-reference dll_library
var reactfrom_dll_reference_dll_library = __webpack_require__(0);
var reactfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(reactfrom_dll_reference_dll_library);

// EXTERNAL MODULE: delegated ./node_modules/react-dom/index.js from dll-reference dll_library
var react_domfrom_dll_reference_dll_library = __webpack_require__(11);
var react_domfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(react_domfrom_dll_reference_dll_library);

// EXTERNAL MODULE: ./node_modules/react-intl/lib/index.es.js + 1 modules
var index_es = __webpack_require__(2);

// EXTERNAL MODULE: ./components/layout/Container.tsx
var Container = __webpack_require__(79);

// EXTERNAL MODULE: ./components/layout/FormPage.tsx
var FormPage = __webpack_require__(263);

// EXTERNAL MODULE: ./components/layout/20mge/MGELayout_20.tsx + 2 modules
var MGELayout_20 = __webpack_require__(661);

// EXTERNAL MODULE: ./components/layout/NavMenu.tsx
var NavMenu = __webpack_require__(120);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/style/index.js
var button_style = __webpack_require__(32);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/index.js
var lib_button = __webpack_require__(5);
var button_default = /*#__PURE__*/__webpack_require__.n(lib_button);

// EXTERNAL MODULE: ./apis/define/Export.ts
var Export = __webpack_require__(90);

// EXTERNAL MODULE: ./components/export/mge20/ConfigView.less
var mge20_ConfigView = __webpack_require__(1790);

// EXTERNAL MODULE: ./apis/template/Get.ts
var Get = __webpack_require__(65);

// EXTERNAL MODULE: ./node_modules/antd/lib/tree/style/index.js
var tree_style = __webpack_require__(288);

// EXTERNAL MODULE: ./node_modules/antd/lib/tree/index.js
var tree = __webpack_require__(109);
var tree_default = /*#__PURE__*/__webpack_require__.n(tree);

// EXTERNAL MODULE: ./apis/export/ExportData.ts
var ExportData = __webpack_require__(92);

// CONCATENATED MODULE: ./components/export/mge20/PathModal.tsx







function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



var TreeNode = tree_default.a.TreeNode;

function GetPath(origin_data, path, res) {
  var result = [];
  origin_data.map(function (item) {
    if (item.path === path) {
      item.children = res;
    }

    result.push(item);
  });
  origin_data.map(function (item) {
    if (item.children) {
      return GetPath(item.children, path, res);
    }
  });
  return result;
}

var PathModal_PathModal = function PathModal(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = _slicedToArray(_useState, 2),
      pathList = _useState2[0],
      setPathList = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState4 = _slicedToArray(_useState3, 2),
      selectedPath = _useState4[0],
      setSelectedPath = _useState4[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    Object(ExportData["d" /* GetSavePath */])(props.token).then(function (res) {
      setPathList(res);
    });
  }, []);

  var handleExpand = function handleExpand(expandKeys) {
    var path = expandKeys[expandKeys.length - 1];
    Object(ExportData["d" /* GetSavePath */])(props.token, path).then(function (res) {
      var temp = pathList;
      temp.map(function (item) {
        if (path === item.path) {
          item.children = res;
        }
      });

      if (temp.length >= 1) {
        setPathList([]);
        setPathList(temp);
      }
    });
  };

  var renderTree = function renderTree(data) {
    return data.map(function (item) {
      if (item.children) {
        return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TreeNode, {
          title: item.name,
          key: item.path,
          selectable: !item.isLeaf
        }, renderTree(item.children));
      } else {
        return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TreeNode, {
          title: item.name,
          key: item.path,
          isLeaf: item.isLeaf,
          selectable: !item.isLeaf
        });
      }
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    visible: props.visible,
    onCancel: props.onCancel,
    footer: [/*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      onClick: props.onCancel
    }, "\u53D6\u6D88"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      type: 'primary',
      disabled: selectedPath == null
    }, "\u786E\u8BA4")]
  }, pathList && /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(tree_default.a, {
    onExpand: function onExpand(expandedKeys) {
      handleExpand(expandedKeys);
    },
    onSelect: function onSelect(selectedKeys) {
      setSelectedPath(selectedKeys[0]);
    }
  }, renderTree(pathList)));
};
// CONCATENATED MODULE: ./components/export/mge20/ConfigView.tsx



function ConfigView_slicedToArray(arr, i) { return ConfigView_arrayWithHoles(arr) || ConfigView_iterableToArrayLimit(arr, i) || ConfigView_unsupportedIterableToArray(arr, i) || ConfigView_nonIterableRest(); }

function ConfigView_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function ConfigView_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return ConfigView_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ConfigView_arrayLikeToArray(o, minLen); }

function ConfigView_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ConfigView_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function ConfigView_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }






var ConfigView_ConfigView = function ConfigView(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(Export["a" /* Export */].Target.File),
      _useState2 = ConfigView_slicedToArray(_useState, 2),
      target = _useState2[0],
      setTarget = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(Export["a" /* Export */].FileType.Excel),
      _useState4 = ConfigView_slicedToArray(_useState3, 2),
      fileType = _useState4[0],
      setFileType = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState6 = ConfigView_slicedToArray(_useState5, 2),
      flat = _useState6[0],
      setFlat = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState8 = ConfigView_slicedToArray(_useState7, 2),
      partial = _useState8[0],
      setPartial = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState10 = ConfigView_slicedToArray(_useState9, 2),
      templateContent = _useState10[0],
      setTemplateContent = _useState10[1];

  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState12 = ConfigView_slicedToArray(_useState11, 2),
      checkedFields = _useState12[0],
      setCheckedFields = _useState12[1];

  var _useState13 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState14 = ConfigView_slicedToArray(_useState13, 2),
      modalVisible = _useState14[0],
      setModalVisible = _useState14[1];

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

  var handleSave_20 = function handleSave_20() {
    setModalVisible(true);
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
      textAlign: 'center',
      margin: '8px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'primary',
    size: 'large',
    style: {
      width: '180px',
      marginRight: '20px'
    },
    loading: props.loading,
    disabled: props.loading,
    onClick: handleSave_20
  }, "\u4FDD\u5B58\u5230\u7528\u6237\u7A7A\u95F4"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'primary',
    size: 'large',
    style: {
      width: '180px'
    },
    href: '../search_20/'
  }, " \u8FD4\u56DE\u641C\u7D22\u9875\u9762")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(PathModal_PathModal, {
    visible: modalVisible,
    onCancel: function onCancel() {
      setModalVisible(false);
    },
    token: props.token
  }));
};
// EXTERNAL MODULE: ./node_modules/antd/lib/icon/style/index.js
var icon_style = __webpack_require__(125);

// EXTERNAL MODULE: ./node_modules/antd/lib/icon/index.js
var icon = __webpack_require__(28);
var icon_default = /*#__PURE__*/__webpack_require__.n(icon);

// EXTERNAL MODULE: ./utils/ShoppingCart.ts
var ShoppingCart = __webpack_require__(81);

// EXTERNAL MODULE: ./apis/template/GetTemplateNames.ts + 2 modules
var GetTemplateNames = __webpack_require__(460);

// EXTERNAL MODULE: ./apis/Urls.ts
var Urls = __webpack_require__(4);

// CONCATENATED MODULE: ./components/export/mge20/CartView.tsx





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





var CartView_TreeNode = tree_default.a.TreeNode;

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
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CartView_TreeNode, {
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
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CartView_TreeNode, {
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

// CONCATENATED MODULE: ./entry/export_20.tsx











function export_20_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = export_20_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function export_20_slicedToArray(arr, i) { return export_20_arrayWithHoles(arr) || export_20_iterableToArrayLimit(arr, i) || export_20_unsupportedIterableToArray(arr, i) || export_20_nonIterableRest(); }

function export_20_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function export_20_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return export_20_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return export_20_arrayLikeToArray(o, minLen); }

function export_20_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function export_20_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function export_20_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }















var export_20_ExportDataEntry = function ExportDataEntry() {
  // 导出来源：搜索/单个数据
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])('data'),
      _useState2 = export_20_slicedToArray(_useState, 2),
      srcType = _useState2[0],
      setSrcType = _useState2[1]; // 购物车的状态


  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState4 = export_20_slicedToArray(_useState3, 2),
      cartSelected = _useState4[0],
      setCartSelected = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState6 = export_20_slicedToArray(_useState5, 2),
      single = _useState6[0],
      setSingle = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState8 = export_20_slicedToArray(_useState7, 2),
      templateID = _useState8[0],
      setTemplateID = _useState8[1]; // 搜索结果列表的状态


  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])('data'),
      _useState10 = export_20_slicedToArray(_useState9, 2),
      searchSelMode = _useState10[0],
      setSearchSelMode = _useState10[1];

  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState12 = export_20_slicedToArray(_useState11, 2),
      searchSelID = _useState12[0],
      setSearchSelID = _useState12[1];

  var _useState13 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState14 = export_20_slicedToArray(_useState13, 2),
      searchSelDataList = _useState14[0],
      setSearchSelDataList = _useState14[1];

  var _useState15 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState16 = export_20_slicedToArray(_useState15, 2),
      searchSelTemplate = _useState16[0],
      setSearchSelTemplate = _useState16[1];

  var _useState17 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState18 = export_20_slicedToArray(_useState17, 2),
      loading = _useState18[0],
      setLoading = _useState18[1];

  var _useState19 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState20 = export_20_slicedToArray(_useState19, 2),
      token = _useState20[0],
      setToken = _useState20[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    var test = 'http://mged.nmdms.ustb.edu.cn/search/?' + 'Authorization=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Imhhcm9sZDcyMzNAaG90bWFpbC5jb20ifQ.YHLDY4i8R8UDt_z-PQCHdkNSv9-a4aAKSAfbAKVDbeU'; // const token = window.location.pathname.split('/').pop()

    var token = test.split('=').pop();
    setToken(token);
  }, []);

  var handleExport = function handleExport(config) {
    setLoading(true);

    var handleResult = function handleResult(result) {
      var content = result.async ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, "\u5BFC\u51FA\u4EFB\u52A1\u5DF2\u6DFB\u52A0\uFF0C\u53BB", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: "/task"
      }, "\u4EFB\u52A1"), "\u9875\u9762\u67E5\u770B\u8FDB\u5EA6") : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, "\u5BFC\u51FA\u5B8C\u6210\uFF0C", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: result.result
      }, "\u70B9\u6B64"), "\u4E0B\u8F7D");

      modal_default.a.success({
        title: '导出成功',
        content: content
      });

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

      var _iterator = export_20_createForOfIteratorHelper(all),
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

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MGELayout_20["a" /* MgeLayout */], {
    reloadOnSwitchLocale: true,
    selectedMenu: NavMenu["a" /* MenuKey */].Export,
    noFooter: true
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Container["a" /* Container */], null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(FormPage["a" /* FormPage */], {
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
  }, "\u6570\u636E"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: 'search'
  }, "\u641C\u7D22\u7ED3\u679C"))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, srcType === 'data' ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CartView_CartView, {
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
  }, token != null ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ConfigView_ConfigView, {
    token: token,
    onExportClick: handleExport,
    singleTemplate: srcType === 'data' ? single : searchSelTemplate !== null,
    loading: loading,
    onSjgClick: handleSJGExport,
    templateID: srcType === 'data' ? templateID : searchSelTemplate
  }) : null)))));
};

react_domfrom_dll_reference_dll_library_default.a.render( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(export_20_ExportDataEntry, null), document.getElementById('wrap'));

/***/ }),

/***/ 59:
/***/ (function(module, exports) {

module.exports = dll_library;

/***/ }),

/***/ 661:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* binding */ MGELayout_20_MgeLayout; });

// EXTERNAL MODULE: ./node_modules/antd/lib/button/style/index.js
var style = __webpack_require__(32);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/index.js
var lib_button = __webpack_require__(5);
var button_default = /*#__PURE__*/__webpack_require__.n(lib_button);

// EXTERNAL MODULE: ./node_modules/antd/lib/notification/style/index.js
var notification_style = __webpack_require__(60);

// EXTERNAL MODULE: ./node_modules/antd/lib/notification/index.js
var notification = __webpack_require__(10);
var notification_default = /*#__PURE__*/__webpack_require__.n(notification);

// EXTERNAL MODULE: ./node_modules/antd/lib/layout/style/index.js
var layout_style = __webpack_require__(203);

// EXTERNAL MODULE: ./node_modules/antd/lib/layout/index.js
var layout = __webpack_require__(80);
var layout_default = /*#__PURE__*/__webpack_require__.n(layout);

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(16);

// EXTERNAL MODULE: delegated ./node_modules/react/index.js from dll-reference dll_library
var reactfrom_dll_reference_dll_library = __webpack_require__(0);
var reactfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(reactfrom_dll_reference_dll_library);

// EXTERNAL MODULE: ./node_modules/core-decorators/es/core-decorators.js + 19 modules
var core_decorators = __webpack_require__(17);

// EXTERNAL MODULE: ./node_modules/react-intl/lib/index.es.js + 1 modules
var index_es = __webpack_require__(2);

// EXTERNAL MODULE: ./node_modules/react-responsive/dist/react-responsive.js
var react_responsive = __webpack_require__(425);
var react_responsive_default = /*#__PURE__*/__webpack_require__.n(react_responsive);

// EXTERNAL MODULE: ./apis/session/Info.ts
var Info = __webpack_require__(83);

// EXTERNAL MODULE: ./apis/Urls.ts
var Urls = __webpack_require__(4);

// EXTERNAL MODULE: ./components/context/session.tsx
var session = __webpack_require__(157);

// EXTERNAL MODULE: ./components/layout/MgeMenu.tsx
var MgeMenu = __webpack_require__(54);

// CONCATENATED MODULE: ./components/layout/20mge/NavMenu.tsx
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





var MenuKey;

(function (MenuKey) {
  MenuKey["Index"] = "index";
  MenuKey["Upload"] = "upload";
  MenuKey["Export"] = "export";
  MenuKey["Analytics"] = "analytics";
  MenuKey["Help"] = "help";
})(MenuKey || (MenuKey = {}));

var NavMenu_menu = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeMenu["c" /* SubMenuItem */], {
  href: Urls["b" /* default */].storage.upload_data
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'data',
  defaultMessage: "\u6570\u636E"
})), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeMenu["c" /* SubMenuItem */], {
  href: Urls["b" /* default */].storage.create_template
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'template',
  defaultMessage: "\u6A21\u677F"
})));
var exportdata = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeMenu["c" /* SubMenuItem */], {
  href: '/export_data20'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'export',
  defaultMessage: "\u6570\u636E\u5BFC\u51FA"
})));
var analytics = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeMenu["c" /* SubMenuItem */], {
  href: Urls["b" /* default */].analytics.index
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'analytics:category',
  defaultMessage: "\u5206\u7C7B\u6570\u636E\u7EDF\u8BA1"
})), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeMenu["c" /* SubMenuItem */], {
  href: Urls["b" /* default */].analytics.project_analytics
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'analytics:project',
  defaultMessage: "\u9879\u76EE\u6570\u636E\u7EDF\u8BA1"
})));

function openTalking() {
  window.open('https://www.talkinggenie.com/h5/?param=C6776126512242061312', '', 'width=600,height=800,toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes');
}

var help = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeMenu["c" /* SubMenuItem */], {
  href: Urls["b" /* default */].site_help
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help',
  defaultMessage: "\u5E2E\u52A9\u6587\u6863"
})), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeMenu["c" /* SubMenuItem */], {
  onClick: openTalking
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'talking',
  defaultMessage: "\u667A\u80FD\u5BA2\u670D"
})));
var NavMenu_NavMenu = /*#__PURE__*/function (_Component) {
  _inherits(NavMenu, _Component);

  var _super = _createSuper(NavMenu);

  function NavMenu() {
    _classCallCheck(this, NavMenu);

    return _super.apply(this, arguments);
  }

  _createClass(NavMenu, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeMenu["a" /* Menu */], {
        className: this.props.className,
        style: this.props.style
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeMenu["b" /* MenuItem */], {
        overlay: exportdata,
        selected: this.props.selected === MenuKey.Export
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'export',
        defaultMessage: "\u5BFC\u51FA"
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeMenu["b" /* MenuItem */], {
        overlayStyle: {
          width: 132
        },
        selected: this.props.selected === MenuKey.Analytics
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'analytics',
        defaultMessage: "\u8FDB\u5EA6"
      })));
    }
  }]);

  return NavMenu;
}(reactfrom_dll_reference_dll_library["Component"]);
// EXTERNAL MODULE: ./utils/GenerateUniqueID.ts
var GenerateUniqueID = __webpack_require__(151);

// EXTERNAL MODULE: ./components/layout/IntlWrapper.tsx
var IntlWrapper = __webpack_require__(451);

// EXTERNAL MODULE: ./node_modules/antd/lib/tooltip/style/index.js
var tooltip_style = __webpack_require__(138);

// EXTERNAL MODULE: ./node_modules/antd/lib/tooltip/index.js
var tooltip = __webpack_require__(64);
var tooltip_default = /*#__PURE__*/__webpack_require__.n(tooltip);

// EXTERNAL MODULE: ./node_modules/react-jss/dist/react-jss.esm.js + 25 modules
var react_jss_esm = __webpack_require__(67);

// EXTERNAL MODULE: ./apis/service/UserVisits.ts
var UserVisits = __webpack_require__(452);

// EXTERNAL MODULE: ./apis/service/UserOnline.ts
var UserOnline = __webpack_require__(453);

// CONCATENATED MODULE: ./components/layout/20mge/MgeFooter_20.tsx





function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }







var Footer = layout_default.a.Footer;
var styles = {
  Footer: {
    textAlign: 'center',
    background: '#1A242F',
    color: '#FFF',
    minWidth: '700px'
  },
  brand: {
    fontSize: '16px',
    '& p': {
      marginBottom: '18px'
    },
    '& a': {
      color: '#00a8ff'
    }
  },
  intro: {
    fontSize: '18px',
    '& li': {
      display: 'inline',
      borderRight: 'white solid',
      borderRightWidth: '1px',
      padding: '0 48px',
      '&:last-child': {
        borderRight: 'none'
      },
      '& a': {
        textDecoration: 'none',
        color: '#fff'
      }
    }
  }
};

var MgeFooter_20_MgeFooter = function _MgeFooter(_ref) {
  var classes = _ref.classes;

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState2 = _slicedToArray(_useState, 2),
      visitCount = _useState2[0],
      setVisitCount = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState4 = _slicedToArray(_useState3, 2),
      onlineCount = _useState4[0],
      setOnlineCount = _useState4[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    Object(UserVisits["a" /* UserVisits */])().then(function (value) {
      setVisitCount(value);
    });
    Object(UserOnline["a" /* UserOnline */])().then(function (value) {
      setOnlineCount(value);
    });
  }, []);
  var date = new Date();
  var year = date.getFullYear();
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Footer, {
    className: classes.Footer
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("ul", {
    className: classes.intro
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("li", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
    href: Urls["b" /* default */].about
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'footer:about',
    defaultMessage: "\u5173\u4E8E"
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("li", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
    href: '/docs/'
  }, "API")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("li", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
    href: '/update'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'footer:update',
    defaultMessage: "\u66F4\u65B0\u65E5\u5FD7"
  })))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: classes.brand
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, " ", year, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'footer:copyright',
    defaultMessage: "\u7248\u6743\u6240\u6709"
  }), "Copyright\xA9", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
    href: Urls["b" /* default */].site_index
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'MGED',
    defaultMessage: "\u56FD\u5BB6\u6750\u6599\u57FA\u56E0\u5DE5\u7A0B\u6570\u636E\u6C47\u4EA4\u4E0E\u7BA1\u7406\u670D\u52A1\u6280\u672F\u5E73\u53F0"
  })))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'online_count',
    defaultMessage: "\u5728\u7EBF\u4EBA\u6570\uFF1A"
  }), " ", onlineCount, " ", "\xA0\xA0", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'visits',
    defaultMessage: "\u7D2F\u8BA1\u8BBF\u95EE\u91CF\uFF1A"
  }), visitCount, " ", "\xA0\xA0", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(tooltip_default.a, {
    title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, "\u8BBF\u95EEMGE\u7CFB\u7EDF\u7684\u4E0D\u540CIP\u5730\u5740\u7684\u4EBA\u6570"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, "\u540C\u4E00\u5929\u5185\u53EA\u8BB0\u5F55\u7B2C\u4E00\u6B21\u8FDB\u5165\u7F51\u7AD9\u7684\u5177\u6709\u72EC\u7ACBIP\u7684\u8BBF\u95EE\u8005\uFF0C\u5728\u540C\u4E00\u5929\u5185\u518D\u6B21\u8BBF\u95EE\u8BE5\u7F51\u7AD9\u5219\u4E0D\u8BA1\u6570\u3002"))
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("i", {
    className: "fa fa-question-circle",
    "aria-hidden": "true"
  }))));
};

var MgeFooter = Object(react_jss_esm["a" /* default */])(styles)(MgeFooter_20_MgeFooter);
// EXTERNAL MODULE: ./apis/user/ConfirmNotifications.ts
var user_ConfirmNotifications = __webpack_require__(456);

// EXTERNAL MODULE: ./components/layout/20mge/MGELayout_20.less
var MGELayout_20 = __webpack_require__(856);

// CONCATENATED MODULE: ./components/layout/20mge/MGELayout_20.tsx
function MGELayout_20_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { MGELayout_20_typeof = function _typeof(obj) { return typeof obj; }; } else { MGELayout_20_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return MGELayout_20_typeof(obj); }








function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function MGELayout_20_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function MGELayout_20_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function MGELayout_20_createClass(Constructor, protoProps, staticProps) { if (protoProps) MGELayout_20_defineProperties(Constructor.prototype, protoProps); if (staticProps) MGELayout_20_defineProperties(Constructor, staticProps); return Constructor; }

function MGELayout_20_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) MGELayout_20_setPrototypeOf(subClass, superClass); }

function MGELayout_20_setPrototypeOf(o, p) { MGELayout_20_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return MGELayout_20_setPrototypeOf(o, p); }

function MGELayout_20_createSuper(Derived) { var hasNativeReflectConstruct = MGELayout_20_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = MGELayout_20_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = MGELayout_20_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return MGELayout_20_possibleConstructorReturn(this, result); }; }

function MGELayout_20_possibleConstructorReturn(self, call) { if (call && (MGELayout_20_typeof(call) === "object" || typeof call === "function")) { return call; } return MGELayout_20_assertThisInitialized(self); }

function MGELayout_20_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function MGELayout_20_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function MGELayout_20_getPrototypeOf(o) { MGELayout_20_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return MGELayout_20_getPrototypeOf(o); }















var Content = layout_default.a.Content;
var MGELayout_20_MgeLayout = /*#__PURE__*/function (_Component) {
  MGELayout_20_inherits(MgeLayout, _Component);

  var _super = MGELayout_20_createSuper(MgeLayout);

  function MgeLayout(props) {
    var _this;

    MGELayout_20_classCallCheck(this, MgeLayout);

    _this = _super.call(this, props);
    _this.state = {
      logged_in: false,
      username: '',
      real_name: '',
      email: '',
      tel: '',
      sex: '',
      avatar: '',
      roles: [],
      roles_for_acceptance: [],
      notifications: [],
      institution: '',
      fetched: false,
      email_verified: false,
      unread_count: 0,
      informUpdate: _this.informUpdate,
      managed_categories: [],
      avatarCount: 0
    };
    return _this;
  }

  MGELayout_20_createClass(MgeLayout, [{
    key: "ConfirmNotifications",
    value: function ConfirmNotifications(key) {
      for (var i = 0; i < this.state.notifications.length; i++) {
        Object(user_ConfirmNotifications["a" /* ConfirmNotif */])(this.state.notifications[i].id);
      }

      notification_default.a.close(key);
    }
  }, {
    key: "informUpdate",
    value: function informUpdate() {
      var _this2 = this;

      this.setState({
        avatarCount: this.state.avatarCount + 1
      });
      Object(Info["a" /* Info */])().then(function (value) {
        _this2.setState(_objectSpread(_objectSpread({}, value), {}, {
          logged_in: true,
          avatar: "".concat(Urls["b" /* default */].api_v1_account.user_avatar(value.username), "?size=large#").concat(_this2.state.avatarCount),
          fetched: true
        }));

        if (value.notifications.length > 0) {
          notification_default.a.config({
            placement: 'bottomRight'
          });

          var key = "open".concat(Date.now());

          notification_default.a.open({
            message: '通告',
            duration: null,
            description: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("ol", null, value.notifications.map(function (value_not) {
              return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("li", null, value_not.content);
            }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
              type: 'primary',
              onClick: function onClick() {
                return _this2.ConfirmNotifications(key);
              }
            }, "\u6211\u5DF2\u4E86\u89E3 \u4E0D\u518D\u663E\u793A")),
            key: key,
            onClose: close
          });
        }
      })["catch"](function () {
        _this2.setState({
          logged_in: false,
          fetched: true
        });
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.informUpdate();
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var titleWriter = null;

      if (this.props.titleID) {
        titleWriter = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
          key: Object(GenerateUniqueID["a" /* GenerateUniqueID */])(),
          id: this.props.titleID,
          defaultMessage: this.props.defaultTitle
        }, function (msg) {
          document.title = msg;
          return null;
        });
      }

      var menu = this.props.indexOnly ? null : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(NavMenu_NavMenu, {
        selected: this.props.selectedMenu
      });
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(IntlWrapper["a" /* IntlWrapper */], {
        reloadOnSwitch: this.props.reloadOnSwitchLocale
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(session["a" /* SessionContext */].Provider, {
        value: this.state
      }, titleWriter, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(session["a" /* SessionContext */].Consumer, null, function (value) {
        if (value.fetched && !value.logged_in && _this3.props.loginRequired) {
          // window.location.href = Urls.account.login + '?next=' + window.location.pathname;
          window.location.href = Urls["b" /* default */].account.login_18;
        }

        return null;
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(layout_default.a, {
        style: {
          minWidth: '700px'
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Content, {
        className: 'MgeLayout__content',
        style: this.props.contentStyle == null ? {
          minWidth: '700px'
        } : Object.assign(this.props.contentStyle, {
          minWidth: '700px'
        })
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_responsive_default.a, {
        maxWidth: 1223
      }, this.props.indexOnly ? null : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'MgeLayout__block-menu'
      })), this.props.children), this.props.noFooter ? null : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeFooter, null))));
    }
  }]);

  return MgeLayout;
}(reactfrom_dll_reference_dll_library["Component"]);

Object(tslib_es6["a" /* __decorate */])([core_decorators["a" /* autobind */]], MGELayout_20_MgeLayout.prototype, "ConfirmNotifications", null);

Object(tslib_es6["a" /* __decorate */])([core_decorators["a" /* autobind */]], MGELayout_20_MgeLayout.prototype, "informUpdate", null);

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

/***/ 856:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

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