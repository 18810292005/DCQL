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
/******/ 		30: 0
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
/******/ 	deferredModules.push([1828,0]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 1828:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85);
__webpack_require__(86);
__webpack_require__(87);
module.exports = __webpack_require__(1833);


/***/ }),

/***/ 1833:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/antd/lib/collapse/style/index.js
var style = __webpack_require__(1078);

// EXTERNAL MODULE: ./node_modules/antd/lib/collapse/index.js
var collapse = __webpack_require__(468);
var collapse_default = /*#__PURE__*/__webpack_require__.n(collapse);

// EXTERNAL MODULE: delegated ./node_modules/react/index.js from dll-reference dll_library
var reactfrom_dll_reference_dll_library = __webpack_require__(0);
var reactfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(reactfrom_dll_reference_dll_library);

// EXTERNAL MODULE: delegated ./node_modules/react-dom/index.js from dll-reference dll_library
var react_domfrom_dll_reference_dll_library = __webpack_require__(11);
var react_domfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(react_domfrom_dll_reference_dll_library);

// EXTERNAL MODULE: ./components/layout/MgeLayout.tsx + 7 modules
var MgeLayout = __webpack_require__(48);

// EXTERNAL MODULE: ./locale/Text.tsx
var Text = __webpack_require__(3);

// EXTERNAL MODULE: ./components/layout/Breadcrumb.tsx
var Breadcrumb = __webpack_require__(27);

// EXTERNAL MODULE: ./apis/Urls.ts
var Urls = __webpack_require__(4);

// EXTERNAL MODULE: ./apis/Fetch.ts
var Fetch = __webpack_require__(7);

// CONCATENATED MODULE: ./apis/management/Get.ts
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


 // 获取分类列表

function GetCategoryList() {
  return _GetCategoryList.apply(this, arguments);
} // 获取用户列表

function _GetCategoryList() {
  _GetCategoryList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var url;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = Urls["b" /* default */].api_v1_1_management.get_category;
            return _context.abrupt("return", Object(Fetch["k" /* default */])(url, 'GET'));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _GetCategoryList.apply(this, arguments);
}

function GetUsersList() {
  return _GetUsersList.apply(this, arguments);
} // 获取项目列表

function _GetUsersList() {
  _GetUsersList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var url;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            url = Urls["b" /* default */].api_v1_account.user_list;
            return _context2.abrupt("return", Object(Fetch["k" /* default */])(url, 'GET'));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _GetUsersList.apply(this, arguments);
}

function GetProjectList() {
  return _GetProjectList.apply(this, arguments);
} // 获取课题列表

function _GetProjectList() {
  _GetProjectList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var url;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            url = Urls["b" /* default */].api_v1_1_management.get_project;
            return _context3.abrupt("return", Object(Fetch["k" /* default */])(url, 'GET'));

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _GetProjectList.apply(this, arguments);
}

function GetSubjectList() {
  return _GetSubjectList.apply(this, arguments);
}

function _GetSubjectList() {
  _GetSubjectList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
    var url;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            url = Urls["b" /* default */].api_v1_1_management.get_subject;
            return _context4.abrupt("return", Object(Fetch["k" /* default */])(url, 'GET'));

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _GetSubjectList.apply(this, arguments);
}
// EXTERNAL MODULE: ./node_modules/antd/lib/button/style/index.js
var button_style = __webpack_require__(32);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/index.js
var lib_button = __webpack_require__(5);
var button_default = /*#__PURE__*/__webpack_require__.n(lib_button);

// EXTERNAL MODULE: ./node_modules/antd/lib/input/style/index.js
var input_style = __webpack_require__(56);

// EXTERNAL MODULE: ./node_modules/antd/lib/input/index.js
var input = __webpack_require__(22);
var input_default = /*#__PURE__*/__webpack_require__.n(input);

// EXTERNAL MODULE: ./node_modules/antd/lib/table/style/index.js
var table_style = __webpack_require__(100);

// EXTERNAL MODULE: ./node_modules/antd/lib/table/index.js
var table = __webpack_require__(37);
var table_default = /*#__PURE__*/__webpack_require__.n(table);

// EXTERNAL MODULE: ./node_modules/antd/lib/switch/style/index.js
var switch_style = __webpack_require__(709);

// EXTERNAL MODULE: ./node_modules/antd/lib/switch/index.js
var lib_switch = __webpack_require__(273);
var switch_default = /*#__PURE__*/__webpack_require__.n(lib_switch);

// EXTERNAL MODULE: ./node_modules/antd/lib/modal/style/index.js
var modal_style = __webpack_require__(45);

// EXTERNAL MODULE: ./node_modules/antd/lib/modal/index.js
var modal = __webpack_require__(15);
var modal_default = /*#__PURE__*/__webpack_require__.n(modal);

// EXTERNAL MODULE: ./node_modules/antd/lib/select/style/index.js
var select_style = __webpack_require__(75);

// EXTERNAL MODULE: ./node_modules/antd/lib/select/index.js
var lib_select = __webpack_require__(24);
var select_default = /*#__PURE__*/__webpack_require__.n(lib_select);

// EXTERNAL MODULE: ./apis/user/PatchPermission.ts
var PatchPermission = __webpack_require__(658);

// EXTERNAL MODULE: ./components/common/CategoryList.tsx
var CategoryList = __webpack_require__(458);

// CONCATENATED MODULE: ./components/management/UserInfoModal.tsx









