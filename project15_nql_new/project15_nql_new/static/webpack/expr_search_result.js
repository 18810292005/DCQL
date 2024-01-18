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
/******/ 		15: 0
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
/******/ 	deferredModules.push([1826,0]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 1826:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85);
__webpack_require__(86);
__webpack_require__(87);
module.exports = __webpack_require__(1827);


/***/ }),

/***/ 1827:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_router_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(30);
/* harmony import */ var _components_layout_Breadcrumb__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(27);
/* harmony import */ var _components_layout_MgeLayout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(48);
/* harmony import */ var _components_pages_Search__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(378);
/* harmony import */ var _components_pages_serach_redirect__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(364);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2);
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










var ExprSearchResult = /*#__PURE__*/function (_Component) {
  _inherits(ExprSearchResult, _Component);

  var _super = _createSuper(ExprSearchResult);

  function ExprSearchResult() {
    _classCallCheck(this, ExprSearchResult);

    return _super.apply(this, arguments);
  }

  _createClass(ExprSearchResult, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_layout_MgeLayout__WEBPACK_IMPORTED_MODULE_4__[/* MgeLayout */ "a"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_layout_Breadcrumb__WEBPACK_IMPORTED_MODULE_3__[/* Breadcrumb */ "a"], {
        items: [_components_layout_Breadcrumb__WEBPACK_IMPORTED_MODULE_3__[/* Breadcrumb */ "a"].MGED, _components_layout_Breadcrumb__WEBPACK_IMPORTED_MODULE_3__[/* Breadcrumb */ "a"].MDB, {
          title: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_7__[/* FormattedMessage */ "a"], {
            id: 'search:adv_result',
            defaultMessage: '高级搜索结果'
          })
        }]
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["HashRouter"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Switch"], null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], {
        path: '/querys/data/:id',
        exact: true,
        component: _components_pages_serach_redirect__WEBPACK_IMPORTED_MODULE_6__[/* SearchRedirectPage */ "a"]
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_router_dom__WEBPACK_IMPORTED_MODULE_2__["Route"], {
        path: '/:query_id?/:template_id?',
        component: _components_pages_Search__WEBPACK_IMPORTED_MODULE_5__[/* SearchPage */ "a"]
      }))));
    }
  }]);

  return ExprSearchResult;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(ExprSearchResult, null), document.getElementById('wrap'));

/***/ }),

