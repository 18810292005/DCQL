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
/******/ 		9: 0
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
/******/ 	deferredModules.push([1771,0]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 1771:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85);
__webpack_require__(86);
__webpack_require__(87);
module.exports = __webpack_require__(1860);


/***/ }),

/***/ 1860:
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

// EXTERNAL MODULE: ./components/layout/FormPage.tsx
var FormPage = __webpack_require__(263);

// EXTERNAL MODULE: ./components/layout/RoleCheckWrapper.tsx + 3 modules
var RoleCheckWrapper = __webpack_require__(82);

// EXTERNAL MODULE: ./components/layout/MgeLayout.tsx + 7 modules
var MgeLayout = __webpack_require__(48);

// EXTERNAL MODULE: ./components/layout/NavMenu.tsx
var NavMenu = __webpack_require__(120);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/style/index.js
var button_style = __webpack_require__(32);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/index.js
var lib_button = __webpack_require__(5);
var button_default = /*#__PURE__*/__webpack_require__.n(lib_button);

// EXTERNAL MODULE: ./node_modules/antd/lib/divider/style/index.js
var divider_style = __webpack_require__(144);

// EXTERNAL MODULE: ./node_modules/antd/lib/divider/index.js
var divider = __webpack_require__(43);
var divider_default = /*#__PURE__*/__webpack_require__.n(divider);

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

// EXTERNAL MODULE: ./components/common/FlexLoading.tsx
var FlexLoading = __webpack_require__(66);

// EXTERNAL MODULE: ./components/data/fields/content/render.tsx + 10 modules
var render = __webpack_require__(266);

// EXTERNAL MODULE: ./locale/translate.ts
var translate = __webpack_require__(38);

// EXTERNAL MODULE: ./apis/Fetch.ts
var Fetch = __webpack_require__(7);

// EXTERNAL MODULE: ./apis/Urls.ts
var Urls = __webpack_require__(4);

// EXTERNAL MODULE: ./components/data/Meta.tsx + 4 modules
var Meta = __webpack_require__(659);

// EXTERNAL MODULE: ./apis/data/Get.ts
var Get = __webpack_require__(385);

// EXTERNAL MODULE: ./apis/define/Data.ts
var Data = __webpack_require__(53);

// EXTERNAL MODULE: ./apis/data/Commit.ts
var Commit = __webpack_require__(657);

// CONCATENATED MODULE: ./components/data/Editor.tsx









function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }












var Editor_DataEditor = function DataEditor(props) {
  var className = props.className,
      style = props.style,
      dataID = props.dataID;

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])({
    title: '',
    doi: '',
    reference: '',
    keywords: [],
    "abstract": '',
    methods: new Set(),
    project: undefined,
    subject: undefined,
    source: Data["a" /* Data */].Source.SelfProduct,
    tid: 0,
    public_range: 0,
    public_date: 0,
    contributor: '',
    institution: ''
  }),
      _useState2 = _slicedToArray(_useState, 2),
      meta = _useState2[0],
      setMeta = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])({}),
      _useState4 = _slicedToArray(_useState3, 2),
      content = _useState4[0],
      setContent = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState6 = _slicedToArray(_useState5, 2),
      template = _useState6[0],
      setTemplate = _useState6[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    Object(Get["a" /* GetData */])(dataID).then(function (result) {
      setTemplate(result.template.content);
      setMeta(result.meta);
      setContent(result.content);
    });
  }, [dataID]);

  var informUpdate = function informUpdate() {
    setMeta(Object.assign({}, meta));
  };

  var informContentUpdate = function informContentUpdate() {
    setContent(Object.assign({}, content));
  };

  var showSuccess = function showSuccess(dataID) {
    modal_default.a.success({
      title: Object(translate["a" /* Translate */])('data_commit_success'),
      content: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: Urls["b" /* default */].storage.show_data(dataID)
      }, Object(translate["a" /* Translate */])('data:view_data'))
    });
  };

  var leavlConfirm = function leavlConfirm(e) {
    var confirmationMessage = Object(translate["a" /* Translate */])("leave_confirm");

    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  };

  var openNotification = function openNotification(error) {
    var text = '';

    if ('id' in error) {
      text = Object(translate["a" /* Translate */])(error.id);
    } else if (error instanceof Fetch["c" /* MgeError */]) {
      text = "".concat(error.message, ": ").concat(error.detail);
    }

    notification_default.a['error']({
      message: Object(translate["a" /* Translate */])('error'),
      description: text,
      onClick: function onClick() {
        console.log('Notification Clicked!');
      }
    });
  };

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    window.addEventListener("beforeunload", leavlConfirm);
    return function () {
      window.removeEventListener("beforeunload", leavlConfirm);
    };
  }, []);

  var handleCommitClick = function handleCommitClick() {
    Object(Commit["b" /* PatchData */])(dataID, meta, content, template).then(function (value) {
      showSuccess(value);
    })["catch"](function (error) {
      openNotification(error);
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: "".concat(className || ''),
    style: style
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      padding: '12px 0'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'data:star_required',
    defaultMessage: "\u6240\u6709\u5E26\u661F\u53F7\u7684\u5B57\u6BB5\u90FD\u4E3A\u5FC5\u586B\u9879\u76EE"
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'metadata',
    defaultMessage: "\u5143\u6570\u636E"
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Meta["a" /* Meta */], {
    meta: meta,
    informUpdate: informUpdate,
    is_edit: true
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'data:data_content',
    defaultMessage: "\u6570\u636E\u5185\u5BB9"
  })), template.length === 0 ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(FlexLoading["a" /* FlexLoading */], null) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, Object(render["b" /* InputFieldRender */])(template, informContentUpdate, content)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      textAlign: 'center',
      paddingBottom: '16px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    size: 'large',
    type: 'primary',
    onClick: handleCommitClick,
    style: {
      minWidth: '120px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'submit',
    defaultMessage: "\u63D0\u4EA4"
  }))));
};
// CONCATENATED MODULE: ./entry/edit_data.tsx