function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var Option = select_default.a.Option;
var UserInfoModal_UserInfoModal = function UserInfoModal(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(props.modalData.roles),
      _useState2 = _slicedToArray(_useState, 2),
      roles = _useState2[0],
      setRoles = _useState2[1]; // 角色权限


  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(props.modalData.managed_categories.map(function (val) {
    return val.id;
  })),
      _useState4 = _slicedToArray(_useState3, 2),
      categorys = _useState4[0],
      setCategorys = _useState4[1]; // 类别


  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState6 = _slicedToArray(_useState5, 2),
      confirmLoading = _useState6[0],
      setConfirmLoading = _useState6[1];

  var handleOk = function handleOk() {
    setConfirmLoading(true); // 角色权限部分 roles 数组转换为数值

    var num = 0;
    roles.forEach(function (value) {
      if (value < 8) {
        num += Math.pow(2, value);
      }
    }); //提交改动

    Object(PatchPermission["a" /* PatchPermission */])(props.modalData.username, num, categorys).then(function () {
      // 提交之后关闭弹窗刷新页面
      setConfirmLoading(false);
      props.handleCancel();
      window.location.reload();
    });
  };

  var switchChange = function switchChange(checked, key) {
    var rolesChange = Array.from(roles);

    if (checked) {
      rolesChange.push(key);
      rolesChange.sort(function (a, b) {
        return a - b;
      });
    } else {
      rolesChange.splice(rolesChange.indexOf(key), 1);
    }

    setRoles(rolesChange);
  };

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    console.log(roles);
  }, [roles]);
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    okText: '保存',
    cancelText: '取消',
    width: '50%',
    title: props.title,
    visible: props.visible,
    onOk: handleOk,
    confirmLoading: confirmLoading,
    onCancel: props.handleCancel
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UserInfoModal_InfoDisplay, {
    title: '用户名：',
    info: props.modalData.username
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UserInfoModal_InfoDisplay, {
    title: '姓名：',
    info: props.modalData.real_name
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UserInfoModal_InfoDisplay, {
    title: '邮箱地址：',
    info: props.modalData.email
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UserInfoModal_InfoDisplay, {
    title: '数据生产机构：',
    info: props.modalData.institution
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UserInfoModal_InfoDisplay, {
    title: '手机号码：',
    info: props.modalData.tel
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u6743\u9650\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      width: '40%',
      background: '#fff'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UserInfoModal_RolesDisplay, {
    title: "\u6A21\u677F\u521B\u5EFA",
    checked: props.modalData.roles.includes(2),
    role: 2,
    onChange: switchChange
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UserInfoModal_RolesDisplay, {
    title: "\u6A21\u677F\u7BA1\u7406",
    checked: props.modalData.roles.includes(3),
    role: 3,
    onChange: switchChange
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UserInfoModal_RolesDisplay, {
    title: "\u6570\u636E\u521B\u5EFA",
    checked: props.modalData.roles.includes(4),
    role: 4,
    onChange: switchChange
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UserInfoModal_RolesDisplay, {
    title: "\u6570\u636E\u7BA1\u7406",
    checked: props.modalData.roles.includes(5),
    role: 5,
    onChange: switchChange
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UserInfoModal_RolesDisplay, {
    title: "DOI\u7BA1\u7406",
    checked: props.modalData.roles.includes(6),
    role: 6,
    onChange: switchChange
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UserInfoModal_RolesDisplay, {
    title: "\u7528\u6237\u7BA1\u7406",
    checked: props.modalData.roles.includes(7),
    role: 7,
    onChange: switchChange
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: roles.includes(3) || roles.includes(5) ? 'flex' : 'none'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '30%'
    }
  }, "\u7BA1\u7406\u7684\u6750\u6599\u5206\u7C7B\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      width: '60%',
      maxHeight: '320px',
      overflowY: 'scroll',
      border: '1px solid #CCC',
      borderRadius: '4px',
      padding: '0 16px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CategoryList["a" /* CategoryList */], {
    value: categorys,
    onChange: setCategorys
  })))));
};
var UserInfoModal_InfoDisplay = function InfoDisplay(props) {
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, props.title), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: '40%'
    },
    disabled: true,
    defaultValue: props.info
  }));
};

var UserInfoModal_RolesDisplay = function RolesDisplay(props) {
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(switch_default.a, {
    defaultChecked: props.checked ? true : false,
    style: {
      marginRight: '10px'
    },
    onChange: function onChange(check) {
      return props.onChange(check, props.role);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, props.title));
};
// CONCATENATED MODULE: ./components/management/UserListViewer.tsx







function UserListViewer_slicedToArray(arr, i) { return UserListViewer_arrayWithHoles(arr) || UserListViewer_iterableToArrayLimit(arr, i) || UserListViewer_unsupportedIterableToArray(arr, i) || UserListViewer_nonIterableRest(); }

function UserListViewer_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function UserListViewer_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return UserListViewer_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return UserListViewer_arrayLikeToArray(o, minLen); }

function UserListViewer_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function UserListViewer_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function UserListViewer_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var Column = table_default.a.Column;
var UserListViewer_UserListViewer = function UserListViewer(props) {
  // const handleTableChange = (pagination: PaginationConfig) => {
  //     props.onPageChange(pagination.current);
  // }
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(props.data),
      _useState2 = UserListViewer_slicedToArray(_useState, 2),
      innerData = _useState2[0],
      setInnerData = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState4 = UserListViewer_slicedToArray(_useState3, 2),
      visible = _useState4[0],
      setVisible = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(),
      _useState6 = UserListViewer_slicedToArray(_useState5, 2),
      modalData = _useState6[0],
      setModalData = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState8 = UserListViewer_slicedToArray(_useState7, 2),
      title = _useState8[0],
      setTitle = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState10 = UserListViewer_slicedToArray(_useState9, 2),
      search = _useState10[0],
      setSearch = _useState10[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setInnerData(props.data);
  }, [props.data]);

  var showEditModal = function showEditModal(info) {
    setVisible(true);
    setModalData(info);
    setTitle('编辑用户');
  };

  var handleCancel = function handleCancel() {
    setVisible(false);
  };

  var searchUser = function searchUser(val) {
    if (val.length === 0) {
      setInnerData(props.data);
    } else {
      var filterRes = [];
      innerData.map(function (item) {
        if (item.username.indexOf(val) !== -1 || item.real_name.indexOf(val) !== -1 || item.institution.indexOf(val) !== -1) {
          filterRes.push(item);
        }
      });
      setInnerData(filterRes);
    }
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, visible ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UserInfoModal_UserInfoModal, {
    visible: visible,
    totalData: innerData,
    modalData: modalData,
    handleCancel: handleCancel,
    title: title
  }) : null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a.Search, {
    enterButton: "\u641C\u7D22",
    style: {
      marginBottom: '5px',
      width: '30%'
    },
    onSearch: function onSearch(value) {
      searchUser(value);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    rowKey: 'templates_id',
    dataSource: innerData,
    loading: props.loading
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('name', '用户名'),
    dataIndex: 'username',
    key: 'username'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:title', '姓名'),
    dataIndex: 'real_name',
    key: 'real_name'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:application_time', '数据生产机构'),
    dataIndex: 'institution',
    key: 'institution'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:applicant', '邮箱地址'),
    dataIndex: 'email',
    key: 'email'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:data', '操作'),
    key: 'operation',
    render: function render(record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        type: 'danger',
        onClick: function onClick() {
          showEditModal(record);
        }
      }, "\u6743\u9650");
    }
  })));
};
// EXTERNAL MODULE: ./node_modules/antd/lib/popconfirm/style/index.js
var popconfirm_style = __webpack_require__(226);

// EXTERNAL MODULE: ./node_modules/antd/lib/popconfirm/index.js
var popconfirm = __webpack_require__(134);
var popconfirm_default = /*#__PURE__*/__webpack_require__.n(popconfirm);

// EXTERNAL MODULE: ./node_modules/antd/lib/divider/style/index.js
var divider_style = __webpack_require__(144);

// EXTERNAL MODULE: ./node_modules/antd/lib/divider/index.js
var divider = __webpack_require__(43);
var divider_default = /*#__PURE__*/__webpack_require__.n(divider);

// EXTERNAL MODULE: ./node_modules/antd/lib/radio/style/index.js
var radio_style = __webpack_require__(117);

// EXTERNAL MODULE: ./node_modules/antd/lib/radio/index.js
var lib_radio = __webpack_require__(25);
var radio_default = /*#__PURE__*/__webpack_require__.n(lib_radio);

