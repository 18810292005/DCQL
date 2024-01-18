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
/******/ 		3: 0
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
/******/ 	deferredModules.push([1786,0]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 1786:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85);
__webpack_require__(86);
__webpack_require__(87);
module.exports = __webpack_require__(1787);


/***/ }),

/***/ 1787:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_intl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2);
/* harmony import */ var _CertificateViewer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(660);
/* harmony import */ var _components_layout_Breadcrumb__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(27);
/* harmony import */ var _components_layout_MgeLayout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(48);
/* harmony import */ var _certificate_less__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(712);
/* harmony import */ var _certificate_less__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_certificate_less__WEBPACK_IMPORTED_MODULE_6__);
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









var img = __webpack_require__(448);

var logo = __webpack_require__(410);

var breadcrumbItems = // {
//     title: <FormattedMessage id='MGED' defaultMessage='材料基因工程专用数据库' />,
//     url: Urls.site_index,
// },
// {
//     title: <FormattedMessage id='mdb' defaultMessage='材料数据库'/>,
//     url: Urls.search.index,
// },
{
  title: /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(react_intl__WEBPACK_IMPORTED_MODULE_2__[/* FormattedMessage */ "a"], {
    id: 'certificate',
    defaultMessage: "\u6C47\u4EA4\u8BC1\u660E"
  })
};

var Certificate = /*#__PURE__*/function (_Component) {
  _inherits(Certificate, _Component);

  var _super = _createSuper(Certificate);

  function Certificate() {
    _classCallCheck(this, Certificate);

    return _super.apply(this, arguments);
  }

  _createClass(Certificate, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_layout_MgeLayout__WEBPACK_IMPORTED_MODULE_5__[/* MgeLayout */ "a"], {
        contentStyle: {
          flexDirection: 'column',
          display: 'flex'
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_components_layout_Breadcrumb__WEBPACK_IMPORTED_MODULE_4__[/* Breadcrumb */ "a"], {
        items: [_components_layout_Breadcrumb__WEBPACK_IMPORTED_MODULE_4__[/* Breadcrumb */ "a"].MGED, _components_layout_Breadcrumb__WEBPACK_IMPORTED_MODULE_4__[/* Breadcrumb */ "a"].MDB, breadcrumbItems]
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(_CertificateViewer__WEBPACK_IMPORTED_MODULE_3__[/* CertificateViewer */ "a"], null));
    }
  }]);

  return Certificate;
}(react__WEBPACK_IMPORTED_MODULE_0__["Component"]);

react_dom__WEBPACK_IMPORTED_MODULE_1___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Certificate, null), document.getElementById('wrap'));

/***/ }),

/***/ 410:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/certificate_logo.png";

/***/ }),

/***/ 448:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/expired.png";

/***/ }),

/***/ 59:
/***/ (function(module, exports) {

module.exports = dll_library;

/***/ }),

/***/ 660:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* binding */ CertificateViewer_CertificateViewer; });

// EXTERNAL MODULE: ./node_modules/antd/lib/col/style/index.js
var style = __webpack_require__(142);

// EXTERNAL MODULE: ./node_modules/antd/lib/col/index.js
var col = __webpack_require__(14);
var col_default = /*#__PURE__*/__webpack_require__.n(col);

// EXTERNAL MODULE: ./node_modules/antd/lib/row/style/index.js
var row_style = __webpack_require__(143);

// EXTERNAL MODULE: ./node_modules/antd/lib/row/index.js
var row = __webpack_require__(35);
var row_default = /*#__PURE__*/__webpack_require__.n(row);

// EXTERNAL MODULE: ./node_modules/antd/lib/card/style/index.js
var card_style = __webpack_require__(212);

// EXTERNAL MODULE: ./node_modules/antd/lib/card/index.js
var card = __webpack_require__(106);
var card_default = /*#__PURE__*/__webpack_require__.n(card);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/style/index.js
var button_style = __webpack_require__(32);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/index.js
var lib_button = __webpack_require__(5);
var button_default = /*#__PURE__*/__webpack_require__.n(lib_button);

