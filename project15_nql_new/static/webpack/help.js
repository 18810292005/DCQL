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
/******/ 		18: 0
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
/******/ 	deferredModules.push([1732,0]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 1732:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85);
__webpack_require__(86);
__webpack_require__(87);
module.exports = __webpack_require__(1858);


/***/ }),

/***/ 1733:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(55);

__webpack_require__(1734);

__webpack_require__(1735);
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 1734:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1735:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(55);

__webpack_require__(1736);
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 1736:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1737:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1738:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(__webpack_require__(0));

var ReactDOM = _interopRequireWildcard(__webpack_require__(11));

var PropTypes = _interopRequireWildcard(__webpack_require__(1));

var _classnames = _interopRequireDefault(__webpack_require__(8));

var _addEventListener = _interopRequireDefault(__webpack_require__(442));

var _affix = _interopRequireDefault(__webpack_require__(1739));

var _configProvider = __webpack_require__(39);

var _scrollTo = _interopRequireDefault(__webpack_require__(1046));

var _getScroll = _interopRequireDefault(__webpack_require__(1047));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function getDefaultContainer() {
  return window;
}

function getOffsetTop(element, container) {
  if (!element) {
    return 0;
  }

  if (!element.getClientRects().length) {
    return 0;
  }

  var rect = element.getBoundingClientRect();

  if (rect.width || rect.height) {
    if (container === window) {
      container = element.ownerDocument.documentElement;
      return rect.top - container.clientTop;
    }

    return rect.top - container.getBoundingClientRect().top;
  }

  return rect.top;
}

var sharpMatcherRegx = /#([^#]+)$/;