// CONCATENATED MODULE: ./apis/management/Patch.ts
function Patch_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function Patch_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { Patch_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { Patch_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function ChangeCategory(_x) {
  return _ChangeCategory.apply(this, arguments);
}

function _ChangeCategory() {
  _ChangeCategory = Patch_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(form) {
    var url;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = Urls["b" /* default */].api_v1_1_management.get_category;
            return _context.abrupt("return", Object(Fetch["k" /* default */])(url, 'PATCH', form));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _ChangeCategory.apply(this, arguments);
}

function ChangeProject(_x2) {
  return _ChangeProject.apply(this, arguments);
}

function _ChangeProject() {
  _ChangeProject = Patch_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(form) {
    var url;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            url = Urls["b" /* default */].api_v1_1_management.get_project;
            return _context2.abrupt("return", Object(Fetch["k" /* default */])(url, 'PATCH', form));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _ChangeProject.apply(this, arguments);
}

function ChangeSubject(_x3) {
  return _ChangeSubject.apply(this, arguments);
}

function _ChangeSubject() {
  _ChangeSubject = Patch_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(form) {
    var url;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            url = Urls["b" /* default */].api_v1_1_management.get_subject;
            return _context3.abrupt("return", Object(Fetch["k" /* default */])(url, 'PATCH', form));

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _ChangeSubject.apply(this, arguments);
}
// CONCATENATED MODULE: ./apis/management/Post.ts
function Post_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function Post_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { Post_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { Post_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function CreateCategory(_x) {
  return _CreateCategory.apply(this, arguments);
}

function _CreateCategory() {
  _CreateCategory = Post_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(form) {
    var url;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = Urls["b" /* default */].api_v1_1_management.get_category;
            return _context.abrupt("return", Object(Fetch["k" /* default */])(url, 'POST', form));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _CreateCategory.apply(this, arguments);
}

function CreateProject(_x2) {
  return _CreateProject.apply(this, arguments);
}

function _CreateProject() {
  _CreateProject = Post_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(form) {
    var url;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            url = Urls["b" /* default */].api_v1_1_management.get_project;
            return _context2.abrupt("return", Object(Fetch["k" /* default */])(url, 'POST', form));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _CreateProject.apply(this, arguments);
}

function CreateSubject(_x3) {
  return _CreateSubject.apply(this, arguments);
}

function _CreateSubject() {
  _CreateSubject = Post_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(form) {
    var url;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            url = Urls["b" /* default */].api_v1_1_management.get_subject;
            return _context3.abrupt("return", Object(Fetch["k" /* default */])(url, 'POST', form));

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _CreateSubject.apply(this, arguments);
}
// CONCATENATED MODULE: ./components/management/CategoryModal.tsx









function CategoryModal_slicedToArray(arr, i) { return CategoryModal_arrayWithHoles(arr) || CategoryModal_iterableToArrayLimit(arr, i) || CategoryModal_unsupportedIterableToArray(arr, i) || CategoryModal_nonIterableRest(); }

function CategoryModal_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function CategoryModal_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return CategoryModal_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return CategoryModal_arrayLikeToArray(o, minLen); }

function CategoryModal_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function CategoryModal_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function CategoryModal_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var CategoryModal_Option = select_default.a.Option;
var CategoryModal_CategoryModal = function CategoryModal(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState2 = CategoryModal_slicedToArray(_useState, 2),
      nameCN = _useState2[0],
      setNameCN = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState4 = CategoryModal_slicedToArray(_useState3, 2),
      nameEN = _useState4[0],
      setNameEN = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(),
      _useState6 = CategoryModal_slicedToArray(_useState5, 2),
      parentID = _useState6[0],
      setParentID = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState8 = CategoryModal_slicedToArray(_useState7, 2),
      isPublic = _useState8[0],
      setIsPublic = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState10 = CategoryModal_slicedToArray(_useState9, 2),
      confirmLoading = _useState10[0],
      setConfirmLoading = _useState10[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    if (props.modalData) {
      setNameCN(props.modalData.name);
      setParentID(props.modalData.pid);
    }
  }, []);

  var handleOk = function handleOk() {
    setConfirmLoading(true);
    var form;

    if (!props.isCreate) {
      form = {
        'id': props.modalData.id,
        "parent_id": parentID,
        "name_zh": nameCN,
        "name_en": nameEN,
        "is_public": isPublic
      };
      ChangeCategory(form).then(function () {
        setConfirmLoading(false);
        props.handleCancel();
        window.location.reload();
      });
    } else {
      form = {
        "parent_id": parentID,
        "name_zh": nameCN,
        "name_en": nameEN,
        "is_public": isPublic
      };
      CreateCategory(form).then(function () {
        setConfirmLoading(false);
        props.handleCancel();
        window.location.reload();
      });
    }
  };

  return props.isCreate ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    okText: '确认',
    cancelText: '取消',
    width: '50%',
    title: props.title,
    visible: props.visible,
    onOk: handleOk,
    confirmLoading: confirmLoading,
    onCancel: props.handleCancel
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u9009\u62E9\u5206\u7C7B\uFF08\u9876\u7EA7\u5206\u7C7B\u8BF7\u9009\u62E9\u5168\u5C40\u6839\u8282\u70B9\uFF09"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
    defaultValue: "\u9009\u62E9\u7C7B\u522B",
    style: {
      width: '40%'
    },
    onChange: function onChange(value) {
      setParentID(value);
    }
  }, props.totalData.map(function (item) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CategoryModal_Option, {
      value: item.id,
      key: item.id
    }, item.name);
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u8BF7\u8F93\u5165\u4E2D\u6587\u540D\u79F0\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: '40%'
    },
    onChange: function onChange(e) {
      setNameCN(e.target.value);
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u8BF7\u8F93\u5165\u82F1\u6587\u540D\u79F0\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: '40%'
    },
    onChange: function onChange(e) {
      setNameEN(e.target.value);
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u662F\u5426\u516C\u5F00\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, {
    defaultValue: true,
    onChange: function onChange(e) {
      return setIsPublic(e.target.value);
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a, {
    value: true
  }, "\u516C\u5F00"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a, {
    value: false
  }, "\u4E0D\u516C\u5F00"))))) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    okText: '确认',
    cancelText: '取消',
    width: '50%',
    title: props.title,
    visible: props.visible,
    onOk: handleOk,
    confirmLoading: confirmLoading,
    onCancel: props.handleCancel
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u9009\u62E9\u5206\u7C7B\uFF08\u9876\u7EA7\u5206\u7C7B\u8BF7\u9009\u62E9\u5168\u5C40\u6839\u8282\u70B9\uFF09"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
    defaultValue: props.modalData.pid,
    style: {
      width: '40%'
    },
    onChange: function onChange(value) {
      setParentID(value);
    }
  }, props.totalData.map(function (item) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CategoryModal_Option, {
      value: item.id,
      key: item.id
    }, item.name);
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u8BF7\u8F93\u5165\u4E2D\u6587\u540D\u79F0\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: '40%'
    },
    defaultValue: props.modalData.name,
    onChange: function onChange(e) {
      setNameCN(e.target.value);
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u8BF7\u8F93\u5165\u82F1\u6587\u540D\u79F0\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: '40%'
    },
    onChange: function onChange(e) {
      setNameEN(e.target.value);
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u662F\u5426\u516C\u5F00\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, {
    defaultValue: true,
    onChange: function onChange(e) {
      return setIsPublic(e.target.value);
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a, {
    value: true
  }, "\u516C\u5F00"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a, {
    value: false
  }, "\u4E0D\u516C\u5F00")))));
};
// CONCATENATED MODULE: ./apis/management/Delete.ts
function Delete_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function Delete_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { Delete_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { Delete_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function DeleteCategory(_x) {
  return _DeleteCategory.apply(this, arguments);
}

function _DeleteCategory() {
  _DeleteCategory = Delete_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id) {
    var url, data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = Urls["b" /* default */].api_v1_1_management.get_category;
            data = {
              "id": id
            };
            return _context.abrupt("return", Object(Fetch["k" /* default */])(url, 'DELETE', data));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _DeleteCategory.apply(this, arguments);
}

function DeleteProject(_x2) {
  return _DeleteProject.apply(this, arguments);
}

function _DeleteProject() {
  _DeleteProject = Delete_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(id) {
    var url, data;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            url = Urls["b" /* default */].api_v1_1_management.get_project;
            data = {
              "id": id
            };
            return _context2.abrupt("return", Object(Fetch["k" /* default */])(url, 'DELETE', data));

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _DeleteProject.apply(this, arguments);
}

function DeleteSubject(_x3) {
  return _DeleteSubject.apply(this, arguments);
}

function _DeleteSubject() {
  _DeleteSubject = Delete_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(id) {
    var url, data;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            url = Urls["b" /* default */].api_v1_1_management.get_subject;
            data = {
              "id": id
            };
            return _context3.abrupt("return", Object(Fetch["k" /* default */])(url, 'DELETE', data));

          case 3:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _DeleteSubject.apply(this, arguments);
}
// CONCATENATED MODULE: ./components/management/CategoryListViewer.tsx









function CategoryListViewer_slicedToArray(arr, i) { return CategoryListViewer_arrayWithHoles(arr) || CategoryListViewer_iterableToArrayLimit(arr, i) || CategoryListViewer_unsupportedIterableToArray(arr, i) || CategoryListViewer_nonIterableRest(); }

function CategoryListViewer_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function CategoryListViewer_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return CategoryListViewer_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return CategoryListViewer_arrayLikeToArray(o, minLen); }

function CategoryListViewer_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function CategoryListViewer_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function CategoryListViewer_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }





var CategoryListViewer_Column = table_default.a.Column;
var CategoryListViewer_CategoryListViewer = function CategoryListViewer(props) {
  // const handleTableChange = (pagination: PaginationConfig) => {
  //     props.onPageChange(pagination.current);
  // }
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(props.data),
      _useState2 = CategoryListViewer_slicedToArray(_useState, 2),
      innerData = _useState2[0],
      setInnerData = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState4 = CategoryListViewer_slicedToArray(_useState3, 2),
      visible = _useState4[0],
      setVisible = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(),
      _useState6 = CategoryListViewer_slicedToArray(_useState5, 2),
      modalData = _useState6[0],
      setModalData = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState8 = CategoryListViewer_slicedToArray(_useState7, 2),
      title = _useState8[0],
      setTitle = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState10 = CategoryListViewer_slicedToArray(_useState9, 2),
      isCreate = _useState10[0],
      setIsCreate = _useState10[1];

  var showEditModal = function showEditModal(info) {
    setVisible(true);
    setIsCreate(false);
    setModalData(info);
    setTitle('修改类别');
  };

  var showCreateModal = function showCreateModal() {
    setVisible(true);
    setIsCreate(true);
    setModalData(null);
    setTitle('创建类别');
  };

  var handleCancel = function handleCancel() {
    setVisible(false);
  };

  var deleteCate = function deleteCate(id) {
    DeleteCategory(id).then(function () {
      return window.location.reload();
    });
  };

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setInnerData(props.data);
  }, [props.data]);
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, visible && !isCreate ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CategoryModal_CategoryModal, {
    isCreate: isCreate,
    visible: visible,
    totalData: innerData,
    handleCancel: handleCancel,
    modalData: modalData,
    title: title
  }) : null, visible && isCreate ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CategoryModal_CategoryModal, {
    isCreate: isCreate,
    visible: visible,
    totalData: innerData,
    handleCancel: handleCancel,
    title: title
  }) : null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'primary',
    style: {
      margin: '0 0 10px 10px'
    },
    onClick: showCreateModal
  }, Object(Text["a" /* TEXT */])('manage:create_category', '创建类别')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    rowKey: 'category_list',
    dataSource: innerData,
    loading: props.loading,
    pagination: {
      total: props.total,
      pageSize: props.pageSize
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CategoryListViewer_Column, {
    width: '10%',
    align: 'center',
    title: Object(Text["a" /* TEXT */])('manage:cate_id', '类别id'),
    dataIndex: 'id',
    key: 'id'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CategoryListViewer_Column, {
    width: '45%',
    align: 'center',
    title: Object(Text["a" /* TEXT */])('name', '类别名称'),
    dataIndex: 'name',
    key: 'name'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CategoryListViewer_Column, {
    width: '10%',
    align: 'center',
    title: Object(Text["a" /* TEXT */])('manage:cate_level', '层级'),
    dataIndex: 'level',
    key: 'level'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CategoryListViewer_Column, {
    width: '10%',
    align: 'center',
    title: Object(Text["a" /* TEXT */])('manage:cate_leaf', '是否叶子节点'),
    dataIndex: 'leaf',
    key: 'leaf',
    render: function render(leaf) {
      return leaf ? '是' : '否';
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CategoryListViewer_Column, {
    align: 'center',
    key: 'option',
    title: Object(Text["a" /* TEXT */])('manage:operation', '操作'),
    render: function render(record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        type: 'primary',
        onClick: function onClick() {
          showEditModal(record);
        }
      }, Object(Text["a" /* TEXT */])('template:edit', '修改')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
        type: 'vertical'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(popconfirm_default.a, {
        title: '确定删除？',
        okText: "\u662F",
        cancelText: "\u5426",
        onConfirm: function onConfirm() {
          deleteCate(record.id);
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        type: 'danger'
      }, Object(Text["a" /* TEXT */])('template:delete', '删除'))));
    }
  })));
};
// CONCATENATED MODULE: ./components/management/ProjectModal.tsx







