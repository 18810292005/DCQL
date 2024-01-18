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
/******/ 		5: 0,
/******/ 		4: 0
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
/******/ 	deferredModules.push([806,0]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 59:
/***/ (function(module, exports) {

module.exports = dll_library;

/***/ }),

/***/ 806:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85);
__webpack_require__(86);
__webpack_require__(87);
module.exports = __webpack_require__(956);


/***/ }),

/***/ 956:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: delegated ./node_modules/react/index.js from dll-reference dll_library
var reactfrom_dll_reference_dll_library = __webpack_require__(0);
var reactfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(reactfrom_dll_reference_dll_library);

// EXTERNAL MODULE: delegated ./node_modules/react-dom/index.js from dll-reference dll_library
var react_domfrom_dll_reference_dll_library = __webpack_require__(11);
var react_domfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(react_domfrom_dll_reference_dll_library);

// EXTERNAL MODULE: ./node_modules/react-intl/lib/index.es.js + 1 modules
var index_es = __webpack_require__(2);

// EXTERNAL MODULE: ./apis/define/User.ts
var User = __webpack_require__(31);

// EXTERNAL MODULE: ./components/layout/Breadcrumb.tsx
var Breadcrumb = __webpack_require__(27);

// EXTERNAL MODULE: ./components/layout/RoleCheckWrapper.tsx + 3 modules
var RoleCheckWrapper = __webpack_require__(82);

// EXTERNAL MODULE: ./components/layout/MgeLayout.tsx + 7 modules
var MgeLayout = __webpack_require__(48);

// EXTERNAL MODULE: ./components/layout/NavMenu.tsx
var NavMenu = __webpack_require__(120);

// EXTERNAL MODULE: ./node_modules/react-jss/dist/react-jss.esm.js + 25 modules
var react_jss_esm = __webpack_require__(67);

// EXTERNAL MODULE: ./components/template/Outline.tsx
var Outline = __webpack_require__(264);

// EXTERNAL MODULE: ./node_modules/antd/lib/input/style/index.js
var style = __webpack_require__(56);

// EXTERNAL MODULE: ./node_modules/antd/lib/input/index.js
var input = __webpack_require__(22);
var input_default = /*#__PURE__*/__webpack_require__.n(input);

// EXTERNAL MODULE: ./components/common/CategoryTree.tsx
var CategoryTree = __webpack_require__(196);

// EXTERNAL MODULE: ./components/template/TemplateInfo.less
var TemplateInfo = __webpack_require__(617);

// EXTERNAL MODULE: ./components/common/MethodTree.tsx + 1 modules
var MethodTree = __webpack_require__(217);

// CONCATENATED MODULE: ./components/template/TemplateInfoCheck.tsx







var TextArea = input_default.a.TextArea;
var TemplateInfoCheck_TemplateInfoCheck = function TemplateInfoCheck(props) {
  var handleTextAreaOnChange = function handleTextAreaOnChange(event) {
    props.onDescChange(event.target.value);
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'TemplateInfo'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'row'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("h1", null, props.title)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CategoryTree["a" /* CategoryTree */], {
    className: 'TemplateInfo__CategoryTree',
    value: props.categoryID,
    onChange: props.onCategoryIDChange,
    disable: true
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MethodTree["a" /* MethodTree */], {
    className: 'TemplateInfo__MethodTree',
    value: props.method,
    onChange: props.onMethodChange,
    disable: true
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'template:input_template_desc',
    defaultMessage: "\u6458\u8981\u4FE1\u606F\uFF08\u5FC5\u586B\uFF09"
  }, function (msg) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TextArea, {
      value: props.desc,
      onChange: handleTextAreaOnChange,
      className: 'TemplateInfo__TextArea',
      rows: 4,
      placeholder: msg,
      readOnly: true
    });
  }));
};
// EXTERNAL MODULE: ./components/template/context/EditorContext.ts
var EditorContext = __webpack_require__(136);

// EXTERNAL MODULE: ./components/template/fields/check.tsx + 1 modules
var check = __webpack_require__(267);

// EXTERNAL MODULE: ./components/template/context/TemplateCtrl.ts
var TemplateCtrl = __webpack_require__(215);

// EXTERNAL MODULE: ./apis/template/Get.ts
var Get = __webpack_require__(65);

// EXTERNAL MODULE: ./apis/template/ListSnippets.ts
var ListSnippets = __webpack_require__(123);

// CONCATENATED MODULE: ./components/pages/CheckTemplate.tsx
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }











var styles = {
  CreateTemplate: {
    display: 'flex',
    flexDirection: 'row',
    height: '100vh',
    flex: 'auto'
  },
  OutlineWrapper: {
    width: '288px',
    flex: 'auto',
    flexGrow: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  OutlineHeader: {
    background: '#EDEDED',
    color: '#0A2D47',
    fontSize: '20px',
    lineHeight: '28px',
    padding: '10px 20px',
    flex: 0
  },
  OutlineContent: {
    background: '#FFF',
    flex: 'auto',
    flexGrow: 1,
    overflowY: 'scroll'
  },
  MainContent: {
    flex: 'auto',
    display: 'flex',
    padding: '20px 28px',
    flexDirection: 'column'
  },
  ScrollWrapper: {
    flexGrow: 0,
    overflowY: 'scroll',
    flexDirection: 'column'
  },
  SubmitWrapper: {
    textAlign: 'right',
    padding: '8px 0'
  }
};

var CheckTemplate_rootRender = function rootRender(template) {
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, template.map(function (value, index, array) {
    var View = Object(check["a" /* FieldCheck */])(value.type);
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(View, {
      key: index,
      parent: [],
      index: index,
      path: [index],
      field: template[index],
      informUpdate: null,
      isFirst: index === 0,
      isLast: index === array.length - 1
    });
  }));
};

