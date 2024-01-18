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
/******/ 		17: 0
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
/******/ 	deferredModules.push([1643,0]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 1643:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85);
__webpack_require__(86);
__webpack_require__(87);
module.exports = __webpack_require__(1846);


/***/ }),

/***/ 1846:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/style/index.js
var style = __webpack_require__(32);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/index.js
var lib_button = __webpack_require__(5);
var button_default = /*#__PURE__*/__webpack_require__.n(lib_button);

// EXTERNAL MODULE: ./node_modules/antd/lib/radio/style/index.js
var radio_style = __webpack_require__(117);

// EXTERNAL MODULE: ./node_modules/antd/lib/radio/index.js
var lib_radio = __webpack_require__(25);
var radio_default = /*#__PURE__*/__webpack_require__.n(lib_radio);

// EXTERNAL MODULE: ./node_modules/antd/lib/card/style/index.js
var card_style = __webpack_require__(212);

// EXTERNAL MODULE: ./node_modules/antd/lib/card/index.js
var card = __webpack_require__(106);
var card_default = /*#__PURE__*/__webpack_require__.n(card);

// EXTERNAL MODULE: delegated ./node_modules/react/index.js from dll-reference dll_library
var reactfrom_dll_reference_dll_library = __webpack_require__(0);
var reactfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(reactfrom_dll_reference_dll_library);

// EXTERNAL MODULE: ./node_modules/react-intl/lib/index.es.js + 1 modules
var index_es = __webpack_require__(2);

// EXTERNAL MODULE: delegated ./node_modules/react-router/esm/react-router.js from dll-reference dll_library
var react_routerfrom_dll_reference_dll_library = __webpack_require__(107);

// CONCATENATED MODULE: ./apis/define/Feedback.ts
var Feedback;

(function (Feedback) {
  Feedback["New"] = "new";
  Feedback["Open"] = "open";
  Feedback["Ended"] = "ended";
  Feedback["Closed"] = "closed";
})(Feedback || (Feedback = {}));
// EXTERNAL MODULE: ./apis/Urls.ts
var Urls = __webpack_require__(4);

// EXTERNAL MODULE: delegated ./node_modules/react-router-dom/esm/react-router-dom.js from dll-reference dll_library
var react_router_domfrom_dll_reference_dll_library = __webpack_require__(30);

// EXTERNAL MODULE: ./components/layout/Breadcrumb.tsx
var Breadcrumb = __webpack_require__(27);

// EXTERNAL MODULE: ./components/layout/MgeLayout.tsx + 7 modules
var MgeLayout = __webpack_require__(48);

// EXTERNAL MODULE: ./locale/Text.tsx
var Text = __webpack_require__(3);

// EXTERNAL MODULE: ./node_modules/antd/lib/tag/style/index.js
var tag_style = __webpack_require__(154);

// EXTERNAL MODULE: ./node_modules/antd/lib/tag/index.js
var tag = __webpack_require__(69);
var tag_default = /*#__PURE__*/__webpack_require__.n(tag);

// EXTERNAL MODULE: ./node_modules/antd/lib/table/style/index.js
var table_style = __webpack_require__(100);

// EXTERNAL MODULE: ./node_modules/antd/lib/table/index.js
var table = __webpack_require__(37);
var table_default = /*#__PURE__*/__webpack_require__.n(table);

// CONCATENATED MODULE: ./components/feedbacklist/FeedbacklistViewer.tsx





function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var Column = table_default.a.Column;