/***/ 364:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchRedirectPage; });
/* harmony import */ var antd_lib_tag_style__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(154);
/* harmony import */ var antd_lib_tag_style__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(antd_lib_tag_style__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var antd_lib_tag__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(69);
/* harmony import */ var antd_lib_tag__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(antd_lib_tag__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var antd_lib_input_style__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(56);
/* harmony import */ var antd_lib_input_style__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(antd_lib_input_style__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var antd_lib_input__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(22);
/* harmony import */ var antd_lib_input__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(antd_lib_input__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var antd_lib_select_style__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(75);
/* harmony import */ var antd_lib_select_style__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(antd_lib_select_style__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var antd_lib_select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(24);
/* harmony import */ var antd_lib_select__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(antd_lib_select__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(107);
/* harmony import */ var _search_QueryDataView__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(384);
/* harmony import */ var _search_RenderTypeView__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(73);
/* harmony import */ var _apis_define_search__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(18);
/* harmony import */ var _apis_search_v2_Query__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(9);
/* harmony import */ var _apis_Urls__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(4);
/* harmony import */ var _layout_Container__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(79);
/* harmony import */ var _utils_SavedSearch__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(61);
/* harmony import */ var _common_LoadingModal__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(121);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(2);







function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }












var Option = antd_lib_select__WEBPACK_IMPORTED_MODULE_5___default.a.Option;

var _SearchRedirectPage = function _SearchRedirectPage(props) {
  var history = props.history;

  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_6__["useState"])(''),
      _useState2 = _slicedToArray(_useState, 2),
      searchText = _useState2[0],
      setSearchText = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_6__["useState"])(_apis_define_search__WEBPACK_IMPORTED_MODULE_10__[/* Search */ "a"].MetaType.Text),
      _useState4 = _slicedToArray(_useState3, 2),
      searchType = _useState4[0],
      setSearchType = _useState4[1];

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_6__["useState"])(false),
      _useState6 = _slicedToArray(_useState5, 2),
      loading = _useState6[0],
      setLoading = _useState6[1];

  var _useState7 = Object(react__WEBPACK_IMPORTED_MODULE_6__["useState"])(null),
      _useState8 = _slicedToArray(_useState7, 2),
      query = _useState8[0],
      setQuery = _useState8[1];

  var _useState9 = Object(react__WEBPACK_IMPORTED_MODULE_6__["useState"])(false),
      _useState10 = _slicedToArray(_useState9, 2),
      textModified = _useState10[0],
      setTextModified = _useState10[1];

  var _useState11 = Object(react__WEBPACK_IMPORTED_MODULE_6__["useState"])(null),
      _useState12 = _slicedToArray(_useState11, 2),
      queryid = _useState12[0],
      setqueryId = _useState12[1];

  var _useState13 = Object(react__WEBPACK_IMPORTED_MODULE_6__["useState"])(true),
      _useState14 = _slicedToArray(_useState13, 2),
      dataloading = _useState14[0],
      setDataLoading = _useState14[1];

  var handleSearchTypeChange = function handleSearchTypeChange(value) {
    setSearchType(value);
    setTextModified(true);
  };

  var searchTypeSelect = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(antd_lib_select__WEBPACK_IMPORTED_MODULE_5___default.a, {
    style: {
      width: 120
    },
    value: searchType,
    onChange: handleSearchTypeChange
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(Option, {
    value: _apis_define_search__WEBPACK_IMPORTED_MODULE_10__[/* Search */ "a"].MetaType.Text
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_16__[/* FormattedMessage */ "a"], {
    id: 'Full-Text Search',
    defaultMessage: "\u5168\u6587\u68C0\u7D22"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(Option, {
    value: _apis_define_search__WEBPACK_IMPORTED_MODULE_10__[/* Search */ "a"].MetaType.Title
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_16__[/* FormattedMessage */ "a"], {
    id: 'data:title',
    defaultMessage: "\u6807\u9898"
  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(Option, {
    value: _apis_define_search__WEBPACK_IMPORTED_MODULE_10__[/* Search */ "a"].MetaType.DOI
  }, "DOI"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(Option, {
    value: _apis_define_search__WEBPACK_IMPORTED_MODULE_10__[/* Search */ "a"].MetaType.Abstract
  }, "\u6458\u8981"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(Option, {
    value: _apis_define_search__WEBPACK_IMPORTED_MODULE_10__[/* Search */ "a"].MetaType.Author
  }, "\u4F5C\u8005"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(Option, {
    value: _apis_define_search__WEBPACK_IMPORTED_MODULE_10__[/* Search */ "a"].MetaType.Keywords
  }, "\u5173\u952E\u8BCD"));

  var handleResult = function handleResult(result) {
    setQuery(result);
    setTextModified(false);

    if (props.location.pathname.endsWith('list')) {
      history.push("/".concat(result.id, "/list"));
    } else {
      history.push("/".concat(result.id));
    }

    setLoading(false);
  };

  var handleOnSearch = function handleOnSearch(value) {
    value = value.trim();
    if (value.length === 0) return;
    setLoading(true);

    if (textModified) {
      if (searchType === _apis_define_search__WEBPACK_IMPORTED_MODULE_10__[/* Search */ "a"].MetaType.Text) {
        Object(_apis_search_v2_Query__WEBPACK_IMPORTED_MODULE_11__[/* CreateFullTextQuery */ "b"])(value).then(handleResult);
      } else {
        Object(_apis_search_v2_Query__WEBPACK_IMPORTED_MODULE_11__[/* CreateMetaDataQuery */ "c"])(searchType, value).then(handleResult);
      }
    } else {
      if (searchType === _apis_define_search__WEBPACK_IMPORTED_MODULE_10__[/* Search */ "a"].MetaType.Text) {
        Object(_apis_search_v2_Query__WEBPACK_IMPORTED_MODULE_11__[/* PutQuery */ "j"])(query.id, {
          text: value,
          data: null,
          meta: null
        }).then(handleResult);
      } else {
        Object(_apis_search_v2_Query__WEBPACK_IMPORTED_MODULE_11__[/* PutQuery */ "j"])(query.id, {
          meta: {
            and: [{
              field: searchType,
              val: value,
              op: _apis_define_search__WEBPACK_IMPORTED_MODULE_10__[/* Search */ "a"].Operator.StrContain
            }]
          }
        }).then(handleResult);
      }
    }
  };

  var handleRenderTypeChange = function handleRenderTypeChange(t) {
    if (query == null) {
      return;
    }

    if (t === _search_RenderTypeView__WEBPACK_IMPORTED_MODULE_9__[/* RenderType */ "a"].Table) {
      // 列表视图
      history.push("/".concat(query.id));
    } else {
      // 简单视图
      history.push("/".concat(query.id, "/list"));
    }
  };

  var handleAdvSearchClick = function handleAdvSearchClick() {
    window.open(_apis_Urls__WEBPACK_IMPORTED_MODULE_12__[/* default */ "b"].search.expr);
  };

  Object(react__WEBPACK_IMPORTED_MODULE_6__["useEffect"])(function () {
    var urlmat = window.location.href.split('/');
    Object(_apis_search_v2_Query__WEBPACK_IMPORTED_MODULE_11__[/* CreateFullTextQuery */ "b"])(urlmat[urlmat.length - 1]).then(function (result) {
      setqueryId(result.id);
      setQuery(result);
      setTextModified(false);
      setDataLoading(false);
    });
  }, []);

  var handleAddData = function handleAddData(id) {
    Object(_utils_SavedSearch__WEBPACK_IMPORTED_MODULE_14__[/* SaveSearchResult */ "e"])(queryid, searchText);

    if (typeof id === 'number') {
      Object(_apis_search_v2_Query__WEBPACK_IMPORTED_MODULE_11__[/* PatchQueryDownload */ "i"])(queryid, {
        download: {
          data: {
            include: [id]
          }
        }
      }).then(function (result) {
        var newQuery = _apis_search_v2_Query__WEBPACK_IMPORTED_MODULE_11__[/* Query */ "k"].copy(query);

        var _iterator = _createForOfIteratorHelper(newQuery.q.data),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var i = _step.value;

            if (i.data.id === id) {
              i.download = true;
              setQuery(newQuery);
              return;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      });
    } else {
      // 一次全选中多个数据时
      Object(_apis_search_v2_Query__WEBPACK_IMPORTED_MODULE_11__[/* PatchQueryDownload */ "i"])(queryid, {
        download: {
          data: {
            include: id
          }
        }
      }).then(function (result) {
        var newQuery = _apis_search_v2_Query__WEBPACK_IMPORTED_MODULE_11__[/* Query */ "k"].copy(query);

        var _iterator2 = _createForOfIteratorHelper(newQuery.q.data),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var i = _step2.value;

            for (var j = 0; j < id.length; j++) {
              if (i.data.id === id[j]) {
                i.download = true;
                setQuery(newQuery);
              }
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        return;
      });
    }
  };

  var handleRemoveData = function handleRemoveData(id) {
    if (typeof id === 'number') {
      Object(_apis_search_v2_Query__WEBPACK_IMPORTED_MODULE_11__[/* PatchQueryDownload */ "i"])(queryid, {
        download: {
          data: {
            exclude: [id]
          }
        }
      }).then(function (result) {
        var newQuery = _apis_search_v2_Query__WEBPACK_IMPORTED_MODULE_11__[/* Query */ "k"].copy(query);

        var _iterator3 = _createForOfIteratorHelper(newQuery.q.data),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var i = _step3.value;

            if (i.data.id === id) {
              i.download = false;
              setQuery(newQuery);
              return;
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      });
    } else {
      Object(_apis_search_v2_Query__WEBPACK_IMPORTED_MODULE_11__[/* PatchQueryDownload */ "i"])(queryid, {
        download: {
          data: {
            exclude: id
          }
        }
      }).then(function (result) {
        var newQuery = _apis_search_v2_Query__WEBPACK_IMPORTED_MODULE_11__[/* Query */ "k"].copy(query);

        var _iterator4 = _createForOfIteratorHelper(newQuery.q.data),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var i = _step4.value;

            for (var j = 0; j < id.length; j++) {
              if (i.data.id === id[j]) {
                i.download = false;
                setQuery(newQuery);
              }
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        return;
      });
    }
  };

  var handleSearchTextChange = function handleSearchTextChange(e) {
    setTextModified(true);
    setSearchText(e.target.value);
  };

  var handleAddTemplate = function handleAddTemplate(tid) {
    Object(_utils_SavedSearch__WEBPACK_IMPORTED_MODULE_14__[/* SaveSearchResult */ "e"])(queryid, searchText);
    Object(_apis_search_v2_Query__WEBPACK_IMPORTED_MODULE_11__[/* PatchQueryDownload */ "i"])(query.id, {
      download: {
        template: {
          include: [tid]
        }
      }
    }).then(function (result) {
      var newQuery = _apis_search_v2_Query__WEBPACK_IMPORTED_MODULE_11__[/* Query */ "k"].copy(query);

      var _iterator5 = _createForOfIteratorHelper(newQuery.q.summary.category),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var i = _step5.value;

          var _iterator6 = _createForOfIteratorHelper(i.templates),
              _step6;

          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var t = _step6.value;

              if (t.id === tid) {
                t.download = true;
                setQuery(newQuery);
                return;
              }
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    });
  };

  var handleRemoveTemplate = function handleRemoveTemplate(tid) {
    Object(_apis_search_v2_Query__WEBPACK_IMPORTED_MODULE_11__[/* PatchQueryDownload */ "i"])(queryid, {
      download: {
        template: {
          exclude: [tid]
        }
      }
    }).then(function (result) {
      var newQuery = _apis_search_v2_Query__WEBPACK_IMPORTED_MODULE_11__[/* Query */ "k"].copy(query);

      var _iterator7 = _createForOfIteratorHelper(newQuery.q.summary.category),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var i = _step7.value;

          var _iterator8 = _createForOfIteratorHelper(i.templates),
              _step8;

          try {
            for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
              var t = _step8.value;

              if (t.id === tid) {
                t.download = false;
                setQuery(newQuery);
                return;
              }
            }
          } catch (err) {
            _iterator8.e(err);
          } finally {
            _iterator8.f();
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    });
  };

  var renderType = props.location.pathname.endsWith('list') ? _search_RenderTypeView__WEBPACK_IMPORTED_MODULE_9__[/* RenderType */ "a"].List : _search_RenderTypeView__WEBPACK_IMPORTED_MODULE_9__[/* RenderType */ "a"].Table;
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react__WEBPACK_IMPORTED_MODULE_6___default.a.Fragment, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_common_LoadingModal__WEBPACK_IMPORTED_MODULE_15__[/* LoadingModal */ "a"], {
    loading: loading
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
    style: {
      backgroundColor: '#FFF',
      flexGrow: 0
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_layout_Container__WEBPACK_IMPORTED_MODULE_13__[/* Container */ "a"], {
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(antd_lib_input__WEBPACK_IMPORTED_MODULE_3___default.a.Search, {
    onSearch: handleOnSearch,
    onChange: handleSearchTextChange,
    value: searchText,
    style: {
      marginTop: query == null ? '20vh' : '48px',
      transition: 'margin-top 0.5s ease'
    },
    enterButton: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_16__[/* FormattedMessage */ "a"], {
      id: 'search',
      defaultMessage: "\u641C\u7D22"
    }),
    size: 'large',
    addonBefore: searchTypeSelect
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
    style: {
      textAlign: 'right',
      padding: '8px 0'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(antd_lib_tag__WEBPACK_IMPORTED_MODULE_1___default.a, {
    color: "#108ee9",
    onClick: handleAdvSearchClick,
    style: {
      cursor: 'pointer',
      marginRight: 0
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_16__[/* FormattedMessage */ "a"], {
    id: 'help:adv_search',
    defaultMessage: "\u9AD8\u7EA7\u68C0\u7D22"
  }))))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
    style: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_layout_Container__WEBPACK_IMPORTED_MODULE_13__[/* Container */ "a"], {
    style: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement("div", {
    style: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column'
    }
  }, dataloading ? null : /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_6___default.a.createElement(_search_QueryDataView__WEBPACK_IMPORTED_MODULE_8__[/* QueryDataView */ "a"], {
    onAddData: handleAddData,
    onRemoveData: handleRemoveData,
    onAddTemplate: handleAddTemplate,
    onRemoveTemplate: handleRemoveTemplate,
    loading: false,
    init: query == null,
    id: queryid
  })))));
};

var SearchRedirectPage = Object(react_router__WEBPACK_IMPORTED_MODULE_7__["withRouter"])(_SearchRedirectPage);

/***/ }),

/***/ 378:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* binding */ SearchPage; });

// EXTERNAL MODULE: ./node_modules/antd/lib/tag/style/index.js
var style = __webpack_require__(154);

// EXTERNAL MODULE: ./node_modules/antd/lib/tag/index.js
var tag = __webpack_require__(69);
var tag_default = /*#__PURE__*/__webpack_require__.n(tag);

// EXTERNAL MODULE: ./node_modules/antd/lib/input/style/index.js
var input_style = __webpack_require__(56);

// EXTERNAL MODULE: ./node_modules/antd/lib/input/index.js
var input = __webpack_require__(22);
var input_default = /*#__PURE__*/__webpack_require__.n(input);

// EXTERNAL MODULE: ./node_modules/antd/lib/menu/style/index.js
var menu_style = __webpack_require__(403);

// EXTERNAL MODULE: ./node_modules/antd/lib/menu/index.js
var menu = __webpack_require__(57);
var menu_default = /*#__PURE__*/__webpack_require__.n(menu);

// EXTERNAL MODULE: ./node_modules/antd/lib/notification/style/index.js
var notification_style = __webpack_require__(60);

// EXTERNAL MODULE: ./node_modules/antd/lib/notification/index.js
var notification = __webpack_require__(10);
var notification_default = /*#__PURE__*/__webpack_require__.n(notification);

// EXTERNAL MODULE: ./node_modules/antd/lib/select/style/index.js
var select_style = __webpack_require__(75);

// EXTERNAL MODULE: ./node_modules/antd/lib/select/index.js
var lib_select = __webpack_require__(24);
var select_default = /*#__PURE__*/__webpack_require__.n(lib_select);

// EXTERNAL MODULE: delegated ./node_modules/react/index.js from dll-reference dll_library
var reactfrom_dll_reference_dll_library = __webpack_require__(0);
var reactfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(reactfrom_dll_reference_dll_library);

// EXTERNAL MODULE: delegated ./node_modules/react-router/esm/react-router.js from dll-reference dll_library
var react_routerfrom_dll_reference_dll_library = __webpack_require__(107);

// EXTERNAL MODULE: ./node_modules/antd/lib/pagination/style/index.js
var pagination_style = __webpack_require__(139);

// EXTERNAL MODULE: ./node_modules/antd/lib/pagination/index.js
var pagination = __webpack_require__(72);
var pagination_default = /*#__PURE__*/__webpack_require__.n(pagination);

// EXTERNAL MODULE: ./node_modules/antd/lib/icon/style/index.js
var icon_style = __webpack_require__(125);

// EXTERNAL MODULE: ./node_modules/antd/lib/icon/index.js
var icon = __webpack_require__(28);
var icon_default = /*#__PURE__*/__webpack_require__.n(icon);

// EXTERNAL MODULE: ./node_modules/antd/lib/rate/style/index.js
var rate_style = __webpack_require__(698);

// EXTERNAL MODULE: ./node_modules/antd/lib/rate/index.js
var rate = __webpack_require__(381);
var rate_default = /*#__PURE__*/__webpack_require__.n(rate);

// EXTERNAL MODULE: ./node_modules/antd/lib/popconfirm/style/index.js
var popconfirm_style = __webpack_require__(226);

// EXTERNAL MODULE: ./node_modules/antd/lib/popconfirm/index.js
var popconfirm = __webpack_require__(134);
var popconfirm_default = /*#__PURE__*/__webpack_require__.n(popconfirm);

// EXTERNAL MODULE: ./node_modules/antd/lib/message/style/index.js
var message_style = __webpack_require__(304);

// EXTERNAL MODULE: ./node_modules/antd/lib/message/index.js
var message = __webpack_require__(152);
var message_default = /*#__PURE__*/__webpack_require__.n(message);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/style/index.js
var button_style = __webpack_require__(32);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/index.js
var lib_button = __webpack_require__(5);
var button_default = /*#__PURE__*/__webpack_require__.n(lib_button);

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(16);

// EXTERNAL MODULE: ./components/search/SearchResultList.less
var search_SearchResultList = __webpack_require__(699);

// EXTERNAL MODULE: ./apis/Urls.ts
var Urls = __webpack_require__(4);

// EXTERNAL MODULE: ./apis/data/Score.ts
var Score = __webpack_require__(380);

// EXTERNAL MODULE: ./node_modules/core-decorators/es/core-decorators.js + 19 modules
var core_decorators = __webpack_require__(17);

// EXTERNAL MODULE: ./apis/session/Info.ts
var Info = __webpack_require__(83);

// EXTERNAL MODULE: ./node_modules/react-intl/lib/index.es.js + 1 modules
var index_es = __webpack_require__(2);

// CONCATENATED MODULE: ./components/search/SearchResultList.tsx
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




 // import { Cart } from '../../utils/ShoppingCart';





var ButtonGroup = button_default.a.Group; // const cart = Cart.Instance;

function SearchResultList_confirm(data_id, score) {
  Object(Score["a" /* ScoreData */])(data_id, score).then(function (value) {
    message_default.a.success('Success');
  })["catch"](function (value) {
    message_default.a.error(value + '');
  });
}

function cancel(e) {//message.error('Click on No');
}

var SearchResultList_openData = function openData(data_id) {
  var data_url = Urls["a" /* Urls */].storage.show_data(data_id);
  window.open(data_url);
};

var SearchResultList_editData = function editData(data_id) {
  // const data_add = Urls.storage.add_data;
  // let data_url = data_add + '?action=modify&did=';
  // data_url = data_url + data_id;
  var data_url = Urls["a" /* Urls */].storage.edit_data_new + data_id;
  window.open(data_url);
};

var dellTime = function dellTime(data_time) {
  var arr1 = data_time.split('T', 1);
  var replaceStr = arr1[0].replace(/-/g, '/');
  return replaceStr;
};

var SearchResultList_SearchResultList = /*#__PURE__*/function (_Component) {
  _inherits(SearchResultList, _Component);

  var _super = _createSuper(SearchResultList);

  function SearchResultList(props) {
    var _this;

    _classCallCheck(this, SearchResultList);

    _this = _super.call(this, props);

    _this.handleAbstract = function () {
      var showExpand = _this.state.showExpand;

      _this.setState({
        showExpand: !showExpand
      });
    };

    var data_id_arr1 = [];
    var data_in_arr1 = [];

    for (var i = 0; i < _this.props.data.length; i++) {
      data_id_arr1.push(_this.props.data[i].data.id);
      data_in_arr1.push(_this.props.data[i].download);
    }

    _this.state = {
      score: 0,
      logged_in: false,
      showExpand: false
    };
    return _this;
  }

  _createClass(SearchResultList, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      Object(Info["a" /* Info */])().then(function (value) {
        _this2.setState({
          logged_in: true
        });
      })["catch"](function () {
        _this2.setState({
          logged_in: false
        });
      });
    }
  }, {
    key: "dataScore",
    value: function dataScore(value) {
      this.setState({
        score: value
      });
    }
  }, {
    key: "addData",
    value: function addData(data_id, data_title, data_tid) {
      this.props.onAddData(data_id);
    }
  }, {
    key: "removeData",
    value: function removeData(data_id, data_tid) {
      this.props.onRemoveData(data_id);
    }
  }, {
    key: "isDataInDownload",
    value: function isDataInDownload(data_id) {
      var data = this.props.data;

      for (var i = 0; i < data.length; ++i) {
        if (data[i].data.id === data_id) {
          return data[i].download;
        }
      }

      return false;
    }
  }, {
    key: "ExpandDiv",
    value: function ExpandDiv(value) {
      if (value.length > 50) {
        if (!this.state.showExpand) {
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
            onClick: this.handleAbstract
          }, "...");
        } else return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: 'abstract'
        }, value.substring(50)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
          style: {
            paddingLeft: '3px'
          },
          onClick: this.handleAbstract
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
          id: 'click_collapse',
          defaultMessage: "\u70B9\u51FB\u6536\u8D77"
        })));
      } else {
        return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, '');
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("h3", {
        className: 'left_float'
      }, this.props.count, " "), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, " \u7ED3\u679C")), this.props.data.map(function (v) {
        var dataIn = _this3.isDataInDownload(v.data.id);

        return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'data_meta',
          key: v.data.id
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'heading'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
          onClick: function onClick() {
            return SearchResultList_openData(v.data.id);
          },
          className: 'heading__title'
        }, v.data.title), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ButtonGroup, {
          className: 'heading__buttonGroup'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
          onClick: function onClick() {
            return SearchResultList_editData(v.data.id);
          }
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("i", {
          className: 'fa fa-pencil'
        })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(popconfirm_default.a, {
          title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(rate_default.a, {
            onChange: _this3.dataScore
          }),
          onConfirm: function onConfirm() {
            return SearchResultList_confirm(v.data.id, _this3.state.score);
          },
          onCancel: cancel,
          okText: 'Yes',
          cancelText: 'No',
          icon: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(icon_default.a, {
            type: ''
          })
        }, _this3.state.logged_in ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("i", {
          className: 'fa fa-star'
        })) : null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
          onClick: dataIn ? function () {
            return _this3.removeData(v.data.id, v.data.template);
          } : function () {
            return _this3.addData(v.data.id, v.data.title, v.data.template);
          },
          type: dataIn ? 'primary' : 'default'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("i", {
          className: dataIn ? 'fa fa-check' : 'fa fa-plus'
        })))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'body'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: v.data.realname ? 'body__midleft' : 'none'
        }, "\u63D0\u4EA4\u8005\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: v.data.realname ? 'body__midright' : 'none'
        }, v.data.realname), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: 'body__midleft'
        }, "\u63D0\u4EA4\u65F6\u95F4\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: 'body__midright'
        }, dellTime(v.data.add_time))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'row'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'body__bottom'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("ul", {
          className: 'body__bottom__listUL'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("li", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: 'fontWei'
        }, "\u6750\u6599\u7C7B\u522B\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", null, v.data.category_name)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("li", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: 'fontWei'
        }, "\u6570\u636E\u6458\u8981\uFF1A"), v.data.hasOwnProperty('abstract') === true && v.data["abstract"].length > 50 ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: 'abstract'
        }, v.data["abstract"].slice(0, 50)) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: 'abstract'
        }, v.data["abstract"]), v.data.hasOwnProperty('abstract') === true && _this3.ExpandDiv(v.data["abstract"])), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("li", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: 'fontWei'
        }, "DOI\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", null, v.data.doi)))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'body__bottom'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("ul", {
          className: 'body__bottom__listUL'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("li", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: 'fontWei'
        }, "\u6765\u6E90\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", null, v.data.source)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("li", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: 'fontWei'
        }, "\u9879\u76EE\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", null, v.data.project)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("li", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: 'fontWei'
        }, "\u5F15\u7528\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", null, v.data.reference)))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'body__pullRight'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'tiny'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'value'
        }, v.data.views), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'label'
        }, "\u67E5\u770B")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'tiny'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'value'
        }, v.data.downloads), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'label'
        }, "\u4E0B\u8F7D")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'tiny'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'value'
        }, v.data.score), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'label'
        }, "\u8BC4\u5206"))))));
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'center'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(pagination_default.a, {
        onChange: function onChange(page) {
          return _this3.props.onPageChange(page);
        },
        current: this.props.page,
        size: 'big',
        pageSize: this.props.page_size,
        total: this.props.count
      })));
    }
  }]);

  return SearchResultList;
}(reactfrom_dll_reference_dll_library["Component"]);