// EXTERNAL MODULE: ./node_modules/antd/lib/notification/style/index.js
var notification_style = __webpack_require__(60);

// EXTERNAL MODULE: ./node_modules/antd/lib/notification/index.js
var notification = __webpack_require__(10);
var notification_default = /*#__PURE__*/__webpack_require__.n(notification);

// EXTERNAL MODULE: delegated ./node_modules/react/index.js from dll-reference dll_library
var reactfrom_dll_reference_dll_library = __webpack_require__(0);
var reactfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(reactfrom_dll_reference_dll_library);

// EXTERNAL MODULE: ./apis/Fetch.ts
var Fetch = __webpack_require__(7);

// EXTERNAL MODULE: ./apis/Urls.ts
var Urls = __webpack_require__(4);

// CONCATENATED MODULE: ./apis/certificate/Get.ts


function GetCertificate(cert_key) {
  var url = Urls["b" /* default */].api_cert.get_certificate(cert_key);
  return Object(Fetch["k" /* default */])(url, 'GET');
}
function DownloadData(cert_key, tid, random) {
  var url = Urls["b" /* default */].api_cert.download_data(cert_key);
  return Object(Fetch["k" /* default */])(url + '?tid=' + tid + '&random=' + random);
}
// EXTERNAL MODULE: ./entry/certificate.less
var certificate = __webpack_require__(712);

// EXTERNAL MODULE: ./node_modules/antd/lib/layout/style/index.js
var layout_style = __webpack_require__(203);

// EXTERNAL MODULE: ./node_modules/antd/lib/layout/index.js
var layout = __webpack_require__(80);
var layout_default = /*#__PURE__*/__webpack_require__.n(layout);

// EXTERNAL MODULE: ./node_modules/react-intl/lib/index.es.js + 1 modules
var index_es = __webpack_require__(2);

// EXTERNAL MODULE: ./components/layout/Breadcrumb.tsx
var Breadcrumb = __webpack_require__(27);

// EXTERNAL MODULE: ./components/layout/MgeHeader.less
var MgeHeader = __webpack_require__(773);

// EXTERNAL MODULE: ./entry/mobile/certificate.less
var mobile_certificate = __webpack_require__(853);

// CONCATENATED MODULE: ./entry/mobile/certificate.tsx
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








var breadcrumbItems = {
  title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'certificate',
    defaultMessage: "\u6C47\u4EA4\u8BC1\u660E"
  })
};

var img = __webpack_require__(448);

var logo = __webpack_require__(410);

var logo_main = __webpack_require__(854);

var Header = layout_default.a.Header,
    Content = layout_default.a.Content,
    Footer = layout_default.a.Footer;
