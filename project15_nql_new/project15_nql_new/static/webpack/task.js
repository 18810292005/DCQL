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
/******/ 		31: 0
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
/******/ 	deferredModules.push([1642,0]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 1642:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85);
__webpack_require__(86);
__webpack_require__(87);
module.exports = __webpack_require__(1844);


/***/ }),

/***/ 1844:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/antd/lib/radio/style/index.js
var style = __webpack_require__(117);

// EXTERNAL MODULE: ./node_modules/antd/lib/radio/index.js
var lib_radio = __webpack_require__(25);
var radio_default = /*#__PURE__*/__webpack_require__.n(lib_radio);

// EXTERNAL MODULE: ./node_modules/antd/lib/card/style/index.js
var card_style = __webpack_require__(212);

// EXTERNAL MODULE: ./node_modules/antd/lib/card/index.js
var card = __webpack_require__(106);
var card_default = /*#__PURE__*/__webpack_require__.n(card);

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

// EXTERNAL MODULE: delegated ./node_modules/react-router/esm/react-router.js from dll-reference dll_library
var react_routerfrom_dll_reference_dll_library = __webpack_require__(107);

// EXTERNAL MODULE: delegated ./node_modules/react-router-dom/esm/react-router-dom.js from dll-reference dll_library
var react_router_domfrom_dll_reference_dll_library = __webpack_require__(30);

// EXTERNAL MODULE: ./apis/define/ReviewState.ts
var ReviewState = __webpack_require__(34);

// EXTERNAL MODULE: ./components/layout/Breadcrumb.tsx
var Breadcrumb = __webpack_require__(27);

// EXTERNAL MODULE: ./components/layout/MgeLayout.tsx + 7 modules
var MgeLayout = __webpack_require__(48);

// EXTERNAL MODULE: ./locale/Text.tsx
var Text = __webpack_require__(3);

// EXTERNAL MODULE: ./node_modules/antd/lib/divider/style/index.js
var divider_style = __webpack_require__(144);

// EXTERNAL MODULE: ./node_modules/antd/lib/divider/index.js
var divider = __webpack_require__(43);
var divider_default = /*#__PURE__*/__webpack_require__.n(divider);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/style/index.js
var button_style = __webpack_require__(32);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/index.js
var lib_button = __webpack_require__(5);
var button_default = /*#__PURE__*/__webpack_require__.n(lib_button);

// EXTERNAL MODULE: ./node_modules/antd/lib/popconfirm/style/index.js
var popconfirm_style = __webpack_require__(226);

// EXTERNAL MODULE: ./node_modules/antd/lib/popconfirm/index.js
var popconfirm = __webpack_require__(134);
var popconfirm_default = /*#__PURE__*/__webpack_require__.n(popconfirm);

// EXTERNAL MODULE: ./node_modules/antd/lib/table/style/index.js
var table_style = __webpack_require__(100);

// EXTERNAL MODULE: ./node_modules/antd/lib/table/index.js
var table = __webpack_require__(37);
var table_default = /*#__PURE__*/__webpack_require__.n(table);

// EXTERNAL MODULE: ./apis/Urls.ts
var Urls = __webpack_require__(4);

// EXTERNAL MODULE: ./apis/Fetch.ts
var Fetch = __webpack_require__(7);

// CONCATENATED MODULE: ./apis/task/Delete.ts

 // 删除任务

function DeleteTask(id) {
  var url = Urls["b" /* default */].api_v1_task.one_task(id);
  return Object(Fetch["a" /* JsonApiFetch */])(url, 'DELETE');
}
;
// CONCATENATED MODULE: ./apis/task/Patch.ts

 // 修改任务

function PendingTask(id) {
  var url = Urls["b" /* default */].api_v1_task.one_task(id);
  var data = {
    state: "PENDING"
  };
  return Object(Fetch["a" /* JsonApiFetch */])(url, 'PATCH', data);
}
; // 取消任务