Object(tslib_es6["a" /* __decorate */])([core_decorators["a" /* autobind */]], SearchResultList_SearchResultList.prototype, "dataScore", null);

Object(tslib_es6["a" /* __decorate */])([core_decorators["a" /* autobind */]], SearchResultList_SearchResultList.prototype, "addData", null);

Object(tslib_es6["a" /* __decorate */])([core_decorators["a" /* autobind */]], SearchResultList_SearchResultList.prototype, "removeData", null);

Object(tslib_es6["a" /* __decorate */])([core_decorators["a" /* autobind */]], SearchResultList_SearchResultList.prototype, "isDataInDownload", null);
// EXTERNAL MODULE: ./node_modules/antd/lib/page-header/style/index.js
var page_header_style = __webpack_require__(486);

// EXTERNAL MODULE: ./node_modules/antd/lib/page-header/index.js
var page_header = __webpack_require__(262);
var page_header_default = /*#__PURE__*/__webpack_require__.n(page_header);

// EXTERNAL MODULE: ./node_modules/antd/lib/table/style/index.js
var table_style = __webpack_require__(100);

// EXTERNAL MODULE: ./node_modules/antd/lib/table/index.js
var table = __webpack_require__(37);
var table_default = /*#__PURE__*/__webpack_require__.n(table);