var breadcrumbItems = {
  title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'data:edit_data',
    defaultMessage: "\u4FEE\u6539\u6570\u636E"
  })
};

var edit_data_EditDataEntry = function EditDataEntry() {
  var dataID = Number(window.location.href.split('/').pop());
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeLayout["a" /* MgeLayout */], {
    loginRequired: true,
    selectedMenu: NavMenu["a" /* MenuKey */].Upload
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Breadcrumb["a" /* Breadcrumb */], {
    items: [Breadcrumb["a" /* Breadcrumb */].MGED, Breadcrumb["a" /* Breadcrumb */].MDB, breadcrumbItems]
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(FormPage["a" /* FormPage */], {
    title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'data:edit_data',
      defaultMessage: "\u4FEE\u6539\u6570\u636E"
    })
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      margin: '0 56px',
      display: 'flex',
      flexDirection: 'column',
      'flex': 1
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleCheckWrapper["a" /* RoleCheckWrapper */], {
    forbidMessage: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'data:forbid',
      defaultMessage: "\u60A8\u6CA1\u6709\u4E0A\u4F20/\u67E5\u770B\u6570\u636E\u7684\u6743\u9650\uFF0C\u8BF7\u70B9\u51FB\u7533\u8BF7"
    }),
    requiredRoles: [User["d" /* UserRole */].DataUploader]
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Editor_DataEditor, {
    dataID: dataID
  })))));
};

react_domfrom_dll_reference_dll_library_default.a.render( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(edit_data_EditDataEntry, null), document.getElementById('wrap'));

/***/ }),

/***/ 216:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return GetProjectList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GetProjectAllList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return GetProjectListTest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return SearchGetProjectList; });
/* harmony import */ var _Urls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _Fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function GetProjectList(_x, _x2) {
  return _GetProjectList.apply(this, arguments);
} // 只获取项目名称和id的api，用于选择项目的下拉框

function _GetProjectList() {
  _GetProjectList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(page, page_size) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", Object(_Fetch__WEBPACK_IMPORTED_MODULE_1__[/* default */ "k"])(_Urls__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].api_v1_storage.get_material_projects));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _GetProjectList.apply(this, arguments);
}

function GetProjectAllList() {
  return _GetProjectAllList.apply(this, arguments);
} //获取用户创建的项目列表

function _GetProjectAllList() {
  _GetProjectAllList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", Object(_Fetch__WEBPACK_IMPORTED_MODULE_1__[/* default */ "k"])(_Urls__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].api_v1_storage.get_projects_all));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _GetProjectAllList.apply(this, arguments);
}

function GetProjectListTest(_x3, _x4, _x5) {
  return _GetProjectListTest.apply(this, arguments);
}

function _GetProjectListTest() {
  _GetProjectListTest = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(total, page, page_size) {
    var url, result;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            url = '/api/v1.1/storage/projects/' + '?total=' + total + '&page=' + page + '&page_size=' + page_size;
            _context3.next = 3;
            return Object(_Fetch__WEBPACK_IMPORTED_MODULE_1__[/* default */ "k"])(url, 'GET');

          case 3:
            result = _context3.sent;
            return _context3.abrupt("return", result);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _GetProjectListTest.apply(this, arguments);
}

function SearchGetProjectList(_x6, _x7, _x8) {
  return _SearchGetProjectList.apply(this, arguments);
}

function _SearchGetProjectList() {
  _SearchGetProjectList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(username, page, page_size) {
    var url;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            url = _Urls__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].api_v1_1_storage.material_project_query;
            _context4.next = 3;
            return Object(_Fetch__WEBPACK_IMPORTED_MODULE_1__[/* default */ "k"])(url + '?query=' + username + '&page=' + page + '&page_size=' + page_size, 'GET');

          case 3:
            return _context4.abrupt("return", _context4.sent);

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _SearchGetProjectList.apply(this, arguments);
}

/***/ }),

