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
/******/ 		28: 0
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
/******/ 	deferredModules.push([1687,0]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 116:
/***/ (function(module, exports) {

module.exports = window.django;

/***/ }),

/***/ 1687:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85);
__webpack_require__(86);
__webpack_require__(87);
module.exports = __webpack_require__(1688);


/***/ }),

/***/ 1688:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var antd_lib_button_style__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(32);
/* harmony import */ var antd_lib_button_style__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(antd_lib_button_style__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var antd_lib_button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var antd_lib_button__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(antd_lib_button__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var antd_lib_checkbox_style__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(129);
/* harmony import */ var antd_lib_checkbox_style__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(antd_lib_checkbox_style__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var antd_lib_checkbox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(50);
/* harmony import */ var antd_lib_checkbox__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(antd_lib_checkbox__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(0);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(11);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var django__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(116);
/* harmony import */ var django__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(django__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _apis_Urls__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(4);
/* harmony import */ var _utils_global__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(214);
/* harmony import */ var _login_scss__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(803);
/* harmony import */ var _login_scss__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_login_scss__WEBPACK_IMPORTED_MODULE_9__);
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




 // import { Checkbox } from '../components/Checkbox';

 // const logo2 = require('../img/logo2.png');

var logo2 = __webpack_require__(695); // 两个页面共用一套样式表



Object(_utils_global__WEBPACK_IMPORTED_MODULE_8__[/* GlobalInit */ "a"])();

var SignupApp = /*#__PURE__*/function (_Component) {
  _inherits(SignupApp, _Component);

  var _super = _createSuper(SignupApp);

  function SignupApp(props) {
    var _this;

    _classCallCheck(this, SignupApp);

    _this = _super.call(this, props);
    _this.state = {
      username: '',
      password: '',
      passwordConfirm: '',
      email: '',
      realName: '',
      org: '',
      agreeTermsOfUse: false,
      showError: false,
      errorText: '',
      requesting: false
    };
    _this.handleUsernameChange = _this.handleUsernameChange.bind(_assertThisInitialized(_this));
    _this.handlePasswordChange = _this.handlePasswordChange.bind(_assertThisInitialized(_this));
    _this.handleConfirmChange = _this.handleConfirmChange.bind(_assertThisInitialized(_this));
    _this.handleEmailChange = _this.handleEmailChange.bind(_assertThisInitialized(_this));
    _this.handleRealNameChange = _this.handleRealNameChange.bind(_assertThisInitialized(_this));
    _this.handleOrgChange = _this.handleOrgChange.bind(_assertThisInitialized(_this));
    _this.handleCheckboxChange = _this.handleCheckboxChange.bind(_assertThisInitialized(_this));
    _this.handleButtonClick = _this.handleButtonClick.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(SignupApp, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("div", {
        className: "flex-center full-vh"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("div", {
        className: "flex-center card-wrapper"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("div", {
        className: "card"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("a", {
        href: _apis_Urls__WEBPACK_IMPORTED_MODULE_7__[/* default */ "b"].site_index
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("img", {
        className: "logo",
        src: logo2,
        style: {
          width: '200px',
          height: 'auto'
        }
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("ul", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("li", {
        className: "active"
      }, Object(django__WEBPACK_IMPORTED_MODULE_6__["gettext"])('Signup'))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("div", {
        className: "login-form",
        style: {
          minWidth: '320px'
        }
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("p", {
        className: this.state.showError ? 'error-info show' : 'error-info'
      }, this.state.errorText), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("input", {
        type: "text",
        value: this.state.username,
        onChange: this.handleUsernameChange,
        placeholder: Object(django__WEBPACK_IMPORTED_MODULE_6__["gettext"])('Username')
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("input", {
        type: "password",
        value: this.state.password,
        onChange: this.handlePasswordChange,
        placeholder: Object(django__WEBPACK_IMPORTED_MODULE_6__["gettext"])('Password')
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("input", {
        type: "password",
        value: this.state.passwordConfirm,
        onChange: this.handleConfirmChange,
        placeholder: Object(django__WEBPACK_IMPORTED_MODULE_6__["gettext"])('Confirm password')
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("input", {
        type: "text",
        value: this.state.email,
        onChange: this.handleEmailChange,
        placeholder: Object(django__WEBPACK_IMPORTED_MODULE_6__["gettext"])('Email Address')
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("input", {
        type: "text",
        value: this.state.realName,
        onChange: this.handleRealNameChange,
        placeholder: Object(django__WEBPACK_IMPORTED_MODULE_6__["gettext"])('Real Name')
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("input", {
        type: "text",
        value: this.state.org,
        onChange: this.handleOrgChange,
        placeholder: Object(django__WEBPACK_IMPORTED_MODULE_6__["gettext"])('Institution')
      })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement("div", {
        className: "remember-wrapper"
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(antd_lib_checkbox__WEBPACK_IMPORTED_MODULE_3___default.a, {
        onChange: this.handleCheckboxChange,
        checked: this.state.agreeTermsOfUse
      }, Object(django__WEBPACK_IMPORTED_MODULE_6__["gettext"])('I have read and agree to the Terms of Use')))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(antd_lib_button__WEBPACK_IMPORTED_MODULE_1___default.a, {
        disabled: !this.state.agreeTermsOfUse,
        type: "primary",
        size: "large",
        loading: this.state.requesting,
        onClick: this.handleButtonClick
      }, Object(django__WEBPACK_IMPORTED_MODULE_6__["gettext"])('Signup')))));
    }
  }, {
    key: "handleCheckboxChange",
    value: function handleCheckboxChange(event) {
      this.setState({
        agreeTermsOfUse: event.target.checked
      });
    }
  }, {
    key: "handleUsernameChange",
    value: function handleUsernameChange(event) {
      this.setState({
        username: event.target.value
      });
    }
  }, {
    key: "handlePasswordChange",
    value: function handlePasswordChange(event) {
      this.setState({
        password: event.target.value
      });
    }
  }, {
    key: "handleConfirmChange",
    value: function handleConfirmChange(event) {
      this.setState({
        passwordConfirm: event.target.value
      });
    }
  }, {
    key: "handleEmailChange",
    value: function handleEmailChange(event) {
      this.setState({
        email: event.target.value
      });
    }
  }, {
    key: "handleRealNameChange",
    value: function handleRealNameChange(event) {
      this.setState({
        realName: event.target.value
      });
    }
  }, {
    key: "handleOrgChange",
    value: function handleOrgChange(event) {
      this.setState({
        org: event.target.value
      });
    }
  }, {
    key: "checkForm",
    value: function checkForm() {
      if (this.state.username.length === 0) return {
        result: true,
        text: Object(django__WEBPACK_IMPORTED_MODULE_6__["gettext"])('Username cannot be empty')
      };
      if (this.state.password.length === 0) return {
        result: true,
        text: Object(django__WEBPACK_IMPORTED_MODULE_6__["gettext"])('Password cannot be empty')
      };
      if (this.state.passwordConfirm !== this.state.password) return {
        result: true,
        text: Object(django__WEBPACK_IMPORTED_MODULE_6__["gettext"])('Confirm password not match')
      };
      if (this.state.email.length === 0) return {
        result: true,
        text: Object(django__WEBPACK_IMPORTED_MODULE_6__["gettext"])('Email address cannnot be empty')
      };
      if (this.state.realName.length === 0) return {
        result: true,
        text: Object(django__WEBPACK_IMPORTED_MODULE_6__["gettext"])('Real name is required')
      };
      if (this.state.org.length === 0) return {
        result: true,
        text: Object(django__WEBPACK_IMPORTED_MODULE_6__["gettext"])('Institution is required')
      };
      return {
        result: false
      };
    }
  }, {
    key: "handleButtonClick",
    value: function handleButtonClick() {
      var _this2 = this;

      var ret = this.checkForm();

      if (!ret.result) {
        this.setState({
          requesting: true
        });
        fetch(_apis_Urls__WEBPACK_IMPORTED_MODULE_7__[/* default */ "b"].api_v1_account.user_list, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            username: this.state.username,
            password: this.state.password,
            email: this.state.email,
            real_name: this.state.realName,
            institution: this.state.org
          })
        }).then(function (res) {
          if (res.ok) {
            window.location.href = '/account/login_mge/'; // window.location.href = Urls.account.login;
            // window.location.href = Urls.account.login_18;
          } else {
            res.json().then(function (data) {
              _this2.setState({
                requesting: false,
                showError: true,
                errorText: data.msg
              });
            });
          }
        })["catch"](function (reason) {
          console.log({
            reason: reason
          });

          _this2.setState({
            requesting: false,
            showError: true,
            errorText: Object(django__WEBPACK_IMPORTED_MODULE_6__["gettext"])('Please try again later or contact admin.')
          });
        });
      } else {
        this.setState({
          showError: true,
          errorText: ret.text
        });
      }
    }
  }]);

  return SignupApp;
}(react__WEBPACK_IMPORTED_MODULE_4__["Component"]);

react_dom__WEBPACK_IMPORTED_MODULE_5___default.a.render( /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_4___default.a.createElement(SignupApp, null), document.getElementById('wrap'));

/***/ }),

/***/ 178:
/***/ (function(module, exports) {

module.exports = window.jQuery;

/***/ }),

/***/ 59:
/***/ (function(module, exports) {

module.exports = dll_library;

/***/ }),

/***/ 803:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

/******/ });