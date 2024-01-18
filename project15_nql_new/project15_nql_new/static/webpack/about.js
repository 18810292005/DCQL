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
/******/ 		1: 0
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
/******/ 	deferredModules.push([1770,0]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 1770:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85);
__webpack_require__(86);
__webpack_require__(87);
module.exports = __webpack_require__(1859);


/***/ }),

/***/ 1859:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/antd/lib/tabs/style/index.js
var style = __webpack_require__(1056);

// EXTERNAL MODULE: ./node_modules/antd/lib/tabs/index.js
var tabs = __webpack_require__(722);
var tabs_default = /*#__PURE__*/__webpack_require__.n(tabs);

// EXTERNAL MODULE: delegated ./node_modules/react/index.js from dll-reference dll_library
var reactfrom_dll_reference_dll_library = __webpack_require__(0);
var reactfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(reactfrom_dll_reference_dll_library);

// EXTERNAL MODULE: delegated ./node_modules/react-dom/index.js from dll-reference dll_library
var react_domfrom_dll_reference_dll_library = __webpack_require__(11);
var react_domfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(react_domfrom_dll_reference_dll_library);

// EXTERNAL MODULE: ./node_modules/react-intl/lib/index.es.js + 1 modules
var index_es = __webpack_require__(2);

// EXTERNAL MODULE: ./node_modules/react-jss/dist/react-jss.esm.js + 25 modules
var react_jss_esm = __webpack_require__(67);

// EXTERNAL MODULE: ./components/layout/Container.tsx
var Container = __webpack_require__(79);

// EXTERNAL MODULE: ./components/layout/MgeLayout.tsx + 7 modules
var MgeLayout = __webpack_require__(48);

// EXTERNAL MODULE: ./apis/Urls.ts
var Urls = __webpack_require__(4);

// CONCATENATED MODULE: ./components/layout/TrainFiles.tsx
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



var TrainFiles_TrainFiles = /*#__PURE__*/function (_Component) {
  _inherits(TrainFiles, _Component);

  var _super = _createSuper(TrainFiles);

  function TrainFiles() {
    _classCallCheck(this, TrainFiles);

    return _super.apply(this, arguments);
  }

  _createClass(TrainFiles, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("h1", null, "\u57F9\u8BAD\u89C6\u9891"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        style: {
          padding: ' 0 0 0 50px'
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: Urls["b" /* default */].training.video_introduction
      }, "\u7B2C\u4E00\u8BB2\uFF1A\u6750\u6599\u57FA\u56E0\u5DE5\u7A0B\u4E13\u7528\u6570\u636E\u5E93\u5E73\u53F0\u529F\u80FD\u4ECB\u7ECD"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: Urls["b" /* default */].training.video_tem1
      }, "\u7B2C\u4E8C\u8BB2\uFF1A\u6A21\u677F\u5B9A\u4E49\uFF08\u4E0A\uFF09"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: Urls["b" /* default */].training.video_tem2
      }, "\u7B2C\u4E8C\u8BB2\uFF1A\u6A21\u677F\u5B9A\u4E49\uFF08\u4E0B\uFF09"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: Urls["b" /* default */].training.video_data
      }, "\u7B2C\u4E09\u8BB2\uFF1A\u6570\u636E\u4E0A\u4F20")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("h1", null, "\u76F8\u5173\u6587\u4EF6\u4E0B\u8F7D"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        style: {
          padding: ' 0 0 0 50px'
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: Urls["b" /* default */].training.file_introduction_PDF
      }, "20200103_\u6570\u636E\u6C47\u4EA4\u89C4\u8303\u4ECB\u7ECD-\u6700\u7EC8\u7248.pdf"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: Urls["b" /* default */].training.file_data_XLSX
      }, "MGE\u7CFB\u7EDF\u6F14\u793A\u6570\u636E.xlsx"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: Urls["b" /* default */].training.file_introduction_PPTX
      }, "\u7B2C\u4E00\u8BB2\uFF1A\u6750\u6599\u57FA\u56E0\u5DE5\u7A0B\u4E13\u7528\u6570\u636E\u5E93\u5E73\u53F0\u529F\u80FD\u4ECB\u7ECD.pptx"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: Urls["b" /* default */].training.file_manual_PDF
      }, "\u6570\u636E\u6C47\u4EA4\u57F9\u8BAD\u4F1A\u624B\u518C.pdf")));
    }
  }]);

  return TrainFiles;
}(reactfrom_dll_reference_dll_library["Component"]);
// CONCATENATED MODULE: ./entry/about.tsx
function about_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { about_typeof = function _typeof(obj) { return typeof obj; }; } else { about_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return about_typeof(obj); }




function about_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function about_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function about_createClass(Constructor, protoProps, staticProps) { if (protoProps) about_defineProperties(Constructor.prototype, protoProps); if (staticProps) about_defineProperties(Constructor, staticProps); return Constructor; }

function about_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) about_setPrototypeOf(subClass, superClass); }

function about_setPrototypeOf(o, p) { about_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return about_setPrototypeOf(o, p); }