var styles = {
  Footer: {
    // textAlign: 'center',
    background: '#1A242F',
    color: '#FFF'
  },
  brand: {
    'fontSize': '16px',
    '& p': {
      marginBottom: '18px'
    },
    '& a': {
      color: '#00a8ff'
    }
  },
  intro: {
    'fontSize': '18px',
    '& li': {
      'display': 'inline',
      'borderRight': 'white solid',
      'borderRightWidth': '1px',
      'padding': '0 48px',
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
var date = new Date();
var year = date.getFullYear();
var certificate_CertificateMobile = /*#__PURE__*/function (_Component) {
  _inherits(CertificateMobile, _Component);

  var _super = _createSuper(CertificateMobile);

  function CertificateMobile(props) {
    var _this;

    _classCallCheck(this, CertificateMobile);

    _this = _super.call(this, props);
    _this.state = {
      dataSource: [],
      data_count: 0,
      field_count: 0,
      table_row_count: 0,
      expired: false,
      qr_code: '',
      is_project: false,
      project_info: {},
      subject_info: {},
      issue_time: '',
      fetched: false
    };
    return _this;
  }

  _createClass(CertificateMobile, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var cert_key = String(window.location.pathname.split('/').pop());
      GetCertificate(cert_key).then(function (res) {
        _this2.setState({
          dataSource: res.categories,
          data_count: res.data_count,
          field_count: res.field_count,
          table_row_count: res.table_row_count,
          expired: res.expired,
          qr_code: res.qr_code,
          is_project: res.is_project,
          project_info: res.project,
          subject_info: res.is_project ? {} : res.subject,
          issue_time: res.issue_time,
          fetched: true
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(layout_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Header, {
        style: {
          display: 'flex',
          flexDirection: 'row'
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        className: 'mge-header__title',
        href: Urls["b" /* default */].site_index
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: logo_main,
        style: this.props.indexOnly ? {
          marginTop: '-12px',
          height: 68,
          width: 'unset'
        } : null
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'mge-header__title__text'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'material'
      }, "\u6750\u6599\u6570\u636E\u5E93"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'mged'
      }, "Material Database")))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Breadcrumb["a" /* Breadcrumb */], {
        items: [Breadcrumb["a" /* Breadcrumb */].MGED, Breadcrumb["a" /* Breadcrumb */].MDB, breadcrumbItems],
        style: {
          padding: '0 5px'
        }
      }), this.state.fetched == true ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Content, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        style: {
          margin: 'auto'
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(card_default.a, {
        className: 'card'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, {
        gutter: 1
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
        span: 24
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'card_head'
      }, "\u9879\u76EE\u4FE1\u606F"))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
        span: 6
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'row'
      }, "\u9879\u76EE\u540D\u79F0")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
        span: 18
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'row'
      }, this.state.project_info.name))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
        span: 6
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'row'
      }, "\u9879\u76EE\u7F16\u53F7")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
        span: 18
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'row'
      }, this.state.project_info.id))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
        span: 6
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'row'
      }, "\u9879\u76EE\u8D1F\u8D23\u4EBA")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
        span: 18
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'row'
      }, this.state.project_info.leader))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
        span: 6
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'row'
      }, "\u9879\u76EE\u5355\u4F4D")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
        span: 18
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'row'
      }, this.state.project_info.ins))))), this.state.is_project === false ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        style: {
          flexDirection: 'column',
          display: 'flex'
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(card_default.a, {
        className: 'card'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, {
        gutter: 1
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
        span: 24
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'card_head'
      }, "\u8BFE\u9898\u4FE1\u606F"))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
        span: 6
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'row'
      }, "\u8BFE\u9898\u540D\u79F0")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
        span: 18
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'row'
      }, this.state.subject_info.name))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
        span: 6
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'row'
      }, "\u8BFE\u9898\u7F16\u53F7")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
        span: 18
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'row'
      }, this.state.subject_info.id))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
        span: 6
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'row'
      }, "\u8BFE\u9898\u8D1F\u8D23\u4EBA")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
        span: 18
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'row'
      }, this.state.subject_info.leader))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
        span: 6
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'row'
      }, "\u8BFE\u9898\u5355\u4F4D")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
        span: 18
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'row'
      }, this.state.subject_info.ins)))))) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, this.state.expired === true ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'img'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        style: {
          width: '204px',
          marginTop: '30px'
        },
        src: img
      })) : null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'card_mobile'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'issue_time'
      }, "\u7EDF\u8BA1\u622A\u6B62\u81F3\uFF1A", this.state.issue_time)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'table_main_mobile',
        style: {
          width: '100%',
          padding: '0 10px'
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'table_column'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'table_title',
        style: {
          height: '44px'
        }
      }, "\u6750\u6599\u7C7B\u522B"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'table_title',
        style: {
          height: '44px'
        }
      }, "\u6A21\u677F\u540D"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'table_title'
      }, "\u6570\u636E\u6761\u6570"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'table_title'
      }, "\u6A21\u677F\u53C2\u6570\u4E2A\u6570"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'table_title'
      }, "\u8868\u683C\u884C\u6570")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'table_column'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'table_title3',
        style: {
          height: '91px',
          fontSize: '14px'
        }
      }, "\u53C2\u6570\u8BF4\u660E"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'table_title3'
      }, "\u6309\u7167\u6A21\u677F\u4E0A\u4F20\u7684\u6570\u636E\u6761\u6570"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'table_title3'
      }, "\u6A21\u677F\u7684\u6240\u6709\u6570\u636E\u4E2D\uFF0C\u6709\u6548\u7684\u53C2\u6570\u4E2A\u6570\u603B\u548C"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'table_title3'
      }, "\u6A21\u677F\u7684\u6240\u6709\u6570\u636E\u4E2D\uFF0C\u8868\u683C\u6570\u636E\uFF08\u5DE5\u827A\u3001\u6027\u80FD\u7B49\u8868\u683C\uFF09\u7684\u603B\u884C\u6570")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'table_column'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'table_title2',
        style: {
          width: '64px',
          height: '91px',
          fontSize: '14px'
        }
      }, "\u603B\u8BA1"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'table_title2'
      }, this.state.data_count), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'table_title2'
      }, this.state.field_count), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'table_title2'
      }, this.state.table_row_count)), this.state.dataSource.map(function (item) {
        return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table_column',
          style: {
            marginRight: '0px'
          }
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table_head'
        }, item.category), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          style: {
            display: "flex",
            flexDirection: 'row'
          }
        }, item.templates.map(function (template) {
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
            className: 'table_column'
          }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
            className: 'table_content',
            style: {
              height: '44px'
            }
          }, template.title), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
            className: 'table_content'
          }, template.data_count), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
            className: 'table_content'
          }, template.field_count), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
            className: 'table_content'
          }, template.table_row_count));
        })));
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'certificate_footer'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        style: {
          textAlign: 'center'
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: logo,
        className: 'img_logo'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'text',
        style: {
          textAlign: 'center'
        }
      }, "\u56FD\u5BB6\u6750\u6599\u6570\u636E\u7BA1\u7406\u4E0E\u670D\u52A1\u5E73\u53F0"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        style: {
          textAlign: 'center',
          position: 'relative'
        }
      }, this.state.expired === true ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        style: {
          width: '204px',
          zIndex: 10,
          position: 'absolute',
          marginTop: '10px'
        },
        src: img
      }) : null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: 'data:image/png;base64,' + this.state.qr_code,
        style: {
          width: '204px',
          height: '202px',
          marginBottom: '10px'
        }
      }))))))) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        style: {
          width: '95%',
          margin: 'auto',
          padding: '25px 67px'
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("h2", {
        style: {
          textAlign: 'center'
        }
      }, "\u52A0\u8F7D\u4E2D")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Footer, {
        style: styles.Footer
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, " ", year, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'footer:copyright',
        defaultMessage: "\u7248\u6743\u6240\u6709"
      }), "\xA9", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: Urls["b" /* default */].site_index
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'MGED',
        defaultMessage: "\u56FD\u5BB6\u6750\u6599\u57FA\u56E0\u5DE5\u7A0B\u6570\u636E\u6C47\u4EA4\u4E0E\u7BA1\u7406\u670D\u52A1\u6280\u672F\u5E73\u53F0"
      })))));
    }
  }]);

  return CertificateMobile;
}(reactfrom_dll_reference_dll_library["Component"]);
// CONCATENATED MODULE: ./entry/CertificateViewer.tsx
function CertificateViewer_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { CertificateViewer_typeof = function _typeof(obj) { return typeof obj; }; } else { CertificateViewer_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return CertificateViewer_typeof(obj); }