function ProjectModal_slicedToArray(arr, i) { return ProjectModal_arrayWithHoles(arr) || ProjectModal_iterableToArrayLimit(arr, i) || ProjectModal_unsupportedIterableToArray(arr, i) || ProjectModal_nonIterableRest(); }

function ProjectModal_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function ProjectModal_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return ProjectModal_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ProjectModal_arrayLikeToArray(o, minLen); }

function ProjectModal_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ProjectModal_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function ProjectModal_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var ProjectModal_Option = select_default.a.Option;
var ProjectModal_ProjectModal = function ProjectModal(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState2 = ProjectModal_slicedToArray(_useState, 2),
      nameExpert = _useState2[0],
      setNameExpert = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState4 = ProjectModal_slicedToArray(_useState3, 2),
      nameInstitution = _useState4[0],
      setNameInstitution = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState6 = ProjectModal_slicedToArray(_useState5, 2),
      confirmLoading = _useState6[0],
      setConfirmLoading = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState8 = ProjectModal_slicedToArray(_useState7, 2),
      projectId = _useState8[0],
      setProjectId = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState10 = ProjectModal_slicedToArray(_useState9, 2),
      projectName = _useState10[0],
      setProjectName = _useState10[1];

  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState12 = ProjectModal_slicedToArray(_useState11, 2),
      leader = _useState12[0],
      setLeader = _useState12[1];

  var _useState13 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState14 = ProjectModal_slicedToArray(_useState13, 2),
      members = _useState14[0],
      setMembers = _useState14[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    if (props.modalData) {
      setProjectId(props.modalData.id);
      setProjectName(props.modalData.name);
      setLeader(props.modalData.leader);
      setNameExpert(props.modalData.responsible_expert);
    } // props.user.map((item: any) => {
    //     if (item.real_name === props.modalData.leader) {
    //         setLeader(item.real_name)
    //     }
    // })

  }, []);

  var handleOk = function handleOk() {
    setConfirmLoading(true);
    var form;

    if (!props.isCreate) {
      form = {
        "id": projectId,
        "name": projectName,
        "responsible_expert": nameExpert,
        "responsible_expert_institution": nameInstitution,
        "leader_name": leader,
        "members_name": members
      };
      ChangeProject(form).then(function () {
        setConfirmLoading(false);
        props.handleCancel();
        window.location.reload();
      });
    } else {
      form = {
        "id": projectId,
        "name": projectName,
        "responsible_expert": nameExpert,
        "responsible_expert_institution": nameInstitution
      };
      CreateProject(form).then(function () {
        setConfirmLoading(false);
        props.handleCancel();
        window.location.reload();
      });
    }
  };

  return props.isCreate ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    okText: '确认',
    cancelText: '取消',
    width: '50%',
    title: props.title,
    visible: props.visible,
    onOk: handleOk,
    confirmLoading: confirmLoading,
    onCancel: props.handleCancel
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u8BF7\u8F93\u5165\u9879\u76EEid\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: '40%'
    },
    onChange: function onChange(e) {
      setProjectId(e.target.value);
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: '40%'
    },
    onChange: function onChange(e) {
      setProjectName(e.target.value);
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u8BF7\u8F93\u5165\u8D1F\u8D23\u4E13\u5BB6\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: '40%'
    },
    onChange: function onChange(e) {
      setNameExpert(e.target.value);
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u4E13\u5BB6\u6240\u5C5E\u673A\u6784\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: '40%'
    },
    onChange: function onChange(e) {
      setNameInstitution(e.target.value);
    }
  })))) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    okText: '确认',
    cancelText: '取消',
    width: '50%',
    title: props.title,
    visible: props.visible,
    onOk: handleOk,
    confirmLoading: confirmLoading,
    onCancel: props.handleCancel
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u8BF7\u8F93\u5165\u9879\u76EE\u540D\u79F0\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: '40%'
    },
    defaultValue: props.modalData.name,
    onChange: function onChange(e) {
      setProjectName(e.target.value);
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u9009\u62E9\u8D1F\u8D23\u4EBA\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
    defaultValue: props.modalData.leader,
    style: {
      width: '40%'
    },
    onChange: function onChange(value) {
      setLeader(value);
    }
  }, props.user.map(function (item) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ProjectModal_Option, {
      value: item.username,
      key: item.username
    }, item.real_name);
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u8BF7\u8F93\u5165\u8D1F\u8D23\u4E13\u5BB6\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: '40%'
    },
    defaultValue: props.modalData.responsible_expert,
    onChange: function onChange(e) {
      setNameExpert(e.target.value);
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u4E13\u5BB6\u6240\u5C5E\u673A\u6784\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: '40%'
    },
    onChange: function onChange(e) {
      setNameInstitution(e.target.value);
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u589E\u52A0\u53C2\u4E0E\u6210\u5458\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
    mode: 'multiple',
    style: {
      width: '40%'
    },
    onChange: function onChange(value) {
      setMembers(value);
    }
  }, props.user.map(function (item) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ProjectModal_Option, {
      value: item.username,
      key: item.username
    }, item.real_name);
  })))));
};
// CONCATENATED MODULE: ./components/management/ProjectListViewer.tsx