/***/ 265:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GetSubjectList; });
/* unused harmony export GetSubjectListTest */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return SearchGetSubjectListTest; });
/* harmony import */ var _Urls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _Fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function GetSubjectList(_x) {
  return _GetSubjectList.apply(this, arguments);
}

function _GetSubjectList() {
  _GetSubjectList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(subjectID) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", Object(_Fetch__WEBPACK_IMPORTED_MODULE_1__[/* default */ "k"])(_Urls__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].api_v1_storage.get_material_subjects(subjectID)));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _GetSubjectList.apply(this, arguments);
}

function GetSubjectListTest(_x2, _x3, _x4) {
  return _GetSubjectListTest.apply(this, arguments);
}

function _GetSubjectListTest() {
  _GetSubjectListTest = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(username, page, page_size) {
    var url, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            url = _Urls__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].api_v1_account.get_user_material_subjects('lijialiang') + '?username=' + username + '&page=' + page + '&page_size=' + page_size;
            _context2.next = 3;
            return Object(_Fetch__WEBPACK_IMPORTED_MODULE_1__[/* default */ "k"])(url, 'GET');

          case 3:
            result = _context2.sent;
            return _context2.abrupt("return", result.results);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _GetSubjectListTest.apply(this, arguments);
}

function SearchGetSubjectListTest(_x5, _x6, _x7) {
  return _SearchGetSubjectListTest.apply(this, arguments);
}

function _SearchGetSubjectListTest() {
  _SearchGetSubjectListTest = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(username, page, page_size) {
    var url, result;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            url = '/api/v1.1/storage/subjects/search/' + '?query=' + username + '&page=' + page + '&page_size=' + page_size;
            _context3.next = 3;
            return Object(_Fetch__WEBPACK_IMPORTED_MODULE_1__[/* default */ "k"])(url, 'GET');

          case 3:
            result = _context3.sent;
            return _context3.abrupt("return", result);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _SearchGetSubjectListTest.apply(this, arguments);
}

/***/ }),

/***/ 59:
/***/ (function(module, exports) {

module.exports = dll_library;

/***/ }),

/***/ 657:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommitData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return PatchData; });
/* harmony import */ var _Urls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _Fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _define_Data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(53);
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }





var isEmpty = function isEmpty(s) {
  return s == null || s.trim().length === 0;
}; // 检查元数据


function CheckDataMeta(meta) {
  if (isEmpty(meta.title)) {
    throw {
      id: 'error_data_title_empty'
    };
  }

  if (isEmpty(meta["abstract"])) {
    throw {
      id: 'error_data_abstract_empty'
    };
  }

  if (meta.keywords.length === 0) {
    throw {
      id: 'error_data_keywords_empty'
    };
  }

  if (meta.methods.size === 0) {
    throw {
      id: 'error_data_methods_empty'
    };
  }

  if (meta.source === _define_Data__WEBPACK_IMPORTED_MODULE_2__[/* Data */ "a"].Source.Extract && isEmpty(meta.reference)) {
    throw {
      id: 'error_data_reference_empty'
    };
  }

  if (isEmpty(meta.project)) {
    throw {
      id: 'error_data_project_empty'
    };
  }

  if (isEmpty(meta.subject)) {
    throw {
      id: 'error_data_subject_empty'
    };
  }
}

function PruneData(data) {} // 检查数据内容是否符合必填要求


function CheckContent(data, template) {
  // 首先清理数据内容，删除掉空字段
  PruneData(data); // 不能整个都为空

  if (Object.keys(data).length === 0) {
    throw {
      id: 'error_data_content_empty'
    };
  } // 遍历模板检查
  // TODO: 检查required属性

}

function MethodsToString(set) {
  var a = set.has(_define_Data__WEBPACK_IMPORTED_MODULE_2__[/* Data */ "a"].Method.Calculation) ? '1' : set.has('computation') ? '1' : '0';
  var b = set.has(_define_Data__WEBPACK_IMPORTED_MODULE_2__[/* Data */ "a"].Method.Experiment) ? '1' : set.has('experiment') ? '1' : '0';
  var c = set.has(_define_Data__WEBPACK_IMPORTED_MODULE_2__[/* Data */ "a"].Method.Production) ? '1' : set.has('production') ? '1' : '0';
  var d = set.has(_define_Data__WEBPACK_IMPORTED_MODULE_2__[/* Data */ "a"].Method.Other) ? '1' : set.has('other') ? '1' : '0';
  return "".concat(a).concat(b).concat(c).concat(d);
}