var Anchor =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Anchor, _React$Component);

  function Anchor() {
    var _this;

    _classCallCheck(this, Anchor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Anchor).apply(this, arguments));
    _this.state = {
      activeLink: null
    };
    _this.links = [];

    _this.handleScrollTo = function (link) {
      var _this$props = _this.props,
          offsetTop = _this$props.offsetTop,
          getContainer = _this$props.getContainer,
          targetOffset = _this$props.targetOffset;

      _this.setCurrentActiveLink(link);

      var container = getContainer();
      var scrollTop = (0, _getScroll["default"])(container, true);
      var sharpLinkMatch = sharpMatcherRegx.exec(link);

      if (!sharpLinkMatch) {
        return;
      }

      var targetElement = document.getElementById(sharpLinkMatch[1]);

      if (!targetElement) {
        return;
      }

      var eleOffsetTop = getOffsetTop(targetElement, container);
      var y = scrollTop + eleOffsetTop;
      y -= targetOffset !== undefined ? targetOffset : offsetTop || 0;
      _this.animating = true;
      (0, _scrollTo["default"])(y, {
        callback: function callback() {
          _this.animating = false;
        },
        getContainer: getContainer
      });
    };

    _this.saveInkNode = function (node) {
      _this.inkNode = node;
    };

    _this.setCurrentActiveLink = function (link) {
      var activeLink = _this.state.activeLink;
      var onChange = _this.props.onChange;

      if (activeLink !== link) {
        _this.setState({
          activeLink: link
        });

        if (onChange) {
          onChange(link);
        }
      }
    };

    _this.handleScroll = function () {
      if (_this.animating) {
        return;
      }

      var _this$props2 = _this.props,
          offsetTop = _this$props2.offsetTop,
          bounds = _this$props2.bounds,
          targetOffset = _this$props2.targetOffset;

      var currentActiveLink = _this.getCurrentAnchor(targetOffset !== undefined ? targetOffset : offsetTop || 0, bounds);

      _this.setCurrentActiveLink(currentActiveLink);
    };

    _this.updateInk = function () {
      if (typeof document === 'undefined') {
        return;
      }

      var _assertThisInitialize = _assertThisInitialized(_this),
          prefixCls = _assertThisInitialize.prefixCls;

      var anchorNode = ReactDOM.findDOMNode(_assertThisInitialized(_this));
      var linkNode = anchorNode.getElementsByClassName("".concat(prefixCls, "-link-title-active"))[0];

      if (linkNode) {
        _this.inkNode.style.top = "".concat(linkNode.offsetTop + linkNode.clientHeight / 2 - 4.5, "px");
      }
    };

    _this.renderAnchor = function (_ref) {
      var getPrefixCls = _ref.getPrefixCls;
      var _this$props3 = _this.props,
          customizePrefixCls = _this$props3.prefixCls,
          _this$props3$classNam = _this$props3.className,
          className = _this$props3$classNam === void 0 ? '' : _this$props3$classNam,
          style = _this$props3.style,
          offsetTop = _this$props3.offsetTop,
          affix = _this$props3.affix,
          showInkInFixed = _this$props3.showInkInFixed,
          children = _this$props3.children,
          getContainer = _this$props3.getContainer;
      var activeLink = _this.state.activeLink;
      var prefixCls = getPrefixCls('anchor', customizePrefixCls); // To support old version react.
      // Have to add prefixCls on the instance.
      // https://github.com/facebook/react/issues/12397

      _this.prefixCls = prefixCls;
      var inkClass = (0, _classnames["default"])("".concat(prefixCls, "-ink-ball"), {
        visible: activeLink
      });
      var wrapperClass = (0, _classnames["default"])(className, "".concat(prefixCls, "-wrapper"));
      var anchorClass = (0, _classnames["default"])(prefixCls, {
        fixed: !affix && !showInkInFixed
      });

      var wrapperStyle = _extends({
        maxHeight: offsetTop ? "calc(100vh - ".concat(offsetTop, "px)") : '100vh'
      }, style);

      var anchorContent = React.createElement("div", {
        className: wrapperClass,
        style: wrapperStyle
      }, React.createElement("div", {
        className: anchorClass
      }, React.createElement("div", {
        className: "".concat(prefixCls, "-ink")
      }, React.createElement("span", {
        className: inkClass,
        ref: _this.saveInkNode
      })), children));
      return !affix ? anchorContent : React.createElement(_affix["default"], {
        offsetTop: offsetTop,
        target: getContainer
      }, anchorContent);
    };

    return _this;
  }

  _createClass(Anchor, [{
    key: "getChildContext",
    value: function getChildContext() {
      var _this2 = this;

      var antAnchor = {
        registerLink: function registerLink(link) {
          if (!_this2.links.includes(link)) {
            _this2.links.push(link);
          }
        },
        unregisterLink: function unregisterLink(link) {
          var index = _this2.links.indexOf(link);

          if (index !== -1) {
            _this2.links.splice(index, 1);
          }
        },
        activeLink: this.state.activeLink,
        scrollTo: this.handleScrollTo,
        onClick: this.props.onClick
      };
      return {
        antAnchor: antAnchor
      };
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var getContainer = this.props.getContainer;
      this.scrollContainer = getContainer();
      this.scrollEvent = (0, _addEventListener["default"])(this.scrollContainer, 'scroll', this.handleScroll);
      this.handleScroll();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.scrollEvent) {
        var getContainer = this.props.getContainer;
        var currentContainer = getContainer();

        if (this.scrollContainer !== currentContainer) {
          this.scrollContainer = currentContainer;
          this.scrollEvent.remove();
          this.scrollEvent = (0, _addEventListener["default"])(this.scrollContainer, 'scroll', this.handleScroll);
          this.handleScroll();
        }
      }

      this.updateInk();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.scrollEvent) {
        this.scrollEvent.remove();
      }
    }
  }, {
    key: "getCurrentAnchor",
    value: function getCurrentAnchor() {
      var offsetTop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var bounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
      var getCurrentAnchor = this.props.getCurrentAnchor;

      if (typeof getCurrentAnchor === 'function') {
        return getCurrentAnchor();
      }

      var activeLink = '';

      if (typeof document === 'undefined') {
        return activeLink;
      }

      var linkSections = [];
      var getContainer = this.props.getContainer;
      var container = getContainer();
      this.links.forEach(function (link) {
        var sharpLinkMatch = sharpMatcherRegx.exec(link.toString());

        if (!sharpLinkMatch) {
          return;
        }

        var target = document.getElementById(sharpLinkMatch[1]);

        if (target) {
          var top = getOffsetTop(target, container);

          if (top < offsetTop + bounds) {
            linkSections.push({
              link: link,
              top: top
            });
          }
        }
      });

      if (linkSections.length) {
        var maxSection = linkSections.reduce(function (prev, curr) {
          return curr.top > prev.top ? curr : prev;
        });
        return maxSection.link;
      }

      return '';
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_configProvider.ConfigConsumer, null, this.renderAnchor);
    }
  }]);

  return Anchor;
}(React.Component);

exports["default"] = Anchor;
Anchor.defaultProps = {
  affix: true,
  showInkInFixed: false,
  getContainer: getDefaultContainer
};
Anchor.childContextTypes = {
  antAnchor: PropTypes.object
};
//# sourceMappingURL=Anchor.js.map


/***/ }),

/***/ 1739:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(__webpack_require__(0));

var _reactLifecyclesCompat = __webpack_require__(36);

var _classnames = _interopRequireDefault(__webpack_require__(8));

var _omit = _interopRequireDefault(__webpack_require__(97));

var _rcResizeObserver = _interopRequireDefault(__webpack_require__(794));

var _configProvider = __webpack_require__(39);

var _throttleByAnimationFrame = __webpack_require__(1740);

var _warning = _interopRequireDefault(__webpack_require__(91));

var _utils = __webpack_require__(1741);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

function getDefaultTarget() {
  return typeof window !== 'undefined' ? window : null;
}

var AffixStatus;