function CancelTask(id) {
  var url = Urls["b" /* default */].api_v1_task.one_task(id);
  var data = {
    state: "REVOKED"
  };
  return Object(Fetch["a" /* JsonApiFetch */])(url, 'PATCH', data);
}
;
// CONCATENATED MODULE: ./apis/task/Get.ts


function GetTaskList(state, page, pagesize) {
  var url = Urls["b" /* default */].api_v1_task.task_list;
  return Object(Fetch["e" /* RestApiFetch */])(url + '?state=' + state + '&page=' + page + '&page_size=' + pagesize);
}
function TaskImportVerify(id) {
  var url = Urls["b" /* default */].api_v1_task.task_importVerify(id);
  return Object(Fetch["e" /* RestApiFetch */])(url, 'POST');
}
// CONCATENATED MODULE: ./components/task/TaskViewer.tsx











function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }







var Column = table_default.a.Column;

var TaskViewer_TaskViewer = function _TaskViewer(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = _slicedToArray(_useState, 2),
      dataSource = _useState2[0],
      setDataSource = _useState2[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setDataSource(props.data);
  }, [props.data]);

  var handleTableChange = function handleTableChange(pagination) {
    props.onPageChange(pagination.current);
  };

  var state2CN = function state2CN(state) {
    if (state === 'RUNNING') return Object(Text["a" /* TEXT */])('dash:running', '正在运行');else if (state === 'PENDING') return Object(Text["a" /* TEXT */])('dash:pending', '等待运行');else if (state === 'SUCCESS') return Object(Text["a" /* TEXT */])('dash:success', '成功');else if (state === 'FAILURE') return Object(Text["a" /* TEXT */])('dash:failed', '失败');else if (state === 'REVOKED' || state === 'CANCELED') return Object(Text["a" /* TEXT */])('dash:cancelled', '已取消');else if (state === 'DELETED') return Object(Text["a" /* TEXT */])('dash:deleted', '已删除');else return '';
  };

  var handleDeleteTask = function handleDeleteTask(taskid) {
    DeleteTask(taskid).then(function (res) {
      notification_default.a.success({
        message: '操作成功'
      });

      setTimeout(function () {
        location.reload();
      }, 1000);
    })["catch"](function (reason) {
      notification_default.a.error({
        message: reason.message
      });
    });
  };

  var handlePendingTask = function handlePendingTask(taskid) {
    PendingTask(taskid).then(function (res) {
      notification_default.a.success({
        message: '操作成功'
      });

      setTimeout(function () {
        location.reload();
      }, 1000);
    })["catch"](function (reason) {
      notification_default.a.error({
        message: reason.message
      });
    });
  };

  var handleRevokeTask = function handleRevokeTask(taskid) {
    CancelTask(taskid).then(function (res) {
      location.reload();
    })["catch"](function (reason) {
      notification_default.a.error({
        message: reason.message
      });
    });
  };

  var handleImportVerify = function handleImportVerify(taskid) {
    TaskImportVerify(taskid).then(function (res) {
      notification_default.a.success({
        message: '成功'
      });
    })["catch"](function (reason) {
      notification_default.a.error({
        message: reason.message
      });
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    onChange: handleTableChange,
    rowKey: 'id',
    dataSource: dataSource,
    loading: props.loading,
    pagination: {
      total: props.total,
      pageSize: props.page_size,
      current: props.page
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:type', '任务类型'),
    dataIndex: 'task_type',
    key: 'task_type'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:time', '创建时间'),
    dataIndex: 'created_at',
    key: 'created_at'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:uploaded_via', '状态'),
    dataIndex: 'state',
    key: 'state',
    render: function render(text, record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, state2CN(record.state));
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:reviewer', '结果'),
    dataIndex: 'result',
    key: 'result',
    render: function render(text, record) {
      if (record.state === 'FAILURE') {
        if (record.exception === 'Internal server error') {
          return '系统繁忙，请联系管理员';
        } else {
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, record.exception);
        }
      } else if (record.state === 'RUNNING') {
        if (record.task_type === '开具汇交证明') {
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, "\u6B63\u5728\u8FD0\u884C");
        } else {
          var p = (record.progress * 100).toFixed(1);
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, p, "%");
        }
      } else if (record.state === 'REVOKED' || record.state === 'CANCELED') {
        return '已取消';
      } else if (record.state === 'DELETED') {
        return '已删除';
      } else if (record.state === 'PENDING') {
        return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, record.waiting_count);
      } else {
        if (record.task_type === '数据导出' || record.task_type === '汇交验收数据检查') {
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
            href: record.result.url
          }, Object(Text["a" /* TEXT */])('dash:show_task', '点击下载'), " ");
        } else if (record.task_type === '数据汇交' || record.task_type === '数据集撤回') {
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, record.result.data_count, "\u6761\u6570\u636E");
        } else if (record.task_type === '数据集审核撤回') {
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, "\u4E0A\u4F20\u4EBA\uFF1A", record.result.upload_user);
        } else if (record.task_type === '开具汇交证明') {
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
            href: '/cert/' + record.result
          }, Object(Text["a" /* TEXT */])('dash:show_task', '点击查看汇交证明'), " ");
        } else if (record.task_type === '数据校验') {
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
            onClick: function onClick() {
              handleImportVerify(record.id);
            }
          }, "  ", Object(Text["a" /* TEXT */])('dash:task_importVerify', '点击进行数据导入'), " ");
        } else {
          return null;
        }
      }
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:action', '操作'),
    render: function render(text, record) {
      var btn_delete = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(popconfirm_default.a, {
        title: '确定删除？',
        okText: "\u786E\u5B9A",
        cancelText: "\u53D6\u6D88",
        onConfirm: function onConfirm() {
          handleDeleteTask(record.id);
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        type: 'danger'
      }, Object(Text["a" /* TEXT */])('dash:delete_task', '删除')));
      var btn_revoke = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(popconfirm_default.a, {
        title: '确定取消？',
        okText: "\u786E\u5B9A",
        cancelText: "\u53D6\u6D88",
        onConfirm: function onConfirm() {
          handleRevokeTask(record.id);
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        type: 'primary'
      }, Object(Text["a" /* TEXT */])('dash:revoke_task', '取消')));
      var btn_pending = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        type: 'primary',
        onClick: function onClick() {
          handlePendingTask(record.id);
        }
      }, Object(Text["a" /* TEXT */])('dash:pending_task', '重试'));
      if (record.state === 'FAILURE' || record.state === 'REVOKED') return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, btn_pending, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
        type: 'vertical'
      }), btn_delete);else if (record.state === 'RUNNING' || record.state === 'PENDING') return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, btn_revoke);else return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, btn_delete);
    }
  })));
};