// EXTERNAL MODULE: ./apis/search/v2/Query.ts + 1 modules
var Query = __webpack_require__(9);

// EXTERNAL MODULE: delegated ./node_modules/react-router-dom/esm/react-router-dom.js from dll-reference dll_library
var react_router_domfrom_dll_reference_dll_library = __webpack_require__(30);

// EXTERNAL MODULE: ./components/search/FieldTreeView.tsx
var FieldTreeView = __webpack_require__(261);

// EXTERNAL MODULE: ./components/search/DataDetailList.tsx
var DataDetailList = __webpack_require__(383);

// EXTERNAL MODULE: ./apis/define/FieldType.ts
var FieldType = __webpack_require__(6);

// EXTERNAL MODULE: ./apis/define/Template.ts
var Template = __webpack_require__(195);

// EXTERNAL MODULE: ./components/common/LoadingModal.tsx
var LoadingModal = __webpack_require__(121);

// CONCATENATED MODULE: ./components/search/QuerySummaryView.tsx







function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }











function TransformQuerySummary(summary) {
  var result = [];
  summary.forEach(function (value) {
    var temp = value.templates.map(function (x, index) {
      return {
        id: x.id,
        name: x.name,
        url: x.url,
        download: x.download,
        count_at_least: x.count_at_least,
        span: index === 0 ? value.templates.length : 0,
        category_id: value.id,
        category_name: value.name
      };
    });
    result = result.concat(temp);
  });
  return result;
}