function CommitData(_x, _x2, _x3) {
  return _CommitData.apply(this, arguments);
}

function _CommitData() {
  _CommitData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(metaData, content, template) {
    var url;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = _Urls__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].api_v1_1_storage.data_full;
            CheckDataMeta(metaData);
            CheckContent(content, template);
            return _context.abrupt("return", Object(_Fetch__WEBPACK_IMPORTED_MODULE_1__[/* default */ "k"])(url, 'POST', {
              meta: {
                title: metaData.title,
                "abstract": metaData["abstract"],
                doi: metaData.doi,
                keywords: metaData.keywords.join(','),
                tid: metaData.tid,
                // category: metaData.categoryID,
                // 公开时间，范围在前，时间在后
                public_range: metaData.public_range,
                public_date: metaData.public_date,
                contributor: metaData.contributor,
                institution: metaData.institution,
                source: {
                  source: metaData.source,
                  reference: metaData.reference,
                  methods: MethodsToString(metaData.methods)
                },
                other_info: {
                  project: metaData.project,
                  subject: metaData.subject
                }
              },
              content: content
            }));

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _CommitData.apply(this, arguments);
}

function PatchData(_x4, _x5, _x6, _x7) {
  return _PatchData.apply(this, arguments);
}

function _PatchData() {
  _PatchData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(dataID, metaData, content, template) {
    var url;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            url = _Urls__WEBPACK_IMPORTED_MODULE_0__[/* default */ "b"].api_v2_storage.get_data(dataID);
            CheckDataMeta(metaData);
            CheckContent(content, template);
            return _context2.abrupt("return", Object(_Fetch__WEBPACK_IMPORTED_MODULE_1__[/* default */ "k"])(url, 'PATCH', {
              meta: {
                title: metaData.title,
                "abstract": metaData["abstract"],
                doi: metaData.doi,
                keywords: metaData.keywords.join(','),
                tid: metaData.tid,
                // category: metaData.categoryID,
                // 公开时间，范围在前，时间在后
                public_range: metaData.public_range,
                public_date: metaData.public_date,
                contributor: metaData.contributor,
                institution: metaData.institution,
                source: {
                  source: metaData.source,
                  reference: metaData.reference,
                  methods: MethodsToString(metaData.methods)
                },
                other_info: {
                  project: metaData.project,
                  subject: metaData.subject
                }
              },
              content: content
            }));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _PatchData.apply(this, arguments);
}

/***/ }),

/***/ 659:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* binding */ Meta_Meta; });

// EXTERNAL MODULE: ./node_modules/antd/lib/checkbox/style/index.js
var style = __webpack_require__(129);

// EXTERNAL MODULE: ./node_modules/antd/lib/checkbox/index.js
var lib_checkbox = __webpack_require__(50);
var checkbox_default = /*#__PURE__*/__webpack_require__.n(lib_checkbox);

// EXTERNAL MODULE: ./node_modules/antd/lib/select/style/index.js
var select_style = __webpack_require__(75);

// EXTERNAL MODULE: ./node_modules/antd/lib/select/index.js
var lib_select = __webpack_require__(24);
var select_default = /*#__PURE__*/__webpack_require__.n(lib_select);

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

// EXTERNAL MODULE: delegated ./node_modules/react/index.js from dll-reference dll_library
var reactfrom_dll_reference_dll_library = __webpack_require__(0);
var reactfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(reactfrom_dll_reference_dll_library);

// EXTERNAL MODULE: ./node_modules/react-intl/lib/index.es.js + 1 modules
var index_es = __webpack_require__(2);

// EXTERNAL MODULE: ./components/data/fields/common/Title.tsx
var Title = __webpack_require__(112);

// EXTERNAL MODULE: ./components/data/fields/content/String.tsx
var content_String = __webpack_require__(176);

// EXTERNAL MODULE: ./node_modules/antd/lib/icon/style/index.js
var icon_style = __webpack_require__(125);

// EXTERNAL MODULE: ./node_modules/antd/lib/icon/index.js
var icon = __webpack_require__(28);
var icon_default = /*#__PURE__*/__webpack_require__.n(icon);

// EXTERNAL MODULE: ./node_modules/antd/lib/input/style/index.js
var input_style = __webpack_require__(56);

// EXTERNAL MODULE: ./node_modules/antd/lib/input/index.js
var input = __webpack_require__(22);
var input_default = /*#__PURE__*/__webpack_require__.n(input);

// EXTERNAL MODULE: ./node_modules/antd/lib/tooltip/style/index.js
var tooltip_style = __webpack_require__(138);