(function (AffixStatus) {
  AffixStatus[AffixStatus["None"] = 0] = "None";
  AffixStatus[AffixStatus["Prepare"] = 1] = "Prepare";
})(AffixStatus || (AffixStatus = {}));

var Affix =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Affix, _React$Component);

  function Affix() {
    var _this;

    _classCallCheck(this, Affix);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Affix).apply(this, arguments));
    _this.state = {
      status: AffixStatus.None,
      lastAffix: false,
      prevTarget: null
    };

    _this.getOffsetTop = function () {
      var _this$props = _this.props,
          offset = _this$props.offset,
          offsetBottom = _this$props.offsetBottom;
      var offsetTop = _this.props.offsetTop;

      if (typeof offsetTop === 'undefined') {
        offsetTop = offset;
        (0, _warning["default"])(typeof offset === 'undefined', 'Affix', '`offset` is deprecated. Please use `offsetTop` instead.');
      }

      if (offsetBottom === undefined && offsetTop === undefined) {
        offsetTop = 0;
      }

      return offsetTop;
    };

    _this.getOffsetBottom = function () {
      return _this.props.offsetBottom;
    };

    _this.savePlaceholderNode = function (node) {
      _this.placeholderNode = node;
    };

    _this.saveFixedNode = function (node) {
      _this.fixedNode = node;
    }; // =================== Measure ===================


    _this.measure = function () {
      var _this$state = _this.state,
          status = _this$state.status,
          lastAffix = _this$state.lastAffix;
      var _this$props2 = _this.props,
          target = _this$props2.target,
          onChange = _this$props2.onChange;

      if (status !== AffixStatus.Prepare || !_this.fixedNode || !_this.placeholderNode || !target) {
        return;
      }

      var offsetTop = _this.getOffsetTop();

      var offsetBottom = _this.getOffsetBottom();

      var targetNode = target();

      if (!targetNode) {
        return;
      }

      var newState = {
        status: AffixStatus.None
      };
      var targetRect = (0, _utils.getTargetRect)(targetNode);
      var placeholderReact = (0, _utils.getTargetRect)(_this.placeholderNode);
      var fixedTop = (0, _utils.getFixedTop)(placeholderReact, targetRect, offsetTop);
      var fixedBottom = (0, _utils.getFixedBottom)(placeholderReact, targetRect, offsetBottom);

      if (fixedTop !== undefined) {
        newState.affixStyle = {
          position: 'fixed',
          top: fixedTop,
          width: placeholderReact.width,
          height: placeholderReact.height
        };
        newState.placeholderStyle = {
          width: placeholderReact.width,
          height: placeholderReact.height
        };
      } else if (fixedBottom !== undefined) {
        newState.affixStyle = {
          position: 'fixed',
          bottom: fixedBottom,
          width: placeholderReact.width,
          height: placeholderReact.height
        };
        newState.placeholderStyle = {
          width: placeholderReact.width,
          height: placeholderReact.height
        };
      }

      newState.lastAffix = !!newState.affixStyle;

      if (onChange && lastAffix !== newState.lastAffix) {
        onChange(newState.lastAffix);
      }

      _this.setState(newState);
    }; // @ts-ignore TS6133


    _this.prepareMeasure = function () {
      // event param is used before. Keep compatible ts define here.
      _this.setState({
        status: AffixStatus.Prepare,
        affixStyle: undefined,
        placeholderStyle: undefined
      }); // Test if `updatePosition` called


      if (false) { var onTestUpdatePosition; }
    }; // =================== Render ===================


    _this.renderAffix = function (_ref) {
      var getPrefixCls = _ref.getPrefixCls;
      var _this$state2 = _this.state,
          affixStyle = _this$state2.affixStyle,
          placeholderStyle = _this$state2.placeholderStyle;
      var _this$props3 = _this.props,
          prefixCls = _this$props3.prefixCls,
          children = _this$props3.children;
      var className = (0, _classnames["default"])(_defineProperty({}, getPrefixCls('affix', prefixCls), affixStyle));
      var props = (0, _omit["default"])(_this.props, ['prefixCls', 'offsetTop', 'offsetBottom', 'target', 'onChange']); // Omit this since `onTestUpdatePosition` only works on test.

      if (false) {}

      return React.createElement(_rcResizeObserver["default"], {
        onResize: function onResize() {
          _this.updatePosition();
        }
      }, React.createElement("div", _extends({}, props, {
        ref: _this.savePlaceholderNode
      }), affixStyle && React.createElement("div", {
        style: placeholderStyle,
        "aria-hidden": "true"
      }), React.createElement("div", {
        className: className,
        ref: _this.saveFixedNode,
        style: affixStyle
      }, React.createElement(_rcResizeObserver["default"], {
        onResize: function onResize() {
          _this.updatePosition();
        }
      }, children))));
    };

    return _this;
  } // Event handler


  _createClass(Affix, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var target = this.props.target;

      if (target) {
        // [Legacy] Wait for parent component ref has its value.
        // We should use target as directly element instead of function which makes element check hard.
        this.timeout = setTimeout(function () {
          (0, _utils.addObserveTarget)(target(), _this2); // Mock Event object.

          _this2.updatePosition();
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var prevTarget = this.state.prevTarget;
      var target = this.props.target;
      var newTarget = null;

      if (target) {
        newTarget = target() || null;
      }

      if (prevTarget !== newTarget) {
        (0, _utils.removeObserveTarget)(this);

        if (newTarget) {
          (0, _utils.addObserveTarget)(newTarget, this); // Mock Event object.

          this.updatePosition();
        }

        this.setState({
          prevTarget: newTarget
        });
      }

      if (prevProps.offsetTop !== this.props.offsetTop || prevProps.offsetBottom !== this.props.offsetBottom) {
        this.updatePosition();
      }

      this.measure();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      clearTimeout(this.timeout);
      (0, _utils.removeObserveTarget)(this);
      this.updatePosition.cancel();
    } // Handle realign logic

  }, {
    key: "updatePosition",
    value: function updatePosition() {
      this.prepareMeasure();
    }
  }, {
    key: "lazyUpdatePosition",
    value: function lazyUpdatePosition() {
      var target = this.props.target;
      var affixStyle = this.state.affixStyle; // Check position change before measure to make Safari smooth

      if (target && affixStyle) {
        var offsetTop = this.getOffsetTop();
        var offsetBottom = this.getOffsetBottom();
        var targetNode = target();

        if (targetNode) {
          var targetRect = (0, _utils.getTargetRect)(targetNode);
          var placeholderReact = (0, _utils.getTargetRect)(this.placeholderNode);
          var fixedTop = (0, _utils.getFixedTop)(placeholderReact, targetRect, offsetTop);
          var fixedBottom = (0, _utils.getFixedBottom)(placeholderReact, targetRect, offsetBottom);

          if (fixedTop !== undefined && affixStyle.top === fixedTop || fixedBottom !== undefined && affixStyle.bottom === fixedBottom) {
            return;
          }
        }
      } // Directly call prepare measure since it's already throttled.


      this.prepareMeasure();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_configProvider.ConfigConsumer, null, this.renderAffix);
    }
  }]);

  return Affix;
}(React.Component);

