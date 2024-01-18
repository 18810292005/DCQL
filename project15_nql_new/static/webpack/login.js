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
/******/ 		20: 0
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
/******/ 	deferredModules.push([1686,0]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 116:
/***/ (function(module, exports) {

module.exports = window.django;

/***/ }),

/***/ 1686:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85);
__webpack_require__(86);
__webpack_require__(87);
module.exports = __webpack_require__(1856);


/***/ }),

/***/ 178:
/***/ (function(module, exports) {

module.exports = window.jQuery;

/***/ }),

/***/ 1856:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/style/index.js
var style = __webpack_require__(32);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/index.js
var lib_button = __webpack_require__(5);
var button_default = /*#__PURE__*/__webpack_require__.n(lib_button);

// EXTERNAL MODULE: ./node_modules/antd/lib/checkbox/style/index.js
var checkbox_style = __webpack_require__(129);

// EXTERNAL MODULE: ./node_modules/antd/lib/checkbox/index.js
var lib_checkbox = __webpack_require__(50);
var checkbox_default = /*#__PURE__*/__webpack_require__.n(lib_checkbox);

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(16);

// EXTERNAL MODULE: delegated ./node_modules/react/index.js from dll-reference dll_library
var reactfrom_dll_reference_dll_library = __webpack_require__(0);
var reactfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(reactfrom_dll_reference_dll_library);

// EXTERNAL MODULE: delegated ./node_modules/react-dom/index.js from dll-reference dll_library
var react_domfrom_dll_reference_dll_library = __webpack_require__(11);
var react_domfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(react_domfrom_dll_reference_dll_library);

// EXTERNAL MODULE: ./node_modules/core-decorators/es/core-decorators.js + 19 modules
var core_decorators = __webpack_require__(17);

// EXTERNAL MODULE: external "window.django"
var external_window_django_ = __webpack_require__(116);

// EXTERNAL MODULE: ./apis/Urls.ts
var Urls = __webpack_require__(4);

// CONCATENATED MODULE: ./apis/session/GenerateCaptchaURL.ts

function GenerateCaptchaUrl() {
  return "".concat(Urls["b" /* default */].api_v1_account.get_captcha, "?r=").concat(Math.random());
}
// EXTERNAL MODULE: ./utils/global.ts
var global = __webpack_require__(214);

// EXTERNAL MODULE: ./entry/login.scss
var login = __webpack_require__(803);

// CONCATENATED MODULE: ./entry/login.tsx
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







 // const logo2 = require('../img/logo2.png');

var logo2 = __webpack_require__(695); // import { Checkbox } from '../components/Checkbox';




Object(global["a" /* GlobalInit */])();

function GetURLParam(name) {
  var url = window.location;
  var regex = new RegExp("(^|&)".concat(name, "=([^&]*)(&|$)"));
  var matchArray = url.search.substr(1).match(regex);

  if (matchArray !== null) {
    // 不确定是否有必要unesacpe
    return unescape(matchArray[2]);
  } else {
    return null;
  }
}