var TaskViewer = Object(react_routerfrom_dll_reference_dll_library["withRouter"])(TaskViewer_TaskViewer);
// CONCATENATED MODULE: ./entry/task.tsx
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

function task_slicedToArray(arr, i) { return task_arrayWithHoles(arr) || task_iterableToArrayLimit(arr, i) || task_unsupportedIterableToArray(arr, i) || task_nonIterableRest(); }

function task_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function task_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return task_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return task_arrayLikeToArray(o, minLen); }

function task_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function task_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function task_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }












var breadcrumbItems = {
  title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'user:history',
    defaultMessage: "\u6211\u7684\u4EFB\u52A1"
  })
};

function PathnameToReviewState(pathname) {
  if (pathname.startsWith('/running')) {
    return ReviewState["a" /* ReviewState */].Running;
  } else if (pathname.startsWith('/success')) {
    return ReviewState["a" /* ReviewState */].Success;
  } else if (pathname.startsWith('/revoked')) {
    return ReviewState["a" /* ReviewState */].Revoked;
  } else if (pathname.startsWith('/failed')) {
    return ReviewState["a" /* ReviewState */].Failed;
  } else {
    return ReviewState["a" /* ReviewState */].All;
  }
}

var task_MyTask = function _MyTask(props) {
  var currentState = PathnameToReviewState(props.location.pathname);

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState2 = task_slicedToArray(_useState, 2),
      total = _useState2[0],
      setTotal = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(5),
      _useState4 = task_slicedToArray(_useState3, 2),
      pageSize = _useState4[0],
      setPageSize = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(1),
      _useState6 = task_slicedToArray(_useState5, 2),
      currentPage = _useState6[0],
      setCurrentPage = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState8 = task_slicedToArray(_useState7, 2),
      loading = _useState8[0],
      setLoading = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState10 = task_slicedToArray(_useState9, 2),
      dataSource = _useState10[0],
      setDataSource = _useState10[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setLoading(true);
    GetTaskList(currentState, currentPage, pageSize).then(function (res) {
      setLoading(false);
      setCurrentPage(res.data.current_page);
      setTotal(res.data.page_count);
      setDataSource(res.data.tasks);
    })["catch"](function (reason) {
      setLoading(false);

      notification_default.a.error({
        message: reason.message
      });
    });
  }, [props.location.pathname]);

  var handlePageChange = function handlePageChange(newPage) {
    setLoading(true);
    GetTaskList(currentState, newPage, pageSize).then(function (res) {
      setLoading(false);
      setCurrentPage(res.data.current_page);
      setTotal(res.data.page_count);
      setDataSource(res.data.tasks);
    })["catch"](function (reason) {
      setLoading(false);

      notification_default.a.error({
        message: reason.message
      });
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeLayout["a" /* MgeLayout */], {
    loginRequired: true
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Breadcrumb["a" /* Breadcrumb */], {
    items: [Breadcrumb["a" /* Breadcrumb */].MGED, Breadcrumb["a" /* Breadcrumb */].MDB, breadcrumbItems]
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(card_default.a, {
    style: {
      textAlign: 'center',
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
    value: ReviewState["a" /* ReviewState */].Running,
    onClick: function onClick() {
      return props.history.push('/running');
    }
  }, Object(Text["a" /* TEXT */])('dash:running', '正在运行')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].Success,
    onClick: function onClick() {
      return props.history.push('/success');
    }
  }, Object(Text["a" /* TEXT */])('dash:success', '成功')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].Failed,
    onClick: function onClick() {
      return props.history.push('/failed');
    }
  }, Object(Text["a" /* TEXT */])('dash:failed', '失败')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].Revoked,
    onClick: function onClick() {
      return props.history.push('/revoked');
    }
  }, Object(Text["a" /* TEXT */])('dash:revoked', '已取消')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].All,
    onClick: function onClick() {
      return props.history.push('/');
    }
  }, Object(Text["a" /* TEXT */])('dash:show_all', '全部'))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TaskViewer, {
    page: currentPage,
    page_size: pageSize,
    data: dataSource,
    total: total,
    loading: loading,
    onPageChange: handlePageChange
  })));
};

var My_Task = Object(react_routerfrom_dll_reference_dll_library["withRouter"])(task_MyTask);

var entry_task_MyTask = /*#__PURE__*/function (_Component) {
  _inherits(MyTask, _Component);

  var _super = _createSuper(MyTask);

  function MyTask() {
    _classCallCheck(this, MyTask);

    return _super.apply(this, arguments);
  }

  _createClass(MyTask, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["HashRouter"], null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
        path: '/',
        exact: true,
        component: My_Task
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
        path: '/running',
        exact: true,
        component: My_Task
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
        path: '/success',
        exact: true,
        component: My_Task
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
        path: '/failed',
        exact: true,
        component: My_Task
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
        path: '/revoked',
        exact: true,
        component: My_Task
      }));
    }
  }]);

  return MyTask;
}(reactfrom_dll_reference_dll_library["Component"]);

react_domfrom_dll_reference_dll_library_default.a.render( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(entry_task_MyTask, null), document.getElementById('wrap'));

/***/ }),

/***/ 59:
/***/ (function(module, exports) {

module.exports = dll_library;

/***/ })

/******/ });