Affix.defaultProps = {
  target: getDefaultTarget
};

__decorate([(0, _throttleByAnimationFrame.throttleByAnimationFrameDecorator)()], Affix.prototype, "updatePosition", null);

__decorate([(0, _throttleByAnimationFrame.throttleByAnimationFrameDecorator)()], Affix.prototype, "lazyUpdatePosition", null);

(0, _reactLifecyclesCompat.polyfill)(Affix);
var _default = Affix;
exports["default"] = _default;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 1740:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = throttleByAnimationFrame;
exports.throttleByAnimationFrameDecorator = throttleByAnimationFrameDecorator;

var _raf = _interopRequireDefault(__webpack_require__(122));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function throttleByAnimationFrame(fn) {
  var requestId;

  var later = function later(args) {
    return function () {
      requestId = null;
      fn.apply(void 0, _toConsumableArray(args));
    };
  };

  var throttled = function throttled() {
    if (requestId == null) {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      requestId = (0, _raf["default"])(later(args));
    }
  };

  throttled.cancel = function () {
    return _raf["default"].cancel(requestId);
  };

  return throttled;
}

function throttleByAnimationFrameDecorator() {
  // eslint-disable-next-line func-names
  return function (target, key, descriptor) {
    var fn = descriptor.value;
    var definingProperty = false;
    return {
      configurable: true,
      get: function get() {
        // eslint-disable-next-line no-prototype-builtins
        if (definingProperty || this === target.prototype || this.hasOwnProperty(key)) {
          return fn;
        }

        var boundFn = throttleByAnimationFrame(fn.bind(this));
        definingProperty = true;
        Object.defineProperty(this, key, {
          value: boundFn,
          configurable: true,
          writable: true
        });
        definingProperty = false;
        return boundFn;
      }
    };
  };
}
//# sourceMappingURL=throttleByAnimationFrame.js.map


/***/ }),

/***/ 1741:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTargetRect = getTargetRect;
exports.getFixedTop = getFixedTop;
exports.getFixedBottom = getFixedBottom;
exports.getObserverEntities = getObserverEntities;
exports.addObserveTarget = addObserveTarget;
exports.removeObserveTarget = removeObserveTarget;

var _addEventListener = _interopRequireDefault(__webpack_require__(442));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getTargetRect(target) {
  return target !== window ? target.getBoundingClientRect() : {
    top: 0,
    bottom: window.innerHeight
  };
}

function getFixedTop(placeholderReact, targetRect, offsetTop) {
  if (offsetTop !== undefined && targetRect.top > placeholderReact.top - offsetTop) {
    return offsetTop + targetRect.top;
  }

  return undefined;
}