function CertificateViewer_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function CertificateViewer_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function CertificateViewer_createClass(Constructor, protoProps, staticProps) { if (protoProps) CertificateViewer_defineProperties(Constructor.prototype, protoProps); if (staticProps) CertificateViewer_defineProperties(Constructor, staticProps); return Constructor; }

function CertificateViewer_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) CertificateViewer_setPrototypeOf(subClass, superClass); }

function CertificateViewer_setPrototypeOf(o, p) { CertificateViewer_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return CertificateViewer_setPrototypeOf(o, p); }

function CertificateViewer_createSuper(Derived) { var hasNativeReflectConstruct = CertificateViewer_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = CertificateViewer_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = CertificateViewer_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return CertificateViewer_possibleConstructorReturn(this, result); }; }

function CertificateViewer_possibleConstructorReturn(self, call) { if (call && (CertificateViewer_typeof(call) === "object" || typeof call === "function")) { return call; } return CertificateViewer_assertThisInitialized(self); }

function CertificateViewer_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function CertificateViewer_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function CertificateViewer_getPrototypeOf(o) { CertificateViewer_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return CertificateViewer_getPrototypeOf(o); }






var CertificateViewer_img = __webpack_require__(448);

var CertificateViewer_logo = __webpack_require__(410);

function conver(limit) {
  // 当前后端传过来的数据单位为B
  var size = '';

  if (limit < 0.1 * 1024) {
    // 如果小于0.1KB转化成B
    size = limit.toFixed(2) + 'B';
  } else if (limit < 0.1 * 1024 * 1024) {
    // 如果小于0.1MB转化成KB
    size = (limit / 1024).toFixed(2) + 'KB';
  } else if (limit < 0.1 * 1024 * 1024 * 1024) {
    // 如果小于0.1GB转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + 'MB';
  } else {
    // 其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB';
  }

  var sizestr = size + '';
  var len = sizestr.indexOf('\.');
  var dec = sizestr.substr(len + 1, 2);

  if (dec === '00') {
    // 当小数点后为00时 去掉小数部分
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  }

  return sizestr;
} // 用于隐藏为0的数据