function ProjectListViewer_slicedToArray(arr, i) { return ProjectListViewer_arrayWithHoles(arr) || ProjectListViewer_iterableToArrayLimit(arr, i) || ProjectListViewer_unsupportedIterableToArray(arr, i) || ProjectListViewer_nonIterableRest(); }

function ProjectListViewer_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function ProjectListViewer_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return ProjectListViewer_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ProjectListViewer_arrayLikeToArray(o, minLen); }

function ProjectListViewer_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ProjectListViewer_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function ProjectListViewer_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }





var ProjectListViewer_Column = table_default.a.Column;
var ProjectListViewer_ProjectListViewer = function ProjectListViewer(props) {
  // const handleTableChange = (pagination: PaginationConfig) => {
  //     props.onPageChange(pagination.current);
  // }
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(props.data),
      _useState2 = ProjectListViewer_slicedToArray(_useState, 2),
      innerData = _useState2[0],
      setInnerData = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState4 = ProjectListViewer_slicedToArray(_useState3, 2),
      visible = _useState4[0],
      setVisible = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(),
      _useState6 = ProjectListViewer_slicedToArray(_useState5, 2),
      modalData = _useState6[0],
      setModalData = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState8 = ProjectListViewer_slicedToArray(_useState7, 2),
      title = _useState8[0],
      setTitle = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState10 = ProjectListViewer_slicedToArray(_useState9, 2),
      isCreate = _useState10[0],
      setIsCreate = _useState10[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setInnerData(props.data);
  }, [props.data]);

  var showEditModal = function showEditModal(info) {
    setVisible(true);
    setIsCreate(false);
    setModalData(info);
    setTitle('修改项目');
  };

  var showCreateModal = function showCreateModal() {
    setVisible(true);
    setIsCreate(true);
    setModalData(null);
    setTitle('创建项目');
  };

  var handleCancel = function handleCancel() {
    setVisible(false);
  };

  var deleteProject = function deleteProject(id) {
    DeleteProject(id).then(function () {
      return window.location.reload();
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, visible && !isCreate ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ProjectModal_ProjectModal, {
    isCreate: isCreate,
    visible: visible,
    totalData: innerData,
    handleCancel: handleCancel,
    modalData: modalData,
    user: props.user,
    title: title
  }) : null, visible && isCreate ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ProjectModal_ProjectModal, {
    isCreate: isCreate,
    visible: visible,
    user: props.user,
    totalData: innerData,
    handleCancel: handleCancel,
    title: title
  }) : null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'primary',
    style: {
      margin: '0 0 10px 10px'
    },
    onClick: showCreateModal
  }, Object(Text["a" /* TEXT */])('manage:create_category', '创建项目')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    rowKey: 'project',
    dataSource: innerData,
    loading: props.loading,
    pagination: {
      total: props.total,
      pageSize: props.pageSize
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ProjectListViewer_Column, {
    align: 'center',
    title: Object(Text["a" /* TEXT */])('name', 'id'),
    dataIndex: 'id',
    key: 'id'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ProjectListViewer_Column, {
    align: 'center',
    title: Object(Text["a" /* TEXT */])('dash:title', '名称'),
    dataIndex: 'name',
    key: 'name'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ProjectListViewer_Column, {
    width: '10%',
    align: 'center',
    title: Object(Text["a" /* TEXT */])('dash:applicant', '负责人'),
    dataIndex: 'leader',
    key: 'leader'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ProjectListViewer_Column, {
    align: 'center',
    title: Object(Text["a" /* TEXT */])('dash:application_time', '机构'),
    dataIndex: 'institution',
    key: 'institution'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ProjectListViewer_Column, {
    align: 'center',
    title: Object(Text["a" /* TEXT */])('dash:applicant', '负责人联系方式'),
    dataIndex: 'leader_contact_method',
    key: 'leader_contact_method'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ProjectListViewer_Column, {
    width: '15%',
    align: 'center',
    title: Object(Text["a" /* TEXT */])('manage:operation', '操作'),
    render: function render(record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        type: 'primary',
        onClick: function onClick() {
          showEditModal(record);
        }
      }, Object(Text["a" /* TEXT */])('template:edit', '修改')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
        type: 'vertical'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(popconfirm_default.a, {
        title: '确定删除？',
        okText: "\u662F",
        cancelText: "\u5426",
        onConfirm: function onConfirm() {
          deleteProject(record.id);
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        type: 'danger'
      }, Object(Text["a" /* TEXT */])('template:delete', '删除'))));
    }
  })));
};
// CONCATENATED MODULE: ./components/management/SubjectModal.tsx