var url = window.location.href.split('/');

var CheckTemplate_CheckTemplate = function _CheckTemplate(_ref) {
  var classes = _ref.classes;

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState2 = _slicedToArray(_useState, 2),
      title = _useState2[0],
      setTitle = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState4 = _slicedToArray(_useState3, 2),
      desc = _useState4[0],
      setDesc = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(undefined),
      _useState6 = _slicedToArray(_useState5, 2),
      categoryID = _useState6[0],
      setCategoryID = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(undefined),
      _useState8 = _slicedToArray(_useState7, 2),
      method = _useState8[0],
      setMethod = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState10 = _slicedToArray(_useState9, 2),
      selectedField = _useState10[0],
      setSelectedField = _useState10[1];

  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState12 = _slicedToArray(_useState11, 2),
      templateID = _useState12[0],
      setTemplateID = _useState12[1];

  var _useState13 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState14 = _slicedToArray(_useState13, 2),
      template = _useState14[0],
      setTemplate = _useState14[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    var id = Number(window.location.href.split('/').pop());
    var type = String(url[url.length - 2]);
    type === 'check_template' ? Object(Get["c" /* GetTemplateNew */])(id).then(function (value) {
      setTitle(value.title);
      setCategoryID(value.category);
      setDesc(value["abstract"]);
      setMethod(value.method_id);
      setTemplateID(value.id);
      setTemplate(value.content);
    }) : Object(ListSnippets["d" /* get_snippet_one */])(id).then(function (value) {
      setTitle(value.snippet_name);
      setCategoryID(null);
      setDesc('');
      setMethod(null);
      setTemplateID(value.id);
      setTemplate(value.content);
    });
  }, []);
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: classes.CreateTemplate
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: classes.OutlineWrapper
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: classes.OutlineHeader
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'template:outline',
    defaultMessage: "\u6A21\u677F\u5927\u7EB2"
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: classes.OutlineContent
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Outline["a" /* Outline */], {
    template: template,
    selected: selectedField,
    onClick: setSelectedField,
    draggable: false
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(EditorContext["a" /* EditorContext */].Provider, {
    value: {
      templateCtrl: new TemplateCtrl["a" /* TemplateCtrl */](template, null)
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: classes.MainContent
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: classes.ScrollWrapper
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TemplateInfoCheck_TemplateInfoCheck, {
    title: title,
    onTitleChange: setTitle,
    desc: desc,
    onDescChange: setDesc,
    method: method,
    onMethodChange: setMethod,
    categoryID: categoryID,
    onCategoryIDChange: function onCategoryIDChange(id) {
      setCategoryID(id);
    }
  }), CheckTemplate_rootRender(template)))));
};

var CheckTemplate = Object(react_jss_esm["a" /* default */])(styles)(CheckTemplate_CheckTemplate);
// CONCATENATED MODULE: ./entry/check_template.tsx
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










var forbidMessage = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'template:create_forbid',
  defaultMessage: "\u4F60\u6CA1\u6709\u521B\u5EFA\u6A21\u677F\u7684\u6743\u9650"
});
var breadcrumbItems = // {
//     title: <FormattedMessage id='MGED' defaultMessage='材料基因工程专用数据库' />,
//     url: Urls.site_index,
// },
// {
//     title: <FormattedMessage id='mdb' defaultMessage='材料数据库'/>,
//     url: Urls.search.index,
// },
{
  title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'template:check',
    defaultMessage: "\u67E5\u770B\u6A21\u677F"
  })
};

var check_template_CheckTemplateEntry = /*#__PURE__*/function (_Component) {
  _inherits(CheckTemplateEntry, _Component);

  var _super = _createSuper(CheckTemplateEntry);

  function CheckTemplateEntry(props) {
    _classCallCheck(this, CheckTemplateEntry);

    return _super.call(this, props);
  }

  _createClass(CheckTemplateEntry, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeLayout["a" /* MgeLayout */], {
        loginRequired: true,
        noFooter: true,
        titleID: 'check_template',
        defaultTitle: "\u67E5\u770B\u6A21\u677F",
        selectedMenu: NavMenu["a" /* MenuKey */].Upload
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Breadcrumb["a" /* Breadcrumb */], {
        items: [Breadcrumb["a" /* Breadcrumb */].MGED, Breadcrumb["a" /* Breadcrumb */].MDB, breadcrumbItems]
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleCheckWrapper["a" /* RoleCheckWrapper */], {
        forbidMessage: forbidMessage,
        requiredRoles: [User["d" /* UserRole */].TemplateUploader]
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CheckTemplate, null)));
    }
  }]);

  return CheckTemplateEntry;
}(reactfrom_dll_reference_dll_library["Component"]);

react_domfrom_dll_reference_dll_library_default.a.render( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(check_template_CheckTemplateEntry, null), document.getElementById('wrap'));

/***/ })

/******/ });