// EXTERNAL MODULE: ./node_modules/antd/lib/tooltip/index.js
var tooltip = __webpack_require__(64);
var tooltip_default = /*#__PURE__*/__webpack_require__.n(tooltip);

// EXTERNAL MODULE: ./node_modules/antd/lib/tag/style/index.js
var tag_style = __webpack_require__(154);

// EXTERNAL MODULE: ./node_modules/antd/lib/tag/index.js
var lib_tag = __webpack_require__(69);
var tag_default = /*#__PURE__*/__webpack_require__.n(lib_tag);

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(16);

// EXTERNAL MODULE: ./node_modules/core-decorators/es/core-decorators.js + 19 modules
var core_decorators = __webpack_require__(17);

// CONCATENATED MODULE: ./components/data/fields/common/EditableTagGroup.tsx
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }










function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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





var EditableTagGroup_EditableTagGroup = /*#__PURE__*/function (_React$Component) {
  _inherits(EditableTagGroup, _React$Component);

  var _super = _createSuper(EditableTagGroup);

  function EditableTagGroup(props) {
    var _this;

    _classCallCheck(this, EditableTagGroup);

    _this = _super.call(this, props);

    _this.handleInputConfirm = function () {
      var inputValue = _this.state.inputValue;

      var tags = _toConsumableArray(_this.props.tags);

      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [].concat(_toConsumableArray(tags), [inputValue]);
      }

      _this.setState({
        // inputVisible: false,
        inputValue: ''
      });

      _this.props.onTagsChange(tags);
    };

    _this.handleBlur = function () {
      var inputValue = _this.state.inputValue;

      var tags = _toConsumableArray(_this.props.tags);

      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [].concat(_toConsumableArray(tags), [inputValue]);
      }

      _this.setState({
        inputVisible: false,
        inputValue: ''
      });

      _this.props.onTagsChange(tags);
    };

    _this.saveInputRef = function (input) {
      return _this.input = input;
    };

    _this.state = {
      inputValue: '',
      inputVisible: false
    };
    return _this;
  }

  _createClass(EditableTagGroup, [{
    key: "handleClose",
    value: function handleClose(removedTag) {
      var newTags = this.props.tags.filter(function (tag) {
        return tag !== removedTag;
      });
      this.props.onTagsChange(newTags);
    }
  }, {
    key: "showInput",
    value: function showInput() {
      var _this2 = this;

      this.setState({
        inputVisible: true
      }, function () {
        return _this2.input.focus();
      });
    }
  }, {
    key: "handleInputChange",
    value: function handleInputChange(e) {
      this.setState({
        inputValue: e.target.value
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$state = this.state,
          inputVisible = _this$state.inputVisible,
          inputValue = _this$state.inputValue;
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, this.props.tags.map(function (tag, index) {
        var isLongTag = tag.length > 20;
        var tagElem = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(tag_default.a, {
          key: tag,
          closable: true,
          onClose: function onClose() {
            return _this3.handleClose(tag);
          }
        }, isLongTag ? "".concat(tag.slice(0, 20), "...") : tag);
        return isLongTag ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(tooltip_default.a, {
          title: tag,
          key: tag
        }, tagElem) : tagElem;
      }), inputVisible && /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
        ref: this.saveInputRef,
        type: "text",
        size: this.props.size,
        style: {
          width: 78
        },
        value: inputValue,
        onChange: this.handleInputChange,
        onBlur: this.handleBlur,
        onPressEnter: this.handleInputConfirm
      }), !inputVisible && /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(tag_default.a, {
        onClick: this.showInput,
        style: {
          background: '#fff',
          borderStyle: 'dashed'
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(icon_default.a, {
        type: "plus"
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'data:new_tag',
        defaultMessage: "\u65B0\u6807\u7B7E"
      })));
    }
  }]);

  return EditableTagGroup;
}(reactfrom_dll_reference_dll_library_default.a.Component);

Object(tslib_es6["a" /* __decorate */])([core_decorators["a" /* autobind */]], EditableTagGroup_EditableTagGroup.prototype, "handleClose", null);

Object(tslib_es6["a" /* __decorate */])([core_decorators["a" /* autobind */]], EditableTagGroup_EditableTagGroup.prototype, "showInput", null);

Object(tslib_es6["a" /* __decorate */])([core_decorators["a" /* autobind */]], EditableTagGroup_EditableTagGroup.prototype, "handleInputChange", null);
// EXTERNAL MODULE: ./apis/project/GetProjectList.ts
var GetProjectList = __webpack_require__(216);

// CONCATENATED MODULE: ./components/data/fields/ProjectSelect.tsx



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || ProjectSelect_unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function ProjectSelect_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return ProjectSelect_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ProjectSelect_arrayLikeToArray(o, minLen); }