function conceal(i) {
  var is_data_size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!is_data_size) {
    return i === 0 ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, " ") : '(' + i + ')';
  } else {
    return i === '0B' ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, " ") : '(' + i + ')';
  }
} // 用于显示项目、课题信息


function show_info(info, is_project) {
  var res = [];

  for (var item in info) {
    var obj = {
      key: '',
      value: ''
    };

    switch (item) {
      case 'name':
        {
          obj.key = is_project ? '项目名称' : '课题名称';
          obj.value = info['name'];
        }
        break;

      case 'ins':
        {
          obj.key = is_project ? '项目单位' : '课题单位';
          obj.value = info['ins'];
        }
        break;

      case 'id':
        {
          obj.key = is_project ? '项目编号' : '课题编号';
          obj.value = info['id'];
        }
        break;

      case 'leader':
        {
          obj.key = is_project ? '项目负责人' : '课题负责人';
          obj.value = info['leader'];
        }
        break;

      default:
        {
          obj.key = item;
          obj.value = info[item];
        }
    }

    res.push(obj);
  }

  return res;
}

var CertificateViewer_CertificateViewer = /*#__PURE__*/function (_Component) {
  CertificateViewer_inherits(CertificateViewer, _Component);

  var _super = CertificateViewer_createSuper(CertificateViewer);

  function CertificateViewer(props) {
    var _this;

    CertificateViewer_classCallCheck(this, CertificateViewer);

    _this = _super.call(this, props);

    _this.handleExport = function () {
      // 新的汇交证明导出
      window.open(window.location.pathname + '/pdf');
    };

    _this.handleDownload = function (tid, random) {
      DownloadData(_this.state.cert_key, tid, random).then(function (res) {
        notification_default.a.success({
          message: '下载任务已添加，可前往任务页面查看'
        });
      })["catch"](function (res) {
        notification_default.a.error({
          message: res.message
        });
      });
    };

    _this.state = {
      cert_key: '',
      dataSource: [],
      research: [],
      data_count: 0,
      data_count_private: 0,
      field_count: 0,
      field_count_private: 0,
      table_count: 0,
      table_count_private: 0,
      image_count: 0,
      image_count_private: 0,
      file_count: 0,
      file_count_private: 0,
      expired: false,
      qr_code: '',
      is_project: false,
      project_info: {},
      subject_info: {},
      issue_time: '',
      fetched: false,
      is_PC: true,
      data_size: 0,
      data_size_private: 0,
      getPDF: false,
      percent: 0
    };
    return _this;
  }

  CertificateViewer_createClass(CertificateViewer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var device = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
      var cert_key = '';

      if (this.props.cert_key == null) {
        // cert_key = window.location.search.split('?')[1].split('cert_key=')[1];
        cert_key = String(window.location.pathname.split('/').pop());
      } else {
        cert_key = this.props.cert_key;
      }

      this.setState({
        is_PC: device == null,
        cert_key: cert_key
      });
      GetCertificate(cert_key).then(function (res) {
        _this2.setState({
          dataSource: res.categories,
          research: res.research,
          research_private: res.research_private,
          data_count: res.data_count,
          data_count_private: res.data_count_private,
          field_count: res.field_count,
          field_count_private: res.field_count_private,
          table_count: res.table_count,
          table_count_private: res.table_count_private,
          expired: res.expired,
          qr_code: res.qr_code,
          is_project: res.is_project,
          project_info: res.project,
          subject_info: res.is_project ? {} : res.subject,
          issue_time: res.issue_time,
          data_size: res.data_size,
          data_size_private: res.data_size_private,
          image_count: res.image_count,
          image_count_private: res.image_count_private,
          file_count: res.file_count,
          file_count_private: res.file_count_private,
          fetched: true
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      if (this.state.is_PC) {
        return this.state.fetched ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          style: {
            margin: ' 0 0 10px 100px',
            display: this.props.cert_key == null && this.state.expired === false ? 'block' : 'none'
          }
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
          type: 'primary',
          style: {
            textAlign: 'center'
          },
          id: 'submitButton',
          onClick: this.handleExport
        }, "\u4E0B\u8F7D\u8BC1\u660E")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          style: {
            width: '1300px',
            margin: 'auto',
            padding: '20px 0px'
          }
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          style: {
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center'
          }
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          style: {
            width: '80%',
            margin: 'auto'
          }
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(card_default.a, {
          className: 'card'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("form", {
          name: 'VerificationReport1'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, {
          gutter: 1
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
          span: 24
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'card_head'
        }, "\u9879\u76EE\u4FE1\u606F"))), show_info(this.state.project_info, true).map(function (item) {
          return (
            /*#__PURE__*/
            // <form name='VerificationReport1'>
            reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, {
              gutter: [8, 16],
              type: 'flex',
              style: {
                borderBottom: '3px solid #f0f2f5'
              }
            }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
              span: 15,
              className: 'row',
              style: {
                borderRight: '3px solid #f0f2f5'
              }
            }, item.key), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
              span: 8,
              className: 'row'
            }, item.value)) // </form>

          );
        })))), this.state.is_project == false ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          style: {
            width: '80%',
            margin: 'auto'
          }
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(card_default.a, {
          className: 'card'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("form", {
          name: 'VerificationReport1'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, {
          gutter: 1
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
          span: 24
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'card_head'
        }, "\u8BFE\u9898\u4FE1\u606F"))), show_info(this.state.subject_info, false).map(function (item) {
          return (
            /*#__PURE__*/
            // <form name='VerificationReport1'>
            reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, {
              type: 'flex',
              gutter: [8, 16],
              style: {
                borderBottom: '3px solid #f0f2f5'
              }
            }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
              span: 15,
              className: 'row',
              style: {
                borderRight: '3px solid #f0f2f5'
              }
            }, item.key), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
              span: 8,
              className: 'row'
            }, item.value)) // </form>

          );
        })))) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("form", {
          name: 'VerificationReport1'
        }, this.state.expired === true ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'img'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
          style: {
            width: '30%',
            marginTop: '30px'
          },
          src: CertificateViewer_img
        })) : null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'card',
          style: {
            background: 'white'
          }
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'issue_time',
          style: {
            marginTop: '10px'
          }
        }, "\u7EDF\u8BA1\u622A\u6B62\u81F3\uFF1A", this.state.issue_time), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'issue_time'
        }, "\u6CE8\uFF1A\u62EC\u53F7\u5185\u4E3A\u5BF9\u5E94\u9879\u76EE\u4E0B\u672A\u516C\u5F00\u6570\u636E\u7EDF\u8BA1\u503C"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table_row'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table',
          style: {
            borderRadius: '8px 0 0 0',
            width: '10%'
          }
        }, "\u6750\u6599\u7C7B\u522B"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table'
        }, "\u6A21\u677F\u540D\u79F0"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table'
        }, "\u6570\u636E\u6761\u6570"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table'
        }, "\u6570\u636E\u5927\u5C0F"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table'
        }, "\u6A21\u677F\u53C2\u6570\u4E2A\u6570"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table'
        }, "\u8868\u683C\u603B\u6570\u91CF"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table'
        }, "\u56FE\u7247\u603B\u6570\u91CF"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table'
        }, "\u6587\u4EF6\u603B\u6570\u91CF"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table'
        }, "\u6570\u636E\u539F\u59CB\u6587\u4EF6\u4E0B\u8F7D"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table',
          style: {
            borderRadius: '0 8px 0 0'
          }
        }, "\u6570\u636E\u62BD\u67E5\u6587\u4EF6\u4E0B\u8F7D"))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'card'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table_row'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_left'
        }, "\u53C2\u6570\u8BF4\u660E"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table_main'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'content_blank'
        }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          style: {
            width: '4px',
            background: 'white'
          }
        }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_content'
        }, "\u6309\u7167\u6A21\u677F\u4E0A\u4F20\u7684\u6570\u636E\u6761\u6570"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_content'
        }, "\u6570\u636E\u5927\u5C0F"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_content'
        }, "\u6A21\u677F\u7684\u6240\u6709\u6570\u636E\u4E2D\uFF0C\u6709\u6548\u7684\u53C2\u6570\u4E2A\u6570\u603B\u548C"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_content'
        }, "\u8868\u683C\u603B\u6570\u91CF"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_content'
        }, "\u56FE\u7247\u603B\u6570\u91CF"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_content'
        }, "\u9644\u4EF6\u603B\u6570\u91CF"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_content'
        }, "\u4E0B\u8F7D\u5BF9\u5E94\u6A21\u677F\u4E0B\u7684\u6240\u6709\u6570\u636E\uFF08\u4E0D\u5305\u62EC\u56FE\u7247\u548C\u9644\u4EF6\uFF09"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_content'
        }, "\u968F\u673A\u62BD\u53D6\u5341\u5206\u4E4B\u4E00\u7684\u6570\u636E\u8FDB\u884C\u4E0B\u8F7D\uFF08\u5305\u62EC\u6240\u6709\u56FE\u7247\u548C\u9644\u4EF6\uFF09")))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'card'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table_row'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_left'
        }, "\u603B\u8BA1"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table_main'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'content_blank'
        }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          style: {
            width: '4px',
            background: 'white'
          }
        }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_content'
        }, this.state.data_count, conceal(this.state.data_count_private)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_content'
        }, conver(this.state.data_size), conceal(conver(this.state.data_size_private), true)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_content'
        }, this.state.field_count, conceal(this.state.field_count_private)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_content'
        }, this.state.table_count, conceal(this.state.table_count_private)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_content'
        }, this.state.image_count, conceal(this.state.image_count_private)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_content'
        }, this.state.file_count, conceal(this.state.file_count_private)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_content'
        }, " "), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_content'
        }, " "))))), this.state.dataSource.map(function (item) {
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("form", {
            name: 'VerificationReport1'
          }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
            className: 'card',
            style: {
              marginTop: '4px'
            }
          }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
            className: 'table_row'
          }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
            className: 'content_left'
          }, item.category), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
            style: {
              width: '90%'
            }
          }, item.templates.map(function (template) {
            return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
              className: 'table_row',
              style: {
                marginBottom: '4px'
              }
            }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
              className: 'content'
            }, template.title), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
              className: 'content'
            }, template.data_count, conceal(template.data_count_private)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
              className: 'content'
            }, conver(template.data_size), conceal(conver(template.data_size_private), true)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
              className: 'content'
            }, template.field_count, conceal(template.field_count_private)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
              className: 'content'
            }, template.table_count, conceal(template.table_count_private)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
              className: 'content'
            }, template.image_count, conceal(template.image_count_private)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
              className: 'content'
            }, template.file_count, conceal(template.file_count_private)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
              className: 'content',
              onClick: function onClick() {
                _this3.handleDownload(template.tid, 0);
              }
            }, "\u70B9\u51FB\u4E0B\u8F7D"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
              className: 'content',
              onClick: function onClick() {
                _this3.handleDownload(template.tid, 1);
              }
            }, "\u70B9\u51FB\u4E0B\u8F7D"));
          })))));
        }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("form", {
          name: 'VerificationReport1'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'card',
          style: this.state.research.length > 0 ? {
            background: 'white'
          } : {
            display: 'none',
            background: 'white'
          }
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table_row'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table',
          style: {
            borderRadius: '8px 0 0 0',
            width: '40%',
            fontSize: '20px'
          }
        }, "\u79D1\u7814\u6210\u679C\u540D\u79F0"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table',
          style: {
            width: '20%',
            fontSize: '20px'
          }
        }, "\u5E73\u53F0\u63D0\u4EA4\u6570\u91CF"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table',
          style: {
            width: '20%',
            fontSize: '20px'
          }
        }, "\u6240\u6709\u6587\u4EF6\u4E0B\u8F7D"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'table',
          style: {
            borderRadius: '0 8px 0 0',
            width: '20%',
            fontSize: '20px'
          }
        }, "\u62BD\u67E5\u6587\u4EF6\u4E0B\u8F7D"))), this.state.research.map(function (item, index) {
          if (item.count !== 0) {
            return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
              className: 'table_row',
              style: {
                marginBottom: '4px'
              }
            }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
              className: 'content',
              style: {
                width: '40%'
              }
            }, item.name), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
              className: 'content',
              style: {
                width: '20%'
              }
            }, item.count, conceal(_this3.state.research_private[index].count)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
              className: 'content',
              style: {
                width: '20%'
              }
            }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
              onClick: function onClick() {
                _this3.handleDownload(item.tid, 0);
              }
            }, "\u4E0B\u8F7D")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
              className: 'content',
              style: {
                width: '20%'
              }
            }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
              onClick: function onClick() {
                _this3.handleDownload(item.tid, 0);
              }
            }, "\u4E0B\u8F7D")));
          }
        })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("form", {
          name: this.props.cert_key === undefined ? 'VerificationReport1' : 'display_none'
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'certificate_footer',
          style: this.props.cert_key === undefined ? {} : {
            display: 'none'
          }
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          style: {
            textAlign: 'center'
          }
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
          src: CertificateViewer_logo,
          className: 'img_logo'
        }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'text',
          style: {
            textAlign: 'center'
          }
        }, "\u56FD\u5BB6\u6750\u6599\u6570\u636E\u7BA1\u7406\u4E0E\u670D\u52A1\u5E73\u53F0"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          style: {
            textAlign: 'center',
            position: 'relative'
          }
        }, this.state.expired === true ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
          style: {
            width: '25%',
            zIndex: 10,
            position: 'absolute'
          },
          src: CertificateViewer_img
        }) : null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
          src: 'data:image/png;base64,' + this.state.qr_code,
          style: {
            width: '20%'
          }
        })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: 'issue_time'
        }, "\u6700\u65B0\u8BC1\u660E\u6587\u4EF6\u53EF\u626B\u63CF\u4E8C\u7EF4\u7801\u67E5\u770B"))))))) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          style: {
            width: '95%',
            margin: 'auto',
            padding: '25px 67px'
          }
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("h2", {
          style: {
            textAlign: 'center'
          }
        }, "\u52A0\u8F7D\u4E2D")));
      } else {
        return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(certificate_CertificateMobile, null);
      }
    }
  }]);

  return CertificateViewer;
}(reactfrom_dll_reference_dll_library["Component"]); // ReactDOM.render(<CertificateViewer />, document.getElementById('wrap'));

/***/ }),

/***/ 712:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 853:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 854:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/logo.png";

/***/ })

/******/ });