var login_LoginApp = /*#__PURE__*/function (_React$Component) {
  _inherits(LoginApp, _React$Component);

  var _super = _createSuper(LoginApp);

  function LoginApp(props) {
    var _this;

    _classCallCheck(this, LoginApp);

    _this = _super.call(this, props);
    _this.state = {
      rememberMe: false,
      showError: false,
      errorText: '',
      username: '',
      password: '',
      captcha: '',
      requesting: false,
      captchaUrl: GenerateCaptchaUrl()
    };
    return _this;
  }

  _createClass(LoginApp, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'flex-center full-vh'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'flex-center card-wrapper'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'card'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: Urls["b" /* default */].site_index
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        className: 'logo',
        src: logo2,
        style: {
          width: '200px',
          height: 'auto'
        }
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("ul", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("li", {
        className: 'active'
      }, "Login")), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'login-form'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", {
        className: this.state.showError ? 'error-info show' : 'error-info'
      }, this.state.errorText), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("input", {
        type: 'text',
        value: this.state.username,
        onChange: this.onUsernameChange,
        // placeholder={_('Username or email')} />
        placeholder: 'Username or email'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("input", {
        type: 'password',
        value: this.state.password,
        onChange: this.onPasswordChange,
        // placeholder={_('Password')} />
        placeholder: 'Password'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'captcha-group'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("input", {
        type: 'text',
        value: this.state.captcha,
        onChange: this.onCaptchaChagne,
        // placeholder={_('Captcha')} />
        placeholder: 'Captcha'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: this.state.captchaUrl,
        onClick: this.onCaptchaImageClick
      }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'remember-wrapper'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(checkbox_default.a, {
        onChange: this.handleCheckboxChange,
        // checked={this.state.rememberMe}>{_('Remember me')}</Checkbox>
        checked: this.state.rememberMe
      }, 'Remember me')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'register-wrapper'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("ul", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("li", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: Urls["b" /* default */].account.reset_request
      }, 'Forgot your password?')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("li", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: Urls["b" /* default */].account.register
      }, 'Signup'))))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        loading: this.state.requesting,
        type: 'primary',
        size: 'large',
        href: 'javascript:void(0)',
        onClick: this.onButtonClick
      }, 'Login'))));
    }
  }, {
    key: "onButtonClick",
    value: function onButtonClick() {
      var _this2 = this;

      if (this.state.username.length === 0) {
        this.setState({
          showError: true,
          errorText: Object(external_window_django_["gettext"])('Username cannot be empty')
        });
        return;
      } else if (this.state.password.length === 0) {
        this.setState({
          showError: true,
          errorText: Object(external_window_django_["gettext"])('Password cannot be empty')
        });
        return;
      } else if (this.state.captcha.length === 0) {
        this.setState({
          showError: true,
          errorText: Object(external_window_django_["gettext"])('Captcha cannot be empty')
        });
        return;
      }

      this.setState({
        requesting: true,
        showError: false
      });
      fetch(Urls["b" /* default */].api_v1_account.session_api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          user: this.state.username,
          password: this.state.password,
          remember: this.state.rememberMe,
          captcha_response: this.state.captcha
        })
      }).then(function (res) {
        if (res.ok) {
          var next = GetURLParam('next'); // 防止开放重定向攻击

          if (next && next.startsWith('/')) {
            window.location.href = next;
          } else {
            window.location.href = Urls["b" /* default */].site_index;
          }

          return;
        } else {
          // 不OK的情况下是数据内容的错误
          res.json().then(function (data) {
            _this2.setState({
              requesting: false,
              showError: true,
              errorText: data.msg,
              captchaUrl: GenerateCaptchaUrl()
            });
          });
        }
      })["catch"](function (reason) {
        // 这里是网络错误
        _this2.setState({
          requesting: false,
          showError: true,
          errorText: Object(external_window_django_["gettext"])('Please try again later or contact admin.'),
          captchaUrl: GenerateCaptchaUrl()
        });
      });
    }
  }, {
    key: "handleCheckboxChange",
    value: function handleCheckboxChange(event) {
      this.setState({
        rememberMe: event.target.checked
      });
    }
  }, {
    key: "onUsernameChange",
    value: function onUsernameChange(event) {
      this.setState({
        username: event.target.value
      });
    }
  }, {
    key: "onPasswordChange",
    value: function onPasswordChange(event) {
      this.setState({
        password: event.target.value
      });
    }
  }, {
    key: "onCaptchaChagne",
    value: function onCaptchaChagne(event) {
      this.setState({
        captcha: event.target.value
      });
    }
  }, {
    key: "onCaptchaImageClick",
    value: function onCaptchaImageClick(event) {
      this.setState({
        captchaUrl: GenerateCaptchaUrl()
      });
    }
  }]);

  return LoginApp;
}(reactfrom_dll_reference_dll_library_default.a.Component);

Object(tslib_es6["a" /* __decorate */])([core_decorators["a" /* autobind */]], login_LoginApp.prototype, "onButtonClick", null);

Object(tslib_es6["a" /* __decorate */])([core_decorators["a" /* autobind */]], login_LoginApp.prototype, "handleCheckboxChange", null);

Object(tslib_es6["a" /* __decorate */])([core_decorators["a" /* autobind */]], login_LoginApp.prototype, "onUsernameChange", null);

Object(tslib_es6["a" /* __decorate */])([core_decorators["a" /* autobind */]], login_LoginApp.prototype, "onPasswordChange", null);

Object(tslib_es6["a" /* __decorate */])([core_decorators["a" /* autobind */]], login_LoginApp.prototype, "onCaptchaChagne", null);

Object(tslib_es6["a" /* __decorate */])([core_decorators["a" /* autobind */]], login_LoginApp.prototype, "onCaptchaImageClick", null);

react_domfrom_dll_reference_dll_library_default.a.render( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(login_LoginApp, null), document.getElementById('wrap'));

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