function ProjectSelect_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



var Option = select_default.a.Option;
var ProjectSelect_ProjectSelect = function ProjectSelect(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState2 = _slicedToArray(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState4 = _slicedToArray(_useState3, 2),
      projects = _useState4[0],
      setProjects = _useState4[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    Object(GetProjectList["b" /* GetProjectList */])(0, 1).then(function (value) {
      setLoading(false);
      setProjects(value);
    });
  }, []);
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
    style: props.style,
    loading: loading,
    onChange: props.onChange,
    value: props.value,
    allowClear: true
  }, projects.map(function (value) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Option, {
      key: value.id,
      value: value.id
    }, value.id, "/", value.name);
  }));
};
// EXTERNAL MODULE: ./apis/project/GetSubjectList.ts
var GetSubjectList = __webpack_require__(265);

// CONCATENATED MODULE: ./components/data/fields/SubjectSelect.tsx



function SubjectSelect_slicedToArray(arr, i) { return SubjectSelect_arrayWithHoles(arr) || SubjectSelect_iterableToArrayLimit(arr, i) || SubjectSelect_unsupportedIterableToArray(arr, i) || SubjectSelect_nonIterableRest(); }

function SubjectSelect_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function SubjectSelect_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return SubjectSelect_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return SubjectSelect_arrayLikeToArray(o, minLen); }

function SubjectSelect_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function SubjectSelect_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function SubjectSelect_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



var SubjectSelect_Option = select_default.a.Option;
var SubjectSelect_SubjectSelect = function SubjectSelect(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState2 = SubjectSelect_slicedToArray(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState4 = SubjectSelect_slicedToArray(_useState3, 2),
      subjects = _useState4[0],
      setSubjects = _useState4[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setLoading(true);

    if (props.projectID == null || props.projectID == '') {
      return;
    }

    Object(GetSubjectList["a" /* GetSubjectList */])(props.projectID).then(function (value) {
      setLoading(false);
      setSubjects(value);
    });
  }, [props.projectID]);
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
    style: props.style,
    loading: loading,
    onChange: props.onChange,
    value: props.value,
    allowClear: true
  }, subjects.map(function (value) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubjectSelect_Option, {
      key: value.id,
      value: value.id
    }, value.id, "/", value.name);
  }));
};
// EXTERNAL MODULE: ./node_modules/antd/lib/tree-select/style/index.js
var tree_select_style = __webpack_require__(305);

// EXTERNAL MODULE: ./node_modules/antd/lib/tree-select/index.js
var tree_select = __webpack_require__(141);
var tree_select_default = /*#__PURE__*/__webpack_require__.n(tree_select);

// CONCATENATED MODULE: ./components/data/fields/PublicRangeSelect.tsx





var TreeNode = tree_select_default.a.TreeNode;
var PublicRangeSelect_Option = select_default.a.Option,
    OptGroup = select_default.a.OptGroup;