function SubjectModal_slicedToArray(arr, i) { return SubjectModal_arrayWithHoles(arr) || SubjectModal_iterableToArrayLimit(arr, i) || SubjectModal_unsupportedIterableToArray(arr, i) || SubjectModal_nonIterableRest(); }

function SubjectModal_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function SubjectModal_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return SubjectModal_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return SubjectModal_arrayLikeToArray(o, minLen); }

function SubjectModal_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function SubjectModal_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function SubjectModal_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var SubjectModal_Option = select_default.a.Option;
var SubjectModal_SubjectModal = function SubjectModal(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState2 = SubjectModal_slicedToArray(_useState, 2),
      subjectId = _useState2[0],
      setSubjectId = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState4 = SubjectModal_slicedToArray(_useState3, 2),
      subjectName = _useState4[0],
      setSubjectName = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(),
      _useState6 = SubjectModal_slicedToArray(_useState5, 2),
      projectID = _useState6[0],
      setProjectID = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(),
      _useState8 = SubjectModal_slicedToArray(_useState7, 2),
      leader = _useState8[0],
      setLeader = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState10 = SubjectModal_slicedToArray(_useState9, 2),
      members = _useState10[0],
      setMembers = _useState10[1];

  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState12 = SubjectModal_slicedToArray(_useState11, 2),
      confirmLoading = _useState12[0],
      setConfirmLoading = _useState12[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    if (props.modalData) {
      setProjectID(props.modalData.project_id);
      setSubjectId(props.modalData.id);
      setSubjectName(props.modalData.name);
      setLeader(props.modalData.leader_fk); // setMembers(props.modalData.members_name)
    }
  }, []);

  var handleOk = function handleOk() {
    setConfirmLoading(true);
    var form;

    if (!props.isCreate) {
      form = {
        'id': subjectId,
        "leader_name": leader,
        "members_name": members,
        "name": subjectName
      };
      ChangeSubject(form).then(function () {
        setConfirmLoading(false);
        props.handleCancel();
        window.location.reload();
      });
    } else {
      form = {
        'id': subjectId,
        "project_id": projectID,
        "name": subjectName
      };
      CreateSubject(form).then(function () {
        setConfirmLoading(false);
        props.handleCancel();
        window.location.reload();
      });
    }
  };

  return props.isCreate ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    okText: '确认',
    cancelText: '取消',
    width: '50%',
    title: props.title,
    visible: props.visible,
    onOk: handleOk,
    confirmLoading: confirmLoading,
    onCancel: props.handleCancel
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u9009\u62E9\u6240\u5C5E\u9879\u76EE\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
    defaultValue: "\u9009\u62E9\u9879\u76EE",
    style: {
      width: '40%'
    },
    onChange: function onChange(value) {
      setProjectID(value);
    }
  }, props.projects.map(function (item) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubjectModal_Option, {
      value: item.id,
      key: item.id
    }, item.name);
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u8BF7\u8F93\u5165\u8BFE\u9898id\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: '40%'
    },
    onChange: function onChange(e) {
      setSubjectId(e.target.value);
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u8BF7\u8F93\u5165\u8BFE\u9898\u540D\u79F0\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: '40%'
    },
    onChange: function onChange(e) {
      setSubjectName(e.target.value);
    }
  })))) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    okText: '确认',
    cancelText: '取消',
    width: '50%',
    title: props.title,
    visible: props.visible,
    onOk: handleOk,
    confirmLoading: confirmLoading,
    onCancel: props.handleCancel
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u9009\u62E9\u6240\u5C5E\u9879\u76EE\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
    defaultValue: props.modalData.project_id,
    style: {
      width: '40%'
    },
    onChange: function onChange(value) {
      setProjectID(value);
    }
  }, props.projects.map(function (item) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubjectModal_Option, {
      value: item.id,
      key: item.id
    }, item.name);
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u8BF7\u8F93\u5165\u8BFE\u9898\u540D\u79F0\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: '40%'
    },
    defaultValue: props.modalData.name,
    onChange: function onChange(e) {
      setSubjectName(e.target.value);
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u9009\u62E9\u8D1F\u8D23\u4EBA\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
    defaultValue: props.modalData.leader,
    style: {
      width: '40%'
    },
    onChange: function onChange(value) {
      setLeader(value);
    }
  }, props.user.map(function (item) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubjectModal_Option, {
      value: item.username,
      key: item.username
    }, item.real_name);
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
    style: {
      width: '40%'
    }
  }, "\u589E\u52A0\u53C2\u4E0E\u6210\u5458\uFF1A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
    mode: 'multiple',
    style: {
      width: '40%'
    },
    onChange: function onChange(value) {
      setMembers(value);
    }
  }, props.user.map(function (item) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubjectModal_Option, {
      value: item.username,
      key: item.username
    }, item.real_name);
  })))));
};
// CONCATENATED MODULE: ./components/management/SubjectListViewer.tsx









function SubjectListViewer_slicedToArray(arr, i) { return SubjectListViewer_arrayWithHoles(arr) || SubjectListViewer_iterableToArrayLimit(arr, i) || SubjectListViewer_unsupportedIterableToArray(arr, i) || SubjectListViewer_nonIterableRest(); }

function SubjectListViewer_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function SubjectListViewer_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return SubjectListViewer_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return SubjectListViewer_arrayLikeToArray(o, minLen); }

function SubjectListViewer_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function SubjectListViewer_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function SubjectListViewer_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }





var SubjectListViewer_Column = table_default.a.Column;
var SubjectListViewer_SubjectListViewer = function SubjectListViewer(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(props.data),
      _useState2 = SubjectListViewer_slicedToArray(_useState, 2),
      innerData = _useState2[0],
      setInnerData = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState4 = SubjectListViewer_slicedToArray(_useState3, 2),
      visible = _useState4[0],
      setVisible = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(),
      _useState6 = SubjectListViewer_slicedToArray(_useState5, 2),
      modalData = _useState6[0],
      setModalData = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState8 = SubjectListViewer_slicedToArray(_useState7, 2),
      title = _useState8[0],
      setTitle = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState10 = SubjectListViewer_slicedToArray(_useState9, 2),
      isCreate = _useState10[0],
      setIsCreate = _useState10[1];

  var showEditModal = function showEditModal(info) {
    setVisible(true);
    setIsCreate(false);
    setModalData(info);
    setTitle('修改课题');
  };

  var showCreateModal = function showCreateModal() {
    setVisible(true);
    setIsCreate(true);
    setModalData(null);
    setTitle('创建课题');
  };

  var handleCancel = function handleCancel() {
    setVisible(false);
  };

  var deleteSubject = function deleteSubject(id) {
    DeleteSubject(id).then(function () {
      return window.location.reload();
    });
  };

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setInnerData(props.data);
  }, [props.data]);
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, visible && !isCreate ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubjectModal_SubjectModal, {
    projects: props.projects,
    isCreate: isCreate,
    visible: visible,
    totalData: innerData,
    handleCancel: handleCancel,
    modalData: modalData,
    user: props.user,
    title: title
  }) : null, visible && isCreate ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubjectModal_SubjectModal, {
    projects: props.projects,
    isCreate: isCreate,
    visible: visible,
    totalData: innerData,
    handleCancel: handleCancel,
    user: props.user,
    title: title
  }) : null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'primary',
    style: {
      margin: '0 0 10px 10px'
    },
    onClick: showCreateModal
  }, Object(Text["a" /* TEXT */])('manage:create_category', '创建课题')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    rowKey: 'subject',
    dataSource: innerData,
    loading: props.loading,
    pagination: {
      total: props.total,
      pageSize: props.pageSize
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubjectListViewer_Column, {
    align: 'center',
    title: Object(Text["a" /* TEXT */])('name', 'id'),
    dataIndex: 'id',
    key: 'id'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubjectListViewer_Column, {
    align: 'center',
    title: Object(Text["a" /* TEXT */])('dash:title', '名称'),
    dataIndex: 'name',
    key: 'name'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubjectListViewer_Column, {
    align: 'center',
    title: Object(Text["a" /* TEXT */])('dash:applicant', '所属项目id'),
    dataIndex: 'project_id',
    key: 'project_id'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubjectListViewer_Column, {
    width: '10%',
    align: 'center',
    title: Object(Text["a" /* TEXT */])('dash:applicant', '负责人'),
    dataIndex: 'leader',
    key: 'leader'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubjectListViewer_Column, {
    align: 'center',
    title: Object(Text["a" /* TEXT */])('dash:application_time', '机构'),
    dataIndex: 'institution',
    key: 'institution'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubjectListViewer_Column, {
    align: 'center',
    title: Object(Text["a" /* TEXT */])('dash:applicant', '负责人联系方式'),
    dataIndex: 'leader_contact_method',
    key: 'leader_contact_method'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubjectListViewer_Column, {
    width: '15%',
    align: 'center',
    title: Object(Text["a" /* TEXT */])('manage:operation', '操作'),
    render: function render(record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        type: 'primary',
        onClick: function onClick() {
          showEditModal(record);
        }
      }, Object(Text["a" /* TEXT */])('template:edit', '修改')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
        type: 'vertical'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(popconfirm_default.a, {
        title: '确定删除？',
        okText: "\u662F",
        cancelText: "\u5426",
        onConfirm: function onConfirm() {
          deleteSubject(record.id);
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        type: 'danger'
      }, Object(Text["a" /* TEXT */])('template:delete', '删除'))));
    }
  })));
};
// CONCATENATED MODULE: ./entry/systemManage.tsx



function systemManage_slicedToArray(arr, i) { return systemManage_arrayWithHoles(arr) || systemManage_iterableToArrayLimit(arr, i) || systemManage_unsupportedIterableToArray(arr, i) || systemManage_nonIterableRest(); }

function systemManage_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function systemManage_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return systemManage_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return systemManage_arrayLikeToArray(o, minLen); }

function systemManage_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function systemManage_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function systemManage_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }










 // const dataRaw = {
//     "code": 0,
//     "data": {
//         "page": 1,
//         "page_size": 10,
//         "results": [
//             {
//                 "id": 1,
//                 "pid": null,
//                 "level": 0,
//                 "name": "全局根节点（勿删）",
//                 "leaf": false,
//                 "order": 1
//             },
//             {
//                 "id": 2,
//                 "pid": 1,
//                 "level": 1,
//                 "name": "测试类别",
//                 "leaf": true,
//                 "order": 1
//             },
//             {
//                 "id": 3,
//                 "pid": 1,
//                 "level": 1,
//                 "name": "test1_zh",
//                 "leaf": true,
//                 "order": 1
//             }
//         ],
//         "total": 3
//     }
// }
// const User = {
//     "code": 0,
//     "data": {
//         "total": 1391,
//         "results": [
//             {
//                 "username": "+",
//                 "institution": "ustb",
//                 "email": "2285950891@qq.com",
//                 "email_verified": true,
//                 "real_name": "张",
//                 "tel": "",
//                 "roles": [
//                     2,
//                     3,
//                     4,
//                     5,
//                     6,
//                     7,
//                     8
//                 ],
//                 "managed_categories": [1],
//                 "roles_for_acceptance": [
//                     8
//                 ]
//             },
//             {
//                 "username": "00",
//                 "institution": "北京科技大学",
//                 "email": "2412017287@qq.com",
//                 "email_verified": true,
//                 "real_name": "吉铮",
//                 "tel": "",
//                 "roles": [
//                     1,
//                     2,
//                     4
//                 ],
//                 "managed_categories": [],
//                 "roles_for_acceptance": []
//             },
//             {
//                 "username": "0920723",
//                 "institution": "浙江大学",
//                 "email": "0920723@zju.edu.cn",
//                 "email_verified": true,
//                 "real_name": "李辰",
//                 "tel": "",
//                 "roles": [
//                     1,
//                     4
//                 ],
//                 "managed_categories": [
//                     {
//                         "name": "科研成果",
//                         "id": 101
//                     },
//                     {
//                         "name": "练习-仅供练习-请勿提交真实数据",
//                         "id": 80
//                     }
//                 ],
//                 "roles_for_acceptance": [
//                     8
//                 ]
//             },
//             {
//                 "username": "0pi436ky",
//                 "institution": "nlicrj2o",
//                 "email": "gxfaqwsv@163.com",
//                 "email_verified": false,
//                 "real_name": "mktdpfaj",
//                 "tel": "",
//                 "roles": [
//                     4
//                 ],
//                 "managed_categories": [],
//                 "roles_for_acceptance": []
//             },
//             {
//                 "username": "1010540141",
//                 "institution": "厦门大学",
//                 "email": "1010540141@qq.com",
//                 "email_verified": true,
//                 "real_name": "黄晓倚",
//                 "tel": "",
//                 "roles": [
//                     1,
//                     2,
//                     4
//                 ],
//                 "managed_categories": [],
//                 "roles_for_acceptance": [
//                     8
//                 ]
//             },
//             {
//                 "username": "1020054177",
//                 "institution": "吉林奥来德光电材料股份有限公司",
//                 "email": "1020054177@qq.com",
//                 "email_verified": true,
//                 "real_name": "徐佳楠",
//                 "tel": "",
//                 "roles": [
//                     1,
//                     4
//                 ],
//                 "managed_categories": [],
//                 "roles_for_acceptance": [
//                     8
//                 ]
//             },
//             {
//                 "username": "1031327371",
//                 "institution": "mei",
//                 "email": "1031327371@qq.com",
//                 "email_verified": false,
//                 "real_name": "Mei",
//                 "tel": "",
//                 "roles": [],
//                 "managed_categories": [],
//                 "roles_for_acceptance": []
//             }
//         ]
//     }
// }
// const Project = {
//     "code": 0,
//     "data": {
//         "page": 1,
//         "page_size": 10,
//         "results": [
//             {
//                 "id": "2016YFB0700500",
//                 "name": "2016YFB0700500",
//                 "leader": "test",
//                 "institution": "test",
//                 "leader_contact_method": "test",
//                 "responsible_expert": "t",
//                 "created_time": "2022-05-30 10:55:21",
//                 "subjects": [
//                     {
//                         "id": "2016YFB0700503",
//                         "project_id": "2016YFB0700500",
//                         "name": "2016YFB0700503",
//                         "leader": "test",
//                         "institution": "test",
//                         "leader_contact_method": "test"
//                     }
//                 ]
//             },
//             {
//                 "id": "2016YFB0700501",
//                 "name": "2016YF",
//                 "leader": "test",
//                 "institution": "test",
//                 "leader_contact_method": "test",
//                 "responsible_expert": "tst",
//                 "created_time": "2022-05-30 10:55:21",
//                 "subjects": [
//                     {
//                         "id": "2016YFB0700504",
//                         "project_id": "2016YFB0700501",
//                         "name": "2016YFB0700504",
//                         "leader": "test",
//                         "institution": "test",
//                         "leader_contact_method": "test"
//                     }
//                 ]
//             }
//         ],
//         "total": 1
//     }
// }
// const Subject = {
//     "code": 0,
//     "data": {
//         "page": 1,
//         "page_size": 10,
//         "results": [
//             {
//                 "id": "2016YFB0700503",
//                 "project_id": "2016YFB0700500",
//                 "name": "2016YFB0700503",
//                 "leader": "test",
//                 "institution": "test",
//                 "leader_contact_method": "test"
//             },
//             {
//                 "id": "2016YFB0700504",
//                 "project_id": "2016YFB0700501",
//                 "name": "2016YFB0700504",
//                 "leader": "test",
//                 "institution": "test",
//                 "leader_contact_method": "test"
//             }
//         ],
//         "total": 1
//     }
// }