function getFixedBottom(placeholderReact, targetRect, offsetBottom) {
  if (offsetBottom !== undefined && targetRect.bottom < placeholderReact.bottom + offsetBottom) {
    var targetBottomOffset = window.innerHeight - targetRect.bottom;
    return offsetBottom + targetBottomOffset;
  }

  return undefined;
} // ======================== Observer ========================


var TRIGGER_EVENTS = ['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'];
var observerEntities = [];

function getObserverEntities() {
  // Only used in test env. Can be removed if refactor.
  return observerEntities;
}

function addObserveTarget(target, affix) {
  if (!target) return;
  var entity = observerEntities.find(function (item) {
    return item.target === target;
  });

  if (entity) {
    entity.affixList.push(affix);
  } else {
    entity = {
      target: target,
      affixList: [affix],
      eventHandlers: {}
    };
    observerEntities.push(entity); // Add listener

    TRIGGER_EVENTS.forEach(function (eventName) {
      entity.eventHandlers[eventName] = (0, _addEventListener["default"])(target, eventName, function () {
        entity.affixList.forEach(function (targetAffix) {
          targetAffix.lazyUpdatePosition();
        });
      });
    });
  }
}

function removeObserveTarget(affix) {
  var observerEntity = observerEntities.find(function (oriObserverEntity) {
    var hasAffix = oriObserverEntity.affixList.some(function (item) {
      return item === affix;
    });

    if (hasAffix) {
      oriObserverEntity.affixList = oriObserverEntity.affixList.filter(function (item) {
        return item !== affix;
      });
    }

    return hasAffix;
  });

  if (observerEntity && observerEntity.affixList.length === 0) {
    observerEntities = observerEntities.filter(function (item) {
      return item !== observerEntity;
    }); // Remove listener

    TRIGGER_EVENTS.forEach(function (eventName) {
      var handler = observerEntity.eventHandlers[eventName];

      if (handler && handler.remove) {
        handler.remove();
      }
    });
  }
}
//# sourceMappingURL=utils.js.map


/***/ }),

/***/ 1742:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(__webpack_require__(0));

var PropTypes = _interopRequireWildcard(__webpack_require__(1));

var _reactLifecyclesCompat = __webpack_require__(36);

var _classnames = _interopRequireDefault(__webpack_require__(8));

var _configProvider = __webpack_require__(39);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var AnchorLink =
/*#__PURE__*/
function (_React$Component) {
  _inherits(AnchorLink, _React$Component);

  function AnchorLink() {
    var _this;

    _classCallCheck(this, AnchorLink);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AnchorLink).apply(this, arguments));

    _this.handleClick = function (e) {
      var _this$context$antAnch = _this.context.antAnchor,
          scrollTo = _this$context$antAnch.scrollTo,
          onClick = _this$context$antAnch.onClick;
      var _this$props = _this.props,
          href = _this$props.href,
          title = _this$props.title;

      if (onClick) {
        onClick(e, {
          title: title,
          href: href
        });
      }

      scrollTo(href);
    };

    _this.renderAnchorLink = function (_ref) {
      var getPrefixCls = _ref.getPrefixCls;
      var _this$props2 = _this.props,
          customizePrefixCls = _this$props2.prefixCls,
          href = _this$props2.href,
          title = _this$props2.title,
          children = _this$props2.children,
          className = _this$props2.className,
          target = _this$props2.target;
      var prefixCls = getPrefixCls('anchor', customizePrefixCls);
      var active = _this.context.antAnchor.activeLink === href;
      var wrapperClassName = (0, _classnames["default"])(className, "".concat(prefixCls, "-link"), _defineProperty({}, "".concat(prefixCls, "-link-active"), active));
      var titleClassName = (0, _classnames["default"])("".concat(prefixCls, "-link-title"), _defineProperty({}, "".concat(prefixCls, "-link-title-active"), active));
      return React.createElement("div", {
        className: wrapperClassName
      }, React.createElement("a", {
        className: titleClassName,
        href: href,
        title: typeof title === 'string' ? title : '',
        target: target,
        onClick: _this.handleClick
      }, title), children);
    };

    return _this;
  }

  _createClass(AnchorLink, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.context.antAnchor.registerLink(this.props.href);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(_ref2) {
      var prevHref = _ref2.href;
      var href = this.props.href;

      if (prevHref !== href) {
        this.context.antAnchor.unregisterLink(prevHref);
        this.context.antAnchor.registerLink(href);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.context.antAnchor.unregisterLink(this.props.href);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_configProvider.ConfigConsumer, null, this.renderAnchorLink);
    }
  }]);

  return AnchorLink;
}(React.Component);

AnchorLink.defaultProps = {
  href: '#'
};
AnchorLink.contextTypes = {
  antAnchor: PropTypes.object
};
(0, _reactLifecyclesCompat.polyfill)(AnchorLink);
var _default = AnchorLink;
exports["default"] = _default;
//# sourceMappingURL=AnchorLink.js.map