var Column = table_default.a.Column;

var QuerySummaryView_QuerySummaryView = function _QuerySummaryView(props) {
  // 总览视图用到的信息
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = _slicedToArray(_useState, 2),
      innerSummary = _useState2[0],
      setInnerSummary = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState4 = _slicedToArray(_useState3, 2),
      detail = _useState4[0],
      setDetail = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])([{
    fullPath: ['title'],
    type: FieldType["a" /* FieldType */].String,
    isMeta: true
  }, {
    fullPath: ['realname'],
    type: FieldType["a" /* FieldType */].String,
    isMeta: true
  }, {
    fullPath: ['abstract'],
    type: FieldType["a" /* FieldType */].String,
    isMeta: true
  }, {
    fullPath: ['doi'],
    type: FieldType["a" /* FieldType */].String,
    isMeta: true
  }, {
    fullPath: ['project'],
    type: FieldType["a" /* FieldType */].String,
    isMeta: true
  }, {
    fullPath: ['reference'],
    type: FieldType["a" /* FieldType */].String,
    isMeta: true
  }, {
    fullPath: ['subject'],
    type: FieldType["a" /* FieldType */].String,
    isMeta: true
  }]),
      _useState6 = _slicedToArray(_useState5, 2),
      cols = _useState6[0],
      setCols = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState8 = _slicedToArray(_useState7, 2),
      detailLoading = _useState8[0],
      setDetailLoading = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState10 = _slicedToArray(_useState9, 2),
      data = _useState10[0],
      setData = _useState10[1];

  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState12 = _slicedToArray(_useState11, 2),
      meta = _useState12[0],
      setMeta = _useState12[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setInnerSummary(TransformQuerySummary(props.summary));
  }, [props.summary]);

  var handleCommit = function handleCommit(meta, data, template) {
    var metaCols = meta.map(function (v) {
      return {
        fullPath: [v],
        type: FieldType["a" /* FieldType */].String,
        isMeta: true
      };
    });
    var dataCols = data.map(function (value) {
      return {
        fullPath: value.split('.'),
        type: Template["a" /* Template */].GetFieldByPathString(template, value).type,
        isMeta: false
      };
    });
    var cols = metaCols.concat(dataCols);
    setDetailLoading(true);
    setCols(cols);
    setData(data);
    setMeta(meta);
    Object(Query["h" /* GetQueryTemplate */])(props.queryID, props.templateID, {
      return_data: data,
      return_meta: meta
    }).then(function (value) {
      setDetail(value);
      setDetailLoading(false);
    });
  };

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    if (props.templateID != null) {
      setDetailLoading(true);
      Object(Query["h" /* GetQueryTemplate */])(props.queryID, props.templateID, {}).then(function (value) {
        setDetail(value);
        setDetailLoading(false);
      });
    }
  }, [props.templateID]);

  var handleAddData = function handleAddData(id) {
    props.onAddData(id);

    var newDetail = _objectSpread({}, detail);

    newDetail.data = _toConsumableArray(detail.data);

    if (typeof id === 'number') {
      var _iterator = _createForOfIteratorHelper(newDetail.data),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var i = _step.value;

          if (i.data.id === id) {
            i.download = true;
            setDetail(newDetail);
            return;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    } else {
      var _iterator2 = _createForOfIteratorHelper(newDetail.data),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _i2 = _step2.value;

          for (var j = 0; j < id.length; j++) {
            if (_i2.data.id === id[j]) {
              _i2.download = true;
              setDetail(newDetail);
            }
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return;
    }
  };

  var handleRemoveData = function handleRemoveData(id) {
    props.onRemoveData(id);

    var newDetail = _objectSpread({}, detail);

    newDetail.data = _toConsumableArray(detail.data);

    if (typeof id === 'number') {
      var _iterator3 = _createForOfIteratorHelper(newDetail.data),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var i = _step3.value;

          if (i.data.id === id) {
            i.download = false;
            setDetail(newDetail);
            return;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    } else {
      var _iterator4 = _createForOfIteratorHelper(newDetail.data),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var _i3 = _step4.value;

          for (var j = 0; j < id.length; j++) {
            if (_i3.data.id === id[j]) {
              _i3.download = false;
              setDetail(newDetail);
            }
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return;
    }
  };

  var handlePageChange = function handlePageChange(newPage) {
    setDetailLoading(true);

    if (data == null && meta == null) {
      Object(Query["h" /* GetQueryTemplate */])(props.queryID, props.templateID, {
        page: newPage
      }).then(function (value) {
        setDetail(value);
        setDetailLoading(false);
      });
    } else {
      Object(Query["h" /* GetQueryTemplate */])(props.queryID, props.templateID, {
        page: newPage,
        return_data: data,
        return_meta: meta
      }).then(function (value) {
        setDetail(value);
        setDetailLoading(false);
      });
    }
  };

  if (props.templateID != null) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      style: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(LoadingModal["a" /* LoadingModal */], {
      loading: detailLoading
    }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      style: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row'
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      style: {
        flexGrow: 1,
        marginRight: '6px',
        overflowX: 'scroll',
        backgroundColor: '#FFF'
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(page_header_default.a, {
      style: {
        flexGrow: 0
      },
      backIcon: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("i", {
        className: "fa fa-arrow-left",
        "aria-hidden": "true"
      }),
      onBack: function onBack() {
        props.history.goBack();
      },
      title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'back',
        defaultMessage: "\u8FD4\u56DE"
      })
    }), detailLoading ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      style: {
        minHeight: '800px',
        flexGrow: 1
      }
    }) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DataDetailList["a" /* DataDetailList */], {
      onAddData: handleAddData,
      onRemoveData: handleRemoveData,
      onPageChange: handlePageChange,
      columns: cols,
      data: detail.data,
      count: detail.total,
      page: detail.page,
      page_size: detail.page_size
    })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      style: {
        marginLeft: '6px',
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: '240px',
        background: '#FFF',
        height: '480px',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(FieldTreeView["a" /* FieldTreeView */], {
      templateID: props.templateID,
      onCommit: handleCommit
    }))));
  } else {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
      style: {
        backgroundColor: '#FFF'
      },
      bordered: true,
      dataSource: innerSummary,
      rowKey: 'id',
      pagination: false
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
      title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'category',
        defaultMessage: "\u6750\u6599\u7C7B\u522B"
      }),
      dataIndex: 'category_name',
      render: function render(text, record) {
        return {
          children: text,
          props: {
            rowSpan: record.span
          }
        };
      }
    }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
      title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'dataShow:template_name',
        defaultMessage: "\u6A21\u677F\u540D\u79F0"
      }),
      dataIndex: 'name'
    }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
      title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'dash:data_count',
        defaultMessage: "\u6570\u636E\u91CF"
      }),
      dataIndex: 'count_at_least',
      render: function render(text, record) {
        return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
          to: "/".concat(props.queryID, "/").concat(record.id)
        }, text);
      }
    }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
      title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'option',
        defaultMessage: "\u64CD\u4F5C"
      }),
      render: function render(_, record) {
        return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
          type: record.download ? 'primary' : 'default',
          onClick: function onClick() {
            return record.download ? props.onRemoveTemplate(record.id) : props.onAddTemplate(record.id);
          }
        }, record.download ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
          id: 'Already in download list',
          defaultMessage: "\u5DF2\u5728\u4E0B\u8F7D\u5217\u8868\u4E2D"
        }) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
          id: 'Add to download list',
          defaultMessage: "\u6DFB\u52A0\u5230\u4E0B\u8F7D\u5217\u8868"
        }));
      }
    }));
  }
};