var Panel = collapse_default.a.Panel;

var systemManage_SystemManagement = function SystemManagement() {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])({}),
      _useState2 = systemManage_slicedToArray(_useState, 2),
      dataCate = _useState2[0],
      setDataCate = _useState2[1]; // 类别数据


  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])({}),
      _useState4 = systemManage_slicedToArray(_useState3, 2),
      dataUser = _useState4[0],
      setDataUser = _useState4[1]; // 用户列表数据


  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])({}),
      _useState6 = systemManage_slicedToArray(_useState5, 2),
      dataProject = _useState6[0],
      setDataProject = _useState6[1]; // 项目数据


  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])({}),
      _useState8 = systemManage_slicedToArray(_useState7, 2),
      dataSubject = _useState8[0],
      setDataSubject = _useState8[1]; // 课题数据


  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState10 = systemManage_slicedToArray(_useState9, 2),
      loadingCate = _useState10[0],
      setLoadingCate = _useState10[1]; //类别 loading


  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState12 = systemManage_slicedToArray(_useState11, 2),
      loadingUser = _useState12[0],
      setLoadingUser = _useState12[1]; //用户列表 loading


  var _useState13 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState14 = systemManage_slicedToArray(_useState13, 2),
      loadingProject = _useState14[0],
      setLoadingProject = _useState14[1]; //项目 loading


  var _useState15 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState16 = systemManage_slicedToArray(_useState15, 2),
      loadingSubject = _useState16[0],
      setLoadingSubject = _useState16[1]; //课题 loading


  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    GetCategoryList().then(function (res) {
      console.log(res);
      setDataCate(res);
      setLoadingCate(false);
    });
    GetUsersList().then(function (res) {
      setDataUser(res);
      setLoadingUser(false);
    });
    GetProjectList().then(function (res) {
      setDataProject(res);
      setLoadingProject(false);
    });
    GetSubjectList().then(function (res) {
      setDataSubject(res);
      setLoadingSubject(false);
    });
  }, []);
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeLayout["a" /* MgeLayout */], null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Breadcrumb["a" /* Breadcrumb */], {
    items: [Breadcrumb["a" /* Breadcrumb */].MGED, Breadcrumb["a" /* Breadcrumb */].SystemManage]
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'sys_body',
    style: {
      margin: '2vh auto',
      background: '#fff',
      width: '90%'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(collapse_default.a, {
    defaultActiveKey: [],
    key: 'manage'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Panel, {
    header: Object(Text["a" /* TEXT */])('manage:user_mgmt', '用户管理'),
    key: "user"
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UserListViewer_UserListViewer // data={User.data.results}
  // loading={!loadingUser}
  , {
    // data={User.data.results}
    // loading={!loadingUser}
    data: dataUser.results,
    loading: loadingUser
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Panel, {
    header: Object(Text["a" /* TEXT */])('manage:material_category', '材料分类管理'),
    key: "category"
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CategoryListViewer_CategoryListViewer, {
    total: dataCate.total,
    pageSize: dataCate.page_size,
    page: dataCate.page,
    data: dataCate.results,
    loading: loadingCate
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Panel, {
    header: Object(Text["a" /* TEXT */])('manage:material_project', '材料项目管理'),
    key: "project"
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ProjectListViewer_ProjectListViewer, {
    total: dataProject.total,
    pageSize: dataProject.page_size,
    page: dataProject.page,
    data: dataProject.results,
    loading: loadingProject,
    user: dataUser.results
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Panel, {
    header: Object(Text["a" /* TEXT */])('manage:material_subject', '材料课题管理'),
    key: "subject"
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubjectListViewer_SubjectListViewer, {
    total: dataSubject.total,
    pageSize: dataSubject.page_size,
    page: dataSubject.page,
    data: dataSubject.results,
    projects: dataProject.results,
    loading: loadingSubject,
    user: dataUser.results
  }))))));
};

react_domfrom_dll_reference_dll_library_default.a.render( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(systemManage_SystemManagement, null), document.getElementById('wrap'));

/***/ }),

/***/ 59:
/***/ (function(module, exports) {

module.exports = dll_library;

/***/ }),

/***/ 658:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PatchPermission; });
/* harmony import */ var _define_User__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31);
/* harmony import */ var _Fetch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _Urls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }




function PatchPermission(_x, _x2, _x3, _x4) {
  return _PatchPermission.apply(this, arguments);
}

function _PatchPermission() {
  _PatchPermission = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userID, newRoles, categories, ticketID) {
    var num;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (typeof newRoles !== 'number') {
              num = Object(_define_User__WEBPACK_IMPORTED_MODULE_0__[/* RolesToBitwiseNumber */ "c"])(newRoles);
            } else {
              num = newRoles;
            }

            return _context.abrupt("return", Object(_Fetch__WEBPACK_IMPORTED_MODULE_1__[/* default */ "k"])(_Urls__WEBPACK_IMPORTED_MODULE_2__[/* default */ "b"].api_v1_account.user_permissions(userID), 'PATCH', {
              roles: num,
              categories: categories,
              ticket: ticketID
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _PatchPermission.apply(this, arguments);
}

/***/ })

/******/ });