/***/ }),

/***/ 1858:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/antd/lib/anchor/style/index.js
var style = __webpack_require__(1733);

// EXTERNAL MODULE: ./node_modules/antd/lib/anchor/index.js
var lib_anchor = __webpack_require__(961);
var anchor_default = /*#__PURE__*/__webpack_require__.n(lib_anchor);

// EXTERNAL MODULE: delegated ./node_modules/react/index.js from dll-reference dll_library
var reactfrom_dll_reference_dll_library = __webpack_require__(0);
var reactfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(reactfrom_dll_reference_dll_library);

// EXTERNAL MODULE: delegated ./node_modules/react-dom/index.js from dll-reference dll_library
var react_domfrom_dll_reference_dll_library = __webpack_require__(11);
var react_domfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(react_domfrom_dll_reference_dll_library);

// EXTERNAL MODULE: ./node_modules/react-intl/lib/index.es.js + 1 modules
var index_es = __webpack_require__(2);

// EXTERNAL MODULE: ./components/layout/Breadcrumb.tsx
var Breadcrumb = __webpack_require__(27);

// EXTERNAL MODULE: ./components/layout/MgeLayout.tsx + 7 modules
var MgeLayout = __webpack_require__(48);

// EXTERNAL MODULE: ./components/layout/NavMenu.tsx
var NavMenu = __webpack_require__(120);

// EXTERNAL MODULE: ./entry/help.less
var help = __webpack_require__(1737);

// CONCATENATED MODULE: ./apis/MediaPrefix.ts
function GetMediaPrefix() {
  return document.querySelector("meta[name='media-url-prefix']").getAttribute('content');
}

var MediaPrefix = GetMediaPrefix();
// CONCATENATED MODULE: ./entry/help.tsx
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









var Link = anchor_default.a.Link;
var breadcrumbItems = {
  title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'help',
    defaultMessage: "\u5E2E\u52A9"
  })
};
var t_StartUsing = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:start_using',
  defaultMessage: "\u5F00\u59CB\u4F7F\u7528"
});
var t_RegisterAccount = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:register_account',
  defaultMessage: "\u6CE8\u518C\u8D26\u53F7"
});
var t_Login = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:login',
  defaultMessage: "\u767B\u5F55\u8D26\u53F7"
});
var t_PersonalSet = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:personal_settings',
  defaultMessage: "\u4E2A\u4EBA\u8BBE\u7F6E"
});
var t_Home = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:home',
  defaultMessage: "\u9996\u9875"
});
var t_Temp = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:template',
  defaultMessage: "\u6A21\u677F"
});
var t_TempIntro = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:template_intro',
  defaultMessage: "\u6A21\u677F\u4ECB\u7ECD"
});
var t_TempMod = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:template_mod',
  defaultMessage: "\u6A21\u677F\u4FEE\u6539"
});
var t_Upload = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:upload',
  defaultMessage: "\u4E0A\u4F20\u6570\u636E"
});
var t_FormSub = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:form_sub',
  defaultMessage: "\u8868\u5355\u63D0\u4EA4"
});
var t_FileSub = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:file_sub',
  defaultMessage: "\u6587\u4EF6\u63D0\u4EA4"
});
var t_Stat = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:stat',
  defaultMessage: "\u6570\u636E\u7EDF\u8BA1"
});
var t_Search = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:search',
  defaultMessage: "\u6570\u636E\u68C0\u7D22"
});
var t_AdvSearch = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:adv_search',
  defaultMessage: "\u9AD8\u7EA7\u68C0\u7D22"
});
var t_Service = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:data_service',
  defaultMessage: "\u6570\u636E\u670D\u52A1"
});
var t_Field = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:field_type',
  defaultMessage: "\u5B57\u6BB5\u7C7B\u578B"
});
var t_DataTransfer = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:dataTransfer',
  defaultMessage: "\u6570\u636E\u6C47\u4EA4"
});
var t_DataTransferRequest = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:DataTransfer_request',
  defaultMessage: "\u7533\u8BF7\u6570\u636E\u6C47\u4EA4"
});
var t_DataTransferMy = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:DataTransfer_my',
  defaultMessage: "\u6211\u7684\u6C47\u4EA4"
});
var t_DataTransferAcceptance = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:DataTransfer_acceptance',
  defaultMessage: "\u6C47\u4EA4\u9A8C\u6536"
});
var t_DataTransferView = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'help:DataTransfer_view',
  defaultMessage: "\u67E5\u770B\u6C47\u4EA4\u6570\u636E"
});