var QuerySummaryView = Object(react_router_domfrom_dll_reference_dll_library["withRouter"])(QuerySummaryView_QuerySummaryView);
// EXTERNAL MODULE: ./components/search/RenderTypeView.tsx
var RenderTypeView = __webpack_require__(73);

// EXTERNAL MODULE: ./apis/define/search.ts
var search = __webpack_require__(18);

// EXTERNAL MODULE: ./components/layout/Container.tsx
var Container = __webpack_require__(79);

// EXTERNAL MODULE: ./components/search/FilterView.tsx + 1 modules
var FilterView = __webpack_require__(388);

// EXTERNAL MODULE: ./utils/SavedSearch.ts
var SavedSearch = __webpack_require__(61);

// EXTERNAL MODULE: ./components/data/ItemRender.less
var ItemRender = __webpack_require__(488);

// CONCATENATED MODULE: ./components/search/ExprSearchResult.tsx
function ExprSearchResult_slicedToArray(arr, i) { return ExprSearchResult_arrayWithHoles(arr) || ExprSearchResult_iterableToArrayLimit(arr, i) || ExprSearchResult_unsupportedIterableToArray(arr, i) || ExprSearchResult_nonIterableRest(); }

function ExprSearchResult_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function ExprSearchResult_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return ExprSearchResult_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ExprSearchResult_arrayLikeToArray(o, minLen); }

function ExprSearchResult_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ExprSearchResult_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function ExprSearchResult_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var test_data = [{
  data_id: 45,
  日期: '2020-04-26 10:57:10',
  单晶id: 45,
  测试id: 45,
  加工id: 45
}, {
  data_id: 46,
  日期: '2020-04-26 10:57:10',
  单晶id: 46,
  测试id: 46
}];
var test_head = ['日期', '单晶id', '测试id', '加工id'];
var ExprSearchResult_ExprSearchResult = function ExprSearchResult(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = ExprSearchResult_slicedToArray(_useState, 2),
      panelData = _useState2[0],
      setPanelData = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState4 = ExprSearchResult_slicedToArray(_useState3, 2),
      panelHead = _useState4[0],
      setPanelHead = _useState4[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    Object(Query["a" /* CreateConvertQuery */])(props.query).then(function (res) {
      setPanelHead(res.data.data.columnArray);
      setPanelData(res.data.data.dataMap);
    });
  }, []);
  var i = 0;
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      height: '200%'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      width: '80%',
      margin: '10px auto',
      overflow: 'scroll',
      maxHeight: '2000px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("table", {
    className: 'table_body'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("thead", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("tr", {
    className: 'table_border',
    style: {
      background: '#fff'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("td", {
    className: 'table_th'
  }, "#"), panelHead.map(function (item) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("td", {
      className: 'table_td'
    }, item);
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("tbody", null, panelData.map(function (item_tr) {
    i++;
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("tr", {
      className: i % 2 - 1 ? 'table_body1' : 'table_body0'
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("td", {
      className: 'table_td_i'
    }, i), panelHead.map(function (item_td) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("td", {
        className: 'table_td'
      }, item_tr[item_td]);
    }));
  })))));
};
// CONCATENATED MODULE: ./components/pages/Search.tsx











function Search_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = Search_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function Search_slicedToArray(arr, i) { return Search_arrayWithHoles(arr) || Search_iterableToArrayLimit(arr, i) || Search_unsupportedIterableToArray(arr, i) || Search_nonIterableRest(); }

function Search_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function Search_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return Search_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Search_arrayLikeToArray(o, minLen); }