function about_createSuper(Derived) { var hasNativeReflectConstruct = about_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = about_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = about_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return about_possibleConstructorReturn(this, result); }; }

function about_possibleConstructorReturn(self, call) { if (call && (about_typeof(call) === "object" || typeof call === "function")) { return call; } return about_assertThisInitialized(self); }

function about_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function about_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function about_getPrototypeOf(o) { about_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return about_getPrototypeOf(o); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }








var t_DatabaseIntroduction = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'about:database_brief',
  defaultMessage: "\u6570\u636E\u5E93\u7B80\u4ECB"
});
var t_ContactUs = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'about:contact_us',
  defaultMessage: "\u8054\u7CFB\u6211\u4EEC"
});
var t_DatabaseInformation = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'about:database_information',
  defaultMessage: "\u6570\u636E\u5E93\u5E93\u4FE1\u606F"
});
var TabPane = tabs_default.a.TabPane;
var styles = {
  Content: {
    margin: 0,
    textIndent: '2rem'
  },
  Title: {
    marginTop: '1rem',
    marginBottom: 0,
    color: '#0066FF'
  }
};

var about_AboutEntry = function _AboutEntry(_ref) {
  var classes = _ref.classes;

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState2 = _slicedToArray(_useState, 2),
      edit_brief = _useState2[0],
      set_edit_brief = _useState2[1]; // 内容是否可编辑


  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState4 = _slicedToArray(_useState3, 2),
      brief_content = _useState4[0],
      set_brief_content = _useState4[1]; // 内容


  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState6 = _slicedToArray(_useState5, 2),
      brief_disabled = _useState6[0],
      set_brief_disabled = _useState6[1]; // 按钮是否有效


  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState8 = _slicedToArray(_useState7, 2),
      brief_background = _useState8[0],
      set_brief_background = _useState8[1]; // 背景颜色


  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState10 = _slicedToArray(_useState9, 2),
      edit_detail = _useState10[0],
      set_edit_detail = _useState10[1]; // 内容是否可编辑


  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState12 = _slicedToArray(_useState11, 2),
      detail_content = _useState12[0],
      set_detail_content = _useState12[1]; // 内容


  var _useState13 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState14 = _slicedToArray(_useState13, 2),
      detail_disabled = _useState14[0],
      set_detail_disabled = _useState14[1]; // 按钮是否有效


  var _useState15 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState16 = _slicedToArray(_useState15, 2),
      detail_background = _useState16[0],
      set_detail_background = _useState16[1]; // 背景颜色


  var handle_edit_brief = function handle_edit_brief() {
    set_edit_brief(true);
    set_brief_disabled(false);
    set_brief_background(false);
  };

  var handle_save_brief = function handle_save_brief() {
    set_brief_content('');
    set_edit_brief(false);
    set_brief_disabled(true);
    set_brief_background(true);
  };

  var handle_edit_detail = function handle_edit_detail() {
    set_edit_detail(true);
    set_detail_disabled(false);
    set_detail_background(false);
  };

  var handle_save_detail = function handle_save_detail() {
    set_detail_content('');
    set_edit_detail(false);
    set_detail_disabled(true);
    set_detail_background(true);
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Container["a" /* Container */], {
    style: {
      marginTop: 80
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(tabs_default.a, {
    defaultActiveKey: "1",
    tabPosition: "left",
    className: "tabs"
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TabPane, {
    tab: t_DatabaseIntroduction,
    key: "1"
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    className: classes.Content
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'about:_1'
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    className: classes.Content
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'about:_2'
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    className: classes.Content
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'about:_3'
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TabPane, {
    tab: t_ContactUs,
    key: "2"
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    className: classes.Title
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'about:_4'
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'about:_5'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'about:_6'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'about:_7'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'about:_8'
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    className: classes.Title
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'about:_9'
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'about:_10'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'about:_11'
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    className: classes.Title
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'about:_12'
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'about:_13'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'about:_14'
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    className: classes.Title
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'about:_15'
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'about:_16'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'about:_17'
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TabPane, {
    tab: "\u57F9\u8BAD\u89C6\u9891\u6587\u4EF6",
    key: '4'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TrainFiles_TrainFiles, null))));
};

var AboutEntry = Object(react_jss_esm["a" /* default */])(styles)(about_AboutEntry);

var about_About = /*#__PURE__*/function (_Component) {
  about_inherits(About, _Component);

  var _super = about_createSuper(About);

  function About() {
    about_classCallCheck(this, About);

    return _super.apply(this, arguments);
  }

  about_createClass(About, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeLayout["a" /* MgeLayout */], {
        titleID: 'about',
        defaultTitle: "\u5173\u4E8EMGEDATA"
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(AboutEntry, null));
    }
  }]);

  return About;
}(reactfrom_dll_reference_dll_library["Component"]);

react_domfrom_dll_reference_dll_library_default.a.render( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(about_About, null), document.getElementById('wrap'));

/***/ }),

/***/ 59:
/***/ (function(module, exports) {

module.exports = dll_library;

/***/ })

/******/ });