var help_HelpEntry = /*#__PURE__*/function (_Component) {
  _inherits(HelpEntry, _Component);

  var _super = _createSuper(HelpEntry);

  function HelpEntry() {
    _classCallCheck(this, HelpEntry);

    return _super.apply(this, arguments);
  }

  _createClass(HelpEntry, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeLayout["a" /* MgeLayout */], {
        selectedMenu: NavMenu["a" /* MenuKey */].Help,
        contentStyle: {
          flexDirection: 'column',
          display: 'flex'
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Breadcrumb["a" /* Breadcrumb */], {
        items: [Breadcrumb["a" /* Breadcrumb */].MGED, Breadcrumb["a" /* Breadcrumb */].MDB, breadcrumbItems]
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body',
        id: 'start'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body__blue'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body__blue__title'
      }, t_StartUsing)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        style: {
          fontSize: '20px',
          marginLeft: '20px',
          marginTop: '20px'
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: 'https://www.yuque.com/docs/share/7e29faf6-4a80-4c8d-af16-16e67d3250c6',
        target: '_blank'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'user_manual',
        defaultMessage: "\u6570\u636E\u6C47\u4EA4\u9A8C\u6536\u4F7F\u7528\u624B\u518C"
      }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body__title',
        id: 'register'
      }, t_RegisterAccount), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body__title1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_1'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body__image'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/register.png"),
        width: '204'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_2'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body__body'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("ul", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("li", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_3'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("li", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_4'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("li", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_5'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("li", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_6'
      })))))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Anchor'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(anchor_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Link, {
        href: '#start',
        title: t_StartUsing
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Link, {
        href: '#register',
        title: t_RegisterAccount
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Link, {
        href: '#login',
        title: t_Login
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Link, {
        href: '#setting',
        title: t_PersonalSet
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Link, {
        href: '#index',
        title: t_Home
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Link, {
        href: '#tem',
        title: t_Temp
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Link, {
        href: '#introduction',
        title: t_TempIntro
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Link, {
        href: '#modify',
        title: t_TempMod
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Link, {
        href: '#datatransfer',
        title: t_DataTransfer
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Link, {
        href: '#request',
        title: t_DataTransferRequest
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Link, {
        href: '#my',
        title: t_DataTransferMy
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Link, {
        href: '#acceptance',
        title: t_DataTransferAcceptance
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Link, {
        href: '#view',
        title: t_DataTransferView
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Link, {
        href: '#upload',
        title: t_Upload
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Link, {
        href: '#analytics',
        title: t_Stat
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Link, {
        href: '#search',
        title: t_Search
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Link, {
        href: '#service',
        title: t_Service
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Link, {
        href: '#type',
        title: t_Field
      })))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_denglu',
        id: 'login'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_denglu__title'
      }, t_Login), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_denglu__body'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_denglu__body__image'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/denglu.png"),
        width: '191'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_denglu__body__image1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/chongzhi.png"),
        width: '230'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_denglu__body__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_7'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_8'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_denglu__body__text'
      }, "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_9'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_10'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_12'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_14'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_geren',
        id: 'setting'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_geren__title'
      }, t_PersonalSet), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_denglu__body'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_geren__body__image'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/shezhi.png"),
        width: '457'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_geren__body__image1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/shezhi1.png"),
        width: '435'
      }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_geren__body__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_15'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_16'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'TitleBlue',
        id: 'index'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'TitleBlue__title'
      }, t_Home)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shouye'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shouye__image1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/shouye1.png"),
        width: '511'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shouye__title_careful1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_17'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'TitleBlue',
        id: 'tem'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'TitleBlue__title'
      }, t_Temp)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_mubanjieshao',
        id: 'introduction'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_mubanjieshao__title'
      }, t_TempIntro), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_mubanjieshao__image'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/mubanjieshao.png"),
        width: '545'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_mubanjieshao__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_19'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_20'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Clear'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_mubanjieshao__image1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/mubanjieshao1.png"),
        width: '556'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_mubanjieshao__title_careful1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_21'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_mubanjieshao__text'
      }, "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_22'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_23'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_xiugaimuban',
        id: 'modify'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_xiugaimuban__title'
      }, t_TempMod), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_xiugaimuban__image1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/xiugaimuban.png"),
        width: '581'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_xiugaimuban__title_careful1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_24'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_25'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_xiugaimuban__text'
      }, "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_26'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Clear'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'TitleBlue',
        id: 'datatransfer'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'TitleBlue__title'
      }, t_DataTransfer)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer',
        id: 'request'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__title'
      }, t_DataTransferRequest), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__image'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/datatransfer01.png"),
        width: '545'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__title_careful1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_99'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Clear'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__image'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/datatransfer02.png"),
        width: '556'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__title_careful1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_100'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer',
        id: 'my'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__title'
      }, t_DataTransferMy), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__image'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/datatransfer03.png"),
        width: '545'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__title_careful1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_101'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Clear'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__image'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/datatransfer04.png"),
        width: '545'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__title_careful1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_102'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer',
        id: 'acceptance'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__title'
      }, t_DataTransferAcceptance), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__image'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/datatransfer05.png"),
        width: '545'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__title_careful1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_103'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_104'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Clear'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__image'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/datatransfer06.png"),
        width: '545'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__title_careful1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_105'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_106'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_107'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_108'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_109'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Clear'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__image'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/datatransfer07.png"),
        width: '545'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__title_careful1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_110'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_111'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_112'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_113'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer',
        id: 'view'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__title'
      }, t_DataTransferView), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__image'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/datatransfer08.png"),
        width: '545'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__title_careful1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_114'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_115'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_116'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Clear'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__image'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/datatransfer09.png"),
        width: '545'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_dataTransfer__title_careful1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_117'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_118'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_119'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'TitleBlue',
        id: 'upload'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'TitleBlue__title'
      }, t_Upload)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shangchuanshuju'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shangchuanshuju__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_27'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shangchuanshuju__text'
      }, "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_28'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_29'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_30'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_31'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shangchuanshuju__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_32'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shangchuanshuju__text'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_33'
      }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_biaodan'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_biaodan__title'
      }, t_FormSub), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_biaodan__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_34'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_biaodan__image'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/biaodan.png"),
        width: '668'
      }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shangchuanshuju'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shangchuanshuju__title'
      }, t_FileSub), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shangchuanshuju__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_35'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_36'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shangchuanshuju__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_37'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shangchuanshuju__text'
      }, "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_38'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_39'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_40'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_41'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_42'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_43'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_44'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shangchuanshuju__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_45'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shangchuanshuju__text'
      }, "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_46'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_47'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shangchuanshuju__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_48'
      }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_xiugaishuju'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_xiugaishuju__title'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_49'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_xiugaishuju__image'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/xiugaishuju.png"),
        width: '510'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_xiugaishuju__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_50'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_51'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'TitleBlue',
        id: 'analytics'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'TitleBlue__title'
      }, t_Stat)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_mubanjieshao'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_mubanjieshao__image2'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/shujutongji.png"),
        width: '513'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_mubanjieshao__title_careful3'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_52'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_53'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_54'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Clear'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_mubanjieshao__image2'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/shujutongji1.png"),
        width: '513'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_mubanjieshao__title_careful2'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_55'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Clear'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_mubanjieshao__image2'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/shujutongji2.png"),
        width: '513'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_mubanjieshao__title_careful2'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_56'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'TitleBlue',
        id: 'search'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'TitleBlue__title'
      }, t_Search)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body__title'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_57'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body__title_careful1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_58'
      }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_gaojijiansuo'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_gaojijiansuo__title'
      }, t_AdvSearch, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_gaojijiansuo__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_59'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_gaojijiansuo__image2'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/jiansuo.png"),
        width: '521'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_gaojijiansuo__title_careful1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_60'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_gaojijiansuo__text'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_61'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_62'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Clear'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_gaojijiansuo__image2'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/jiansuo1.png"),
        width: '521'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_gaojijiansuo__title_careful2'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_63'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_gaojijiansuo__text'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_64'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_65'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Clear'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_gaojijiansuo__image2'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/jiansuo2.png"),
        width: '521'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_gaojijiansuo__title_careful2'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_66'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_gaojijiansuo__text'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_67'
      }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'TitleBlue',
        id: 'service'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'TitleBlue__title'
      }, t_Service)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shujufuwu'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shujufuwu__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_68'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shujufuwu__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_69'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shujufuwu__text'
      }, "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_70'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_71'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_72'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shujufuwu__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_98'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shujufuwu__text'
      }, "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_73'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u25CF  ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_74'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shujufuwu__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_75'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shujufuwu__image'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
        src: "".concat(MediaPrefix, "_docs/img/help/fuwu.png"),
        width: '521'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_shujufuwu__title_careful1'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_76'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Clear'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_77'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'TitleBlue',
        id: 'type'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'TitleBlue__title'
      }, t_Field)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_78'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__text'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_79'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_80'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__text'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_81'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_82'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__text'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_83'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_84'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__text'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_85'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_86'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__text'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_87'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_88'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__text'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_89'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_90'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__text'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_91'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_92'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__text'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_93'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_94'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__text'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_95'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__title_careful'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_96'
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'Body_zifuleixing__text'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'help:_97'
      }))));
    }
  }]);

  return HelpEntry;
}(reactfrom_dll_reference_dll_library["Component"]);

react_domfrom_dll_reference_dll_library_default.a.render( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(help_HelpEntry, null), document.getElementById('wrap'));

/***/ }),

/***/ 59:
/***/ (function(module, exports) {

module.exports = dll_library;

/***/ }),

/***/ 961:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Anchor = _interopRequireDefault(__webpack_require__(1738));

var _AnchorLink = _interopRequireDefault(__webpack_require__(1742));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_Anchor["default"].Link = _AnchorLink["default"];
var _default = _Anchor["default"];
exports["default"] = _default;
//# sourceMappingURL=index.js.map


/***/ })

/******/ });