function Search_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function Search_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function Search_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }















var Option = select_default.a.Option;

var Search_SearchPage = function _SearchPage(props) {
  var history = props.history;

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState2 = Search_slicedToArray(_useState, 2),
      searchText = _useState2[0],
      setSearchText = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(search["a" /* Search */].MetaType.Text),
      _useState4 = Search_slicedToArray(_useState3, 2),
      searchType = _useState4[0],
      setSearchType = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState6 = Search_slicedToArray(_useState5, 2),
      loading = _useState6[0],
      setLoading = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState8 = Search_slicedToArray(_useState7, 2),
      query = _useState8[0],
      setQuery = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState10 = Search_slicedToArray(_useState9, 2),
      textModified = _useState10[0],
      setTextModified = _useState10[1];

  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])('1'),
      _useState12 = Search_slicedToArray(_useState11, 2),
      currentMenu = _useState12[0],
      setCurrentMenu = _useState12[1];

  var _useState13 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState14 = Search_slicedToArray(_useState13, 2),
      isExpr = _useState14[0],
      setIsExpr = _useState14[1]; // 是否为高级搜索结果页面


  var _useState15 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState16 = Search_slicedToArray(_useState15, 2),
      isMulti = _useState16[0],
      setIsMulti = _useState16[1]; // 是否需要返回南大通用搜索结果


  var handleSearchTypeChange = function handleSearchTypeChange(value) {
    setSearchType(value);
    setTextModified(true);
  };

  var searchTypeSelect = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
    style: {
      width: 120
    },
    value: searchType,
    onChange: handleSearchTypeChange
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Option, {
    value: search["a" /* Search */].MetaType.Text
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'Full-Text Search',
    defaultMessage: "\u5168\u6587\u68C0\u7D22"
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Option, {
    value: search["a" /* Search */].MetaType.Title
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'data:title',
    defaultMessage: "\u6807\u9898"
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Option, {
    value: search["a" /* Search */].MetaType.DOI
  }, "DOI"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Option, {
    value: search["a" /* Search */].MetaType.Abstract
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'data:abstract',
    defaultMessage: "\u6458\u8981"
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Option, {
    value: search["a" /* Search */].MetaType.Author
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'author',
    defaultMessage: "\u4F5C\u8005"
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Option, {
    value: search["a" /* Search */].MetaType.Keywords
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'dataShow:keywords',
    defaultMessage: "\u5173\u952E\u8BCD"
  })));

  var handleResult = function handleResult(result) {
    setQuery(result);
    setTextModified(false);

    if (props.location.pathname.endsWith('list')) {
      history.push("/".concat(result.id, "/list"));
    } else {
      history.push("/".concat(result.id));
    }

    setLoading(false);
  };

  var handleOnSearch = function handleOnSearch(value) {
    value = value.trim();
    if (value.length === 0) return;
    setLoading(true);

    if (textModified) {
      if (searchType === search["a" /* Search */].MetaType.Text) {
        Object(Query["b" /* CreateFullTextQuery */])(value).then(handleResult)["catch"](function (reason) {
          notification_default.a['error']({
            message: reason.message
          });

          setLoading(false);
        });
      } else {
        Object(Query["c" /* CreateMetaDataQuery */])(searchType, value).then(handleResult)["catch"](function (reason) {
          notification_default.a['error']({
            message: reason.message
          });

          setLoading(false);
        });
      }
    } else {
      if (searchType === search["a" /* Search */].MetaType.Text) {
        Object(Query["j" /* PutQuery */])(query.id, {
          text: value,
          data: null,
          meta: null
        }).then(handleResult)["catch"](function (reason) {
          notification_default.a['error']({
            message: reason.message
          });

          setLoading(false);
        });
      } else {
        Object(Query["j" /* PutQuery */])(query.id, {
          meta: {
            and: [{
              field: searchType,
              val: value,
              op: search["a" /* Search */].Operator.StrContain
            }]
          }
        }).then(handleResult)["catch"](function (reason) {
          notification_default.a['error']({
            message: reason.message
          });

          setLoading(false);
        });
      }
    }
  };

  var handleRenderTypeChange = function handleRenderTypeChange(t) {
    if (query == null) {
      return;
    }

    if (t === RenderTypeView["a" /* RenderType */].Table) {
      // 列表视图
      history.push("/".concat(query.id));
    } else {
      // 简单视图
      history.push("/".concat(query.id, "/list"));
    }
  };

  var handleImgSearchClick = function handleImgSearchClick() {
    window.open(Urls["b" /* default */].image_search.index);
  };

  var handleAdvSearchClick = function handleAdvSearchClick() {
    window.open(Urls["b" /* default */].search.expr);
  };

  var templateID = props.match.params.template_id;
  var queryID = props.match.params.query_id;
  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    if (window.location.pathname.split('/')[1] === 'expr_result') {
      setIsExpr(true);
      var temp = window.location.search.split('=')[1];

      if (temp.indexOf('false') >= 0) {
        setIsMulti(false);
      } else {
        setIsMulti(true);
      }
    } else {
      setIsExpr(false);
    }
  }, []);
  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    if (queryID != null && query == null) {
      setLoading(true);
      Object(Query["e" /* GetQuery */])(Number(queryID), {}).then(function (result) {
        setQuery(result);
        setTextModified(false);

        if (result.q.value.text != null) {
          setSearchType(search["a" /* Search */].MetaType.Text);
          setSearchText(result.q.value.text);
        } else {
          try {
            setSearchType(result.q.value.meta.and[0].field);
            setSearchText(result.q.value.meta.and[0].val);
          } catch (_unused) {}
        }

        setLoading(false);
      });
    }
  }, [queryID]);

  var handleAddData = function handleAddData(id) {
    Object(SavedSearch["e" /* SaveSearchResult */])(query.id, searchText);

    if (typeof id === 'number') {
      Object(Query["i" /* PatchQueryDownload */])(query.id, {
        download: {
          data: {
            include: [id]
          }
        }
      }).then(function (result) {
        var newQuery = Query["k" /* Query */].copy(query);

        var _iterator = Search_createForOfIteratorHelper(newQuery.q.data),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var i = _step.value;

            if (i.data.id === id) {
              i.download = true;
              setQuery(newQuery);
              return;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      });
    } else {
      // 一次全选中多个数据时
      Object(Query["i" /* PatchQueryDownload */])(query.id, {
        download: {
          data: {
            include: id
          }
        }
      }).then(function (result) {
        var newQuery = Query["k" /* Query */].copy(query);

        var _iterator2 = Search_createForOfIteratorHelper(newQuery.q.data),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var i = _step2.value;

            for (var j = 0; j < id.length; j++) {
              if (i.data.id === id[j]) {
                i.download = true;
                setQuery(newQuery);
              }
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        return;
      });
    }
  };

  var handleRemoveData = function handleRemoveData(id) {
    if (typeof id === 'number') {
      Object(Query["i" /* PatchQueryDownload */])(query.id, {
        download: {
          data: {
            exclude: [id]
          }
        }
      }).then(function (result) {
        var newQuery = Query["k" /* Query */].copy(query);

        var _iterator3 = Search_createForOfIteratorHelper(newQuery.q.data),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var i = _step3.value;

            if (i.data.id === id) {
              i.download = false;
              setQuery(newQuery);
              return;
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      });
    } else {
      Object(Query["i" /* PatchQueryDownload */])(query.id, {
        download: {
          data: {
            exclude: id
          }
        }
      }).then(function (result) {
        var newQuery = Query["k" /* Query */].copy(query);

        var _iterator4 = Search_createForOfIteratorHelper(newQuery.q.data),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var i = _step4.value;

            for (var j = 0; j < id.length; j++) {
              if (i.data.id === id[j]) {
                i.download = false;
                setQuery(newQuery);
              }
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        return;
      });
    }
  };

  var handleSearchTextChange = function handleSearchTextChange(e) {
    setTextModified(true);
    setSearchText(e.target.value);
  };

  var handlePageChange = function handlePageChange(newPage) {
    setLoading(true);
    Object(Query["e" /* GetQuery */])(query.id, {
      page: newPage
    }).then(handleResult).then(function () {
      window.scrollTo({
        top: 0
      });
    });
  };

  var handleUpdateCondition = function handleUpdateCondition(cond) {
    setLoading(true);

    if (searchType === search["a" /* Search */].MetaType.Text) {
      Object(Query["j" /* PutQuery */])(query.id, {
        text: searchText,
        data: null,
        meta: {
          and: [cond]
        }
      }).then(handleResult);
    } else {
      var finalCond = cond.and.concat([{
        field: searchType,
        val: searchText,
        op: search["a" /* Search */].Operator.StrContain
      }]);
      Object(Query["j" /* PutQuery */])(query.id, {
        meta: {
          and: finalCond
        }
      }).then(handleResult);
    }
  };

  var handleAddTemplate = function handleAddTemplate(tid) {
    Object(SavedSearch["e" /* SaveSearchResult */])(query.id, searchText);
    Object(Query["i" /* PatchQueryDownload */])(query.id, {
      download: {
        template: {
          include: [tid]
        }
      }
    }).then(function (result) {
      var newQuery = Query["k" /* Query */].copy(query);

      var _iterator5 = Search_createForOfIteratorHelper(newQuery.q.summary.category),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var i = _step5.value;

          var _iterator6 = Search_createForOfIteratorHelper(i.templates),
              _step6;

          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var t = _step6.value;

              if (t.id === tid) {
                t.download = true;
                setQuery(newQuery);
                return;
              }
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    });
  };

  var handleRemoveTemplate = function handleRemoveTemplate(tid) {
    Object(Query["i" /* PatchQueryDownload */])(query.id, {
      download: {
        template: {
          exclude: [tid]
        }
      }
    }).then(function (result) {
      var newQuery = Query["k" /* Query */].copy(query);

      var _iterator7 = Search_createForOfIteratorHelper(newQuery.q.summary.category),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var i = _step7.value;

          var _iterator8 = Search_createForOfIteratorHelper(i.templates),
              _step8;

          try {
            for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
              var t = _step8.value;

              if (t.id === tid) {
                t.download = false;
                setQuery(newQuery);
                return;
              }
            }
          } catch (err) {
            _iterator8.e(err);
          } finally {
            _iterator8.f();
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    });
  };

  var renderType = templateID === 'list' ? RenderTypeView["a" /* RenderType */].List : RenderTypeView["a" /* RenderType */].Table;
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(LoadingModal["a" /* LoadingModal */], {
    loading: loading
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      backgroundColor: '#FFF',
      flexGrow: 0
    }
  }, isMulti === true ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a, {
    selectedKeys: [currentMenu],
    mode: 'horizontal',
    style: {
      padding: '0px 83px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
    key: '0',
    onClick: function onClick() {
      setCurrentMenu('0');
    }
  }, "\u5F02\u6784\u641C\u7D22"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
    key: '1',
    onClick: function onClick() {
      setCurrentMenu('1');
    }
  }, "\u5168\u6587\u68C0\u7D22")) : null, isExpr === true ? null : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Container["a" /* Container */], {
    style: {
      marginBottom: 0
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a.Search, {
    onSearch: handleOnSearch,
    onChange: handleSearchTextChange,
    value: searchText,
    style: {
      marginTop: query == null ? '20vh' : '48px',
      transition: 'margin-top 0.5s ease'
    },
    enterButton: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'search',
      defaultMessage: "\u641C\u7D22"
    }),
    size: 'large',
    addonBefore: searchTypeSelect
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      textAlign: 'right',
      padding: '8px 0'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(tag_default.a, {
    color: "#108ee9",
    onClick: handleAdvSearchClick,
    style: {
      cursor: 'pointer',
      marginRight: 0
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'help:adv_search',
    defaultMessage: "\u9AD8\u7EA7\u68C0\u7D22"
  }))), query == null ? null : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      margin: '8px 0'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RenderTypeView["b" /* RenderTypeView */], {
    value: renderType,
    onChange: handleRenderTypeChange
  })))), isMulti === true && currentMenu === '0' ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ExprSearchResult_ExprSearchResult, {
    query: query.q.value
  }) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Container["a" /* Container */], {
    style: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column'
    }
  }, query == null ? null : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(FilterView["a" /* FilterView */], {
    summary: query.q.summary,
    updateCondition: handleUpdateCondition
  }), query == null ? null : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column'
    }
  }, renderType === RenderTypeView["a" /* RenderType */].List ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SearchResultList_SearchResultList, {
    onAddData: handleAddData,
    onRemoveData: handleRemoveData,
    onPageChange: handlePageChange,
    count: query.q.total,
    page: query.q.page,
    page_size: query.q.page_size,
    data: query.q.data
  }) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(QuerySummaryView, {
    onAddData: handleAddData,
    onRemoveData: handleRemoveData,
    onAddTemplate: handleAddTemplate,
    onRemoveTemplate: handleRemoveTemplate,
    templateID: templateID == null ? null : Number(templateID),
    loading: loading,
    init: query == null,
    queryID: Number(queryID),
    summary: query.q.summary.category
  })))));
};

var SearchPage = Object(react_routerfrom_dll_reference_dll_library["withRouter"])(Search_SearchPage);

/***/ }),

/***/ 59:
/***/ (function(module, exports) {

module.exports = dll_library;

/***/ })

/******/ });