var PublicRangeSelect_PublicRangeSelect = function PublicRangeSelect(props) {
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
    style: props.style,
    value: props.value,
    onChange: props.onChange
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(PublicRangeSelect_Option, {
    value: '00'
  }, "\u516C\u5F00"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(OptGroup, {
    label: "\u9879\u76EE\u5185\u53EF\u89C1"
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(PublicRangeSelect_Option, {
    value: '11'
  }, "\u9879\u76EE\u5185\u53EF\u89C1-1\u5E74\u540E\u516C\u5F00"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(PublicRangeSelect_Option, {
    value: '12'
  }, "\u9879\u76EE\u5185\u53EF\u89C1-2\u5E74\u540E\u516C\u5F00"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(PublicRangeSelect_Option, {
    value: '13'
  }, "\u9879\u76EE\u5185\u53EF\u89C1-3\u5E74\u540E\u516C\u5F00")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(OptGroup, {
    label: "\u8BFE\u9898\u5185\u53EF\u89C1"
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(PublicRangeSelect_Option, {
    value: '21'
  }, "\u8BFE\u9898\u5185\u53EF\u89C1-1\u5E74\u540E\u516C\u5F00"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(PublicRangeSelect_Option, {
    value: '22'
  }, "\u8BFE\u9898\u5185\u53EF\u89C1-2\u5E74\u540E\u516C\u5F00"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(PublicRangeSelect_Option, {
    value: '23'
  }, "\u8BFE\u9898\u5185\u53EF\u89C1-3\u5E74\u540E\u516C\u5F00")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(OptGroup, {
    label: "\u4E2A\u4EBA\u53EF\u89C1"
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(PublicRangeSelect_Option, {
    value: '31'
  }, "\u4E2A\u4EBA\u53EF\u89C1-1\u5E74\u540E\u516C\u5F00"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(PublicRangeSelect_Option, {
    value: '32'
  }, "\u4E2A\u4EBA\u53EF\u89C1-2\u5E74\u540E\u516C\u5F00"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(PublicRangeSelect_Option, {
    value: '33'
  }, "\u4E2A\u4EBA\u53EF\u89C1-3\u5E74\u540E\u516C\u5F00")));
};
// EXTERNAL MODULE: ./apis/define/Data.ts
var Data = __webpack_require__(53);

// EXTERNAL MODULE: ./apis/define/FieldType.ts
var FieldType = __webpack_require__(6);

// CONCATENATED MODULE: ./components/data/Meta.tsx


















var Meta_Meta = function Meta(_ref) {
  var meta = _ref.meta,
      informUpdate = _ref.informUpdate,
      is_edit = _ref.is_edit;

  var handleTagsChange = function handleTagsChange(tags) {
    meta.keywords = tags;
    informUpdate();
  };

  var handleSourceChange = function handleSourceChange(source) {
    meta.source = source;
    informUpdate();
  };

  var handleMethodsChange = function handleMethodsChange(value, checked) {
    if (checked) {
      meta.methods.add(value);
    } else {
      meta.methods["delete"](value);
    }

    informUpdate();
  };

  var hanleProjectChange = function hanleProjectChange(value) {
    meta.project = value;
    informUpdate();
  };

  var handleSubjectChange = function handleSubjectChange(value) {
    meta.subject = value;
    informUpdate();
  };

  var hanlePublicRangeChange = function hanlePublicRangeChange(value) {
    meta.public_range = Number(value.split("")[0]);
    meta.public_date = Number(value.split("")[1]);
    informUpdate();
  };

  var handleRangeChange = function handleRangeChange(value) {
    meta.range = value;
    informUpdate();
  };

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    var temp = meta.methods;

    if (temp.has('computation')) {
      temp["delete"]('computation');
      temp.add(Data["a" /* Data */].Method.Calculation);
    }

    if (temp.has('experiment')) {
      temp["delete"]('experiment');
      temp.add(Data["a" /* Data */].Method.Experiment);
    }

    if (temp.has('production')) {
      temp["delete"]('production');
      temp.add(Data["a" /* Data */].Method.Production);
    }

    if (temp.has('other')) {
      temp["delete"]('other');
      temp.add(Data["a" /* Data */].Method.Other);
    }

    meta.methods = temp;
  }, [meta]);
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Title["a" /* Title */], {
    name: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'data:title',
      defaultMessage: "\u6807\u9898"
    }),
    extra: '*'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(content_String["a" /* StringInputFieldContent */], {
    field: {
      type: FieldType["a" /* FieldType */].String,
      title: 'title',
      required: false
    },
    name: 'title',
    parent: meta,
    informUpdate: informUpdate
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Title["a" /* Title */], {
    name: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'data:abstract',
      defaultMessage: "\u6458\u8981"
    }),
    extra: '*'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(content_String["a" /* StringInputFieldContent */], {
    field: {
      type: FieldType["a" /* FieldType */].String,
      title: 'abstract',
      required: false
    },
    name: 'abstract',
    parent: meta,
    informUpdate: informUpdate
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
    span: 12,
    style: {
      paddingRight: '8px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Title["a" /* Title */], {
    name: 'DOI'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(content_String["a" /* StringInputFieldContent */], {
    field: {
      type: FieldType["a" /* FieldType */].String,
      title: 'doi',
      required: false
    },
    name: 'doi',
    parent: meta,
    informUpdate: informUpdate
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
    span: 12
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Title["a" /* Title */], {
    name: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'data:keywords',
      defaultMessage: "\u5173\u952E\u8BCD"
    }),
    extra: '*'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(EditableTagGroup_EditableTagGroup, {
    size: 'small',
    tags: meta.keywords,
    onTagsChange: handleTagsChange
  })))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
    span: 12,
    style: {
      paddingRight: '8px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Title["a" /* Title */], {
    name: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'data:source',
      defaultMessage: "\u6765\u6E90"
    }),
    extra: '*'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
    value: meta.source,
    onChange: handleSourceChange,
    style: {
      width: '100%',
      display: 'block'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a.Option, {
    value: Data["a" /* Data */].Source.SelfProduct
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'data:self_product',
    defaultMessage: "\u81EA\u4EA7"
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a.Option, {
    value: Data["a" /* Data */].Source.Extract
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'data:extract',
    defaultMessage: "\u6458\u5F55"
  }))))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
    span: 12
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Title["a" /* Title */], {
    name: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'data:reference',
      defaultMessage: "\u5F15\u7528"
    }),
    extra: meta.source === Data["a" /* Data */].Source.Extract ? '*' : undefined
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(content_String["a" /* StringInputFieldContent */], {
    name: 'reference',
    parent: meta,
    informUpdate: informUpdate,
    field: {
      type: FieldType["a" /* FieldType */].String,
      title: 'reference',
      required: meta.source === Data["a" /* Data */].Source.Extract
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'data:reference_required',
    defaultMessage: "\u6570\u636E\u6765\u6E90\u4E3A\u300C\u6458\u5F55\u300D\u65F6\u5F15\u7528\u4E3A\u5FC5\u586B"
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
    span: 12,
    style: {
      paddingRight: '8px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Title["a" /* Title */], {
    name: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'data:producer',
      defaultMessage: "\u6570\u636E\u751F\u4EA7\u8005"
    })
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(content_String["a" /* StringInputFieldContent */], {
    field: {
      type: FieldType["a" /* FieldType */].String,
      title: 'contributor',
      required: false
    },
    name: 'contributor',
    parent: meta,
    informUpdate: informUpdate
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
    span: 12
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Title["a" /* Title */], {
    name: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'data:producer_org',
      defaultMessage: "\u6570\u636E\u751F\u4EA7\u673A\u6784"
    })
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(content_String["a" /* StringInputFieldContent */], {
    field: {
      type: FieldType["a" /* FieldType */].String,
      title: 'institution',
      required: false
    },
    name: 'institution',
    parent: meta,
    informUpdate: informUpdate
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
    span: 12,
    style: {
      paddingRight: '8px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Title["a" /* Title */], {
    name: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'data:method',
      defaultMessage: "\u65B9\u6CD5"
    }),
    extra: '*'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      lineHeight: '32px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(checkbox_default.a, // checked={meta.methods.has(Data.Method.Calculation)}
  {
    // checked={meta.methods.has(Data.Method.Calculation)}
    checked: meta.methods.has('computation') || meta.methods.has(Data["a" /* Data */].Method.Calculation),
    onChange: function onChange(e) {
      return handleMethodsChange(Data["a" /* Data */].Method.Calculation, e.target.checked);
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'data:calculation',
    defaultMessage: "\u8BA1\u7B97"
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(checkbox_default.a, // checked={meta.methods.has(Data.Method.Experiment)}
  {
    // checked={meta.methods.has(Data.Method.Experiment)}
    checked: meta.methods.has('experiment') || meta.methods.has(Data["a" /* Data */].Method.Experiment),
    onChange: function onChange(e) {
      return handleMethodsChange(Data["a" /* Data */].Method.Experiment, e.target.checked);
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'data:experiment',
    defaultMessage: "\u5B9E\u9A8C"
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(checkbox_default.a, // checked={meta.methods.has(Data.Method.Production)}
  {
    // checked={meta.methods.has(Data.Method.Production)}
    checked: meta.methods.has('production') || meta.methods.has(Data["a" /* Data */].Method.Production),
    onChange: function onChange(e) {
      return handleMethodsChange(Data["a" /* Data */].Method.Production, e.target.checked);
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'data:extract',
    defaultMessage: "\u751F\u4EA7"
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(checkbox_default.a, // checked={meta.methods.has(Data.Method.Other)}
  {
    // checked={meta.methods.has(Data.Method.Other)}
    checked: meta.methods.has('other') || meta.methods.has(Data["a" /* Data */].Method.Other),
    onChange: function onChange(e) {
      return handleMethodsChange(Data["a" /* Data */].Method.Other, e.target.checked);
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'data:other',
    defaultMessage: "\u5176\u4ED6"
  }))))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
    span: 24
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Title["a" /* Title */], {
    name: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'data:project',
      defaultMessage: "\u9879\u76EE"
    }),
    extra: '*'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ProjectSelect_ProjectSelect, {
    style: {
      width: '100%'
    },
    value: meta.project,
    onChange: hanleProjectChange
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
    span: 24
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Title["a" /* Title */], {
    name: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'data:subject',
      defaultMessage: "\u8BFE\u9898"
    }),
    extra: '*'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubjectSelect_SubjectSelect, {
    style: {
      width: '100%'
    },
    value: meta.subject,
    onChange: handleSubjectChange,
    projectID: meta.project
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
    span: 24
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Title["a" /* Title */], {
    name: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'data:public_time_range',
      defaultMessage: "\u6570\u636E\u516C\u5F00\u65F6\u95F4\u8303\u56F4"
    }),
    extra: '*'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(PublicRangeSelect_PublicRangeSelect, {
    style: {
      width: '100%'
    },
    is_edit: is_edit === true,
    value: '' + meta.public_range + meta.public_date,
    onChange: hanlePublicRangeChange
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null));
};

/***/ })

/******/ });