var FeedbacklistViewer_FeedbacklistViewer = function _FeedbacklistViewer(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = _slicedToArray(_useState, 2),
      innerdata = _useState2[0],
      setInnerData = _useState2[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setInnerData(props.data);
  }, [props.data]);
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    dataSource: innerdata,
    loading: props.loading
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('feedback:id', '#'),
    dataIndex: 'id',
    key: 'id',
    render: function render(text, record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: "/feedback_detail?id=".concat(record.id)
      }, text);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('feedback:status', '状态'),
    dataIndex: 'status',
    key: 'status',
    render: function render(record) {
      var content = null;
      var color = null;

      switch (record) {
        case 1:
          content = Object(Text["a" /* TEXT */])('feedback:processing', '处理中');
          break;

        case 2:
          content = Object(Text["a" /* TEXT */])('feedback:closing', '已关闭');
          break;

        case 3:
          content = Object(Text["a" /* TEXT */])('feedback:successing', '已完成');
          break;
      }

      if (record === 1) {
        color = 'green';
      }

      if (record === 2) {
        color = 'volcano';
      }

      if (record === 3) {
        color = 'yellow';
      }

      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(tag_default.a, {
        color: color,
        key: content.props
      }, content);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('feedback:title', '话题'),
    dataIndex: 'title',
    key: 'title'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('feedback:t_type', '主题'),
    dataIndex: 't_type',
    key: 't_type',
    render: function render(record) {
      var content = null;

      switch (record) {
        case 1:
          content = Object(Text["a" /* TEXT */])('feedback:Permissions_Request', '权限申请');
          break;

        case 2:
          content = Object(Text["a" /* TEXT */])('feedback:Template', '模板');
          break;

        case 3:
          content = Object(Text["a" /* TEXT */])('feedback:Data', '数据');
          break;

        case 4:
          content = Object(Text["a" /* TEXT */])('feedback:Suggestion', '建议');
          break;
      }

      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, content, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null));
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('feedback:creat_time', '创建时间'),
    dataIndex: 'created_at',
    key: 'created_at'
  })));
};

var FeedbacklistViewer = Object(react_routerfrom_dll_reference_dll_library["withRouter"])(FeedbacklistViewer_FeedbacklistViewer);
// EXTERNAL MODULE: ./apis/Fetch.ts
var Fetch = __webpack_require__(7);

// CONCATENATED MODULE: ./apis/template/feedbacklist.ts
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function GetFeedbackList(_x, _x2) {
  return _GetFeedbackList.apply(this, arguments);
}

function _GetFeedbackList() {
  _GetFeedbackList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(type, page) {
    var url;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = Urls["b" /* default */].feedback_list;
            return _context.abrupt("return", Object(Fetch["e" /* RestApiFetch */])(url + '?type=' + type + '&page=' + page));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _GetFeedbackList.apply(this, arguments);
}
// EXTERNAL MODULE: delegated ./node_modules/react-dom/index.js from dll-reference dll_library
var react_domfrom_dll_reference_dll_library = __webpack_require__(11);
var react_domfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(react_domfrom_dll_reference_dll_library);

// CONCATENATED MODULE: ./entry/feedbacklist.tsx
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

function feedbacklist_slicedToArray(arr, i) { return feedbacklist_arrayWithHoles(arr) || feedbacklist_iterableToArrayLimit(arr, i) || feedbacklist_unsupportedIterableToArray(arr, i) || feedbacklist_nonIterableRest(); }

function feedbacklist_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function feedbacklist_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return feedbacklist_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return feedbacklist_arrayLikeToArray(o, minLen); }

function feedbacklist_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function feedbacklist_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function feedbacklist_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }













var breadcrumbItems = [{
  title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'feedback:MGED',
    defaultMessage: "\u6750\u6599\u57FA\u56E0\u5DE5\u7A0B\u4E13\u7528\u6570\u636E\u5E93"
  }),
  url: Urls["b" /* default */].site_index
}, {
  title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'feedback:mdb',
    defaultMessage: "\u6750\u6599\u6570\u636E\u5E93"
  }),
  url: Urls["b" /* default */].search.index
}, {
  title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'feedback:Feedback_list',
    defaultMessage: "\u53CD\u9988\u5355\u5217\u8868"
  })
}];

function PathnameToReviewState(pathname) {
  if (pathname.startsWith('/new')) {
    return Feedback.New;
  } else if (pathname.startsWith('/open')) {
    return Feedback.Open;
  } else if (pathname.startsWith('/closed')) {
    return Feedback.Closed;
  } else if (pathname.startsWith('/ended')) {
    return Feedback.Ended;
  } else {
    return Feedback.New;
  }
}

var feedbacklist_Feedbacklist = function _Feedbacklist(props) {
  var currentState = PathnameToReviewState(props.location.pathname);

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = feedbacklist_slicedToArray(_useState, 2),
      innerdata = _useState2[0],
      setInnerData = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(""),
      _useState4 = feedbacklist_slicedToArray(_useState3, 2),
      type = _useState4[0],
      setType = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState6 = feedbacklist_slicedToArray(_useState5, 2),
      page = _useState6[0],
      setPage = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState8 = feedbacklist_slicedToArray(_useState7, 2),
      loading = _useState8[0],
      setLoading = _useState8[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setLoading(true);
    GetFeedbackList(currentState, page).then(function (res) {
      setLoading(false);
      setPage(res.data.current_page);
      setType(res.data.ticket_type);
      setInnerData(res.data.ticket_list);
    });
  }, [props.location.pathname]);
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeLayout["a" /* MgeLayout */], null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Breadcrumb["a" /* Breadcrumb */], {
    items: breadcrumbItems
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(card_default.a, {
    style: {
      textAlign: 'left',
      padding: '16px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, {
    value: currentState,
    size: 'large',
    buttonStyle: 'solid',
    style: {
      padding: '16px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: Feedback.New,
    onClick: function onClick() {
      return props.history.push('/new');
    }
  }, Object(Text["a" /* TEXT */])('feedback:new', '新的回复')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    style: {
      color: 'green'
    },
    value: Feedback.Open,
    onClick: function onClick() {
      return props.history.push('/open');
    }
  }, Object(Text["a" /* TEXT */])('feedback:processing', '处理中')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    style: {
      color: 'yellow'
    },
    value: Feedback.Ended,
    onClick: function onClick() {
      return props.history.push('/ended');
    }
  }, Object(Text["a" /* TEXT */])('feedback:successing', '已完成')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    style: {
      color: 'red'
    },
    value: Feedback.Closed,
    onClick: function onClick() {
      return props.history.push('/closed');
    }
  }, Object(Text["a" /* TEXT */])('feedback:closing', '已关闭'))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    href: '../submit_feedback',
    className: 'top_button',
    type: 'primary',
    style: {
      textAlign: 'left',
      "float": 'right'
    }
  }, Object(Text["a" /* TEXT */])('feedback:new_feedbacklist', '创建新的反馈单')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(FeedbacklistViewer, {
    data: innerdata,
    loading: loading
  })));
};

var Feedback_list = Object(react_routerfrom_dll_reference_dll_library["withRouter"])(feedbacklist_Feedbacklist);

var entry_feedbacklist_Feedbacklist = /*#__PURE__*/function (_Component) {
  _inherits(Feedbacklist, _Component);

  var _super = _createSuper(Feedbacklist);

  function Feedbacklist() {
    _classCallCheck(this, Feedbacklist);

    return _super.apply(this, arguments);
  }

  _createClass(Feedbacklist, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["HashRouter"], null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
        path: '/',
        exact: true,
        component: Feedback_list
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
        path: '/open',
        exact: true,
        component: Feedback_list
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
        path: '/closed',
        exact: true,
        component: Feedback_list
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
        path: '/ended',
        exact: true,
        component: Feedback_list
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
        path: '/new',
        exact: true,
        component: Feedback_list
      }));
    }
  }]);

  return Feedbacklist;
}(reactfrom_dll_reference_dll_library["Component"]);

react_domfrom_dll_reference_dll_library_default.a.render( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(entry_feedbacklist_Feedbacklist, null), document.getElementById('wrap'));

/***/ }),

/***/ 59:
/***/ (function(module, exports) {

module.exports = dll_library;

/***/ })

/******/ });