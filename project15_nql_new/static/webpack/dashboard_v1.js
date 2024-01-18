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
/******/ 		7: 0
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
/******/ 	deferredModules.push([1743,0]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 103:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _required = __webpack_require__(622);

var _required2 = _interopRequireDefault(_required);

var _whitespace = __webpack_require__(829);

var _whitespace2 = _interopRequireDefault(_whitespace);

var _type = __webpack_require__(830);

var _type2 = _interopRequireDefault(_type);

var _range = __webpack_require__(831);

var _range2 = _interopRequireDefault(_range);

var _enum = __webpack_require__(832);

var _enum2 = _interopRequireDefault(_enum);

var _pattern = __webpack_require__(833);

var _pattern2 = _interopRequireDefault(_pattern);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  required: _required2['default'],
  whitespace: _whitespace2['default'],
  type: _type2['default'],
  range: _range2['default'],
  'enum': _enum2['default'],
  pattern: _pattern2['default']
};

/***/ }),

/***/ 1083:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(55);

__webpack_require__(1745);

__webpack_require__(138);
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 1084:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(20);

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = __webpack_require__(42);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Track = function Track(props) {
  var _ref, _ref2;

  var className = props.className,
      included = props.included,
      vertical = props.vertical,
      offset = props.offset,
      length = props.length,
      style = props.style,
      reverse = props.reverse;

  var positonStyle = vertical ? (_ref = {}, (0, _defineProperty3['default'])(_ref, reverse ? 'top' : 'bottom', offset + '%'), (0, _defineProperty3['default'])(_ref, reverse ? 'bottom' : 'top', 'auto'), (0, _defineProperty3['default'])(_ref, 'height', length + '%'), _ref) : (_ref2 = {}, (0, _defineProperty3['default'])(_ref2, reverse ? 'right' : 'left', offset + '%'), (0, _defineProperty3['default'])(_ref2, reverse ? 'left' : 'right', 'auto'), (0, _defineProperty3['default'])(_ref2, 'width', length + '%'), _ref2);

  var elStyle = (0, _extends3['default'])({}, style, positonStyle);
  return included ? _react2['default'].createElement('div', { className: className, style: elStyle }) : null;
}; /* eslint-disable react/prop-types */
exports['default'] = Track;
module.exports = exports['default'];

/***/ }),

/***/ 1085:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = __webpack_require__(105);

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _extends2 = __webpack_require__(20);

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = __webpack_require__(42);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = __webpack_require__(23);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(52);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(19);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = __webpack_require__(1747);

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = __webpack_require__(26);

var _inherits3 = _interopRequireDefault(_inherits2);

exports['default'] = createSlider;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _addEventListener = __webpack_require__(442);

var _addEventListener2 = _interopRequireDefault(_addEventListener);

var _classnames = __webpack_require__(8);

var _classnames2 = _interopRequireDefault(_classnames);

var _warning = __webpack_require__(119);

var _warning2 = _interopRequireDefault(_warning);

var _Steps = __webpack_require__(1754);

var _Steps2 = _interopRequireDefault(_Steps);

var _Marks = __webpack_require__(1755);

var _Marks2 = _interopRequireDefault(_Marks);

var _Handle = __webpack_require__(1087);

var _Handle2 = _interopRequireDefault(_Handle);

var _utils = __webpack_require__(809);

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function noop() {}

function createSlider(Component) {
  var _class, _temp;

  return _temp = _class = function (_Component) {
    (0, _inherits3['default'])(ComponentEnhancer, _Component);

    function ComponentEnhancer(props) {
      (0, _classCallCheck3['default'])(this, ComponentEnhancer);

      var _this = (0, _possibleConstructorReturn3['default'])(this, (ComponentEnhancer.__proto__ || Object.getPrototypeOf(ComponentEnhancer)).call(this, props));

      _this.onMouseDown = function (e) {
        if (e.button !== 0) {
          return;
        }

        var isVertical = _this.props.vertical;
        var position = utils.getMousePosition(isVertical, e);
        if (!utils.isEventFromHandle(e, _this.handlesRefs)) {
          _this.dragOffset = 0;
        } else {
          var handlePosition = utils.getHandleCenterPosition(isVertical, e.target);
          _this.dragOffset = position - handlePosition;
          position = handlePosition;
        }
        _this.removeDocumentEvents();
        _this.onStart(position);
        _this.addDocumentMouseEvents();
      };

      _this.onTouchStart = function (e) {
        if (utils.isNotTouchEvent(e)) return;

        var isVertical = _this.props.vertical;
        var position = utils.getTouchPosition(isVertical, e);
        if (!utils.isEventFromHandle(e, _this.handlesRefs)) {
          _this.dragOffset = 0;
        } else {
          var handlePosition = utils.getHandleCenterPosition(isVertical, e.target);
          _this.dragOffset = position - handlePosition;
          position = handlePosition;
        }
        _this.onStart(position);
        _this.addDocumentTouchEvents();
        utils.pauseEvent(e);
      };

      _this.onFocus = function (e) {
        var _this$props = _this.props,
            onFocus = _this$props.onFocus,
            vertical = _this$props.vertical;

        if (utils.isEventFromHandle(e, _this.handlesRefs)) {
          var handlePosition = utils.getHandleCenterPosition(vertical, e.target);
          _this.dragOffset = 0;
          _this.onStart(handlePosition);
          utils.pauseEvent(e);
          if (onFocus) {
            onFocus(e);
          }
        }
      };

      _this.onBlur = function (e) {
        var onBlur = _this.props.onBlur;

        _this.onEnd();
        if (onBlur) {
          onBlur(e);
        }
      };

      _this.onMouseUp = function () {
        if (_this.handlesRefs[_this.prevMovedHandleIndex]) {
          _this.handlesRefs[_this.prevMovedHandleIndex].clickFocus();
        }
      };

      _this.onMouseMove = function (e) {
        if (!_this.sliderRef) {
          _this.onEnd();
          return;
        }
        var position = utils.getMousePosition(_this.props.vertical, e);
        _this.onMove(e, position - _this.dragOffset);
      };

      _this.onTouchMove = function (e) {
        if (utils.isNotTouchEvent(e) || !_this.sliderRef) {
          _this.onEnd();
          return;
        }

        var position = utils.getTouchPosition(_this.props.vertical, e);
        _this.onMove(e, position - _this.dragOffset);
      };

      _this.onKeyDown = function (e) {
        if (_this.sliderRef && utils.isEventFromHandle(e, _this.handlesRefs)) {
          _this.onKeyboard(e);
        }
      };

      _this.onClickMarkLabel = function (e, value) {
        e.stopPropagation();
        _this.onChange({ value: value });
        _this.setState({ value: value }, function () {
          return _this.onEnd(true);
        });
      };

      _this.saveSlider = function (slider) {
        _this.sliderRef = slider;
      };

      var step = props.step,
          max = props.max,
          min = props.min;

      var isPointDiffEven = isFinite(max - min) ? (max - min) % step === 0 : true; // eslint-disable-line
      (0, _warning2['default'])(step && Math.floor(step) === step ? isPointDiffEven : true, 'Slider[max] - Slider[min] (%s) should be a multiple of Slider[step] (%s)', max - min, step);
      _this.handlesRefs = {};
      return _this;
    }

    (0, _createClass3['default'])(ComponentEnhancer, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        // Snapshot testing cannot handle refs, so be sure to null-check this.
        this.document = this.sliderRef && this.sliderRef.ownerDocument;

        var _props = this.props,
            autoFocus = _props.autoFocus,
            disabled = _props.disabled;

        if (autoFocus && !disabled) {
          this.focus();
        }
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        if ((0, _get3['default'])(ComponentEnhancer.prototype.__proto__ || Object.getPrototypeOf(ComponentEnhancer.prototype), 'componentWillUnmount', this)) (0, _get3['default'])(ComponentEnhancer.prototype.__proto__ || Object.getPrototypeOf(ComponentEnhancer.prototype), 'componentWillUnmount', this).call(this);
        this.removeDocumentEvents();
      }
    }, {
      key: 'getSliderStart',
      value: function getSliderStart() {
        var slider = this.sliderRef;
        var _props2 = this.props,
            vertical = _props2.vertical,
            reverse = _props2.reverse;

        var rect = slider.getBoundingClientRect();
        if (vertical) {
          return reverse ? rect.bottom : rect.top;
        }
        return window.pageXOffset + (reverse ? rect.right : rect.left);
      }
    }, {
      key: 'getSliderLength',
      value: function getSliderLength() {
        var slider = this.sliderRef;
        if (!slider) {
          return 0;
        }

        var coords = slider.getBoundingClientRect();
        return this.props.vertical ? coords.height : coords.width;
      }
    }, {
      key: 'addDocumentTouchEvents',
      value: function addDocumentTouchEvents() {
        // just work for Chrome iOS Safari and Android Browser
        this.onTouchMoveListener = (0, _addEventListener2['default'])(this.document, 'touchmove', this.onTouchMove);
        this.onTouchUpListener = (0, _addEventListener2['default'])(this.document, 'touchend', this.onEnd);
      }
    }, {
      key: 'addDocumentMouseEvents',
      value: function addDocumentMouseEvents() {
        this.onMouseMoveListener = (0, _addEventListener2['default'])(this.document, 'mousemove', this.onMouseMove);
        this.onMouseUpListener = (0, _addEventListener2['default'])(this.document, 'mouseup', this.onEnd);
      }
    }, {
      key: 'removeDocumentEvents',
      value: function removeDocumentEvents() {
        /* eslint-disable no-unused-expressions */
        this.onTouchMoveListener && this.onTouchMoveListener.remove();
        this.onTouchUpListener && this.onTouchUpListener.remove();

        this.onMouseMoveListener && this.onMouseMoveListener.remove();
        this.onMouseUpListener && this.onMouseUpListener.remove();
        /* eslint-enable no-unused-expressions */
      }
    }, {
      key: 'focus',
      value: function focus() {
        if (!this.props.disabled) {
          this.handlesRefs[0].focus();
        }
      }
    }, {
      key: 'blur',
      value: function blur() {
        var _this2 = this;

        if (!this.props.disabled) {
          Object.keys(this.handlesRefs).forEach(function (key) {
            if (_this2.handlesRefs[key] && _this2.handlesRefs[key].blur) {
              _this2.handlesRefs[key].blur();
            }
          });
        }
      }
    }, {
      key: 'calcValue',
      value: function calcValue(offset) {
        var _props3 = this.props,
            vertical = _props3.vertical,
            min = _props3.min,
            max = _props3.max;

        var ratio = Math.abs(Math.max(offset, 0) / this.getSliderLength());
        var value = vertical ? (1 - ratio) * (max - min) + min : ratio * (max - min) + min;
        return value;
      }
    }, {
      key: 'calcValueByPos',
      value: function calcValueByPos(position) {
        var sign = this.props.reverse ? -1 : +1;
        var pixelOffset = sign * (position - this.getSliderStart());
        var nextValue = this.trimAlignValue(this.calcValue(pixelOffset));
        return nextValue;
      }
    }, {
      key: 'calcOffset',
      value: function calcOffset(value) {
        var _props4 = this.props,
            min = _props4.min,
            max = _props4.max;

        var ratio = (value - min) / (max - min);
        return ratio * 100;
      }
    }, {
      key: 'saveHandle',
      value: function saveHandle(index, handle) {
        this.handlesRefs[index] = handle;
      }
    }, {
      key: 'render',
      value: function render() {
        var _classNames;

        var _props5 = this.props,
            prefixCls = _props5.prefixCls,
            className = _props5.className,
            marks = _props5.marks,
            dots = _props5.dots,
            step = _props5.step,
            included = _props5.included,
            disabled = _props5.disabled,
            vertical = _props5.vertical,
            reverse = _props5.reverse,
            min = _props5.min,
            max = _props5.max,
            children = _props5.children,
            maximumTrackStyle = _props5.maximumTrackStyle,
            style = _props5.style,
            railStyle = _props5.railStyle,
            dotStyle = _props5.dotStyle,
            activeDotStyle = _props5.activeDotStyle;

        var _get$call = (0, _get3['default'])(ComponentEnhancer.prototype.__proto__ || Object.getPrototypeOf(ComponentEnhancer.prototype), 'render', this).call(this),
            tracks = _get$call.tracks,
            handles = _get$call.handles;

        var sliderClassName = (0, _classnames2['default'])(prefixCls, (_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-with-marks', Object.keys(marks).length), (0, _defineProperty3['default'])(_classNames, prefixCls + '-disabled', disabled), (0, _defineProperty3['default'])(_classNames, prefixCls + '-vertical', vertical), (0, _defineProperty3['default'])(_classNames, className, className), _classNames));
        return _react2['default'].createElement(
          'div',
          {
            ref: this.saveSlider,
            className: sliderClassName,
            onTouchStart: disabled ? noop : this.onTouchStart,
            onMouseDown: disabled ? noop : this.onMouseDown,
            onMouseUp: disabled ? noop : this.onMouseUp,
            onKeyDown: disabled ? noop : this.onKeyDown,
            onFocus: disabled ? noop : this.onFocus,
            onBlur: disabled ? noop : this.onBlur,
            style: style
          },
          _react2['default'].createElement('div', {
            className: prefixCls + '-rail',
            style: (0, _extends3['default'])({}, maximumTrackStyle, railStyle)
          }),
          tracks,
          _react2['default'].createElement(_Steps2['default'], {
            prefixCls: prefixCls,
            vertical: vertical,
            reverse: reverse,
            marks: marks,
            dots: dots,
            step: step,
            included: included,
            lowerBound: this.getLowerBound(),
            upperBound: this.getUpperBound(),
            max: max,
            min: min,
            dotStyle: dotStyle,
            activeDotStyle: activeDotStyle
          }),
          handles,
          _react2['default'].createElement(_Marks2['default'], {
            className: prefixCls + '-mark',
            onClickLabel: disabled ? noop : this.onClickMarkLabel,
            vertical: vertical,
            marks: marks,
            included: included,
            lowerBound: this.getLowerBound(),
            upperBound: this.getUpperBound(),
            max: max,
            min: min,
            reverse: reverse
          }),
          children
        );
      }
    }]);
    return ComponentEnhancer;
  }(Component), _class.displayName = 'ComponentEnhancer(' + Component.displayName + ')', _class.propTypes = (0, _extends3['default'])({}, Component.propTypes, {
    min: _propTypes2['default'].number,
    max: _propTypes2['default'].number,
    step: _propTypes2['default'].number,
    marks: _propTypes2['default'].object,
    included: _propTypes2['default'].bool,
    className: _propTypes2['default'].string,
    prefixCls: _propTypes2['default'].string,
    disabled: _propTypes2['default'].bool,
    children: _propTypes2['default'].any,
    onBeforeChange: _propTypes2['default'].func,
    onChange: _propTypes2['default'].func,
    onAfterChange: _propTypes2['default'].func,
    handle: _propTypes2['default'].func,
    dots: _propTypes2['default'].bool,
    vertical: _propTypes2['default'].bool,
    style: _propTypes2['default'].object,
    reverse: _propTypes2['default'].bool,
    minimumTrackStyle: _propTypes2['default'].object, // just for compatibility, will be deperecate
    maximumTrackStyle: _propTypes2['default'].object, // just for compatibility, will be deperecate
    handleStyle: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].arrayOf(_propTypes2['default'].object)]),
    trackStyle: _propTypes2['default'].oneOfType([_propTypes2['default'].object, _propTypes2['default'].arrayOf(_propTypes2['default'].object)]),
    railStyle: _propTypes2['default'].object,
    dotStyle: _propTypes2['default'].object,
    activeDotStyle: _propTypes2['default'].object,
    autoFocus: _propTypes2['default'].bool,
    onFocus: _propTypes2['default'].func,
    onBlur: _propTypes2['default'].func
  }), _class.defaultProps = (0, _extends3['default'])({}, Component.defaultProps, {
    prefixCls: 'rc-slider',
    className: '',
    min: 0,
    max: 100,
    step: 1,
    marks: {},
    handle: function handle(_ref) {
      var index = _ref.index,
          restProps = (0, _objectWithoutProperties3['default'])(_ref, ['index']);

      delete restProps.dragging;
      if (restProps.value === null) {
        return null;
      }

      return _react2['default'].createElement(_Handle2['default'], (0, _extends3['default'])({}, restProps, { key: index }));
    },

    onBeforeChange: noop,
    onChange: noop,
    onAfterChange: noop,
    included: true,
    disabled: false,
    dots: false,
    vertical: false,
    reverse: false,
    trackStyle: [{}],
    handleStyle: [{}],
    railStyle: {},
    dotStyle: {},
    activeDotStyle: {}
  }), _temp;
}
module.exports = exports['default'];

/***/ }),

/***/ 1086:
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(286);
var core = __webpack_require__(177);
var fails = __webpack_require__(436);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ 1087:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(20);

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = __webpack_require__(42);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _objectWithoutProperties2 = __webpack_require__(105);

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = __webpack_require__(23);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(52);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(19);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(26);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = __webpack_require__(8);

var _classnames2 = _interopRequireDefault(_classnames);

var _addEventListener = __webpack_require__(442);

var _addEventListener2 = _interopRequireDefault(_addEventListener);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Handle = function (_React$Component) {
  (0, _inherits3['default'])(Handle, _React$Component);

  function Handle() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3['default'])(this, Handle);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3['default'])(this, (_ref = Handle.__proto__ || Object.getPrototypeOf(Handle)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      clickFocused: false
    }, _this.setHandleRef = function (node) {
      _this.handle = node;
    }, _this.handleMouseUp = function () {
      if (document.activeElement === _this.handle) {
        _this.setClickFocus(true);
      }
    }, _this.handleMouseDown = function () {
      // fix https://github.com/ant-design/ant-design/issues/15324
      _this.focus();
    }, _this.handleBlur = function () {
      _this.setClickFocus(false);
    }, _this.handleKeyDown = function () {
      _this.setClickFocus(false);
    }, _temp), (0, _possibleConstructorReturn3['default'])(_this, _ret);
  }

  (0, _createClass3['default'])(Handle, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // mouseup won't trigger if mouse moved out of handle,
      // so we listen on document here.
      this.onMouseUpListener = (0, _addEventListener2['default'])(document, 'mouseup', this.handleMouseUp);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.onMouseUpListener) {
        this.onMouseUpListener.remove();
      }
    }
  }, {
    key: 'setClickFocus',
    value: function setClickFocus(focused) {
      this.setState({ clickFocused: focused });
    }
  }, {
    key: 'clickFocus',
    value: function clickFocus() {
      this.setClickFocus(true);
      this.focus();
    }
  }, {
    key: 'focus',
    value: function focus() {
      this.handle.focus();
    }
  }, {
    key: 'blur',
    value: function blur() {
      this.handle.blur();
    }
  }, {
    key: 'render',
    value: function render() {
      var _ref2, _ref3;

      var _props = this.props,
          prefixCls = _props.prefixCls,
          vertical = _props.vertical,
          reverse = _props.reverse,
          offset = _props.offset,
          style = _props.style,
          disabled = _props.disabled,
          min = _props.min,
          max = _props.max,
          value = _props.value,
          tabIndex = _props.tabIndex,
          restProps = (0, _objectWithoutProperties3['default'])(_props, ['prefixCls', 'vertical', 'reverse', 'offset', 'style', 'disabled', 'min', 'max', 'value', 'tabIndex']);


      var className = (0, _classnames2['default'])(this.props.className, (0, _defineProperty3['default'])({}, prefixCls + '-handle-click-focused', this.state.clickFocused));
      var positionStyle = vertical ? (_ref2 = {}, (0, _defineProperty3['default'])(_ref2, reverse ? 'top' : 'bottom', offset + '%'), (0, _defineProperty3['default'])(_ref2, reverse ? 'bottom' : 'top', 'auto'), (0, _defineProperty3['default'])(_ref2, 'transform', 'translateY(+50%)'), _ref2) : (_ref3 = {}, (0, _defineProperty3['default'])(_ref3, reverse ? 'right' : 'left', offset + '%'), (0, _defineProperty3['default'])(_ref3, reverse ? 'left' : 'right', 'auto'), (0, _defineProperty3['default'])(_ref3, 'transform', 'translateX(' + (reverse ? '+' : '-') + '50%)'), _ref3);
      var elStyle = (0, _extends3['default'])({}, style, positionStyle);

      var _tabIndex = tabIndex || 0;
      if (disabled || tabIndex === null) {
        _tabIndex = null;
      }

      return _react2['default'].createElement('div', (0, _extends3['default'])({
        ref: this.setHandleRef,
        tabIndex: _tabIndex
      }, restProps, {
        className: className,
        style: elStyle,
        onBlur: this.handleBlur,
        onKeyDown: this.handleKeyDown,
        onMouseDown: this.handleMouseDown

        // aria attribute
        , role: 'slider',
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuenow': value,
        'aria-disabled': !!disabled
      }));
    }
  }]);
  return Handle;
}(_react2['default'].Component);

exports['default'] = Handle;


Handle.propTypes = {
  prefixCls: _propTypes2['default'].string,
  className: _propTypes2['default'].string,
  vertical: _propTypes2['default'].bool,
  offset: _propTypes2['default'].number,
  style: _propTypes2['default'].object,
  disabled: _propTypes2['default'].bool,
  min: _propTypes2['default'].number,
  max: _propTypes2['default'].number,
  value: _propTypes2['default'].number,
  tabIndex: _propTypes2['default'].number,
  reverse: _propTypes2['default'].bool
};
module.exports = exports['default'];

/***/ }),

/***/ 1088:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1089:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(__webpack_require__(0));

var _classnames = _interopRequireDefault(__webpack_require__(8));

var _configProvider = __webpack_require__(39);

var _warning = _interopRequireDefault(__webpack_require__(91));

var _ref2 = __webpack_require__(1760);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var Typography = function Typography(_a, ref) {
  var customizePrefixCls = _a.prefixCls,
      _a$component = _a.component,
      component = _a$component === void 0 ? 'article' : _a$component,
      className = _a.className,
      ariaLabel = _a['aria-label'],
      setContentRef = _a.setContentRef,
      children = _a.children,
      restProps = __rest(_a, ["prefixCls", "component", "className", 'aria-label', "setContentRef", "children"]);

  var mergedRef = ref;

  if (setContentRef) {
    (0, _warning["default"])(false, 'Typography', '`setContentRef` is deprecated. Please use `ref` instead.');
    mergedRef = (0, _ref2.composeRef)(ref, setContentRef);
  }

  return React.createElement(_configProvider.ConfigConsumer, null, function (_ref) {
    var getPrefixCls = _ref.getPrefixCls;
    var Component = component;
    var prefixCls = getPrefixCls('typography', customizePrefixCls);
    return React.createElement(Component, _extends({
      className: (0, _classnames["default"])(prefixCls, className),
      "aria-label": ariaLabel,
      ref: mergedRef
    }, restProps), children);
  });
};

var RefTypography;

if (React.forwardRef) {
  RefTypography = React.forwardRef(Typography);
  RefTypography.displayName = 'Typography';
} else {
  var TypographyWrapper =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(TypographyWrapper, _React$Component);

    function TypographyWrapper() {
      var _this;

      _classCallCheck(this, TypographyWrapper);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(TypographyWrapper).apply(this, arguments));
      _this.state = {};
      return _this;
    }

    _createClass(TypographyWrapper, [{
      key: "render",
      value: function render() {
        return React.createElement(Typography, this.props);
      }
    }]);

    return TypographyWrapper;
  }(React.Component);

  RefTypography = TypographyWrapper;
} // es default export should use const instead of let


var ExportTypography = RefTypography;
var _default = ExportTypography;
exports["default"] = _default;
//# sourceMappingURL=Typography.js.map


/***/ }),

/***/ 1112:
/***/ (function(module, exports, __webpack_require__) {

!function(e,t){ true?module.exports=t(__webpack_require__(1),__webpack_require__(0)):undefined}(this,function(e,t){"use strict";function o(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var n=o(e),i=o(t);function r(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}function s(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function u(){return(u=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&(e[n]=o[n])}return e}).apply(this,arguments)}function a(t,e){var o,n=Object.keys(t);return Object.getOwnPropertySymbols&&(o=Object.getOwnPropertySymbols(t),e&&(o=o.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,o)),n}function y(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{};e%2?a(Object(o),!0).forEach(function(e){s(t,e,o[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):a(Object(o)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))})}return t}function h(e){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function l(e,t){if(null==e)return{};var o,n=function(e,t){if(null==e)return{};for(var o,n={},a=Object.keys(e),r=0;r<a.length;r++)o=a[r],0<=t.indexOf(o)||(n[o]=e[o]);return n}(e,t);if(Object.getOwnPropertySymbols)for(var a=Object.getOwnPropertySymbols(e),r=0;r<a.length;r++)o=a[r],0<=t.indexOf(o)||Object.prototype.propertyIsEnumerable.call(e,o)&&(n[o]=e[o]);return n}function d(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function p(r){var i=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(e){return!1}}();return function(){var e,t,o,n,a=h(r);return t=i?(e=h(this).constructor,Reflect.construct(a,arguments,e)):a.apply(this,arguments),o=this,!(n=t)||"object"!=typeof n&&"function"!=typeof n?d(o):n}}function m(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){if("undefined"==typeof Symbol||!(Symbol.iterator in Object(e)))return;var o=[],n=!0,a=!1,r=void 0;try{for(var i,s=e[Symbol.iterator]();!(n=(i=s.next()).done)&&(o.push(i.value),!t||o.length!==t);n=!0);}catch(e){a=!0,r=e}finally{try{n||null==s.return||s.return()}finally{if(a)throw r}}return o}(e,t)||g(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function g(e,t){if(e){if("string"==typeof e)return f(e,t);var o=Object.prototype.toString.call(e).slice(8,-1);return"Object"===o&&e.constructor&&(o=e.constructor.name),"Map"===o||"Set"===o?Array.from(e):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?f(e,t):void 0}}function f(e,t){(null==t||t>e.length)&&(t=e.length);for(var o=0,n=new Array(t);o<t;o++)n[o]=e[o];return n}function v(a,r){return new Promise(function(e,t){var o,n=new Image;n.onload=function(){return e(n)},n.onerror=t,!1==(null!==(o=a)&&!!o.match(/^\s*data:([a-z]+\/[a-z]+(;[a-z-]+=[a-z-]+)?)?(;base64)?,[a-z0-9!$&',()*+;=\-._~:@/?%\s]*\s*$/i))&&r&&(n.crossOrigin=r),n.src=a})}var b,w=!("undefined"==typeof window||"undefined"==typeof navigator||!("ontouchstart"in window||0<navigator.msMaxTouchPoints)),M="undefined"!=typeof File,O={touch:{react:{down:"onTouchStart",mouseDown:"onMouseDown",drag:"onTouchMove",move:"onTouchMove",mouseMove:"onMouseMove",up:"onTouchEnd",mouseUp:"onMouseUp"},native:{down:"touchstart",mouseDown:"mousedown",drag:"touchmove",move:"touchmove",mouseMove:"mousemove",up:"touchend",mouseUp:"mouseup"}},desktop:{react:{down:"onMouseDown",drag:"onDragOver",move:"onMouseMove",up:"onMouseUp"},native:{down:"mousedown",drag:"dragStart",move:"mousemove",up:"mouseup"}}},I=w?O.touch:O.desktop,P="undefined"!=typeof window&&window.devicePixelRatio?window.devicePixelRatio:1,C={x:.5,y:.5},x=function(){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}(a,i["default"].Component);var e,t,o,n=p(a);function a(e){var v;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),s(d(v=n.call(this,e)),"state",{drag:!1,my:null,mx:null,image:C}),s(d(v),"handleImageReady",function(e){var t=v.getInitialSize(e.width,e.height);t.resource=e,t.x=.5,t.y=.5,t.backgroundColor=v.props.backgroundColor,v.setState({drag:!1,image:t},v.props.onImageReady),v.props.onLoadSuccess(t)}),s(d(v),"clearImage",function(){v.canvas.getContext("2d").clearRect(0,0,v.canvas.width,v.canvas.height),v.setState({image:C})}),s(d(v),"handleMouseDown",function(e){(e=e||window.event).preventDefault(),v.setState({drag:!0,mx:null,my:null})}),s(d(v),"handleMouseUp",function(){v.state.drag&&(v.setState({drag:!1}),v.props.onMouseUp())}),s(d(v),"handleMouseMove",function(e){var t,o,n,a,r,i,s,u,h,c,l,d,p,g,f,m;e=e||window.event,!1!==v.state.drag&&(e.preventDefault(),n={mx:t=e.targetTouches?e.targetTouches[0].pageX:e.clientX,my:o=e.targetTouches?e.targetTouches[0].pageY:e.clientY},m=v.props.rotate,m=(m%=360)<0?m+360:m,v.state.mx&&v.state.my&&(a=v.state.mx-t,r=v.state.my-o,i=v.state.image.width*v.props.scale,s=v.state.image.height*v.props.scale,h=(u=v.getCroppingRect()).x,c=u.y,h*=i,c*=s,l=function(e){return e*(Math.PI/180)},d=Math.cos(l(m)),g=c+-a*(p=Math.sin(l(m)))+r*d,f={x:(h+a*d+r*p)/i+1/v.props.scale*v.getXScale()/2,y:g/s+1/v.props.scale*v.getYScale()/2},v.props.onPositionChange(f),n.image=y(y({},v.state.image),f)),v.setState(n),v.props.onMouseMove(e))}),s(d(v),"setCanvas",function(e){v.canvas=e}),v.canvas=null,v}return e=a,(t=[{key:"componentDidMount",value:function(){this.props.disableHiDPIScaling&&(P=1);var e,t,o=this.canvas.getContext("2d");this.props.image&&this.loadImage(this.props.image),this.paint(o),document&&(e=!!function(){var t=!1;try{var e=Object.defineProperty({},"passive",{get:function(){t=!0}});window.addEventListener("test",e,e),window.removeEventListener("test",e,e)}catch(e){t=!1}return t}()&&{passive:!1},t=I.native,document.addEventListener(t.move,this.handleMouseMove,e),document.addEventListener(t.up,this.handleMouseUp,e),w&&(document.addEventListener(t.mouseMove,this.handleMouseMove,e),document.addEventListener(t.mouseUp,this.handleMouseUp,e)))}},{key:"componentDidUpdate",value:function(e,t){this.props.image&&this.props.image!==e.image||this.props.width!==e.width||this.props.height!==e.height||this.props.backgroundColor!==e.backgroundColor?this.loadImage(this.props.image):this.props.image||t.image===C||this.clearImage();var o=this.canvas.getContext("2d");o.clearRect(0,0,this.canvas.width,this.canvas.height),this.paint(o),this.paintImage(o,this.state.image,this.props.border),e.image===this.props.image&&e.width===this.props.width&&e.height===this.props.height&&e.position===this.props.position&&e.scale===this.props.scale&&e.rotate===this.props.rotate&&t.my===this.state.my&&t.mx===this.state.mx&&t.image.x===this.state.image.x&&t.image.y===this.state.image.y&&t.backgroundColor===this.state.backgroundColor||this.props.onImageChange()}},{key:"componentWillUnmount",value:function(){var e;document&&(e=I.native,document.removeEventListener(e.move,this.handleMouseMove,!1),document.removeEventListener(e.up,this.handleMouseUp,!1),w&&(document.removeEventListener(e.mouseMove,this.handleMouseMove,!1),document.removeEventListener(e.mouseUp,this.handleMouseUp,!1)))}},{key:"isVertical",value:function(){return!this.props.disableCanvasRotation&&this.props.rotate%180!=0}},{key:"getBorders",value:function(e){var t=0<arguments.length&&void 0!==e?e:this.props.border;return Array.isArray(t)?t:[t,t]}},{key:"getDimensions",value:function(){var e=this.props,t=e.width,o=e.height,n=e.rotate,a=e.border,r={},i=m(this.getBorders(a),2),s=i[0],u=i[1],h=t,c=o;return this.isVertical()?(r.width=c,r.height=h):(r.width=h,r.height=c),r.width+=2*s,r.height+=2*u,{canvas:r,rotate:n,width:t,height:o,border:a}}},{key:"getImage",value:function(){var e=this.getCroppingRect(),t=this.state.image;e.x*=t.resource.width,e.y*=t.resource.height,e.width*=t.resource.width,e.height*=t.resource.height;var o=document.createElement("canvas");this.isVertical()?(o.width=e.height,o.height=e.width):(o.width=e.width,o.height=e.height);var n=o.getContext("2d");return n.translate(o.width/2,o.height/2),n.rotate(this.props.rotate*Math.PI/180),n.translate(-o.width/2,-o.height/2),this.isVertical()&&n.translate((o.width-o.height)/2,(o.height-o.width)/2),t.backgroundColor&&(n.fillStyle=t.backgroundColor,n.fillRect(-e.x,-e.y,t.resource.width,t.resource.height)),n.drawImage(t.resource,-e.x,-e.y),o}},{key:"getImageScaledToCanvas",value:function(){var e=this.getDimensions(),t=e.width,o=e.height,n=document.createElement("canvas");return this.isVertical()?(n.width=o,n.height=t):(n.width=t,n.height=o),this.paintImage(n.getContext("2d"),this.state.image,0,1),n}},{key:"getXScale",value:function(){var e=this.props.width/this.props.height,t=this.state.image.width/this.state.image.height;return Math.min(1,e/t)}},{key:"getYScale",value:function(){var e=this.props.height/this.props.width,t=this.state.image.height/this.state.image.width;return Math.min(1,e/t)}},{key:"getCroppingRect",value:function(){var e=this.props.position||{x:this.state.image.x,y:this.state.image.y},t=1/this.props.scale*this.getXScale(),o=1/this.props.scale*this.getYScale(),n={x:e.x-t/2,y:e.y-o/2,width:t,height:o},a=0,r=1-n.width,i=0,s=1-n.height;return(this.props.disableBoundaryChecks||1<t||1<o)&&(a=-n.width,i=-n.height,s=r=1),y(y({},n),{},{x:Math.max(a,Math.min(n.x,r)),y:Math.max(i,Math.min(n.y,s))})}},{key:"loadImage",value:function(e){var t;M&&e instanceof File?this.loadingImage=(t=e,new Promise(function(o,n){var e=new FileReader;e.onload=function(e){try{var t=v(e.target.result);o(t)}catch(e){n(e)}},e.readAsDataURL(t)}).then(this.handleImageReady).catch(this.props.onLoadFailure)):"string"==typeof e&&(this.loadingImage=v(e,this.props.crossOrigin).then(this.handleImageReady).catch(this.props.onLoadFailure))}},{key:"getInitialSize",value:function(e,t){var o,n,a=this.getDimensions();return t/e<a.height/a.width?n=e*((o=this.getDimensions().height)/t):o=t*((n=this.getDimensions().width)/e),{height:o,width:n}}},{key:"paintImage",value:function(e,t,o,n){var a,r=3<arguments.length&&void 0!==n?n:P;t.resource&&(a=this.calculatePosition(t,o),e.save(),e.translate(e.canvas.width/2,e.canvas.height/2),e.rotate(this.props.rotate*Math.PI/180),e.translate(-e.canvas.width/2,-e.canvas.height/2),this.isVertical()&&e.translate((e.canvas.width-e.canvas.height)/2,(e.canvas.height-e.canvas.width)/2),e.scale(r,r),e.globalCompositeOperation="destination-over",e.drawImage(t.resource,a.x,a.y,a.width,a.height),t.backgroundColor&&(e.fillStyle=t.backgroundColor,e.fillRect(a.x,a.y,a.width,a.height)),e.restore())}},{key:"calculatePosition",value:function(e,t){e=e||this.state.image;var o=m(this.getBorders(t),2),n=o[0],a=o[1],r=this.getCroppingRect(),i=e.width*this.props.scale,s=e.height*this.props.scale,u=-r.x*i,h=-r.y*s;return this.isVertical()?(u+=a,h+=n):(u+=n,h+=a),{x:u,y:h,height:s,width:i}}},{key:"paint",value:function(e){e.save(),e.scale(P,P),e.translate(0,0),e.fillStyle="rgba("+this.props.color.slice(0,4).join(",")+")";var t,o,n,a,r,i,s,u,h=this.props.borderRadius,c=this.getDimensions(),l=m(this.getBorders(c.border),2),d=l[0],p=l[1],g=c.canvas.height,f=c.canvas.width,h=Math.max(h,0);h=Math.min(h,f/2-d,g/2-p),e.beginPath(),t=e,a=f-2*(o=d),r=g-2*(n=p),0===(i=h)?t.rect(o,n,a,r):(s=a-i,u=r-i,t.translate(o,n),t.arc(i,i,i,Math.PI,1.5*Math.PI),t.lineTo(s,0),t.arc(s,i,i,1.5*Math.PI,2*Math.PI),t.lineTo(a,u),t.arc(s,u,i,2*Math.PI,.5*Math.PI),t.lineTo(i,r),t.arc(i,u,i,.5*Math.PI,Math.PI),t.translate(-o,-n)),e.rect(f,0,-f,g),e.fill("evenodd"),e.restore()}},{key:"render",value:function(){var e=this.props,t=(e.scale,e.rotate,e.image,e.border,e.borderRadius,e.width,e.height,e.position,e.color,e.backgroundColor,e.style),o=(e.crossOrigin,e.onLoadFailure,e.onLoadSuccess,e.onImageReady,e.onImageChange,e.onMouseUp,e.onMouseMove,e.onPositionChange,e.disableBoundaryChecks,e.disableHiDPIScaling,e.disableCanvasRotation,l(e,["scale","rotate","image","border","borderRadius","width","height","position","color","backgroundColor","style","crossOrigin","onLoadFailure","onLoadSuccess","onImageReady","onImageChange","onMouseUp","onMouseMove","onPositionChange","disableBoundaryChecks","disableHiDPIScaling","disableCanvasRotation"])),n=this.getDimensions(),a={width:n.canvas.width,height:n.canvas.height,cursor:this.state.drag?"grabbing":"grab",touchAction:"none"},r={width:n.canvas.width*P,height:n.canvas.height*P,style:y(y({},a),t)};return r[I.react.down]=this.handleMouseDown,w&&(r[I.react.mouseDown]=this.handleMouseDown),i.default.createElement("canvas",u({ref:this.setCanvas},r,o))}}])&&r(e.prototype,t),o&&r(e,o),a}();return s(x,"propTypes",{scale:n.default.number,rotate:n.default.number,image:n.default.oneOfType([n.default.string].concat(function(e){if(Array.isArray(e))return f(e)}(b=M?[n.default.instanceOf(File)]:[])||function(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}(b)||g(b)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}())),border:n.default.oneOfType([n.default.number,n.default.arrayOf(n.default.number)]),borderRadius:n.default.number,width:n.default.number,height:n.default.number,position:n.default.shape({x:n.default.number,y:n.default.number}),color:n.default.arrayOf(n.default.number),backgroundColor:n.default.string,crossOrigin:n.default.oneOf(["","anonymous","use-credentials"]),onLoadFailure:n.default.func,onLoadSuccess:n.default.func,onImageReady:n.default.func,onImageChange:n.default.func,onMouseUp:n.default.func,onMouseMove:n.default.func,onPositionChange:n.default.func,disableBoundaryChecks:n.default.bool,disableHiDPIScaling:n.default.bool,disableCanvasRotation:n.default.bool}),s(x,"defaultProps",{scale:1,rotate:0,border:25,borderRadius:0,width:200,height:200,color:[0,0,0,.5],onLoadFailure:function(){},onLoadSuccess:function(){},onImageReady:function(){},onImageChange:function(){},onMouseUp:function(){},onMouseMove:function(){},onPositionChange:function(){},disableBoundaryChecks:!1,disableHiDPIScaling:!1,disableCanvasRotation:!0}),x});


/***/ }),

/***/ 1113:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(__webpack_require__(0));

var _classnames = _interopRequireDefault(__webpack_require__(8));

var _rcInputNumber = _interopRequireDefault(__webpack_require__(1851));

var _icon = _interopRequireDefault(__webpack_require__(28));

var _configProvider = __webpack_require__(39);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var InputNumber =
/*#__PURE__*/
function (_React$Component) {
  _inherits(InputNumber, _React$Component);

  function InputNumber() {
    var _this;

    _classCallCheck(this, InputNumber);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InputNumber).apply(this, arguments));

    _this.saveInputNumber = function (inputNumberRef) {
      _this.inputNumberRef = inputNumberRef;
    };

    _this.renderInputNumber = function (_ref) {
      var _classNames;

      var getPrefixCls = _ref.getPrefixCls;

      var _a = _this.props,
          className = _a.className,
          size = _a.size,
          customizePrefixCls = _a.prefixCls,
          others = __rest(_a, ["className", "size", "prefixCls"]);

      var prefixCls = getPrefixCls('input-number', customizePrefixCls);
      var inputNumberClass = (0, _classnames["default"])((_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-lg"), size === 'large'), _defineProperty(_classNames, "".concat(prefixCls, "-sm"), size === 'small'), _classNames), className);
      var upIcon = React.createElement(_icon["default"], {
        type: "up",
        className: "".concat(prefixCls, "-handler-up-inner")
      });
      var downIcon = React.createElement(_icon["default"], {
        type: "down",
        className: "".concat(prefixCls, "-handler-down-inner")
      });
      return React.createElement(_rcInputNumber["default"], _extends({
        ref: _this.saveInputNumber,
        className: inputNumberClass,
        upHandler: upIcon,
        downHandler: downIcon,
        prefixCls: prefixCls
      }, others));
    };

    return _this;
  }

  _createClass(InputNumber, [{
    key: "focus",
    value: function focus() {
      this.inputNumberRef.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      this.inputNumberRef.blur();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_configProvider.ConfigConsumer, null, this.renderInputNumber);
    }
  }]);

  return InputNumber;
}(React.Component);

exports["default"] = InputNumber;
InputNumber.defaultProps = {
  step: 1
};
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 115:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GetUploadHistory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return GetUploadHistoryList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return GetUploadHistoryData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return GetUploadHistoryData1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return ModifyPubdate; });
/* harmony import */ var _Fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _Urls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function GetUploadHistory(_x) {
  return _GetUploadHistory.apply(this, arguments);
} // 新版上传历史页面API 获取上传历史记录

function _GetUploadHistory() {
  _GetUploadHistory = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(uploadID) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", Object(_Fetch__WEBPACK_IMPORTED_MODULE_0__[/* RestApiFetch */ "e"])(_Urls__WEBPACK_IMPORTED_MODULE_1__[/* default */ "b"].api_v3_storage.upload_detail(uploadID)));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _GetUploadHistory.apply(this, arguments);
}

function GetUploadHistoryList(state, page, pagesize) {
  var url = _Urls__WEBPACK_IMPORTED_MODULE_1__[/* default */ "b"].api_v3_storage.account_upload_history;
  var review_state = state;

  if (state === 'all') {
    review_state = -1;
  }

  return Object(_Fetch__WEBPACK_IMPORTED_MODULE_0__[/* RestApiFetch */ "e"])(url + '?review_state=' + review_state + '&page=' + page + '&page_size=' + pagesize);
} // 新版上传历史页面API 获取某条上传历史记录下的所有数据，按页返回

function GetUploadHistoryData(history_id, page, pageSize) {
  var url = _Urls__WEBPACK_IMPORTED_MODULE_1__[/* default */ "b"].api_v2_storage.get_history_data(history_id);

  if (page != null && pageSize != null) {
    url = url + '?page=' + page + '&page_size=' + pageSize;
  }

  return Object(_Fetch__WEBPACK_IMPORTED_MODULE_0__[/* RestApiFetch */ "e"])(url, 'GET');
} // 获取某条上传历史记录下的所有数据，只返回数据id

function GetUploadHistoryData1(history_id, meta_id_only) {
  var url = _Urls__WEBPACK_IMPORTED_MODULE_1__[/* default */ "b"].api_v2_storage.get_history_data(history_id);
  return Object(_Fetch__WEBPACK_IMPORTED_MODULE_0__[/* RestApiFetch */ "e"])(url + '?meta_id_only=' + meta_id_only, 'GET');
} //公开指定上传历史下的数据

function ModifyPubdate(history_id, public_date, public_range) {
  var url = _Urls__WEBPACK_IMPORTED_MODULE_1__[/* default */ "b"].api_v3_storage.modify_pubdate;
  return Object(_Fetch__WEBPACK_IMPORTED_MODULE_0__[/* JsonApiFetch */ "a"])(url, 'POST', {
    history_id: history_id,
    public_date: public_date,
    public_range: public_range
  });
}

/***/ }),

/***/ 1743:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85);
__webpack_require__(86);
__webpack_require__(87);
module.exports = __webpack_require__(1829);


/***/ }),

/***/ 1744:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1745:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1746:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(20);

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__(23);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(52);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(19);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(26);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _warning = __webpack_require__(119);

var _warning2 = _interopRequireDefault(_warning);

var _Track = __webpack_require__(1084);

var _Track2 = _interopRequireDefault(_Track);

var _createSlider = __webpack_require__(1085);

var _createSlider2 = _interopRequireDefault(_createSlider);

var _utils = __webpack_require__(809);

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint-disable react/prop-types */
var Slider = function (_React$Component) {
  (0, _inherits3['default'])(Slider, _React$Component);

  function Slider(props) {
    (0, _classCallCheck3['default'])(this, Slider);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (Slider.__proto__ || Object.getPrototypeOf(Slider)).call(this, props));

    _this.onEnd = function (force) {
      var dragging = _this.state.dragging;

      _this.removeDocumentEvents();
      if (dragging || force) {
        _this.props.onAfterChange(_this.getValue());
      }
      _this.setState({ dragging: false });
    };

    var defaultValue = props.defaultValue !== undefined ? props.defaultValue : props.min;
    var value = props.value !== undefined ? props.value : defaultValue;

    _this.state = {
      value: _this.trimAlignValue(value),
      dragging: false
    };

    (0, _warning2['default'])(!('minimumTrackStyle' in props), 'minimumTrackStyle will be deprecated, please use trackStyle instead.');
    (0, _warning2['default'])(!('maximumTrackStyle' in props), 'maximumTrackStyle will be deprecated, please use railStyle instead.');
    return _this;
  }

  (0, _createClass3['default'])(Slider, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (!('value' in this.props || 'min' in this.props || 'max' in this.props)) {
        return;
      }
      var _props = this.props,
          value = _props.value,
          onChange = _props.onChange;

      var theValue = value !== undefined ? value : prevState.value;
      var nextValue = this.trimAlignValue(theValue, this.props);
      if (nextValue !== prevState.value) {
        // eslint-disable-next-line
        this.setState({ value: nextValue });
        if (utils.isValueOutOfRange(theValue, this.props)) {
          onChange(nextValue);
        }
      }
    }
  }, {
    key: 'onChange',
    value: function onChange(state) {
      var props = this.props;
      var isNotControlled = !('value' in props);
      var nextState = state.value > this.props.max ? (0, _extends3['default'])({}, state, { value: this.props.max }) : state;
      if (isNotControlled) {
        this.setState(nextState);
      }

      var changedValue = nextState.value;
      props.onChange(changedValue);
    }
  }, {
    key: 'onStart',
    value: function onStart(position) {
      this.setState({ dragging: true });
      var props = this.props;
      var prevValue = this.getValue();
      props.onBeforeChange(prevValue);

      var value = this.calcValueByPos(position);
      this.startValue = value;
      this.startPosition = position;

      if (value === prevValue) return;

      this.prevMovedHandleIndex = 0;

      this.onChange({ value: value });
    }
  }, {
    key: 'onMove',
    value: function onMove(e, position) {
      utils.pauseEvent(e);
      var oldValue = this.state.value;

      var value = this.calcValueByPos(position);
      if (value === oldValue) return;

      this.onChange({ value: value });
    }
  }, {
    key: 'onKeyboard',
    value: function onKeyboard(e) {
      var _props2 = this.props,
          reverse = _props2.reverse,
          vertical = _props2.vertical;

      var valueMutator = utils.getKeyboardValueMutator(e, vertical, reverse);
      if (valueMutator) {
        utils.pauseEvent(e);
        var state = this.state;
        var oldValue = state.value;
        var mutatedValue = valueMutator(oldValue, this.props);
        var value = this.trimAlignValue(mutatedValue);
        if (value === oldValue) return;

        this.onChange({ value: value });
        this.props.onAfterChange(value);
        this.onEnd();
      }
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.state.value;
    }
  }, {
    key: 'getLowerBound',
    value: function getLowerBound() {
      return this.props.min;
    }
  }, {
    key: 'getUpperBound',
    value: function getUpperBound() {
      return this.state.value;
    }
  }, {
    key: 'trimAlignValue',
    value: function trimAlignValue(v) {
      var nextProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (v === null) {
        return null;
      }

      var mergedProps = (0, _extends3['default'])({}, this.props, nextProps);
      var val = utils.ensureValueInRange(v, mergedProps);
      return utils.ensureValuePrecision(val, mergedProps);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props3 = this.props,
          prefixCls = _props3.prefixCls,
          vertical = _props3.vertical,
          included = _props3.included,
          disabled = _props3.disabled,
          minimumTrackStyle = _props3.minimumTrackStyle,
          trackStyle = _props3.trackStyle,
          handleStyle = _props3.handleStyle,
          tabIndex = _props3.tabIndex,
          min = _props3.min,
          max = _props3.max,
          reverse = _props3.reverse,
          handleGenerator = _props3.handle;
      var _state = this.state,
          value = _state.value,
          dragging = _state.dragging;

      var offset = this.calcOffset(value);
      var handle = handleGenerator({
        className: prefixCls + '-handle',
        prefixCls: prefixCls,
        vertical: vertical,
        offset: offset,
        value: value,
        dragging: dragging,
        disabled: disabled,
        min: min,
        max: max,
        reverse: reverse,
        index: 0,
        tabIndex: tabIndex,
        style: handleStyle[0] || handleStyle,
        ref: function ref(h) {
          return _this2.saveHandle(0, h);
        }
      });

      var _trackStyle = trackStyle[0] || trackStyle;
      var track = _react2['default'].createElement(_Track2['default'], {
        className: prefixCls + '-track',
        vertical: vertical,
        included: included,
        offset: 0,
        reverse: reverse,
        length: offset,
        style: (0, _extends3['default'])({}, minimumTrackStyle, _trackStyle)
      });

      return { tracks: track, handles: handle };
    }
  }]);
  return Slider;
}(_react2['default'].Component);

Slider.propTypes = {
  defaultValue: _propTypes2['default'].number,
  value: _propTypes2['default'].number,
  disabled: _propTypes2['default'].bool,
  autoFocus: _propTypes2['default'].bool,
  tabIndex: _propTypes2['default'].number,
  reverse: _propTypes2['default'].bool,
  min: _propTypes2['default'].number,
  max: _propTypes2['default'].number
};
exports['default'] = (0, _createSlider2['default'])(Slider);
module.exports = exports['default'];

/***/ }),

/***/ 1747:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _getPrototypeOf = __webpack_require__(1748);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _getOwnPropertyDescriptor = __webpack_require__(1751);

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

  if (desc === undefined) {
    var parent = (0, _getPrototypeOf2.default)(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

/***/ }),

/***/ 1748:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(1749), __esModule: true };

/***/ }),

/***/ 1749:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1750);
module.exports = __webpack_require__(177).Object.getPrototypeOf;


/***/ }),

/***/ 1750:
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = __webpack_require__(438);
var $getPrototypeOf = __webpack_require__(1015);

__webpack_require__(1086)('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});


/***/ }),

/***/ 1751:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(1752), __esModule: true };

/***/ }),

/***/ 1752:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1753);
var $Object = __webpack_require__(177).Object;
module.exports = function getOwnPropertyDescriptor(it, key) {
  return $Object.getOwnPropertyDescriptor(it, key);
};


/***/ }),

/***/ 1753:
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = __webpack_require__(400);
var $getOwnPropertyDescriptor = __webpack_require__(768).f;

__webpack_require__(1086)('getOwnPropertyDescriptor', function () {
  return function getOwnPropertyDescriptor(it, key) {
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});


/***/ }),

/***/ 1754:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = __webpack_require__(42);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = __webpack_require__(20);

var _extends5 = _interopRequireDefault(_extends4);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = __webpack_require__(8);

var _classnames2 = _interopRequireDefault(_classnames);

var _warning = __webpack_require__(119);

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var calcPoints = function calcPoints(vertical, marks, dots, step, min, max) {
  (0, _warning2['default'])(dots ? step > 0 : true, '`Slider[step]` should be a positive number in order to make Slider[dots] work.');
  var points = Object.keys(marks).map(parseFloat).sort(function (a, b) {
    return a - b;
  });
  if (dots && step) {
    for (var i = min; i <= max; i += step) {
      if (points.indexOf(i) === -1) {
        points.push(i);
      }
    }
  }
  return points;
};

var Steps = function Steps(_ref) {
  var prefixCls = _ref.prefixCls,
      vertical = _ref.vertical,
      reverse = _ref.reverse,
      marks = _ref.marks,
      dots = _ref.dots,
      step = _ref.step,
      included = _ref.included,
      lowerBound = _ref.lowerBound,
      upperBound = _ref.upperBound,
      max = _ref.max,
      min = _ref.min,
      dotStyle = _ref.dotStyle,
      activeDotStyle = _ref.activeDotStyle;

  var range = max - min;
  var elements = calcPoints(vertical, marks, dots, step, min, max).map(function (point) {
    var _classNames;

    var offset = Math.abs(point - min) / range * 100 + '%';

    var isActived = !included && point === upperBound || included && point <= upperBound && point >= lowerBound;
    var style = vertical ? (0, _extends5['default'])({}, dotStyle, (0, _defineProperty3['default'])({}, reverse ? 'top' : 'bottom', offset)) : (0, _extends5['default'])({}, dotStyle, (0, _defineProperty3['default'])({}, reverse ? 'right' : 'left', offset));
    if (isActived) {
      style = (0, _extends5['default'])({}, style, activeDotStyle);
    }

    var pointClassName = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, prefixCls + '-dot', true), (0, _defineProperty3['default'])(_classNames, prefixCls + '-dot-active', isActived), (0, _defineProperty3['default'])(_classNames, prefixCls + '-dot-reverse', reverse), _classNames));

    return _react2['default'].createElement('span', { className: pointClassName, style: style, key: point });
  });

  return _react2['default'].createElement(
    'div',
    { className: prefixCls + '-step' },
    elements
  );
};

Steps.propTypes = {
  prefixCls: _propTypes2['default'].string,
  activeDotStyle: _propTypes2['default'].object,
  dotStyle: _propTypes2['default'].object,
  min: _propTypes2['default'].number,
  max: _propTypes2['default'].number,
  upperBound: _propTypes2['default'].number,
  lowerBound: _propTypes2['default'].number,
  included: _propTypes2['default'].bool,
  dots: _propTypes2['default'].bool,
  step: _propTypes2['default'].number,
  marks: _propTypes2['default'].object,
  vertical: _propTypes2['default'].bool,
  reverse: _propTypes2['default'].bool
};

exports['default'] = Steps;
module.exports = exports['default'];

/***/ }),

/***/ 1755:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(20);

var _extends3 = _interopRequireDefault(_extends2);

var _defineProperty2 = __webpack_require__(42);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = __webpack_require__(8);

var _classnames2 = _interopRequireDefault(_classnames);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var Marks = function Marks(_ref) {
  var className = _ref.className,
      vertical = _ref.vertical,
      reverse = _ref.reverse,
      marks = _ref.marks,
      included = _ref.included,
      upperBound = _ref.upperBound,
      lowerBound = _ref.lowerBound,
      max = _ref.max,
      min = _ref.min,
      onClickLabel = _ref.onClickLabel;

  var marksKeys = Object.keys(marks);

  var range = max - min;
  var elements = marksKeys.map(parseFloat).sort(function (a, b) {
    return a - b;
  }).map(function (point) {
    var _classNames;

    var markPoint = marks[point];
    var markPointIsObject = typeof markPoint === 'object' && !_react2['default'].isValidElement(markPoint);
    var markLabel = markPointIsObject ? markPoint.label : markPoint;
    if (!markLabel && markLabel !== 0) {
      return null;
    }

    var isActive = !included && point === upperBound || included && point <= upperBound && point >= lowerBound;
    var markClassName = (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, className + '-text', true), (0, _defineProperty3['default'])(_classNames, className + '-text-active', isActive), _classNames));

    var bottomStyle = (0, _defineProperty3['default'])({
      marginBottom: '-50%'
    }, reverse ? 'top' : 'bottom', (point - min) / range * 100 + '%');

    var leftStyle = (0, _defineProperty3['default'])({
      transform: 'translateX(-50%)',
      msTransform: 'translateX(-50%)'
    }, reverse ? 'right' : 'left', reverse ? (point - min / 4) / range * 100 + '%' : (point - min) / range * 100 + '%');

    var style = vertical ? bottomStyle : leftStyle;
    var markStyle = markPointIsObject ? (0, _extends3['default'])({}, style, markPoint.style) : style;
    return _react2['default'].createElement(
      'span',
      {
        className: markClassName,
        style: markStyle,
        key: point,
        onMouseDown: function onMouseDown(e) {
          return onClickLabel(e, point);
        },
        onTouchStart: function onTouchStart(e) {
          return onClickLabel(e, point);
        }
      },
      markLabel
    );
  });

  return _react2['default'].createElement(
    'div',
    { className: className },
    elements
  );
};

Marks.propTypes = {
  className: _propTypes2['default'].string,
  vertical: _propTypes2['default'].bool,
  reverse: _propTypes2['default'].bool,
  marks: _propTypes2['default'].object,
  included: _propTypes2['default'].bool,
  upperBound: _propTypes2['default'].number,
  lowerBound: _propTypes2['default'].number,
  max: _propTypes2['default'].number,
  min: _propTypes2['default'].number,
  onClickLabel: _propTypes2['default'].func
};

exports['default'] = Marks;
module.exports = exports['default'];

/***/ }),

/***/ 1756:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = __webpack_require__(42);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = __webpack_require__(20);

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = __webpack_require__(620);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = __webpack_require__(23);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(52);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(19);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(26);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _classnames = __webpack_require__(8);

var _classnames2 = _interopRequireDefault(_classnames);

var _reactLifecyclesCompat = __webpack_require__(36);

var _shallowequal = __webpack_require__(78);

var _shallowequal2 = _interopRequireDefault(_shallowequal);

var _Track = __webpack_require__(1084);

var _Track2 = _interopRequireDefault(_Track);

var _createSlider = __webpack_require__(1085);

var _createSlider2 = _interopRequireDefault(_createSlider);

var _utils = __webpack_require__(809);

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/* eslint-disable react/prop-types */
var _trimAlignValue = function _trimAlignValue(_ref) {
  var value = _ref.value,
      handle = _ref.handle,
      bounds = _ref.bounds,
      props = _ref.props;
  var allowCross = props.allowCross,
      pushable = props.pushable;

  var thershold = Number(pushable);
  var valInRange = utils.ensureValueInRange(value, props);
  var valNotConflict = valInRange;
  if (!allowCross && handle != null && bounds !== undefined) {
    if (handle > 0 && valInRange <= bounds[handle - 1] + thershold) {
      valNotConflict = bounds[handle - 1] + thershold;
    }
    if (handle < bounds.length - 1 && valInRange >= bounds[handle + 1] - thershold) {
      valNotConflict = bounds[handle + 1] - thershold;
    }
  }
  return utils.ensureValuePrecision(valNotConflict, props);
};

var Range = function (_React$Component) {
  (0, _inherits3['default'])(Range, _React$Component);

  function Range(props) {
    (0, _classCallCheck3['default'])(this, Range);

    var _this = (0, _possibleConstructorReturn3['default'])(this, (Range.__proto__ || Object.getPrototypeOf(Range)).call(this, props));

    _this.onEnd = function (force) {
      var handle = _this.state.handle;

      _this.removeDocumentEvents();

      if (handle !== null || force) {
        _this.props.onAfterChange(_this.getValue());
      }

      _this.setState({
        handle: null
      });
    };

    var count = props.count,
        min = props.min,
        max = props.max;

    var initialValue = Array.apply(undefined, (0, _toConsumableArray3['default'])(Array(count + 1))).map(function () {
      return min;
    });
    var defaultValue = 'defaultValue' in props ? props.defaultValue : initialValue;
    var value = props.value !== undefined ? props.value : defaultValue;
    var bounds = value.map(function (v, i) {
      return _trimAlignValue({
        value: v,
        handle: i,
        props: props
      });
    });
    var recent = bounds[0] === max ? 0 : bounds.length - 1;

    _this.state = {
      handle: null,
      recent: recent,
      bounds: bounds
    };
    return _this;
  }

  (0, _createClass3['default'])(Range, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var _this2 = this;

      if (!('value' in this.props || 'min' in this.props || 'max' in this.props)) {
        return;
      }
      if (this.props.min === prevProps.min && this.props.max === prevProps.max && (0, _shallowequal2['default'])(this.props.value, prevProps.value)) {
        return;
      }
      var _props = this.props,
          onChange = _props.onChange,
          value = _props.value;

      var currentValue = value || prevState.bounds;
      if (currentValue.some(function (v) {
        return utils.isValueOutOfRange(v, _this2.props);
      })) {
        var newValues = currentValue.map(function (v) {
          return utils.ensureValueInRange(v, _this2.props);
        });
        onChange(newValues);
      }
    }
  }, {
    key: 'onChange',
    value: function onChange(state) {
      var props = this.props;
      var isNotControlled = !('value' in props);
      if (isNotControlled) {
        this.setState(state);
      } else {
        var controlledState = {};

        ['handle', 'recent'].forEach(function (item) {
          if (state[item] !== undefined) {
            controlledState[item] = state[item];
          }
        });

        if (Object.keys(controlledState).length) {
          this.setState(controlledState);
        }
      }

      var data = (0, _extends3['default'])({}, this.state, state);
      var changedValue = data.bounds;
      props.onChange(changedValue);
    }
  }, {
    key: 'onStart',
    value: function onStart(position) {
      var props = this.props;
      var state = this.state;
      var bounds = this.getValue();
      props.onBeforeChange(bounds);

      var value = this.calcValueByPos(position);
      this.startValue = value;
      this.startPosition = position;

      var closestBound = this.getClosestBound(value);
      this.prevMovedHandleIndex = this.getBoundNeedMoving(value, closestBound);

      this.setState({
        handle: this.prevMovedHandleIndex,
        recent: this.prevMovedHandleIndex
      });

      var prevValue = bounds[this.prevMovedHandleIndex];
      if (value === prevValue) return;

      var nextBounds = [].concat((0, _toConsumableArray3['default'])(state.bounds));
      nextBounds[this.prevMovedHandleIndex] = value;
      this.onChange({ bounds: nextBounds });
    }
  }, {
    key: 'onMove',
    value: function onMove(e, position) {
      utils.pauseEvent(e);
      var state = this.state;

      var value = this.calcValueByPos(position);
      var oldValue = state.bounds[state.handle];
      if (value === oldValue) return;

      this.moveTo(value);
    }
  }, {
    key: 'onKeyboard',
    value: function onKeyboard(e) {
      var _props2 = this.props,
          reverse = _props2.reverse,
          vertical = _props2.vertical;

      var valueMutator = utils.getKeyboardValueMutator(e, vertical, reverse);

      if (valueMutator) {
        utils.pauseEvent(e);
        var state = this.state,
            props = this.props;
        var bounds = state.bounds,
            handle = state.handle;

        var oldValue = bounds[handle === null ? state.recent : handle];
        var mutatedValue = valueMutator(oldValue, props);
        var value = _trimAlignValue({
          value: mutatedValue,
          handle: handle,
          bounds: state.bounds,
          props: props
        });
        if (value === oldValue) return;
        var isFromKeyboardEvent = true;
        this.moveTo(value, isFromKeyboardEvent);
      }
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.state.bounds;
    }
  }, {
    key: 'getClosestBound',
    value: function getClosestBound(value) {
      var bounds = this.state.bounds;

      var closestBound = 0;
      for (var i = 1; i < bounds.length - 1; ++i) {
        if (value >= bounds[i]) {
          closestBound = i;
        }
      }
      if (Math.abs(bounds[closestBound + 1] - value) < Math.abs(bounds[closestBound] - value)) {
        closestBound += 1;
      }
      return closestBound;
    }
  }, {
    key: 'getBoundNeedMoving',
    value: function getBoundNeedMoving(value, closestBound) {
      var _state = this.state,
          bounds = _state.bounds,
          recent = _state.recent;

      var boundNeedMoving = closestBound;
      var isAtTheSamePoint = bounds[closestBound + 1] === bounds[closestBound];

      if (isAtTheSamePoint && bounds[recent] === bounds[closestBound]) {
        boundNeedMoving = recent;
      }

      if (isAtTheSamePoint && value !== bounds[closestBound + 1]) {
        boundNeedMoving = value < bounds[closestBound + 1] ? closestBound : closestBound + 1;
      }
      return boundNeedMoving;
    }
  }, {
    key: 'getLowerBound',
    value: function getLowerBound() {
      return this.state.bounds[0];
    }
  }, {
    key: 'getUpperBound',
    value: function getUpperBound() {
      var bounds = this.state.bounds;

      return bounds[bounds.length - 1];
    }

    /**
     * Returns an array of possible slider points, taking into account both
     * `marks` and `step`. The result is cached.
     */

  }, {
    key: 'getPoints',
    value: function getPoints() {
      var _props3 = this.props,
          marks = _props3.marks,
          step = _props3.step,
          min = _props3.min,
          max = _props3.max;

      var cache = this._getPointsCache;
      if (!cache || cache.marks !== marks || cache.step !== step) {
        var pointsObject = (0, _extends3['default'])({}, marks);
        if (step !== null) {
          for (var point = min; point <= max; point += step) {
            pointsObject[point] = point;
          }
        }
        var points = Object.keys(pointsObject).map(parseFloat);
        points.sort(function (a, b) {
          return a - b;
        });
        this._getPointsCache = { marks: marks, step: step, points: points };
      }
      return this._getPointsCache.points;
    }
  }, {
    key: 'moveTo',
    value: function moveTo(value, isFromKeyboardEvent) {
      var _this3 = this;

      var state = this.state,
          props = this.props;

      var nextBounds = [].concat((0, _toConsumableArray3['default'])(state.bounds));
      var handle = state.handle === null ? state.recent : state.handle;
      nextBounds[handle] = value;
      var nextHandle = handle;
      if (props.pushable !== false) {
        this.pushSurroundingHandles(nextBounds, nextHandle);
      } else if (props.allowCross) {
        nextBounds.sort(function (a, b) {
          return a - b;
        });
        nextHandle = nextBounds.indexOf(value);
      }
      this.onChange({
        recent: nextHandle,
        handle: nextHandle,
        bounds: nextBounds
      });
      if (isFromKeyboardEvent) {
        // known problem: because setState is async,
        // so trigger focus will invoke handler's onEnd and another handler's onStart too early,
        // cause onBeforeChange and onAfterChange receive wrong value.
        // here use setState callback to hack，but not elegant
        this.props.onAfterChange(nextBounds);
        this.setState({}, function () {
          _this3.handlesRefs[nextHandle].focus();
        });
        this.onEnd();
      }
    }
  }, {
    key: 'pushSurroundingHandles',
    value: function pushSurroundingHandles(bounds, handle) {
      var value = bounds[handle];
      var threshold = this.props.pushable;

      threshold = Number(threshold);

      var direction = 0;
      if (bounds[handle + 1] - value < threshold) {
        direction = +1; // push to right
      }
      if (value - bounds[handle - 1] < threshold) {
        direction = -1; // push to left
      }

      if (direction === 0) {
        return;
      }

      var nextHandle = handle + direction;
      var diffToNext = direction * (bounds[nextHandle] - value);
      if (!this.pushHandle(bounds, nextHandle, direction, threshold - diffToNext)) {
        // revert to original value if pushing is impossible
        bounds[handle] = bounds[nextHandle] - direction * threshold;
      }
    }
  }, {
    key: 'pushHandle',
    value: function pushHandle(bounds, handle, direction, amount) {
      var originalValue = bounds[handle];
      var currentValue = bounds[handle];
      while (direction * (currentValue - originalValue) < amount) {
        if (!this.pushHandleOnePoint(bounds, handle, direction)) {
          // can't push handle enough to create the needed `amount` gap, so we
          // revert its position to the original value
          bounds[handle] = originalValue;
          return false;
        }
        currentValue = bounds[handle];
      }
      // the handle was pushed enough to create the needed `amount` gap
      return true;
    }
  }, {
    key: 'pushHandleOnePoint',
    value: function pushHandleOnePoint(bounds, handle, direction) {
      var points = this.getPoints();
      var pointIndex = points.indexOf(bounds[handle]);
      var nextPointIndex = pointIndex + direction;
      if (nextPointIndex >= points.length || nextPointIndex < 0) {
        // reached the minimum or maximum available point, can't push anymore
        return false;
      }
      var nextHandle = handle + direction;
      var nextValue = points[nextPointIndex];
      var threshold = this.props.pushable;

      var diffToNext = direction * (bounds[nextHandle] - nextValue);
      if (!this.pushHandle(bounds, nextHandle, direction, threshold - diffToNext)) {
        // couldn't push next handle, so we won't push this one either
        return false;
      }
      // push the handle
      bounds[handle] = nextValue;
      return true;
    }
  }, {
    key: 'trimAlignValue',
    value: function trimAlignValue(value) {
      var _state2 = this.state,
          handle = _state2.handle,
          bounds = _state2.bounds;

      return _trimAlignValue({
        value: value,
        handle: handle,
        bounds: bounds,
        props: this.props
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _state3 = this.state,
          handle = _state3.handle,
          bounds = _state3.bounds;
      var _props4 = this.props,
          prefixCls = _props4.prefixCls,
          vertical = _props4.vertical,
          included = _props4.included,
          disabled = _props4.disabled,
          min = _props4.min,
          max = _props4.max,
          reverse = _props4.reverse,
          handleGenerator = _props4.handle,
          trackStyle = _props4.trackStyle,
          handleStyle = _props4.handleStyle,
          tabIndex = _props4.tabIndex;


      var offsets = bounds.map(function (v) {
        return _this4.calcOffset(v);
      });

      var handleClassName = prefixCls + '-handle';
      var handles = bounds.map(function (v, i) {
        var _classNames;

        var _tabIndex = tabIndex[i] || 0;
        if (disabled || tabIndex[i] === null) {
          _tabIndex = null;
        }
        return handleGenerator({
          className: (0, _classnames2['default'])((_classNames = {}, (0, _defineProperty3['default'])(_classNames, handleClassName, true), (0, _defineProperty3['default'])(_classNames, handleClassName + '-' + (i + 1), true), _classNames)),
          prefixCls: prefixCls,
          vertical: vertical,
          offset: offsets[i],
          value: v,
          dragging: handle === i,
          index: i,
          tabIndex: _tabIndex,
          min: min,
          max: max,
          reverse: reverse,
          disabled: disabled,
          style: handleStyle[i],
          ref: function ref(h) {
            return _this4.saveHandle(i, h);
          }
        });
      });

      var tracks = bounds.slice(0, -1).map(function (_, index) {
        var _classNames2;

        var i = index + 1;
        var trackClassName = (0, _classnames2['default'])((_classNames2 = {}, (0, _defineProperty3['default'])(_classNames2, prefixCls + '-track', true), (0, _defineProperty3['default'])(_classNames2, prefixCls + '-track-' + i, true), _classNames2));
        return _react2['default'].createElement(_Track2['default'], {
          className: trackClassName,
          vertical: vertical,
          reverse: reverse,
          included: included,
          offset: offsets[i - 1],
          length: offsets[i] - offsets[i - 1],
          style: trackStyle[index],
          key: i
        });
      });

      return { tracks: tracks, handles: handles };
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(props, state) {
      if ('value' in props || 'min' in props || 'max' in props) {
        var value = props.value || state.bounds;
        var nextBounds = value.map(function (v, i) {
          return _trimAlignValue({
            value: v,
            handle: i,
            bounds: state.bounds,
            props: props
          });
        });
        if (nextBounds.length === state.bounds.length && nextBounds.every(function (v, i) {
          return v === state.bounds[i];
        })) {
          return null;
        }
        return (0, _extends3['default'])({}, state, {
          bounds: nextBounds
        });
      }
      return null;
    }
  }]);
  return Range;
}(_react2['default'].Component);

Range.displayName = 'Range';
Range.propTypes = {
  autoFocus: _propTypes2['default'].bool,
  defaultValue: _propTypes2['default'].arrayOf(_propTypes2['default'].number),
  value: _propTypes2['default'].arrayOf(_propTypes2['default'].number),
  count: _propTypes2['default'].number,
  pushable: _propTypes2['default'].oneOfType([_propTypes2['default'].bool, _propTypes2['default'].number]),
  allowCross: _propTypes2['default'].bool,
  disabled: _propTypes2['default'].bool,
  reverse: _propTypes2['default'].bool,
  tabIndex: _propTypes2['default'].arrayOf(_propTypes2['default'].number),
  min: _propTypes2['default'].number,
  max: _propTypes2['default'].number
};
Range.defaultProps = {
  count: 1,
  allowCross: true,
  pushable: false,
  tabIndex: []
};


(0, _reactLifecyclesCompat.polyfill)(Range);

exports['default'] = (0, _createSlider2['default'])(Range);
module.exports = exports['default'];

/***/ }),

/***/ 1757:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1758:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(55);

__webpack_require__(1759);

__webpack_require__(138);

__webpack_require__(56);
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 1759:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1760:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fillRef = fillRef;
exports.composeRef = composeRef;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function fillRef(ref, node) {
  if (typeof ref === 'function') {
    ref(node);
  } else if (_typeof(ref) === 'object' && ref && 'current' in ref) {
    ref.current = node;
  }
}

function composeRef() {
  for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
    refs[_key] = arguments[_key];
  }

  return function (node) {
    refs.forEach(function (ref) {
      fillRef(ref, node);
    });
  };
}
//# sourceMappingURL=ref.js.map


/***/ }),

/***/ 1761:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(__webpack_require__(0));

var _warning = _interopRequireDefault(__webpack_require__(91));

var _Base = _interopRequireDefault(__webpack_require__(855));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var Text = function Text(_a) {
  var ellipsis = _a.ellipsis,
      restProps = __rest(_a, ["ellipsis"]);

  (0, _warning["default"])(_typeof(ellipsis) !== 'object', 'Typography.Text', '`ellipsis` only supports boolean value.');
  return React.createElement(_Base["default"], _extends({}, restProps, {
    ellipsis: !!ellipsis,
    component: "span"
  }));
};

var _default = Text;
exports["default"] = _default;
//# sourceMappingURL=Text.js.map


/***/ }),

/***/ 1762:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var deselectCurrent = __webpack_require__(1763);

var clipboardToIE11Formatting = {
  "text/plain": "Text",
  "text/html": "Url",
  "default": "Text"
}

var defaultMessage = "Copy to clipboard: #{key}, Enter";

function format(message) {
  var copyKey = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
  return message.replace(/#{\s*key\s*}/g, copyKey);
}

function copy(text, options) {
  var debug,
    message,
    reselectPrevious,
    range,
    selection,
    mark,
    success = false;
  if (!options) {
    options = {};
  }
  debug = options.debug || false;
  try {
    reselectPrevious = deselectCurrent();

    range = document.createRange();
    selection = document.getSelection();

    mark = document.createElement("span");
    mark.textContent = text;
    // reset user styles for span element
    mark.style.all = "unset";
    // prevents scrolling to the end of the page
    mark.style.position = "fixed";
    mark.style.top = 0;
    mark.style.clip = "rect(0, 0, 0, 0)";
    // used to preserve spaces and line breaks
    mark.style.whiteSpace = "pre";
    // do not inherit user-select (it may be `none`)
    mark.style.webkitUserSelect = "text";
    mark.style.MozUserSelect = "text";
    mark.style.msUserSelect = "text";
    mark.style.userSelect = "text";
    mark.addEventListener("copy", function(e) {
      e.stopPropagation();
      if (options.format) {
        e.preventDefault();
        if (typeof e.clipboardData === "undefined") { // IE 11
          debug && console.warn("unable to use e.clipboardData");
          debug && console.warn("trying IE specific stuff");
          window.clipboardData.clearData();
          var format = clipboardToIE11Formatting[options.format] || clipboardToIE11Formatting["default"]
          window.clipboardData.setData(format, text);
        } else { // all other browsers
          e.clipboardData.clearData();
          e.clipboardData.setData(options.format, text);
        }
      }
      if (options.onCopy) {
        e.preventDefault();
        options.onCopy(e.clipboardData);
      }
    });

    document.body.appendChild(mark);

    range.selectNodeContents(mark);
    selection.addRange(range);

    var successful = document.execCommand("copy");
    if (!successful) {
      throw new Error("copy command was unsuccessful");
    }
    success = true;
  } catch (err) {
    debug && console.error("unable to copy using execCommand: ", err);
    debug && console.warn("trying IE specific stuff");
    try {
      window.clipboardData.setData(options.format || "text", text);
      options.onCopy && options.onCopy(window.clipboardData);
      success = true;
    } catch (err) {
      debug && console.error("unable to copy using clipboardData: ", err);
      debug && console.error("falling back to prompt");
      message = format("message" in options ? options.message : defaultMessage);
      window.prompt(message, text);
    }
  } finally {
    if (selection) {
      if (typeof selection.removeRange == "function") {
        selection.removeRange(range);
      } else {
        selection.removeAllRanges();
      }
    }

    if (mark) {
      document.body.removeChild(mark);
    }
    reselectPrevious();
  }

  return success;
}

module.exports = copy;


/***/ }),

/***/ 1763:
/***/ (function(module, exports) {


module.exports = function () {
  var selection = document.getSelection();
  if (!selection.rangeCount) {
    return function () {};
  }
  var active = document.activeElement;

  var ranges = [];
  for (var i = 0; i < selection.rangeCount; i++) {
    ranges.push(selection.getRangeAt(i));
  }

  switch (active.tagName.toUpperCase()) { // .toUpperCase handles XHTML
    case 'INPUT':
    case 'TEXTAREA':
      active.blur();
      break;

    default:
      active = null;
      break;
  }

  selection.removeAllRanges();
  return function () {
    selection.type === 'Caret' &&
    selection.removeAllRanges();

    if (!selection.rangeCount) {
      ranges.forEach(function(range) {
        selection.addRange(range);
      });
    }

    active &&
    active.focus();
  };
};


/***/ }),

/***/ 1764:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(__webpack_require__(0));

var _KeyCode = _interopRequireDefault(__webpack_require__(407));

var _classnames = _interopRequireDefault(__webpack_require__(8));

var _reactLifecyclesCompat = __webpack_require__(36);

var _icon = _interopRequireDefault(__webpack_require__(28));

var _TextArea = _interopRequireDefault(__webpack_require__(1052));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Editable =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Editable, _React$Component);

  function Editable() {
    var _this;

    _classCallCheck(this, Editable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Editable).apply(this, arguments));
    _this.inComposition = false;
    _this.state = {
      current: ''
    };

    _this.onChange = function (_ref) {
      var value = _ref.target.value;

      _this.setState({
        current: value.replace(/[\r\n]/g, '')
      });
    };

    _this.onCompositionStart = function () {
      _this.inComposition = true;
    };

    _this.onCompositionEnd = function () {
      _this.inComposition = false;
    };

    _this.onKeyDown = function (_ref2) {
      var keyCode = _ref2.keyCode;
      // We don't record keyCode when IME is using
      if (_this.inComposition) return;
      _this.lastKeyCode = keyCode;
    };

    _this.onKeyUp = function (_ref3) {
      var keyCode = _ref3.keyCode,
          ctrlKey = _ref3.ctrlKey,
          altKey = _ref3.altKey,
          metaKey = _ref3.metaKey,
          shiftKey = _ref3.shiftKey;
      var onCancel = _this.props.onCancel; // Check if it's a real key

      if (_this.lastKeyCode === keyCode && !_this.inComposition && !ctrlKey && !altKey && !metaKey && !shiftKey) {
        if (keyCode === _KeyCode["default"].ENTER) {
          _this.confirmChange();
        } else if (keyCode === _KeyCode["default"].ESC) {
          onCancel();
        }
      }
    };

    _this.onBlur = function () {
      _this.confirmChange();
    };

    _this.confirmChange = function () {
      var current = _this.state.current;
      var onSave = _this.props.onSave;
      onSave(current.trim());
    };

    _this.setTextarea = function (textarea) {
      _this.textarea = textarea;
    };

    return _this;
  }

  _createClass(Editable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.textarea) {
        this.textarea.focus();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var current = this.state.current;
      var _this$props = this.props,
          prefixCls = _this$props.prefixCls,
          ariaLabel = _this$props['aria-label'],
          className = _this$props.className,
          style = _this$props.style;
      return React.createElement("div", {
        className: (0, _classnames["default"])(prefixCls, "".concat(prefixCls, "-edit-content"), className),
        style: style
      }, React.createElement(_TextArea["default"], {
        ref: this.setTextarea,
        value: current,
        onChange: this.onChange,
        onKeyDown: this.onKeyDown,
        onKeyUp: this.onKeyUp,
        onCompositionStart: this.onCompositionStart,
        onCompositionEnd: this.onCompositionEnd,
        onBlur: this.onBlur,
        "aria-label": ariaLabel,
        autoSize: true
      }), React.createElement(_icon["default"], {
        type: "enter",
        className: "".concat(prefixCls, "-edit-content-confirm")
      }));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var prevValue = prevState.prevValue;
      var value = nextProps.value;
      var newState = {
        prevValue: value
      };

      if (prevValue !== value) {
        newState.current = value;
      }

      return newState;
    }
  }]);

  return Editable;
}(React.Component);

(0, _reactLifecyclesCompat.polyfill)(Editable);
var _default = Editable;
exports["default"] = _default;
//# sourceMappingURL=Editable.js.map


/***/ }),

/***/ 1765:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _reactDom = __webpack_require__(11);

var React = _interopRequireWildcard(__webpack_require__(0));

var _toArray = _interopRequireDefault(__webpack_require__(441));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// We only handle element & text node.
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
var ellipsisContainer;
var wrapperStyle = {
  padding: 0,
  margin: 0,
  display: 'inline',
  lineHeight: 'inherit'
};

function pxToNumber(value) {
  if (!value) return 0;
  var match = value.match(/^\d*(\.\d*)?/);
  return match ? Number(match[0]) : 0;
}

function styleToString(style) {
  // There are some different behavior between Firefox & Chrome.
  // We have to handle this ourself.
  var styleNames = Array.prototype.slice.apply(style);
  return styleNames.map(function (name) {
    return "".concat(name, ": ").concat(style.getPropertyValue(name), ";");
  }).join('');
}

function mergeChildren(children) {
  var childList = [];
  children.forEach(function (child) {
    var prevChild = childList[childList.length - 1];

    if (typeof child === 'string' && typeof prevChild === 'string') {
      childList[childList.length - 1] += child;
    } else {
      childList.push(child);
    }
  });
  return childList;
}

var _default = function _default(originEle, rows, content, fixedContent, ellipsisStr) {
  if (!ellipsisContainer) {
    ellipsisContainer = document.createElement('div');
    ellipsisContainer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ellipsisContainer);
  } // Get origin style


  var originStyle = window.getComputedStyle(originEle);
  var originCSS = styleToString(originStyle);
  var lineHeight = pxToNumber(originStyle.lineHeight);
  var maxHeight = lineHeight * (rows + 1) + pxToNumber(originStyle.paddingTop) + pxToNumber(originStyle.paddingBottom); // Set shadow

  ellipsisContainer.setAttribute('style', originCSS);
  ellipsisContainer.style.position = 'fixed';
  ellipsisContainer.style.left = '0';
  ellipsisContainer.style.height = 'auto';
  ellipsisContainer.style.minHeight = 'auto';
  ellipsisContainer.style.maxHeight = 'auto';
  ellipsisContainer.style.top = '-999999px';
  ellipsisContainer.style.zIndex = '-1000'; // clean up css overflow

  ellipsisContainer.style.textOverflow = 'clip';
  ellipsisContainer.style.whiteSpace = 'normal';
  ellipsisContainer.style.webkitLineClamp = 'none'; // Render in the fake container

  var contentList = mergeChildren((0, _toArray["default"])(content));
  (0, _reactDom.render)(React.createElement("div", {
    style: wrapperStyle
  }, React.createElement("span", {
    style: wrapperStyle
  }, contentList), React.createElement("span", {
    style: wrapperStyle
  }, fixedContent)), ellipsisContainer); // wrap in an div for old version react
  // Check if ellipsis in measure div is height enough for content

  function inRange() {
    return ellipsisContainer.offsetHeight < maxHeight;
  } // Skip ellipsis if already match


  if (inRange()) {
    (0, _reactDom.unmountComponentAtNode)(ellipsisContainer);
    return {
      content: content,
      text: ellipsisContainer.innerHTML,
      ellipsis: false
    };
  } // We should clone the childNode since they're controlled by React and we can't reuse it without warning


  var childNodes = Array.prototype.slice.apply(ellipsisContainer.childNodes[0].childNodes[0].cloneNode(true).childNodes).filter(function (_ref) {
    var nodeType = _ref.nodeType;
    return nodeType !== COMMENT_NODE;
  });
  var fixedNodes = Array.prototype.slice.apply(ellipsisContainer.childNodes[0].childNodes[1].cloneNode(true).childNodes);
  (0, _reactDom.unmountComponentAtNode)(ellipsisContainer); // ========================= Find match ellipsis content =========================

  var ellipsisChildren = [];
  ellipsisContainer.innerHTML = ''; // Create origin content holder

  var ellipsisContentHolder = document.createElement('span');
  ellipsisContainer.appendChild(ellipsisContentHolder);
  var ellipsisTextNode = document.createTextNode(ellipsisStr);
  ellipsisContentHolder.appendChild(ellipsisTextNode);
  fixedNodes.forEach(function (childNode) {
    ellipsisContainer.appendChild(childNode);
  }); // Append before fixed nodes

  function appendChildNode(node) {
    ellipsisContentHolder.insertBefore(node, ellipsisTextNode);
  } // Get maximum text


  function measureText(textNode, fullText) {
    var startLoc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var endLoc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : fullText.length;
    var lastSuccessLoc = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    var midLoc = Math.floor((startLoc + endLoc) / 2);
    var currentText = fullText.slice(0, midLoc);
    textNode.textContent = currentText;

    if (startLoc >= endLoc - 1) {
      // Loop when step is small
      for (var step = endLoc; step >= startLoc; step -= 1) {
        var currentStepText = fullText.slice(0, step);
        textNode.textContent = currentStepText;

        if (inRange()) {
          return step === fullText.length ? {
            finished: false,
            reactNode: fullText
          } : {
            finished: true,
            reactNode: currentStepText
          };
        }
      }
    }

    if (inRange()) {
      return measureText(textNode, fullText, midLoc, endLoc, midLoc);
    }

    return measureText(textNode, fullText, startLoc, midLoc, lastSuccessLoc);
  }

  function measureNode(childNode, index) {
    var type = childNode.nodeType;

    if (type === ELEMENT_NODE) {
      // We don't split element, it will keep if whole element can be displayed.
      appendChildNode(childNode);

      if (inRange()) {
        return {
          finished: false,
          reactNode: contentList[index]
        };
      } // Clean up if can not pull in


      ellipsisContentHolder.removeChild(childNode);
      return {
        finished: true,
        reactNode: null
      };
    }

    if (type === TEXT_NODE) {
      var fullText = childNode.textContent || '';
      var textNode = document.createTextNode(fullText);
      appendChildNode(textNode);
      return measureText(textNode, fullText);
    } // Not handle other type of content
    // PS: This code should not be attached after react 16


    return {
      finished: false,
      reactNode: null
    };
  }

  childNodes.some(function (childNode, index) {
    var _measureNode = measureNode(childNode, index),
        finished = _measureNode.finished,
        reactNode = _measureNode.reactNode;

    if (reactNode) {
      ellipsisChildren.push(reactNode);
    }

    return finished;
  });
  return {
    content: ellipsisChildren,
    text: ellipsisContainer.innerHTML,
    ellipsis: true
  };
};

exports["default"] = _default;
//# sourceMappingURL=util.js.map


/***/ }),

/***/ 1766:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(__webpack_require__(0));

var _warning = _interopRequireDefault(__webpack_require__(119));

var _Base = _interopRequireDefault(__webpack_require__(855));

var _type = __webpack_require__(188);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var TITLE_ELE_LIST = (0, _type.tupleNum)(1, 2, 3, 4);

var Title = function Title(props) {
  var _props$level = props.level,
      level = _props$level === void 0 ? 1 : _props$level,
      restProps = __rest(props, ["level"]);

  var component;

  if (TITLE_ELE_LIST.indexOf(level) !== -1) {
    component = "h".concat(level);
  } else {
    (0, _warning["default"])(false, 'Title only accept `1 | 2 | 3 | 4` as `level` value.');
    component = 'h1';
  }

  return React.createElement(_Base["default"], _extends({}, restProps, {
    component: component
  }));
};

var _default = Title;
exports["default"] = _default;
//# sourceMappingURL=Title.js.map


/***/ }),

/***/ 1767:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(__webpack_require__(0));

var _Base = _interopRequireDefault(__webpack_require__(855));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Paragraph = function Paragraph(props) {
  return React.createElement(_Base["default"], _extends({}, props, {
    component: "div"
  }));
};

var _default = Paragraph;
exports["default"] = _default;
//# sourceMappingURL=Paragraph.js.map


/***/ }),

/***/ 1768:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(55);

__webpack_require__(1769);
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 1769:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1829:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/antd/lib/layout/style/index.js
var style = __webpack_require__(203);

// EXTERNAL MODULE: ./node_modules/antd/lib/layout/index.js
var layout = __webpack_require__(80);
var layout_default = /*#__PURE__*/__webpack_require__.n(layout);

// EXTERNAL MODULE: delegated ./node_modules/react/index.js from dll-reference dll_library
var reactfrom_dll_reference_dll_library = __webpack_require__(0);
var reactfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(reactfrom_dll_reference_dll_library);

// EXTERNAL MODULE: delegated ./node_modules/react-dom/index.js from dll-reference dll_library
var react_domfrom_dll_reference_dll_library = __webpack_require__(11);
var react_domfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(react_domfrom_dll_reference_dll_library);

// EXTERNAL MODULE: ./node_modules/react-intl/lib/index.es.js + 1 modules
var index_es = __webpack_require__(2);

// EXTERNAL MODULE: ./apis/Urls.ts
var Urls = __webpack_require__(4);

// EXTERNAL MODULE: ./components/layout/Breadcrumb.tsx
var Breadcrumb = __webpack_require__(27);

// EXTERNAL MODULE: ./components/layout/MgeLayout.tsx + 7 modules
var MgeLayout = __webpack_require__(48);

// EXTERNAL MODULE: ./entry/dashboard_v1.less
var dashboard_v1 = __webpack_require__(1744);

// EXTERNAL MODULE: delegated ./node_modules/react-router-dom/esm/react-router-dom.js from dll-reference dll_library
var react_router_domfrom_dll_reference_dll_library = __webpack_require__(30);

// EXTERNAL MODULE: ./node_modules/antd/lib/menu/style/index.js
var menu_style = __webpack_require__(403);

// EXTERNAL MODULE: ./node_modules/antd/lib/menu/index.js
var menu = __webpack_require__(57);
var menu_default = /*#__PURE__*/__webpack_require__.n(menu);

// EXTERNAL MODULE: ./components/context/session.tsx
var session = __webpack_require__(157);

// EXTERNAL MODULE: ./apis/define/User.ts
var User = __webpack_require__(31);

// EXTERNAL MODULE: ./locale/Text.tsx
var Text = __webpack_require__(3);

// CONCATENATED MODULE: ./components/dashboard/LeftNavMenu.tsx







 // import { DashboardKey } from './Define';

var SubMenu = menu_default.a.SubMenu; // const MyDataItemOld = (
//   <Menu.Item key='/data'>
//     <a style={{ textDecoration: 'none' }} href={Urls.account.my_data}>
//       {TEXT('dash:my_data', '我的数据')}
//     </a>
//   </Menu.Item>
// )

var DatasetItem = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/dataset'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  style: {
    textDecoration: 'none'
  },
  to: '/dataset'
}, Object(Text["a" /* TEXT */])('dash:dataset', '数据集')));
var MyDataItem = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/data'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  style: {
    textDecoration: 'none'
  },
  to: '/data'
}, Object(Text["a" /* TEXT */])('dash:my_data', '我的数据'))); // const MyTemplateItemOld = (
//   <Menu.Item key='/template'>
//     <a style={{ textDecoration: 'none' }} href={Urls.account.my_templates}>
//       {TEXT('dash:my_template', '我的模板')}
//     </a>
//   </Menu.Item>
// )

var MyTemplateItem = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/template'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  style: {
    textDecoration: 'none'
  },
  to: '/template'
}, Object(Text["a" /* TEXT */])('dash:my_template', '我的模板')));
var MySnippetItem = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/snippet'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  style: {
    textDecoration: 'none'
  },
  to: '/snippet'
}, Object(Text["a" /* TEXT */])('dash:my_snippet', '我的模板片段')));
var DOIRegisterItem = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/doi'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  style: {
    textDecoration: 'none'
  },
  to: '/doi'
}, Object(Text["a" /* TEXT */])('dash:register_doi', 'DOI申请')));
var TemplateReviewItem = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/review/template'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  style: {
    textDecoration: 'none'
  },
  to: '/review/template'
}, Object(Text["a" /* TEXT */])('dash:template_review', '模板审核')));
var DataReviewItem = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/review/data'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  style: {
    textDecoration: 'none'
  },
  to: '/review/data/pending'
}, Object(Text["a" /* TEXT */])('dash:data_review', '数据审核')));
var UserRoleReivew = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/review/user_role'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  style: {
    textDecoration: 'none'
  },
  to: '/review/user_role'
}, Object(Text["a" /* TEXT */])('dash:role_review', '权限申请审核')));
var DOIReviewItemOld = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/review/doi'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  style: {
    textDecoration: 'none'
  },
  to: '/review/doi/pending'
}, Object(Text["a" /* TEXT */])('dash:doi_review', 'DOI申请审核')));
var AccountInfo = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/account/info'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  style: {
    textDecoration: 'none'
  },
  to: '/account/info'
}, Object(Text["a" /* TEXT */])('dash:account_info', '个人信息')));
var ChangePassword = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/account/password'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  style: {
    textDecoration: 'none'
  },
  to: '/account/password'
}, Object(Text["a" /* TEXT */])('dash:update_password', '修改密码')));
var Project = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/project'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
  style: {
    textDecoration: 'none'
  },
  href: Urls["b" /* default */].project
}, Object(Text["a" /* TEXT */])('dash:project', '项目')));
var Subject = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/subject'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
  style: {
    textDecoration: 'none'
  },
  href: "".concat(Urls["b" /* default */].project, "#/subjects")
}, Object(Text["a" /* TEXT */])('dash:subject', '课题')));
var CertVideo = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/verify/certvideo'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  to: '/verify/certvideo'
}, Object(Text["a" /* TEXT */])('dash:verificat_video', '汇交验收视频')));
var CertApply = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/verify/cert'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  to: '/verify/cert'
}, Object(Text["a" /* TEXT */])('dash:cert_apply', '申请汇交证明')));
var VerificationApply = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/verify/apply'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  to: '/verify/apply'
}, Object(Text["a" /* TEXT */])('dash:verification_apply', '申请汇交验收')));
var MyCertification = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/verify/certification_list'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  to: '/verify/certification_list'
}, Object(Text["a" /* TEXT */])('dash:my_certification', '我的汇交证明')));
var MyVerification = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/verify/verification_list'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  to: '/verify/verification_list'
}, Object(Text["a" /* TEXT */])('dash:my_verification', '我的汇交验收')));
var CertDistribution = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/cert/assign'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  to: '/cert/assign'
}, Object(Text["a" /* TEXT */])('dash:cert_distribution', '汇交验收分配')));
var VerificationEvaluation = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/cert/evaluation'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  to: '/cert/evaluation'
}, Object(Text["a" /* TEXT */])('dash:verification_evaluation', '汇交验收评价')));
var LeftNavMenu_CertificationData = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/cert/data'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  to: '/cert/data'
}, Object(Text["a" /* TEXT */])('dash:certification_data', '查看验收数据')));
var AcceptanceData = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/acceptance/data'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  to: '/acceptance/data'
}, Object(Text["a" /* TEXT */])('dash:project_data', '查看项目数据'))); // const CertAssign = (
//   <Menu.Item key='/cert/assign'>
//     <Link style={{ textDecoration: 'none' }} to='/cert/assign'>
//       {TEXT('dash:cert_assign', '“汇交验收”分配')}
//     </Link>
//   </Menu.Item>
// );
// const Evaluation = (
//   <Menu.Item key='/cert/evaluation'>
//     <Link style={{ textDecoration: 'none' }} to='/cert/evaluation'>{TEXT('dash:cert_evaluation', '“汇交验收”评价')}</Link>
//   </Menu.Item>
// )

var EvaluateTemplateItem = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a.Item, {
  key: '/template_score'
}, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Link"], {
  to: '/template_score'
}, Object(Text["a" /* TEXT */])('dash:evaluate_template', '模板打分')));

var PathnameToKey = function PathnameToKey(pathname) {
  return pathname;
};

var LeftNavMenu_LeftNavMenu = function _LeftNavMenu(props) {
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(session["a" /* SessionContext */].Consumer, null, function (value) {
    var showMyData = value.roles.includes(User["d" /* UserRole */].DataUploader);
    var showMyTemplate = value.roles.includes(User["d" /* UserRole */].TemplateAdmin) || value.roles.includes(User["d" /* UserRole */].TemplateUploader);
    var showDataReview = value.roles.includes(User["d" /* UserRole */].DataAdmin);
    var showTemplateReview = value.roles.includes(User["d" /* UserRole */].TemplateAdmin);
    var showUserRoleReview = value.roles.includes(User["d" /* UserRole */].UserAdmin);
    var showDOIReview = value.roles.includes(User["d" /* UserRole */].DOIAdmin); // 汇交验收角色

    var showCertApply = value.roles_for_acceptance.includes(User["a" /* AcceptanceRole */].ProjectLeader) || value.roles_for_acceptance.includes(User["a" /* AcceptanceRole */].SubjectLeader);
    var showGroupLeader = value.roles_for_acceptance.includes(User["a" /* AcceptanceRole */].GroupLeader);
    var showAcceptanceExpert = value.roles_for_acceptance.includes(User["a" /* AcceptanceRole */].AcceptanceExpert);
    var showCertData = showGroupLeader || showAcceptanceExpert;
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(menu_default.a, {
      mode: "inline",
      selectedKeys: [PathnameToKey(props.location.pathname)],
      defaultOpenKeys: ['data', 'review', 'account', 'acceptance', 'certification', 'splice'],
      style: {
        height: '100%'
      }
    }, showMyData || showMyTemplate ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubMenu, {
      key: "data",
      title: Object(Text["a" /* TEXT */])('dash:data_and_template', '数据和模板')
    }, showMyData ? DatasetItem : null, showMyData ? MyDataItem : null, showMyTemplate ? MyTemplateItem : null, showMyTemplate ? MySnippetItem : null, DOIRegisterItem) : null, showTemplateReview || showDataReview || showUserRoleReview || showDOIReview || showAcceptanceExpert ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubMenu, {
      key: "review",
      title: Object(Text["a" /* TEXT */])('dash:review', '审核')
    }, showTemplateReview ? TemplateReviewItem : null, showDataReview ? DataReviewItem : null, showDOIReview ? DOIReviewItemOld : null, showUserRoleReview ? UserRoleReivew : null, showAcceptanceExpert ? EvaluateTemplateItem : null) : null, showCertApply || showGroupLeader || showAcceptanceExpert ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubMenu, {
      key: "certification",
      title: Object(Text["a" /* TEXT */])('dash:certification', '数据汇交验收')
    }, showCertApply ? CertVideo : null, showCertApply ? CertApply : null, showCertApply ? VerificationApply : null, showCertApply ? MyCertification : null, showCertApply ? MyVerification : null, showGroupLeader ? CertDistribution : null, showAcceptanceExpert ? VerificationEvaluation : null, showCertData ? LeftNavMenu_CertificationData : null, showCertApply ? AcceptanceData : null) : null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(SubMenu, {
      key: "account",
      title: Object(Text["a" /* TEXT */])('dash:account', '账户')
    }, AccountInfo));
  });
};

var LeftNavMenu = Object(react_router_domfrom_dll_reference_dll_library["withRouter"])(LeftNavMenu_LeftNavMenu);
// EXTERNAL MODULE: ./node_modules/antd/lib/radio/style/index.js
var radio_style = __webpack_require__(117);

// EXTERNAL MODULE: ./node_modules/antd/lib/radio/index.js
var lib_radio = __webpack_require__(25);
var radio_default = /*#__PURE__*/__webpack_require__.n(lib_radio);

// EXTERNAL MODULE: ./components/layout/RoleCheckWrapper.tsx + 3 modules
var RoleCheckWrapper = __webpack_require__(82);

// EXTERNAL MODULE: ./apis/define/ReviewState.ts
var ReviewState = __webpack_require__(34);

// EXTERNAL MODULE: ./node_modules/antd/lib/icon/style/index.js
var icon_style = __webpack_require__(125);

// EXTERNAL MODULE: ./node_modules/antd/lib/icon/index.js
var icon = __webpack_require__(28);
var icon_default = /*#__PURE__*/__webpack_require__.n(icon);

// EXTERNAL MODULE: ./node_modules/antd/lib/tooltip/style/index.js
var tooltip_style = __webpack_require__(138);

// EXTERNAL MODULE: ./node_modules/antd/lib/tooltip/index.js
var tooltip = __webpack_require__(64);
var tooltip_default = /*#__PURE__*/__webpack_require__.n(tooltip);

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

// EXTERNAL MODULE: ./node_modules/antd/lib/input/style/index.js
var input_style = __webpack_require__(56);

// EXTERNAL MODULE: ./node_modules/antd/lib/input/index.js
var input = __webpack_require__(22);
var input_default = /*#__PURE__*/__webpack_require__.n(input);

// EXTERNAL MODULE: ./node_modules/antd/lib/modal/style/index.js
var modal_style = __webpack_require__(45);

// EXTERNAL MODULE: ./node_modules/antd/lib/modal/index.js
var modal = __webpack_require__(15);
var modal_default = /*#__PURE__*/__webpack_require__.n(modal);

// EXTERNAL MODULE: ./node_modules/antd/lib/table/style/index.js
var table_style = __webpack_require__(100);

// EXTERNAL MODULE: ./node_modules/antd/lib/table/index.js
var table = __webpack_require__(37);
var table_default = /*#__PURE__*/__webpack_require__.n(table);

// EXTERNAL MODULE: ./apis/uploads/Get.ts
var Get = __webpack_require__(115);

// EXTERNAL MODULE: ./utils/ShoppingCart.ts
var ShoppingCart = __webpack_require__(81);

// CONCATENATED MODULE: ./components/dashboard/viewer/UploadHistoryAction.tsx





function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }






var UploadHistoryAction_UploadHistoryAction = function UploadHistoryAction(props) {
  var record = props.record,
      admin = props.admin,
      onView = props.onView; // const [yesLoading, setYesLoading] = useState(false);

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState2 = _slicedToArray(_useState, 2),
      addDataLoading = _useState2[0],
      setAddDataLoading = _useState2[1]; // const handleYesClick = () => {
  //   setYesLoading(true);
  //   PassUpload(record.id).then(() => {
  //     GetUploadHistory(record.id).then((result) => {
  //       Object.assign(record, result);
  //       notification['success']({
  //         message: TEXT('op_success', '操作成功')
  //       })
  //       props.informUpdate();
  //       setYesLoading(false);
  //     })
  //
  //   }).catch((reason: Error) => {
  //     notification['error']({
  //       message: reason.message,
  //     })
  //   })
  // }
  // const yesButton = <Button size='small' type='primary' loading={yesLoading} onClick={handleYesClick}>{TEXT('dash:approve', '通过')}</Button>;


  var yesButton = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    size: 'small',
    type: 'primary',
    onClick: function onClick() {
      return props.onApprove(record);
    }
  }, Object(Text["a" /* TEXT */])('dash:approve', '通过'));
  var noButton = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    size: 'small',
    type: 'danger',
    onClick: function onClick() {
      return props.onRefuse(record);
    }
  }, Object(Text["a" /* TEXT */])('dash:disapprove', '拒绝'));
  var withdrawButton = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    size: 'small',
    type: 'danger',
    onClick: function onClick() {
      return props.onWithdraw(record);
    }
  }, Object(Text["a" /* TEXT */])('dash:withdraw', '撤回审核'));

  var handleViewButtonClick = function handleViewButtonClick() {
    onView(record);
  };

  var handleAddData = function handleAddData() {
    setAddDataLoading(true);
    Object(Get["a" /* GetUploadHistory */])(record.id).then(function (value) {
      value.meta_id_list.data_list.forEach(function (value) {
        ShoppingCart["a" /* Cart */].Instance.AddData(value.id, value.title, value.tid);
      });
      setAddDataLoading(false);
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", null, admin && !(record.review_state == ReviewState["a" /* ReviewState */].Approved || record.review_state == ReviewState["a" /* ReviewState */].Disapproved) ? yesButton : null, admin && !(record.review_state == ReviewState["a" /* ReviewState */].Approved || record.review_state == ReviewState["a" /* ReviewState */].Disapproved) ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
    type: "vertical"
  }) : null, admin && !(record.review_state == ReviewState["a" /* ReviewState */].Approved || record.review_state == ReviewState["a" /* ReviewState */].Disapproved) ? noButton : null, admin && !(record.review_state == ReviewState["a" /* ReviewState */].Pending) && record.platform_belong === 0 ? withdrawButton : null, admin && !(record.review_state == ReviewState["a" /* ReviewState */].Pending) && record.platform_belong === 0 ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
    type: "vertical"
  }) : null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    size: 'small',
    onClick: handleViewButtonClick
  }, Object(Text["a" /* TEXT */])('dash:view_data_list', '查看数据')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
    type: "vertical"
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    size: 'small',
    onClick: handleAddData,
    loading: addDataLoading
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("i", {
    className: 'fa fa-plus',
    "aria-hidden": 'true'
  })));
};
// EXTERNAL MODULE: ./components/common/FlexLoading.tsx
var FlexLoading = __webpack_require__(66);

// CONCATENATED MODULE: ./components/dashboard/item_viewer/UploadHistoryItemViewer.tsx





function UploadHistoryItemViewer_slicedToArray(arr, i) { return UploadHistoryItemViewer_arrayWithHoles(arr) || UploadHistoryItemViewer_iterableToArrayLimit(arr, i) || UploadHistoryItemViewer_unsupportedIterableToArray(arr, i) || UploadHistoryItemViewer_nonIterableRest(); }

function UploadHistoryItemViewer_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function UploadHistoryItemViewer_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return UploadHistoryItemViewer_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return UploadHistoryItemViewer_arrayLikeToArray(o, minLen); }

function UploadHistoryItemViewer_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function UploadHistoryItemViewer_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function UploadHistoryItemViewer_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }





var UploadHistoryItemViewer_UploadHistoryItemViewer = function UploadHistoryItemViewer(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState2 = UploadHistoryItemViewer_slicedToArray(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState4 = UploadHistoryItemViewer_slicedToArray(_useState3, 2),
      list = _useState4[0],
      setList = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState6 = UploadHistoryItemViewer_slicedToArray(_useState5, 2),
      Public = _useState6[0],
      setPublic = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState8 = UploadHistoryItemViewer_slicedToArray(_useState7, 2),
      Source = _useState8[0],
      setSource = _useState8[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    if (props.record && props.visible) {
      setLoading(true);
      Object(Get["a" /* GetUploadHistory */])(props.record.id).then(function (result) {
        if (result.meta_id_list.data_list.length === 1) {
          window.open(Urls["b" /* default */].storage.show_data(result.meta_id_list.data_list[0].id));
          props.onClose();
        }

        setList(result.meta_id_list.data_list);
        setPublic(result.meta_id_list["public"]);
        setSource(props.record.source);
        setLoading(false);
      });
    }
  }, [props.record, props.visible]);
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    title: "\u6570\u636E\u5217\u8868",
    footer: [/*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, Source == null ? null : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      href: Source,
      target: '_blank',
      disabled: Public === true ? false : true,
      type: "primary"
    }, "\u4E0B\u8F7D"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      key: "submit",
      type: "primary",
      onClick: props.onClose
    }, "\u5173\u95ED"))],
    visible: props.visible,
    onCancel: props.onClose,
    onOk: props.onClose
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      height: '50vh',
      overflowY: 'scroll'
    }
  }, loading ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(FlexLoading["a" /* FlexLoading */], null) : list.length === 0 ? Public ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, "\u6570\u636E\u4E3A\u7A7A") : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, "\u542B\u6709\u672A\u516C\u5F00\u6570\u636E") : list.map(function (item) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      key: item.id
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
      target: '_blank',
      href: Urls["b" /* default */].storage.show_data(item.id)
    }, item.id, " / ", item.title));
  })));
};
// EXTERNAL MODULE: ./node_modules/antd/lib/checkbox/style/index.js
var checkbox_style = __webpack_require__(129);

// EXTERNAL MODULE: ./node_modules/antd/lib/checkbox/index.js
var lib_checkbox = __webpack_require__(50);
var checkbox_default = /*#__PURE__*/__webpack_require__.n(lib_checkbox);

// EXTERNAL MODULE: ./node_modules/antd/lib/notification/style/index.js
var notification_style = __webpack_require__(60);

// EXTERNAL MODULE: ./node_modules/antd/lib/notification/index.js
var notification = __webpack_require__(10);
var notification_default = /*#__PURE__*/__webpack_require__.n(notification);

// CONCATENATED MODULE: ./utils/withModal.tsx
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


var withModal_withModal = function withModal(Comp, title) {
  return /*#__PURE__*/function (_React$Component) {
    _inherits(_class, _React$Component);

    var _super = _createSuper(_class);

    function _class() {
      _classCallCheck(this, _class);

      return _super.apply(this, arguments);
    }

    _createClass(_class, [{
      key: "render",
      value: function render() {
        var props = this.props;
        return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
          title: title,
          onCancel: props.onClose,
          onOk: props.onClose,
          // footer={[
          //   <Button key="submit" type="primary" onClick={props.onClose}>
          //     关闭
          //           </Button>
          // ]}
          footer: null,
          visible: props.visible
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Comp, Object.assign({}, props)));
      }
    }]);

    return _class;
  }(reactfrom_dll_reference_dll_library_default.a.Component);
};
// EXTERNAL MODULE: ./apis/Fetch.ts
var Fetch = __webpack_require__(7);

// CONCATENATED MODULE: ./apis/uploads/Review.ts
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function PassUpload(_x) {
  return _PassUpload.apply(this, arguments);
}

function _PassUpload() {
  _PassUpload = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(uploadID) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", Object(Fetch["a" /* JsonApiFetch */])(Urls["b" /* default */].api_v2_storage.review_data_history(uploadID), 'PATCH', {
              approved: true
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _PassUpload.apply(this, arguments);
}

var RefuseReason;

(function (RefuseReason) {
  RefuseReason[RefuseReason["Other"] = 0] = "Other";
  RefuseReason[RefuseReason["MissingMeta"] = 1] = "MissingMeta";
  RefuseReason[RefuseReason["MissingCondition"] = 2] = "MissingCondition";
  RefuseReason[RefuseReason["MissingPerformanceInfo"] = 3] = "MissingPerformanceInfo";
  RefuseReason[RefuseReason["MissingComonents"] = 4] = "MissingComonents";
  RefuseReason[RefuseReason["InformalTitle"] = 5] = "InformalTitle";
  RefuseReason[RefuseReason["MissingReference"] = 6] = "MissingReference";
  RefuseReason[RefuseReason["MissingContributor"] = 7] = "MissingContributor";
})(RefuseReason || (RefuseReason = {}));

function RefuseUpload(_x2, _x3) {
  return _RefuseUpload.apply(this, arguments);
}

function _RefuseUpload() {
  _RefuseUpload = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(uploadID, reason) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", Object(Fetch["a" /* JsonApiFetch */])(Urls["b" /* default */].api_v2_storage.review_data_history(uploadID), 'PATCH', {
              approved: false,
              reason: reason
            }));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _RefuseUpload.apply(this, arguments);
}

function RefuseUpload1(_x4, _x5) {
  return _RefuseUpload2.apply(this, arguments);
}

function _RefuseUpload2() {
  _RefuseUpload2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(uploadID, reason) {
    var reasonarr, data, i;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            reasonarr = reason.split(';'); //将reason划分为数组

            data = [];

            for (i = 0; i < reasonarr.length; i++) {
              data.push({
                reprotId: String(uploadID),
                msg: String(reasonarr[i]),
                state: String(-1)
              });
            } //body


            return _context3.abrupt("return", Object(Fetch["b" /* JsondataApiFetch */])(Urls["b" /* default */].api_v2_storage.review_data_refuse, 'POST', data));

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _RefuseUpload2.apply(this, arguments);
}

function WithdrawUpload(_x6) {
  return _WithdrawUpload.apply(this, arguments);
}

function _WithdrawUpload() {
  _WithdrawUpload = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(uploadID) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", Object(Fetch["a" /* JsonApiFetch */])(Urls["b" /* default */].api_v2_storage.review_withdraw(uploadID), 'PATCH'));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _WithdrawUpload.apply(this, arguments);
}
// CONCATENATED MODULE: ./components/dashboard/modal/RefuseUploadModal.tsx









function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || RefuseUploadModal_unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return RefuseUploadModal_arrayLikeToArray(arr); }

function RefuseUploadModal_slicedToArray(arr, i) { return RefuseUploadModal_arrayWithHoles(arr) || RefuseUploadModal_iterableToArrayLimit(arr, i) || RefuseUploadModal_unsupportedIterableToArray(arr, i) || RefuseUploadModal_nonIterableRest(); }

function RefuseUploadModal_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function RefuseUploadModal_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return RefuseUploadModal_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return RefuseUploadModal_arrayLikeToArray(o, minLen); }

function RefuseUploadModal_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function RefuseUploadModal_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function RefuseUploadModal_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }






var reasons = ['缺少元数据信息', '计算、实验条件不完整', '性能相关信息不完整', '数据标题命名不规范', '数据引用信息不全', '数据收集、审核人信息不全'];

var RefuseUploadModal_RefuseUploadView = function RefuseUploadView(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = RefuseUploadModal_slicedToArray(_useState, 2),
      reasonList = _useState2[0],
      setReasonList = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState4 = RefuseUploadModal_slicedToArray(_useState3, 2),
      other = _useState4[0],
      setOther = _useState4[1];

  var toggleReason = function toggleReason(reason, value) {
    var set = new Set(reasonList);
    if (value) set.add(reason);else set["delete"](reason);
    setReasonList(Array.from(set));
  };

  var handleButtonClick = function handleButtonClick() {
    var finalReason = other.trim().length === 0 ? reasonList : [].concat(_toConsumableArray(reasonList), [other]);

    if (props.record_multi_id.length === 0) {
      if (props.record.platform_belong === 1) {
        Object(Get["a" /* GetUploadHistory */])(props.record.id).then(function (result) {
          result.meta_id_list.data_list.map(function (value, index) {
            RefuseUpload1(value.id, finalReason.join(';')).then(function (res) {
              if (res.msg === '调用成功') {
                if (index === result.meta_id_list.data_list.length - 1) {
                  RefuseUpload(props.record.id, finalReason.join(';')).then(function () {
                    Object(Get["a" /* GetUploadHistory */])(props.record.id).then(function (result) {
                      Object.assign(props.record, result); //更新数据状态

                      notification_default.a['success']({
                        message: Object(Text["a" /* TEXT */])('op_success', '操作成功')
                      });

                      props.informUpdate();
                    });
                  })["catch"](function (reason) {
                    notification_default.a['error']({
                      message: reason.message
                    });
                  });
                }
              } else {
                notification_default.a['error']({
                  message: res.msg
                });
              }
            });
          });
        });
      } else {
        RefuseUpload(props.record.id, finalReason.join(';')).then(function () {
          Object(Get["a" /* GetUploadHistory */])(props.record.id).then(function (result) {
            Object.assign(props.record, result); //更新数据状态

            notification_default.a['success']({
              message: Object(Text["a" /* TEXT */])('op_success', '操作成功')
            });

            props.informUpdate();
          });
        })["catch"](function (reason) {
          notification_default.a['error']({
            message: reason.message
          });
        });
      }
    } else {
      props.record_multi_id.map(function (item) {
        Object(Get["a" /* GetUploadHistory */])(item).then(function (result) {
          if (result.platform_belong === 1) {
            //大科学装置数据撤回
            result.meta_id_list.data_list.map(function (value, index) {
              RefuseUpload1(value.id, finalReason.join(';')).then(function (res) {
                if (res.msg === '调用成功') {
                  if (index === result.meta_id_list.data_list.length - 1) {
                    RefuseUpload(item, finalReason.join(';')).then(function () {
                      Object(Get["a" /* GetUploadHistory */])(item).then(function (result) {
                        Object.assign(props.record, result);

                        notification_default.a['success']({
                          message: Object(Text["a" /* TEXT */])('op_success', '操作成功')
                        });

                        props.informUpdate();
                      });
                    })["catch"](function (reason) {
                      notification_default.a['error']({
                        message: reason.message
                      });
                    });
                  }
                } else {
                  notification_default.a['error']({
                    message: res.msg
                  });
                }
              });
            });
          } else {
            RefuseUpload(item, finalReason.join(';')).then(function () {
              Object(Get["a" /* GetUploadHistory */])(item).then(function (result) {
                Object.assign(props.record, result);

                notification_default.a['success']({
                  message: Object(Text["a" /* TEXT */])('op_success', '操作成功')
                });

                props.informUpdate();
              });
            })["catch"](function (reason) {
              notification_default.a['error']({
                message: reason.message
              });
            });
          }
        });
      });
      setTimeout(function () {
        return window.location.reload();
      }, 1000);
    }

    props.onClose();
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, Object(Text["a" /* TEXT */])('dash:choose_reason', '请选择拒绝理由：'), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), reasons.map(function (value) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, {
      key: value
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(checkbox_default.a, {
      checked: reasonList.includes(value),
      onChange: function onChange(e) {
        return toggleReason(value, e.target.checked);
      }
    }, value), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null));
  }), Object(Text["a" /* TEXT */])('dash:other', '其他原因：'), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    value: other,
    onChange: function onChange(e) {
      return setOther(e.target.value);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      textAlign: 'center',
      margin: '16px 0 -8px 0'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    disabled: reasonList.length === 0 && other.trim().length === 0,
    type: 'danger',
    onClick: handleButtonClick
  }, Object(Text["a" /* TEXT */])('dash:refuse_data', '不通过数据'))));
};

var RefuseUploadModal = withModal_withModal(RefuseUploadModal_RefuseUploadView, Object(Text["a" /* TEXT */])('dash:review', '审核'));
// CONCATENATED MODULE: ./components/dashboard/modal/ApproveUploadModal.tsx





/*
* 通过审核确认弹框，将通过审核的点击事件也从UploadHistoryAction移到该文件下
* @author: hanc
* */






var ApproveUploadModal_ApproveUploadView = function ApproveUploadView(props) {
  var handleButtonClick = function handleButtonClick() {
    if (props.record_multi_id.length === 0) {
      PassUpload(props.record.id).then(function () {
        Object(Get["a" /* GetUploadHistory */])(props.record.id).then(function (result) {
          Object.assign(props.record, result);

          notification_default.a['success']({
            message: Object(Text["a" /* TEXT */])('op_success', '操作成功')
          });

          props.informUpdate();
        });
      })["catch"](function (reason) {
        notification_default.a['error']({
          message: reason.message
        });
      });
    } else {
      props.record_multi_id.map(function (record_id) {
        PassUpload(record_id).then(function () {
          Object(Get["a" /* GetUploadHistory */])(record_id).then(function (result) {
            Object.assign(record_id, result);

            notification_default.a['success']({
              message: Object(Text["a" /* TEXT */])('op_success', '操作成功')
            });

            props.informUpdate();
          });
        })["catch"](function (reason) {
          notification_default.a['error']({
            message: reason.message
          });
        });
      });
      setTimeout(function () {
        return window.location.reload();
      }, 1000);
    }

    props.onClose(); // 点击后关闭拒绝理由弹窗
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, Object(Text["a" /* TEXT */])('dash:confirm_approve', '确认通过审核吗？'), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      textAlign: 'center',
      margin: '16px 0 -8px 0'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'primary',
    onClick: handleButtonClick
  }, Object(Text["a" /* TEXT */])('dash:approve_confirm', '确认')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'danger',
    style: {
      marginLeft: '16px'
    },
    onClick: props.onClose
  }, Object(Text["a" /* TEXT */])('dash:approve_not_confirm', '取消'))));
};

var ApproveUploadModal = withModal_withModal(ApproveUploadModal_ApproveUploadView, Object(Text["a" /* TEXT */])('dash:approve', '通过审核'));
// CONCATENATED MODULE: ./components/dashboard/viewer/UploadHistoryViewer.tsx















function UploadHistoryViewer_toConsumableArray(arr) { return UploadHistoryViewer_arrayWithoutHoles(arr) || UploadHistoryViewer_iterableToArray(arr) || UploadHistoryViewer_unsupportedIterableToArray(arr) || UploadHistoryViewer_nonIterableSpread(); }

function UploadHistoryViewer_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function UploadHistoryViewer_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function UploadHistoryViewer_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return UploadHistoryViewer_arrayLikeToArray(arr); }

function UploadHistoryViewer_slicedToArray(arr, i) { return UploadHistoryViewer_arrayWithHoles(arr) || UploadHistoryViewer_iterableToArrayLimit(arr, i) || UploadHistoryViewer_unsupportedIterableToArray(arr, i) || UploadHistoryViewer_nonIterableRest(); }

function UploadHistoryViewer_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function UploadHistoryViewer_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return UploadHistoryViewer_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return UploadHistoryViewer_arrayLikeToArray(o, minLen); }

function UploadHistoryViewer_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function UploadHistoryViewer_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function UploadHistoryViewer_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }










var Column = table_default.a.Column;
var UploadHistoryViewer_UploadHistoryViewer = function UploadHistoryViewer(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState2 = UploadHistoryViewer_slicedToArray(_useState, 2),
      real_name = _useState2[0],
      setReal_name = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState4 = UploadHistoryViewer_slicedToArray(_useState3, 2),
      subject = _useState4[0],
      setSubject = _useState4[1];

  var handleTableChange = function handleTableChange(pagination) {
    props.onPageChange(pagination.current, real_name, subject);
  };

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState6 = UploadHistoryViewer_slicedToArray(_useState5, 2),
      innerData = _useState6[0],
      setInnerData = _useState6[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setInnerData(props.data);
  }, [props.data]);

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState8 = UploadHistoryViewer_slicedToArray(_useState7, 2),
      showViewModal = _useState8[0],
      setShowViewModal = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState10 = UploadHistoryViewer_slicedToArray(_useState9, 2),
      showRefuseModal = _useState10[0],
      setShowRefuseModal = _useState10[1];

  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState12 = UploadHistoryViewer_slicedToArray(_useState11, 2),
      showWithdrawModal = _useState12[0],
      setShowWithdrawModal = _useState12[1];

  var _useState13 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState14 = UploadHistoryViewer_slicedToArray(_useState13, 2),
      currentViewRecord = _useState14[0],
      setCurrentViewRecord = _useState14[1]; // 专门为数据多选设置的变量
  // const [selectedRows, setSelectedRows] = useState([]); // 选中行的内容


  var _useState15 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState16 = UploadHistoryViewer_slicedToArray(_useState15, 2),
      selectedRowKeys = _useState16[0],
      setSelectedRowKeys = _useState16[1]; // 选中行的key


  var _useState17 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState18 = UploadHistoryViewer_slicedToArray(_useState17, 2),
      currentViewRecordMulti = _useState18[0],
      setCurrentViewRecordMulti = _useState18[1]; // 多选传递的参数

  /*
  *  selectedRows会有跨页state清理的bug，导致无法跨页选取，但key不存在这个bug，跨页选择key是没问题的
  *  key设置成id  直接传参进行同意或拒绝的操作就好
  * */


  var _useState19 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState20 = UploadHistoryViewer_slicedToArray(_useState19, 2),
      loading = _useState20[0],
      setLoading = _useState20[1];

  var _useState21 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState22 = UploadHistoryViewer_slicedToArray(_useState21, 2),
      showApproveModal = _useState22[0],
      setShowApproveModal = _useState22[1];

  var informUpdate = function informUpdate() {
    setInnerData(UploadHistoryViewer_toConsumableArray(innerData));
  };

  var handleViewRecord = function handleViewRecord(record) {
    setCurrentViewRecord(record);
    setShowViewModal(true);
  };

  var handleRefuseRecord = function handleRefuseRecord(record) {
    setCurrentViewRecord(record);
    setShowRefuseModal(true);
  };

  var handleApproveRecord = function handleApproveRecord(record) {
    setCurrentViewRecord(record);
    setShowApproveModal(true);
  };

  var handleWithdrawRecord = function handleWithdrawRecord(record) {
    setCurrentViewRecord(record);
    setShowWithdrawModal(true);
  };

  var onSelectChange = function onSelectChange(selectedRowKeys) {
    // console.log(selectedRows);
    setSelectedRowKeys(selectedRowKeys); // setSelectedRows(selectedRows);
  };

  var rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: onSelectChange
  }; // 数据批量通过

  var handlePass = function handlePass() {
    setShowApproveModal(true);
    setCurrentViewRecordMulti(selectedRowKeys);
    setSelectedRowKeys([]); // 重置多选框,不需要可注释掉
    // selectedRows.map(record => {
    //   PassUpload(record.id).then(() => {
    //     GetUploadHistory(record.id).then((result) => {
    //       Object.assign(record, result);
    //       informUpdate();
    //     })
    //   }).catch((reason: Error) => {
    //     notification['error']({
    //       message: reason.message,
    //     })
    //   })
    // })
  }; // 数据批量拒绝


  var handleRefuse = function handleRefuse() {
    setCurrentViewRecordMulti(selectedRowKeys);
    setShowRefuseModal(true);
    setSelectedRowKeys([]); // 重置多选框,不需要可注释掉
    // selectedRows.map( item => {
    //   handleRefuseRecord(item);
    // })
  };

  var handleWithdraw = function handleWithdraw() {
    WithdrawUpload(currentViewRecord.id).then(function (value) {
      setShowWithdrawModal(false);

      modal_default.a.success({
        content: '撤回成功！'
      });

      Object(Get["a" /* GetUploadHistory */])(currentViewRecord.id).then(function (result) {
        Object.assign(currentViewRecord, result);
        informUpdate();
      });
    })["catch"](function (error) {
      modal_default.a.error({
        content: {
          error: error
        }
      });
    });
  };

  var columnRealNameSearch = function columnRealNameSearch() {
    props.onPageChange(1, real_name, '');
  };

  var columnRealNameReset = function columnRealNameReset() {
    setReal_name('');
    props.onPageChange(1, '', '');
  };

  var columnSubjectReset = function columnSubjectReset() {
    setSubject('');
    props.onPageChange(1, '', '');
  };

  var columnSubjectSearch = function columnSubjectSearch() {
    props.onPageChange(1, '', subject);
  };

  var getRealNameSearchProps = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      padding: 8
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: 150,
      marginBottom: 8,
      display: 'block'
    },
    value: real_name,
    onChange: function onChange(e) {
      return setReal_name(e.target.value);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: "primary",
    icon: "search",
    size: "small",
    style: {
      width: 70,
      marginRight: 8
    },
    onClick: columnRealNameSearch
  }, "\u67E5\u627E"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    onClick: columnRealNameReset,
    size: "small",
    style: {
      width: 70
    }
  }, "\u91CD\u7F6E")));
  var getSubjectSearchProps = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      padding: 8
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: 150,
      marginBottom: 8,
      display: 'block'
    },
    value: subject,
    onChange: function onChange(e) {
      return setSubject(e.target.value);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: "primary",
    icon: "search",
    size: "small",
    style: {
      width: 70,
      marginRight: 8
    },
    onClick: columnSubjectSearch
  }, "\u67E5\u627E"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    onClick: columnSubjectReset,
    size: "small",
    style: {
      width: 70
    }
  }, "\u91CD\u7F6E")));
  var hasSelected = selectedRowKeys.length > 0;
  var filters = [{
    text: Object(Text["a" /* TEXT */])('data:DISCREATE_DATA', '离散数据汇交平台'),
    value: String(0)
  }, {
    text: Object(Text["a" /* TEXT */])('data:Big_SCIENTIFIC', '大科学装置汇交平台'),
    value: String(1)
  }, {
    text: Object(Text["a" /* TEXT */])('data:DATABASE_TOOL', '数据库汇交工具'),
    value: String(2)
  }, {
    text: Object(Text["a" /* TEXT */])('data:HIGH_THROUGHPUT_COMPUTING', '高通量计算汇交平台'),
    value: String(3)
  }];
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'primary',
    disabled: !hasSelected,
    onClick: handlePass,
    loading: loading
  }, Object(Text["a" /* TEXT */])('dash:approve', '通过')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
    type: 'vertical'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'danger',
    disabled: !hasSelected,
    onClick: handleRefuse
  }, Object(Text["a" /* TEXT */])('dash:disapprove', '拒绝'))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    onChange: handleTableChange,
    rowKey: 'id',
    dataSource: innerData,
    rowSelection: rowSelection,
    loading: props.loading,
    pagination: {
      total: props.total,
      pageSize: props.pageSize,
      current: props.current
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:ID', '编号'),
    dataIndex: 'id',
    key: 'id'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:upload_time', '上传时间'),
    dataIndex: 'time',
    key: 'time',
    render: function render(text) {
      return new Date(text).toLocaleString();
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:data_title', '数据名称'),
    dataIndex: 'data_title',
    key: 'data_title',
    width: 180,
    ellipsis: true,
    render: function render(title) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(tooltip_default.a, {
        placement: "topLeft",
        title: title
      }, title);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:subject', '课题'),
    dataIndex: 'subjcets',
    key: 'subjects',
    filterDropdown: getSubjectSearchProps,
    filterIcon: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(icon_default.a, {
      type: "search"
    }),
    render: function render(text, record) {
      var subjects = record.subjects.toString(); // subjects是数组

      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, subjects);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:data_count', '数据量'),
    dataIndex: 'count',
    key: 'count'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:method', '数据来源'),
    key: 'platform_belong',
    // filters = {filters}
    filterIcon: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(icon_default.a, {
      type: "down"
    }),
    // onFilter = {(value, record:any) => record.platform_belong.toString() === value}
    render: function render(text, record) {
      var content = null;

      switch (record.platform_belong) {
        case 0:
          content = Object(Text["a" /* TEXT */])('data:DISCREATE_DATA', '离散数据汇交平台');
          break;

        case 1:
          content = Object(Text["a" /* TEXT */])('data:Big_SCIENTIFIC', '大科学装置汇交平台');
          break;

        case 2:
          content = Object(Text["a" /* TEXT */])('data:DATABASE_TOOL', '数据库汇交工具');
          break;

        case 3:
          content = Object(Text["a" /* TEXT */])('data:HIGH_THROUGHPUT_COMPUTING', '高通量计算汇交平台');
          break;
      }

      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, content, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null));
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:method', '上传方式'),
    key: 'uploaded_via',
    render: function render(text, record) {
      if (record.source == null) {
        return Object(Text["a" /* TEXT */])('dash:form', '网页表单');
      } else {
        return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, Object(Text["a" /* TEXT */])('dash:file', '文件'), "\xA0");
      }
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:uploader', '上传人'),
    dataIndex: 'real_name',
    key: 'uploader',
    filterDropdown: getRealNameSearchProps,
    filterIcon: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(icon_default.a, {
      type: "search"
    })
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:reviewer', '审核人'),
    dataIndex: 'reviewer_real_name',
    key: 'reviewer'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    title: Object(Text["a" /* TEXT */])('dash:status', '状态'),
    dataIndex: 'review_state',
    key: 'review_state',
    render: function render(text, record) {
      var content = null;

      switch (text) {
        case ReviewState["a" /* ReviewState */].Approved:
          content = Object(Text["a" /* TEXT */])('dash:approved', '通过');
          break;

        case ReviewState["a" /* ReviewState */].Disapproved:
          content = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
            style: {
              color: 'red'
            }
          }, Object(Text["a" /* TEXT */])('dash:disapproved', '未通过'));
          break;

        case ReviewState["a" /* ReviewState */].Pending:
          content = Object(Text["a" /* TEXT */])('dash:pending', '等待审核');
          break;
      }

      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, content, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), text === ReviewState["a" /* ReviewState */].Disapproved ? record.disapprove_reason : null);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Column, {
    width: '200px',
    title: Object(Text["a" /* TEXT */])('dash:action', '操作'),
    key: "action",
    render: function render(text, record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UploadHistoryAction_UploadHistoryAction, {
        admin: true,
        onRefuse: handleRefuseRecord,
        informUpdate: informUpdate,
        onApprove: handleApproveRecord,
        onWithdraw: handleWithdrawRecord,
        record: record,
        onView: handleViewRecord
      });
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UploadHistoryItemViewer_UploadHistoryItemViewer, {
    admin: true,
    record: currentViewRecord,
    visible: showViewModal,
    onClose: function onClose() {
      return setShowViewModal(false);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RefuseUploadModal, {
    visible: showRefuseModal,
    record_multi_id: currentViewRecordMulti,
    informUpdate: informUpdate,
    onClose: function onClose() {
      return setShowRefuseModal(false);
    },
    record: currentViewRecord
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ApproveUploadModal, {
    visible: showApproveModal,
    record_multi_id: currentViewRecordMulti,
    informUpdate: informUpdate,
    onClose: function onClose() {
      return setShowApproveModal(false);
    },
    record: currentViewRecord
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    title: Object(Text["a" /* TEXT */])('dash:withdraw', '撤回审核'),
    visible: showWithdrawModal,
    onOk: handleWithdraw,
    onCancel: function onCancel() {
      setShowWithdrawModal(false);
    },
    okText: Object(Text["a" /* TEXT */])('submit', '确定'),
    cancelText: Object(Text["a" /* TEXT */])('cancel', '取消')
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, "\u786E\u5B9A\u64A4\u56DE\u5BA1\u6838\u5417\uFF1F")));
};
// CONCATENATED MODULE: ./apis/uploads/List.ts
function List_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function List_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { List_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { List_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }




function ListUploadHistory(_x) {
  return _ListUploadHistory.apply(this, arguments);
}

function _ListUploadHistory() {
  _ListUploadHistory = List_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(reviewState) {
    var page,
        real_name,
        subject,
        url,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            page = _args.length > 1 && _args[1] !== undefined ? _args[1] : 1;
            real_name = _args.length > 2 && _args[2] !== undefined ? _args[2] : '';
            subject = _args.length > 3 && _args[3] !== undefined ? _args[3] : '';
            url = Urls["b" /* default */].api_v3_storage.upload_list;

            if (!(reviewState === ReviewState["a" /* ReviewState */].All)) {
              _context.next = 8;
              break;
            }

            return _context.abrupt("return", Object(Fetch["h" /* RestListFetch */])(url, 'GET', {
              page: page,
              real_name: real_name,
              subject: subject
            }));

          case 8:
            return _context.abrupt("return", Object(Fetch["h" /* RestListFetch */])(url, 'GET', {
              page: page,
              review_state: reviewState,
              real_name: real_name,
              subject: subject
            }));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _ListUploadHistory.apply(this, arguments);
}
// CONCATENATED MODULE: ./components/dashboard/pages/DataReview.tsx



function DataReview_slicedToArray(arr, i) { return DataReview_arrayWithHoles(arr) || DataReview_iterableToArrayLimit(arr, i) || DataReview_unsupportedIterableToArray(arr, i) || DataReview_nonIterableRest(); }

function DataReview_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function DataReview_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return DataReview_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return DataReview_arrayLikeToArray(o, minLen); }

function DataReview_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function DataReview_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function DataReview_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }










function PathnameToReviewState(pathname) {
  if (pathname.startsWith('/review/data/pending')) {
    return ReviewState["a" /* ReviewState */].Pending;
  } else if (pathname.startsWith('/review/data/approved')) {
    return ReviewState["a" /* ReviewState */].Approved;
  } else if (pathname.startsWith('/review/data/disapproved')) {
    return ReviewState["a" /* ReviewState */].Disapproved;
  } else {
    return ReviewState["a" /* ReviewState */].All;
  }
}

var DataReview_DataReview = function DataReview(props) {
  var currentState = PathnameToReviewState(props.location.pathname);

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = DataReview_slicedToArray(_useState, 2),
      dataSource = _useState2[0],
      setDataSource = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState4 = DataReview_slicedToArray(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState6 = DataReview_slicedToArray(_useState5, 2),
      total = _useState6[0],
      setTotal = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState8 = DataReview_slicedToArray(_useState7, 2),
      pageSize = _useState8[0],
      setPageSize = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(1),
      _useState10 = DataReview_slicedToArray(_useState9, 2),
      currentPage = _useState10[0],
      setCurrentPage = _useState10[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setLoading(true);
    ListUploadHistory(currentState).then(function (value) {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.count);
      setPageSize(value.page_size);
      setCurrentPage(1);
    });
  }, [props.location.pathname]);

  var handlePageChange = function handlePageChange(page, real_name, subject) {
    setLoading(true);
    ListUploadHistory(currentState, page, real_name, subject).then(function (value) {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.count);
      setPageSize(value.page_size);
      setCurrentPage(page);
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleCheckWrapper["a" /* RoleCheckWrapper */], {
    forbidMessage: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'dashboard:datareview_forbid',
      defaultMessage: "\u60A8\u6CA1\u6709\u5BA1\u6838\u6570\u636E\u7684\u6743\u9650"
    }),
    requiredRoles: [User["d" /* UserRole */].DataAdmin]
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      flexDirection: 'column',
      width: '100%'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '16px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, {
    size: 'large',
    value: currentState,
    buttonStyle: 'solid'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].Pending,
    onClick: function onClick() {
      return props.history.push('/review/data/pending');
    }
  }, Object(Text["a" /* TEXT */])('dash:pending', '等待审核')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].Approved,
    onClick: function onClick() {
      return props.history.push('/review/data/approved');
    }
  }, Object(Text["a" /* TEXT */])('dash:approved', '审核通过')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].Disapproved,
    onClick: function onClick() {
      return props.history.push('/review/data/disapproved');
    }
  }, Object(Text["a" /* TEXT */])('dash:disapproved', '未通过审核')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].All,
    onClick: function onClick() {
      return props.history.push('/review/data/all');
    }
  }, Object(Text["a" /* TEXT */])('dash:show_all', '全部')))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UploadHistoryViewer_UploadHistoryViewer, {
    admin: true,
    total: total,
    pageSize: pageSize,
    current: currentPage,
    loading: loading,
    onPageChange: handlePageChange,
    data: dataSource
  })));
};
// EXTERNAL MODULE: ./apis/template/Get.ts
var template_Get = __webpack_require__(65);

// CONCATENATED MODULE: ./apis/template/Delete.ts
function Delete_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function Delete_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { Delete_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { Delete_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function DeleteTemplate(_x) {
  return _DeleteTemplate.apply(this, arguments);
}

function _DeleteTemplate() {
  _DeleteTemplate = Delete_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(templateID) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", Object(Fetch["k" /* default */])(Urls["b" /* default */].api_v1_storage.template_one(templateID), 'DELETE'));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _DeleteTemplate.apply(this, arguments);
}
// CONCATENATED MODULE: ./apis/template/ReviewTemplate.ts
function ReviewTemplate_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function ReviewTemplate_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { ReviewTemplate_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { ReviewTemplate_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function PassTemplate(_x) {
  return _PassTemplate.apply(this, arguments);
}

function _PassTemplate() {
  _PassTemplate = ReviewTemplate_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(templateID) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", Object(Fetch["k" /* default */])(Urls["b" /* default */].api_v2_storage.review_template(templateID), 'PATCH', {
              approved: true
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _PassTemplate.apply(this, arguments);
}

var ReviewTemplate_RefuseReason;

(function (RefuseReason) {
  RefuseReason[RefuseReason["Other"] = 0] = "Other";
  RefuseReason[RefuseReason["MissingMeta"] = 1] = "MissingMeta";
  RefuseReason[RefuseReason["MissingCondition"] = 2] = "MissingCondition";
  RefuseReason[RefuseReason["MissingPerformanceInfo"] = 3] = "MissingPerformanceInfo";
  RefuseReason[RefuseReason["MissingComonents"] = 4] = "MissingComonents";
  RefuseReason[RefuseReason["InformalTitle"] = 5] = "InformalTitle";
  RefuseReason[RefuseReason["MissingReference"] = 6] = "MissingReference";
  RefuseReason[RefuseReason["MissingContributor"] = 7] = "MissingContributor";
})(ReviewTemplate_RefuseReason || (ReviewTemplate_RefuseReason = {}));

function RefuseTemplate(_x2, _x3) {
  return _RefuseTemplate.apply(this, arguments);
}

function _RefuseTemplate() {
  _RefuseTemplate = ReviewTemplate_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(templateID, reason) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", Object(Fetch["k" /* default */])(Urls["b" /* default */].api_v2_storage.review_template(templateID), 'PATCH', {
              approved: false,
              reason: reason
            }));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _RefuseTemplate.apply(this, arguments);
}
// CONCATENATED MODULE: ./apis/template/GetReviewedTemplate.ts
function GetReviewedTemplate_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function GetReviewedTemplate_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { GetReviewedTemplate_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { GetReviewedTemplate_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function GetReviewedTemplate(_x) {
  return _GetReviewedTemplate.apply(this, arguments);
}

function _GetReviewedTemplate() {
  _GetReviewedTemplate = GetReviewedTemplate_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(uploadID) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", Object(Fetch["e" /* RestApiFetch */])(Urls["b" /* default */].api_v3_storage.templates_detail(uploadID)));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _GetReviewedTemplate.apply(this, arguments);
}
// CONCATENATED MODULE: ./components/dashboard/modal/TemplateEvalutionModal.tsx




var TemplateEvalutionModal_TemplateEvaluationModal = function TemplateEvaluationModal(props) {
  var i = 1;
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    visible: props.visible,
    title: Object(Text["a" /* TEXT */])('dataShow:template-scored', '专家评价'),
    onCancel: props.onClose,
    footer: null,
    width: 800
  }, props.evaluationAvgscore != 0 ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'card',
    style: {
      background: 'white'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'issue_time'
  }, Object(Text["a" /* TEXT */])('dataShow:template-avgscore', '模板平均分为:'), " ", props.evaluationAvgscore), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'table_row'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'table',
    style: {
      borderRadius: '8px 0 0 0',
      width: '15%'
    }
  }, Object(Text["a" /* TEXT */])('dataShow:experts-list', '专家列表')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'table',
    style: {
      width: '15%'
    }
  }, Object(Text["a" /* TEXT */])('dataShow:template-score', '模板评分')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'table',
    style: {
      borderRadius: '0 8px 0 0',
      width: '70%'
    }
  }, Object(Text["a" /* TEXT */])('dataShow:experts-comment', '专家评语')))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, props.evaluationResult.map(function (res) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      className: 'table_row',
      style: {
        marginBottom: '4px'
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      style: {
        textAlign: 'center',
        width: '15%'
      }
    }, Object(Text["a" /* TEXT */])('dataShow:experts', '专家'), " ", i++), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      style: {
        textAlign: 'center',
        width: '15%'
      }
    }, res[0]), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      style: {
        textAlign: 'center',
        width: '70%'
      }
    }, res[1]));
  }))) : Object(Text["a" /* TEXT */])('dataShow:template-not-scored', '暂无评分')));
};
// CONCATENATED MODULE: ./components/dashboard/viewer/TemplatesReviewAction.tsx









function TemplatesReviewAction_slicedToArray(arr, i) { return TemplatesReviewAction_arrayWithHoles(arr) || TemplatesReviewAction_iterableToArrayLimit(arr, i) || TemplatesReviewAction_unsupportedIterableToArray(arr, i) || TemplatesReviewAction_nonIterableRest(); }

function TemplatesReviewAction_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function TemplatesReviewAction_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return TemplatesReviewAction_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return TemplatesReviewAction_arrayLikeToArray(o, minLen); }

function TemplatesReviewAction_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function TemplatesReviewAction_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function TemplatesReviewAction_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }









var TemplatesReviewAction_TemplatesReviewAction = function TemplatesReviewAction(props) {
  var record = props.record,
      admin = props.admin,
      onView = props.onView;

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState2 = TemplatesReviewAction_slicedToArray(_useState, 2),
      yesLoading = _useState2[0],
      setYesLoading = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState4 = TemplatesReviewAction_slicedToArray(_useState3, 2),
      showDeleteModal = _useState4[0],
      setShowDeleteModal = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState6 = TemplatesReviewAction_slicedToArray(_useState5, 2),
      showViewEvalutionModal = _useState6[0],
      setShowViewEvalutionModal = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState8 = TemplatesReviewAction_slicedToArray(_useState7, 2),
      temEvalutionData = _useState8[0],
      setTemEvalutionData = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState10 = TemplatesReviewAction_slicedToArray(_useState9, 2),
      temEvaAvgScore = _useState10[0],
      setTemEvaAvgScore = _useState10[1];

  var handleYesClick = function handleYesClick() {
    setYesLoading(true);
    PassTemplate(record.id).then(function () {
      GetReviewedTemplate(record.id).then(function (result) {
        Object.assign(record, result);

        notification_default.a['success']({
          message: Object(Text["a" /* TEXT */])('op_success', '操作成功')
        });

        props.informUpdate();
        setYesLoading(false);
      });
    })["catch"](function (reason) {
      notification_default.a['error']({
        message: reason.message
      });
    });
  }; //   const handleViewButtonClick = () => {
  //     window.open('/storage/check_template/' + record.id);
  //   }


  var handleEditButtonClick = function handleEditButtonClick() {
    window.open('/storage/edit_template/' + record.id);
  };

  var handleDeleteButtonClick = function handleDeleteButtonClick() {
    setShowDeleteModal(true);
  };

  var handleShowViewEvalutionButtonClick = function handleShowViewEvalutionButtonClick() {
    setShowViewEvalutionModal(true); // setTemEvalutionData([[1,'hhh','a'],[9,'hhh','a']]);
    // setTemEvaAvgScore(5.0);	

    Object(template_Get["a" /* GetTemEvalution */])(record.id).then(function (value) {
      setTemEvalutionData(value.score);
      setTemEvaAvgScore(value.avg_score);
    });
  }; // const handleShowViewEvalutionButtonClickOK = () => {  // 点击“查看评价”按钮弹窗中的按钮关闭弹窗
  //     setShowViewEvalutionModal(false);
  // }
  // const handleShowViewEvalutionButtonClickCancel = () => {  // 关闭 “查看评价”弹窗
  //     setShowViewEvalutionModal(false);
  // };


  var yesButton = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    size: 'small',
    type: 'primary',
    loading: yesLoading,
    onClick: handleYesClick
  }, Object(Text["a" /* TEXT */])('dash:approve', '通过'));
  var noButton = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    size: 'small',
    type: 'danger',
    onClick: function onClick() {
      return props.onRefuse(record);
    }
  }, Object(Text["a" /* TEXT */])('dash:disapprove', '拒绝'));
  var viewButton = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    size: 'small',
    onClick: handleShowViewEvalutionButtonClick
  }, Object(Text["a" /* TEXT */])('dash:view_data_evaluation', '查看评价'));
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", null, record.avg_score != -1 ? viewButton : null, record.avg_score != -1 ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
    type: "vertical"
  }) : null, props.allowEdit ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    size: 'small',
    type: 'primary',
    onClick: handleEditButtonClick
  }, Object(Text["a" /* TEXT */])('template:edit', '修改')) : null, props.allowEdit ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
    type: "vertical"
  }) : null, props.allowDelete && record.data_count == 0 ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    size: 'small',
    type: 'danger',
    onClick: handleDeleteButtonClick
  }, Object(Text["a" /* TEXT */])('template:delete', '删除')) : null, props.allowDelete && record.data_count == 0 ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
    type: "vertical"
  }) : null, admin && !(record.review_state == ReviewState["a" /* ReviewState */].Approved) ? yesButton : null, admin && !(record.review_state == ReviewState["a" /* ReviewState */].Approved) ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
    type: "vertical"
  }) : null, admin && !(record.review_state == ReviewState["a" /* ReviewState */].Approved) ? noButton : null, admin && !(record.review_state == ReviewState["a" /* ReviewState */].Approved) ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
    type: "vertical"
  }) : null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TemplateEvalutionModal_TemplateEvaluationModal // “查看评价”的弹窗内容
  , {
    evaluationResult: temEvalutionData,
    visible: showViewEvalutionModal,
    evaluationAvgscore: temEvaAvgScore,
    onClose: function onClose() {
      setShowViewEvalutionModal(false);
      setTemEvalutionData([]);
      setTemEvaAvgScore(0);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    title: Object(Text["a" /* TEXT */])('warning', '警告'),
    visible: showDeleteModal,
    okText: Object(Text["a" /* TEXT */])('ok', '确认'),
    cancelText: Object(Text["a" /* TEXT */])('cancel', '取消'),
    onCancel: function onCancel() {
      return setShowDeleteModal(false);
    },
    onOk: function onOk() {
      DeleteTemplate(record.id).then(function (value) {
        setShowDeleteModal(false);
        props.informDeleted();
      });
    }
  }, Object(Text["a" /* TEXT */])('template:delete_warning', '确定要删除这个模板吗？')));
};
// CONCATENATED MODULE: ./components/dashboard/modal/RefuseTemplateModal.tsx









function RefuseTemplateModal_toConsumableArray(arr) { return RefuseTemplateModal_arrayWithoutHoles(arr) || RefuseTemplateModal_iterableToArray(arr) || RefuseTemplateModal_unsupportedIterableToArray(arr) || RefuseTemplateModal_nonIterableSpread(); }

function RefuseTemplateModal_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function RefuseTemplateModal_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function RefuseTemplateModal_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return RefuseTemplateModal_arrayLikeToArray(arr); }

function RefuseTemplateModal_slicedToArray(arr, i) { return RefuseTemplateModal_arrayWithHoles(arr) || RefuseTemplateModal_iterableToArrayLimit(arr, i) || RefuseTemplateModal_unsupportedIterableToArray(arr, i) || RefuseTemplateModal_nonIterableRest(); }

function RefuseTemplateModal_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function RefuseTemplateModal_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return RefuseTemplateModal_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return RefuseTemplateModal_arrayLikeToArray(o, minLen); }

function RefuseTemplateModal_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function RefuseTemplateModal_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function RefuseTemplateModal_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }





var RefuseTemplateModal_reasons = ['缺少元数据信息', '计算、实验条件不完整', '性能相关信息不完整', '模板标题命名不规范', '模板引用信息不全', '模板收集、审核人信息不全'];

var RefuseTemplateModal_RefuseTemplateView = function RefuseTemplateView(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = RefuseTemplateModal_slicedToArray(_useState, 2),
      reasonList = _useState2[0],
      setReasonList = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState4 = RefuseTemplateModal_slicedToArray(_useState3, 2),
      other = _useState4[0],
      setOther = _useState4[1];

  var toggleReason = function toggleReason(reason, value) {
    var set = new Set(reasonList);
    if (value) set.add(reason);else set["delete"](reason);
    setReasonList(Array.from(set));
  };

  var handleButtonClick = function handleButtonClick() {
    var finalReason = other.trim().length === 0 ? reasonList : [].concat(RefuseTemplateModal_toConsumableArray(reasonList), [other]);
    RefuseTemplate(props.record.id, finalReason.join(';')).then(function () {
      notification_default.a['success']({
        message: Object(Text["a" /* TEXT */])('op_success', '操作成功')
      });
    })["catch"](function (reason) {
      notification_default.a['error']({
        message: reason.message
      });
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, Object(Text["a" /* TEXT */])('dash:choose_reason', '请选择拒绝理由：'), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), RefuseTemplateModal_reasons.map(function (value) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, {
      key: value
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(checkbox_default.a, {
      checked: reasonList.includes(value),
      onChange: function onChange(e) {
        return toggleReason(value, e.target.checked);
      }
    }, value), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null));
  }), Object(Text["a" /* TEXT */])('dash:other', '其他原因：'), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    value: other,
    onChange: function onChange(e) {
      return setOther(e.target.value);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      textAlign: 'center',
      margin: '16px 0 -8px 0'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    disabled: reasonList.length === 0 && other.trim().length === 0,
    type: 'danger',
    onClick: handleButtonClick
  }, Object(Text["a" /* TEXT */])('dash:refuse_data', '不通过数据'))));
};

var RefuseTemplateModal = withModal_withModal(RefuseTemplateModal_RefuseTemplateView, Object(Text["a" /* TEXT */])('dash:review', '审核'));
// CONCATENATED MODULE: ./components/dashboard/viewer/TemplatesReviewViewer.tsx









function TemplatesReviewViewer_toConsumableArray(arr) { return TemplatesReviewViewer_arrayWithoutHoles(arr) || TemplatesReviewViewer_iterableToArray(arr) || TemplatesReviewViewer_unsupportedIterableToArray(arr) || TemplatesReviewViewer_nonIterableSpread(); }

function TemplatesReviewViewer_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function TemplatesReviewViewer_iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function TemplatesReviewViewer_arrayWithoutHoles(arr) { if (Array.isArray(arr)) return TemplatesReviewViewer_arrayLikeToArray(arr); }

function TemplatesReviewViewer_slicedToArray(arr, i) { return TemplatesReviewViewer_arrayWithHoles(arr) || TemplatesReviewViewer_iterableToArrayLimit(arr, i) || TemplatesReviewViewer_unsupportedIterableToArray(arr, i) || TemplatesReviewViewer_nonIterableRest(); }

function TemplatesReviewViewer_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function TemplatesReviewViewer_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return TemplatesReviewViewer_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return TemplatesReviewViewer_arrayLikeToArray(o, minLen); }

function TemplatesReviewViewer_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function TemplatesReviewViewer_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function TemplatesReviewViewer_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }






var TemplatesReviewViewer_Column = table_default.a.Column;
var TemplatesReviewViewer_TemplatesReviewViewer = function TemplatesReviewViewer(props) {
  var handleTableChange = function handleTableChange(pagination) {
    props.onPageChange(pagination.current);
  };

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = TemplatesReviewViewer_slicedToArray(_useState, 2),
      innerData = _useState2[0],
      setInnerData = _useState2[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setInnerData(props.data);
  }, [props.data]);

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState4 = TemplatesReviewViewer_slicedToArray(_useState3, 2),
      showRefuseModal = _useState4[0],
      setShowRefuseModal = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState6 = TemplatesReviewViewer_slicedToArray(_useState5, 2),
      currentViewRecord = _useState6[0],
      setCurrentViewRecord = _useState6[1];

  var informUpdate = function informUpdate() {
    setInnerData(TemplatesReviewViewer_toConsumableArray(innerData));
  };

  var handleViewRecord = function handleViewRecord(record) {
    window.location.href = '/storage/template/' + record.id + '/check';
  };

  var handleRefuseRecord = function handleRefuseRecord(record) {
    setCurrentViewRecord(record);
    setShowRefuseModal(true);
  };

  var handleInformDeleted = function handleInformDeleted(index) {
    setInnerData([].concat(TemplatesReviewViewer_toConsumableArray(innerData.slice(0, index)), TemplatesReviewViewer_toConsumableArray(innerData.slice(index + 1))));
  };

  var handleSearch = function handleSearch(confirm) {
    confirm();
  };

  var handleReset = function handleReset(clearFilters) {
    clearFilters();
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    onChange: handleTableChange,
    rowKey: 'templates_id',
    dataSource: innerData,
    loading: props.loading,
    pagination: {
      total: props.total,
      pageSize: props.pageSize,
      current: props.current
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TemplatesReviewViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:ID', '编号'),
    dataIndex: 'id',
    key: 'id'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TemplatesReviewViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:title', '标题'),
    dataIndex: 'title',
    key: 'title',
    render: function render(text, record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: "/storage/check_template/".concat(record.id),
        target: '_blank'
      }, text);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TemplatesReviewViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:pub_date', '发布时间'),
    dataIndex: 'pub_date',
    key: 'time',
    render: function render(text) {
      return new Date(text.replace(/-/g, "/")).toLocaleDateString();
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TemplatesReviewViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:data_count', '数据量'),
    dataIndex: 'data_count',
    key: 'count'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TemplatesReviewViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:uploader', '上传人'),
    dataIndex: 'real_name',
    key: 'uploader',
    filterDropdown: function filterDropdown(_ref) {
      var setSelectedKeys = _ref.setSelectedKeys,
          selectedKeys = _ref.selectedKeys,
          confirm = _ref.confirm,
          clearFilters = _ref.clearFilters;
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        style: {
          padding: 8
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
        value: selectedKeys[0],
        onChange: function onChange(e) {
          return setSelectedKeys([e.target.value]);
        },
        onPressEnter: function onPressEnter() {
          return handleSearch(confirm);
        },
        style: {
          width: 150,
          marginBottom: 8,
          display: 'block'
        }
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        type: "primary",
        icon: "search",
        size: "small",
        style: {
          width: 70,
          marginRight: 8
        },
        onClick: function onClick() {
          return handleSearch(confirm);
        }
      }, "\u67E5\u627E"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        onClick: function onClick() {
          return handleReset(clearFilters);
        },
        size: "small",
        style: {
          width: 70
        }
      }, "\u91CD\u7F6E")));
    },
    filterIcon: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(icon_default.a, {
      type: "search"
    }),
    onFilter: function onFilter(value, record) {
      return String(record.real_name).includes(value);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TemplatesReviewViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:reviewer', '审核人'),
    dataIndex: 'reviewer_real_name',
    key: 'reviewer',
    filterDropdown: function filterDropdown(_ref2) {
      var setSelectedKeys = _ref2.setSelectedKeys,
          selectedKeys = _ref2.selectedKeys,
          confirm = _ref2.confirm,
          clearFilters = _ref2.clearFilters;
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        style: {
          padding: 8
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
        value: selectedKeys[0],
        onChange: function onChange(e) {
          return setSelectedKeys([e.target.value]);
        },
        onPressEnter: function onPressEnter() {
          return handleSearch(confirm);
        },
        style: {
          width: 150,
          marginBottom: 8,
          display: 'block'
        }
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        type: "primary",
        icon: "search",
        size: "small",
        style: {
          width: 70,
          marginRight: 8
        },
        onClick: function onClick() {
          return handleSearch(confirm);
        }
      }, "\u67E5\u627E"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        onClick: function onClick() {
          return handleReset(clearFilters);
        },
        size: "small",
        style: {
          width: 70
        }
      }, "\u91CD\u7F6E")));
    },
    filterIcon: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(icon_default.a, {
      type: "search"
    }),
    onFilter: function onFilter(value, record) {
      return String(record.reviewer_real_name).includes(value);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TemplatesReviewViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:status', '状态'),
    dataIndex: 'review_state',
    key: 'review_state',
    render: function render(text, record) {
      var content = null;

      switch (text) {
        case ReviewState["a" /* ReviewState */].Approved:
          content = Object(Text["a" /* TEXT */])('dash:approved', '通过');
          break;

        case ReviewState["a" /* ReviewState */].Disapproved:
          content = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
            style: {
              color: 'red'
            }
          }, Object(Text["a" /* TEXT */])('dash:disapproved', '未通过'));
          break;

        case ReviewState["a" /* ReviewState */].Pending:
          content = Object(Text["a" /* TEXT */])('dash:pending', '等待审核');
          break;
      }

      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, content, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), text === ReviewState["a" /* ReviewState */].Disapproved ? record.disapprove_reason : null);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TemplatesReviewViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:action', '操作'),
    key: "action",
    render: function render(text, record, index) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TemplatesReviewAction_TemplatesReviewAction, {
        admin: props.admin,
        onRefuse: handleRefuseRecord,
        informUpdate: informUpdate,
        informDeleted: function informDeleted() {
          return handleInformDeleted(index);
        },
        allowDelete: props.allowDelete,
        allowEdit: props.allowEdit,
        record: record,
        onView: handleViewRecord
      });
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RefuseTemplateModal, {
    visible: showRefuseModal,
    onClose: function onClose() {
      return setShowRefuseModal(false);
    },
    record: currentViewRecord
  }));
};
// EXTERNAL MODULE: ./apis/template/ListTemplates.ts
var ListTemplates = __webpack_require__(108);

// CONCATENATED MODULE: ./components/dashboard/pages/TemplateReview.tsx



function TemplateReview_slicedToArray(arr, i) { return TemplateReview_arrayWithHoles(arr) || TemplateReview_iterableToArrayLimit(arr, i) || TemplateReview_unsupportedIterableToArray(arr, i) || TemplateReview_nonIterableRest(); }

function TemplateReview_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function TemplateReview_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return TemplateReview_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return TemplateReview_arrayLikeToArray(o, minLen); }

function TemplateReview_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function TemplateReview_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function TemplateReview_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }










function TemplateReview_PathnameToReviewState(pathname) {
  if (pathname.startsWith('/review/template/pending')) {
    return ReviewState["a" /* ReviewState */].Pending;
  } else if (pathname.startsWith('/review/template/approved')) {
    return ReviewState["a" /* ReviewState */].Approved;
  } else if (pathname.startsWith('/review/template/disapproved')) {
    return ReviewState["a" /* ReviewState */].Disapproved;
  } else {
    return ReviewState["a" /* ReviewState */].All;
  }
}

var TemplateReview_TemplateReview = function TemplateReview(props) {
  var currentState = TemplateReview_PathnameToReviewState(props.location.pathname);

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = TemplateReview_slicedToArray(_useState, 2),
      dataSource = _useState2[0],
      setDataSource = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState4 = TemplateReview_slicedToArray(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState6 = TemplateReview_slicedToArray(_useState5, 2),
      total = _useState6[0],
      setTotal = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState8 = TemplateReview_slicedToArray(_useState7, 2),
      pageSize = _useState8[0],
      setPageSize = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(1),
      _useState10 = TemplateReview_slicedToArray(_useState9, 2),
      currentPage = _useState10[0],
      setCurrentPage = _useState10[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setLoading(true);
    Object(ListTemplates["c" /* ListTemplates */])(currentState, 1, false).then(function (value) {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.count);
      setPageSize(value.page_size);
      setCurrentPage(1);
    });
  }, [props.location.pathname]);

  var handlePageChange = function handlePageChange(page) {
    Object(ListTemplates["c" /* ListTemplates */])(currentState, page, false).then(function (value) {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.count);
      setPageSize(value.page_size);
      setCurrentPage(page);
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleCheckWrapper["a" /* RoleCheckWrapper */], {
    forbidMessage: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'dashboard:template_review_forbid',
      defaultMessage: "\u60A8\u6CA1\u6709\u5BA1\u6838\u6A21\u677F\u7684\u6743\u9650"
    }),
    requiredRoles: [User["d" /* UserRole */].TemplateAdmin]
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      flexDirection: 'column',
      width: '100%'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '16px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, {
    size: 'large',
    value: currentState,
    buttonStyle: 'solid'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].Pending,
    onClick: function onClick() {
      return props.history.push('/review/template/pending');
    }
  }, Object(Text["a" /* TEXT */])('dash:pending', '等待审核')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].Approved,
    onClick: function onClick() {
      return props.history.push('/review/template/approved');
    }
  }, Object(Text["a" /* TEXT */])('dash:approved', '审核通过')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].Disapproved,
    onClick: function onClick() {
      return props.history.push('/review/template/disapproved');
    }
  }, Object(Text["a" /* TEXT */])('dash:disapproved', '未通过审核')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].All,
    onClick: function onClick() {
      return props.history.push('/review/template/all');
    }
  }, Object(Text["a" /* TEXT */])('dash:show_all', '全部')))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TemplatesReviewViewer_TemplatesReviewViewer, {
    admin: true,
    total: total,
    pageSize: pageSize,
    current: currentPage,
    loading: loading,
    onPageChange: handlePageChange,
    data: dataSource
  })));
};
// CONCATENATED MODULE: ./apis/data/DoiReviewList.ts
function DoiReviewList_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function DoiReviewList_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { DoiReviewList_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { DoiReviewList_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }




function DoiReviewList(_x, _x2) {
  return _DoiReviewList.apply(this, arguments);
}

function _DoiReviewList() {
  _DoiReviewList = DoiReviewList_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(reviewState, page) {
    var url;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = Urls["b" /* default */].api_v3_storage.review_doi_list;

            if (!(reviewState === ReviewState["a" /* ReviewState */].All)) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", Object(Fetch["i" /* RestListFetch2 */])(url, 'GET', {
              page: page,
              "private": true
            }));

          case 5:
            return _context.abrupt("return", Object(Fetch["i" /* RestListFetch2 */])(url, 'GET', {
              page: page,
              state: reviewState,
              "private": true
            }));

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _DoiReviewList.apply(this, arguments);
}

function DoiReviewList_DoiReview(_x3, _x4) {
  return _DoiReview.apply(this, arguments);
}

function _DoiReview() {
  _DoiReview = DoiReviewList_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(success, failed) {
    var url;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            url = Urls["b" /* default */].api_v1_storage.doi_review;
            return _context2.abrupt("return", Object(Fetch["a" /* JsonApiFetch */])(url, 'PATCH', {
              success: success,
              failed: failed
            }));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _DoiReview.apply(this, arguments);
}
// CONCATENATED MODULE: ./components/dashboard/viewer/DoiReviewViewer.tsx







function DoiReviewViewer_slicedToArray(arr, i) { return DoiReviewViewer_arrayWithHoles(arr) || DoiReviewViewer_iterableToArrayLimit(arr, i) || DoiReviewViewer_unsupportedIterableToArray(arr, i) || DoiReviewViewer_nonIterableRest(); }

function DoiReviewViewer_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function DoiReviewViewer_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return DoiReviewViewer_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return DoiReviewViewer_arrayLikeToArray(o, minLen); }

function DoiReviewViewer_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function DoiReviewViewer_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function DoiReviewViewer_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }





var DoiReviewViewer_Column = table_default.a.Column;
var DoiReviewViewer_DoiReviewViewer = function DoiReviewViewer(props) {
  var handleTableChange = function handleTableChange(pagination) {
    props.onPageChange(pagination.current);
  };

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = DoiReviewViewer_slicedToArray(_useState, 2),
      innerData = _useState2[0],
      setInnerData = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState4 = DoiReviewViewer_slicedToArray(_useState3, 2),
      yesLoading = _useState4[0],
      setYesLoading = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState6 = DoiReviewViewer_slicedToArray(_useState5, 2),
      yesData = _useState6[0],
      setyesData = _useState6[1]; //存储审核通过的数据的编号


  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState8 = DoiReviewViewer_slicedToArray(_useState7, 2),
      noData = _useState8[0],
      setnoData = _useState8[1]; //存储审核不通过的数据的编号


  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setInnerData(props.data);
  }, [props.data]);

  var handleYesClick = function handleYesClick(id) {
    setYesLoading(true);
    yesData.push(id);
    DoiReviewList_DoiReview(yesData, noData).then(function () {
      DoiReviewList(props.currentstate, 1).then(function (value) {
        setInnerData(value.results);
        setYesLoading(false);
        setyesData([]);
      });

      notification_default.a['success']({
        message: '操作成功'
      });
    })["catch"](function (reason) {
      notification_default.a['error']({
        message: reason.message
      });

      setYesLoading(false);
      setyesData([]);
    });
  };

  var handleNoClick = function handleNoClick(id) {
    setYesLoading(true);
    noData.push(id);
    DoiReviewList_DoiReview(yesData, noData).then(function () {
      DoiReviewList(props.currentstate, 1).then(function (value) {
        setInnerData(value.results);
        setYesLoading(false);
        setnoData([]);
      });

      notification_default.a['success']({
        message: '操作成功'
      });
    })["catch"](function (reason) {
      notification_default.a['error']({
        message: reason.message
      });

      setYesLoading(false);
      setnoData([]);
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    onChange: handleTableChange,
    rowKey: 'templates_id',
    dataSource: innerData,
    loading: props.loading,
    pagination: {
      total: props.total,
      pageSize: props.pageSize,
      current: props.current
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DoiReviewViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:ID', '编号'),
    dataIndex: 'id',
    key: 'id'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DoiReviewViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:title', 'DOI数据集名称'),
    dataIndex: 'title',
    key: 'title'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DoiReviewViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:application_time', '申请时间'),
    dataIndex: 'add_time',
    key: 'add_time',
    render: function render(text) {
      return new Date(text.replace(/-/g, "/")).toLocaleDateString();
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DoiReviewViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:applicant', '申请人'),
    dataIndex: 'applicant',
    key: 'applicant'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DoiReviewViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dataShow:content', '数据内容'),
    render: function render(text, record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: '/storage/data/doilist/detail/' + record.id + '?page=1',
        target: '_blank'
      }, Object(Text["a" /* TEXT */])('dash:details', '数据详情'));
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DoiReviewViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:status', '状态'),
    dataIndex: 'status',
    key: 'status',
    render: function render(text, record) {
      var content = null;

      switch (text) {
        case ReviewState["a" /* ReviewState */].Approved:
          content = Object(Text["a" /* TEXT */])('dash:approved', '通过');
          break;

        case ReviewState["a" /* ReviewState */].Disapproved:
          content = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
            style: {
              color: 'red'
            }
          }, Object(Text["a" /* TEXT */])('dash:disapproved', '未通过'));
          break;

        case ReviewState["a" /* ReviewState */].Pending:
          content = Object(Text["a" /* TEXT */])('dash:pending', '等待审核');
          break;
      }

      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, content, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null));
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DoiReviewViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:action', '操作'),
    key: "action",
    render: function render(text, record, index) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, props.admin && record.status == ReviewState["a" /* ReviewState */].Pending ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        size: 'small',
        type: 'primary',
        loading: yesLoading,
        onClick: function onClick() {
          return handleYesClick(record.id);
        }
      }, Object(Text["a" /* TEXT */])('dash:approve', '通过')) : null, props.admin && record.status == ReviewState["a" /* ReviewState */].Pending ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        size: 'small',
        type: 'danger',
        loading: yesLoading,
        onClick: function onClick() {
          return handleNoClick(record.id);
        }
      }, Object(Text["a" /* TEXT */])('dash:disapprove', '拒绝')) : null);
    }
  })));
};
// CONCATENATED MODULE: ./components/dashboard/pages/DoiReview.tsx



function DoiReview_slicedToArray(arr, i) { return DoiReview_arrayWithHoles(arr) || DoiReview_iterableToArrayLimit(arr, i) || DoiReview_unsupportedIterableToArray(arr, i) || DoiReview_nonIterableRest(); }

function DoiReview_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function DoiReview_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return DoiReview_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return DoiReview_arrayLikeToArray(o, minLen); }

function DoiReview_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function DoiReview_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function DoiReview_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }










function DoiReview_PathnameToReviewState(pathname) {
  if (pathname.startsWith('/review/doi/pending')) {
    return ReviewState["a" /* ReviewState */].Pending;
  } else if (pathname.startsWith('/review/doi/approved')) {
    return ReviewState["a" /* ReviewState */].Approved;
  } else if (pathname.startsWith('/review/doi/disapproved')) {
    return ReviewState["a" /* ReviewState */].Disapproved;
  } else {
    return ReviewState["a" /* ReviewState */].All;
  }
}

var DoiReview_DoiReview = function DoiReview(props) {
  var currentState = DoiReview_PathnameToReviewState(props.location.pathname);

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = DoiReview_slicedToArray(_useState, 2),
      dataSource = _useState2[0],
      setDataSource = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState4 = DoiReview_slicedToArray(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState6 = DoiReview_slicedToArray(_useState5, 2),
      total = _useState6[0],
      setTotal = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState8 = DoiReview_slicedToArray(_useState7, 2),
      pageSize = _useState8[0],
      setPageSize = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(1),
      _useState10 = DoiReview_slicedToArray(_useState9, 2),
      currentPage = _useState10[0],
      setCurrentPage = _useState10[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    DoiReviewList(currentState, 1).then(function (value) {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.total);
      setPageSize(value.page_size);
      setCurrentPage(1);
    });
  }, [props.location.pathname]);

  var handlePageChange = function handlePageChange(page) {
    DoiReviewList(currentState, page).then(function (value) {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.total);
      setPageSize(value.page_size);
      setCurrentPage(page);
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleCheckWrapper["a" /* RoleCheckWrapper */], {
    forbidMessage: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'dashboard:doi_review_forbid',
      defaultMessage: "\u60A8\u6CA1\u6709\u5BA1\u6838DOI\u7684\u6743\u9650"
    }),
    requiredRoles: [User["d" /* UserRole */].DOIAdmin]
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      flexDirection: 'column',
      width: '100%'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '16px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, {
    size: 'large',
    value: currentState,
    buttonStyle: 'solid'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].Pending,
    onClick: function onClick() {
      return props.history.push('/review/doi/pending');
    }
  }, Object(Text["a" /* TEXT */])('dash:pending', '等待审核')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].Approved,
    onClick: function onClick() {
      return props.history.push('/review/doi/approved');
    }
  }, Object(Text["a" /* TEXT */])('dash:approved', '审核通过')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].Disapproved,
    onClick: function onClick() {
      return props.history.push('/review/doi/disapproved');
    }
  }, Object(Text["a" /* TEXT */])('dash:disapproved', '未通过审核')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].All,
    onClick: function onClick() {
      return props.history.push('/review/doi/all');
    }
  }, Object(Text["a" /* TEXT */])('dash:show_all', '全部')))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DoiReviewViewer_DoiReviewViewer, {
    admin: true,
    total: total,
    pageSize: pageSize,
    current: currentPage,
    loading: loading,
    onPageChange: handlePageChange,
    data: dataSource,
    currentstate: currentState
  })));
};
// EXTERNAL MODULE: ./node_modules/antd/lib/form/style/index.js
var form_style = __webpack_require__(447);

// EXTERNAL MODULE: ./node_modules/antd/lib/form/index.js
var lib_form = __webpack_require__(74);
var form_default = /*#__PURE__*/__webpack_require__.n(lib_form);

// CONCATENATED MODULE: ./components/context/withSession.tsx
function withSession_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { withSession_typeof = function _typeof(obj) { return typeof obj; }; } else { withSession_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return withSession_typeof(obj); }

function withSession_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function withSession_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function withSession_createClass(Constructor, protoProps, staticProps) { if (protoProps) withSession_defineProperties(Constructor.prototype, protoProps); if (staticProps) withSession_defineProperties(Constructor, staticProps); return Constructor; }

function withSession_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) withSession_setPrototypeOf(subClass, superClass); }

function withSession_setPrototypeOf(o, p) { withSession_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return withSession_setPrototypeOf(o, p); }

function withSession_createSuper(Derived) { var hasNativeReflectConstruct = withSession_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = withSession_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = withSession_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return withSession_possibleConstructorReturn(this, result); }; }

function withSession_possibleConstructorReturn(self, call) { if (call && (withSession_typeof(call) === "object" || typeof call === "function")) { return call; } return withSession_assertThisInitialized(self); }

function withSession_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function withSession_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function withSession_getPrototypeOf(o) { withSession_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return withSession_getPrototypeOf(o); }



var withSession_withSession = function withSession(Cmp) {
  return /*#__PURE__*/function (_Component) {
    withSession_inherits(_class, _Component);

    var _super = withSession_createSuper(_class);

    function _class() {
      withSession_classCallCheck(this, _class);

      return _super.apply(this, arguments);
    }

    withSession_createClass(_class, [{
      key: "render",
      value: function render() {
        var _this = this;

        return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(session["a" /* SessionContext */].Consumer, null, function (value) {
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Cmp, Object.assign({}, _this.props, {
            session: value
          }));
        });
      }
    }]);

    return _class;
  }(reactfrom_dll_reference_dll_library["Component"]);
};
// CONCATENATED MODULE: ./apis/session/EmailVerification.ts
function EmailVerification_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function EmailVerification_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { EmailVerification_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { EmailVerification_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function EmailVerification() {
  return _EmailVerification.apply(this, arguments);
}

function _EmailVerification() {
  _EmailVerification = EmailVerification_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", Object(Fetch["a" /* JsonApiFetch */])(Urls["b" /* default */].api_v1_account.resend_verification_email, 'POST'));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _EmailVerification.apply(this, arguments);
}
// CONCATENATED MODULE: ./apis/session/UpdateInfo.ts
function UpdateInfo_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function UpdateInfo_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { UpdateInfo_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { UpdateInfo_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function UpdateUserInfo(_x, _x2) {
  return _UpdateUserInfo.apply(this, arguments);
}

function _UpdateUserInfo() {
  _UpdateUserInfo = UpdateInfo_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userID, info) {
    var url;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = Urls["b" /* default */].api_v1_account.user_resource(userID);
            return _context.abrupt("return", Object(Fetch["k" /* default */])(url, 'PATCH', info));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _UpdateUserInfo.apply(this, arguments);
}

function UpdatePassword(_x3, _x4, _x5) {
  return _UpdatePassword.apply(this, arguments);
}

function _UpdatePassword() {
  _UpdatePassword = UpdateInfo_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(session, oldPassword, newPassword) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", UpdateUserInfo(session.username, {
              email: session.email,
              new_password: newPassword,
              old_password: oldPassword
            }));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _UpdatePassword.apply(this, arguments);
}
// EXTERNAL MODULE: ./node_modules/antd/lib/upload/style/index.js
var upload_style = __webpack_require__(619);

// EXTERNAL MODULE: ./node_modules/antd/lib/upload/index.js
var upload = __webpack_require__(220);
var upload_default = /*#__PURE__*/__webpack_require__.n(upload);

// EXTERNAL MODULE: ./node_modules/antd/lib/avatar/style/index.js
var avatar_style = __webpack_require__(1026);

// EXTERNAL MODULE: ./node_modules/antd/lib/avatar/index.js
var avatar = __webpack_require__(959);
var avatar_default = /*#__PURE__*/__webpack_require__.n(avatar);

// EXTERNAL MODULE: ./node_modules/antd/lib/slider/style/index.js
var slider_style = __webpack_require__(1083);

// EXTERNAL MODULE: ./node_modules/antd/lib/slider/index.js
var slider = __webpack_require__(723);
var slider_default = /*#__PURE__*/__webpack_require__.n(slider);

// EXTERNAL MODULE: ./node_modules/react-avatar-editor/dist/index.js
var dist = __webpack_require__(1112);
var dist_default = /*#__PURE__*/__webpack_require__.n(dist);

// CONCATENATED MODULE: ./apis/session/UploadAvatar.ts
function UploadAvatar_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function UploadAvatar_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { UploadAvatar_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { UploadAvatar_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function UploadAvatar(_x, _x2) {
  return _UploadAvatar.apply(this, arguments);
}

function _UploadAvatar() {
  _UploadAvatar = UploadAvatar_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userID, img) {
    var formData;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            formData = new FormData();
            formData.append('avatar', img);
            return _context.abrupt("return", Object(Fetch["j" /* UploadFetch */])(Urls["b" /* default */].api_v1_account.user_avatar(userID), 'POST', formData));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _UploadAvatar.apply(this, arguments);
}
// CONCATENATED MODULE: ./components/dashboard/modal/EditAvatarModal.tsx







function EditAvatarModal_slicedToArray(arr, i) { return EditAvatarModal_arrayWithHoles(arr) || EditAvatarModal_iterableToArrayLimit(arr, i) || EditAvatarModal_unsupportedIterableToArray(arr, i) || EditAvatarModal_nonIterableRest(); }

function EditAvatarModal_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function EditAvatarModal_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return EditAvatarModal_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return EditAvatarModal_arrayLikeToArray(o, minLen); }

function EditAvatarModal_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function EditAvatarModal_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function EditAvatarModal_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }






var CanvasToBlob = function CanvasToBlob(canvas) {
  // if (!HTMLCanvasElement.prototype.toBlob) {
  var binStr = atob(canvas.toDataURL().split(',')[1]);
  var len = binStr.length;
  var arr = new Uint8Array(len);

  for (var i = 0; i < len; ++i) {
    arr[i] = binStr.charCodeAt(i);
  }

  return new Blob([arr], {
    type: 'image/png'
  }); // }
  // else {
  //   return canvas.toBlob()
  // }
};

var EditAvatarModal_EditAvatarModal = function EditAvatarModal(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(1),
      _useState2 = EditAvatarModal_slicedToArray(_useState, 2),
      scale = _useState2[0],
      setScale = _useState2[1];

  var editor = Object(reactfrom_dll_reference_dll_library["useRef"])(null);

  var handleOk = function handleOk() {
    var img = editor.current.getImageScaledToCanvas();
    UploadAvatar(props.userID, CanvasToBlob(img)).then(function () {
      props.onClose();
    })["catch"](function (reason) {
      notification_default.a['error']({
        message: reason.message
      });
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    onCancel: props.onClose,
    onOk: handleOk,
    okText: Object(Text["a" /* TEXT */])('dash:upload', '上传'),
    visible: props.visible,
    cancelText: Object(Text["a" /* TEXT */])('close', '关闭'),
    style: {
      textAlign: 'center'
    },
    title: Object(Text["a" /* TEXT */])('dash:upload_avatar', '上传头像')
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(dist_default.a, {
    ref: editor,
    image: props.file,
    width: 180,
    height: 180,
    borderRadius: 90,
    color: [255, 255, 255, 0.3],
    scale: scale,
    rotate: 0
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(slider_default.a, {
    step: 0.001,
    value: scale,
    min: 1,
    max: 2,
    onChange: function onChange(v) {
      return setScale(v);
    }
  })));
};
// CONCATENATED MODULE: ./components/dashboard/pages/AvatarView.tsx







function AvatarView_slicedToArray(arr, i) { return AvatarView_arrayWithHoles(arr) || AvatarView_iterableToArrayLimit(arr, i) || AvatarView_unsupportedIterableToArray(arr, i) || AvatarView_nonIterableRest(); }

function AvatarView_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function AvatarView_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return AvatarView_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return AvatarView_arrayLikeToArray(o, minLen); }

function AvatarView_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function AvatarView_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function AvatarView_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var AvatarView_AvatarView = function AvatarView(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState2 = AvatarView_slicedToArray(_useState, 2),
      avatarModalVisible = _useState2[0],
      setAvatarModalVisible = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState4 = AvatarView_slicedToArray(_useState3, 2),
      file = _useState4[0],
      setFile = _useState4[1];

  var handleBeforeUpload = function handleBeforeUpload(file, FileList) {
    setFile(file);
    setAvatarModalVisible(true);
    return false;
  };

  var handleOnClose = function handleOnClose() {
    setAvatarModalVisible(false);
    props.informUpdate();
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(avatar_default.a, {
    src: "".concat(props.avatarUrl),
    size: 120
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(upload_default.a, {
    beforeUpload: handleBeforeUpload,
    fileList: file ? [file] : null,
    showUploadList: false,
    accept: 'image/*'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    style: {
      display: 'block',
      margin: '16px auto'
    }
  }, Object(Text["a" /* TEXT */])('dash:select_pic', '选择图片'))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(EditAvatarModal_EditAvatarModal, {
    userID: props.userID,
    file: file,
    onClose: handleOnClose,
    visible: avatarModalVisible
  }));
};
// EXTERNAL MODULE: ./node_modules/antd/lib/tag/style/index.js
var tag_style = __webpack_require__(154);

// EXTERNAL MODULE: ./node_modules/antd/lib/tag/index.js
var tag = __webpack_require__(69);
var tag_default = /*#__PURE__*/__webpack_require__.n(tag);

// CONCATENATED MODULE: ./components/dashboard/renderers/UserRoleRender.tsx





var UserRoleRender_UserRoleRender = function UserRoleRender(props) {
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, props.roles.length === 0 ? '无' : null, props.roles.map(function (value) {
    if (value < 8) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, {
        key: value
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(tag_default.a, {
        style: {
          fontSize: '16px'
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: Object(User["b" /* RoleToMsgID */])(value)
      })));
    }
  }));
};
// CONCATENATED MODULE: ./components/dashboard/renderers/ManagedCategoriesRender.tsx

var ManagedCategoriesRender_ManagedCategoriesRender = function ManagedCategoriesRender(props) {
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      border: '1px solid #CCC',
      borderRadius: '4px',
      overflowY: 'scroll',
      padding: '0 16px',
      maxHeight: '320px'
    }
  }, props.categoryies.length === 0 ? '无' : null, props.categoryies.map(function (value) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      key: value.id
    }, value.name);
  }));
};
// EXTERNAL MODULE: ./locale/translate.ts
var translate = __webpack_require__(38);

// CONCATENATED MODULE: ./components/dashboard/pages/AccountInfo.tsx









function AccountInfo_slicedToArray(arr, i) { return AccountInfo_arrayWithHoles(arr) || AccountInfo_iterableToArrayLimit(arr, i) || AccountInfo_unsupportedIterableToArray(arr, i) || AccountInfo_nonIterableRest(); }

function AccountInfo_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function AccountInfo_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return AccountInfo_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return AccountInfo_arrayLikeToArray(o, minLen); }

function AccountInfo_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function AccountInfo_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function AccountInfo_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }











var AccountInfo_AccountInfo = function _AccountInfo(props) {
  var form = props.form;
  var formItemLayout = {
    labelCol: {
      xs: {
        span: 24
      },
      sm: {
        span: 4
      }
    },
    wrapperCol: {
      xs: {
        span: 24
      },
      sm: {
        span: 20
      }
    }
  };
  var tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 16,
        offset: 8
      }
    }
  };

  var handleSubmit = function handleSubmit(e) {
    e.preventDefault();
    form.validateFieldsAndScroll(function (err, values) {
      if (!err) {
        UpdateUserInfo(props.session.username, {
          institution: values['institution'],
          email: values['email'],
          real_name: values['real_name']
        }).then(function () {
          notification_default.a['success']({
            message: Object(translate["a" /* Translate */])('op_success')
          });

          props.session.informUpdate();
        })["catch"](function (reason) {
          notification_default.a['error']({
            message: reason.message
          });
        });
      }
    });
  };

  var handleSendEmail = function handleSendEmail() {
    EmailVerification().then(function () {
      notification_default.a['success']({
        message: Object(Text["a" /* TEXT */])('dash:email_sent', '邮件发送成功')
      });
    })["catch"](function (reason) {
      notification_default.a['error']({
        message: reason.message
      });
    });
  };

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState2 = AccountInfo_slicedToArray(_useState, 2),
      requestModalVisible = _useState2[0],
      setRequestModalVisible = _useState2[1];

  var handleRoleRequest = function handleRoleRequest() {
    setRequestModalVisible(true);
  };

  var verified = (User["d" /* UserRole */].Verified in props.session.roles);
  var sendEmail = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
    href: 'javascript:void(0)',
    onClick: handleSendEmail
  }, Object(Text["a" /* TEXT */])('dash:send_verify_email', '发送验证邮件'));
  var getFieldDecorator = props.form.getFieldDecorator;
  var showAdminCategory = props.session.roles.includes(User["d" /* UserRole */].DataAdmin) || props.session.roles.includes(User["d" /* UserRole */].TemplateAdmin);
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex',
      flex: 1,
      flexDirection: 'row'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      width: '180px',
      textAlign: 'center',
      marginTop: '30px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(AvatarView_AvatarView, {
    informUpdate: props.session.informUpdate,
    userID: props.session.username,
    avatarUrl: "".concat(props.session.avatar)
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      maxWidth: '600px',
      flex: 1
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a, Object.assign({}, formItemLayout, {
    onSubmit: handleSubmit
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a.Item, {
    label: Object(Text["a" /* TEXT */])('dash:username', '用户名')
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", {
    className: "ant-form-text"
  }, props.session.username)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a.Item, {
    label: Object(Text["a" /* TEXT */])('dash:real_name', '姓名')
  }, getFieldDecorator('real_name', {
    initialValue: props.session.real_name,
    rules: [{
      required: true,
      message: Object(Text["a" /* TEXT */])('dash:name_required', '请输入姓名')
    }]
  })( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, null))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a.Item, {
    label: Object(Text["a" /* TEXT */])('dash:inst', '单位/机构')
  }, getFieldDecorator('institution', {
    initialValue: props.session.institution,
    rules: [{
      required: true,
      message: Object(Text["a" /* TEXT */])('dash:inst_required', '请输入机构名')
    }]
  })( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, null))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a.Item, {
    label: Object(Text["a" /* TEXT */])('dash:email', '邮箱'),
    extra: verified ? null : sendEmail
  }, getFieldDecorator('email', {
    initialValue: props.session.email,
    rules: [{
      type: 'email',
      message: Object(Text["a" /* TEXT */])('dash:email_error_format', '邮箱格式不正确')
    }, {
      required: true,
      message: Object(Text["a" /* TEXT */])('dash:email_required', '请输入邮箱')
    }]
  })( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    addonAfter: verified ? Object(Text["a" /* TEXT */])('dash:verified', '已认证') : Object(Text["a" /* TEXT */])('dash:not_verified', '未认证')
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a.Item, {
    label: Object(Text["a" /* TEXT */])('dash:roles', '权限')
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, props.session.roles.length === 0 ? Object(Text["a" /* TEXT */])('dash:verify_email_first', '请先验证你的邮箱') : null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UserRoleRender_UserRoleRender, {
    roles: props.session.roles
  }), showAdminCategory ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null) : null, showAdminCategory ? Object(Text["a" /* TEXT */])('dash:admin_category', '管理的分类') : null, showAdminCategory ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ManagedCategoriesRender_ManagedCategoriesRender, {
    categoryies: props.session.managed_categories
  }) : null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a.Item, Object.assign({}, tailFormItemLayout), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'primary',
    size: 'large',
    htmlType: 'submit',
    loading: !props.session.fetched
  }, Object(Text["a" /* TEXT */])('dash:save', '保存'))))));
};
var pages_AccountInfo_AccountInfo = form_default.a.create({
  name: 'account'
})(withSession_withSession(AccountInfo_AccountInfo));
// CONCATENATED MODULE: ./components/dashboard/pages/ChangePassword.tsx











function ChangePassword_slicedToArray(arr, i) { return ChangePassword_arrayWithHoles(arr) || ChangePassword_iterableToArrayLimit(arr, i) || ChangePassword_unsupportedIterableToArray(arr, i) || ChangePassword_nonIterableRest(); }

function ChangePassword_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function ChangePassword_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return ChangePassword_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ChangePassword_arrayLikeToArray(o, minLen); }

function ChangePassword_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ChangePassword_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function ChangePassword_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }







var ChangePassword_ChangePassword = function _ChangePassword(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState2 = ChangePassword_slicedToArray(_useState, 2),
      confirmDirty = _useState2[0],
      setConfirmDirty = _useState2[1];

  var form = props.form;
  var formItemLayout = {
    labelCol: {
      xs: {
        span: 24
      },
      sm: {
        span: 8
      }
    },
    wrapperCol: {
      xs: {
        span: 24
      },
      sm: {
        span: 16
      }
    }
  };
  var tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0
      },
      sm: {
        span: 16,
        offset: 8
      }
    }
  };
  var getFieldDecorator = props.form.getFieldDecorator;

  var handleSubmit = function handleSubmit(e) {
    e.preventDefault();
    form.validateFieldsAndScroll(function (err, values) {
      if (!err) {
        UpdatePassword(props.session, values['old_password'], values['new_password']).then(function () {
          form.resetFields();

          modal_default.a.confirm({
            content: Object(Text["a" /* TEXT */])('dash:password_change_success', '修改成功，请重新登录'),
            okText: Object(Text["a" /* TEXT */])('dash:relogin', '重新登录'),
            // onOk: () => window.location.href = Urls.account.login + `?next=${window.location.pathname}`
            onOk: function onOk() {
              return window.location.href = Urls["b" /* default */].account.login_18;
            }
          });
        })["catch"](function (reason) {
          notification_default.a['error']({
            message: reason.message
          });
        });
      }
    });
  };

  var compareToFirstPassword = function compareToFirstPassword(rule, value, callback) {
    if (value && value !== form.getFieldValue('new_password')) {
      callback(Object(Text["a" /* TEXT */])('dash:pwd_not_match', '两次输入的密码不一致'));
    } else {
      callback();
    }
  };

  var validateToNextPassword = function validateToNextPassword(rule, value, callback) {
    if (value && confirmDirty) {
      form.validateFields(['confirm'], {
        force: true
      });
    }

    callback();
  };

  var handleConfirmBlur = function handleConfirmBlur(e) {
    var value = e.target.value;
    setConfirmDirty(confirmDirty || !!value);
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      flexDirection: 'column',
      maxWidth: '600px',
      margin: '0 auto',
      flex: 1
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a, Object.assign({}, formItemLayout, {
    onSubmit: handleSubmit
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a.Item, {
    label: Object(Text["a" /* TEXT */])('dash:current_pwd', '当前密码')
  }, getFieldDecorator('old_password', {
    rules: [{
      required: true,
      message: Object(Text["a" /* TEXT */])('dash:please_input_current', '请输入当前密码')
    }, {
      validator: validateToNextPassword
    }]
  })( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a.Password, null))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a.Item, {
    label: Object(Text["a" /* TEXT */])('dash:new_pwd', '新密码'),
    hasFeedback: true
  }, getFieldDecorator('new_password', {
    rules: [{
      required: true,
      message: Object(Text["a" /* TEXT */])('dash:please_input_new', '请输入新密码')
    }]
  })( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a.Password, {
    onBlur: handleConfirmBlur
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a.Item, {
    label: Object(Text["a" /* TEXT */])('dash:confirm_pwd', '重复新密码'),
    hasFeedback: true
  }, getFieldDecorator('confirm', {
    rules: [{
      validator: compareToFirstPassword
    }]
  })( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a.Password, null))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a.Item, Object.assign({}, tailFormItemLayout), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'primary',
    htmlType: 'submit',
    loading: !props.session.fetched
  }, Object(Text["a" /* TEXT */])('dash:change', '修改')))));
};

var pages_ChangePassword_ChangePassword = form_default.a.create({
  name: 'change_password'
})(withSession_withSession(ChangePassword_ChangePassword));
// CONCATENATED MODULE: ./apis/data/DataList.ts
function DataList_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function DataList_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { DataList_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { DataList_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function MyDataList(_x, _x2) {
  return _MyDataList.apply(this, arguments);
}

function _MyDataList() {
  _MyDataList = DataList_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(page, DOI) {
    var all,
        total,
        subject,
        page_size,
        parameters,
        url,
        result,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            all = _args.length > 2 && _args[2] !== undefined ? _args[2] : false;
            total = _args.length > 3 ? _args[3] : undefined;
            subject = _args.length > 4 && _args[4] !== undefined ? _args[4] : '';
            page_size = 10;

            if (all) {
              page_size = total;
            }

            parameters = "page=" + page + "&private=true" + "&per_page=" + page_size + "&doi=" + DOI + "&subject=" + subject;
            url = "".concat(Urls["b" /* default */].api_v1_storage.data_metas, "?").concat(parameters);
            _context.next = 9;
            return Object(Fetch["a" /* JsonApiFetch */])(url);

          case 9:
            result = _context.sent;
            return _context.abrupt("return", result);

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _MyDataList.apply(this, arguments);
}

function TemplateDataList(_x3, _x4, _x5, _x6, _x7) {
  return _TemplateDataList.apply(this, arguments);
}

function _TemplateDataList() {
  _TemplateDataList = DataList_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(template_id, page_size, page, user_email, DOI) {
    var parameters, url, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            parameters = "template_id=" + Number(template_id) + "&page_size=" + page_size + "&page=" + page + "&user_emails=" + user_email;

            if (DOI != null) {
              parameters = parameters + '&doi_exist=' + DOI;
            }

            url = "".concat(Urls["b" /* default */].api_v1_storage.template_data, "?").concat(parameters);
            _context2.next = 5;
            return Object(Fetch["a" /* JsonApiFetch */])(url);

          case 5:
            result = _context2.sent;
            return _context2.abrupt("return", result);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _TemplateDataList.apply(this, arguments);
}
// EXTERNAL MODULE: ./apis/session/Info.ts
var Info = __webpack_require__(83);

// EXTERNAL MODULE: ./node_modules/antd/lib/tree-select/style/index.js
var tree_select_style = __webpack_require__(305);

// EXTERNAL MODULE: ./node_modules/antd/lib/tree-select/index.js
var tree_select = __webpack_require__(141);
var tree_select_default = /*#__PURE__*/__webpack_require__.n(tree_select);

// EXTERNAL MODULE: ./node_modules/antd/lib/steps/style/index.js
var steps_style = __webpack_require__(710);

// EXTERNAL MODULE: ./node_modules/antd/lib/steps/index.js
var steps = __webpack_require__(278);
var steps_default = /*#__PURE__*/__webpack_require__.n(steps);

// EXTERNAL MODULE: ./node_modules/antd/lib/tree/style/index.js
var tree_style = __webpack_require__(288);

// EXTERNAL MODULE: ./node_modules/antd/lib/tree/index.js
var tree = __webpack_require__(109);
var tree_default = /*#__PURE__*/__webpack_require__.n(tree);

// EXTERNAL MODULE: ./node_modules/antd/lib/select/style/index.js
var select_style = __webpack_require__(75);

// EXTERNAL MODULE: ./node_modules/antd/lib/select/index.js
var lib_select = __webpack_require__(24);
var select_default = /*#__PURE__*/__webpack_require__.n(lib_select);

// CONCATENATED MODULE: ./apis/certificate/GetCertificationData.ts
function GetCertificationData_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function GetCertificationData_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { GetCertificationData_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { GetCertificationData_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function GetSubjectList(_x, _x2) {
  return _GetSubjectList.apply(this, arguments);
}

function _GetSubjectList() {
  _GetSubjectList = GetCertificationData_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(is_expert, isLeader) {
    var url;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = '';

            if (is_expert) {
              url = Urls["b" /* default */].api_cert.evaluation_filter;
            } else if (isLeader) {
              url = Urls["b" /* default */].api_cert.acceptance_filter;
            }

            return _context.abrupt("return", Object(Fetch["k" /* default */])(url, 'GET'));

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _GetSubjectList.apply(this, arguments);
}

function GetTemplateList(_x3, _x4, _x5) {
  return _GetTemplateList.apply(this, arguments);
}

function _GetTemplateList() {
  _GetTemplateList = GetCertificationData_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(acceptance_id, is_expert, isLeader) {
    var url;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            url = '';

            if (is_expert) {
              url = Urls["b" /* default */].api_cert.evaluation_filter + '?acceptance_id=' + acceptance_id;
            } else if (isLeader) {
              url = Urls["b" /* default */].api_cert.acceptance_filter + '?acceptance_id=' + acceptance_id;
            }

            return _context2.abrupt("return", Object(Fetch["k" /* default */])(url, 'GET'));

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _GetTemplateList.apply(this, arguments);
}

function GetDataList(acceptance_id, tid, category_id, subject_id, per_page, page) {
  var url = Urls["b" /* default */].api_cert.evaluation_data + '?acceptance_id=' + Number(acceptance_id);

  if (tid !== '') {
    url = url + '&tid=' + Number(tid);
  }

  if (category_id !== '') {
    url = url + '&category_id=' + Number(category_id);
  }

  if (page != null) {
    url = url + '&per_page=' + per_page + '&page=' + page;
  }

  if (subject_id !== '') {
    url = url + '&subject_id=' + subject_id;
  }

  return Object(Fetch["k" /* default */])(url);
}

function GetCategoryTree(category, result, id) {
  var temp = category.split('.');
  var str = temp[0];

  if (temp.length > 1) {
    temp.shift();

    if (result.hasOwnProperty(str)) {
      result[str].push(GetCategoryTree(temp.join('.'), {}, id));
    } else {
      result[str] = [];
      result[str].push(GetCategoryTree(temp.join('.'), {}, id));
    }
  } else {
    result[str] = {
      category_id: String(id)
    };
  }

  return result;
}

function GetCategory(origin_data) {
  var category_str = [];
  var category = [];
  origin_data.map(function (value, index) {
    var temp = {
      path: value.category_full_path,
      category_id: value.category_id
    };

    if (!category_str.includes(value.category_full_path)) {
      category_str.push(value.category_full_path);
      category.push(temp);
    }
  });
  var category_list = {};
  category.map(function (item) {
    GetCategoryTree(item.path, category_list, item.category_id);
  });
  return category_list;
}
// EXTERNAL MODULE: ./apis/export/ExportData.ts
var ExportData = __webpack_require__(92);

// EXTERNAL MODULE: ./components/dashboard/viewer/DataListViewer.less
var DataListViewer = __webpack_require__(1088);

// CONCATENATED MODULE: ./components/dashboard/viewer/DataListTableViewer.tsx











function DataListTableViewer_slicedToArray(arr, i) { return DataListTableViewer_arrayWithHoles(arr) || DataListTableViewer_iterableToArrayLimit(arr, i) || DataListTableViewer_unsupportedIterableToArray(arr, i) || DataListTableViewer_nonIterableRest(); }

function DataListTableViewer_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function DataListTableViewer_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return DataListTableViewer_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return DataListTableViewer_arrayLikeToArray(o, minLen); }

function DataListTableViewer_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function DataListTableViewer_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function DataListTableViewer_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }






var DataListTableViewer_Column = table_default.a.Column;
var DataListTableViewer_DataListTableViewer = function DataListTableViewer(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState2 = DataListTableViewer_slicedToArray(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState4 = DataListTableViewer_slicedToArray(_useState3, 2),
      subject = _useState4[0],
      setSubject = _useState4[1];

  var showModal = function showModal(e) {
    window.open('/storage/data/' + e.target.value);
  };

  var exportData = function exportData(e) {
    Object(ExportData["a" /* ExportData */])('XLSX', Array(e.target.value), false).then(function (value) {
      window.open(value.result);
    });
  };

  var filters_public = [{
    text: Object(Text["a" /* TEXT */])('公开'),
    value: 'public'
  }, {
    text: Object(Text["a" /* TEXT */])('dash:project', '项目'),
    value: 'project'
  }, {
    text: Object(Text["a" /* TEXT */])('dash:subject', '课题'),
    value: 'subject'
  }, {
    text: Object(Text["a" /* TEXT */])('个人'),
    value: 'person'
  }];
  var filters = [{
    text: Object(Text["a" /* TEXT */])('data:DISCREATE_DATA', '离散数据汇交平台'),
    value: '离散数据汇交平台'
  }, {
    text: Object(Text["a" /* TEXT */])('data:Big_SCIENTIFIC', '大科学装置汇交平台'),
    value: '大科学装置汇交平台'
  }, {
    text: Object(Text["a" /* TEXT */])('data:DATABASE_TOOL', '数据库汇交工具'),
    value: '数据库汇交工具'
  }, {
    text: Object(Text["a" /* TEXT */])('data:HIGH_THROUGHPUT_COMPUTING', '高通量计算汇交平台'),
    value: '高通量计算汇交平台'
  }];

  var columnSubjectReset = function columnSubjectReset() {
    setSubject('');
    props.onPageChange(1, '');
  };

  var columnSubjectSearch = function columnSubjectSearch() {
    props.onPageChange(1, subject);
  };

  var getSubjectSearchProps = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      padding: 8
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: 150,
      marginBottom: 8,
      display: 'block'
    },
    value: subject,
    onChange: function onChange(e) {
      return setSubject(e.target.value);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: "primary",
    icon: "search",
    size: "small",
    style: {
      width: 70,
      marginRight: 8
    },
    onClick: columnSubjectSearch
  }, "\u67E5\u627E"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    onClick: columnSubjectReset,
    size: "small",
    style: {
      width: 70
    }
  }, "\u91CD\u7F6E")));
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'data_list__content'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    rowKey: 'id',
    dataSource: props.data,
    loading: props.loading || loading,
    pagination: {
      total: props.total,
      pageSize: props.pageSize,
      current: Number(props.page),
      onChange: function onChange(current) {
        props.onPageChange(current, subject);
      }
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DataListTableViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:ID', '编号'),
    dataIndex: 'id',
    key: 'id'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DataListTableViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:upload_time', '上传时间'),
    dataIndex: 'add_time',
    key: 'add_time',
    render: function render(text) {
      return new Date(text.replace(/-/g, "/")).toLocaleString();
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DataListTableViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:data_title', '数据名称'),
    dataIndex: 'title',
    key: 'title',
    width: 180,
    ellipsis: true,
    render: function render(title) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(tooltip_default.a, {
        placement: 'topLeft',
        title: title
      }, title);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DataListTableViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:method', '数据来源'),
    key: 'platform_belong',
    dataIndex: 'platform_belong',
    filters: filters,
    filterIcon: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(icon_default.a, {
      type: 'down'
    }),
    onFilter: function onFilter(value, record) {
      return record.platform_belong.toString() === value;
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DataListTableViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:range', '公开范围'),
    dataIndex: 'public_date',
    key: 'public_date',
    filterIcon: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(icon_default.a, {
      type: 'down'
    }),
    filters: filters_public,
    onFilter: function onFilter(value, record) {
      return record.public_range.toString() === value;
    },
    render: function render(text, record) {
      var content = null;

      switch (record.public_range) {
        case 'public':
          content = Object(Text["a" /* TEXT */])('dash:public', '公开');
          break;

        case 'project':
          content = Object(Text["a" /* TEXT */])('dash:project', '项目');
          break;

        case 'subject':
          content = Object(Text["a" /* TEXT */])('dash:subject', '课题');
          break;

        case 'person':
          content = Object(Text["a" /* TEXT */])('dash:person', '个人');
          break;
      }

      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, content, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null));
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DataListTableViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:pub_date', '公开时间'),
    key: 'public_date_',
    dataIndex: 'public_date',
    render: function render(text) {
      return new Date(text.replace(/-/g, "/")).toLocaleString();
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DataListTableViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:subject', '课题'),
    key: 'subject',
    dataIndex: 'subject',
    filterDropdown: getSubjectSearchProps,
    filterIcon: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(icon_default.a, {
      type: 'search'
    }),
    render: function render(text, record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, record.subject);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DataListTableViewer_Column, {
    width: '200px',
    title: Object(Text["a" /* TEXT */])('dash:action', '操作'),
    key: 'action',
    render: function render(text, record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", null, Object(Text["a" /* TEXT */])('dash:original_upload_file', '原始上传文件')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        size: 'small',
        value: record.id,
        onClick: exportData
      }, Object(Text["a" /* TEXT */])('dash:download', '下载')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        size: 'small',
        type: 'primary',
        value: record.id,
        onClick: showModal
      }, Object(Text["a" /* TEXT */])('dash:view_data_list', '查看数据')), "\xA0", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        size: 'small',
        type: 'primary'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: Urls["a" /* Urls */].storage.edit_data_new + record.id,
        target: '_blank'
      }, Object(Text["a" /* TEXT */])('dash:edit_data', '修改数据'))));
    }
  }))));
};
// CONCATENATED MODULE: ./components/dashboard/viewer/DataListViewer_v3.tsx













function DataListViewer_v3_slicedToArray(arr, i) { return DataListViewer_v3_arrayWithHoles(arr) || DataListViewer_v3_iterableToArrayLimit(arr, i) || DataListViewer_v3_unsupportedIterableToArray(arr, i) || DataListViewer_v3_nonIterableRest(); }

function DataListViewer_v3_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function DataListViewer_v3_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return DataListViewer_v3_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return DataListViewer_v3_arrayLikeToArray(o, minLen); }

function DataListViewer_v3_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function DataListViewer_v3_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function DataListViewer_v3_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }








var Option = select_default.a.Option;
var TreeNode = tree_default.a.TreeNode;
var Step = steps_default.a.Step;

var DataListViewer_v3_renderChild = function renderChild(data, text) {
  if (data instanceof Array) {
    var res = [];
    data.map(function (item) {
      for (var key in item) {
        if (item[key] instanceof Array) {
          res.push( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TreeNode, {
            selectable: false,
            title: key,
            value: key,
            key: key
          }, renderChild(item[key], key)));
        } else {
          res.push(renderChild(item[key], key));
        }
      }
    });
    return res;
  } else if (text != null) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TreeNode, {
      title: text,
      value: data.category_id,
      key: data.category_id
    });
  } else {
    return null;
  }
};

var DataListViewer_v3_renderTreeNodes = function renderTreeNodes(data) {
  var result = [];

  for (var key in data) {
    var flag = data[key].hasOwnProperty('category_id');
    result.push( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TreeNode, {
      selectable: flag,
      value: flag ? data[key].category_id : key,
      title: key,
      key: flag ? data[key].category_id : key
    }, DataListViewer_v3_renderChild(data[key])));
  }

  return result;
};

var DataListViewer_v3_DataListViewerV3 = function DataListViewerV3(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = DataListViewer_v3_slicedToArray(_useState, 2),
      innerData = _useState2[0],
      setInnerData = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState4 = DataListViewer_v3_slicedToArray(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState6 = DataListViewer_v3_slicedToArray(_useState5, 2),
      expanded = _useState6[0],
      setExpanded = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState8 = DataListViewer_v3_slicedToArray(_useState7, 2),
      currentStep = _useState8[0],
      setCurrentStep = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(),
      _useState10 = DataListViewer_v3_slicedToArray(_useState9, 2),
      selectedCategory = _useState10[0],
      setSelectedCategory = _useState10[1]; // 选中的模板分类


  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])(),
      _useState12 = DataListViewer_v3_slicedToArray(_useState11, 2),
      selectedTemplate = _useState12[0],
      setSelectedTemplate = _useState12[1];

  var _useState13 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState14 = DataListViewer_v3_slicedToArray(_useState13, 2),
      dataSource = _useState14[0],
      setDataSource = _useState14[1];

  var _useState15 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState16 = DataListViewer_v3_slicedToArray(_useState15, 2),
      templateList = _useState16[0],
      setTemplateList = _useState16[1];

  var _useState17 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState18 = DataListViewer_v3_slicedToArray(_useState17, 2),
      total = _useState18[0],
      setTotal = _useState18[1];

  var _useState19 = Object(reactfrom_dll_reference_dll_library["useState"])(10),
      _useState20 = DataListViewer_v3_slicedToArray(_useState19, 2),
      pageSize = _useState20[0],
      setPageSize = _useState20[1];

  var _useState21 = Object(reactfrom_dll_reference_dll_library["useState"])(1),
      _useState22 = DataListViewer_v3_slicedToArray(_useState21, 2),
      currentPage = _useState22[0],
      setCurrentPage = _useState22[1];

  var _useState23 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState24 = DataListViewer_v3_slicedToArray(_useState23, 2),
      isFilter = _useState24[0],
      setIsFilter = _useState24[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setLoading(props.loading);
    setInnerData(props.data);
    setTotal(props.total);
    GetExpanded();
  }, [props.data, props.total]);

  var GetExpanded = function GetExpanded() {
    var data = [];
    props.templateList.map(function (item) {
      data.push(item.key);
    });
    setExpanded(data);
  };

  var handleFilter = function handleFilter() {
    setLoading(true);
    setIsFilter(true);
    Object(Info["a" /* Info */])().then(function (res) {
      TemplateDataList(selectedTemplate, props.pageSize, props.page, [res.email], props.DOIState).then(function (res1) {
        setInnerData(res1.results);
        setPageSize(res1.page_size);
        setCurrentPage(res1.page);
        setTotal(res1.page_size * res1.page_count);
        setLoading(false);
        setCurrentStep(0); // setSelectedSubject('');
        // setSelectedTemplate('');
        // setSelectedCategory('');
      });
    });
  };

  var handlePageChange = function handlePageChange(page, subject) {
    setLoading(true);

    if (isFilter === false) {
      MyDataList(page, props.DOIState, false, total, subject).then(function (value) {
        setInnerData(value.results);
        setLoading(false);
        setTotal(value.total);
        setPageSize(value.page_size);
        setCurrentPage(value.page);
      });
    } else {
      Object(Info["a" /* Info */])().then(function (res) {
        TemplateDataList(String(selectedTemplate), pageSize, page, [res.email], props.DOIState).then(function (value) {
          if (value.results.length === 0) {
            setDataSource([]);
          } else {
            setInnerData(value.results);
          }

          setLoading(false);
          setTotal(value.page_count * value.page_size);
          setPageSize(value.page_size);
          setCurrentPage(value.page);
        });
      });
    }
  };

  var pre = function pre() {
    setCurrentStep(currentStep - 1);
  };

  var next = function next() {
    setCurrentStep(currentStep + 1);
  };

  var Step1 = function Step1() {
    var _useState25 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
        _useState26 = DataListViewer_v3_slicedToArray(_useState25, 2),
        loadingT = _useState26[0],
        setLoadingT = _useState26[1]; // useEffect(() => {
    //     // const temp = GetCategory(props.templateList);
    // }, []);


    var selectCategory = function selectCategory(value) {
      setSelectedCategory(value);
      setCurrentStep(currentStep + 1);
      setTemplateList([]);
      var temp = [];
      props.templateList.map(function (item) {
        if (String(item.category_id) === value) {
          temp.push(item);
        }
      });
      setTemplateList(temp);
      setSelectedTemplate('');
    };

    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(tree_select_default.a, {
      showSearch: true,
      style: {
        width: '400px'
      },
      placeholder: Object(Text["a" /* TEXT */])('data:category_select', '选择类别筛选（可搜索）'),
      showArrow: true,
      onChange: selectCategory,
      treeDefaultExpandAll: !loadingT,
      value: selectedCategory,
      loading: loadingT
    }, DataListViewer_v3_renderTreeNodes(GetCategory(props.templateList))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      style: {
        margin: '10px'
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
      type: 'vertical'
    }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      type: 'primary',
      onClick: next
    }, Object(Text["a" /* TEXT */])('data:next', '下一步'))));
  };

  var Step2 = function Step2() {
    var selectTemplate = function selectTemplate(value) {
      setSelectedTemplate(value);
    };

    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
      showSearch: true,
      style: {
        width: '400px'
      },
      placeholder: Object(Text["a" /* TEXT */])('data:template_select', '选择模板（需要先选择模板分类）'),
      showArrow: true,
      optionFilterProp: 'children',
      onChange: selectTemplate,
      value: selectedTemplate
    }, templateList.map(function (item) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Option, {
        key: item.template__id,
        value: item.template__id
      }, item.template__title);
    })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      style: {
        margin: '10px'
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      type: 'primary',
      onClick: pre
    }, Object(Text["a" /* TEXT */])('data:back', '上一步')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
      type: 'vertical'
    }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      onClick: handleFilter
    }, Object(Text["a" /* TEXT */])('data:filter_data', '筛选数据'))));
  };

  var StepRender = function StepRender() {
    switch (currentStep) {
      case 0:
        {
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Step1, null);
        }

      case 1:
        {
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Step2, null);
        }
    }
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("h3", null, Object(Text["a" /* TEXT */])('data:add_filter_criteria', '添加筛选条件')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      margin: '20px 10px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(steps_default.a, {
    current: currentStep
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Step, {
    title: Object(Text["a" /* TEXT */])('data:classi_select', '选择模板分类（必选）')
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Step, {
    title: Object(Text["a" /* TEXT */])('data:temp_select', '选择模板（必选）')
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      margin: '20px 5px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(StepRender, null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DataListTableViewer_DataListTableViewer, {
    loading: loading,
    total: total,
    pageSize: pageSize,
    admin: false,
    data: innerData,
    page: currentPage,
    templateList: templateList,
    onPageChange: handlePageChange
  }));
};
// CONCATENATED MODULE: ./components/dashboard/pages/MyData.tsx
function MyData_slicedToArray(arr, i) { return MyData_arrayWithHoles(arr) || MyData_iterableToArrayLimit(arr, i) || MyData_unsupportedIterableToArray(arr, i) || MyData_nonIterableRest(); }

function MyData_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function MyData_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return MyData_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return MyData_arrayLikeToArray(o, minLen); }

function MyData_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function MyData_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function MyData_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



 // 按DOI返回数据列表

 // 按模板返回数据列表



 // 返回模板列表




function PathnameToDOIState(pathname) {
  if (pathname.startsWith('/data/doi_true')) {
    return true;
  } else if (pathname.startsWith('/data/doi_false')) {
    return false;
  }
}

function GetChild(category, origin_data, index_outside, category_outside) {
  var data_new = [];
  var i = -1;
  category.map(function (value, index) {
    var temp = value.split('.');

    if (temp[0] === category_outside) {
      if (temp.length > 1) {
        data_new.push({
          title: temp[1],
          key: index_outside + '-' + String(index),
          children: []
        });
        i++;
        origin_data.map(function (item, index_inside) {
          if (item.category_full_path === value) {
            data_new[i].children.push({
              title: item.template__title == null ? item.title : item.template__title,
              key: item.template__id == null ? item.id : item.template__id
            });
          }
        });
      } else {
        origin_data.map(function (item) {
          if (item.category_full_path === value) {
            data_new.push({
              title: item.template__title == null ? item.title : item.template__title,
              key: item.template__id == null ? item.id : item.template__id
            });
          }
        });
      }
    }
  });
  return data_new;
}

function TreeData(origin_data) {
  var category = [];
  var category_outside = [];
  var data_new = [];
  origin_data.map(function (value) {
    var temp = value.category_full_path.split('.');

    if (!category_outside.includes(temp[0])) {
      category_outside.push(temp[0]);
    }

    if (!category.includes(value.category_full_path)) {
      category.push(value.category_full_path);
    }
  });
  category_outside.map(function (value, index) {
    data_new.push({
      title: value,
      key: String(index),
      children: GetChild(category, origin_data, String(index), value)
    });
  });
  return data_new;
}
var MyData_MyData = function MyData(props) {
  var DOIState = PathnameToDOIState(props.location.pathname);

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = MyData_slicedToArray(_useState, 2),
      dataSource = _useState2[0],
      setDataSource = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState4 = MyData_slicedToArray(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState6 = MyData_slicedToArray(_useState5, 2),
      total = _useState6[0],
      setTotal = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(10),
      _useState8 = MyData_slicedToArray(_useState7, 2),
      pageSize = _useState8[0],
      setPageSize = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(1),
      _useState10 = MyData_slicedToArray(_useState9, 2),
      currentPage = _useState10[0],
      setCurrentPage = _useState10[1];

  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState12 = MyData_slicedToArray(_useState11, 2),
      templateList = _useState12[0],
      setTemplateList = _useState12[1];

  var _useState13 = Object(reactfrom_dll_reference_dll_library["useState"])(),
      _useState14 = MyData_slicedToArray(_useState13, 2),
      selectedTemplate = _useState14[0],
      setSelectedTemplate = _useState14[1]; // 选中模板的id，-1为全部


  var selectedTemplateUpdate = function selectedTemplateUpdate(value) {
    setSelectedTemplate(value);
  };

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setLoading(true);

    if (selectedTemplate != null) {
      Object(Info["a" /* Info */])().then(function (res) {
        TemplateDataList(String(selectedTemplate), pageSize, 1, [res.email], DOIState).then(function (value) {
          if (value.results.length === 0) {
            setDataSource([]);
          } else {
            setDataSource(value.results);
          }

          setLoading(false);
          setTotal(value.page_count * value.page_size);
          setPageSize(value.page_size);
          setCurrentPage(value.page);
        });
      });
    } else {
      MyDataList(1, DOIState).then(function (value) {
        setDataSource(value.results);
        setLoading(false);
        setTotal(value.total);
        setPageSize(value.page_size);
        setCurrentPage(value.page);
      });
    }

    Object(ListTemplates["b" /* ListDataTemplates */])().then(function (res) {
      setTemplateList(res);
    });
  }, []); // useEffect(() => {
  //   setLoading(true);
  //   if (selectedTemplate != null){
  //     Info().then( (res) => {
  //       TemplateDataList(String(selectedTemplate), pageSize, 1, [res.email], DOIState).then((value: any) => {
  //         if (value.results.length === 0) { setDataSource([]); }
  //         else {setDataSource(value.results); }
  //         setLoading(false);
  //         setTotal(value.page_count*value.page_size);
  //         setPageSize(value.page_size);
  //         setCurrentPage(value.page);
  //       });
  //     });
  //   }
  //   else {
  //     MyDataList(1, DOIState).then((value) => {
  //       setDataSource(value.results);
  //       setLoading(false);
  //       setTotal(value.total);
  //       setPageSize(value.page_size);
  //       setCurrentPage(value.page);
  //     });
  //   }
  // }, [selectedTemplate]);

  var handlePageChange = function handlePageChange(page, subject) {
    setLoading(true);

    if (selectedTemplate === null) {
      MyDataList(page, DOIState, false, total, subject).then(function (value) {
        setDataSource(value.results);
        setLoading(false);
        setTotal(value.total);
        setPageSize(value.page_size);
        setCurrentPage(value.page);
      });
    } else {
      Object(Info["a" /* Info */])().then(function (res) {
        TemplateDataList(String(selectedTemplate), pageSize, page, [res.email], DOIState).then(function (value) {
          if (value.results.length === 0) {
            setDataSource([]);
          } else {
            setDataSource(value.results);
          }

          setLoading(false);
          setTotal(value.page_count * value.page_size);
          setPageSize(value.page_size);
          setCurrentPage(value.page);
        });
      });
    }
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleCheckWrapper["a" /* RoleCheckWrapper */], {
    forbidMessage: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'dashboard:my_data_forbid',
      defaultMessage: "\u60A8\u6CA1\u6709\u4E0A\u4F20\u6A21\u677F\u7684\u6743\u9650"
    }),
    requiredRoles: [User["d" /* UserRole */].DataUploader]
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      flexDirection: 'column',
      width: '100%'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DataListViewer_v3_DataListViewerV3, {
    admin: true,
    total: total,
    DOIState: DOIState,
    pageSize: pageSize,
    selectedTemplate: selectedTemplate,
    page: currentPage,
    update: selectedTemplateUpdate,
    loading: loading,
    templateList: templateList,
    onPageChange: handlePageChange,
    data: dataSource
  })));
};
// CONCATENATED MODULE: ./components/dashboard/pages/MyTemplate.tsx



function MyTemplate_slicedToArray(arr, i) { return MyTemplate_arrayWithHoles(arr) || MyTemplate_iterableToArrayLimit(arr, i) || MyTemplate_unsupportedIterableToArray(arr, i) || MyTemplate_nonIterableRest(); }

function MyTemplate_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function MyTemplate_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return MyTemplate_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return MyTemplate_arrayLikeToArray(o, minLen); }

function MyTemplate_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function MyTemplate_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function MyTemplate_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }











function MyTemplate_PathnameToReviewState(pathname) {
  if (pathname.startsWith('/template/pending')) {
    return ReviewState["a" /* ReviewState */].Pending;
  } else if (pathname.startsWith('/template/approved')) {
    return ReviewState["a" /* ReviewState */].Approved;
  } else if (pathname.startsWith('/template/disapproved')) {
    return ReviewState["a" /* ReviewState */].Disapproved;
  } else {
    return ReviewState["a" /* ReviewState */].All;
  }
}

var MyTemplate_MyTemplate = function _MyTemplate(props) {
  var currentState = MyTemplate_PathnameToReviewState(props.location.pathname);

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = MyTemplate_slicedToArray(_useState, 2),
      dataSource = _useState2[0],
      setDataSource = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState4 = MyTemplate_slicedToArray(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState6 = MyTemplate_slicedToArray(_useState5, 2),
      total = _useState6[0],
      setTotal = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState8 = MyTemplate_slicedToArray(_useState7, 2),
      pageSize = _useState8[0],
      setPageSize = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(1),
      _useState10 = MyTemplate_slicedToArray(_useState9, 2),
      currentPage = _useState10[0],
      setCurrentPage = _useState10[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    if (!props.session.fetched) {
      return;
    }

    Object(ListTemplates["c" /* ListTemplates */])(currentState, 1).then(function (value) {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.count);
      setPageSize(value.page_size);
      setCurrentPage(1);
    });
  }, [props.location.pathname, props.session.fetched]);

  var handlePageChange = function handlePageChange(page) {
    Object(ListTemplates["c" /* ListTemplates */])(currentState, page).then(function (value) {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.count);
      setPageSize(value.page_size);
      setCurrentPage(page);
    });
  };

  if (!props.session.fetched) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null);
  } else return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleCheckWrapper["a" /* RoleCheckWrapper */], {
    forbidMessage: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'dashboard:my_template_forbid',
      defaultMessage: "\u60A8\u6CA1\u6709\u4E0A\u4F20\u6A21\u677F\u7684\u6743\u9650"
    }),
    requiredRoles: [User["d" /* UserRole */].TemplateUploader]
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      flexDirection: 'column',
      width: '100%'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '16px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, {
    size: 'large',
    value: currentState,
    buttonStyle: 'solid'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].Pending,
    onClick: function onClick() {
      return props.history.push('/template/pending');
    }
  }, Object(Text["a" /* TEXT */])('dash:pending', '等待审核')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].Approved,
    onClick: function onClick() {
      return props.history.push('/template/approved');
    }
  }, Object(Text["a" /* TEXT */])('dash:approved', '审核通过')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].Disapproved,
    onClick: function onClick() {
      return props.history.push('/template/disapproved');
    }
  }, Object(Text["a" /* TEXT */])('dash:disapproved', '未通过审核')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: ReviewState["a" /* ReviewState */].All,
    onClick: function onClick() {
      return props.history.push('/template/all');
    }
  }, Object(Text["a" /* TEXT */])('dash:show_all', '全部')))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TemplatesReviewViewer_TemplatesReviewViewer, {
    allowDelete: true,
    allowEdit: true,
    total: total,
    pageSize: pageSize,
    current: currentPage,
    loading: loading,
    onPageChange: handlePageChange,
    data: dataSource
  })));
};
var MyTemplate = withSession_withSession(MyTemplate_MyTemplate);
// EXTERNAL MODULE: ./node_modules/antd/lib/popconfirm/style/index.js
var popconfirm_style = __webpack_require__(226);

// EXTERNAL MODULE: ./node_modules/antd/lib/popconfirm/index.js
var popconfirm = __webpack_require__(134);
var popconfirm_default = /*#__PURE__*/__webpack_require__.n(popconfirm);

// EXTERNAL MODULE: ./apis/template/ListSnippets.ts
var ListSnippets = __webpack_require__(123);

// CONCATENATED MODULE: ./components/dashboard/pages/MySnippet.tsx











function MySnippet_slicedToArray(arr, i) { return MySnippet_arrayWithHoles(arr) || MySnippet_iterableToArrayLimit(arr, i) || MySnippet_unsupportedIterableToArray(arr, i) || MySnippet_nonIterableRest(); }

function MySnippet_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function MySnippet_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return MySnippet_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return MySnippet_arrayLikeToArray(o, minLen); }

function MySnippet_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function MySnippet_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function MySnippet_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }








var MySnippet_Column = table_default.a.Column;
var MySnippet_MySnippet = function _MySnippet(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = MySnippet_slicedToArray(_useState, 2),
      dataSource = _useState2[0],
      setDataSource = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState4 = MySnippet_slicedToArray(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState6 = MySnippet_slicedToArray(_useState5, 2),
      total = _useState6[0],
      setTotal = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(20),
      _useState8 = MySnippet_slicedToArray(_useState7, 2),
      pageSize = _useState8[0],
      setPageSize = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(1),
      _useState10 = MySnippet_slicedToArray(_useState9, 2),
      currentPage = _useState10[0],
      setCurrentPage = _useState10[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    if (!props.session.fetched) {
      return;
    }

    Object(ListSnippets["e" /* get_snippets */])(1).then(function (value) {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.total);
      setCurrentPage(1);
    });
  }, [props.location.pathname, props.session.fetched]);

  var handlePageChange = function handlePageChange(page) {
    Object(ListSnippets["e" /* get_snippets */])(page).then(function (value) {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.total);
      setCurrentPage(page);
    });
  };

  var handleViewClick = function handleViewClick(record) {
    window.open('/storage/check_snippet/' + record.id);
  };

  var handleClick = function handleClick(record) {
    window.open('/storage/edit_snippet/' + record.id);
  };

  var handleDelete = function handleDelete(id) {
    Object(ListSnippets["b" /* delete_snippet */])(id).then(function (res) {
      location.reload();
    })["catch"](function (reason) {
      notification_default.a.error({
        message: reason.message
      });
    });
  };

  if (!props.session.fetched) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null);
  } else return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleCheckWrapper["a" /* RoleCheckWrapper */], {
    forbidMessage: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'dashboard:my_template_forbid',
      defaultMessage: "\u60A8\u6CA1\u6709\u4E0A\u4F20\u6A21\u677F\u7684\u6743\u9650"
    }),
    requiredRoles: [User["d" /* UserRole */].TemplateUploader]
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    dataSource: dataSource,
    pagination: {
      total: total,
      pageSize: pageSize,
      current: currentPage,
      onChange: function onChange(current) {
        return handlePageChange(current);
      }
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MySnippet_Column, {
    title: Object(Text["a" /* TEXT */])('dash:ID', '编号'),
    dataIndex: 'id',
    key: 'id'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MySnippet_Column, {
    title: Object(Text["a" /* TEXT */])('dash:title', '标题'),
    dataIndex: 'snippet_name',
    key: 'snippet_name',
    width: '30%'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MySnippet_Column, {
    title: Object(Text["a" /* TEXT */])('dash:pub_date', '上传时间'),
    dataIndex: 'add_time',
    key: 'add_time',
    render: function render(text) {
      return new Date(text.replace(/-/g, "/")).toLocaleString();
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MySnippet_Column, {
    title: Object(Text["a" /* TEXT */])('dash:action', '操作'),
    render: function render(record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        onClick: function onClick() {
          handleViewClick(record);
        }
      }, Object(Text["a" /* TEXT */])('dash:view_data_list', '查看')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
        type: 'vertical'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        type: 'primary',
        onClick: function onClick() {
          handleClick(record);
        }
      }, Object(Text["a" /* TEXT */])('template:edit', '修改')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
        type: 'vertical'
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(popconfirm_default.a, {
        title: '确定删除？',
        onConfirm: function onConfirm() {
          handleDelete(record.id);
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        type: 'danger'
      }, Object(Text["a" /* TEXT */])('template:delete', '删除'))));
    }
  }))));
};
var MySnippet = withSession_withSession(MySnippet_MySnippet);
// CONCATENATED MODULE: ./apis/define/Ticket.ts
var Ticket;

(function (Ticket) {
  var Type;

  (function (Type) {
    Type[Type["RoleRequest"] = 1] = "RoleRequest";
    Type[Type["Template"] = 2] = "Template";
    Type[Type["Data"] = 3] = "Data";
    Type[Type["Suggestion"] = 4] = "Suggestion";
  })(Type = Ticket.Type || (Ticket.Type = {}));

  var Status;

  (function (Status) {
    // 处理中
    Status[Status["Open"] = 1] = "Open"; // 已完成

    Status[Status["Done"] = 2] = "Done"; // 已关闭

    Status[Status["Ended"] = 3] = "Ended";
  })(Status = Ticket.Status || (Ticket.Status = {}));
})(Ticket || (Ticket = {}));
// CONCATENATED MODULE: ./apis/ticketing/List.ts
function ticketing_List_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function ticketing_List_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { ticketing_List_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { ticketing_List_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function ListTicktes(_x, _x2, _x3) {
  return _ListTicktes.apply(this, arguments);
}

function _ListTicktes() {
  _ListTicktes = ticketing_List_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(t_type, status, page) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", Object(Fetch["h" /* RestListFetch */])(Urls["b" /* default */].api_v1_ticketing.tickets, 'GET', {
              page: page,
              t_type: t_type,
              status: status
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _ListTicktes.apply(this, arguments);
}
// EXTERNAL MODULE: ./utils/Base64.ts
var Base64 = __webpack_require__(292);

// CONCATENATED MODULE: ./apis/session/ListRoleRequests.ts
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function ListRoleRequests_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function ListRoleRequests_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { ListRoleRequests_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { ListRoleRequests_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }




var RequestStatus;

(function (RequestStatus) {
  RequestStatus[RequestStatus["Pending"] = 1] = "Pending";
  RequestStatus[RequestStatus["Refused"] = 3] = "Refused";
  RequestStatus[RequestStatus["Granted"] = 2] = "Granted";
  RequestStatus[RequestStatus["All"] = -1] = "All";
})(RequestStatus || (RequestStatus = {}));

function ListRoleRequests(_x, _x2) {
  return _ListRoleRequests.apply(this, arguments);
}

function _ListRoleRequests() {
  _ListRoleRequests = ListRoleRequests_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(status, page) {
    var tickets, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return ListTicktes(Ticket.Type.RoleRequest, status, page);

          case 2:
            tickets = _context.sent;
            result = {
              count: tickets.count,
              page_size: tickets.page_size,
              next: tickets.next,
              previous: tickets.previous,
              results: tickets.results.map(function (ticket) {
                var regExp = /AUTH_CODE\{([^)]+)\}/;
                var match = regExp.exec(ticket.content);

                if (match != null) {
                  var authCodeStr = Object(Base64["a" /* Decode */])(regExp.exec(ticket.content)[1]);
                  var roles = /roles=\[([^\]]+)\]/.exec(authCodeStr)[1].split(',').map(function (s) {
                    return Number(s);
                  });
                  var admin_categorys = ((/category=\[([^\]]+)\]/.exec(authCodeStr) || [])[1] || '').split(',').map(function (s) {
                    return Number(s);
                  });
                  var desc = (/desc=\[([^\]]+)\]/.exec(authCodeStr) || [])[1] || '(旧版申请，请自行查看工单内容)';
                  return _objectSpread(_objectSpread({}, ticket), {}, {
                    roles: roles,
                    admin_categorys: admin_categorys,
                    has_auth_code: true,
                    desc: desc,
                    old_style: false
                  });
                } else {
                  return _objectSpread(_objectSpread({}, ticket), {}, {
                    roles: [],
                    admin_categorys: [],
                    has_auth_code: false,
                    desc: '(旧版申请，请自行查看工单内容)',
                    old_style: true
                  });
                }
              })
            };
            return _context.abrupt("return", result);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _ListRoleRequests.apply(this, arguments);
}
// CONCATENATED MODULE: ./components/dashboard/item_viewer/UserItemViewer.tsx



var UserItemViewer_UserItemViewer = function UserItemViewer(props) {
  var userInfo = props.userInfo;
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, "\u7528\u6237\u540D\uFF1A", userInfo.username, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u59D3\u540D\uFF1A", userInfo.real_name, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u90AE\u7BB1\uFF1A", userInfo.email, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u5355\u4F4D\uFF1A", userInfo.institution, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), props.showRoles ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, "\u6743\u9650\uFF1A", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UserRoleRender_UserRoleRender, {
    roles: userInfo.roles
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), "\u7BA1\u7406\u7684\u5206\u7C7B\uFF1A", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ManagedCategoriesRender_ManagedCategoriesRender, {
    categoryies: userInfo.managed_categories
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)) : null);
};
// CONCATENATED MODULE: ./components/dashboard/renderers/EditableUserRoleRender.tsx





var AllRoles = [User["d" /* UserRole */].DataUploader, User["d" /* UserRole */].TemplateUploader, User["d" /* UserRole */].DataAdmin, User["d" /* UserRole */].TemplateAdmin, User["d" /* UserRole */].DOIAdmin, User["d" /* UserRole */].Verified];
var EditableUserRoleRender_EditableUserRoleRender = function EditableUserRoleRender(props) {
  var handleSwitchChange = function handleSwitchChange(toggle, role) {
    var newRoles = new Set(props.roles);
    if (toggle) newRoles.add(role);else newRoles["delete"](role);
    props.onChange(Array.from(newRoles));
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, "\u4FEE\u6539\u7528\u6237\u6743\u9650\uFF1A", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), AllRoles.map(function (value) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, {
      key: value
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(checkbox_default.a, {
      checked: props.roles.includes(value),
      onChange: function onChange(e) {
        return handleSwitchChange(e.target.checked, value);
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: Object(User["b" /* RoleToMsgID */])(value)
    })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null));
  }));
};
// CONCATENATED MODULE: ./apis/user/Get.ts
function Get_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function Get_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { Get_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { Get_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function GetUser(_x) {
  return _GetUser.apply(this, arguments);
}

function _GetUser() {
  _GetUser = Get_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", Object(Fetch["k" /* default */])(Urls["b" /* default */].api_v1_account.user_resource(id)));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _GetUser.apply(this, arguments);
}
// EXTERNAL MODULE: ./components/common/CategoryList.tsx
var CategoryList = __webpack_require__(458);

// EXTERNAL MODULE: ./apis/user/PatchPermission.ts
var PatchPermission = __webpack_require__(658);

// CONCATENATED MODULE: ./components/dashboard/item_viewer/RoleRequestItemViewer.tsx





function RoleRequestItemViewer_slicedToArray(arr, i) { return RoleRequestItemViewer_arrayWithHoles(arr) || RoleRequestItemViewer_iterableToArrayLimit(arr, i) || RoleRequestItemViewer_unsupportedIterableToArray(arr, i) || RoleRequestItemViewer_nonIterableRest(); }

function RoleRequestItemViewer_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function RoleRequestItemViewer_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return RoleRequestItemViewer_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return RoleRequestItemViewer_arrayLikeToArray(o, minLen); }

function RoleRequestItemViewer_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function RoleRequestItemViewer_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function RoleRequestItemViewer_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }










var RoleRequestItemViewer_RoleRequestItemViewer = function _RoleRequestItemViewer(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState2 = RoleRequestItemViewer_slicedToArray(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState4 = RoleRequestItemViewer_slicedToArray(_useState3, 2),
      userInfo = _useState4[0],
      setUserInfo = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState6 = RoleRequestItemViewer_slicedToArray(_useState5, 2),
      newUserRoles = _useState6[0],
      setNewUserRoles = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState8 = RoleRequestItemViewer_slicedToArray(_useState7, 2),
      newCategories = _useState8[0],
      setNewCategories = _useState8[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setLoading(true);
    GetUser(props.record.created_by).then(function (value) {
      setUserInfo(value);
      setLoading(false);
      setNewUserRoles(value.roles);
      setNewCategories(value.managed_categories.map(function (v) {
        return v.id;
      }));
    });
  }, [props.record.created_by]);

  var handleUserRoleChange = function handleUserRoleChange(newRoles) {
    setNewUserRoles(newRoles);
  };

  var handleUpdateClick = function handleUpdateClick() {
    Object(PatchPermission["a" /* PatchPermission */])(props.record.created_by, newUserRoles, newCategories, props.record.id).then(function () {
      notification_default.a['success']({
        message: Object(Text["a" /* TEXT */])('op_success', '操作成功')
      });
    })["catch"](function (reason) {
      notification_default.a['error']({
        message: reason.message
      });
    });
  };

  if (loading) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null);
  } else return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(UserItemViewer_UserItemViewer, {
    userInfo: userInfo
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(EditableUserRoleRender_EditableUserRoleRender, {
    roles: newUserRoles,
    onChange: handleUserRoleChange
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, "\u9700\u8981\u7BA1\u7406\u7684\u5206\u7C7B\uFF1A", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      maxHeight: '320px',
      overflowY: 'scroll',
      border: '1px solid #CCC',
      borderRadius: '4px',
      padding: '0 16px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CategoryList["a" /* CategoryList */], {
    value: newCategories,
    onChange: setNewCategories
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '8px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    onClick: handleUpdateClick
  }, Object(Text["a" /* TEXT */])('dash:save', '更新'))));
};

var RoleRequestItemViewer = withModal_withModal(RoleRequestItemViewer_RoleRequestItemViewer, Object(Text["a" /* TEXT */])('dash:review', '权限申请审核'));
// CONCATENATED MODULE: ./apis/user/RefuseRoleRequest.ts
function RefuseRoleRequest_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function RefuseRoleRequest_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { RefuseRoleRequest_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { RefuseRoleRequest_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function RefuseRoleRequest(_x, _x2) {
  return _RefuseRoleRequest.apply(this, arguments);
}

function _RefuseRoleRequest() {
  _RefuseRoleRequest = RefuseRoleRequest_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ticketID, reason) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", Object(Fetch["k" /* default */])(Urls["b" /* default */].api_v1_ticketing.finish_ticket, 'POST', {
              ticket_id: ticketID,
              reason: reason
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _RefuseRoleRequest.apply(this, arguments);
}
// CONCATENATED MODULE: ./components/dashboard/modal/RefuseRoleRequestModal.tsx







function RefuseRoleRequestModal_slicedToArray(arr, i) { return RefuseRoleRequestModal_arrayWithHoles(arr) || RefuseRoleRequestModal_iterableToArrayLimit(arr, i) || RefuseRoleRequestModal_unsupportedIterableToArray(arr, i) || RefuseRoleRequestModal_nonIterableRest(); }

function RefuseRoleRequestModal_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function RefuseRoleRequestModal_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return RefuseRoleRequestModal_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return RefuseRoleRequestModal_arrayLikeToArray(o, minLen); }

function RefuseRoleRequestModal_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function RefuseRoleRequestModal_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function RefuseRoleRequestModal_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }





var RefuseRoleRequestModal_reasons = ['不符合申请创建模板权限要求', '不符合申请用户管理权限要求', '不符合申请模板管理权限要求', '不符合申请数据管理模板权限要求', '不符合申请DOI管理限要求'];

var RefuseRoleRequestModal_RefuseRoleRequestView = function RefuseRoleRequestView(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = RefuseRoleRequestModal_slicedToArray(_useState, 2),
      reasonList = _useState2[0],
      setReasonList = _useState2[1];

  var toggleReason = function toggleReason(reason, value) {
    var set = new Set(reasonList);
    if (value) set.add(reason);else set["delete"](reason);
    setReasonList(Array.from(set));
  };

  var handleButtonClick = function handleButtonClick() {
    RefuseRoleRequest(props.record.id, reasonList.join(',')).then(function () {
      notification_default.a['success']({
        message: Object(Text["a" /* TEXT */])('op_success', '操作成功')
      });
    })["catch"](function (reason) {
      notification_default.a['error']({
        message: reason.message
      });
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, Object(Text["a" /* TEXT */])('dash:choose_reason', '请选择拒绝理由：'), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), RefuseRoleRequestModal_reasons.map(function (value) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, {
      key: value
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(checkbox_default.a, {
      checked: reasonList.includes(value),
      onChange: function onChange(e) {
        return toggleReason(value, e.target.checked);
      }
    }, value), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null));
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      textAlign: 'center',
      margin: '16px 0 -8px 0'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    disabled: reasonList.length === 0,
    type: 'danger',
    onClick: handleButtonClick
  }, Object(Text["a" /* TEXT */])('dash:refuse_and_close', '拒绝并关闭申请'))));
};

var RefuseRoleRequestModal = withModal_withModal(RefuseRoleRequestModal_RefuseRoleRequestView, Object(Text["a" /* TEXT */])('dash:review', '审核'));
// EXTERNAL MODULE: ./components/dashboard/viewer/RoleRequestViewer.less
var viewer_RoleRequestViewer = __webpack_require__(1757);

// CONCATENATED MODULE: ./components/dashboard/viewer/RoleRequestViewer.tsx









function RoleRequestViewer_slicedToArray(arr, i) { return RoleRequestViewer_arrayWithHoles(arr) || RoleRequestViewer_iterableToArrayLimit(arr, i) || RoleRequestViewer_unsupportedIterableToArray(arr, i) || RoleRequestViewer_nonIterableRest(); }

function RoleRequestViewer_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function RoleRequestViewer_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return RoleRequestViewer_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return RoleRequestViewer_arrayLikeToArray(o, minLen); }

function RoleRequestViewer_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function RoleRequestViewer_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function RoleRequestViewer_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }








var RoleRequestViewer_Column = table_default.a.Column;
var RoleRequestViewer_RoleRequestViewer = function RoleRequestViewer(props) {
  var handleTableChange = function handleTableChange(pagination) {
    props.onPageChange(pagination.current);
  };

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = RoleRequestViewer_slicedToArray(_useState, 2),
      innerData = _useState2[0],
      setInnerData = _useState2[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setInnerData(props.data);
  }, [props.data]);

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState4 = RoleRequestViewer_slicedToArray(_useState3, 2),
      showViewModal = _useState4[0],
      setShowViewModal = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState6 = RoleRequestViewer_slicedToArray(_useState5, 2),
      currentViewRecord = _useState6[0],
      setCurrentViewRecord = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState8 = RoleRequestViewer_slicedToArray(_useState7, 2),
      showRefuseModal = _useState8[0],
      setShowRefuseModal = _useState8[1];

  var handleViewRecord = function handleViewRecord(record) {
    setCurrentViewRecord(record);
    setShowViewModal(true);
  };

  var handleRefuseRecord = function handleRefuseRecord(record) {
    setCurrentViewRecord(record);
    setShowRefuseModal(true);
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    onChange: handleTableChange,
    rowKey: 'id',
    dataSource: innerData,
    loading: props.loading,
    pagination: {
      total: props.total,
      pageSize: props.pageSize,
      current: props.current
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleRequestViewer_Column, {
    align: 'center',
    title: Object(Text["a" /* TEXT */])('dash:ticket_id', '工单编号'),
    dataIndex: 'id',
    key: 'id'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleRequestViewer_Column, {
    align: 'center',
    title: Object(Text["a" /* TEXT */])('dash:applicant', '申请人'),
    dataIndex: 'real_name',
    key: 'real_name'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleRequestViewer_Column, {
    align: 'center',
    title: Object(Text["a" /* TEXT */])('dash:time', '申请时间'),
    dataIndex: 'created_at',
    key: 'created_at',
    render: function render(text) {
      return new Date(text.replace(/-/g, "/")).toLocaleString();
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleRequestViewer_Column, {
    align: 'center',
    className: 'RoleRequestViewer__DescColumn',
    title: Object(Text["a" /* TEXT */])('dash:description', '说明'),
    dataIndex: 'desc',
    key: 'desc'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleRequestViewer_Column, {
    align: 'center',
    title: Object(Text["a" /* TEXT */])('dash:roles', '申请权限'),
    dataIndex: 'roles',
    key: 'roles',
    render: function render(value) {
      return value.map(function (role, index) {
        return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, {
          key: role
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(tag_default.a, {
          style: {
            fontSize: '16px'
          }
        }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
          id: Object(User["b" /* RoleToMsgID */])(role)
        })), (index + 1) % 3 === 0 ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null) : null);
      });
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleRequestViewer_Column, {
    align: 'center',
    width: '10%',
    title: Object(Text["a" /* TEXT */])('dash:action', '操作'),
    key: 'action',
    render: function render(text, record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        style: {
          display: 'flex'
        }
      }, props.admin && record.status == 1 ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        type: 'default',
        onClick: function onClick() {
          return handleViewRecord(record);
        }
      }, Object(Text["a" /* TEXT */])('dash:review', '审核')) : null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
        type: 'vertical'
      }), props.admin && record.status == 1 ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        type: 'danger',
        onClick: function onClick() {
          return handleRefuseRecord(record);
        }
      }, Object(Text["a" /* TEXT */])('dash:refuse', '拒绝')) : null);
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleRequestItemViewer, {
    visible: showViewModal,
    record: currentViewRecord,
    onClose: function onClose() {
      return setShowViewModal(false);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RefuseRoleRequestModal, {
    visible: showRefuseModal,
    record: currentViewRecord,
    onClose: function onClose() {
      return setShowRefuseModal(false);
    }
  }));
};
// CONCATENATED MODULE: ./components/dashboard/pages/UserRoleReview.tsx



function UserRoleReview_slicedToArray(arr, i) { return UserRoleReview_arrayWithHoles(arr) || UserRoleReview_iterableToArrayLimit(arr, i) || UserRoleReview_unsupportedIterableToArray(arr, i) || UserRoleReview_nonIterableRest(); }

function UserRoleReview_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function UserRoleReview_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return UserRoleReview_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return UserRoleReview_arrayLikeToArray(o, minLen); }

function UserRoleReview_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function UserRoleReview_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function UserRoleReview_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }









function UserRoleReview_PathnameToReviewState(pathname) {
  if (pathname.startsWith('/review/user_role/pending')) {
    return RequestStatus.Pending;
  } else if (pathname.startsWith('/review/user_role/approved')) {
    return RequestStatus.Granted;
  } else if (pathname.startsWith('/review/user_role/disapproved')) {
    return RequestStatus.Refused;
  } else {
    return null;
  }
}

var UserRoleReview_UserRoleReview = function UserRoleReview(props) {
  var currentState = UserRoleReview_PathnameToReviewState(props.location.pathname);

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(1),
      _useState2 = UserRoleReview_slicedToArray(_useState, 2),
      currentPage = _useState2[0],
      setCurrentPage = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState4 = UserRoleReview_slicedToArray(_useState3, 2),
      total = _useState4[0],
      setTotal = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState6 = UserRoleReview_slicedToArray(_useState5, 2),
      pageSize = _useState6[0],
      setPageSize = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState8 = UserRoleReview_slicedToArray(_useState7, 2),
      loading = _useState8[0],
      setLoading = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState10 = UserRoleReview_slicedToArray(_useState9, 2),
      dataSource = _useState10[0],
      setDataSource = _useState10[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setLoading(true);
    ListRoleRequests(currentState).then(function (value) {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.count);
      setPageSize(value.page_size);
      setCurrentPage(1);
    });
  }, [props.location.pathname]);

  var handlePageChange = function handlePageChange(page) {
    setLoading(true);
    ListRoleRequests(currentState, page).then(function (value) {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.count);
      setPageSize(value.page_size);
      setCurrentPage(page);
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleCheckWrapper["a" /* RoleCheckWrapper */], {
    forbidMessage: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'dashboard:rolereview_forbid',
      defaultMessage: "\u60A8\u6CA1\u6709\u7BA1\u7406\u7528\u6237\u7684\u6743\u9650"
    }),
    requiredRoles: [User["d" /* UserRole */].UserAdmin]
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      flexDirection: 'column',
      width: '100%'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '16px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, {
    size: 'large',
    value: currentState,
    buttonStyle: 'solid'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: RequestStatus.Pending,
    onClick: function onClick() {
      return props.history.push('/review/user_role/pending');
    }
  }, Object(Text["a" /* TEXT */])('dash:pending', '等待审核')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: RequestStatus.Granted,
    onClick: function onClick() {
      return props.history.push('/review/user_role/approved');
    }
  }, Object(Text["a" /* TEXT */])('dash:approved', '审核通过')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: RequestStatus.Refused,
    onClick: function onClick() {
      return props.history.push('/review/user_role/disapproved');
    }
  }, Object(Text["a" /* TEXT */])('dash:disapproved', '未通过审核')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: null,
    onClick: function onClick() {
      return props.history.push('/review/user_role/all');
    }
  }, Object(Text["a" /* TEXT */])('dash:show_all', '全部')))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleRequestViewer_RoleRequestViewer, {
    admin: true,
    total: total,
    pageSize: pageSize,
    current: currentPage,
    loading: loading,
    onPageChange: handlePageChange,
    data: dataSource
  })));
};
// EXTERNAL MODULE: ./node_modules/antd/lib/pagination/style/index.js
var pagination_style = __webpack_require__(139);

// EXTERNAL MODULE: ./node_modules/antd/lib/pagination/index.js
var pagination = __webpack_require__(72);
var pagination_default = /*#__PURE__*/__webpack_require__.n(pagination);

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

// EXTERNAL MODULE: ./node_modules/antd/lib/card/style/index.js
var card_style = __webpack_require__(212);

// EXTERNAL MODULE: ./node_modules/antd/lib/card/index.js
var card = __webpack_require__(106);
var card_default = /*#__PURE__*/__webpack_require__.n(card);

// CONCATENATED MODULE: ./apis/data/DatasetList.ts
function DatasetList_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function DatasetList_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { DatasetList_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { DatasetList_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function DatasetList(_x) {
  return _DatasetList.apply(this, arguments);
}

function _DatasetList() {
  _DatasetList = DatasetList_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(page) {
    var page_size,
        parameters,
        url,
        result,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            page_size = _args.length > 1 && _args[1] !== undefined ? _args[1] : 10;
            parameters = "page=" + page + "&page_size=" + page_size;
            url = "".concat(Urls["b" /* default */].api_v3_storage.create_dataset, "?").concat(parameters);
            _context.next = 5;
            return Object(Fetch["a" /* JsonApiFetch */])(url, 'GET');

          case 5:
            result = _context.sent;
            return _context.abrupt("return", result);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _DatasetList.apply(this, arguments);
}

function AddDataset(_x2) {
  return _AddDataset.apply(this, arguments);
}

function _AddDataset() {
  _AddDataset = DatasetList_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(body) {
    var result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Object(Fetch["a" /* JsonApiFetch */])(Urls["b" /* default */].api_v3_storage.create_dataset, 'POST', body);

          case 2:
            result = _context2.sent;
            return _context2.abrupt("return", result);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _AddDataset.apply(this, arguments);
}

function DeleteDataset(_x3) {
  return _DeleteDataset.apply(this, arguments);
}

function _DeleteDataset() {
  _DeleteDataset = DatasetList_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(id) {
    var url, result;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            url = "".concat(Urls["b" /* default */].api_v3_storage.create_dataset, "/").concat(id);
            _context3.next = 3;
            return Object(Fetch["a" /* JsonApiFetch */])(url, 'DELETE');

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
  return _DeleteDataset.apply(this, arguments);
}

function ViewDataset(_x4) {
  return _ViewDataset.apply(this, arguments);
}

function _ViewDataset() {
  _ViewDataset = DatasetList_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(id) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt("return", Object(Fetch["a" /* JsonApiFetch */])(Urls["b" /* default */].api_v3_storage.manage_dataset_one(id)));

          case 1:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _ViewDataset.apply(this, arguments);
}

function RegisterDoi(_x5) {
  return _RegisterDoi.apply(this, arguments);
}

function _RegisterDoi() {
  _RegisterDoi = DatasetList_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(datasets) {
    var result;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return Object(Fetch["a" /* JsonApiFetch */])(Urls["b" /* default */].api_v3_storage.register_doi, 'POST', datasets);

          case 2:
            result = _context5.sent;
            return _context5.abrupt("return", result);

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _RegisterDoi.apply(this, arguments);
}

function TempalteDataRegisterDoi(_x6) {
  return _TempalteDataRegisterDoi.apply(this, arguments);
}

function _TempalteDataRegisterDoi() {
  _TempalteDataRegisterDoi = DatasetList_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(template_id) {
    var result;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return Object(Fetch["a" /* JsonApiFetch */])(Urls["b" /* default */].api_v1_storage.data_dois, 'POST', {
              template_id: template_id
            });

          case 2:
            result = _context6.sent;
            return _context6.abrupt("return", result);

          case 4:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _TempalteDataRegisterDoi.apply(this, arguments);
}
// CONCATENATED MODULE: ./components/dashboard/modal/DatasetModal.tsx





function DatasetModal_slicedToArray(arr, i) { return DatasetModal_arrayWithHoles(arr) || DatasetModal_iterableToArrayLimit(arr, i) || DatasetModal_unsupportedIterableToArray(arr, i) || DatasetModal_nonIterableRest(); }

function DatasetModal_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function DatasetModal_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return DatasetModal_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return DatasetModal_arrayLikeToArray(o, minLen); }

function DatasetModal_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function DatasetModal_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function DatasetModal_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



var DatasetModal_DatasetModal = function DatasetModal(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState2 = DatasetModal_slicedToArray(_useState, 2),
      page = _useState2[0],
      setPage = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(5),
      _useState4 = DatasetModal_slicedToArray(_useState3, 2),
      pageSize = _useState4[0],
      setPageSize = _useState4[1];

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    title: Object(Text["a" /* TEXT */])('data', '数据列表'),
    visible: props.visible,
    onOk: function onOk() {
      props.onClose();
      setPage(0);
    },
    onCancel: props.onClose,
    okText: Object(Text["a" /* TEXT */])('close', '关闭'),
    closable: false,
    cancelButtonProps: {
      disabled: true,
      style: {
        display: 'none'
      }
    }
  }, props.record.slice(page * pageSize, page * pageSize + pageSize).map(function (v) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
      href: "/storage/data/" + v,
      target: "_blank"
    }, v), " ");
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: "center",
      alignItems: "center"
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'link',
    disabled: page === 0,
    onClick: function onClick() {
      setPage(page - 1);
    }
  }, "\u4E0A\u4E00\u9875"), page + 1, " / ", Math.ceil(props.record.length / pageSize) > 0 ? Math.ceil(props.record.length / pageSize) : 1, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'link',
    disabled: page + 1 >= props.record.length / pageSize,
    onClick: function onClick() {
      setPage(page + 1);
    }
  }, "\u4E0B\u4E00\u9875"))));
};
// CONCATENATED MODULE: ./components/dashboard/viewer/DoiListViewer.tsx













function DoiListViewer_slicedToArray(arr, i) { return DoiListViewer_arrayWithHoles(arr) || DoiListViewer_iterableToArrayLimit(arr, i) || DoiListViewer_unsupportedIterableToArray(arr, i) || DoiListViewer_nonIterableRest(); }

function DoiListViewer_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function DoiListViewer_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return DoiListViewer_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return DoiListViewer_arrayLikeToArray(o, minLen); }

function DoiListViewer_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function DoiListViewer_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function DoiListViewer_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }






var DoiListViewer_DoiListViewer = function DoiListViewer(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = DoiListViewer_slicedToArray(_useState, 2),
      innerData = _useState2[0],
      setInnerData = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState4 = DoiListViewer_slicedToArray(_useState3, 2),
      dataVisible = _useState4[0],
      setDataVisible = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState6 = DoiListViewer_slicedToArray(_useState5, 2),
      dataIds = _useState6[0],
      setDataIds = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState8 = DoiListViewer_slicedToArray(_useState7, 2),
      showDeleteModal = _useState8[0],
      setShowDeleteModal = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(),
      _useState10 = DoiListViewer_slicedToArray(_useState9, 2),
      tempIds = _useState10[0],
      setTempIds = _useState10[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setInnerData(props.data);
  }, [props.data]);

  var informUpdate = function informUpdate() {
    DatasetList(props.page).then(function (value) {
      setInnerData(value.results);
    });
  };

  var deleteDataset = function deleteDataset() {
    DeleteDataset(tempIds);
    informUpdate();
    setShowDeleteModal(false);
  };

  var viewData = function viewData(e) {
    setDataVisible(true);
    ViewDataset(e.target.value).then(function (value) {
      setDataIds(value.data_ids);
    });
  };

  var exportDataset = function exportDataset(e) {
    ViewDataset(e.target.value).then(function (value) {
      setDataIds(value.data_ids);
      var ids = [];
      value.data_ids.forEach(function (element) {
        ids.push(String(element));
      });
      Object(ExportData["a" /* ExportData */])('XLSX', ids, false).then(function (value) {
        window.open(value.result);
      });
    });
  };

  var handleDeleteButtonClick = function handleDeleteButtonClick(e) {
    setShowDeleteModal(true);
    setTempIds(e.target.value);
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, innerData.map(function (v) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      key: v.id
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(card_default.a, {
      hoverable: false,
      title: v.title,
      key: v.id,
      headStyle: {
        background: '#5AA6C8',
        color: '#fff'
      },
      bodyStyle: {
        padding: '10px'
      },
      style: {
        width: '100%',
        marginTop: '10px'
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      style: {
        display: 'inline',
        "float": 'right',
        width: '95%'
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, {
      style: {
        height: '30px'
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
      span: 18
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", null, Object(Text["a" /* TEXT */])('dash:dataset_name', '数据集名称：')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", null, v.title)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
      span: 6
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      size: 'small',
      value: v.id,
      onClick: exportDataset
    }, Object(Text["a" /* TEXT */])('dash:download_dataset', '数据集下载')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      size: 'small',
      type: 'danger',
      value: v.id,
      onClick: handleDeleteButtonClick
    }, Object(Text["a" /* TEXT */])('dash:delete', '删除')))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, {
      style: {
        height: '30px'
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
      span: 18
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", null, Object(Text["a" /* TEXT */])('dash:doi', 'DOI：')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", null, v.doi)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
      span: 6
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      size: 'small',
      type: 'primary',
      value: v.id,
      onClick: viewData
    }, Object(Text["a" /* TEXT */])('dash:view_data_list', '查看数据')))))));
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DatasetModal_DatasetModal, {
    visible: dataVisible,
    record: dataIds,
    onClose: function onClose() {
      return setDataVisible(false);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(pagination_default.a, {
    onChange: function onChange(page) {
      return props.onPageChange(page);
    },
    current: Number(props.page),
    size: 'big',
    pageSize: props.pageSize,
    total: props.total
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    title: Object(Text["a" /* TEXT */])('warning', '警告'),
    visible: showDeleteModal,
    okText: Object(Text["a" /* TEXT */])('ok', '确认'),
    cancelText: Object(Text["a" /* TEXT */])('cancel', '取消'),
    onCancel: function onCancel() {
      return setShowDeleteModal(false);
    },
    onOk: deleteDataset
  }, Object(Text["a" /* TEXT */])('template:delete_warning', '确定要删除这个数据集吗？')));
};
// CONCATENATED MODULE: ./components/dashboard/pages/Dataset.tsx
function Dataset_slicedToArray(arr, i) { return Dataset_arrayWithHoles(arr) || Dataset_iterableToArrayLimit(arr, i) || Dataset_unsupportedIterableToArray(arr, i) || Dataset_nonIterableRest(); }

function Dataset_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function Dataset_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return Dataset_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Dataset_arrayLikeToArray(o, minLen); }

function Dataset_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function Dataset_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function Dataset_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }







var Dataset_DoiList = function DoiList(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = Dataset_slicedToArray(_useState, 2),
      dataSource = _useState2[0],
      setDataSource = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState4 = Dataset_slicedToArray(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState6 = Dataset_slicedToArray(_useState5, 2),
      total = _useState6[0],
      setTotal = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(10),
      _useState8 = Dataset_slicedToArray(_useState7, 2),
      pageSize = _useState8[0],
      setPageSize = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(1),
      _useState10 = Dataset_slicedToArray(_useState9, 2),
      currentPage = _useState10[0],
      setCurrentPage = _useState10[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setLoading(true);
    DatasetList(1).then(function (value) {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.total);
      setPageSize(value.page_size);
      setCurrentPage(value.page);
    });
  }, [props.location.pathname]);

  var handlePageChange = function handlePageChange(page) {
    setLoading(true);
    DatasetList(page).then(function (value) {
      setDataSource(value.results);
      setLoading(false);
      setTotal(value.total);
      setPageSize(value.page_size);
      setCurrentPage(value.page);
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleCheckWrapper["a" /* RoleCheckWrapper */], {
    forbidMessage: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'dashboard:my_data_forbid',
      defaultMessage: "\u60A8\u6CA1\u6709\u4E0A\u4F20\u6A21\u677F\u7684\u6743\u9650"
    }),
    requiredRoles: [User["d" /* UserRole */].DataUploader]
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      flexDirection: 'column',
      width: '100%'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DoiListViewer_DoiListViewer, {
    admin: true,
    total: total,
    pageSize: pageSize,
    page: currentPage,
    loading: loading,
    onPageChange: handlePageChange,
    data: dataSource
  })));
};
// CONCATENATED MODULE: ./components/dashboard/pages/DOIRegister.tsx







function DOIRegister_slicedToArray(arr, i) { return DOIRegister_arrayWithHoles(arr) || DOIRegister_iterableToArrayLimit(arr, i) || DOIRegister_unsupportedIterableToArray(arr, i) || DOIRegister_nonIterableRest(); }

function DOIRegister_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function DOIRegister_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return DOIRegister_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return DOIRegister_arrayLikeToArray(o, minLen); }

function DOIRegister_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function DOIRegister_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function DOIRegister_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }








var DOIRegister_Column = table_default.a.Column;
var DOIRegister_DOIRegister = function DOIRegister(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = DOIRegister_slicedToArray(_useState, 2),
      dataSource = _useState2[0],
      setDataSource = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState4 = DOIRegister_slicedToArray(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(10),
      _useState6 = DOIRegister_slicedToArray(_useState5, 2),
      pageSize = _useState6[0],
      setPageSize = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(1),
      _useState8 = DOIRegister_slicedToArray(_useState7, 2),
      currentPage = _useState8[0],
      setCurrentPage = _useState8[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    Object(ListTemplates["b" /* ListDataTemplates */])().then(function (value) {
      setDataSource(value);
      setLoading(false);
    });
  }, []);

  var handlePageChange = function handlePageChange(page) {
    setCurrentPage(page);
  };

  var handleClick = function handleClick(record) {
    TempalteDataRegisterDoi(record.template__id).then(function (value) {
      notification_default.a['success']({
        message: '已提交申请'
      });
    })["catch"](function (error) {
      notification_default.a['error']({
        message: error.message
      });
    });
    window.location.href = "/dashboard/#/doi";
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleCheckWrapper["a" /* RoleCheckWrapper */], {
    forbidMessage: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'dashboard:my_data_forbid',
      defaultMessage: "\u60A8\u6CA1\u6709\u4E0A\u4F20\u6A21\u677F\u7684\u6743\u9650"
    }),
    requiredRoles: [User["d" /* UserRole */].DataUploader]
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      flexDirection: 'column',
      width: '100%'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    dataSource: dataSource,
    loading: loading,
    pagination: {
      total: dataSource.length,
      pageSize: pageSize,
      current: currentPage,
      onChange: function onChange(current) {
        handlePageChange(current);
      }
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DOIRegister_Column, {
    title: Object(Text["a" /* TEXT */])('dash:ID', '模板编号'),
    dataIndex: 'template__id',
    key: 'template__id'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DOIRegister_Column, {
    title: Object(Text["a" /* TEXT */])('name', '模板名称'),
    dataIndex: 'template__title',
    key: 'template__title'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DOIRegister_Column, {
    title: Object(Text["a" /* TEXT */])('dash:data_count', '数据量'),
    dataIndex: 'data__count',
    key: 'data__count'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(DOIRegister_Column, {
    title: Object(Text["a" /* TEXT */])('dash:action', '操作'),
    render: function render(record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        type: 'primary',
        onClick: function onClick() {
          handleClick(record);
        }
      }, Object(Text["a" /* TEXT */])('dash:apply_doi', '申请DOI'));
    }
  }))));
};
// CONCATENATED MODULE: ./apis/certificate/Apply.ts

 // 申请汇交证明

function ApplyCertificationApi(params) {
  var url = Urls["b" /* default */].api_cert.apply_certification;
  return Object(Fetch["k" /* default */])(url, 'POST', params);
} // 申请汇交验收

function ApplyVerificationApi(params) {
  var url = Urls["b" /* default */].api_cert.apply_verification;
  return Object(Fetch["k" /* default */])(url, 'POST', params);
}
function GetGroupLeaders() {
  var url = Urls["b" /* default */].api_cert.get_group_leaders; // const url = 'http://mged.nmdms.ustb.edu.cn/api/cert/groupleaders';

  return Object(Fetch["k" /* default */])(url, 'GET');
}
// CONCATENATED MODULE: ./components/dashboard/pages/ManagerCertification/ApplyVerification.tsx















function ApplyVerification_slicedToArray(arr, i) { return ApplyVerification_arrayWithHoles(arr) || ApplyVerification_iterableToArrayLimit(arr, i) || ApplyVerification_unsupportedIterableToArray(arr, i) || ApplyVerification_nonIterableRest(); }

function ApplyVerification_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function ApplyVerification_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return ApplyVerification_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ApplyVerification_arrayLikeToArray(o, minLen); }

function ApplyVerification_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ApplyVerification_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function ApplyVerification_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }





var ApplyVerification_Verification = function Verification(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState2 = ApplyVerification_slicedToArray(_useState, 2),
      submitting = _useState2[0],
      setSubmitting = _useState2[1]; // 是否正在提交


  var handleSubmit = function handleSubmit(e) {
    setSubmitting(true);
    e.preventDefault();
    props.form.validateFieldsAndScroll(function (err, values) {
      if (!err) {
        var params = {
          is_project: values.is_project,
          ps_id: values.ps_id,
          group_leader_username: values.group_leader_username
        };
        ApplyVerificationApi(params).then(function (res) {
          setModalVisible(true);
          setSubmitting(false);
        })["catch"](function () {
          setSubmitting(false);
        });
      }
    });
  };

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState4 = ApplyVerification_slicedToArray(_useState3, 2),
      modalVisible = _useState4[0],
      setModalVisible = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState6 = ApplyVerification_slicedToArray(_useState5, 2),
      loading = _useState6[0],
      setLoading = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState8 = ApplyVerification_slicedToArray(_useState7, 2),
      leaderNames = _useState8[0],
      setLeaderNames = _useState8[1];

  var getFieldDecorator = props.form.getFieldDecorator;

  var handleCancel = function handleCancel() {
    setModalVisible(false);
  };

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    GetGroupLeaders().then(function (res) {
      setLeaderNames(res);
      setLoading(false);
    })["catch"](function (res) {
      notification_default.a.error({
        message: res.message
      });
    });
  }, []);
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a, {
    style: {
      width: '40%',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '100px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a.Item, {
    label: Object(Text["a" /* TEXT */])('cert:choose', '请选择项目或课题'),
    style: {
      display: 'flex'
    }
  }, getFieldDecorator('is_project')( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a, {
    value: true
  }, Object(Text["a" /* TEXT */])('cert:project', '项目'))))), props.form.getFieldValue('is_project') == null ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a.Item, {
    style: {
      display: 'flex'
    },
    label: props.form.getFieldValue('is_project') === true ? Object(Text["a" /* TEXT */])('cert:project_number', '请输入项目编号') : Object(Text["a" /* TEXT */])('cert:subject_number', '请输入课题编号'),
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 16
    }
  }, getFieldDecorator('ps_id', {
    rules: [{
      required: true,
      message: Object(Text["a" /* TEXT */])('cert:empty', '不能为空')
    }]
  })( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, null))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a.Item, {
    label: Object(Text["a" /* TEXT */])('cert:group_leader_select', '请选择评价组长'),
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 16
    },
    style: {
      display: 'flex'
    }
  }, getFieldDecorator('group_leader_username', {
    rules: [{
      required: true,
      message: Object(Text["a" /* TEXT */])('cert:empty', '不能为空')
    }]
  })( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
    loading: loading
  }, leaderNames.map(function (item) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a.Option, {
      value: item.username
    }, item.name);
  })))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, submitting ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'primary',
    onClick: handleSubmit,
    disabled: true
  }, Object(Text["a" /* TEXT */])('cert:submitting', '正在提交')) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'primary',
    onClick: handleSubmit
  }, Object(Text["a" /* TEXT */])('cert:submit', '提交')))))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    visible: modalVisible,
    footer: [
    /*#__PURE__*/
    // <Button onClick={handleCancel}>取消</Button>,
    reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      key: 'submit',
      type: 'primary',
      onClick: function onClick() {
        window.location.reload();
      }
    }, Object(Text["a" /* TEXT */])('cert:confirm', '确认'))]
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, Object(Text["a" /* TEXT */])('cert:success_v', '申请提交成功'))));
};
var ApplyVerification = form_default.a.create({
  name: 'ApplyVerification'
})(withSession_withSession(ApplyVerification_Verification));
// CONCATENATED MODULE: ./components/dashboard/pages/ManagerCertification/ApplyCertification.tsx











function ApplyCertification_slicedToArray(arr, i) { return ApplyCertification_arrayWithHoles(arr) || ApplyCertification_iterableToArrayLimit(arr, i) || ApplyCertification_unsupportedIterableToArray(arr, i) || ApplyCertification_nonIterableRest(); }

function ApplyCertification_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function ApplyCertification_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return ApplyCertification_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ApplyCertification_arrayLikeToArray(o, minLen); }

function ApplyCertification_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ApplyCertification_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function ApplyCertification_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }





var ApplyCertification_Cert = function _Cert(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState2 = ApplyCertification_slicedToArray(_useState, 2),
      submitting = _useState2[0],
      setSubmitting = _useState2[1]; // 是否正在提交


  var getFieldDecorator = props.form.getFieldDecorator;

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState4 = ApplyCertification_slicedToArray(_useState3, 2),
      modalVisible = _useState4[0],
      setModalVisible = _useState4[1];

  var handleCancel = function handleCancel() {
    setModalVisible(false);
  };

  var handleSubmit = function handleSubmit(e) {
    setSubmitting(true);
    e.preventDefault();
    props.form.validateFieldsAndScroll(function (err, values) {
      if (!err) {
        var params = {
          is_project: values.is_project,
          ps_id: values.ps_id
        };
        ApplyCertificationApi(params).then(function (res) {
          setModalVisible(true);
          setSubmitting(false);
        })["catch"](function () {
          setSubmitting(false);
        });
      }
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a, {
    style: {
      width: '40%',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '100px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a.Item, {
    label: Object(Text["a" /* TEXT */])('cert:choose', '请选择项目或课题'),
    style: {
      display: 'flex'
    }
  }, getFieldDecorator('is_project')( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a, {
    value: true
  }, Object(Text["a" /* TEXT */])('cert:project', '项目')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a, {
    value: false
  }, Object(Text["a" /* TEXT */])('cert:subject', '课题'))))), props.form.getFieldValue('is_project') == null ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(form_default.a.Item, {
    style: {
      display: 'flex'
    },
    label: props.form.getFieldValue('is_project') === true ? Object(Text["a" /* TEXT */])('cert:project_number', '请输入项目编号') : Object(Text["a" /* TEXT */])('cert:subject_number', '请输入课题编号')
  }, getFieldDecorator('ps_id', {
    rules: [{
      required: true,
      message: Object(Text["a" /* TEXT */])('cert:empty', '不能为空')
    }]
  })( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, null))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, submitting ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'primary',
    onClick: handleSubmit,
    disabled: true
  }, Object(Text["a" /* TEXT */])('cert:submitting', '正在提交')) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'primary',
    onClick: handleSubmit
  }, Object(Text["a" /* TEXT */])('cert:submit', '提交')))))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    visible: modalVisible,
    footer: [/*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      onClick: handleCancel
    }, Object(Text["a" /* TEXT */])('cert:cancel', '取消')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      key: "submit",
      type: "primary"
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
      href: '/task'
    }, Object(Text["a" /* TEXT */])('cert:confirm', '确认')))]
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, Object(Text["a" /* TEXT */])('cert:success', '申请提交成功，点击确认按钮可跳转至任务页面查看申请进度'))));
};
var ApplyCertification = form_default.a.create({
  name: 'cert'
})(withSession_withSession(ApplyCertification_Cert));
// EXTERNAL MODULE: ./components/dashboard/modal/EvaluationModal.less
var modal_EvaluationModal = __webpack_require__(711);

// CONCATENATED MODULE: ./apis/define/AcceptanceState.ts
var AcceptanceState;

(function (AcceptanceState) {
  //验收中（可以分配专家）
  AcceptanceState[AcceptanceState["Dispatching"] = 0] = "Dispatching";
  AcceptanceState[AcceptanceState["Expert_Evaluating"] = 1] = "Expert_Evaluating";
  AcceptanceState[AcceptanceState["Leader_Evaluating"] = 2] = "Leader_Evaluating"; //验收结束

  AcceptanceState[AcceptanceState["Signature_Pending"] = 3] = "Signature_Pending";
  AcceptanceState[AcceptanceState["Failed"] = 4] = "Failed";
  AcceptanceState[AcceptanceState["Finished"] = 5] = "Finished";
})(AcceptanceState || (AcceptanceState = {}));
// EXTERNAL MODULE: ./node_modules/antd/lib/spin/style/index.js
var spin_style = __webpack_require__(153);

// EXTERNAL MODULE: ./node_modules/antd/lib/spin/index.js
var spin = __webpack_require__(68);
var spin_default = /*#__PURE__*/__webpack_require__.n(spin);

// CONCATENATED MODULE: ./apis/evaluation/commit.ts
function commit_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function commit_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { commit_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { commit_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function CommitEvaluation(_x, _x2, _x3, _x4) {
  return _CommitEvaluation.apply(this, arguments);
}

function _CommitEvaluation() {
  _CommitEvaluation = commit_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(acceptance_id, evaluations, comment, signature) {
    var url, evaluation, formData;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = Urls["b" /* default */].api_cert.upload_evaluation;
            evaluation = {
              "a": evaluations[0],
              "b": evaluations[1],
              "c": evaluations[2],
              "d": evaluations[3],
              "e": evaluations[4],
              "f": evaluations[5]
            };
            formData = new FormData();
            formData.append('signature', signature);
            formData.append('comment', comment);
            formData.append('acceptance_id', String(acceptance_id)); //formData.append('evaluation', JSON.stringify(evaluation));

            formData.append("a", evaluations[0]);
            formData.append("b", evaluations[1]);
            formData.append("c", evaluations[2]);
            formData.append("d", evaluations[3]);
            formData.append("e", evaluations[4]);
            formData.append("f", evaluations[5]);
            return _context.abrupt("return", Object(Fetch["j" /* UploadFetch */])(url, 'POST', formData));

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _CommitEvaluation.apply(this, arguments);
}
// CONCATENATED MODULE: ./apis/evaluation/evaluationpoint.ts
function evaluationpoint_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function evaluationpoint_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { evaluationpoint_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { evaluationpoint_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function GetEvaluationPoint() {
  return _GetEvaluationPoint.apply(this, arguments);
}

function _GetEvaluationPoint() {
  _GetEvaluationPoint = evaluationpoint_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var url;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = Urls["b" /* default */].api_cert.evaluation_point;
            _context.next = 3;
            return Object(Fetch["k" /* default */])(url, 'GET');

          case 3:
            return _context.abrupt("return", _context.sent);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _GetEvaluationPoint.apply(this, arguments);
}
// EXTERNAL MODULE: ./entry/CertificateViewer.tsx + 2 modules
var CertificateViewer = __webpack_require__(660);

// CONCATENATED MODULE: ./components/dashboard/item_viewer/EvaluationItemViewer.tsx





// function show_prcture(item:any){  //tiff格式图片显示
//     const [baseurl,setbaseurl]=useState('')
//     console.log(item.slice(-3));
//     if(item.slice(-3)==='tif') {    
//     var xhr = new XMLHttpRequest();
//     xhr.responseType = 'arraybuffer';
//      xhr.open('GET', 'http://118.178.121.89:8000'+item);
//      console.log('test', xhr)
//      xhr.onload = function (e) {
//      let tiff = new Tiff({buffer:xhr.response});
//      setbaseurl(tiff.toDataURL());
//      };    
//      xhr.send(); 
//      return(
//         <div style={{textAlign:'right'}}>   
//             <a style={{color:'black'}}>验收专家签字：&nbsp;</a> <img src={baseurl} style={{width:'200px',height:'auto',verticalAlign:'middle',position: 'absolute',right: '0px'}}></img>       
//         </div>
//       );}                       
//       else 
//       return (
//           <div style={{textAlign:'right'}}>
//             <a style={{color:'black'}}>验收专家签字：&nbsp;</a> <img src={'http://118.178.121.89:8000'+item} style={{width:'200px',height:'auto',verticalAlign:'middle'}}></img> 
//           </div>
//        );
// }
var EvaluationItemViewer_EvaluationItemViewer = function EvaluationItemViewer(props) {
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      marginBottom: '30px',
      overflowY: 'auto'
    }
  }, props.data.map(function (v) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("form", {
      name: 'VerificationReport1'
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, "\u8BC4\u4EF7\u4E13\u5BB6\uFF1A", v.expert_name), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      className: 'card_eva',
      style: {
        background: 'white'
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      className: 'table_row_eva'
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      className: 'table_eva',
      style: {
        borderRadius: '8px 0 0 0',
        width: '10%'
      }
    }, "\u5E8F\u53F7"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      className: 'table_eva',
      style: {
        width: '55%'
      }
    }, "\u8BC4\u4EF7\u6761\u76EE"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      className: 'table_eva',
      style: {
        borderRadius: '0 8px 0 0',
        width: '35%'
      }
    }, "\u8BC4\u4EF7\u7B49\u7EA7"))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, v.items.map(function (value, index) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'card_eva'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'table_row_eva'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'header_left_eva'
      }, index + 1), value.content === '综合评价' ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'header_content_eva',
        style: {
          background: '#81BED4',
          color: 'white'
        }
      }, value.content) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'header_content_eva'
      }, value.content), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'header_content_eva',
        style: {
          width: '35%'
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, {
        size: 'small',
        style: {
          display: 'flex',
          flexDirection: 'row'
        },
        defaultValue: value.result
      }, value.options.map(function (e) {
        return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
          className: 'header_right_eva'
        }, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a, {
          value: e,
          disabled: value.result === e ? false : true
        }, e));
      })))))));
    }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, '专家评价数据汇交情况：' + v.comment)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
      style: {
        color: 'black'
      }
    }, "\u8BC4\u4EF7\u4E13\u5BB6\u7B7E\u540D\uFF1A\xA0"), " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
      src: v.signature,
      style: {
        width: '200px',
        height: 'auto',
        verticalAlign: 'middle'
      }
    }))))));
  }));
};
// CONCATENATED MODULE: ./components/dashboard/modal/EvaluationModal.tsx















function EvaluationModal_slicedToArray(arr, i) { return EvaluationModal_arrayWithHoles(arr) || EvaluationModal_iterableToArrayLimit(arr, i) || EvaluationModal_unsupportedIterableToArray(arr, i) || EvaluationModal_nonIterableRest(); }

function EvaluationModal_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function EvaluationModal_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return EvaluationModal_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return EvaluationModal_arrayLikeToArray(o, minLen); }

function EvaluationModal_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function EvaluationModal_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function EvaluationModal_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }











var logo = __webpack_require__(410);

var EvaluationModal_EvaluationModal = function EvaluationModal(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = EvaluationModal_slicedToArray(_useState, 2),
      evaluationpoint = _useState2[0],
      setevaluationpoint = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState4 = EvaluationModal_slicedToArray(_useState3, 2),
      isGroupLeader = _useState4[0],
      setIsGroupLeader = _useState4[1]; // 判断当前用户是否是组长


  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState6 = EvaluationModal_slicedToArray(_useState5, 2),
      isManager = _useState6[0],
      setIsManager = _useState6[1]; // 判断是否未项目负责人或课题负责人


  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState8 = EvaluationModal_slicedToArray(_useState7, 2),
      comment = _useState8[0],
      setComment = _useState8[1]; // 评价情况


  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState10 = EvaluationModal_slicedToArray(_useState9, 2),
      evaluations = _useState10[0],
      setEvaluations = _useState10[1]; // 存储评价结果


  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState12 = EvaluationModal_slicedToArray(_useState11, 2),
      evaluationres = _useState12[0],
      setEvaluationres = _useState12[1]; // 存储评价结果


  var _useState13 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState14 = EvaluationModal_slicedToArray(_useState13, 2),
      getPDF = _useState14[0],
      setGetPDF = _useState14[1]; // 导出pdf的状态，true为正在导出


  var _useState15 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState16 = EvaluationModal_slicedToArray(_useState15, 2),
      percert = _useState16[0],
      setPercent = _useState16[1]; // 导出进度，100完成


  var _useState17 = Object(reactfrom_dll_reference_dll_library["useState"])('优'),
      _useState18 = EvaluationModal_slicedToArray(_useState17, 2),
      evaluationscore = _useState18[0],
      setEvaluationScore = _useState18[1];

  var _useState19 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState20 = EvaluationModal_slicedToArray(_useState19, 2),
      signature = _useState20[0],
      setSignature = _useState20[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    Object(Info["a" /* Info */])().then(function (value) {
      if (value.roles_for_acceptance.includes(User["a" /* AcceptanceRole */].GroupLeader)) {
        setIsGroupLeader(true);
      }

      if (value.roles_for_acceptance.includes(User["a" /* AcceptanceRole */].ProjectLeader) || value.roles_for_acceptance.includes(User["a" /* AcceptanceRole */].SubjectLeader)) {
        setIsManager(true);
      }
    });
    GetEvaluationPoint().then(function (value) {
      setevaluationpoint(value);
    });
    setEvaluationres(props.evaluationres);
  }, []);
  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    if (props.visible === false) {
      setEvaluations([]);
      setComment('');
    }

    if (props.evaluationscore >= 9 && props.evaluationscore <= 10) {
      setEvaluationScore('优');
    }

    if (props.evaluationscore >= 8 && props.evaluationscore < 9) {
      setEvaluationScore('良');
    }

    if (props.evaluationscore >= 7 && props.evaluationscore < 8) {
      setEvaluationScore('中');
    }

    if (props.evaluationscore >= 6 && props.evaluationscore < 7) {
      setEvaluationScore('合格');
    }

    if (props.evaluationscore < 6) {
      setEvaluationScore('不合格');
    }
  }, [props.visible]);

  var handlesubmitclick = function handlesubmitclick(values) {
    if (evaluations.length < 6) {
      notification_default.a.error({
        message: '请在评价等级全部选择后重新提交'
      });

      return 0;
    }

    if (comment === '') {
      notification_default.a.error({
        message: '请在填写评价情况后重新提交'
      });

      return 0;
    }

    if (signature === null) {
      notification_default.a.error({
        message: '请在上传签字章后重新提交'
      });

      return 0;
    }

    CommitEvaluation(props.record.acceptance_id, evaluations, comment, signature).then(function () {
      modal_default.a.success({
        content: '评价提交成功',
        onOk: function onOk() {
          props.onClose;
          window.location.reload();
        }
      });
    });
  };

  var getComment = function getComment(e) {
    setComment(e.target.value);
  };

  var getEvaluations = function getEvaluations(e, index) {
    evaluations[index] = e.target.value;
    evaluations[2] = evaluationscore;
  };

  var handleExport = function handleExport() {
    var key = props.record.cert_key;
    var url = Urls["b" /* default */].api_cert.export_evaluation(key);
    window.open(url);
  };

  var handleUpload = function handleUpload(e) {
    e.preventDefault(); //阻止元素发生默认行为（例如，当点击提交按钮时阻止对表单的提交）

    var file = e.target.files[0];
    setSignature(file);
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    title: null,
    visible: props.visible,
    onCancel: props.onClose,
    destroyOnClose: true,
    width: '1450px',
    style: {
      backgroundColor: '#F0F2F5',
      top: 68
    },
    footer: [/*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      key: 'cancel',
      onClick: props.onClose
    }, "\u53D6\u6D88"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      key: 'submit',
      type: 'primary',
      htmlType: 'submit',
      onClick: handlesubmitclick,
      disabled: props.record.finished
    }, "\u63D0\u4EA4")]
  }, props.record.finished ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      marginBottom: '10px'
    }
  }, getPDF ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'primary',
    style: {
      textAlign: 'center'
    },
    id: 'submitButton',
    disabled: true
  }, "\u5BFC\u51FA\u4E2D,\u8BF7\u7A0D\u5019 ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(spin_default.a, null), percert, "%") : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: 'primary',
    style: {
      textAlign: 'center'
    },
    id: 'submitButton',
    onClick: handleExport
  }, "\u4E0B\u8F7D\u62A5\u544A")) : null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      padding: '0 20px',
      background: '#F0F2F5'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("form", {
    name: 'VerificationReport1'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("img", {
    src: logo,
    style: {
      height: '40px'
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificateViewer["a" /* CertificateViewer */], {
    cert_key: props.record.cert_key
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      background: '#F0F2F5'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, props.record.finished === false ?
  /*#__PURE__*/
  // 未完成时填写评价
  reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      overflowY: 'auto'
    }
  }, isGroupLeader === true || isManager === true ?
  /*#__PURE__*/
  // 用户为组长时显示其他专家评价内容 项目课题负责人也显示
  reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(EvaluationItemViewer_EvaluationItemViewer, {
    data: props.evaluationres
  })) : null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'card_eva',
    style: {
      background: 'white'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'table_row_eva'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'table_eva',
    style: {
      borderRadius: '8px 0 0 0',
      width: '10%'
    }
  }, "\u5E8F\u53F7"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'table_eva',
    style: {
      width: '55%'
    }
  }, "\u8BC4\u4EF7\u6761\u76EE"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'table_eva',
    style: {
      borderRadius: '0 8px 0 0',
      width: '35%'
    }
  }, "\u8BC4\u4EF7\u7B49\u7EA7"))), evaluationpoint.map(function (value, index) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      className: 'card_eva'
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      className: 'table_row_eva'
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      className: 'header_left_eva'
    }, index + 1), value.content === '综合评价' ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      className: 'header_content_eva'
    }, "\u4FEE\u6539\u5EFA\u8BAE") : value.content === '评价等级' ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      className: 'header_content_eva',
      style: {
        background: '#81BED4',
        color: 'white'
      }
    }, "\u7EFC\u5408\u8BC4\u4EF7") : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      className: 'header_content_eva'
    }, value.content), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      className: 'header_content_eva',
      style: {
        width: '35%'
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, {
      size: 'small',
      style: {
        display: 'flex',
        flexDirection: 'row'
      },
      defaultValue: index === 2 ? evaluationscore : null,
      onChange: function onChange(e) {
        return getEvaluations(e, index);
      }
    }, value.options.map(function (e) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: 'header_right_eva'
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a, {
        value: e,
        disabled: index === 2 ? true : false
      }, e));
    }))))));
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a.TextArea, {
    placeholder: "\u4E13\u5BB6\u8BC4\u4EF7\u4EE5\u53CA\u4FEE\u6539\u5EFA\u8BAE\u60C5\u51B5\uFF1A\uFF08\u5FC5\u586B\uFF09",
    rows: 4,
    onChange: getComment
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      "float": "right",
      display: 'flex',
      flexDirection: 'row',
      marginBottom: '50px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, "\u70B9\u51FB\u4E0A\u4F20\u9A8C\u6536\u4E13\u5BB6\u7B7E\u540D\u7AE0\u56FE\u7247\uFF1A\u652F\u6301.jpg/.jpeg/.png/.bmp\u683C\u5F0F"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("input", {
    type: "file",
    name: "file",
    id: "file",
    onChange: handleUpload,
    accept: "image/jpg,image/jpeg,image/png,image/bmp"
  }))) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(EvaluationItemViewer_EvaluationItemViewer, {
    data: props.evaluationres
  }), " "))))));
};
// CONCATENATED MODULE: ./apis/evaluation/GetEvaluationResult.ts
function GetEvaluationResult_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function GetEvaluationResult_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { GetEvaluationResult_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { GetEvaluationResult_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function GetEvaluationResult(_x) {
  return _GetEvaluationResult.apply(this, arguments);
}

function _GetEvaluationResult() {
  _GetEvaluationResult = GetEvaluationResult_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id) {
    var url;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = Urls["b" /* default */].api_cert.evaluation_result;
            _context.next = 3;
            return Object(Fetch["k" /* default */])(url + id, 'GET');

          case 3:
            return _context.abrupt("return", _context.sent);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _GetEvaluationResult.apply(this, arguments);
}

function GetEvaluationJudge(_x2) {
  return _GetEvaluationJudge.apply(this, arguments);
}

function _GetEvaluationJudge() {
  _GetEvaluationJudge = GetEvaluationResult_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(acceptance_id) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", Object(Fetch["k" /* default */])(Urls["b" /* default */].api_cert.evalucation_judge(acceptance_id), 'GET'));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _GetEvaluationJudge.apply(this, arguments);
}

function GetEvaluationScore(_x3) {
  return _GetEvaluationScore.apply(this, arguments);
}

function _GetEvaluationScore() {
  _GetEvaluationScore = GetEvaluationResult_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(acceptance_id) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt("return", Object(Fetch["k" /* default */])(Urls["b" /* default */].api_cert.evalucation_score(acceptance_id), 'GET'));

          case 1:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _GetEvaluationScore.apply(this, arguments);
}
// CONCATENATED MODULE: ./components/dashboard/viewer/VerificationListViewer.tsx









function VerificationListViewer_slicedToArray(arr, i) { return VerificationListViewer_arrayWithHoles(arr) || VerificationListViewer_iterableToArrayLimit(arr, i) || VerificationListViewer_unsupportedIterableToArray(arr, i) || VerificationListViewer_nonIterableRest(); }

function VerificationListViewer_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function VerificationListViewer_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return VerificationListViewer_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return VerificationListViewer_arrayLikeToArray(o, minLen); }

function VerificationListViewer_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function VerificationListViewer_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function VerificationListViewer_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }








var VerificationListViewer_Column = table_default.a.Column;
var VerificationListViewer_VerificationListViewer = function VerificationListViewer(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState2 = VerificationListViewer_slicedToArray(_useState, 2),
      modalVisible = _useState2[0],
      setModalVisible = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState4 = VerificationListViewer_slicedToArray(_useState3, 2),
      ModalData = _useState4[0],
      setModalData = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState6 = VerificationListViewer_slicedToArray(_useState5, 2),
      EvaluationData = _useState6[0],
      setEvaluationData = _useState6[1];

  var handleEvaluationModal = function handleEvaluationModal(record) {
    setModalVisible(true);
    setModalData(record);
    GetEvaluationResult(record.id).then(function (value) {
      setEvaluationData(value);
    });
  };

  var handleDownload = function handleDownload(record) {
    window.open(Urls["b" /* default */].api_cert.signature(record.id));
  };

  var filters = [{
    text: Object(Text["a" /* TEXT */])('dash:expert_evaluating', '专家评价中'),
    value: String(AcceptanceState.Expert_Evaluating)
  }, {
    text: Object(Text["a" /* TEXT */])('dash:leader_evaluating', '评价组长评价中'),
    value: String(AcceptanceState.Leader_Evaluating)
  }, // {
  //     text: TEXT('dash:signature_pending', '等待上传签名报告'),
  //     value: String(AcceptanceState.Signature_Pending),
  // },
  {
    text: Object(Text["a" /* TEXT */])('dash:failed', '未通过'),
    value: String(AcceptanceState.Failed)
  }, {
    text: Object(Text["a" /* TEXT */])('dash:finished', '验收结束'),
    value: String(AcceptanceState.Finished)
  }];
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    rowKey: function rowKey(record) {
      return record.cert_key;
    },
    loading: props.loading,
    dataSource: props.data,
    pagination: {
      pageSize: props.pageSize,
      current: props.current,
      total: props.total,
      onChange: function onChange(current) {
        props.onPageChange(current);
      }
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(VerificationListViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:ps_id', '项目编号/课题编号'),
    dataIndex: 'ps_id',
    key: 'ps_id'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(VerificationListViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:ps_name', '项目名称/课题名称'),
    dataIndex: 'name',
    key: 'name',
    width: '25%'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(VerificationListViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:application_time', '发布时间'),
    dataIndex: 'create_time',
    key: 'create_time',
    render: function render(text) {
      return new Date(text.replace(/-/g, "/")).toLocaleDateString();
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(VerificationListViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:applicant', '申请人'),
    dataIndex: 'leader',
    key: 'leader'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(VerificationListViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:status', '状态'),
    dataIndex: 'state',
    key: 'state',
    filters: filters,
    filterIcon: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(icon_default.a, {
      type: "down"
    }),
    onFilter: function onFilter(value, record) {
      return record.state.toString() === value;
    },
    render: function render(value) {
      var content = null;

      switch (value) {
        case AcceptanceState.Dispatching:
          content = Object(Text["a" /* TEXT */])('dash:dispatching', '待分配验收专家');
          break;

        case AcceptanceState.Expert_Evaluating:
          content = Object(Text["a" /* TEXT */])('dash:expert_evaluating', '专家评价中');
          break;

        case AcceptanceState.Leader_Evaluating:
          content = Object(Text["a" /* TEXT */])('dash:leader_evaluating', '评价组长评价中');
          break;
        // case AcceptanceState.Signature_Pending: content = TEXT('dash:signature_pending', '等待上传签名报告');

        case AcceptanceState.Failed:
          content = Object(Text["a" /* TEXT */])('dash:failed', '未通过');
          break;

        case AcceptanceState.Finished:
          content = Object(Text["a" /* TEXT */])('dash:finished', '验收结束');
          break;
      }

      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, content, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null));
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(VerificationListViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:action', '操作'),
    render: function render(record) {
      var content = null;

      switch (record.state) {
        case AcceptanceState.Dispatching:
          content = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(popconfirm_default.a, {
            placement: 'top',
            onConfirm: function onConfirm(e) {
              props.handleDelete(record.id);
            },
            title: Object(Text["a" /* TEXT */])('dash:RevokeVerification', '确认要撤销吗'),
            okText: Object(Text["a" /* TEXT */])('submit', '确认'),
            cancelText: Object(Text["a" /* TEXT */])('cancel', '取消')
          }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
            type: 'danger',
            style: {
              marginRight: '10px'
            }
          }, Object(Text["a" /* TEXT */])('dash:revoke', '撤销')));
          break;

        case AcceptanceState.Signature_Pending:
        case AcceptanceState.Failed:
        case AcceptanceState.Finished:
          content = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
            style: {
              marginRight: '5px'
            },
            type: 'primary',
            onClick: function onClick() {
              handleEvaluationModal(record);
            }
          }, Object(Text["a" /* TEXT */])('dash:evaluation_reuslt', '查看评价结果')));
          break;
      }

      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, content);
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(EvaluationModal_EvaluationModal, {
    record: ModalData,
    visible: modalVisible,
    evaluationres: EvaluationData,
    evaluationscore: null,
    onClose: function onClose() {
      setModalVisible(false);
      setEvaluationData([]);
    }
  }));
};
// CONCATENATED MODULE: ./apis/certificate/GetVerificationList.ts


function StateToFinished(state) {
  return state === 3 || state === 4 || state === 5;
}
function GetVerificationList(page, page_size, state) {
  var url = Urls["b" /* default */].api_cert.get_verification_list;
  var my = 1; // 防止用户是评价组长的话看不到自己的汇交验收申请

  if (state === -1) {
    // 获取全部状态
    return Object(Fetch["k" /* default */])(url + '?page=' + page + '&page_size=' + page_size + '&my=' + my, 'GET');
  } else {
    return Object(Fetch["k" /* default */])(url + '?page=' + page + '&page_size=' + page_size + '&state=' + state + '&my=' + my, 'GET');
  }
}
// CONCATENATED MODULE: ./apis/certificate/Delete.ts


function DeleteVerification(acceptance_id) {
  var url = Urls["b" /* default */].api_cert.delete_verification(acceptance_id);
  return Object(Fetch["k" /* default */])(url, 'DELETE');
}
// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.js
var tslib_es6 = __webpack_require__(16);

// EXTERNAL MODULE: ./node_modules/core-decorators/es/core-decorators.js + 19 modules
var core_decorators = __webpack_require__(17);

// EXTERNAL MODULE: ./components/layout/RoleCheckWrapper.less
var layout_RoleCheckWrapper = __webpack_require__(1077);

// CONCATENATED MODULE: ./components/layout/AcceptanceRoleCheckWrapper.tsx
function AcceptanceRoleCheckWrapper_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { AcceptanceRoleCheckWrapper_typeof = function _typeof(obj) { return typeof obj; }; } else { AcceptanceRoleCheckWrapper_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return AcceptanceRoleCheckWrapper_typeof(obj); }




function AcceptanceRoleCheckWrapper_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function AcceptanceRoleCheckWrapper_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function AcceptanceRoleCheckWrapper_createClass(Constructor, protoProps, staticProps) { if (protoProps) AcceptanceRoleCheckWrapper_defineProperties(Constructor.prototype, protoProps); if (staticProps) AcceptanceRoleCheckWrapper_defineProperties(Constructor, staticProps); return Constructor; }

function AcceptanceRoleCheckWrapper_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) AcceptanceRoleCheckWrapper_setPrototypeOf(subClass, superClass); }

function AcceptanceRoleCheckWrapper_setPrototypeOf(o, p) { AcceptanceRoleCheckWrapper_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return AcceptanceRoleCheckWrapper_setPrototypeOf(o, p); }

function AcceptanceRoleCheckWrapper_createSuper(Derived) { var hasNativeReflectConstruct = AcceptanceRoleCheckWrapper_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = AcceptanceRoleCheckWrapper_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = AcceptanceRoleCheckWrapper_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return AcceptanceRoleCheckWrapper_possibleConstructorReturn(this, result); }; }

function AcceptanceRoleCheckWrapper_possibleConstructorReturn(self, call) { if (call && (AcceptanceRoleCheckWrapper_typeof(call) === "object" || typeof call === "function")) { return call; } return AcceptanceRoleCheckWrapper_assertThisInitialized(self); }

function AcceptanceRoleCheckWrapper_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function AcceptanceRoleCheckWrapper_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function AcceptanceRoleCheckWrapper_getPrototypeOf(o) { AcceptanceRoleCheckWrapper_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return AcceptanceRoleCheckWrapper_getPrototypeOf(o); }









var denied = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'denied',
  defaultMessage: "\u6743\u9650\u4E0D\u8DB3"
});
var loginRequired = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'session:login_required',
  defaultMessage: "\u5C1A\u672A\u767B\u5F55"
});
var goLogin = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
  id: 'session:go_login',
  defaultMessage: "\u53BB\u767B\u5F55"
});
var AcceptanceRoleCheckWrapper_AcceptanceRoleCheckWrapper = /*#__PURE__*/function (_Component) {
  AcceptanceRoleCheckWrapper_inherits(AcceptanceRoleCheckWrapper, _Component);

  var _super = AcceptanceRoleCheckWrapper_createSuper(AcceptanceRoleCheckWrapper);

  function AcceptanceRoleCheckWrapper(props) {
    AcceptanceRoleCheckWrapper_classCallCheck(this, AcceptanceRoleCheckWrapper);

    return _super.call(this, props);
  }

  AcceptanceRoleCheckWrapper_createClass(AcceptanceRoleCheckWrapper, [{
    key: "handleLoginClick",
    value: function handleLoginClick() {
      // window.location.href = `${Urls.account.login}?next=${window.location.pathname}`;
      window.location.href = Urls["b" /* default */].account.login_18;
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(session["a" /* SessionContext */].Consumer, null, function (value) {
        if (value.fetched && value.logged_in) {
          // 登录状态
          if (_this.props.requiredRoles.some(function (r) {
            return value.roles_for_acceptance.includes(r);
          })) {
            // 权限检查通过的情况下显示内容
            return _this.props.children;
          } else {
            return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
              className: 'RoleCheckWrapper'
            }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
              className: 'RoleCheckWrapper__title'
            }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("i", {
              className: 'fa fa-minus-circle'
            }), denied), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
              className: 'RoleCheckWrapper__message'
            }, _this.props.forbidMessage, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null)));
          }
        } else if (value.fetched) {
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
            className: 'RoleCheckWrapper'
          }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
            className: 'RoleCheckWrapper__title'
          }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("i", {
            className: 'fa fa-minus-circle'
          }), loginRequired), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
            className: 'RoleCheckWrapper__message'
          }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
            type: 'primary',
            size: 'large',
            href: "javascript:void(0)",
            onClick: _this.handleLoginClick
          }, goLogin)));
        } else {
          // loading 状态
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(FlexLoading["a" /* FlexLoading */], null);
        }
      });
    }
  }]);

  return AcceptanceRoleCheckWrapper;
}(reactfrom_dll_reference_dll_library["Component"]);

Object(tslib_es6["a" /* __decorate */])([core_decorators["a" /* autobind */]], AcceptanceRoleCheckWrapper_AcceptanceRoleCheckWrapper.prototype, "handleLoginClick", null);
// CONCATENATED MODULE: ./components/dashboard/pages/ManagerCertification/MyVerificationList.tsx



function MyVerificationList_slicedToArray(arr, i) { return MyVerificationList_arrayWithHoles(arr) || MyVerificationList_iterableToArrayLimit(arr, i) || MyVerificationList_unsupportedIterableToArray(arr, i) || MyVerificationList_nonIterableRest(); }

function MyVerificationList_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function MyVerificationList_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return MyVerificationList_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return MyVerificationList_arrayLikeToArray(o, minLen); }

function MyVerificationList_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function MyVerificationList_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function MyVerificationList_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }









function PathnameToState(pathname) {
  if (pathname.startsWith('/verify/verification_list/part')) {
    return 0;
  } else {
    return -1;
  }
}

var MyVerificationList_MyVerificationList = function MyVerificationList(props) {
  var currentState = PathnameToState(props.location.pathname);

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState2 = MyVerificationList_slicedToArray(_useState, 2),
      total = _useState2[0],
      setTotal = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(10),
      _useState4 = MyVerificationList_slicedToArray(_useState3, 2),
      pageSize = _useState4[0],
      setPageSize = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(1),
      _useState6 = MyVerificationList_slicedToArray(_useState5, 2),
      currentPage = _useState6[0],
      setCurrentPage = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState8 = MyVerificationList_slicedToArray(_useState7, 2),
      dataSource = _useState8[0],
      setDataSource = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(3),
      _useState10 = MyVerificationList_slicedToArray(_useState9, 2),
      pageCount = _useState10[0],
      setPageCount = _useState10[1]; // 总页数


  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState12 = MyVerificationList_slicedToArray(_useState11, 2),
      loading = _useState12[0],
      setLoading = _useState12[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    GetVerificationList(currentPage, pageSize, currentState).then(function (res) {
      var data = res.data;
      data.map(function (item) {
        item.finished = StateToFinished(item.state);
      });
      setPageCount(res.page_count);
      setDataSource(data);
      setCurrentPage(res.page);
      setLoading(false);
      setTotal(res.page_size * res.page_count);
    });
  }, [props.location.pathname]);

  var handleDelete = function handleDelete(id) {
    DeleteVerification(id).then(function (res) {
      window.location.reload();
    })["catch"](function (res) {});
  };

  var handlePageChange = function handlePageChange(current) {
    GetVerificationList(current, pageSize, currentState).then(function (res) {
      var data = res.data;
      data.map(function (item) {
        item.finished = StateToFinished(item.state);
      });
      setPageCount(res.page_count);
      setDataSource(data);
      setCurrentPage(res.page);
      setLoading(false);
      setTotal(res.page_size * res.page_count);
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(AcceptanceRoleCheckWrapper_AcceptanceRoleCheckWrapper, {
    requiredRoles: [User["a" /* AcceptanceRole */].ProjectLeader, User["a" /* AcceptanceRole */].SubjectLeader]
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, {
    size: 'large',
    value: currentState,
    buttonStyle: 'solid',
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: 0,
    onClick: function onClick() {
      return props.history.push('/verify/verification_list/part');
    }
  }, Object(Text["a" /* TEXT */])('to_be_verified', '待验收')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: -1,
    onClick: function onClick() {
      return props.history.push('/verify/verification_list');
    }
  }, Object(Text["a" /* TEXT */])('all_veri', '全部'))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(VerificationListViewer_VerificationListViewer, {
    data: dataSource,
    pageSize: pageSize,
    page_count: pageCount,
    current: currentPage,
    onPageChange: handlePageChange,
    handleDelete: handleDelete,
    loading: loading,
    total: total
  })));
};
// CONCATENATED MODULE: ./apis/certificate/GetCertificationList.ts


function GetCertificationList(page, page_size) {
  var url = Urls["b" /* default */].api_cert.get_certification_list;
  return Object(Fetch["k" /* default */])(url + '?page=' + page + '&page_size=' + page_size, 'GET');
}
// CONCATENATED MODULE: ./components/dashboard/viewer/CertificationListViewer.tsx








var CertificationListViewer_Column = table_default.a.Column;
var CertificationListViewer_CertificationListViewer = function CertificationListViewer(props) {
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleCheckWrapper["a" /* RoleCheckWrapper */], {
    forbidMessage: Object(Text["a" /* TEXT */])('dashboard:doi_review_forbid', '您没有权限'),
    requiredRoles: []
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    rowKey: function rowKey(record) {
      return record.cert_key;
    },
    loading: props.loading,
    dataSource: props.data,
    pagination: {
      pageSize: props.pageSize,
      current: props.current,
      total: props.total,
      onChange: function onChange(current) {
        props.onPageChange(current);
      }
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationListViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:ps_id', '项目编号/课题编号'),
    dataIndex: 'ps_id',
    key: 'ps_id'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationListViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:application_time', '申请时间'),
    dataIndex: 'issue_time',
    key: 'issue_time'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationListViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:expired_time', '过期时间'),
    dataIndex: 'expired_time',
    key: 'expired_time'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationListViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:expired', '是否过期'),
    dataIndex: 'expired',
    key: 'expired',
    render: function render(record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, record === true ? Object(Text["a" /* TEXT */])('dash:expired_true', '是') : Object(Text["a" /* TEXT */])('dash:expired_false', '否'));
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationListViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:action', '操作'),
    render: function render(record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: '/cert/' + record.key
      }, Object(Text["a" /* TEXT */])('dash:view', '查看')));
    }
  })));
};
// CONCATENATED MODULE: ./components/dashboard/pages/ManagerCertification/MyCertificationList.tsx



function MyCertificationList_slicedToArray(arr, i) { return MyCertificationList_arrayWithHoles(arr) || MyCertificationList_iterableToArrayLimit(arr, i) || MyCertificationList_unsupportedIterableToArray(arr, i) || MyCertificationList_nonIterableRest(); }

function MyCertificationList_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function MyCertificationList_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return MyCertificationList_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return MyCertificationList_arrayLikeToArray(o, minLen); }

function MyCertificationList_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function MyCertificationList_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function MyCertificationList_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var MyCertificationList_MyCertificationList = function MyCertificationList(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState2 = MyCertificationList_slicedToArray(_useState, 2),
      total = _useState2[0],
      setTotal = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(10),
      _useState4 = MyCertificationList_slicedToArray(_useState3, 2),
      pageSize = _useState4[0],
      setPageSize = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(1),
      _useState6 = MyCertificationList_slicedToArray(_useState5, 2),
      currentPage = _useState6[0],
      setCurrentPage = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState8 = MyCertificationList_slicedToArray(_useState7, 2),
      dataSource = _useState8[0],
      setDataSource = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(3),
      _useState10 = MyCertificationList_slicedToArray(_useState9, 2),
      pageCount = _useState10[0],
      setPageCount = _useState10[1]; // 总页数


  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState12 = MyCertificationList_slicedToArray(_useState11, 2),
      loading = _useState12[0],
      setLoading = _useState12[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    GetCertificationList(currentPage, pageSize).then(function (res) {
      setDataSource(res.data);
      setCurrentPage(res.page);
      setPageCount(res.page_count);
      setLoading(false);
      setTotal(res.page_count * res.page_size);
    });
  }, []);

  var handlePageChange = function handlePageChange(current) {
    GetCertificationList(current, pageSize).then(function (res) {
      setDataSource(res.data);
      setCurrentPage(res.page);
      setPageCount(res.page_count);
      setLoading(false);
      setTotal(res.page_count * res.page_size);
    })["catch"](function (res) {
      notification_default.a.error({
        message: res.message
      });
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationListViewer_CertificationListViewer, {
    data: dataSource,
    pageSize: pageSize,
    current: currentPage,
    page_count: pageCount,
    total: total,
    loading: loading,
    onPageChange: handlePageChange
  }));
};
// EXTERNAL MODULE: ./node_modules/antd/lib/typography/style/index.js
var typography_style = __webpack_require__(1758);

// EXTERNAL MODULE: ./node_modules/antd/lib/typography/index.js
var typography = __webpack_require__(666);
var typography_default = /*#__PURE__*/__webpack_require__.n(typography);

// CONCATENATED MODULE: ./components/dashboard/pages/ManagerCertification/VerificationVideo.tsx






var Title = typography_default.a.Title,
    Paragraph = typography_default.a.Paragraph,
    VerificationVideo_Text = typography_default.a.Text;
var VerificationVideo_VerificationVideo = function VerificationVideo(props) {
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      paddingLeft: '3%'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(typography_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Title, null, Object(Text["a" /* TEXT */])('video:title', '数据汇交验收流程演示视频')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Paragraph, null, Object(Text["a" /* TEXT */])('video:target', '为了帮助您更顺利的完成数据汇交验收流程，我们建议您观看下列演示视频。想了解更多关于本系统的信息可以前往'), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", null, Object(Text["a" /* TEXT */])('help', '帮助'))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Title, {
    level: 3
  }, Object(Text["a" /* TEXT */])('video:step1', '项目与课题创建')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("video", {
    style: {
      paddingLeft: '3%',
      margin: '10px auto',
      width: '80%'
    },
    controls: true
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("source", {
    src: "http://mged.nmdms.ustb.edu.cn/media/mgedata/_docs/video/\u9879\u76EE\u4E0E\u8BFE\u9898\u521B\u5EFA.mp4",
    type: "video/webm"
  }), Object(Text["a" /* TEXT */])('video:errow', '抱歉，您的浏览器可能不支持播放此视频')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Title, {
    level: 3
  }, Object(Text["a" /* TEXT */])('video:step2', '负责人申请验收')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("video", {
    style: {
      paddingLeft: '3%',
      margin: '10px auto',
      width: '80%'
    },
    controls: true,
    width: '600px'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("source", {
    src: "http://mged.nmdms.ustb.edu.cn/media/mgedata/_docs/video/\u8D1F\u8D23\u4EBA\u7533\u8BF7\u6C47\u4EA4\u9A8C\u6536.mp4",
    type: "video/webm"
  }), Object(Text["a" /* TEXT */])('video:errow', '抱歉，您的浏览器可能不支持播放此视频')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Title, {
    level: 3
  }, Object(Text["a" /* TEXT */])('video:step3', '验收组长分配验收专家')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("video", {
    style: {
      paddingLeft: '3%',
      margin: '10px auto',
      width: '80%'
    },
    controls: true,
    width: '600px'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("source", {
    src: "http://mged.nmdms.ustb.edu.cn/media/mgedata/_docs/video/\u9A8C\u6536\u7EC4\u957F\u4E13\u5BB6\u5206\u914D\u9A8C\u6536\u4E13\u5BB6.mp4",
    type: "video/webm"
  }), Object(Text["a" /* TEXT */])('video:errow', '抱歉，您的浏览器可能不支持播放此视频')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Title, {
    level: 3
  }, Object(Text["a" /* TEXT */])('video:step4', '验收评价')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("video", {
    style: {
      paddingLeft: '3%',
      margin: '10px auto',
      width: '80%'
    },
    controls: true,
    width: '600px'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("source", {
    src: "http://mged.nmdms.ustb.edu.cn/media/mgedata/_docs/video/\u9A8C\u6536\u8BC4\u4EF7.mp4",
    type: "video/webm"
  }), Object(Text["a" /* TEXT */])('video:errow', '抱歉，您的浏览器可能不支持播放此视频')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Title, {
    level: 3
  }, Object(Text["a" /* TEXT */])('video:step5', '查看评价结果')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("video", {
    style: {
      paddingLeft: '3%',
      margin: '10px auto',
      width: '80%'
    },
    controls: true,
    width: '600px'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("source", {
    src: "http://mged.nmdms.ustb.edu.cn/media/mgedata/_docs/video/\u67E5\u770B\u8BC4\u4EF7\u7ED3\u679C.mp4",
    type: "video/webm"
  }), Object(Text["a" /* TEXT */])('video:errow', '抱歉，您的浏览器可能不支持播放此视频'))));
};
// CONCATENATED MODULE: ./components/dashboard/viewer/CertificationDataViewer.tsx









function CertificationDataViewer_slicedToArray(arr, i) { return CertificationDataViewer_arrayWithHoles(arr) || CertificationDataViewer_iterableToArrayLimit(arr, i) || CertificationDataViewer_unsupportedIterableToArray(arr, i) || CertificationDataViewer_nonIterableRest(); }

function CertificationDataViewer_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function CertificationDataViewer_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return CertificationDataViewer_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return CertificationDataViewer_arrayLikeToArray(o, minLen); }

function CertificationDataViewer_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function CertificationDataViewer_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function CertificationDataViewer_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var CertificationDataViewer_Column = table_default.a.Column;
var CertificationDataViewer_CertificationDataViewer = function CertificationDataViewer(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState2 = CertificationDataViewer_slicedToArray(_useState, 2),
      subject = _useState2[0],
      setSubject = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState4 = CertificationDataViewer_slicedToArray(_useState3, 2),
      isModalVisible = _useState4[0],
      setIsModalVisible = _useState4[1];

  var exportData = function exportData(id) {
    Object(ExportData["a" /* ExportData */])('XLSX', Array(String(id)), false).then(function (value) {
      window.open(value.result);
    });
  };

  var columnSubjectReset = function columnSubjectReset() {
    setSubject('');
    props.onPageChange(1, '');
  };

  var columnSubjectSearch = function columnSubjectSearch() {
    props.onPageChange(1, subject);
  };

  var getSubjectSearchProps = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      padding: 8
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
    style: {
      width: 150,
      marginBottom: 8,
      display: 'block'
    },
    value: subject,
    onChange: function onChange(e) {
      return setSubject(e.target.value);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    type: "primary",
    icon: "search",
    size: "small",
    style: {
      width: 70,
      marginRight: 8
    },
    onClick: columnSubjectSearch
  }, "\u67E5\u627E"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
    onClick: columnSubjectReset,
    size: "small",
    style: {
      width: 70
    }
  }, "\u91CD\u7F6E")));
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    rowKey: 'id',
    loading: props.loading,
    dataSource: props.dataSource,
    pagination: {
      total: props.total,
      pageSize: props.pageSize,
      current: props.currentPage,
      onChange: function onChange(current) {
        props.onPageChange(current, subject);
      }
    }
  }, "                ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationDataViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:ID', '编号'),
    dataIndex: 'id',
    key: 'id'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationDataViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:data_title', '数据名称'),
    align: 'center',
    dataIndex: 'title',
    key: 'title',
    width: '300px',
    ellipsis: true
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationDataViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:range', '公开范围'),
    align: 'center',
    dataIndex: 'public_date',
    key: 'public_date' + 'id',
    filterIcon: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(icon_default.a, {
      type: 'down'
    }),
    render: function render(text, record) {
      var content = null;

      switch (record.public_range) {
        case 'public':
          content = Object(Text["a" /* TEXT */])('dash:public', '公开');
          break;

        case 'project':
          content = Object(Text["a" /* TEXT */])('dash:project', '项目');
          break;

        case 'subject':
          content = Object(Text["a" /* TEXT */])('dash:subject', '课题');
          break;

        case 'person':
          content = Object(Text["a" /* TEXT */])('dash:person', '个人');
          break;
      }

      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, content, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null));
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationDataViewer_Column, {
    align: 'center',
    title: Object(Text["a" /* TEXT */])('dash:pub_date', '公开时间'),
    key: 'public_date',
    dataIndex: 'public_date',
    render: function render(text) {
      return new Date(text).toLocaleString();
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationDataViewer_Column, {
    align: 'center',
    title: Object(Text["a" /* TEXT */])('dash:subject', '课题'),
    key: 'subject',
    dataIndex: 'subject',
    filterDropdown: getSubjectSearchProps,
    filterIcon: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(icon_default.a, {
      type: "search"
    }),
    render: function render(text, record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, record.subject);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationDataViewer_Column, {
    align: 'center',
    width: '200px',
    title: Object(Text["a" /* TEXT */])('dash:action', '操作'),
    key: 'action',
    render: function render(text, record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", null, Object(Text["a" /* TEXT */])('dash:original_upload_file', '原始上传文件')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        onClick: function onClick() {
          exportData(record.id);
        }
      }, Object(Text["a" /* TEXT */])('dash:download', '下载')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        style: {
          marginTop: '5px'
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        size: 'small',
        type: 'primary',
        onClick: function onClick() {
          window.open('/storage/data/' + record.id);
        }
      }, Object(Text["a" /* TEXT */])('dash:view_data_list', '查看数据'))));
    }
  })));
};
// CONCATENATED MODULE: ./components/dashboard/pages/CertificationData.tsx













function CertificationData_slicedToArray(arr, i) { return CertificationData_arrayWithHoles(arr) || CertificationData_iterableToArrayLimit(arr, i) || CertificationData_unsupportedIterableToArray(arr, i) || CertificationData_nonIterableRest(); }

function CertificationData_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function CertificationData_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return CertificationData_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return CertificationData_arrayLikeToArray(o, minLen); }

function CertificationData_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function CertificationData_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function CertificationData_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }





var CertificationData_Option = select_default.a.Option;
var CertificationData_Step = steps_default.a.Step;
var CertificationData_TreeNode = tree_select_default.a.TreeNode;

var CertificationData_renderChild = function renderChild(data, text) {
  if (data instanceof Array) {
    var res = [];
    data.map(function (item) {
      for (var key in item) {
        if (item[key] instanceof Array) {
          res.push( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationData_TreeNode, {
            selectable: false,
            title: key,
            value: key,
            key: key
          }, renderChild(item[key], key)));
        } else {
          res.push(renderChild(item[key], key));
        }
      }
    });
    return res;
  } else if (text != null) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationData_TreeNode, {
      title: text,
      value: data.category_id,
      key: data.category_id
    });
  } else {
    return null;
  }
};

var CertificationData_renderTreeNodes = function renderTreeNodes(data) {
  var result = [];

  for (var key in data) {
    var flag = data[key].hasOwnProperty('category_id');
    result.push( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationData_TreeNode, {
      selectable: flag,
      value: flag ? data[key].category_id : key,
      title: key,
      key: flag ? data[key].category_id : key
    }, CertificationData_renderChild(data[key])));
  }

  return result;
};

var CertificationData_CertificationData = function CertificationData() {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState2 = CertificationData_slicedToArray(_useState, 2),
      selectedCategory = _useState2[0],
      setSelectedCategory = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState4 = CertificationData_slicedToArray(_useState3, 2),
      selectedTemplate = _useState4[0],
      setSelectedTemplate = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState6 = CertificationData_slicedToArray(_useState5, 2),
      result = _useState6[0],
      setResult = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState8 = CertificationData_slicedToArray(_useState7, 2),
      currentStep = _useState8[0],
      setCurrentStep = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState10 = CertificationData_slicedToArray(_useState9, 2),
      acceptanceId = _useState10[0],
      setAcceptanceId = _useState10[1];

  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState12 = CertificationData_slicedToArray(_useState11, 2),
      selectedSubject = _useState12[0],
      setSelectedSubject = _useState12[1];

  var _useState13 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState14 = CertificationData_slicedToArray(_useState13, 2),
      dataSource = _useState14[0],
      setDataSource = _useState14[1];

  var _useState15 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState16 = CertificationData_slicedToArray(_useState15, 2),
      templateList = _useState16[0],
      setTemplateList = _useState16[1];

  var _useState17 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState18 = CertificationData_slicedToArray(_useState17, 2),
      isExpert = _useState18[0],
      setIsExpert = _useState18[1];

  var _useState19 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState20 = CertificationData_slicedToArray(_useState19, 2),
      isLeader = _useState20[0],
      setIsLeader = _useState20[1]; // 分页变量


  var _useState21 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState22 = CertificationData_slicedToArray(_useState21, 2),
      loading = _useState22[0],
      setLoading = _useState22[1];

  var _useState23 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState24 = CertificationData_slicedToArray(_useState23, 2),
      total = _useState24[0],
      setTotal = _useState24[1];

  var _useState25 = Object(reactfrom_dll_reference_dll_library["useState"])(10),
      _useState26 = CertificationData_slicedToArray(_useState25, 2),
      pageSize = _useState26[0],
      setPageSize = _useState26[1];

  var _useState27 = Object(reactfrom_dll_reference_dll_library["useState"])(1),
      _useState28 = CertificationData_slicedToArray(_useState27, 2),
      currentPage = _useState28[0],
      setCurrentPage = _useState28[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setIsExpert(window.location.href.includes('/cert/data'));
    setIsLeader(window.location.href.includes('/acceptance/data'));
  }, []);
  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    GetSubjectList(isExpert, isLeader).then(function (res) {
      setResult(res.results);
    });
  }, [isExpert, isLeader]);

  var handlePageChange = function handlePageChange(page) {
    setLoading(true);
    GetDataList(acceptanceId, selectedTemplate, selectedCategory, selectedSubject, pageSize, page).then(function (res) {
      setDataSource(res.results);
      setPageSize(res.page_size);
      setCurrentPage(res.page);
      setTotal(res.total);
      setLoading(false);
    });
  };

  var handleFilter = function handleFilter() {
    setLoading(true);
    GetDataList(acceptanceId, selectedTemplate, selectedCategory, selectedSubject).then(function (res) {
      setDataSource(res.results);
      setPageSize(res.page_size);
      setCurrentPage(res.page);
      setTotal(res.total);
      setLoading(false);
      setCurrentStep(0); // setSelectedSubject('');
      // setSelectedTemplate('');
      // setSelectedCategory('');
    });
  };

  var pre = function pre() {
    setCurrentStep(currentStep - 1);
  };

  var next = function next() {
    setCurrentStep(currentStep + 1);
  }; // 选择项目


  var Step1 = function Step1() {
    var selectProject = function selectProject(value) {
      setAcceptanceId(value);
      setCurrentStep(currentStep + 1);
      setSelectedCategory(''); // 因为有切换上一步、下一步的操作，这里必须置空，防止数据错乱

      setSelectedTemplate('');
    };

    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
      showSearch: true,
      style: {
        width: '400px'
      },
      placeholder: "\u9009\u62E9\u9879\u76EE\u7B5B\u9009\uFF08\u53EF\u641C\u7D22\uFF09",
      showArrow: true,
      onChange: selectProject,
      value: acceptanceId,
      optionFilterProp: 'children'
    }, result.map(function (item) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationData_Option, {
        key: item.acceptance.id,
        title: item.project.id,
        value: item.acceptance.id
      }, item.project.id, " / ", item.project.name);
    })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      style: {
        margin: '10px'
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      type: 'primary',
      onClick: next,
      style: acceptanceId === '' ? {
        display: 'none'
      } : {}
    }, "\u4E0B\u4E00\u6B65")));
  };

  var Step2 = function Step2() {
    var _useState29 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
        _useState30 = CertificationData_slicedToArray(_useState29, 2),
        list = _useState30[0],
        setList = _useState30[1];

    var _useState31 = Object(reactfrom_dll_reference_dll_library["useState"])({}),
        _useState32 = CertificationData_slicedToArray(_useState31, 2),
        categoryTree = _useState32[0],
        setCategoryTree = _useState32[1];

    var _useState33 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
        _useState34 = CertificationData_slicedToArray(_useState33, 2),
        loadingT = _useState34[0],
        setLoadingT = _useState34[1];

    Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
      GetTemplateList(Number(acceptanceId), isExpert, isLeader).then(function (res) {
        setList(res.results.templates);
        var temp = GetCategory(res.results.templates);
        setCategoryTree(temp);
        setLoadingT(false);
      });
    }, []);

    var selectCategory = function selectCategory(value) {
      setSelectedCategory(value);
      setCurrentStep(currentStep + 1);
      var temp = [];
      list.map(function (item) {
        if (String(item.category_id) === value) {
          temp.push(item);
        }
      });
      setTemplateList(temp);
      setSelectedTemplate('');
    };

    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(spin_default.a, {
      spinning: loadingT,
      style: {
        width: '400px'
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(tree_select_default.a, {
      showSearch: true,
      style: {
        width: '400px'
      },
      placeholder: "\u9009\u62E9\u7C7B\u522B\u7B5B\u9009\uFF08\u53EF\u641C\u7D22\uFF09",
      showArrow: true,
      onChange: selectCategory,
      treeDefaultExpandAll: !loadingT,
      value: String(selectedCategory),
      loading: loadingT,
      disabled: loadingT
    }, CertificationData_renderTreeNodes(categoryTree))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      style: {
        margin: '10px'
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      type: 'primary',
      onClick: pre
    }, "\u4E0A\u4E00\u6B65"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
      type: 'vertical'
    }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      type: 'primary',
      onClick: next
    }, "\u4E0B\u4E00\u6B65")));
  };

  var Step3 = function Step3() {
    var selectTemplate = function selectTemplate(value) {
      setSelectedTemplate(value);
    };

    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
      showSearch: true,
      style: {
        width: '400px'
      },
      placeholder: "\u9009\u62E9\u6A21\u677F",
      showArrow: true,
      optionFilterProp: 'children',
      onChange: selectTemplate,
      value: selectedTemplate
    }, templateList.map(function (item) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationData_Option, {
        key: item.id,
        value: item.id
      }, item.title);
    })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
      style: {
        margin: '10px'
      }
    }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      type: 'primary',
      onClick: pre
    }, "\u4E0A\u4E00\u6B65"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(divider_default.a, {
      type: 'vertical'
    }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      onClick: handleFilter
    }, "\u7B5B\u9009\u6570\u636E")));
  };

  var StepRender = function StepRender() {
    switch (currentStep) {
      case 0:
        {
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Step1, null);
        }

      case 1:
        {
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Step2, null);
        }

      case 2:
        {
          return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Step3, null);
        }
    }
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("h3", null, "\u6DFB\u52A0\u7B5B\u9009\u6761\u4EF6"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      margin: '20px 10px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(steps_default.a, {
    current: currentStep
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationData_Step, {
    title: Object(Text["a" /* TEXT */])('dash:project_select', '选择项目（必选）')
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationData_Step, {
    title: Object(Text["a" /* TEXT */])('dash:classification_select', '选择模板分类（非必选）')
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationData_Step, {
    title: Object(Text["a" /* TEXT */])('dash:template_select', '选择模板（非必选）')
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      margin: '20px 5px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(StepRender, null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CertificationDataViewer_CertificationDataViewer, {
    loading: loading,
    total: total,
    pageSize: pageSize,
    currentPage: currentPage,
    dataSource: dataSource,
    onPageChange: handlePageChange
  }));
};
// CONCATENATED MODULE: ./apis/certificate/AssignCertList.ts
function AssignCertList_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function AssignCertList_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { AssignCertList_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { AssignCertList_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function AssignCertList(_x, _x2) {
  return _AssignCertList.apply(this, arguments);
}

function _AssignCertList() {
  _AssignCertList = AssignCertList_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(page, state) {
    var page_size,
        parameters,
        url,
        result,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            page_size = _args.length > 2 && _args[2] !== undefined ? _args[2] : 10;
            parameters = "page=" + page + "&pagesize=" + page_size + "&my=0";

            if (state !== -1) {
              parameters = parameters + "&state=" + state;
            }

            url = "".concat(Urls["a" /* Urls */].api_cert.acceptances_list, "?").concat(parameters);
            _context.next = 6;
            return Object(Fetch["a" /* JsonApiFetch */])(url);

          case 6:
            result = _context.sent;
            return _context.abrupt("return", result);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _AssignCertList.apply(this, arguments);
}
// CONCATENATED MODULE: ./apis/certificate/GetExpertsList.tsx
function GetExpertsList_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function GetExpertsList_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { GetExpertsList_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { GetExpertsList_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function GetExpertsList() {
  return _GetExpertsList.apply(this, arguments);
}

function _GetExpertsList() {
  _GetExpertsList = GetExpertsList_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Object(Fetch["a" /* JsonApiFetch */])(Urls["a" /* Urls */].api_cert.experts_list);

          case 2:
            result = _context.sent;
            return _context.abrupt("return", result);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _GetExpertsList.apply(this, arguments);
}

function GetAssignedExpert(_x) {
  return _GetAssignedExpert.apply(this, arguments);
}

function _GetAssignedExpert() {
  _GetAssignedExpert = GetExpertsList_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(acceptance_id) {
    var result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Object(Fetch["a" /* JsonApiFetch */])(Urls["a" /* Urls */].api_cert.acceptance_experts(acceptance_id));

          case 2:
            result = _context2.sent;
            return _context2.abrupt("return", result);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _GetAssignedExpert.apply(this, arguments);
}
// CONCATENATED MODULE: ./apis/certificate/AssignExpert.ts
function AssignExpert_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function AssignExpert_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { AssignExpert_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { AssignExpert_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function AssignExpert(_x, _x2) {
  return _AssignExpert.apply(this, arguments);
}

function _AssignExpert() {
  _AssignExpert = AssignExpert_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(acceptance_id, username_list) {
    var body, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            body = {
              acceptance_id: acceptance_id,
              experts: username_list
            };
            _context.next = 3;
            return Object(Fetch["a" /* JsonApiFetch */])(Urls["a" /* Urls */].api_cert.assign_experts, 'POST', body);

          case 3:
            result = _context.sent;
            return _context.abrupt("return", result);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _AssignExpert.apply(this, arguments);
}

function ModifyExpert(_x3, _x4) {
  return _ModifyExpert.apply(this, arguments);
}

function _ModifyExpert() {
  _ModifyExpert = AssignExpert_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(acceptance_id, username_list) {
    var body, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            body = {
              acceptance_id: acceptance_id,
              experts: username_list
            };
            _context2.next = 3;
            return Object(Fetch["a" /* JsonApiFetch */])(Urls["a" /* Urls */].api_cert.acceptance_experts(acceptance_id), 'PATCH', body);

          case 3:
            result = _context2.sent;
            return _context2.abrupt("return", result);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _ModifyExpert.apply(this, arguments);
}
// CONCATENATED MODULE: ./components/dashboard/modal/AssignModal.tsx











function AssignModal_slicedToArray(arr, i) { return AssignModal_arrayWithHoles(arr) || AssignModal_iterableToArrayLimit(arr, i) || AssignModal_unsupportedIterableToArray(arr, i) || AssignModal_nonIterableRest(); }

function AssignModal_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function AssignModal_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return AssignModal_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return AssignModal_arrayLikeToArray(o, minLen); }

function AssignModal_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function AssignModal_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function AssignModal_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }






var AssignModal_Option = select_default.a.Option;
var AssignModal_AssignModal = function AssignModal(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(),
      _useState2 = AssignModal_slicedToArray(_useState, 2),
      user = _useState2[0],
      setUser = _useState2[1]; //登录的用户，为了保证专家组长不能分配给自己


  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState4 = AssignModal_slicedToArray(_useState3, 2),
      experts = _useState4[0],
      setExperts = _useState4[1]; //所有可供选择的专家列表


  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState6 = AssignModal_slicedToArray(_useState5, 2),
      assigned = _useState6[0],
      setAssigned = _useState6[1]; //被分配的专家


  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    Object(Info["a" /* Info */])().then(function (value) {
      setUser(value.username);
    });
  }, []);
  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    GetExpertsList().then(function (value) {
      setExperts(value);
    });
    setAssigned([]);
  }, [props.record]);

  var handleAssign = function handleAssign() {
    if (assigned.length === 0) {
      notification_default.a['error']({
        message: '操作失败',
        description: '未选择验收专家，请重新分配'
      });
    } else {
      AssignExpert(props.record.id, assigned).then(function (res) {
        window.location.reload();
      });
      props.onClose();
      props.onUpdate();
    }
  };

  var handleSelect = function handleSelect(value) {
    setAssigned(value);
  };

  var expertToOption = function expertToOption() {
    var children = [];
    experts.map(function (value, index) {
      //在这里判断一下，可选专家中不会出现专家组组长自己
      if (value.expert_username !== user) {
        children.push( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(AssignModal_Option, {
          key: value.expert_username,
          value: value.expert_username
        }, value.expert_name));
      }
    });
    return children;
  };

  var expertToCheckbox = function expertToCheckbox() {
    var children = [];
    experts.map(function (value, index) {
      //在这里判断一下，可选专家中不会出现专家组组长自己
      if (value.expert_username !== user) {
        children.push( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(checkbox_default.a, {
          key: value.expert_username,
          value: value.expert_username,
          style: {
            width: '90%',
            marginLeft: '8px'
          }
        }, value.expert_name));
      }
    });
    return children;
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    title: Object(Text["a" /* TEXT */])('cert:expert_list', '验收专家列表'),
    visible: props.visible,
    onCancel: props.onClose,
    footer: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      style: {
        display: 'none'
      }
    }, assigned), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      type: 'primary',
      onClick: handleAssign
    }, Object(Text["a" /* TEXT */])('cert:ok', '确定')))
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'ExpertSelect',
    style: {
      height: '300px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
    value: assigned,
    mode: 'multiple',
    style: {
      width: '100%'
    },
    dropdownStyle: {
      width: '100%'
    },
    onChange: handleSelect,
    showArrow: true,
    defaultOpen: true,
    placeholder: "\u8BF7\u9009\u62E9\u9A8C\u6536\u4E13\u5BB6(\u53EF\u641C\u7D22)",
    optionFilterProp: "children"
  }, expertToOption())));
};
// CONCATENATED MODULE: ./components/dashboard/modal/AssignViewModal.tsx









function AssignViewModal_slicedToArray(arr, i) { return AssignViewModal_arrayWithHoles(arr) || AssignViewModal_iterableToArrayLimit(arr, i) || AssignViewModal_unsupportedIterableToArray(arr, i) || AssignViewModal_nonIterableRest(); }

function AssignViewModal_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function AssignViewModal_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return AssignViewModal_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return AssignViewModal_arrayLikeToArray(o, minLen); }

function AssignViewModal_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function AssignViewModal_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function AssignViewModal_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var AssignViewModal_Option = select_default.a.Option;
var AssignViewModal_AssignViewModal = function AssignViewModal(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = AssignViewModal_slicedToArray(_useState, 2),
      experts = _useState2[0],
      setExperts = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState4 = AssignViewModal_slicedToArray(_useState3, 2),
      assigned = _useState4[0],
      setAssigned = _useState4[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    GetExpertsList().then(function (value) {
      setExperts(value);
    });

    if (props.record) {
      GetAssignedExpert(props.record.id).then(function (value) {
        var assigned = [];
        value.map(function (expert) {
          assigned.push(expert.expert_username);
        });
        setAssigned(assigned);
      });
    }
  }, [props.record]);

  var expertToOption = function expertToOption() {
    var children = [];
    experts.map(function (value, index) {
      children.push( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(AssignViewModal_Option, {
        key: value.expert_username,
        value: value.expert_username
      }, value.expert_name));
    });
    return children;
  };

  var expertToCheckbox = function expertToCheckbox() {
    var children = [];
    experts.map(function (value, index) {
      children.push( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(checkbox_default.a, {
        disabled: true,
        key: value.expert_username,
        value: value.expert_username,
        style: {
          width: '90%',
          marginLeft: '8px'
        }
      }, value.expert_name));
    });
    return children;
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    title: Object(Text["a" /* TEXT */])('cert:expert_list', '已分配验收专家'),
    visible: props.visible,
    onCancel: props.onClose,
    footer: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      disabled: true
    }, Object(Text["a" /* TEXT */])('cert:ok', '确定'))
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'ExpertSelect',
    style: {
      height: '300px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
    value: assigned,
    mode: 'multiple',
    style: {
      width: '100%'
    },
    dropdownStyle: {
      display: 'none'
    }
  }, expertToOption()), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(checkbox_default.a.Group, {
    value: assigned,
    style: {
      width: '100%',
      height: '85%',
      overflowY: 'scroll'
    }
  }, expertToCheckbox())));
};
// CONCATENATED MODULE: ./components/dashboard/modal/AssignModifyModal.tsx











function AssignModifyModal_slicedToArray(arr, i) { return AssignModifyModal_arrayWithHoles(arr) || AssignModifyModal_iterableToArrayLimit(arr, i) || AssignModifyModal_unsupportedIterableToArray(arr, i) || AssignModifyModal_nonIterableRest(); }

function AssignModifyModal_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function AssignModifyModal_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return AssignModifyModal_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return AssignModifyModal_arrayLikeToArray(o, minLen); }

function AssignModifyModal_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function AssignModifyModal_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function AssignModifyModal_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }





var AssignModifyModal_Option = select_default.a.Option;
var AssignModifyModal_AssignModifyModal = function AssignModifyModal(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = AssignModifyModal_slicedToArray(_useState, 2),
      experts = _useState2[0],
      setExperts = _useState2[1]; //所有可供选择的专家列表


  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState4 = AssignModifyModal_slicedToArray(_useState3, 2),
      assigned = _useState4[0],
      setAssigned = _useState4[1]; //被分配的专家


  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    GetExpertsList().then(function (value) {
      setExperts(value);
    });

    if (props.record) {
      GetAssignedExpert(props.record.id).then(function (value) {
        var assigned = [];
        value.map(function (expert) {
          assigned.push(expert.expert_username);
        });
        setAssigned(assigned);
      });
    }
  }, [props.record]);

  var handleModify = function handleModify() {
    if (assigned.length === 0) {
      notification_default.a['error']({
        message: '操作失败',
        description: '未选择验收专家，请重新修改'
      });
    } else {
      ModifyExpert(props.record.id, assigned).then(function (res) {
        window.location.reload();
      });
      props.onClose();
      props.onUpdate();
    }
  };

  var handleSelect = function handleSelect(value) {
    setAssigned(value);
  };

  var expertToOption = function expertToOption() {
    var children = [];
    experts.map(function (value, index) {
      children.push( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(AssignModifyModal_Option, {
        key: value.expert_username,
        value: value.expert_username
      }, value.expert_name));
    });
    return children;
  };

  var expertToCheckbox = function expertToCheckbox() {
    var children = [];
    experts.map(function (value, index) {
      children.push( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(checkbox_default.a, {
        key: value.expert_username,
        value: value.expert_username,
        style: {
          width: '90%',
          marginLeft: '8px'
        }
      }, value.expert_name));
    });
    return children;
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    title: Object(Text["a" /* TEXT */])('cert:expert_list', '验收专家列表'),
    visible: props.visible,
    onCancel: props.onClose,
    footer: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      style: {
        display: 'none'
      }
    }, assigned), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      type: 'primary',
      onClick: handleModify
    }, Object(Text["a" /* TEXT */])('cert:ok', '确定')))
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'ExpertSelect',
    style: {
      height: '300px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(select_default.a, {
    value: assigned,
    mode: 'multiple',
    style: {
      width: '100%'
    },
    dropdownStyle: {
      width: '100%'
    },
    onChange: handleSelect,
    showArrow: true,
    defaultOpen: false,
    placeholder: "\u8BF7\u9009\u62E9\u9A8C\u6536\u4E13\u5BB6(\u53EF\u641C\u7D22)",
    optionFilterProp: "children"
  }, expertToOption())));
};
// CONCATENATED MODULE: ./components/dashboard/viewer/AssignCertViewer.tsx









function AssignCertViewer_slicedToArray(arr, i) { return AssignCertViewer_arrayWithHoles(arr) || AssignCertViewer_iterableToArrayLimit(arr, i) || AssignCertViewer_unsupportedIterableToArray(arr, i) || AssignCertViewer_nonIterableRest(); }

function AssignCertViewer_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function AssignCertViewer_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return AssignCertViewer_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return AssignCertViewer_arrayLikeToArray(o, minLen); }

function AssignCertViewer_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function AssignCertViewer_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function AssignCertViewer_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }











var AssignCertViewer_Column = table_default.a.Column;
var AssignCertViewer_AssignCertViewer = function AssignCertViewer(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(props.loading),
      _useState2 = AssignCertViewer_slicedToArray(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState4 = AssignCertViewer_slicedToArray(_useState3, 2),
      innerData = _useState4[0],
      setInnerData = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(props.data[0]),
      _useState6 = AssignCertViewer_slicedToArray(_useState5, 2),
      currentViewRecord = _useState6[0],
      setCurrentViewRecord = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState8 = AssignCertViewer_slicedToArray(_useState7, 2),
      showViewModal = _useState8[0],
      setShowViewModal = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState10 = AssignCertViewer_slicedToArray(_useState9, 2),
      showAssignModal = _useState10[0],
      setShowAssignModal = _useState10[1];

  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState12 = AssignCertViewer_slicedToArray(_useState11, 2),
      showModifyModal = _useState12[0],
      setShowModifyModal = _useState12[1];

  var _useState13 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState14 = AssignCertViewer_slicedToArray(_useState13, 2),
      showEvaluateModal = _useState14[0],
      setShowEvaluateModal = _useState14[1];

  var _useState15 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState16 = AssignCertViewer_slicedToArray(_useState15, 2),
      evaluationres = _useState16[0],
      setEvaluationres = _useState16[1]; //评价结果


  var _useState17 = Object(reactfrom_dll_reference_dll_library["useState"])({}),
      _useState18 = AssignCertViewer_slicedToArray(_useState17, 2),
      data = _useState18[0],
      setData = _useState18[1]; //用于评价的记录


  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setInnerData(props.data);
  }, [props.data]);
  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setLoading(props.loading);
  }, [props.loading]);

  var handleTableChange = function handleTableChange(pagination) {
    props.onPageChange(pagination.current);
  };

  var handleViewRecord = function handleViewRecord(record) {
    setCurrentViewRecord(record);
    setShowViewModal(true);
  };

  var handleAssignRecord = function handleAssignRecord(record) {
    setCurrentViewRecord(record);
    setShowAssignModal(true);
  };

  var handleModifyRecord = function handleModifyRecord(record) {
    setCurrentViewRecord(record);
    setShowModifyModal(true);
  };

  var handleUpdate = function handleUpdate() {
    setLoading(true);
    AssignCertList(1, props.state).then(function (value) {
      setInnerData(value.data);
      setLoading(false);
    });
  };

  var handleEvaluate = function handleEvaluate(record) {
    setData({
      acceptance_id: record.id,
      cert_key: record.cert_key,
      finished: false
    });
    setShowEvaluateModal(true);
    GetEvaluationResult(record.id.toString()).then(function (value) {
      setEvaluationres(value);
    });
  };

  var handleViewEvaluate = function handleViewEvaluate(record) {
    setData({
      acceptance_id: record.id,
      cert_key: record.cert_key,
      finished: true
    });
    setShowEvaluateModal(true);
    GetEvaluationResult(record.id.toString()).then(function (value) {
      setEvaluationres(value);
    });
  };

  var handleUpload = function handleUpload(file) {
    if (file.status === 'done') {
      notification_default.a['success']({
        message: Object(Text["a" /* TEXT */])('op_success', '操作成功')
      });

      handleUpdate();
    }

    if (file.status === 'error') {
      notification_default.a['error']({
        message: file.response.extra.err_detail
      });
    }
  };

  var handleDownload = function handleDownload(record) {
    window.open(Urls["b" /* default */].api_cert.signature(record.id));
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    onChange: handleTableChange,
    rowKey: function rowKey(record) {
      return record.id.toString();
    },
    dataSource: innerData,
    loading: loading,
    pagination: {
      total: props.total,
      pageSize: props.pageSize,
      current: props.current
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(AssignCertViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:project/subject', '项目编号/课题编号'),
    dataIndex: 'ps_id',
    key: 'ps_id'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(AssignCertViewer_Column, {
    title: Object(Text["a" /* TEXT */])('name', '项目/课题'),
    dataIndex: 'name',
    key: 'name',
    width: '25%'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(AssignCertViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:time', '申请时间'),
    dataIndex: 'create_time',
    key: 'time'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(AssignCertViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:applicant', '申请人'),
    dataIndex: 'leader',
    key: 'applicant'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(AssignCertViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:status', '状态'),
    dataIndex: 'state',
    key: 'state',
    render: function render(value) {
      var content = null;

      switch (value) {
        case AcceptanceState.Dispatching:
          content = Object(Text["a" /* TEXT */])('dash:dispatching', '待分配验收专家');
          break;

        case AcceptanceState.Expert_Evaluating:
          content = Object(Text["a" /* TEXT */])('dash:expert_evaluating', '专家评价中');
          break;

        case AcceptanceState.Leader_Evaluating:
          content = Object(Text["a" /* TEXT */])('dash:leader_evaluating', '评价组长评价中');
          break;

        case AcceptanceState.Signature_Pending:
          content = Object(Text["a" /* TEXT */])('dash:signature_pending', '等待上传报告');
          break;

        case AcceptanceState.Failed:
          content = Object(Text["a" /* TEXT */])('dash:failed', '不通过');
          break;

        case AcceptanceState.Finished:
          content = Object(Text["a" /* TEXT */])('dash:finished', '验收完成');
          break;
      }

      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, content, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null));
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(AssignCertViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:action', '操作'),
    dataIndex: 'state',
    key: 'action',
    render: function render(value, record) {
      var content = null;

      switch (value) {
        case AcceptanceState.Dispatching:
          content = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
            type: 'primary',
            onClick: function onClick() {
              return handleAssignRecord(record);
            }
          }, Object(Text["a" /* TEXT */])('dash:assign', '分配验收专家'));
          break;

        case AcceptanceState.Expert_Evaluating:
          content = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
            onClick: function onClick() {
              return handleViewRecord(record);
            },
            style: {
              marginRight: '5px'
            }
          }, Object(Text["a" /* TEXT */])('dash:view', '查看分配')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
            type: 'danger',
            onClick: function onClick() {
              return handleModifyRecord(record);
            }
          }, Object(Text["a" /* TEXT */])('dash:modify', '修改验收专家')));
          break;

        case AcceptanceState.Leader_Evaluating:
          content = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
            type: 'primary',
            onClick: function onClick() {
              return handleEvaluate(record);
            }
          }, Object(Text["a" /* TEXT */])('dash:evaluate', '评价'));
          break;

        case AcceptanceState.Signature_Pending:
          content = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
            onClick: function onClick() {
              return handleViewEvaluate(record);
            },
            style: {
              marginRight: '5px'
            }
          }, Object(Text["a" /* TEXT */])('dash:evaluation_reuslt', '查看评价结果')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(upload_default.a, {
            showUploadList: false,
            accept: '.pdf',
            name: 'signature',
            onChange: function onChange(file) {
              return handleUpload(file.file);
            },
            action: Urls["b" /* default */].api_cert.signature(record.id)
          }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
            type: 'primary'
          }, Object(Text["a" /* TEXT */])('dash:upload_scan', '上传扫描件'))));
          break;

        case AcceptanceState.Failed:
          content = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
            onClick: function onClick() {
              return handleViewEvaluate(record);
            }
          }, Object(Text["a" /* TEXT */])('dash:evaluation_reuslt', '查看评价结果'));
          break;

        case AcceptanceState.Finished:
          content = /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("span", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
            onClick: function onClick() {
              return handleViewEvaluate(record);
            },
            style: {
              marginRight: '5px'
            }
          }, Object(Text["a" /* TEXT */])('dash:evaluation_reuslt', '查看评价结果')));
          break;
      }

      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, content, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null));
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(AssignViewModal_AssignViewModal, {
    visible: showViewModal,
    record: currentViewRecord,
    onClose: function onClose() {
      return setShowViewModal(false);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(AssignModal_AssignModal, {
    visible: showAssignModal,
    record: currentViewRecord,
    onClose: function onClose() {
      return setShowAssignModal(false);
    },
    onUpdate: handleUpdate
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(AssignModifyModal_AssignModifyModal, {
    visible: showModifyModal,
    record: currentViewRecord,
    onClose: function onClose() {
      return setShowModifyModal(false);
    },
    onUpdate: handleUpdate
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(EvaluationModal_EvaluationModal, {
    visible: showEvaluateModal,
    record: data,
    evaluationscore: null,
    evaluationres: evaluationres,
    onClose: function onClose() {
      setShowEvaluateModal(false), setEvaluationres([]);
    }
  }));
};
// CONCATENATED MODULE: ./components/dashboard/pages/AssignCert.tsx



function AssignCert_slicedToArray(arr, i) { return AssignCert_arrayWithHoles(arr) || AssignCert_iterableToArrayLimit(arr, i) || AssignCert_unsupportedIterableToArray(arr, i) || AssignCert_nonIterableRest(); }

function AssignCert_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function AssignCert_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return AssignCert_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return AssignCert_arrayLikeToArray(o, minLen); }

function AssignCert_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function AssignCert_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function AssignCert_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }










function AssignCert_PathnameToReviewState(pathname) {
  if (pathname.startsWith('/cert/assign/dispatching')) {
    return AcceptanceState.Dispatching;
  } else if (pathname.startsWith('/cert/assign/leader_evaluating')) {
    return AcceptanceState.Leader_Evaluating;
  } else if (pathname.startsWith('/cert/assign/signature_pending')) {
    return AcceptanceState.Signature_Pending;
  } else {
    return -1;
  }
}

var AssignCert_AssignCert = function AssignCert(props) {
  var currentStates = AssignCert_PathnameToReviewState(props.location.pathname);

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(1),
      _useState2 = AssignCert_slicedToArray(_useState, 2),
      currentPage = _useState2[0],
      setCurrentPage = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState4 = AssignCert_slicedToArray(_useState3, 2),
      total = _useState4[0],
      setTotal = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(10),
      _useState6 = AssignCert_slicedToArray(_useState5, 2),
      pageSize = _useState6[0],
      setPageSize = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState8 = AssignCert_slicedToArray(_useState7, 2),
      loading = _useState8[0],
      setLoading = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState10 = AssignCert_slicedToArray(_useState9, 2),
      dataSource = _useState10[0],
      setDataSource = _useState10[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setLoading(true);
    AssignCertList(currentPage, currentStates).then(function (value) {
      setDataSource(value.data);
      setLoading(false);
      setTotal(value.page_count * value.page_size);
      setPageSize(value.page_size);
      setCurrentPage(value.page);
    });
  }, [props.location.pathname]);

  var handlePageChange = function handlePageChange(page) {
    setLoading(true);
    AssignCertList(page, currentStates).then(function (value) {
      setDataSource(value.data);
      setLoading(false);
      setTotal(value.page_count * value.page_size);
      setPageSize(value.page_size);
      setCurrentPage(page);
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(AcceptanceRoleCheckWrapper_AcceptanceRoleCheckWrapper, {
    forbidMessage: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'dash:assign_forbid',
      defaultMessage: "\u60A8\u6CA1\u6709\u5206\u914D\u6C47\u4EA4\u9A8C\u6536\u7684\u6743\u9650"
    }),
    requiredRoles: [User["a" /* AcceptanceRole */].GroupLeader]
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      flexDirection: 'column',
      width: '100%'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '16px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, {
    size: 'large',
    value: currentStates,
    buttonStyle: 'solid'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: 0,
    onClick: function onClick() {
      return props.history.push('/cert/assign/dispatching');
    }
  }, Object(Text["a" /* TEXT */])('dash:pending', '待分配')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: 2,
    onClick: function onClick() {
      return props.history.push('/cert/assign/leader_evaluating');
    }
  }, Object(Text["a" /* TEXT */])('dash:pending', '待评价')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: -1,
    onClick: function onClick() {
      return props.history.push('/cert/assign/all');
    }
  }, Object(Text["a" /* TEXT */])('dash:show_all', '全部')))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(AssignCertViewer_AssignCertViewer, {
    total: total,
    pageSize: pageSize,
    current: currentPage,
    loading: loading,
    onPageChange: handlePageChange,
    data: dataSource,
    state: currentStates
  })));
};
// CONCATENATED MODULE: ./apis/template/Expert_scoring.ts
function Expert_scoring_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function Expert_scoring_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { Expert_scoring_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { Expert_scoring_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function GetExpertTemplateScoring(_x) {
  return _GetExpertTemplateScoring.apply(this, arguments);
}

function _GetExpertTemplateScoring() {
  _GetExpertTemplateScoring = Expert_scoring_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(page) {
    var url;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = Urls["b" /* default */].expert_scoring + '?page=' + page;
            return _context.abrupt("return", Object(Fetch["k" /* default */])(url, 'GET'));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _GetExpertTemplateScoring.apply(this, arguments);
}

function PostExpertTemplateScoring(_x2, _x3, _x4) {
  return _PostExpertTemplateScoring.apply(this, arguments);
}

function _PostExpertTemplateScoring() {
  _PostExpertTemplateScoring = Expert_scoring_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(tId, comment, score) {
    var url;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            url = Urls["b" /* default */].uploading_scoring;
            return _context2.abrupt("return", Object(Fetch["k" /* default */])(url, 'POST', {
              t_id: tId,
              comment: comment,
              score: score
            }));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _PostExpertTemplateScoring.apply(this, arguments);
}

function GetTemScore(_x5) {
  return _GetTemScore.apply(this, arguments);
}

function _GetTemScore() {
  _GetTemScore = Expert_scoring_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(id) {
    var url;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            url = Urls["b" /* default */].edit_tem_score(id);
            return _context3.abrupt("return", Object(Fetch["k" /* default */])(url, 'GET'));

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _GetTemScore.apply(this, arguments);
}
// EXTERNAL MODULE: ./node_modules/antd/lib/input-number/style/index.js
var input_number_style = __webpack_require__(1768);

// EXTERNAL MODULE: ./node_modules/antd/lib/input-number/index.js
var input_number = __webpack_require__(1113);
var input_number_default = /*#__PURE__*/__webpack_require__.n(input_number);

// CONCATENATED MODULE: ./components/dashboard/modal/ExpertTemplateModal.tsx



















function ExpertTemplateModal_slicedToArray(arr, i) { return ExpertTemplateModal_arrayWithHoles(arr) || ExpertTemplateModal_iterableToArrayLimit(arr, i) || ExpertTemplateModal_unsupportedIterableToArray(arr, i) || ExpertTemplateModal_nonIterableRest(); }

function ExpertTemplateModal_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function ExpertTemplateModal_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return ExpertTemplateModal_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ExpertTemplateModal_arrayLikeToArray(o, minLen); }

function ExpertTemplateModal_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ExpertTemplateModal_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function ExpertTemplateModal_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var ExpertTemplateModal_ExpertTemplateModal = function ExpertTemplateModal(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(''),
      _useState2 = ExpertTemplateModal_slicedToArray(_useState, 2),
      other = _useState2[0],
      setOther = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(10),
      _useState4 = ExpertTemplateModal_slicedToArray(_useState3, 2),
      value = _useState4[0],
      setValue = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState6 = ExpertTemplateModal_slicedToArray(_useState5, 2),
      iscored = _useState6[0],
      setIscored = _useState6[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    if (props.currentid !== 0) {
      GetTemScore(props.currentid).then(function (res) {
        if (res !== -1) {
          setIscored(true);
          setValue(res.score);
          setOther(res.comment);
        } else {
          setIscored(false);
          setValue(10);
          setOther('');
        }
      });
    }
  }, [props.currentid]);

  var onChange = function onChange(value) {
    setValue(value);
  };

  var handleAddScore = function handleAddScore() {
    setIscored(true);
    PostExpertTemplateScoring(props.currentid, other, value).then(function () {
      setValue(10);
      setOther('');

      notification_default.a['success']({
        message: Object(Text["a" /* TEXT */])('dash:email_sent', '提交成功')
      });

      window.location.reload();
    })["catch"](function (reason) {
      notification_default.a['error']({
        message: reason.message
      });
    });
    props.onClose();
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    title: '输入分数',
    footer: [/*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_default.a, {
      placeholder: "\u8BC4\u8BED",
      value: other,
      onChange: function onChange(event) {
        return setOther(event.target.value);
      }
    }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      style: {
        marginTop: "5px"
      },
      key: "submit",
      type: "primary",
      onClick: handleAddScore,
      disabled: value < 6 && other.length === 0
    }, "\u63D0\u4EA4"))],
    visible: props.visible,
    onCancel: props.onClose,
    onOk: props.onClose,
    destroyOnClose: true
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(row_default.a, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
    span: 12
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(slider_default.a, {
    min: 1,
    max: 10,
    onChange: onChange,
    value: typeof value === 'number' ? value : 0
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
    span: 6
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(input_number_default.a, {
    min: 1,
    max: 10,
    style: {
      marginLeft: 16
    },
    value: value,
    onChange: onChange
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(col_default.a, {
    span: 4
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(tooltip_default.a, {
    title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, "\u6A21\u677F\u6253\u5206\u7684\u5206\u6570\u8303\u56F4\u4E3A1-10\u5206\uFF0C\u9ED8\u8BA4\u6EE1\u5206"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, "\u4F18\u79C0\u5206\u4E3A8\u5206\u53CA\u4EE5\u4E0A\uFF0C\u53CA\u683C\u7EBF\u4E3A6\u5206\uFF0C\u4E0D\u5408\u683C\u7684\u6A21\u677F\u8BF7\u6CE8\u660E\u7406\u7531"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, "\u591A\u4E2A\u4E13\u5BB6\u6253\u5206\u540E\u7684\u5E73\u5747\u5206\u4F5C\u4E3A\u8BE5\u6A21\u677F\u89C4\u8303\u6027\u7684\u6700\u7EC8\u5206\u6570")),
    placement: "bottom"
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("i", {
    className: "fa fa-question-circle",
    "aria-hidden": "true"
  }))))));
};
// CONCATENATED MODULE: ./components/dashboard/pages/ExpertEvaluateTemplate.tsx





function ExpertEvaluateTemplate_slicedToArray(arr, i) { return ExpertEvaluateTemplate_arrayWithHoles(arr) || ExpertEvaluateTemplate_iterableToArrayLimit(arr, i) || ExpertEvaluateTemplate_unsupportedIterableToArray(arr, i) || ExpertEvaluateTemplate_nonIterableRest(); }

function ExpertEvaluateTemplate_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function ExpertEvaluateTemplate_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return ExpertEvaluateTemplate_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ExpertEvaluateTemplate_arrayLikeToArray(o, minLen); }

function ExpertEvaluateTemplate_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ExpertEvaluateTemplate_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function ExpertEvaluateTemplate_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }





var ExpertEvaluateTemplate_Column = table_default.a.Column; // export interface ExpertEvaluateTemplateProps
// {
//     iscored?:boolean;
// }

var ExpertEvaluateTemplate_ExpertEvaluateTemplate = function ExpertEvaluateTemplate(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = ExpertEvaluateTemplate_slicedToArray(_useState, 2),
      innerData = _useState2[0],
      setInnerData = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState4 = ExpertEvaluateTemplate_slicedToArray(_useState3, 2),
      showViewModal = _useState4[0],
      setShowViewModal = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState6 = ExpertEvaluateTemplate_slicedToArray(_useState5, 2),
      loading = _useState6[0],
      setLoading = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState8 = ExpertEvaluateTemplate_slicedToArray(_useState7, 2),
      total = _useState8[0],
      setTotal = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(20),
      _useState10 = ExpertEvaluateTemplate_slicedToArray(_useState9, 2),
      pageSize = _useState10[0],
      setPageSize = _useState10[1];

  var _useState11 = Object(reactfrom_dll_reference_dll_library["useState"])(1),
      _useState12 = ExpertEvaluateTemplate_slicedToArray(_useState11, 2),
      currentPage = _useState12[0],
      setCurrentPage = _useState12[1];

  var _useState13 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState14 = ExpertEvaluateTemplate_slicedToArray(_useState13, 2),
      currentid = _useState14[0],
      setCurrentId = _useState14[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setLoading(true);
    GetExpertTemplateScoring(1).then(function (value) {
      setInnerData(value.results);
      setTotal(value.count);
      setPageSize(pageSize);
      setCurrentPage(value.page);
      setLoading(false);
    });
  }, []);

  var handlePageChange = function handlePageChange(page) {
    setLoading(true);
    GetExpertTemplateScoring(page).then(function (value) {
      setInnerData(value.results);
      setTotal(value.count);
      setPageSize(pageSize);
      setCurrentPage(page);
      setLoading(false);
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    dataSource: innerData,
    loading: loading,
    pagination: {
      onChange: function onChange(current) {
        return handlePageChange(current);
      },
      total: total,
      pageSize: pageSize,
      current: currentPage
    },
    style: {
      marginTop: '50px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ExpertEvaluateTemplate_Column, {
    title: Object(Text["a" /* TEXT */])('dash:ID', '模板编号'),
    dataIndex: "t_id",
    key: "t_id"
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ExpertEvaluateTemplate_Column, {
    title: Object(Text["a" /* TEXT */])('dash:title', '模板标题'),
    dataIndex: "title",
    key: "title"
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ExpertEvaluateTemplate_Column, {
    title: Object(Text["a" /* TEXT */])('dash:acceptance_ID', '验收编号'),
    dataIndex: "acceptance_id",
    key: "acceptance_id"
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ExpertEvaluateTemplate_Column, {
    title: Object(Text["a" /* TEXT */])('dash:name_ID', '项目或课题编号'),
    dataIndex: "ps_id",
    key: "ps_id"
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ExpertEvaluateTemplate_Column, {
    title: Object(Text["a" /* TEXT */])('dash:bool_project', '是否为项目'),
    dataIndex: "is_project",
    key: "is_project",
    render: function render(record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, record === true ? Object(Text["a" /* TEXT */])('is_project_true', '是') : Object(Text["a" /* TEXT */])('is_project_false', '否'));
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ExpertEvaluateTemplate_Column, {
    title: Object(Text["a" /* TEXT */])('dash:project_leader', '验收项目负责人'),
    dataIndex: "owner",
    key: "owner"
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ExpertEvaluateTemplate_Column, {
    title: Object(Text["a" /* TEXT */])('dash:team_leader', '验收项目的评价组长'),
    dataIndex: "leader",
    key: "leader"
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ExpertEvaluateTemplate_Column, {
    title: Object(Text["a" /* TEXT */])('dash:template_scored', '模板是否被打分'),
    dataIndex: "is_scored",
    key: "is_scored",
    render: function render(value) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, value === true ? Object(Text["a" /* TEXT */])('is_project_true', '是') : Object(Text["a" /* TEXT */])('is_project_false', '否'));
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ExpertEvaluateTemplate_Column, {
    width: '200px',
    title: Object(Text["a" /* TEXT */])('dash:action', '操作'),
    key: "action",
    render: function render(record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        size: 'small',
        onClick: function onClick() {
          window.open('/storage/check_template/' + record.t_id);
        }
      }, Object(Text["a" /* TEXT */])('dash:view_data_list', '查看')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        size: 'small',
        onClick: function onClick() {
          setShowViewModal(true), setCurrentId(record.t_id);
        }
      }, record.is_scored === true ? Object(Text["a" /* TEXT */])('dash:change', '更改') : Object(Text["a" /* TEXT */])('dash:scoring', '打分')));
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(ExpertTemplateModal_ExpertTemplateModal, {
    data: innerData,
    visible: showViewModal,
    onClose: function onClose() {
      return setShowViewModal(false);
    },
    currentid: currentid
  }));
};
// CONCATENATED MODULE: ./apis/define/EvaluationState.ts
var EvaluationState;

(function (EvaluationState) {
  EvaluationState[EvaluationState["Pending"] = 0] = "Pending";
  EvaluationState[EvaluationState["Finished"] = 1] = "Finished";
  EvaluationState[EvaluationState["All"] = null] = "All";
})(EvaluationState || (EvaluationState = {}));
// CONCATENATED MODULE: ./components/dashboard/viewer/EvaluationListViewer.tsx







function EvaluationListViewer_slicedToArray(arr, i) { return EvaluationListViewer_arrayWithHoles(arr) || EvaluationListViewer_iterableToArrayLimit(arr, i) || EvaluationListViewer_unsupportedIterableToArray(arr, i) || EvaluationListViewer_nonIterableRest(); }

function EvaluationListViewer_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function EvaluationListViewer_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return EvaluationListViewer_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return EvaluationListViewer_arrayLikeToArray(o, minLen); }

function EvaluationListViewer_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function EvaluationListViewer_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function EvaluationListViewer_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }






var EvaluationListViewer_Column = table_default.a.Column;
var EvaluationListViewer_EvaluationListViewer = function EvaluationListViewer(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState2 = EvaluationListViewer_slicedToArray(_useState, 2),
      ModalVisible = _useState2[0],
      setModalVisible = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])({}),
      _useState4 = EvaluationListViewer_slicedToArray(_useState3, 2),
      data = _useState4[0],
      setData = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState6 = EvaluationListViewer_slicedToArray(_useState5, 2),
      evaluationres = _useState6[0],
      setEvaluationres = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(10),
      _useState8 = EvaluationListViewer_slicedToArray(_useState7, 2),
      evaluationscore = _useState8[0],
      setEvaluationScore = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState10 = EvaluationListViewer_slicedToArray(_useState9, 2),
      showViewEvalutionModal = _useState10[0],
      setshowViewEvalutionModal = _useState10[1];

  var handleTableChange = function handleTableChange(pagination) {
    props.onPageChange(pagination.current);
  };

  var handleclick = function handleclick(v) {
    GetEvaluationJudge(v.acceptance_id).then(function (value) {
      if (value === 0) {
        setshowViewEvalutionModal(true);
      } else if (value === 1) {
        setshowViewEvalutionModal(false);
        GetEvaluationResult(v.acceptance_id).then(function (value) {
          setEvaluationres(value);
          setModalVisible(true);
        });
      }
    });
    GetEvaluationScore(v.acceptance_id).then(function (value) {
      setEvaluationScore(value);
    });
    setData(v);
  };

  var handleviewclick = function handleviewclick(v) {
    GetEvaluationResult(v.acceptance_id).then(function (value) {
      setEvaluationres(value);
    });
    setModalVisible(true);
    setData(v);
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(table_default.a, {
    onChange: handleTableChange,
    rowKey: 'templates_id',
    dataSource: props.data,
    loading: props.loading,
    pagination: {
      total: props.total,
      pageSize: props.pageSize,
      current: props.current
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(EvaluationListViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:ID', '项目编号/课题编号'),
    dataIndex: 'ps_id',
    key: 'ps_id'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(EvaluationListViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:application_time', '发布时间'),
    dataIndex: 'c_time',
    key: 'c_time',
    render: function render(text) {
      return new Date(text.replace(/-/g, "/")).toLocaleDateString();
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(EvaluationListViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:applicant', '申请人'),
    dataIndex: 'leader',
    key: 'leader'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(EvaluationListViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:status', '状态'),
    dataIndex: 'finished',
    key: 'finished',
    render: function render(text, record) {
      var content = null;

      switch (text) {
        case true:
          content = Object(Text["a" /* TEXT */])('dash:approved', '已评价');
          break;
        //case ReviewState.Disapproved: content = <span style={{ color: 'red' }}>{TEXT('dash:disapproved', '未通过')}</span>; break;

        case false:
          content = Object(Text["a" /* TEXT */])('dash:pending', '等待评价');
          break;
      }

      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, content, " ", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null));
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(EvaluationListViewer_Column, {
    title: Object(Text["a" /* TEXT */])('dash:action', '审核操作'),
    key: "action",
    render: function render(text, record) {
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, record.finished == false ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        type: 'primary',
        style: {
          margin: '0px 5px 5px 0px'
        },
        onClick: function onClick() {
          return handleclick(record);
        }
      }, "\u8BC4\u4EF7"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        disabled: true,
        style: {
          margin: '0px 5px 5px 0px'
        }
      }, "\u4E0B\u8F7D\u62A5\u544A"), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("br", null), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        style: {
          margin: '0px 5px 5px 0px'
        }
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("a", {
        href: '/dashboard/#/cert/data'
      }, "\u67E5\u770B\u9A8C\u6536\u6570\u636E"))) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        style: {
          margin: '0px 5px 5px 0px'
        },
        onClick: function onClick() {
          return handleviewclick(record);
        }
      }, "\u67E5\u770B\u4E0B\u8F7D\u62A5\u544A")));
    }
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(EvaluationModal_EvaluationModal, {
    visible: ModalVisible,
    record: data,
    evaluationres: evaluationres,
    evaluationscore: evaluationscore,
    onClose: function onClose() {
      setModalVisible(false), setEvaluationres([]);
    }
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
    title: Object(Text["a" /* TEXT */])('warning', '警告'),
    visible: showViewEvalutionModal,
    footer: [/*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
      key: "submit",
      type: "primary",
      onClick: function onClick() {
        return setshowViewEvalutionModal(false);
      }
    }, "\u786E\u8BA4"))]
  }, Object(Text["a" /* TEXT */])('template:delete_warning', '该项目还有未打分的模板，不能评价！')));
};
// CONCATENATED MODULE: ./apis/evaluation/GetEvaluationList.ts
function GetEvaluationList_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function GetEvaluationList_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { GetEvaluationList_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { GetEvaluationList_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function GetEvaluationList(_x, _x2, _x3) {
  return _GetEvaluationList.apply(this, arguments);
}

function _GetEvaluationList() {
  _GetEvaluationList = GetEvaluationList_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(finished, page, page_size) {
    var url;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            url = Urls["b" /* default */].api_cert.evaluation_list;

            if (!(finished == null)) {
              _context.next = 7;
              break;
            }

            _context.next = 4;
            return Object(Fetch["k" /* default */])(url + '?page=' + page + '&page_size=' + page_size, 'GET');

          case 4:
            return _context.abrupt("return", _context.sent);

          case 7:
            _context.next = 9;
            return Object(Fetch["k" /* default */])(url + '?page=' + page + '&page_size=' + page_size + '&finished=' + finished, 'GET');

          case 9:
            return _context.abrupt("return", _context.sent);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _GetEvaluationList.apply(this, arguments);
}

0;
// CONCATENATED MODULE: ./components/dashboard/pages/Evaluation.tsx



function Evaluation_slicedToArray(arr, i) { return Evaluation_arrayWithHoles(arr) || Evaluation_iterableToArrayLimit(arr, i) || Evaluation_unsupportedIterableToArray(arr, i) || Evaluation_nonIterableRest(); }

function Evaluation_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function Evaluation_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return Evaluation_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Evaluation_arrayLikeToArray(o, minLen); }

function Evaluation_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function Evaluation_iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function Evaluation_arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }









function PathnameToEvaluationState(pathname) {
  if (pathname.startsWith('/cert/evaluation/pending')) {
    return EvaluationState.Pending;
  } else if (pathname.startsWith('/cert/evaluation/approved')) {
    return EvaluationState.Finished;
  } else {
    return EvaluationState.All;
  }
}

var Evaluation_CertEvaluation = function CertEvaluation(props) {
  var currentState = PathnameToEvaluationState(props.location.pathname); // const [dataSource, setDataSource] = useState([]);

  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = Evaluation_slicedToArray(_useState, 2),
      dataSource = _useState2[0],
      setDataSource = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState4 = Evaluation_slicedToArray(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(0),
      _useState6 = Evaluation_slicedToArray(_useState5, 2),
      total = _useState6[0],
      setTotal = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(10),
      _useState8 = Evaluation_slicedToArray(_useState7, 2),
      pageSize = _useState8[0],
      setPageSize = _useState8[1];

  var _useState9 = Object(reactfrom_dll_reference_dll_library["useState"])(1),
      _useState10 = Evaluation_slicedToArray(_useState9, 2),
      currentPage = _useState10[0],
      setCurrentPage = _useState10[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    // DoiReviewList(currentState, 1).then(value => {
    //     setDataSource(value.results);
    //     setLoading(false);
    //     setTotal(value.total);
    //     setPageSize(value.page_size);
    //     setCurrentPage(1);
    // })
    setLoading(true);
    GetEvaluationList(currentState, currentPage, pageSize).then(function (value) {
      setLoading(false);
      setDataSource(value.data);
      setTotal(value.page_count * value.page_size);
      setCurrentPage(value.page);
    });
  }, [props.location.pathname]);

  var handlePageChange = function handlePageChange(page) {
    // DoiReviewList(currentState, page).then(value => {
    //     setDataSource(value.results);
    //     setLoading(false);
    //     setTotal(value.total);
    //     setPageSize(value.page_size);
    //     setCurrentPage(page);
    // })
    GetEvaluationList(currentState, page, pageSize).then(function (value) {
      setLoading(false);
      setDataSource(value.data);
      setPageSize(value.page_size);
      setTotal(value.page_count * value.page_size);
      setCurrentPage(page);
    });
  };

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(RoleCheckWrapper["a" /* RoleCheckWrapper */] // forbidMessage={<FormattedMessage id='dashboard:doi_review_forbid' defaultMessage='您没有汇交验收评价的权限' />}
  , {
    // forbidMessage={<FormattedMessage id='dashboard:doi_review_forbid' defaultMessage='您没有汇交验收评价的权限' />}
    forbidMessage: Object(Text["a" /* TEXT */])('dashboard:doi_review_forbid', '您没有汇交验收评价的权限'),
    requiredRoles: [User["d" /* UserRole */].DataUploader]
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      flexDirection: 'column',
      width: '100%'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '16px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Group, {
    size: 'large',
    value: currentState,
    buttonStyle: 'solid'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: EvaluationState.Pending,
    onClick: function onClick() {
      return props.history.push('/cert/evaluation/pending');
    }
  }, Object(Text["a" /* TEXT */])('dash:pending', '待评价')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: EvaluationState.Finished,
    onClick: function onClick() {
      return props.history.push('/cert/evaluation/approved');
    }
  }, Object(Text["a" /* TEXT */])('dash:finished', '已评价')), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(radio_default.a.Button, {
    value: EvaluationState.All,
    onClick: function onClick() {
      return props.history.push('/cert/evaluation/all');
    }
  }, Object(Text["a" /* TEXT */])('dash:show_all', '全部')))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(EvaluationListViewer_EvaluationListViewer, {
    admin: true,
    total: total,
    pageSize: pageSize,
    current: currentPage,
    loading: false,
    onPageChange: handlePageChange,
    data: dataSource
  })));
};
// CONCATENATED MODULE: ./entry/dashboard_v1.tsx





















 // import {ApplyCertification} from '../components/dashboard/pages/ApplyCertification';
// import {ApplyVerification} from '../components/dashboard/pages/ApplyVerification';
// import {VerificationReport} from '../components/dashboard/pages/VerificationReport';
// import {MyCertificationList} from '../components/dashboard/pages/MyCertificationList';








 // import { MySubject } from '../components/dashboard/pages/MySubject';


var Content = layout_default.a.Content,
    Sider = layout_default.a.Sider;
/**
 * 控制面板页面的路由
 * - 数据和模板：/dashboard/mge/{data, template, history, task}
 * - 个人信息：/dashboard/account{/, /password}
 * - 审核：/dashboard/review/{data, template, DOI, roles}
 * - 通知：/dashboard/notifications
 * - 反馈：/dashboard/feedback{ /, /new}
 * - 用户管理
 */

var breadcrumbItems = {
  title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'dashboard',
    defaultMessage: "\u63A7\u5236\u9762\u677F"
  }),
  url: Urls["b" /* default */].dashboard
};

var dashboard_v1_DashboardV1Entry = function DashboardV1Entry() {
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeLayout["a" /* MgeLayout */], {
    loginRequired: true,
    titleID: 'dashboard',
    defaultTitle: "\u63A7\u5236\u9762\u677F"
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Breadcrumb["a" /* Breadcrumb */], {
    items: [Breadcrumb["a" /* Breadcrumb */].MGED, Breadcrumb["a" /* Breadcrumb */].MDB, breadcrumbItems]
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["HashRouter"], null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(layout_default.a, {
    style: {
      padding: '16px 0',
      margin: '24px',
      background: '#fff'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Sider, {
    width: 200,
    style: {
      background: '#fff'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(LeftNavMenu, null)), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Content, {
    style: {
      padding: '0 24px',
      minHeight: 280,
      flex: 1,
      display: 'flex'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/review/data',
    component: DataReview_DataReview
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/review/template',
    component: TemplateReview_TemplateReview
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/review/user_role',
    component: UserRoleReview_UserRoleReview
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/review/doi',
    component: DoiReview_DoiReview
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/account/info',
    component: pages_AccountInfo_AccountInfo
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/account/password',
    component: pages_ChangePassword_ChangePassword
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/data',
    component: MyData_MyData
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/template',
    component: MyTemplate
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/snippet',
    component: MySnippet
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/dataset',
    component: Dataset_DoiList
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/doi',
    component: DOIRegister_DOIRegister
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/verify/certvideo',
    component: VerificationVideo_VerificationVideo
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/verify/cert',
    component: ApplyCertification
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/verify/apply',
    component: ApplyVerification
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/verify/certification_list',
    component: MyCertificationList_MyCertificationList
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/verify/verification_list',
    component: MyVerificationList_MyVerificationList
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/cert/evaluation',
    component: Evaluation_CertEvaluation
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/cert/assign',
    component: AssignCert_AssignCert
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/cert/data',
    component: CertificationData_CertificationData
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/acceptance/data',
    component: CertificationData_CertificationData
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(react_router_domfrom_dll_reference_dll_library["Route"], {
    path: '/template_score',
    component: ExpertEvaluateTemplate_ExpertEvaluateTemplate
  })))));
};

react_domfrom_dll_reference_dll_library_default.a.render( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(dashboard_v1_DashboardV1Entry, null), document.getElementById('wrap'));

/***/ }),

/***/ 1851:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/objectWithoutProperties.js
var objectWithoutProperties = __webpack_require__(105);
var objectWithoutProperties_default = /*#__PURE__*/__webpack_require__.n(objectWithoutProperties);

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/extends.js
var helpers_extends = __webpack_require__(20);
var extends_default = /*#__PURE__*/__webpack_require__.n(helpers_extends);

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/classCallCheck.js
var classCallCheck = __webpack_require__(23);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck);

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/possibleConstructorReturn.js
var possibleConstructorReturn = __webpack_require__(19);
var possibleConstructorReturn_default = /*#__PURE__*/__webpack_require__.n(possibleConstructorReturn);

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/inherits.js
var inherits = __webpack_require__(26);
var inherits_default = /*#__PURE__*/__webpack_require__.n(inherits);

// EXTERNAL MODULE: delegated ./node_modules/react/index.js from dll-reference dll_library
var reactfrom_dll_reference_dll_library = __webpack_require__(0);
var reactfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(reactfrom_dll_reference_dll_library);

// EXTERNAL MODULE: delegated ./node_modules/prop-types/index.js from dll-reference dll_library
var prop_typesfrom_dll_reference_dll_library = __webpack_require__(1);
var prop_typesfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(prop_typesfrom_dll_reference_dll_library);

// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(8);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);

// EXTERNAL MODULE: ./node_modules/rc-util/es/KeyCode.js
var KeyCode = __webpack_require__(49);

// EXTERNAL MODULE: ./node_modules/babel-runtime/helpers/createClass.js
var createClass = __webpack_require__(52);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass);

// CONCATENATED MODULE: ./node_modules/rmc-feedback/es/TouchFeedback.js








var TouchFeedback_TouchFeedback = function (_React$Component) {
    inherits_default()(TouchFeedback, _React$Component);

    function TouchFeedback() {
        classCallCheck_default()(this, TouchFeedback);

        var _this = possibleConstructorReturn_default()(this, (TouchFeedback.__proto__ || Object.getPrototypeOf(TouchFeedback)).apply(this, arguments));

        _this.state = {
            active: false
        };
        _this.onTouchStart = function (e) {
            _this.triggerEvent('TouchStart', true, e);
        };
        _this.onTouchMove = function (e) {
            _this.triggerEvent('TouchMove', false, e);
        };
        _this.onTouchEnd = function (e) {
            _this.triggerEvent('TouchEnd', false, e);
        };
        _this.onTouchCancel = function (e) {
            _this.triggerEvent('TouchCancel', false, e);
        };
        _this.onMouseDown = function (e) {
            // pc simulate mobile
            _this.triggerEvent('MouseDown', true, e);
        };
        _this.onMouseUp = function (e) {
            _this.triggerEvent('MouseUp', false, e);
        };
        _this.onMouseLeave = function (e) {
            _this.triggerEvent('MouseLeave', false, e);
        };
        return _this;
    }

    createClass_default()(TouchFeedback, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate() {
            if (this.props.disabled && this.state.active) {
                this.setState({
                    active: false
                });
            }
        }
    }, {
        key: 'triggerEvent',
        value: function triggerEvent(type, isActive, ev) {
            var eventType = 'on' + type;
            var children = this.props.children;

            if (children.props[eventType]) {
                children.props[eventType](ev);
            }
            if (isActive !== this.state.active) {
                this.setState({
                    active: isActive
                });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                children = _props.children,
                disabled = _props.disabled,
                activeClassName = _props.activeClassName,
                activeStyle = _props.activeStyle;

            var events = disabled ? undefined : {
                onTouchStart: this.onTouchStart,
                onTouchMove: this.onTouchMove,
                onTouchEnd: this.onTouchEnd,
                onTouchCancel: this.onTouchCancel,
                onMouseDown: this.onMouseDown,
                onMouseUp: this.onMouseUp,
                onMouseLeave: this.onMouseLeave
            };
            var child = reactfrom_dll_reference_dll_library_default.a.Children.only(children);
            if (!disabled && this.state.active) {
                var _child$props = child.props,
                    style = _child$props.style,
                    className = _child$props.className;

                if (activeStyle !== false) {
                    if (activeStyle) {
                        style = extends_default()({}, style, activeStyle);
                    }
                    className = classnames_default()(className, activeClassName);
                }
                return reactfrom_dll_reference_dll_library_default.a.cloneElement(child, extends_default()({ className: className,
                    style: style }, events));
            }
            return reactfrom_dll_reference_dll_library_default.a.cloneElement(child, events);
        }
    }]);

    return TouchFeedback;
}(reactfrom_dll_reference_dll_library_default.a.Component);

/* harmony default export */ var es_TouchFeedback = (TouchFeedback_TouchFeedback);

TouchFeedback_TouchFeedback.defaultProps = {
    disabled: false
};
// CONCATENATED MODULE: ./node_modules/rmc-feedback/es/index.js

// CONCATENATED MODULE: ./node_modules/rc-input-number/es/InputHandler.js








var InputHandler_InputHandler = function (_Component) {
  inherits_default()(InputHandler, _Component);

  function InputHandler() {
    classCallCheck_default()(this, InputHandler);

    return possibleConstructorReturn_default()(this, _Component.apply(this, arguments));
  }

  InputHandler.prototype.render = function render() {
    var _props = this.props,
        prefixCls = _props.prefixCls,
        disabled = _props.disabled,
        otherProps = objectWithoutProperties_default()(_props, ['prefixCls', 'disabled']);

    return reactfrom_dll_reference_dll_library_default.a.createElement(
      es_TouchFeedback,
      {
        disabled: disabled,
        activeClassName: prefixCls + '-handler-active'
      },
      reactfrom_dll_reference_dll_library_default.a.createElement('span', otherProps)
    );
  };

  return InputHandler;
}(reactfrom_dll_reference_dll_library["Component"]);

InputHandler_InputHandler.propTypes = {
  prefixCls: prop_typesfrom_dll_reference_dll_library_default.a.string,
  disabled: prop_typesfrom_dll_reference_dll_library_default.a.bool,
  onTouchStart: prop_typesfrom_dll_reference_dll_library_default.a.func,
  onTouchEnd: prop_typesfrom_dll_reference_dll_library_default.a.func,
  onMouseDown: prop_typesfrom_dll_reference_dll_library_default.a.func,
  onMouseUp: prop_typesfrom_dll_reference_dll_library_default.a.func,
  onMouseLeave: prop_typesfrom_dll_reference_dll_library_default.a.func
};

/* harmony default export */ var es_InputHandler = (InputHandler_InputHandler);
// CONCATENATED MODULE: ./node_modules/rc-input-number/es/index.js











function noop() {}

function preventDefault(e) {
  e.preventDefault();
}

function defaultParser(input) {
  return input.replace(/[^\w\.-]+/g, '');
}

/**
 * When click and hold on a button - the speed of auto changin the value.
 */
var SPEED = 200;

/**
 * When click and hold on a button - the delay before auto changin the value.
 */
var DELAY = 600;

/**
 * Max Safe Integer -- on IE this is not available, so manually set the number in that case.
 * The reason this is used, instead of Infinity is because numbers above the MSI are unstable
 */
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

var isValidProps = function isValidProps(value) {
  return value !== undefined && value !== null;
};

var isEqual = function isEqual(oldValue, newValue) {
  return newValue === oldValue || typeof newValue === 'number' && typeof oldValue === 'number' && isNaN(newValue) && isNaN(oldValue);
};

var es_InputNumber = function (_React$Component) {
  inherits_default()(InputNumber, _React$Component);

  function InputNumber(props) {
    classCallCheck_default()(this, InputNumber);

    var _this = possibleConstructorReturn_default()(this, _React$Component.call(this, props));

    es_initialiseProps.call(_this);

    var value = void 0;
    if ('value' in props) {
      value = props.value;
    } else {
      value = props.defaultValue;
    }
    _this.state = {
      focused: props.autoFocus
    };
    var validValue = _this.getValidValue(_this.toNumber(value));
    _this.state = extends_default()({}, _this.state, {
      inputValue: _this.toPrecisionAsStep(validValue),
      value: validValue
    });
    return _this;
  }

  InputNumber.prototype.componentDidMount = function componentDidMount() {
    this.componentDidUpdate();
  };

  InputNumber.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
    var _props = this.props,
        value = _props.value,
        onChange = _props.onChange,
        max = _props.max,
        min = _props.min;
    var focused = this.state.focused;

    // Don't trigger in componentDidMount

    if (prevProps) {
      if (!isEqual(prevProps.value, value) || !isEqual(prevProps.max, max) || !isEqual(prevProps.min, min)) {
        var validValue = focused ? value : this.getValidValue(value);
        var nextInputValue = void 0;
        if (this.pressingUpOrDown) {
          nextInputValue = validValue;
        } else if (this.inputting) {
          nextInputValue = this.rawInput;
        } else {
          nextInputValue = this.toPrecisionAsStep(validValue);
        }
        this.setState({ // eslint-disable-line
          value: validValue,
          inputValue: nextInputValue
        });
      }

      // Trigger onChange when max or min change
      // https://github.com/ant-design/ant-design/issues/11574
      var nextValue = 'value' in this.props ? value : this.state.value;
      // ref: null < 20 === true
      // https://github.com/ant-design/ant-design/issues/14277
      if ('max' in this.props && prevProps.max !== max && typeof nextValue === 'number' && nextValue > max && onChange) {
        onChange(max);
      }
      if ('min' in this.props && prevProps.min !== min && typeof nextValue === 'number' && nextValue < min && onChange) {
        onChange(min);
      }
    }

    // Restore cursor
    try {
      // Firefox set the input cursor after it get focused.
      // This caused that if an input didn't init with the selection,
      // set will cause cursor not correct when first focus.
      // Safari will focus input if set selection. We need skip this.
      if (this.cursorStart !== undefined && this.state.focused) {
        // In most cases, the string after cursor is stable.
        // We can move the cursor before it

        if (
        // If not match full str, try to match part of str
        !this.partRestoreByAfter(this.cursorAfter) && this.state.value !== this.props.value) {
          // If not match any of then, let's just keep the position
          // TODO: Logic should not reach here, need check if happens
          var pos = this.cursorStart + 1;

          // If not have last string, just position to the end
          if (!this.cursorAfter) {
            pos = this.input.value.length;
          } else if (this.lastKeyCode === KeyCode["a" /* default */].BACKSPACE) {
            pos = this.cursorStart - 1;
          } else if (this.lastKeyCode === KeyCode["a" /* default */].DELETE) {
            pos = this.cursorStart;
          }
          this.fixCaret(pos, pos);
        } else if (this.currentValue === this.input.value) {
          // Handle some special key code
          switch (this.lastKeyCode) {
            case KeyCode["a" /* default */].BACKSPACE:
              this.fixCaret(this.cursorStart - 1, this.cursorStart - 1);
              break;
            case KeyCode["a" /* default */].DELETE:
              this.fixCaret(this.cursorStart + 1, this.cursorStart + 1);
              break;
            default:
            // Do nothing
          }
        }
      }
    } catch (e) {}
    // Do nothing


    // Reset last key
    this.lastKeyCode = null;

    // pressingUpOrDown is true means that someone just click up or down button
    if (!this.pressingUpOrDown) {
      return;
    }
    if (this.props.focusOnUpDown && this.state.focused) {
      if (document.activeElement !== this.input) {
        this.focus();
      }
    }

    this.pressingUpOrDown = false;
  };

  InputNumber.prototype.componentWillUnmount = function componentWillUnmount() {
    this.stop();
  };

  InputNumber.prototype.getCurrentValidValue = function getCurrentValidValue(value) {
    var val = value;
    if (val === '') {
      val = '';
    } else if (!this.isNotCompleteNumber(parseFloat(val, 10))) {
      val = this.getValidValue(val);
    } else {
      val = this.state.value;
    }
    return this.toNumber(val);
  };

  InputNumber.prototype.getRatio = function getRatio(e) {
    var ratio = 1;
    if (e.metaKey || e.ctrlKey) {
      ratio = 0.1;
    } else if (e.shiftKey) {
      ratio = 10;
    }
    return ratio;
  };

  InputNumber.prototype.getValueFromEvent = function getValueFromEvent(e) {
    // optimize for chinese input expierence
    // https://github.com/ant-design/ant-design/issues/8196
    var value = e.target.value.trim().replace(/。/g, '.');

    if (isValidProps(this.props.decimalSeparator)) {
      value = value.replace(this.props.decimalSeparator, '.');
    }

    return value;
  };

  InputNumber.prototype.getValidValue = function getValidValue(value) {
    var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.props.min;
    var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.props.max;

    var val = parseFloat(value, 10);
    // https://github.com/ant-design/ant-design/issues/7358
    if (isNaN(val)) {
      return value;
    }
    if (val < min) {
      val = min;
    }
    if (val > max) {
      val = max;
    }
    return val;
  };

  InputNumber.prototype.setValue = function setValue(v, callback) {
    // trigger onChange
    var precision = this.props.precision;

    var newValue = this.isNotCompleteNumber(parseFloat(v, 10)) ? null : parseFloat(v, 10);
    var _state = this.state,
        _state$value = _state.value,
        value = _state$value === undefined ? null : _state$value,
        _state$inputValue = _state.inputValue,
        inputValue = _state$inputValue === undefined ? null : _state$inputValue;
    // https://github.com/ant-design/ant-design/issues/7363
    // https://github.com/ant-design/ant-design/issues/16622

    var newValueInString = typeof newValue === 'number' ? newValue.toFixed(precision) : '' + newValue;
    var changed = newValue !== value || newValueInString !== '' + inputValue;
    if (!('value' in this.props)) {
      this.setState({
        value: newValue,
        inputValue: this.toPrecisionAsStep(v)
      }, callback);
    } else {
      // always set input value same as value
      this.setState({
        inputValue: this.toPrecisionAsStep(this.state.value)
      }, callback);
    }
    if (changed) {
      this.props.onChange(newValue);
    }

    return newValue;
  };

  InputNumber.prototype.getPrecision = function getPrecision(value) {
    if (isValidProps(this.props.precision)) {
      return this.props.precision;
    }
    var valueString = value.toString();
    if (valueString.indexOf('e-') >= 0) {
      return parseInt(valueString.slice(valueString.indexOf('e-') + 2), 10);
    }
    var precision = 0;
    if (valueString.indexOf('.') >= 0) {
      precision = valueString.length - valueString.indexOf('.') - 1;
    }
    return precision;
  };

  // step={1.0} value={1.51}
  // press +
  // then value should be 2.51, rather than 2.5
  // if this.props.precision is undefined
  // https://github.com/react-component/input-number/issues/39


  InputNumber.prototype.getMaxPrecision = function getMaxPrecision(currentValue) {
    var ratio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    var _props2 = this.props,
        precision = _props2.precision,
        step = _props2.step;

    if (isValidProps(precision)) {
      return precision;
    }
    var ratioPrecision = this.getPrecision(ratio);
    var stepPrecision = this.getPrecision(step);
    var currentValuePrecision = this.getPrecision(currentValue);
    if (!currentValue) {
      return ratioPrecision + stepPrecision;
    }
    return Math.max(currentValuePrecision, ratioPrecision + stepPrecision);
  };

  InputNumber.prototype.getPrecisionFactor = function getPrecisionFactor(currentValue) {
    var ratio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    var precision = this.getMaxPrecision(currentValue, ratio);
    return Math.pow(10, precision);
  };

  InputNumber.prototype.fixCaret = function fixCaret(start, end) {
    if (start === undefined || end === undefined || !this.input || !this.input.value) {
      return;
    }

    try {
      var currentStart = this.input.selectionStart;
      var currentEnd = this.input.selectionEnd;

      if (start !== currentStart || end !== currentEnd) {
        this.input.setSelectionRange(start, end);
      }
    } catch (e) {
      // Fix error in Chrome:
      // Failed to read the 'selectionStart' property from 'HTMLInputElement'
      // http://stackoverflow.com/q/21177489/3040605
    }
  };

  InputNumber.prototype.focus = function focus() {
    this.input.focus();
    this.recordCursorPosition();
  };

  InputNumber.prototype.blur = function blur() {
    this.input.blur();
  };

  InputNumber.prototype.select = function select() {
    this.input.select();
  };

  InputNumber.prototype.formatWrapper = function formatWrapper(num) {
    // http://2ality.com/2012/03/signedzero.html
    // https://github.com/ant-design/ant-design/issues/9439
    if (this.props.formatter) {
      return this.props.formatter(num);
    }
    return num;
  };

  InputNumber.prototype.toPrecisionAsStep = function toPrecisionAsStep(num) {
    if (this.isNotCompleteNumber(num) || num === '') {
      return num;
    }
    var precision = Math.abs(this.getMaxPrecision(num));
    if (!isNaN(precision)) {
      return Number(num).toFixed(precision);
    }
    return num.toString();
  };

  // '1.' '1x' 'xx' '' => are not complete numbers


  InputNumber.prototype.isNotCompleteNumber = function isNotCompleteNumber(num) {
    return isNaN(num) || num === '' || num === null || num && num.toString().indexOf('.') === num.toString().length - 1;
  };

  InputNumber.prototype.toNumber = function toNumber(num) {
    var precision = this.props.precision;
    var focused = this.state.focused;
    // num.length > 16 => This is to prevent input of large numbers

    var numberIsTooLarge = num && num.length > 16 && focused;
    if (this.isNotCompleteNumber(num) || numberIsTooLarge) {
      return num;
    }
    if (isValidProps(precision)) {
      return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
    }
    return Number(num);
  };

  InputNumber.prototype.upStep = function upStep(val, rat) {
    var step = this.props.step;

    var precisionFactor = this.getPrecisionFactor(val, rat);
    var precision = Math.abs(this.getMaxPrecision(val, rat));
    var result = ((precisionFactor * val + precisionFactor * step * rat) / precisionFactor).toFixed(precision);
    return this.toNumber(result);
  };

  InputNumber.prototype.downStep = function downStep(val, rat) {
    var step = this.props.step;

    var precisionFactor = this.getPrecisionFactor(val, rat);
    var precision = Math.abs(this.getMaxPrecision(val, rat));
    var result = ((precisionFactor * val - precisionFactor * step * rat) / precisionFactor).toFixed(precision);
    return this.toNumber(result);
  };

  InputNumber.prototype.step = function step(type, e) {
    var _this2 = this;

    var ratio = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    var recursive = arguments[3];

    this.stop();
    if (e) {
      e.persist();
      e.preventDefault();
    }
    var props = this.props;
    if (props.disabled) {
      return;
    }
    var value = this.getCurrentValidValue(this.state.inputValue) || 0;
    if (this.isNotCompleteNumber(value)) {
      return;
    }
    var val = this[type + 'Step'](value, ratio);
    var outOfRange = val > props.max || val < props.min;
    if (val > props.max) {
      val = props.max;
    } else if (val < props.min) {
      val = props.min;
    }
    this.setValue(val);
    this.setState({
      focused: true
    });
    if (outOfRange) {
      return;
    }
    this.autoStepTimer = setTimeout(function () {
      _this2[type](e, ratio, true);
    }, recursive ? SPEED : DELAY);
  };

  InputNumber.prototype.render = function render() {
    var _classNames;

    var props = extends_default()({}, this.props);

    var prefixCls = props.prefixCls,
        disabled = props.disabled,
        readOnly = props.readOnly,
        useTouch = props.useTouch,
        autoComplete = props.autoComplete,
        upHandler = props.upHandler,
        downHandler = props.downHandler,
        rest = objectWithoutProperties_default()(props, ['prefixCls', 'disabled', 'readOnly', 'useTouch', 'autoComplete', 'upHandler', 'downHandler']);

    var classes = classnames_default()((_classNames = {}, _classNames[prefixCls] = true, _classNames[props.className] = !!props.className, _classNames[prefixCls + '-disabled'] = disabled, _classNames[prefixCls + '-focused'] = this.state.focused, _classNames));
    var upDisabledClass = '';
    var downDisabledClass = '';
    var _state2 = this.state,
        value = _state2.value,
        inputValue = _state2.inputValue;

    if (value || value === 0) {
      if (!isNaN(value)) {
        var val = Number(value);
        if (val >= props.max) {
          upDisabledClass = prefixCls + '-handler-up-disabled';
        }
        if (val <= props.min) {
          downDisabledClass = prefixCls + '-handler-down-disabled';
        }
      } else {
        upDisabledClass = prefixCls + '-handler-up-disabled';
        downDisabledClass = prefixCls + '-handler-down-disabled';
      }
    }

    var dataOrAriaAttributeProps = {};
    for (var key in props) {
      if (props.hasOwnProperty(key) && (key.substr(0, 5) === 'data-' || key.substr(0, 5) === 'aria-' || key === 'role')) {
        dataOrAriaAttributeProps[key] = props[key];
      }
    }

    var editable = !props.readOnly && !props.disabled;

    // focus state, show input value
    // unfocus state, show valid value
    var inputDisplayValue = this.composing ? inputValue : this.getInputDisplayValue();

    var upEvents = void 0;
    var downEvents = void 0;
    if (useTouch) {
      upEvents = {
        onTouchStart: editable && !upDisabledClass ? this.up : noop,
        onTouchEnd: this.stop
      };
      downEvents = {
        onTouchStart: editable && !downDisabledClass ? this.down : noop,
        onTouchEnd: this.stop
      };
    } else {
      upEvents = {
        onMouseDown: editable && !upDisabledClass ? this.up : noop,
        onMouseUp: this.stop,
        onMouseLeave: this.stop
      };
      downEvents = {
        onMouseDown: editable && !downDisabledClass ? this.down : noop,
        onMouseUp: this.stop,
        onMouseLeave: this.stop
      };
    }

    var isUpDisabled = !!upDisabledClass || disabled || readOnly;
    var isDownDisabled = !!downDisabledClass || disabled || readOnly;
    // ref for test
    return reactfrom_dll_reference_dll_library_default.a.createElement(
      'div',
      {
        className: classes,
        style: props.style,
        title: props.title,
        onMouseEnter: props.onMouseEnter,
        onMouseLeave: props.onMouseLeave,
        onMouseOver: props.onMouseOver,
        onMouseOut: props.onMouseOut,
        onCompositionStart: this.onComposition,
        onCompositionEnd: this.onComposition
      },
      reactfrom_dll_reference_dll_library_default.a.createElement(
        'div',
        { className: prefixCls + '-handler-wrap' },
        reactfrom_dll_reference_dll_library_default.a.createElement(
          es_InputHandler,
          extends_default()({
            ref: this.saveUp,
            disabled: isUpDisabled,
            prefixCls: prefixCls,
            unselectable: 'unselectable'
          }, upEvents, {
            role: 'button',
            'aria-label': 'Increase Value',
            'aria-disabled': !!isUpDisabled,
            className: prefixCls + '-handler ' + prefixCls + '-handler-up ' + upDisabledClass
          }),
          upHandler || reactfrom_dll_reference_dll_library_default.a.createElement('span', {
            unselectable: 'unselectable',
            className: prefixCls + '-handler-up-inner',
            onClick: preventDefault
          })
        ),
        reactfrom_dll_reference_dll_library_default.a.createElement(
          es_InputHandler,
          extends_default()({
            ref: this.saveDown,
            disabled: isDownDisabled,
            prefixCls: prefixCls,
            unselectable: 'unselectable'
          }, downEvents, {
            role: 'button',
            'aria-label': 'Decrease Value',
            'aria-disabled': !!isDownDisabled,
            className: prefixCls + '-handler ' + prefixCls + '-handler-down ' + downDisabledClass
          }),
          downHandler || reactfrom_dll_reference_dll_library_default.a.createElement('span', {
            unselectable: 'unselectable',
            className: prefixCls + '-handler-down-inner',
            onClick: preventDefault
          })
        )
      ),
      reactfrom_dll_reference_dll_library_default.a.createElement(
        'div',
        {
          className: prefixCls + '-input-wrap'
        },
        reactfrom_dll_reference_dll_library_default.a.createElement('input', extends_default()({
          role: 'spinbutton',
          'aria-valuemin': props.min,
          'aria-valuemax': props.max,
          'aria-valuenow': value,
          required: props.required,
          type: props.type,
          placeholder: props.placeholder,
          onClick: props.onClick,
          onMouseUp: this.onMouseUp,
          className: prefixCls + '-input',
          tabIndex: props.tabIndex,
          autoComplete: autoComplete,
          onFocus: this.onFocus,
          onBlur: this.onBlur,
          onKeyDown: editable ? this.onKeyDown : noop,
          onKeyUp: editable ? this.onKeyUp : noop,
          autoFocus: props.autoFocus,
          maxLength: props.maxLength,
          readOnly: props.readOnly,
          disabled: props.disabled,
          max: props.max,
          min: props.min,
          step: props.step,
          name: props.name,
          title: props.title,
          id: props.id,
          onChange: this.onChange,
          ref: this.saveInput,
          value: inputDisplayValue,
          pattern: props.pattern,
          inputMode: props.inputMode
        }, dataOrAriaAttributeProps))
      )
    );
  };

  return InputNumber;
}(reactfrom_dll_reference_dll_library_default.a.Component);

es_InputNumber.propTypes = {
  value: prop_typesfrom_dll_reference_dll_library_default.a.oneOfType([prop_typesfrom_dll_reference_dll_library_default.a.number, prop_typesfrom_dll_reference_dll_library_default.a.string]),
  defaultValue: prop_typesfrom_dll_reference_dll_library_default.a.oneOfType([prop_typesfrom_dll_reference_dll_library_default.a.number, prop_typesfrom_dll_reference_dll_library_default.a.string]),
  focusOnUpDown: prop_typesfrom_dll_reference_dll_library_default.a.bool,
  autoFocus: prop_typesfrom_dll_reference_dll_library_default.a.bool,
  onChange: prop_typesfrom_dll_reference_dll_library_default.a.func,
  onPressEnter: prop_typesfrom_dll_reference_dll_library_default.a.func,
  onKeyDown: prop_typesfrom_dll_reference_dll_library_default.a.func,
  onKeyUp: prop_typesfrom_dll_reference_dll_library_default.a.func,
  prefixCls: prop_typesfrom_dll_reference_dll_library_default.a.string,
  tabIndex: prop_typesfrom_dll_reference_dll_library_default.a.oneOfType([prop_typesfrom_dll_reference_dll_library_default.a.string, prop_typesfrom_dll_reference_dll_library_default.a.number]),
  disabled: prop_typesfrom_dll_reference_dll_library_default.a.bool,
  onFocus: prop_typesfrom_dll_reference_dll_library_default.a.func,
  onBlur: prop_typesfrom_dll_reference_dll_library_default.a.func,
  readOnly: prop_typesfrom_dll_reference_dll_library_default.a.bool,
  max: prop_typesfrom_dll_reference_dll_library_default.a.number,
  min: prop_typesfrom_dll_reference_dll_library_default.a.number,
  step: prop_typesfrom_dll_reference_dll_library_default.a.oneOfType([prop_typesfrom_dll_reference_dll_library_default.a.number, prop_typesfrom_dll_reference_dll_library_default.a.string]),
  upHandler: prop_typesfrom_dll_reference_dll_library_default.a.node,
  downHandler: prop_typesfrom_dll_reference_dll_library_default.a.node,
  useTouch: prop_typesfrom_dll_reference_dll_library_default.a.bool,
  formatter: prop_typesfrom_dll_reference_dll_library_default.a.func,
  parser: prop_typesfrom_dll_reference_dll_library_default.a.func,
  onMouseEnter: prop_typesfrom_dll_reference_dll_library_default.a.func,
  onMouseLeave: prop_typesfrom_dll_reference_dll_library_default.a.func,
  onMouseOver: prop_typesfrom_dll_reference_dll_library_default.a.func,
  onMouseOut: prop_typesfrom_dll_reference_dll_library_default.a.func,
  onMouseUp: prop_typesfrom_dll_reference_dll_library_default.a.func,
  precision: prop_typesfrom_dll_reference_dll_library_default.a.number,
  required: prop_typesfrom_dll_reference_dll_library_default.a.bool,
  pattern: prop_typesfrom_dll_reference_dll_library_default.a.string,
  decimalSeparator: prop_typesfrom_dll_reference_dll_library_default.a.string,
  inputMode: prop_typesfrom_dll_reference_dll_library_default.a.string
};
es_InputNumber.defaultProps = {
  focusOnUpDown: true,
  useTouch: false,
  prefixCls: 'rc-input-number',
  min: -MAX_SAFE_INTEGER,
  step: 1,
  style: {},
  onChange: noop,
  onKeyDown: noop,
  onPressEnter: noop,
  onFocus: noop,
  onBlur: noop,
  parser: defaultParser,
  required: false,
  autoComplete: 'off'
};

var es_initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.onKeyDown = function (e) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var _props3 = _this3.props,
        onKeyDown = _props3.onKeyDown,
        onPressEnter = _props3.onPressEnter;


    if (e.keyCode === KeyCode["a" /* default */].UP) {
      var ratio = _this3.getRatio(e);
      _this3.up(e, ratio);
      _this3.stop();
    } else if (e.keyCode === KeyCode["a" /* default */].DOWN) {
      var _ratio = _this3.getRatio(e);
      _this3.down(e, _ratio);
      _this3.stop();
    } else if (e.keyCode === KeyCode["a" /* default */].ENTER && onPressEnter) {
      onPressEnter(e);
    }

    // Trigger user key down
    _this3.recordCursorPosition();
    _this3.lastKeyCode = e.keyCode;
    if (onKeyDown) {
      onKeyDown.apply(undefined, [e].concat(args));
    }
  };

  this.onKeyUp = function (e) {
    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var onKeyUp = _this3.props.onKeyUp;


    _this3.stop();

    _this3.recordCursorPosition();

    // Trigger user key up
    if (onKeyUp) {
      onKeyUp.apply(undefined, [e].concat(args));
    }
  };

  this.onChange = function (e) {
    var onChange = _this3.props.onChange;

    if (_this3.state.focused) {
      _this3.inputting = true;
    }
    _this3.rawInput = _this3.props.parser(_this3.getValueFromEvent(e));
    if (_this3.composing) {
      _this3.setState({ inputValue: _this3.getValueFromEvent(e) });
    } else {
      _this3.setState({ inputValue: _this3.rawInput });
      onChange(_this3.toNumber(_this3.rawInput)); // valid number or invalid string
    }
  };

  this.onMouseUp = function () {
    var onMouseUp = _this3.props.onMouseUp;


    _this3.recordCursorPosition();

    if (onMouseUp) {
      onMouseUp.apply(undefined, arguments);
    }
  };

  this.onFocus = function () {
    var _props4;

    _this3.setState({
      focused: true
    });
    (_props4 = _this3.props).onFocus.apply(_props4, arguments);
  };

  this.onBlur = function () {
    var onBlur = _this3.props.onBlur;

    _this3.inputting = false;
    _this3.setState({
      focused: false
    });
    var value = _this3.getCurrentValidValue(_this3.state.inputValue);
    var newValue = _this3.setValue(value);

    if (onBlur) {
      var originValue = _this3.input.value;
      var inputValue = _this3.getInputDisplayValue({ focus: false, value: newValue });
      _this3.input.value = inputValue;
      onBlur.apply(undefined, arguments);
      _this3.input.value = originValue;
    }
  };

  this.onComposition = function (e) {
    if (e.type === 'compositionstart') {
      _this3.composing = true;
    } else if (e.type === 'compositionend') {
      _this3.composing = false;
      _this3.onChange(e);
    }
  };

  this.getInputDisplayValue = function (state) {
    var _ref = state || _this3.state,
        focused = _ref.focused,
        inputValue = _ref.inputValue,
        value = _ref.value;

    var inputDisplayValue = void 0;
    if (focused) {
      inputDisplayValue = inputValue;
    } else {
      inputDisplayValue = _this3.toPrecisionAsStep(value);
    }

    if (inputDisplayValue === undefined || inputDisplayValue === null) {
      inputDisplayValue = '';
    }

    var inputDisplayValueFormat = _this3.formatWrapper(inputDisplayValue);
    if (isValidProps(_this3.props.decimalSeparator)) {
      inputDisplayValueFormat = inputDisplayValueFormat.toString().replace('.', _this3.props.decimalSeparator);
    }

    return inputDisplayValueFormat;
  };

  this.recordCursorPosition = function () {
    // Record position
    try {
      _this3.cursorStart = _this3.input.selectionStart;
      _this3.cursorEnd = _this3.input.selectionEnd;
      _this3.currentValue = _this3.input.value;
      _this3.cursorBefore = _this3.input.value.substring(0, _this3.cursorStart);
      _this3.cursorAfter = _this3.input.value.substring(_this3.cursorEnd);
    } catch (e) {
      // Fix error in Chrome:
      // Failed to read the 'selectionStart' property from 'HTMLInputElement'
      // http://stackoverflow.com/q/21177489/3040605
    }
  };

  this.restoreByAfter = function (str) {
    if (str === undefined) return false;

    var fullStr = _this3.input.value;
    var index = fullStr.lastIndexOf(str);

    if (index === -1) return false;

    var prevCursorPos = _this3.cursorBefore.length;
    if (_this3.lastKeyCode === KeyCode["a" /* default */].DELETE && _this3.cursorBefore.charAt(prevCursorPos - 1) === str[0]) {
      _this3.fixCaret(prevCursorPos, prevCursorPos);
      return true;
    }

    if (index + str.length === fullStr.length) {
      _this3.fixCaret(index, index);

      return true;
    }
    return false;
  };

  this.partRestoreByAfter = function (str) {
    if (str === undefined) return false;

    // For loop from full str to the str with last char to map. e.g. 123
    // -> 123
    // -> 23
    // -> 3
    return Array.prototype.some.call(str, function (_, start) {
      var partStr = str.substring(start);

      return _this3.restoreByAfter(partStr);
    });
  };

  this.stop = function () {
    if (_this3.autoStepTimer) {
      clearTimeout(_this3.autoStepTimer);
    }
  };

  this.down = function (e, ratio, recursive) {
    _this3.pressingUpOrDown = true;
    _this3.step('down', e, ratio, recursive);
  };

  this.up = function (e, ratio, recursive) {
    _this3.pressingUpOrDown = true;
    _this3.step('up', e, ratio, recursive);
  };

  this.saveUp = function (node) {
    _this3.upHandler = node;
  };

  this.saveDown = function (node) {
    _this3.downHandler = node;
  };

  this.saveInput = function (node) {
    _this3.input = node;
  };
};

/* harmony default export */ var es = __webpack_exports__["default"] = (es_InputNumber);

/***/ }),

/***/ 278:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(__webpack_require__(0));

var PropTypes = _interopRequireWildcard(__webpack_require__(1));

var _rcSteps = _interopRequireDefault(__webpack_require__(955));

var _icon = _interopRequireDefault(__webpack_require__(28));

var _configProvider = __webpack_require__(39);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Steps =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Steps, _React$Component);

  function Steps() {
    var _this;

    _classCallCheck(this, Steps);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Steps).apply(this, arguments));

    _this.renderSteps = function (_ref) {
      var getPrefixCls = _ref.getPrefixCls;
      var prefixCls = getPrefixCls('steps', _this.props.prefixCls);
      var iconPrefix = getPrefixCls('', _this.props.iconPrefix);
      var icons = {
        finish: React.createElement(_icon["default"], {
          type: "check",
          className: "".concat(prefixCls, "-finish-icon")
        }),
        error: React.createElement(_icon["default"], {
          type: "close",
          className: "".concat(prefixCls, "-error-icon")
        })
      };
      return React.createElement(_rcSteps["default"], _extends({
        icons: icons
      }, _this.props, {
        prefixCls: prefixCls,
        iconPrefix: iconPrefix
      }));
    };

    return _this;
  }

  _createClass(Steps, [{
    key: "render",
    value: function render() {
      return React.createElement(_configProvider.ConfigConsumer, null, this.renderSteps);
    }
  }]);

  return Steps;
}(React.Component);

exports["default"] = Steps;
Steps.Step = _rcSteps["default"].Step;
Steps.defaultProps = {
  current: 0
};
Steps.propTypes = {
  prefixCls: PropTypes.string,
  iconPrefix: PropTypes.string,
  current: PropTypes.number
};
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 409:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(20);

var _extends3 = _interopRequireDefault(_extends2);

exports.argumentContainer = argumentContainer;
exports.identity = identity;
exports.flattenArray = flattenArray;
exports.treeTraverse = treeTraverse;
exports.flattenFields = flattenFields;
exports.normalizeValidateRules = normalizeValidateRules;
exports.getValidateTriggers = getValidateTriggers;
exports.getValueFromEvent = getValueFromEvent;
exports.getErrorStrs = getErrorStrs;
exports.getParams = getParams;
exports.isEmptyObject = isEmptyObject;
exports.hasRules = hasRules;
exports.startsWith = startsWith;
exports.supportRef = supportRef;

var _hoistNonReactStatics = __webpack_require__(259);

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _warning = __webpack_require__(119);

var _warning2 = _interopRequireDefault(_warning);

var _reactIs = __webpack_require__(363);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'WrappedComponent';
}

function argumentContainer(Container, WrappedComponent) {
  /* eslint no-param-reassign:0 */
  Container.displayName = 'Form(' + getDisplayName(WrappedComponent) + ')';
  Container.WrappedComponent = WrappedComponent;
  return (0, _hoistNonReactStatics2['default'])(Container, WrappedComponent);
}

function identity(obj) {
  return obj;
}

function flattenArray(arr) {
  return Array.prototype.concat.apply([], arr);
}

function treeTraverse() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var tree = arguments[1];
  var isLeafNode = arguments[2];
  var errorMessage = arguments[3];
  var callback = arguments[4];

  if (isLeafNode(path, tree)) {
    callback(path, tree);
  } else if (tree === undefined || tree === null) {
    // Do nothing
  } else if (Array.isArray(tree)) {
    tree.forEach(function (subTree, index) {
      return treeTraverse(path + '[' + index + ']', subTree, isLeafNode, errorMessage, callback);
    });
  } else {
    // It's object and not a leaf node
    if (typeof tree !== 'object') {
      (0, _warning2['default'])(false, errorMessage);
      return;
    }
    Object.keys(tree).forEach(function (subTreeKey) {
      var subTree = tree[subTreeKey];
      treeTraverse('' + path + (path ? '.' : '') + subTreeKey, subTree, isLeafNode, errorMessage, callback);
    });
  }
}

function flattenFields(maybeNestedFields, isLeafNode, errorMessage) {
  var fields = {};
  treeTraverse(undefined, maybeNestedFields, isLeafNode, errorMessage, function (path, node) {
    fields[path] = node;
  });
  return fields;
}

function normalizeValidateRules(validate, rules, validateTrigger) {
  var validateRules = validate.map(function (item) {
    var newItem = (0, _extends3['default'])({}, item, {
      trigger: item.trigger || []
    });
    if (typeof newItem.trigger === 'string') {
      newItem.trigger = [newItem.trigger];
    }
    return newItem;
  });
  if (rules) {
    validateRules.push({
      trigger: validateTrigger ? [].concat(validateTrigger) : [],
      rules: rules
    });
  }
  return validateRules;
}

function getValidateTriggers(validateRules) {
  return validateRules.filter(function (item) {
    return !!item.rules && item.rules.length;
  }).map(function (item) {
    return item.trigger;
  }).reduce(function (pre, curr) {
    return pre.concat(curr);
  }, []);
}

function getValueFromEvent(e) {
  // To support custom element
  if (!e || !e.target) {
    return e;
  }
  var target = e.target;

  return target.type === 'checkbox' ? target.checked : target.value;
}

function getErrorStrs(errors) {
  if (errors) {
    return errors.map(function (e) {
      if (e && e.message) {
        return e.message;
      }
      return e;
    });
  }
  return errors;
}

function getParams(ns, opt, cb) {
  var names = ns;
  var options = opt;
  var callback = cb;
  if (cb === undefined) {
    if (typeof names === 'function') {
      callback = names;
      options = {};
      names = undefined;
    } else if (Array.isArray(names)) {
      if (typeof options === 'function') {
        callback = options;
        options = {};
      } else {
        options = options || {};
      }
    } else {
      callback = options;
      options = names || {};
      names = undefined;
    }
  }
  return {
    names: names,
    options: options,
    callback: callback
  };
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

function hasRules(validate) {
  if (validate) {
    return validate.some(function (item) {
      return item.rules && item.rules.length;
    });
  }
  return false;
}

function startsWith(str, prefix) {
  return str.lastIndexOf(prefix, 0) === 0;
}

function supportRef(nodeOrComponent) {
  var type = (0, _reactIs.isMemo)(nodeOrComponent) ? nodeOrComponent.type.type : nodeOrComponent.type;

  // Function component node
  if (typeof type === 'function' && !(type.prototype && type.prototype.render)) {
    return false;
  }

  // Class component
  if (typeof nodeOrComponent === 'function' && !(nodeOrComponent.prototype && nodeOrComponent.prototype.render)) {
    return false;
  }

  return true;
}

/***/ }),

/***/ 410:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/certificate_logo.png";

/***/ }),

/***/ 447:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(55);

__webpack_require__(808);

__webpack_require__(490);
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 448:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/expired.png";

/***/ }),

/***/ 59:
/***/ (function(module, exports) {

module.exports = dll_library;

/***/ }),

/***/ 620:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(810);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),

/***/ 621:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _objectWithoutProperties2 = __webpack_require__(105);

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _defineProperty2 = __webpack_require__(42);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends5 = __webpack_require__(20);

var _extends6 = _interopRequireDefault(_extends5);

var _toConsumableArray2 = __webpack_require__(620);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _createReactClass = __webpack_require__(823);

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _unsafeLifecyclesPolyfill = __webpack_require__(825);

var _unsafeLifecyclesPolyfill2 = _interopRequireDefault(_unsafeLifecyclesPolyfill);

var _asyncValidator = __webpack_require__(826);

var _asyncValidator2 = _interopRequireDefault(_asyncValidator);

var _warning = __webpack_require__(119);

var _warning2 = _interopRequireDefault(_warning);

var _get = __webpack_require__(705);

var _get2 = _interopRequireDefault(_get);

var _set = __webpack_require__(623);

var _set2 = _interopRequireDefault(_set);

var _eq = __webpack_require__(404);

var _eq2 = _interopRequireDefault(_eq);

var _createFieldsStore = __webpack_require__(849);

var _createFieldsStore2 = _interopRequireDefault(_createFieldsStore);

var _utils = __webpack_require__(409);

var _FieldElemWrapper = __webpack_require__(850);

var _FieldElemWrapper2 = _interopRequireDefault(_FieldElemWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var DEFAULT_TRIGGER = 'onChange'; /* eslint-disable react/prefer-es6-class */
/* eslint-disable prefer-promise-reject-errors */

function createBaseForm() {
  var option = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var mixins = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var validateMessages = option.validateMessages,
      onFieldsChange = option.onFieldsChange,
      onValuesChange = option.onValuesChange,
      _option$mapProps = option.mapProps,
      mapProps = _option$mapProps === undefined ? _utils.identity : _option$mapProps,
      mapPropsToFields = option.mapPropsToFields,
      fieldNameProp = option.fieldNameProp,
      fieldMetaProp = option.fieldMetaProp,
      fieldDataProp = option.fieldDataProp,
      _option$formPropName = option.formPropName,
      formPropName = _option$formPropName === undefined ? 'form' : _option$formPropName,
      formName = option.name,
      withRef = option.withRef;


  return function decorate(WrappedComponent) {
    var Form = (0, _createReactClass2['default'])({
      displayName: 'Form',

      mixins: mixins,

      getInitialState: function getInitialState() {
        var _this = this;

        var fields = mapPropsToFields && mapPropsToFields(this.props);
        this.fieldsStore = (0, _createFieldsStore2['default'])(fields || {});

        this.instances = {};
        this.cachedBind = {};
        this.clearedFieldMetaCache = {};

        this.renderFields = {};
        this.domFields = {};

        // HACK: https://github.com/ant-design/ant-design/issues/6406
        ['getFieldsValue', 'getFieldValue', 'setFieldsInitialValue', 'getFieldsError', 'getFieldError', 'isFieldValidating', 'isFieldsValidating', 'isFieldsTouched', 'isFieldTouched'].forEach(function (key) {
          _this[key] = function () {
            var _fieldsStore;

            if (false) {}
            return (_fieldsStore = _this.fieldsStore)[key].apply(_fieldsStore, arguments);
          };
        });

        return {
          submitting: false
        };
      },
      componentDidMount: function componentDidMount() {
        this.cleanUpUselessFields();
      },
      componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (mapPropsToFields) {
          this.fieldsStore.updateFields(mapPropsToFields(nextProps));
        }
      },
      componentDidUpdate: function componentDidUpdate() {
        this.cleanUpUselessFields();
      },
      onCollectCommon: function onCollectCommon(name, action, args) {
        var fieldMeta = this.fieldsStore.getFieldMeta(name);
        if (fieldMeta[action]) {
          fieldMeta[action].apply(fieldMeta, (0, _toConsumableArray3['default'])(args));
        } else if (fieldMeta.originalProps && fieldMeta.originalProps[action]) {
          var _fieldMeta$originalPr;

          (_fieldMeta$originalPr = fieldMeta.originalProps)[action].apply(_fieldMeta$originalPr, (0, _toConsumableArray3['default'])(args));
        }
        var value = fieldMeta.getValueFromEvent ? fieldMeta.getValueFromEvent.apply(fieldMeta, (0, _toConsumableArray3['default'])(args)) : _utils.getValueFromEvent.apply(undefined, (0, _toConsumableArray3['default'])(args));
        if (onValuesChange && value !== this.fieldsStore.getFieldValue(name)) {
          var valuesAll = this.fieldsStore.getAllValues();
          var valuesAllSet = {};
          valuesAll[name] = value;
          Object.keys(valuesAll).forEach(function (key) {
            return (0, _set2['default'])(valuesAllSet, key, valuesAll[key]);
          });
          onValuesChange((0, _extends6['default'])((0, _defineProperty3['default'])({}, formPropName, this.getForm()), this.props), (0, _set2['default'])({}, name, value), valuesAllSet);
        }
        var field = this.fieldsStore.getField(name);
        return { name: name, field: (0, _extends6['default'])({}, field, { value: value, touched: true }), fieldMeta: fieldMeta };
      },
      onCollect: function onCollect(name_, action) {
        for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        var _onCollectCommon = this.onCollectCommon(name_, action, args),
            name = _onCollectCommon.name,
            field = _onCollectCommon.field,
            fieldMeta = _onCollectCommon.fieldMeta;

        var validate = fieldMeta.validate;


        this.fieldsStore.setFieldsAsDirty();

        var newField = (0, _extends6['default'])({}, field, {
          dirty: (0, _utils.hasRules)(validate)
        });
        this.setFields((0, _defineProperty3['default'])({}, name, newField));
      },
      onCollectValidate: function onCollectValidate(name_, action) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }

        var _onCollectCommon2 = this.onCollectCommon(name_, action, args),
            field = _onCollectCommon2.field,
            fieldMeta = _onCollectCommon2.fieldMeta;

        var newField = (0, _extends6['default'])({}, field, {
          dirty: true
        });

        this.fieldsStore.setFieldsAsDirty();

        this.validateFieldsInternal([newField], {
          action: action,
          options: {
            firstFields: !!fieldMeta.validateFirst
          }
        });
      },
      getCacheBind: function getCacheBind(name, action, fn) {
        if (!this.cachedBind[name]) {
          this.cachedBind[name] = {};
        }
        var cache = this.cachedBind[name];
        if (!cache[action] || cache[action].oriFn !== fn) {
          cache[action] = {
            fn: fn.bind(this, name, action),
            oriFn: fn
          };
        }
        return cache[action].fn;
      },
      getFieldDecorator: function getFieldDecorator(name, fieldOption) {
        var _this2 = this;

        var props = this.getFieldProps(name, fieldOption);
        return function (fieldElem) {
          // We should put field in record if it is rendered
          _this2.renderFields[name] = true;

          var fieldMeta = _this2.fieldsStore.getFieldMeta(name);
          var originalProps = fieldElem.props;
          if (false) { var defaultValuePropName, valuePropName; }
          fieldMeta.originalProps = originalProps;
          fieldMeta.ref = fieldElem.ref;
          var decoratedFieldElem = _react2['default'].cloneElement(fieldElem, (0, _extends6['default'])({}, props, _this2.fieldsStore.getFieldValuePropValue(fieldMeta)));
          return (0, _utils.supportRef)(fieldElem) ? decoratedFieldElem : _react2['default'].createElement(
            _FieldElemWrapper2['default'],
            { name: name, form: _this2 },
            decoratedFieldElem
          );
        };
      },
      getFieldProps: function getFieldProps(name) {
        var _this3 = this;

        var usersFieldOption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        if (!name) {
          throw new Error('Must call `getFieldProps` with valid name string!');
        }
        if (false) {}

        delete this.clearedFieldMetaCache[name];

        var fieldOption = (0, _extends6['default'])({
          name: name,
          trigger: DEFAULT_TRIGGER,
          valuePropName: 'value',
          validate: []
        }, usersFieldOption);

        var rules = fieldOption.rules,
            trigger = fieldOption.trigger,
            _fieldOption$validate = fieldOption.validateTrigger,
            validateTrigger = _fieldOption$validate === undefined ? trigger : _fieldOption$validate,
            validate = fieldOption.validate;


        var fieldMeta = this.fieldsStore.getFieldMeta(name);
        if ('initialValue' in fieldOption) {
          fieldMeta.initialValue = fieldOption.initialValue;
        }

        var inputProps = (0, _extends6['default'])({}, this.fieldsStore.getFieldValuePropValue(fieldOption), {
          ref: this.getCacheBind(name, name + '__ref', this.saveRef)
        });
        if (fieldNameProp) {
          inputProps[fieldNameProp] = formName ? formName + '_' + name : name;
        }

        var validateRules = (0, _utils.normalizeValidateRules)(validate, rules, validateTrigger);
        var validateTriggers = (0, _utils.getValidateTriggers)(validateRules);
        validateTriggers.forEach(function (action) {
          if (inputProps[action]) return;
          inputProps[action] = _this3.getCacheBind(name, action, _this3.onCollectValidate);
        });

        // make sure that the value will be collect
        if (trigger && validateTriggers.indexOf(trigger) === -1) {
          inputProps[trigger] = this.getCacheBind(name, trigger, this.onCollect);
        }

        var meta = (0, _extends6['default'])({}, fieldMeta, fieldOption, {
          validate: validateRules
        });
        this.fieldsStore.setFieldMeta(name, meta);
        if (fieldMetaProp) {
          inputProps[fieldMetaProp] = meta;
        }

        if (fieldDataProp) {
          inputProps[fieldDataProp] = this.fieldsStore.getField(name);
        }

        // This field is rendered, record it
        this.renderFields[name] = true;

        return inputProps;
      },
      getFieldInstance: function getFieldInstance(name) {
        return this.instances[name];
      },
      getRules: function getRules(fieldMeta, action) {
        var actionRules = fieldMeta.validate.filter(function (item) {
          return !action || item.trigger.indexOf(action) >= 0;
        }).map(function (item) {
          return item.rules;
        });
        return (0, _utils.flattenArray)(actionRules);
      },
      setFields: function setFields(maybeNestedFields, callback) {
        var _this4 = this;

        var fields = this.fieldsStore.flattenRegisteredFields(maybeNestedFields);
        this.fieldsStore.setFields(fields);
        if (onFieldsChange) {
          var changedFields = Object.keys(fields).reduce(function (acc, name) {
            return (0, _set2['default'])(acc, name, _this4.fieldsStore.getField(name));
          }, {});
          onFieldsChange((0, _extends6['default'])((0, _defineProperty3['default'])({}, formPropName, this.getForm()), this.props), changedFields, this.fieldsStore.getNestedAllFields());
        }
        this.forceUpdate(callback);
      },
      setFieldsValue: function setFieldsValue(changedValues, callback) {
        var fieldsMeta = this.fieldsStore.fieldsMeta;

        var values = this.fieldsStore.flattenRegisteredFields(changedValues);
        var newFields = Object.keys(values).reduce(function (acc, name) {
          var isRegistered = fieldsMeta[name];
          if (false) {}
          if (isRegistered) {
            var value = values[name];
            acc[name] = {
              value: value
            };
          }
          return acc;
        }, {});
        this.setFields(newFields, callback);
        if (onValuesChange) {
          var allValues = this.fieldsStore.getAllValues();
          onValuesChange((0, _extends6['default'])((0, _defineProperty3['default'])({}, formPropName, this.getForm()), this.props), changedValues, allValues);
        }
      },
      saveRef: function saveRef(name, _, component) {
        if (!component) {
          var _fieldMeta = this.fieldsStore.getFieldMeta(name);
          if (!_fieldMeta.preserve) {
            // after destroy, delete data
            this.clearedFieldMetaCache[name] = {
              field: this.fieldsStore.getField(name),
              meta: _fieldMeta
            };
            this.clearField(name);
          }
          delete this.domFields[name];
          return;
        }
        this.domFields[name] = true;
        this.recoverClearedField(name);
        var fieldMeta = this.fieldsStore.getFieldMeta(name);
        if (fieldMeta) {
          var ref = fieldMeta.ref;
          if (ref) {
            if (typeof ref === 'string') {
              throw new Error('can not set ref string for ' + name);
            } else if (typeof ref === 'function') {
              ref(component);
            } else if (Object.prototype.hasOwnProperty.call(ref, 'current')) {
              ref.current = component;
            }
          }
        }
        this.instances[name] = component;
      },
      cleanUpUselessFields: function cleanUpUselessFields() {
        var _this5 = this;

        var fieldList = this.fieldsStore.getAllFieldsName();
        var removedList = fieldList.filter(function (field) {
          var fieldMeta = _this5.fieldsStore.getFieldMeta(field);
          return !_this5.renderFields[field] && !_this5.domFields[field] && !fieldMeta.preserve;
        });
        if (removedList.length) {
          removedList.forEach(this.clearField);
        }
        this.renderFields = {};
      },
      clearField: function clearField(name) {
        this.fieldsStore.clearField(name);
        delete this.instances[name];
        delete this.cachedBind[name];
      },
      resetFields: function resetFields(ns) {
        var _this6 = this;

        var newFields = this.fieldsStore.resetFields(ns);
        if (Object.keys(newFields).length > 0) {
          this.setFields(newFields);
        }
        if (ns) {
          var names = Array.isArray(ns) ? ns : [ns];
          names.forEach(function (name) {
            return delete _this6.clearedFieldMetaCache[name];
          });
        } else {
          this.clearedFieldMetaCache = {};
        }
      },
      recoverClearedField: function recoverClearedField(name) {
        if (this.clearedFieldMetaCache[name]) {
          this.fieldsStore.setFields((0, _defineProperty3['default'])({}, name, this.clearedFieldMetaCache[name].field));
          this.fieldsStore.setFieldMeta(name, this.clearedFieldMetaCache[name].meta);
          delete this.clearedFieldMetaCache[name];
        }
      },
      validateFieldsInternal: function validateFieldsInternal(fields, _ref, callback) {
        var _this7 = this;

        var fieldNames = _ref.fieldNames,
            action = _ref.action,
            _ref$options = _ref.options,
            options = _ref$options === undefined ? {} : _ref$options;

        var allRules = {};
        var allValues = {};
        var allFields = {};
        var alreadyErrors = {};
        fields.forEach(function (field) {
          var name = field.name;
          if (options.force !== true && field.dirty === false) {
            if (field.errors) {
              (0, _set2['default'])(alreadyErrors, name, { errors: field.errors });
            }
            return;
          }
          var fieldMeta = _this7.fieldsStore.getFieldMeta(name);
          var newField = (0, _extends6['default'])({}, field);
          newField.errors = undefined;
          newField.validating = true;
          newField.dirty = true;
          allRules[name] = _this7.getRules(fieldMeta, action);
          allValues[name] = newField.value;
          allFields[name] = newField;
        });
        this.setFields(allFields);
        // in case normalize
        Object.keys(allValues).forEach(function (f) {
          allValues[f] = _this7.fieldsStore.getFieldValue(f);
        });
        if (callback && (0, _utils.isEmptyObject)(allFields)) {
          callback((0, _utils.isEmptyObject)(alreadyErrors) ? null : alreadyErrors, this.fieldsStore.getFieldsValue(fieldNames));
          return;
        }
        var validator = new _asyncValidator2['default'](allRules);
        if (validateMessages) {
          validator.messages(validateMessages);
        }
        validator.validate(allValues, options, function (errors) {
          var errorsGroup = (0, _extends6['default'])({}, alreadyErrors);
          if (errors && errors.length) {
            errors.forEach(function (e) {
              var errorFieldName = e.field;
              var fieldName = errorFieldName;

              // Handle using array validation rule.
              // ref: https://github.com/ant-design/ant-design/issues/14275
              Object.keys(allRules).some(function (ruleFieldName) {
                var rules = allRules[ruleFieldName] || [];

                // Exist if match rule
                if (ruleFieldName === errorFieldName) {
                  fieldName = ruleFieldName;
                  return true;
                }

                // Skip if not match array type
                if (rules.every(function (_ref2) {
                  var type = _ref2.type;
                  return type !== 'array';
                }) || errorFieldName.indexOf(ruleFieldName + '.') !== 0) {
                  return false;
                }

                // Exist if match the field name
                var restPath = errorFieldName.slice(ruleFieldName.length + 1);
                if (/^\d+$/.test(restPath)) {
                  fieldName = ruleFieldName;
                  return true;
                }

                return false;
              });

              var field = (0, _get2['default'])(errorsGroup, fieldName);
              if (typeof field !== 'object' || Array.isArray(field)) {
                (0, _set2['default'])(errorsGroup, fieldName, { errors: [] });
              }
              var fieldErrors = (0, _get2['default'])(errorsGroup, fieldName.concat('.errors'));
              fieldErrors.push(e);
            });
          }
          var expired = [];
          var nowAllFields = {};
          Object.keys(allRules).forEach(function (name) {
            var fieldErrors = (0, _get2['default'])(errorsGroup, name);
            var nowField = _this7.fieldsStore.getField(name);
            // avoid concurrency problems
            if (!(0, _eq2['default'])(nowField.value, allValues[name])) {
              expired.push({
                name: name
              });
            } else {
              nowField.errors = fieldErrors && fieldErrors.errors;
              nowField.value = allValues[name];
              nowField.validating = false;
              nowField.dirty = false;
              nowAllFields[name] = nowField;
            }
          });
          _this7.setFields(nowAllFields);
          if (callback) {
            if (expired.length) {
              expired.forEach(function (_ref3) {
                var name = _ref3.name;

                var fieldErrors = [{
                  message: name + ' need to revalidate',
                  field: name
                }];
                (0, _set2['default'])(errorsGroup, name, {
                  expired: true,
                  errors: fieldErrors
                });
              });
            }

            callback((0, _utils.isEmptyObject)(errorsGroup) ? null : errorsGroup, _this7.fieldsStore.getFieldsValue(fieldNames));
          }
        });
      },
      validateFields: function validateFields(ns, opt, cb) {
        var _this8 = this;

        var pending = new Promise(function (resolve, reject) {
          var _getParams = (0, _utils.getParams)(ns, opt, cb),
              names = _getParams.names,
              options = _getParams.options;

          var _getParams2 = (0, _utils.getParams)(ns, opt, cb),
              callback = _getParams2.callback;

          if (!callback || typeof callback === 'function') {
            var oldCb = callback;
            callback = function callback(errors, values) {
              if (oldCb) {
                oldCb(errors, values);
              }
              if (errors) {
                reject({ errors: errors, values: values });
              } else {
                resolve(values);
              }
            };
          }
          var fieldNames = names ? _this8.fieldsStore.getValidFieldsFullName(names) : _this8.fieldsStore.getValidFieldsName();
          var fields = fieldNames.filter(function (name) {
            var fieldMeta = _this8.fieldsStore.getFieldMeta(name);
            return (0, _utils.hasRules)(fieldMeta.validate);
          }).map(function (name) {
            var field = _this8.fieldsStore.getField(name);
            field.value = _this8.fieldsStore.getFieldValue(name);
            return field;
          });
          if (!fields.length) {
            callback(null, _this8.fieldsStore.getFieldsValue(fieldNames));
            return;
          }
          if (!('firstFields' in options)) {
            options.firstFields = fieldNames.filter(function (name) {
              var fieldMeta = _this8.fieldsStore.getFieldMeta(name);
              return !!fieldMeta.validateFirst;
            });
          }
          _this8.validateFieldsInternal(fields, {
            fieldNames: fieldNames,
            options: options
          }, callback);
        });
        pending['catch'](function (e) {
          // eslint-disable-next-line no-console
          if (console.error && "production" !== 'production') {
            // eslint-disable-next-line no-console
            console.error(e);
          }
          return e;
        });
        return pending;
      },
      isSubmitting: function isSubmitting() {
        if (false) {}
        return this.state.submitting;
      },
      submit: function submit(callback) {
        var _this9 = this;

        if (false) {}
        var fn = function fn() {
          _this9.setState({
            submitting: false
          });
        };
        this.setState({
          submitting: true
        });
        callback(fn);
      },
      render: function render() {
        var _props = this.props,
            wrappedComponentRef = _props.wrappedComponentRef,
            restProps = (0, _objectWithoutProperties3['default'])(_props, ['wrappedComponentRef']); // eslint-disable-line

        var formProps = (0, _defineProperty3['default'])({}, formPropName, this.getForm());
        if (withRef) {
          if (false) {}
          formProps.ref = 'wrappedComponent';
        } else if (wrappedComponentRef) {
          formProps.ref = wrappedComponentRef;
        }
        var props = mapProps.call(this, (0, _extends6['default'])({}, formProps, restProps));
        return _react2['default'].createElement(WrappedComponent, props);
      }
    });

    return (0, _utils.argumentContainer)((0, _unsafeLifecyclesPolyfill2['default'])(Form), WrappedComponent);
  };
}

exports['default'] = createBaseForm;
module.exports = exports['default'];

/***/ }),

/***/ 622:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = __webpack_require__(70);

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

/**
 *  Rule for validating required fields.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function required(rule, value, source, errors, options, type) {
  if (rule.required && (!source.hasOwnProperty(rule.field) || util.isEmptyValue(value, type || rule.type))) {
    errors.push(util.format(options.messages.required, rule.fullField));
  }
}

exports['default'] = required;

/***/ }),

/***/ 623:
/***/ (function(module, exports, __webpack_require__) {

var baseSet = __webpack_require__(848);

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

module.exports = set;


/***/ }),

/***/ 624:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(20);

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__(23);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

exports.isFormField = isFormField;
exports["default"] = createFormField;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Field = function Field(fields) {
  (0, _classCallCheck3["default"])(this, Field);

  (0, _extends3["default"])(this, fields);
};

function isFormField(obj) {
  return obj instanceof Field;
}

function createFormField(field) {
  if (isFormField(field)) {
    return field;
  }
  return new Field(field);
}

/***/ }),

/***/ 625:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FIELD_DATA_PROP = exports.FIELD_META_PROP = void 0;
var FIELD_META_PROP = 'data-__meta';
exports.FIELD_META_PROP = FIELD_META_PROP;
var FIELD_DATA_PROP = 'data-__field';
exports.FIELD_DATA_PROP = FIELD_DATA_PROP;
//# sourceMappingURL=constants.js.map


/***/ }),

/***/ 626:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _createReactContext = _interopRequireDefault(__webpack_require__(213));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var FormContext = (0, _createReactContext["default"])({
  labelAlign: 'right',
  vertical: false
});
var _default = FormContext;
exports["default"] = _default;
//# sourceMappingURL=context.js.map


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

/***/ 666:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Typography = _interopRequireDefault(__webpack_require__(1089));

var _Text = _interopRequireDefault(__webpack_require__(1761));

var _Title = _interopRequireDefault(__webpack_require__(1766));

var _Paragraph = _interopRequireDefault(__webpack_require__(1767));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Typography = _Typography["default"];
Typography.Text = _Text["default"];
Typography.Title = _Title["default"];
Typography.Paragraph = _Paragraph["default"];
var _default = Typography;
exports["default"] = _default;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 70:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.convertFieldsError = convertFieldsError;
exports.format = format;
exports.isEmptyValue = isEmptyValue;
exports.isEmptyObject = isEmptyObject;
exports.asyncMap = asyncMap;
exports.complementError = complementError;
exports.deepMerge = deepMerge;
/* eslint no-console:0 */

var formatRegExp = /%[sdj%]/g;

var warning = exports.warning = function warning() {};

// don't print warning message when in production env or node runtime
if (false) {}

function convertFieldsError(errors) {
  if (!errors || !errors.length) return null;
  var fields = {};
  errors.forEach(function (error) {
    var field = error.field;
    fields[field] = fields[field] || [];
    fields[field].push(error);
  });
  return fields;
}

function format() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var i = 1;
  var f = args[0];
  var len = args.length;
  if (typeof f === 'function') {
    return f.apply(null, args.slice(1));
  }
  if (typeof f === 'string') {
    var str = String(f).replace(formatRegExp, function (x) {
      if (x === '%%') {
        return '%';
      }
      if (i >= len) {
        return x;
      }
      switch (x) {
        case '%s':
          return String(args[i++]);
        case '%d':
          return Number(args[i++]);
        case '%j':
          try {
            return JSON.stringify(args[i++]);
          } catch (_) {
            return '[Circular]';
          }
          break;
        default:
          return x;
      }
    });
    for (var arg = args[i]; i < len; arg = args[++i]) {
      str += ' ' + arg;
    }
    return str;
  }
  return f;
}

function isNativeStringType(type) {
  return type === 'string' || type === 'url' || type === 'hex' || type === 'email' || type === 'pattern';
}

function isEmptyValue(value, type) {
  if (value === undefined || value === null) {
    return true;
  }
  if (type === 'array' && Array.isArray(value) && !value.length) {
    return true;
  }
  if (isNativeStringType(type) && typeof value === 'string' && !value) {
    return true;
  }
  return false;
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

function asyncParallelArray(arr, func, callback) {
  var results = [];
  var total = 0;
  var arrLength = arr.length;

  function count(errors) {
    results.push.apply(results, errors);
    total++;
    if (total === arrLength) {
      callback(results);
    }
  }

  arr.forEach(function (a) {
    func(a, count);
  });
}

function asyncSerialArray(arr, func, callback) {
  var index = 0;
  var arrLength = arr.length;

  function next(errors) {
    if (errors && errors.length) {
      callback(errors);
      return;
    }
    var original = index;
    index = index + 1;
    if (original < arrLength) {
      func(arr[original], next);
    } else {
      callback([]);
    }
  }

  next([]);
}

function flattenObjArr(objArr) {
  var ret = [];
  Object.keys(objArr).forEach(function (k) {
    ret.push.apply(ret, objArr[k]);
  });
  return ret;
}

function asyncMap(objArr, option, func, callback) {
  if (option.first) {
    var flattenArr = flattenObjArr(objArr);
    return asyncSerialArray(flattenArr, func, callback);
  }
  var firstFields = option.firstFields || [];
  if (firstFields === true) {
    firstFields = Object.keys(objArr);
  }
  var objArrKeys = Object.keys(objArr);
  var objArrLength = objArrKeys.length;
  var total = 0;
  var results = [];
  var pending = new Promise(function (resolve, reject) {
    var next = function next(errors) {
      results.push.apply(results, errors);
      total++;
      if (total === objArrLength) {
        callback(results);
        return results.length ? reject({ errors: results, fields: convertFieldsError(results) }) : resolve();
      }
    };
    objArrKeys.forEach(function (key) {
      var arr = objArr[key];
      if (firstFields.indexOf(key) !== -1) {
        asyncSerialArray(arr, func, next);
      } else {
        asyncParallelArray(arr, func, next);
      }
    });
  });
  pending['catch'](function (e) {
    return e;
  });
  return pending;
}

function complementError(rule) {
  return function (oe) {
    if (oe && oe.message) {
      oe.field = oe.field || rule.fullField;
      return oe;
    }
    return {
      message: typeof oe === 'function' ? oe() : oe,
      field: oe.field || rule.fullField
    };
  };
}

function deepMerge(target, source) {
  if (source) {
    for (var s in source) {
      if (source.hasOwnProperty(s)) {
        var value = source[s];
        if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && _typeof(target[s]) === 'object') {
          target[s] = _extends({}, target[s], value);
        } else {
          target[s] = value;
        }
      }
    }
  }
  return target;
}

/***/ }),

/***/ 710:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(55);

__webpack_require__(807);
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 711:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 712:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 723:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(__webpack_require__(0));

var _Slider = _interopRequireDefault(__webpack_require__(1746));

var _Range = _interopRequireDefault(__webpack_require__(1756));

var _Handle = _interopRequireDefault(__webpack_require__(1087));

var _tooltip = _interopRequireDefault(__webpack_require__(64));

var _configProvider = __webpack_require__(39);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var Slider =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Slider, _React$Component);

  function Slider(props) {
    var _this;

    _classCallCheck(this, Slider);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Slider).call(this, props));

    _this.toggleTooltipVisible = function (index, visible) {
      _this.setState(function (_ref) {
        var visibles = _ref.visibles;
        return {
          visibles: _extends(_extends({}, visibles), _defineProperty({}, index, visible))
        };
      });
    };

    _this.handleWithTooltip = function (_a) {
      var tooltipPrefixCls = _a.tooltipPrefixCls,
          prefixCls = _a.prefixCls,
          _b = _a.info,
          value = _b.value,
          dragging = _b.dragging,
          index = _b.index,
          restProps = __rest(_b, ["value", "dragging", "index"]);

      var _this$props = _this.props,
          tipFormatter = _this$props.tipFormatter,
          tooltipVisible = _this$props.tooltipVisible,
          tooltipPlacement = _this$props.tooltipPlacement,
          getTooltipPopupContainer = _this$props.getTooltipPopupContainer;
      var visibles = _this.state.visibles;
      var isTipFormatter = tipFormatter ? visibles[index] || dragging : false;
      var visible = tooltipVisible || tooltipVisible === undefined && isTipFormatter;
      return React.createElement(_tooltip["default"], {
        prefixCls: tooltipPrefixCls,
        title: tipFormatter ? tipFormatter(value) : '',
        visible: visible,
        placement: tooltipPlacement || 'top',
        transitionName: "zoom-down",
        key: index,
        overlayClassName: "".concat(prefixCls, "-tooltip"),
        getPopupContainer: getTooltipPopupContainer || function () {
          return document.body;
        }
      }, React.createElement(_Handle["default"], _extends({}, restProps, {
        value: value,
        onMouseEnter: function onMouseEnter() {
          return _this.toggleTooltipVisible(index, true);
        },
        onMouseLeave: function onMouseLeave() {
          return _this.toggleTooltipVisible(index, false);
        }
      })));
    };

    _this.saveSlider = function (node) {
      _this.rcSlider = node;
    };

    _this.renderSlider = function (_ref2) {
      var getPrefixCls = _ref2.getPrefixCls;

      var _a = _this.props,
          customizePrefixCls = _a.prefixCls,
          customizeTooltipPrefixCls = _a.tooltipPrefixCls,
          range = _a.range,
          restProps = __rest(_a, ["prefixCls", "tooltipPrefixCls", "range"]);

      var prefixCls = getPrefixCls('slider', customizePrefixCls);
      var tooltipPrefixCls = getPrefixCls('tooltip', customizeTooltipPrefixCls);

      if (range) {
        return React.createElement(_Range["default"], _extends({}, restProps, {
          ref: _this.saveSlider,
          handle: function handle(info) {
            return _this.handleWithTooltip({
              tooltipPrefixCls: tooltipPrefixCls,
              prefixCls: prefixCls,
              info: info
            });
          },
          prefixCls: prefixCls,
          tooltipPrefixCls: tooltipPrefixCls
        }));
      }

      return React.createElement(_Slider["default"], _extends({}, restProps, {
        ref: _this.saveSlider,
        handle: function handle(info) {
          return _this.handleWithTooltip({
            tooltipPrefixCls: tooltipPrefixCls,
            prefixCls: prefixCls,
            info: info
          });
        },
        prefixCls: prefixCls,
        tooltipPrefixCls: tooltipPrefixCls
      }));
    };

    _this.state = {
      visibles: {}
    };
    return _this;
  }

  _createClass(Slider, [{
    key: "focus",
    value: function focus() {
      this.rcSlider.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      this.rcSlider.blur();
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_configProvider.ConfigConsumer, null, this.renderSlider);
    }
  }]);

  return Slider;
}(React.Component);

exports["default"] = Slider;
Slider.defaultProps = {
  tipFormatter: function tipFormatter(value) {
    return value.toString();
  }
};
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 74:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Form = _interopRequireDefault(__webpack_require__(819));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = _Form["default"];
exports["default"] = _default;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 807:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 808:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 809:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = __webpack_require__(620);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.isEventFromHandle = isEventFromHandle;
exports.isValueOutOfRange = isValueOutOfRange;
exports.isNotTouchEvent = isNotTouchEvent;
exports.getClosestPoint = getClosestPoint;
exports.getPrecision = getPrecision;
exports.getMousePosition = getMousePosition;
exports.getTouchPosition = getTouchPosition;
exports.getHandleCenterPosition = getHandleCenterPosition;
exports.ensureValueInRange = ensureValueInRange;
exports.ensureValuePrecision = ensureValuePrecision;
exports.pauseEvent = pauseEvent;
exports.calculateNextValue = calculateNextValue;
exports.getKeyboardValueMutator = getKeyboardValueMutator;

var _reactDom = __webpack_require__(11);

var _KeyCode = __webpack_require__(407);

var _KeyCode2 = _interopRequireDefault(_KeyCode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function isEventFromHandle(e, handles) {
  try {
    return Object.keys(handles).some(function (key) {
      return e.target === (0, _reactDom.findDOMNode)(handles[key]);
    });
  } catch (error) {
    return false;
  }
}

function isValueOutOfRange(value, _ref) {
  var min = _ref.min,
      max = _ref.max;

  return value < min || value > max;
}

function isNotTouchEvent(e) {
  return e.touches.length > 1 || e.type.toLowerCase() === 'touchend' && e.touches.length > 0;
}

function getClosestPoint(val, _ref2) {
  var marks = _ref2.marks,
      step = _ref2.step,
      min = _ref2.min,
      max = _ref2.max;

  var points = Object.keys(marks).map(parseFloat);
  if (step !== null) {
    var maxSteps = Math.floor((max - min) / step);
    var steps = Math.min((val - min) / step, maxSteps);
    var closestStep = Math.round(steps) * step + min;
    points.push(closestStep);
  }
  var diffs = points.map(function (point) {
    return Math.abs(val - point);
  });
  return points[diffs.indexOf(Math.min.apply(Math, (0, _toConsumableArray3['default'])(diffs)))];
}

function getPrecision(step) {
  var stepString = step.toString();
  var precision = 0;
  if (stepString.indexOf('.') >= 0) {
    precision = stepString.length - stepString.indexOf('.') - 1;
  }
  return precision;
}

function getMousePosition(vertical, e) {
  return vertical ? e.clientY : e.pageX;
}

function getTouchPosition(vertical, e) {
  return vertical ? e.touches[0].clientY : e.touches[0].pageX;
}

function getHandleCenterPosition(vertical, handle) {
  var coords = handle.getBoundingClientRect();
  return vertical ? coords.top + coords.height * 0.5 : window.pageXOffset + coords.left + coords.width * 0.5;
}

function ensureValueInRange(val, _ref3) {
  var max = _ref3.max,
      min = _ref3.min;

  if (val <= min) {
    return min;
  }
  if (val >= max) {
    return max;
  }
  return val;
}

function ensureValuePrecision(val, props) {
  var step = props.step;

  var closestPoint = isFinite(getClosestPoint(val, props)) ? getClosestPoint(val, props) : 0; // eslint-disable-line
  return step === null ? closestPoint : parseFloat(closestPoint.toFixed(getPrecision(step)));
}

function pauseEvent(e) {
  e.stopPropagation();
  e.preventDefault();
}

function calculateNextValue(func, value, props) {
  var operations = {
    increase: function increase(a, b) {
      return a + b;
    },
    decrease: function decrease(a, b) {
      return a - b;
    }
  };

  var indexToGet = operations[func](Object.keys(props.marks).indexOf(JSON.stringify(value)), 1);
  var keyToGet = Object.keys(props.marks)[indexToGet];

  if (props.step) {
    return operations[func](value, props.step);
  } else if (!!Object.keys(props.marks).length && !!props.marks[keyToGet]) {
    return props.marks[keyToGet];
  }
  return value;
}

function getKeyboardValueMutator(e, vertical, reverse) {
  var increase = 'increase';
  var decrease = 'decrease';
  var method = increase;
  switch (e.keyCode) {
    case _KeyCode2['default'].UP:
      method = vertical && reverse ? decrease : increase;break;
    case _KeyCode2['default'].RIGHT:
      method = !vertical && reverse ? decrease : increase;break;
    case _KeyCode2['default'].DOWN:
      method = vertical && reverse ? increase : decrease;break;
    case _KeyCode2['default'].LEFT:
      method = !vertical && reverse ? increase : decrease;break;

    case _KeyCode2['default'].END:
      return function (value, props) {
        return props.max;
      };
    case _KeyCode2['default'].HOME:
      return function (value, props) {
        return props.min;
      };
    case _KeyCode2['default'].PAGE_UP:
      return function (value, props) {
        return value + props.step * 2;
      };
    case _KeyCode2['default'].PAGE_DOWN:
      return function (value, props) {
        return value - props.step * 2;
      };

    default:
      return undefined;
  }
  return function (value, props) {
    return calculateNextValue(method, value, props);
  };
}

/***/ }),

/***/ 810:
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(811), __esModule: true };

/***/ }),

/***/ 811:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(763);
__webpack_require__(812);
module.exports = __webpack_require__(177).Array.from;


/***/ }),

/***/ 812:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(686);
var $export = __webpack_require__(286);
var toObject = __webpack_require__(438);
var call = __webpack_require__(813);
var isArrayIter = __webpack_require__(814);
var toLength = __webpack_require__(757);
var createProperty = __webpack_require__(815);
var getIterFn = __webpack_require__(816);

$export($export.S + $export.F * !__webpack_require__(818)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),

/***/ 813:
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(398);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ 814:
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(401);
var ITERATOR = __webpack_require__(187)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ 815:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(287);
var createDesc = __webpack_require__(437);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),

/***/ 816:
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(817);
var ITERATOR = __webpack_require__(187)('iterator');
var Iterators = __webpack_require__(401);
module.exports = __webpack_require__(177).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ 817:
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(688);
var TAG = __webpack_require__(187)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ 818:
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(187)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ 819:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(__webpack_require__(0));

var PropTypes = _interopRequireWildcard(__webpack_require__(1));

var _classnames = _interopRequireDefault(__webpack_require__(8));

var _createDOMForm = _interopRequireDefault(__webpack_require__(820));

var _createFormField = _interopRequireDefault(__webpack_require__(624));

var _omit = _interopRequireDefault(__webpack_require__(97));

var _configProvider = __webpack_require__(39);

var _type = __webpack_require__(188);

var _warning = _interopRequireDefault(__webpack_require__(91));

var _FormItem = _interopRequireDefault(__webpack_require__(852));

var _constants = __webpack_require__(625);

var _context = _interopRequireDefault(__webpack_require__(626));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var FormLayouts = (0, _type.tuple)('horizontal', 'inline', 'vertical');

var Form =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Form, _React$Component);

  function Form(props) {
    var _this;

    _classCallCheck(this, Form);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Form).call(this, props));

    _this.renderForm = function (_ref) {
      var _classNames;

      var getPrefixCls = _ref.getPrefixCls;
      var _this$props = _this.props,
          customizePrefixCls = _this$props.prefixCls,
          hideRequiredMark = _this$props.hideRequiredMark,
          _this$props$className = _this$props.className,
          className = _this$props$className === void 0 ? '' : _this$props$className,
          layout = _this$props.layout;
      var prefixCls = getPrefixCls('form', customizePrefixCls);
      var formClassName = (0, _classnames["default"])(prefixCls, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-horizontal"), layout === 'horizontal'), _defineProperty(_classNames, "".concat(prefixCls, "-vertical"), layout === 'vertical'), _defineProperty(_classNames, "".concat(prefixCls, "-inline"), layout === 'inline'), _defineProperty(_classNames, "".concat(prefixCls, "-hide-required-mark"), hideRequiredMark), _classNames), className);
      var formProps = (0, _omit["default"])(_this.props, ['prefixCls', 'className', 'layout', 'form', 'hideRequiredMark', 'wrapperCol', 'labelAlign', 'labelCol', 'colon']);
      return React.createElement("form", _extends({}, formProps, {
        className: formClassName
      }));
    };

    (0, _warning["default"])(!props.form, 'Form', 'It is unnecessary to pass `form` to `Form` after antd@1.7.0.');
    return _this;
  }

  _createClass(Form, [{
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          wrapperCol = _this$props2.wrapperCol,
          labelAlign = _this$props2.labelAlign,
          labelCol = _this$props2.labelCol,
          layout = _this$props2.layout,
          colon = _this$props2.colon;
      return React.createElement(_context["default"].Provider, {
        value: {
          wrapperCol: wrapperCol,
          labelAlign: labelAlign,
          labelCol: labelCol,
          vertical: layout === 'vertical',
          colon: colon
        }
      }, React.createElement(_configProvider.ConfigConsumer, null, this.renderForm));
    }
  }]);

  return Form;
}(React.Component);

exports["default"] = Form;
Form.defaultProps = {
  colon: true,
  layout: 'horizontal',
  hideRequiredMark: false,
  onSubmit: function onSubmit(e) {
    e.preventDefault();
  }
};
Form.propTypes = {
  prefixCls: PropTypes.string,
  layout: PropTypes.oneOf(FormLayouts),
  children: PropTypes.any,
  onSubmit: PropTypes.func,
  hideRequiredMark: PropTypes.bool,
  colon: PropTypes.bool
};
Form.Item = _FormItem["default"];
Form.createFormField = _createFormField["default"];

Form.create = function create() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _createDOMForm["default"])(_extends(_extends({
    fieldNameProp: 'id'
  }, options), {
    fieldMetaProp: _constants.FIELD_META_PROP,
    fieldDataProp: _constants.FIELD_DATA_PROP
  }));
};
//# sourceMappingURL=Form.js.map


/***/ }),

/***/ 820:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(20);

var _extends3 = _interopRequireDefault(_extends2);

var _reactDom = __webpack_require__(11);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _domScrollIntoView = __webpack_require__(362);

var _domScrollIntoView2 = _interopRequireDefault(_domScrollIntoView);

var _has = __webpack_require__(821);

var _has2 = _interopRequireDefault(_has);

var _createBaseForm = __webpack_require__(621);

var _createBaseForm2 = _interopRequireDefault(_createBaseForm);

var _createForm = __webpack_require__(851);

var _utils = __webpack_require__(409);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function computedStyle(el, prop) {
  var getComputedStyle = window.getComputedStyle;
  var style =
  // If we have getComputedStyle
  getComputedStyle ?
  // Query it
  // TODO: From CSS-Query notes, we might need (node, null) for FF
  getComputedStyle(el) :

  // Otherwise, we are in IE and use currentStyle
  el.currentStyle;
  if (style) {
    return style[
    // Switch to camelCase for CSSOM
    // DEV: Grabbed from jQuery
    // https://github.com/jquery/jquery/blob/1.9-stable/src/css.js#L191-L194
    // https://github.com/jquery/jquery/blob/1.9-stable/src/core.js#L593-L597
    prop.replace(/-(\w)/gi, function (word, letter) {
      return letter.toUpperCase();
    })];
  }
  return undefined;
}

function getScrollableContainer(n) {
  var node = n;
  var nodeName = void 0;
  /* eslint no-cond-assign:0 */
  while ((nodeName = node.nodeName.toLowerCase()) !== 'body') {
    var overflowY = computedStyle(node, 'overflowY');
    // https://stackoverflow.com/a/36900407/3040605
    if (node !== n && (overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
      return node;
    }
    node = node.parentNode;
  }
  return nodeName === 'body' ? node.ownerDocument : node;
}

var mixin = {
  getForm: function getForm() {
    return (0, _extends3['default'])({}, _createForm.mixin.getForm.call(this), {
      validateFieldsAndScroll: this.validateFieldsAndScroll
    });
  },
  validateFieldsAndScroll: function validateFieldsAndScroll(ns, opt, cb) {
    var _this = this;

    var _getParams = (0, _utils.getParams)(ns, opt, cb),
        names = _getParams.names,
        callback = _getParams.callback,
        options = _getParams.options;

    var newCb = function newCb(error, values) {
      if (error) {
        var validNames = _this.fieldsStore.getValidFieldsName();
        var firstNode = void 0;
        var firstTop = void 0;

        validNames.forEach(function (name) {
          if ((0, _has2['default'])(error, name)) {
            var instance = _this.getFieldInstance(name);
            if (instance) {
              var node = _reactDom2['default'].findDOMNode(instance);
              var top = node.getBoundingClientRect().top;
              if (node.type !== 'hidden' && (firstTop === undefined || firstTop > top)) {
                firstTop = top;
                firstNode = node;
              }
            }
          }
        });

        if (firstNode) {
          var c = options.container || getScrollableContainer(firstNode);
          (0, _domScrollIntoView2['default'])(firstNode, c, (0, _extends3['default'])({
            onlyScrollIfNeeded: true
          }, options.scroll));
        }
      }

      if (typeof callback === 'function') {
        callback(error, values);
      }
    };

    return this.validateFields(names, options, newCb);
  }
};

function createDOMForm(option) {
  return (0, _createBaseForm2['default'])((0, _extends3['default'])({}, option), [mixin]);
}

exports['default'] = createDOMForm;
module.exports = exports['default'];

/***/ }),

/***/ 821:
/***/ (function(module, exports, __webpack_require__) {

var baseHas = __webpack_require__(822),
    hasPath = __webpack_require__(798);

/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && hasPath(object, path, baseHas);
}

module.exports = has;


/***/ }),

/***/ 822:
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  return object != null && hasOwnProperty.call(object, key);
}

module.exports = baseHas;


/***/ }),

/***/ 823:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var React = __webpack_require__(0);
var factory = __webpack_require__(824);

if (typeof React === 'undefined') {
  throw Error(
    'create-react-class could not find the React object. If you are using script tags, ' +
      'make sure that React is being loaded before create-react-class.'
  );
}

// Hack to grab NoopUpdateQueue from isomorphic React
var ReactNoopUpdateQueue = new React.Component().updater;

module.exports = factory(
  React.Component,
  React.isValidElement,
  ReactNoopUpdateQueue
);


/***/ }),

/***/ 824:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var _assign = __webpack_require__(101);

// -- Inlined from fbjs --

var emptyObject = {};

if (false) {}

var validateFormat = function validateFormat(format) {};

if (false) {}

function _invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

var warning = function(){};

if (false) { var printWarning; }

// /-- Inlined from fbjs --

var MIXINS_KEY = 'mixins';

// Helper function to allow the creation of anonymous functions which do not
// have .name set to the name of the variable being assigned to.
function identity(fn) {
  return fn;
}

var ReactPropTypeLocationNames;
if (false) {} else {
  ReactPropTypeLocationNames = {};
}

function factory(ReactComponent, isValidElement, ReactNoopUpdateQueue) {
  /**
   * Policies that describe methods in `ReactClassInterface`.
   */

  var injectedMixins = [];

  /**
   * Composite components are higher-level components that compose other composite
   * or host components.
   *
   * To create a new type of `ReactClass`, pass a specification of
   * your new class to `React.createClass`. The only requirement of your class
   * specification is that you implement a `render` method.
   *
   *   var MyComponent = React.createClass({
   *     render: function() {
   *       return <div>Hello World</div>;
   *     }
   *   });
   *
   * The class specification supports a specific protocol of methods that have
   * special meaning (e.g. `render`). See `ReactClassInterface` for
   * more the comprehensive protocol. Any other properties and methods in the
   * class specification will be available on the prototype.
   *
   * @interface ReactClassInterface
   * @internal
   */
  var ReactClassInterface = {
    /**
     * An array of Mixin objects to include when defining your component.
     *
     * @type {array}
     * @optional
     */
    mixins: 'DEFINE_MANY',

    /**
     * An object containing properties and methods that should be defined on
     * the component's constructor instead of its prototype (static methods).
     *
     * @type {object}
     * @optional
     */
    statics: 'DEFINE_MANY',

    /**
     * Definition of prop types for this component.
     *
     * @type {object}
     * @optional
     */
    propTypes: 'DEFINE_MANY',

    /**
     * Definition of context types for this component.
     *
     * @type {object}
     * @optional
     */
    contextTypes: 'DEFINE_MANY',

    /**
     * Definition of context types this component sets for its children.
     *
     * @type {object}
     * @optional
     */
    childContextTypes: 'DEFINE_MANY',

    // ==== Definition methods ====

    /**
     * Invoked when the component is mounted. Values in the mapping will be set on
     * `this.props` if that prop is not specified (i.e. using an `in` check).
     *
     * This method is invoked before `getInitialState` and therefore cannot rely
     * on `this.state` or use `this.setState`.
     *
     * @return {object}
     * @optional
     */
    getDefaultProps: 'DEFINE_MANY_MERGED',

    /**
     * Invoked once before the component is mounted. The return value will be used
     * as the initial value of `this.state`.
     *
     *   getInitialState: function() {
     *     return {
     *       isOn: false,
     *       fooBaz: new BazFoo()
     *     }
     *   }
     *
     * @return {object}
     * @optional
     */
    getInitialState: 'DEFINE_MANY_MERGED',

    /**
     * @return {object}
     * @optional
     */
    getChildContext: 'DEFINE_MANY_MERGED',

    /**
     * Uses props from `this.props` and state from `this.state` to render the
     * structure of the component.
     *
     * No guarantees are made about when or how often this method is invoked, so
     * it must not have side effects.
     *
     *   render: function() {
     *     var name = this.props.name;
     *     return <div>Hello, {name}!</div>;
     *   }
     *
     * @return {ReactComponent}
     * @required
     */
    render: 'DEFINE_ONCE',

    // ==== Delegate methods ====

    /**
     * Invoked when the component is initially created and about to be mounted.
     * This may have side effects, but any external subscriptions or data created
     * by this method must be cleaned up in `componentWillUnmount`.
     *
     * @optional
     */
    componentWillMount: 'DEFINE_MANY',

    /**
     * Invoked when the component has been mounted and has a DOM representation.
     * However, there is no guarantee that the DOM node is in the document.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been mounted (initialized and rendered) for the first time.
     *
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidMount: 'DEFINE_MANY',

    /**
     * Invoked before the component receives new props.
     *
     * Use this as an opportunity to react to a prop transition by updating the
     * state using `this.setState`. Current props are accessed via `this.props`.
     *
     *   componentWillReceiveProps: function(nextProps, nextContext) {
     *     this.setState({
     *       likesIncreasing: nextProps.likeCount > this.props.likeCount
     *     });
     *   }
     *
     * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
     * transition may cause a state change, but the opposite is not true. If you
     * need it, you are probably looking for `componentWillUpdate`.
     *
     * @param {object} nextProps
     * @optional
     */
    componentWillReceiveProps: 'DEFINE_MANY',

    /**
     * Invoked while deciding if the component should be updated as a result of
     * receiving new props, state and/or context.
     *
     * Use this as an opportunity to `return false` when you're certain that the
     * transition to the new props/state/context will not require a component
     * update.
     *
     *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
     *     return !equal(nextProps, this.props) ||
     *       !equal(nextState, this.state) ||
     *       !equal(nextContext, this.context);
     *   }
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @return {boolean} True if the component should update.
     * @optional
     */
    shouldComponentUpdate: 'DEFINE_ONCE',

    /**
     * Invoked when the component is about to update due to a transition from
     * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
     * and `nextContext`.
     *
     * Use this as an opportunity to perform preparation before an update occurs.
     *
     * NOTE: You **cannot** use `this.setState()` in this method.
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @param {ReactReconcileTransaction} transaction
     * @optional
     */
    componentWillUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component's DOM representation has been updated.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been updated.
     *
     * @param {object} prevProps
     * @param {?object} prevState
     * @param {?object} prevContext
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component is about to be removed from its parent and have
     * its DOM representation destroyed.
     *
     * Use this as an opportunity to deallocate any external resources.
     *
     * NOTE: There is no `componentDidUnmount` since your component will have been
     * destroyed by that point.
     *
     * @optional
     */
    componentWillUnmount: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillMount`.
     *
     * @optional
     */
    UNSAFE_componentWillMount: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillReceiveProps`.
     *
     * @optional
     */
    UNSAFE_componentWillReceiveProps: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillUpdate`.
     *
     * @optional
     */
    UNSAFE_componentWillUpdate: 'DEFINE_MANY',

    // ==== Advanced methods ====

    /**
     * Updates the component's currently mounted DOM representation.
     *
     * By default, this implements React's rendering and reconciliation algorithm.
     * Sophisticated clients may wish to override this.
     *
     * @param {ReactReconcileTransaction} transaction
     * @internal
     * @overridable
     */
    updateComponent: 'OVERRIDE_BASE'
  };

  /**
   * Similar to ReactClassInterface but for static methods.
   */
  var ReactClassStaticInterface = {
    /**
     * This method is invoked after a component is instantiated and when it
     * receives new props. Return an object to update state in response to
     * prop changes. Return null to indicate no change to state.
     *
     * If an object is returned, its keys will be merged into the existing state.
     *
     * @return {object || null}
     * @optional
     */
    getDerivedStateFromProps: 'DEFINE_MANY_MERGED'
  };

  /**
   * Mapping from class specification keys to special processing functions.
   *
   * Although these are declared like instance properties in the specification
   * when defining classes using `React.createClass`, they are actually static
   * and are accessible on the constructor instead of the prototype. Despite
   * being static, they must be defined outside of the "statics" key under
   * which all other static methods are defined.
   */
  var RESERVED_SPEC_KEYS = {
    displayName: function(Constructor, displayName) {
      Constructor.displayName = displayName;
    },
    mixins: function(Constructor, mixins) {
      if (mixins) {
        for (var i = 0; i < mixins.length; i++) {
          mixSpecIntoComponent(Constructor, mixins[i]);
        }
      }
    },
    childContextTypes: function(Constructor, childContextTypes) {
      if (false) {}
      Constructor.childContextTypes = _assign(
        {},
        Constructor.childContextTypes,
        childContextTypes
      );
    },
    contextTypes: function(Constructor, contextTypes) {
      if (false) {}
      Constructor.contextTypes = _assign(
        {},
        Constructor.contextTypes,
        contextTypes
      );
    },
    /**
     * Special case getDefaultProps which should move into statics but requires
     * automatic merging.
     */
    getDefaultProps: function(Constructor, getDefaultProps) {
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps = createMergedResultFunction(
          Constructor.getDefaultProps,
          getDefaultProps
        );
      } else {
        Constructor.getDefaultProps = getDefaultProps;
      }
    },
    propTypes: function(Constructor, propTypes) {
      if (false) {}
      Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
    },
    statics: function(Constructor, statics) {
      mixStaticSpecIntoComponent(Constructor, statics);
    },
    autobind: function() {}
  };

  function validateTypeDef(Constructor, typeDef, location) {
    for (var propName in typeDef) {
      if (typeDef.hasOwnProperty(propName)) {
        // use a warning instead of an _invariant so components
        // don't show up in prod but only in __DEV__
        if (false) {}
      }
    }
  }

  function validateMethodOverride(isAlreadyDefined, name) {
    var specPolicy = ReactClassInterface.hasOwnProperty(name)
      ? ReactClassInterface[name]
      : null;

    // Disallow overriding of base class methods unless explicitly allowed.
    if (ReactClassMixin.hasOwnProperty(name)) {
      _invariant(
        specPolicy === 'OVERRIDE_BASE',
        'ReactClassInterface: You are attempting to override ' +
          '`%s` from your class specification. Ensure that your method names ' +
          'do not overlap with React methods.',
        name
      );
    }

    // Disallow defining methods more than once unless explicitly allowed.
    if (isAlreadyDefined) {
      _invariant(
        specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED',
        'ReactClassInterface: You are attempting to define ' +
          '`%s` on your component more than once. This conflict may be due ' +
          'to a mixin.',
        name
      );
    }
  }

  /**
   * Mixin helper which handles policy validation and reserved
   * specification keys when building React classes.
   */
  function mixSpecIntoComponent(Constructor, spec) {
    if (!spec) {
      if (false) { var isMixinValid, typeofSpec; }

      return;
    }

    _invariant(
      typeof spec !== 'function',
      "ReactClass: You're attempting to " +
        'use a component class or function as a mixin. Instead, just use a ' +
        'regular object.'
    );
    _invariant(
      !isValidElement(spec),
      "ReactClass: You're attempting to " +
        'use a component as a mixin. Instead, just use a regular object.'
    );

    var proto = Constructor.prototype;
    var autoBindPairs = proto.__reactAutoBindPairs;

    // By handling mixins before any other properties, we ensure the same
    // chaining order is applied to methods with DEFINE_MANY policy, whether
    // mixins are listed before or after these methods in the spec.
    if (spec.hasOwnProperty(MIXINS_KEY)) {
      RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
    }

    for (var name in spec) {
      if (!spec.hasOwnProperty(name)) {
        continue;
      }

      if (name === MIXINS_KEY) {
        // We have already handled mixins in a special case above.
        continue;
      }

      var property = spec[name];
      var isAlreadyDefined = proto.hasOwnProperty(name);
      validateMethodOverride(isAlreadyDefined, name);

      if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
        RESERVED_SPEC_KEYS[name](Constructor, property);
      } else {
        // Setup methods on prototype:
        // The following member methods should not be automatically bound:
        // 1. Expected ReactClass methods (in the "interface").
        // 2. Overridden methods (that were mixed in).
        var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
        var isFunction = typeof property === 'function';
        var shouldAutoBind =
          isFunction &&
          !isReactClassMethod &&
          !isAlreadyDefined &&
          spec.autobind !== false;

        if (shouldAutoBind) {
          autoBindPairs.push(name, property);
          proto[name] = property;
        } else {
          if (isAlreadyDefined) {
            var specPolicy = ReactClassInterface[name];

            // These cases should already be caught by validateMethodOverride.
            _invariant(
              isReactClassMethod &&
                (specPolicy === 'DEFINE_MANY_MERGED' ||
                  specPolicy === 'DEFINE_MANY'),
              'ReactClass: Unexpected spec policy %s for key %s ' +
                'when mixing in component specs.',
              specPolicy,
              name
            );

            // For methods which are defined more than once, call the existing
            // methods before calling the new property, merging if appropriate.
            if (specPolicy === 'DEFINE_MANY_MERGED') {
              proto[name] = createMergedResultFunction(proto[name], property);
            } else if (specPolicy === 'DEFINE_MANY') {
              proto[name] = createChainedFunction(proto[name], property);
            }
          } else {
            proto[name] = property;
            if (false) {}
          }
        }
      }
    }
  }

  function mixStaticSpecIntoComponent(Constructor, statics) {
    if (!statics) {
      return;
    }

    for (var name in statics) {
      var property = statics[name];
      if (!statics.hasOwnProperty(name)) {
        continue;
      }

      var isReserved = name in RESERVED_SPEC_KEYS;
      _invariant(
        !isReserved,
        'ReactClass: You are attempting to define a reserved ' +
          'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' +
          'as an instance property instead; it will still be accessible on the ' +
          'constructor.',
        name
      );

      var isAlreadyDefined = name in Constructor;
      if (isAlreadyDefined) {
        var specPolicy = ReactClassStaticInterface.hasOwnProperty(name)
          ? ReactClassStaticInterface[name]
          : null;

        _invariant(
          specPolicy === 'DEFINE_MANY_MERGED',
          'ReactClass: You are attempting to define ' +
            '`%s` on your component more than once. This conflict may be ' +
            'due to a mixin.',
          name
        );

        Constructor[name] = createMergedResultFunction(Constructor[name], property);

        return;
      }

      Constructor[name] = property;
    }
  }

  /**
   * Merge two objects, but throw if both contain the same key.
   *
   * @param {object} one The first object, which is mutated.
   * @param {object} two The second object
   * @return {object} one after it has been mutated to contain everything in two.
   */
  function mergeIntoWithNoDuplicateKeys(one, two) {
    _invariant(
      one && two && typeof one === 'object' && typeof two === 'object',
      'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.'
    );

    for (var key in two) {
      if (two.hasOwnProperty(key)) {
        _invariant(
          one[key] === undefined,
          'mergeIntoWithNoDuplicateKeys(): ' +
            'Tried to merge two objects with the same key: `%s`. This conflict ' +
            'may be due to a mixin; in particular, this may be caused by two ' +
            'getInitialState() or getDefaultProps() methods returning objects ' +
            'with clashing keys.',
          key
        );
        one[key] = two[key];
      }
    }
    return one;
  }

  /**
   * Creates a function that invokes two functions and merges their return values.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createMergedResultFunction(one, two) {
    return function mergedResult() {
      var a = one.apply(this, arguments);
      var b = two.apply(this, arguments);
      if (a == null) {
        return b;
      } else if (b == null) {
        return a;
      }
      var c = {};
      mergeIntoWithNoDuplicateKeys(c, a);
      mergeIntoWithNoDuplicateKeys(c, b);
      return c;
    };
  }

  /**
   * Creates a function that invokes two functions and ignores their return vales.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createChainedFunction(one, two) {
    return function chainedFunction() {
      one.apply(this, arguments);
      two.apply(this, arguments);
    };
  }

  /**
   * Binds a method to the component.
   *
   * @param {object} component Component whose method is going to be bound.
   * @param {function} method Method to be bound.
   * @return {function} The bound method.
   */
  function bindAutoBindMethod(component, method) {
    var boundMethod = method.bind(component);
    if (false) { var _bind, componentName; }
    return boundMethod;
  }

  /**
   * Binds all auto-bound methods in a component.
   *
   * @param {object} component Component whose method is going to be bound.
   */
  function bindAutoBindMethods(component) {
    var pairs = component.__reactAutoBindPairs;
    for (var i = 0; i < pairs.length; i += 2) {
      var autoBindKey = pairs[i];
      var method = pairs[i + 1];
      component[autoBindKey] = bindAutoBindMethod(component, method);
    }
  }

  var IsMountedPreMixin = {
    componentDidMount: function() {
      this.__isMounted = true;
    }
  };

  var IsMountedPostMixin = {
    componentWillUnmount: function() {
      this.__isMounted = false;
    }
  };

  /**
   * Add more to the ReactClass base class. These are all legacy features and
   * therefore not already part of the modern ReactComponent.
   */
  var ReactClassMixin = {
    /**
     * TODO: This will be deprecated because state should always keep a consistent
     * type signature and the only use case for this, is to avoid that.
     */
    replaceState: function(newState, callback) {
      this.updater.enqueueReplaceState(this, newState, callback);
    },

    /**
     * Checks whether or not this composite component is mounted.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function() {
      if (false) {}
      return !!this.__isMounted;
    }
  };

  var ReactClassComponent = function() {};
  _assign(
    ReactClassComponent.prototype,
    ReactComponent.prototype,
    ReactClassMixin
  );

  /**
   * Creates a composite component class given a class specification.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */
  function createClass(spec) {
    // To keep our warnings more understandable, we'll use a little hack here to
    // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
    // unnecessarily identify a class without displayName as 'Constructor'.
    var Constructor = identity(function(props, context, updater) {
      // This constructor gets overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted.

      if (false) {}

      // Wire up auto-binding
      if (this.__reactAutoBindPairs.length) {
        bindAutoBindMethods(this);
      }

      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;

      this.state = null;

      // ReactClasses doesn't have constructors. Instead, they use the
      // getInitialState and componentWillMount methods for initialization.

      var initialState = this.getInitialState ? this.getInitialState() : null;
      if (false) {}
      _invariant(
        typeof initialState === 'object' && !Array.isArray(initialState),
        '%s.getInitialState(): must return an object or null',
        Constructor.displayName || 'ReactCompositeComponent'
      );

      this.state = initialState;
    });
    Constructor.prototype = new ReactClassComponent();
    Constructor.prototype.constructor = Constructor;
    Constructor.prototype.__reactAutoBindPairs = [];

    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

    mixSpecIntoComponent(Constructor, IsMountedPreMixin);
    mixSpecIntoComponent(Constructor, spec);
    mixSpecIntoComponent(Constructor, IsMountedPostMixin);

    // Initialize the defaultProps property after all mixins have been merged.
    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }

    if (false) {}

    _invariant(
      Constructor.prototype.render,
      'createClass(...): Class specification must implement a `render` method.'
    );

    if (false) {}

    // Reduce time spent doing lookups by setting these on the prototype.
    for (var methodName in ReactClassInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    return Constructor;
  }

  return createClass;
}

module.exports = factory;


/***/ }),

/***/ 825:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(__webpack_require__(0));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var unsafeLifecyclesPolyfill = function unsafeLifecyclesPolyfill(Component) {
  var prototype = Component.prototype;

  if (!prototype || !prototype.isReactComponent) {
    throw new Error('Can only polyfill class components');
  } // only handle componentWillReceiveProps


  if (typeof prototype.componentWillReceiveProps !== 'function') {
    return Component;
  } // In React 16.9, React.Profiler was introduced together with UNSAFE_componentWillReceiveProps
  // https://reactjs.org/blog/2019/08/08/react-v16.9.0.html#performance-measurements-with-reactprofiler


  if (!_react.default.Profiler) {
    return Component;
  } // Here polyfill get started


  prototype.UNSAFE_componentWillReceiveProps = prototype.componentWillReceiveProps;
  delete prototype.componentWillReceiveProps;
  return Component;
};

var _default = unsafeLifecyclesPolyfill;
exports.default = _default;

/***/ }),

/***/ 826:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _util = __webpack_require__(70);

var _validator = __webpack_require__(827);

var _validator2 = _interopRequireDefault(_validator);

var _messages2 = __webpack_require__(847);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 *  Encapsulates a validation schema.
 *
 *  @param descriptor An object declaring validation rules
 *  for this schema.
 */
function Schema(descriptor) {
  this.rules = null;
  this._messages = _messages2.messages;
  this.define(descriptor);
}

Schema.prototype = {
  messages: function messages(_messages) {
    if (_messages) {
      this._messages = (0, _util.deepMerge)((0, _messages2.newMessages)(), _messages);
    }
    return this._messages;
  },
  define: function define(rules) {
    if (!rules) {
      throw new Error('Cannot configure a schema with no rules');
    }
    if ((typeof rules === 'undefined' ? 'undefined' : _typeof(rules)) !== 'object' || Array.isArray(rules)) {
      throw new Error('Rules must be an object');
    }
    this.rules = {};
    var z = void 0;
    var item = void 0;
    for (z in rules) {
      if (rules.hasOwnProperty(z)) {
        item = rules[z];
        this.rules[z] = Array.isArray(item) ? item : [item];
      }
    }
  },
  validate: function validate(source_) {
    var _this = this;

    var o = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var oc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

    var source = source_;
    var options = o;
    var callback = oc;
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    if (!this.rules || Object.keys(this.rules).length === 0) {
      if (callback) {
        callback();
      }
      return Promise.resolve();
    }

    function complete(results) {
      var i = void 0;
      var errors = [];
      var fields = {};

      function add(e) {
        if (Array.isArray(e)) {
          var _errors;

          errors = (_errors = errors).concat.apply(_errors, e);
        } else {
          errors.push(e);
        }
      }

      for (i = 0; i < results.length; i++) {
        add(results[i]);
      }
      if (!errors.length) {
        errors = null;
        fields = null;
      } else {
        fields = (0, _util.convertFieldsError)(errors);
      }
      callback(errors, fields);
    }

    if (options.messages) {
      var messages = this.messages();
      if (messages === _messages2.messages) {
        messages = (0, _messages2.newMessages)();
      }
      (0, _util.deepMerge)(messages, options.messages);
      options.messages = messages;
    } else {
      options.messages = this.messages();
    }
    var arr = void 0;
    var value = void 0;
    var series = {};
    var keys = options.keys || Object.keys(this.rules);
    keys.forEach(function (z) {
      arr = _this.rules[z];
      value = source[z];
      arr.forEach(function (r) {
        var rule = r;
        if (typeof rule.transform === 'function') {
          if (source === source_) {
            source = _extends({}, source);
          }
          value = source[z] = rule.transform(value);
        }
        if (typeof rule === 'function') {
          rule = {
            validator: rule
          };
        } else {
          rule = _extends({}, rule);
        }
        rule.validator = _this.getValidationMethod(rule);
        rule.field = z;
        rule.fullField = rule.fullField || z;
        rule.type = _this.getType(rule);
        if (!rule.validator) {
          return;
        }
        series[z] = series[z] || [];
        series[z].push({
          rule: rule,
          value: value,
          source: source,
          field: z
        });
      });
    });
    var errorFields = {};
    return (0, _util.asyncMap)(series, options, function (data, doIt) {
      var rule = data.rule;
      var deep = (rule.type === 'object' || rule.type === 'array') && (_typeof(rule.fields) === 'object' || _typeof(rule.defaultField) === 'object');
      deep = deep && (rule.required || !rule.required && data.value);
      rule.field = data.field;

      function addFullfield(key, schema) {
        return _extends({}, schema, {
          fullField: rule.fullField + '.' + key
        });
      }

      function cb() {
        var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        var errors = e;
        if (!Array.isArray(errors)) {
          errors = [errors];
        }
        if (!options.suppressWarning && errors.length) {
          Schema.warning('async-validator:', errors);
        }
        if (errors.length && rule.message) {
          errors = [].concat(rule.message);
        }

        errors = errors.map((0, _util.complementError)(rule));

        if (options.first && errors.length) {
          errorFields[rule.field] = 1;
          return doIt(errors);
        }
        if (!deep) {
          doIt(errors);
        } else {
          // if rule is required but the target object
          // does not exist fail at the rule level and don't
          // go deeper
          if (rule.required && !data.value) {
            if (rule.message) {
              errors = [].concat(rule.message).map((0, _util.complementError)(rule));
            } else if (options.error) {
              errors = [options.error(rule, (0, _util.format)(options.messages.required, rule.field))];
            } else {
              errors = [];
            }
            return doIt(errors);
          }

          var fieldsSchema = {};
          if (rule.defaultField) {
            for (var k in data.value) {
              if (data.value.hasOwnProperty(k)) {
                fieldsSchema[k] = rule.defaultField;
              }
            }
          }
          fieldsSchema = _extends({}, fieldsSchema, data.rule.fields);
          for (var f in fieldsSchema) {
            if (fieldsSchema.hasOwnProperty(f)) {
              var fieldSchema = Array.isArray(fieldsSchema[f]) ? fieldsSchema[f] : [fieldsSchema[f]];
              fieldsSchema[f] = fieldSchema.map(addFullfield.bind(null, f));
            }
          }
          var schema = new Schema(fieldsSchema);
          schema.messages(options.messages);
          if (data.rule.options) {
            data.rule.options.messages = options.messages;
            data.rule.options.error = options.error;
          }
          schema.validate(data.value, data.rule.options || options, function (errs) {
            var finalErrors = [];
            if (errors && errors.length) {
              finalErrors.push.apply(finalErrors, errors);
            }
            if (errs && errs.length) {
              finalErrors.push.apply(finalErrors, errs);
            }
            doIt(finalErrors.length ? finalErrors : null);
          });
        }
      }

      var res = void 0;
      if (rule.asyncValidator) {
        res = rule.asyncValidator(rule, data.value, cb, data.source, options);
      } else if (rule.validator) {
        res = rule.validator(rule, data.value, cb, data.source, options);
        if (res === true) {
          cb();
        } else if (res === false) {
          cb(rule.message || rule.field + ' fails');
        } else if (res instanceof Array) {
          cb(res);
        } else if (res instanceof Error) {
          cb(res.message);
        }
      }
      if (res && res.then) {
        res.then(function () {
          return cb();
        }, function (e) {
          return cb(e);
        });
      }
    }, function (results) {
      complete(results);
    });
  },
  getType: function getType(rule) {
    if (rule.type === undefined && rule.pattern instanceof RegExp) {
      rule.type = 'pattern';
    }
    if (typeof rule.validator !== 'function' && rule.type && !_validator2['default'].hasOwnProperty(rule.type)) {
      throw new Error((0, _util.format)('Unknown rule type %s', rule.type));
    }
    return rule.type || 'string';
  },
  getValidationMethod: function getValidationMethod(rule) {
    if (typeof rule.validator === 'function') {
      return rule.validator;
    }
    var keys = Object.keys(rule);
    var messageIndex = keys.indexOf('message');
    if (messageIndex !== -1) {
      keys.splice(messageIndex, 1);
    }
    if (keys.length === 1 && keys[0] === 'required') {
      return _validator2['default'].required;
    }
    return _validator2['default'][this.getType(rule)] || false;
  }
};

Schema.register = function register(type, validator) {
  if (typeof validator !== 'function') {
    throw new Error('Cannot register a validator by type, validator is not a function');
  }
  _validator2['default'][type] = validator;
};

Schema.warning = _util.warning;

Schema.messages = _messages2.messages;

exports['default'] = Schema;

/***/ }),

/***/ 827:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _string = __webpack_require__(828);

var _string2 = _interopRequireDefault(_string);

var _method = __webpack_require__(834);

var _method2 = _interopRequireDefault(_method);

var _number = __webpack_require__(835);

var _number2 = _interopRequireDefault(_number);

var _boolean = __webpack_require__(836);

var _boolean2 = _interopRequireDefault(_boolean);

var _regexp = __webpack_require__(837);

var _regexp2 = _interopRequireDefault(_regexp);

var _integer = __webpack_require__(838);

var _integer2 = _interopRequireDefault(_integer);

var _float = __webpack_require__(839);

var _float2 = _interopRequireDefault(_float);

var _array = __webpack_require__(840);

var _array2 = _interopRequireDefault(_array);

var _object = __webpack_require__(841);

var _object2 = _interopRequireDefault(_object);

var _enum = __webpack_require__(842);

var _enum2 = _interopRequireDefault(_enum);

var _pattern = __webpack_require__(843);

var _pattern2 = _interopRequireDefault(_pattern);

var _date = __webpack_require__(844);

var _date2 = _interopRequireDefault(_date);

var _required = __webpack_require__(845);

var _required2 = _interopRequireDefault(_required);

var _type = __webpack_require__(846);

var _type2 = _interopRequireDefault(_type);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

exports['default'] = {
  string: _string2['default'],
  method: _method2['default'],
  number: _number2['default'],
  boolean: _boolean2['default'],
  regexp: _regexp2['default'],
  integer: _integer2['default'],
  float: _float2['default'],
  array: _array2['default'],
  object: _object2['default'],
  'enum': _enum2['default'],
  pattern: _pattern2['default'],
  date: _date2['default'],
  url: _type2['default'],
  hex: _type2['default'],
  email: _type2['default'],
  required: _required2['default']
};

/***/ }),

/***/ 828:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rule = __webpack_require__(103);

var _rule2 = _interopRequireDefault(_rule);

var _util = __webpack_require__(70);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 *  Performs validation for string types.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function string(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if ((0, _util.isEmptyValue)(value, 'string') && !rule.required) {
      return callback();
    }
    _rule2['default'].required(rule, value, source, errors, options, 'string');
    if (!(0, _util.isEmptyValue)(value, 'string')) {
      _rule2['default'].type(rule, value, source, errors, options);
      _rule2['default'].range(rule, value, source, errors, options);
      _rule2['default'].pattern(rule, value, source, errors, options);
      if (rule.whitespace === true) {
        _rule2['default'].whitespace(rule, value, source, errors, options);
      }
    }
  }
  callback(errors);
}

exports['default'] = string;

/***/ }),

/***/ 829:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = __webpack_require__(70);

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

/**
 *  Rule for validating whitespace.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function whitespace(rule, value, source, errors, options) {
  if (/^\s+$/.test(value) || value === '') {
    errors.push(util.format(options.messages.whitespace, rule.fullField));
  }
}

exports['default'] = whitespace;

/***/ }),

/***/ 830:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _util = __webpack_require__(70);

var util = _interopRequireWildcard(_util);

var _required = __webpack_require__(622);

var _required2 = _interopRequireDefault(_required);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

/* eslint max-len:0 */

var pattern = {
  // http://emailregex.com/
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  url: new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i'),
  hex: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i
};

var types = {
  integer: function integer(value) {
    return types.number(value) && parseInt(value, 10) === value;
  },
  float: function float(value) {
    return types.number(value) && !types.integer(value);
  },
  array: function array(value) {
    return Array.isArray(value);
  },
  regexp: function regexp(value) {
    if (value instanceof RegExp) {
      return true;
    }
    try {
      return !!new RegExp(value);
    } catch (e) {
      return false;
    }
  },
  date: function date(value) {
    return typeof value.getTime === 'function' && typeof value.getMonth === 'function' && typeof value.getYear === 'function';
  },
  number: function number(value) {
    if (isNaN(value)) {
      return false;
    }
    return typeof value === 'number';
  },
  object: function object(value) {
    return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && !types.array(value);
  },
  method: function method(value) {
    return typeof value === 'function';
  },
  email: function email(value) {
    return typeof value === 'string' && !!value.match(pattern.email) && value.length < 255;
  },
  url: function url(value) {
    return typeof value === 'string' && !!value.match(pattern.url);
  },
  hex: function hex(value) {
    return typeof value === 'string' && !!value.match(pattern.hex);
  }
};

/**
 *  Rule for validating the type of a value.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function type(rule, value, source, errors, options) {
  if (rule.required && value === undefined) {
    (0, _required2['default'])(rule, value, source, errors, options);
    return;
  }
  var custom = ['integer', 'float', 'array', 'regexp', 'object', 'method', 'email', 'number', 'date', 'url', 'hex'];
  var ruleType = rule.type;
  if (custom.indexOf(ruleType) > -1) {
    if (!types[ruleType](value)) {
      errors.push(util.format(options.messages.types[ruleType], rule.fullField, rule.type));
    }
    // straight typeof check
  } else if (ruleType && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== rule.type) {
    errors.push(util.format(options.messages.types[ruleType], rule.fullField, rule.type));
  }
}

exports['default'] = type;

/***/ }),

/***/ 831:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = __webpack_require__(70);

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

/**
 *  Rule for validating minimum and maximum allowed values.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function range(rule, value, source, errors, options) {
  var len = typeof rule.len === 'number';
  var min = typeof rule.min === 'number';
  var max = typeof rule.max === 'number';
  // 正则匹配码点范围从U+010000一直到U+10FFFF的文字（补充平面Supplementary Plane）
  var spRegexp = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  var val = value;
  var key = null;
  var num = typeof value === 'number';
  var str = typeof value === 'string';
  var arr = Array.isArray(value);
  if (num) {
    key = 'number';
  } else if (str) {
    key = 'string';
  } else if (arr) {
    key = 'array';
  }
  // if the value is not of a supported type for range validation
  // the validation rule rule should use the
  // type property to also test for a particular type
  if (!key) {
    return false;
  }
  if (arr) {
    val = value.length;
  }
  if (str) {
    // 处理码点大于U+010000的文字length属性不准确的bug，如"𠮷𠮷𠮷".lenght !== 3
    val = value.replace(spRegexp, '_').length;
  }
  if (len) {
    if (val !== rule.len) {
      errors.push(util.format(options.messages[key].len, rule.fullField, rule.len));
    }
  } else if (min && !max && val < rule.min) {
    errors.push(util.format(options.messages[key].min, rule.fullField, rule.min));
  } else if (max && !min && val > rule.max) {
    errors.push(util.format(options.messages[key].max, rule.fullField, rule.max));
  } else if (min && max && (val < rule.min || val > rule.max)) {
    errors.push(util.format(options.messages[key].range, rule.fullField, rule.min, rule.max));
  }
}

exports['default'] = range;

/***/ }),

/***/ 832:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = __webpack_require__(70);

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var ENUM = 'enum';

/**
 *  Rule for validating a value exists in an enumerable list.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function enumerable(rule, value, source, errors, options) {
  rule[ENUM] = Array.isArray(rule[ENUM]) ? rule[ENUM] : [];
  if (rule[ENUM].indexOf(value) === -1) {
    errors.push(util.format(options.messages[ENUM], rule.fullField, rule[ENUM].join(', ')));
  }
}

exports['default'] = enumerable;

/***/ }),

/***/ 833:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = __webpack_require__(70);

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

/**
 *  Rule for validating a regular expression pattern.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param source The source object being validated.
 *  @param errors An array of errors that this rule may add
 *  validation errors to.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function pattern(rule, value, source, errors, options) {
  if (rule.pattern) {
    if (rule.pattern instanceof RegExp) {
      // if a RegExp instance is passed, reset `lastIndex` in case its `global`
      // flag is accidentally set to `true`, which in a validation scenario
      // is not necessary and the result might be misleading
      rule.pattern.lastIndex = 0;
      if (!rule.pattern.test(value)) {
        errors.push(util.format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
      }
    } else if (typeof rule.pattern === 'string') {
      var _pattern = new RegExp(rule.pattern);
      if (!_pattern.test(value)) {
        errors.push(util.format(options.messages.pattern.mismatch, rule.fullField, value, rule.pattern));
      }
    }
  }
}

exports['default'] = pattern;

/***/ }),

/***/ 834:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rule = __webpack_require__(103);

var _rule2 = _interopRequireDefault(_rule);

var _util = __webpack_require__(70);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 *  Validates a function.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function method(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if ((0, _util.isEmptyValue)(value) && !rule.required) {
      return callback();
    }
    _rule2['default'].required(rule, value, source, errors, options);
    if (value !== undefined) {
      _rule2['default'].type(rule, value, source, errors, options);
    }
  }
  callback(errors);
}

exports['default'] = method;

/***/ }),

/***/ 835:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rule = __webpack_require__(103);

var _rule2 = _interopRequireDefault(_rule);

var _util = __webpack_require__(70);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 *  Validates a number.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function number(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if (value === '') {
      value = undefined;
    }
    if ((0, _util.isEmptyValue)(value) && !rule.required) {
      return callback();
    }
    _rule2['default'].required(rule, value, source, errors, options);
    if (value !== undefined) {
      _rule2['default'].type(rule, value, source, errors, options);
      _rule2['default'].range(rule, value, source, errors, options);
    }
  }
  callback(errors);
}

exports['default'] = number;

/***/ }),

/***/ 836:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = __webpack_require__(70);

var _rule = __webpack_require__(103);

var _rule2 = _interopRequireDefault(_rule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 *  Validates a boolean.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function boolean(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if ((0, _util.isEmptyValue)(value) && !rule.required) {
      return callback();
    }
    _rule2['default'].required(rule, value, source, errors, options);
    if (value !== undefined) {
      _rule2['default'].type(rule, value, source, errors, options);
    }
  }
  callback(errors);
}

exports['default'] = boolean;

/***/ }),

/***/ 837:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rule = __webpack_require__(103);

var _rule2 = _interopRequireDefault(_rule);

var _util = __webpack_require__(70);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 *  Validates the regular expression type.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function regexp(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if ((0, _util.isEmptyValue)(value) && !rule.required) {
      return callback();
    }
    _rule2['default'].required(rule, value, source, errors, options);
    if (!(0, _util.isEmptyValue)(value)) {
      _rule2['default'].type(rule, value, source, errors, options);
    }
  }
  callback(errors);
}

exports['default'] = regexp;

/***/ }),

/***/ 838:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rule = __webpack_require__(103);

var _rule2 = _interopRequireDefault(_rule);

var _util = __webpack_require__(70);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 *  Validates a number is an integer.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function integer(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if ((0, _util.isEmptyValue)(value) && !rule.required) {
      return callback();
    }
    _rule2['default'].required(rule, value, source, errors, options);
    if (value !== undefined) {
      _rule2['default'].type(rule, value, source, errors, options);
      _rule2['default'].range(rule, value, source, errors, options);
    }
  }
  callback(errors);
}

exports['default'] = integer;

/***/ }),

/***/ 839:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rule = __webpack_require__(103);

var _rule2 = _interopRequireDefault(_rule);

var _util = __webpack_require__(70);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 *  Validates a number is a floating point number.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function floatFn(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if ((0, _util.isEmptyValue)(value) && !rule.required) {
      return callback();
    }
    _rule2['default'].required(rule, value, source, errors, options);
    if (value !== undefined) {
      _rule2['default'].type(rule, value, source, errors, options);
      _rule2['default'].range(rule, value, source, errors, options);
    }
  }
  callback(errors);
}

exports['default'] = floatFn;

/***/ }),

/***/ 840:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rule = __webpack_require__(103);

var _rule2 = _interopRequireDefault(_rule);

var _util = __webpack_require__(70);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 *  Validates an array.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function array(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if ((0, _util.isEmptyValue)(value, 'array') && !rule.required) {
      return callback();
    }
    _rule2['default'].required(rule, value, source, errors, options, 'array');
    if (!(0, _util.isEmptyValue)(value, 'array')) {
      _rule2['default'].type(rule, value, source, errors, options);
      _rule2['default'].range(rule, value, source, errors, options);
    }
  }
  callback(errors);
}

exports['default'] = array;

/***/ }),

/***/ 841:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rule = __webpack_require__(103);

var _rule2 = _interopRequireDefault(_rule);

var _util = __webpack_require__(70);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 *  Validates an object.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function object(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if ((0, _util.isEmptyValue)(value) && !rule.required) {
      return callback();
    }
    _rule2['default'].required(rule, value, source, errors, options);
    if (value !== undefined) {
      _rule2['default'].type(rule, value, source, errors, options);
    }
  }
  callback(errors);
}

exports['default'] = object;

/***/ }),

/***/ 842:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rule = __webpack_require__(103);

var _rule2 = _interopRequireDefault(_rule);

var _util = __webpack_require__(70);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var ENUM = 'enum';

/**
 *  Validates an enumerable list.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function enumerable(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if ((0, _util.isEmptyValue)(value) && !rule.required) {
      return callback();
    }
    _rule2['default'].required(rule, value, source, errors, options);
    if (value) {
      _rule2['default'][ENUM](rule, value, source, errors, options);
    }
  }
  callback(errors);
}

exports['default'] = enumerable;

/***/ }),

/***/ 843:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rule = __webpack_require__(103);

var _rule2 = _interopRequireDefault(_rule);

var _util = __webpack_require__(70);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 *  Validates a regular expression pattern.
 *
 *  Performs validation when a rule only contains
 *  a pattern property but is not declared as a string type.
 *
 *  @param rule The validation rule.
 *  @param value The value of the field on the source object.
 *  @param callback The callback function.
 *  @param source The source object being validated.
 *  @param options The validation options.
 *  @param options.messages The validation messages.
 */
function pattern(rule, value, callback, source, options) {
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if ((0, _util.isEmptyValue)(value, 'string') && !rule.required) {
      return callback();
    }
    _rule2['default'].required(rule, value, source, errors, options);
    if (!(0, _util.isEmptyValue)(value, 'string')) {
      _rule2['default'].pattern(rule, value, source, errors, options);
    }
  }
  callback(errors);
}

exports['default'] = pattern;

/***/ }),

/***/ 844:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rule = __webpack_require__(103);

var _rule2 = _interopRequireDefault(_rule);

var _util = __webpack_require__(70);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function date(rule, value, callback, source, options) {
  // console.log('integer rule called %j', rule);
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  // console.log('validate on %s value', value);
  if (validate) {
    if ((0, _util.isEmptyValue)(value) && !rule.required) {
      return callback();
    }
    _rule2['default'].required(rule, value, source, errors, options);
    if (!(0, _util.isEmptyValue)(value)) {
      var dateObject = void 0;

      if (typeof value === 'number') {
        dateObject = new Date(value);
      } else {
        dateObject = value;
      }

      _rule2['default'].type(rule, dateObject, source, errors, options);
      if (dateObject) {
        _rule2['default'].range(rule, dateObject.getTime(), source, errors, options);
      }
    }
  }
  callback(errors);
}

exports['default'] = date;

/***/ }),

/***/ 845:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _rule = __webpack_require__(103);

var _rule2 = _interopRequireDefault(_rule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function required(rule, value, callback, source, options) {
  var errors = [];
  var type = Array.isArray(value) ? 'array' : typeof value === 'undefined' ? 'undefined' : _typeof(value);
  _rule2['default'].required(rule, value, source, errors, options, type);
  callback(errors);
}

exports['default'] = required;

/***/ }),

/***/ 846:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rule = __webpack_require__(103);

var _rule2 = _interopRequireDefault(_rule);

var _util = __webpack_require__(70);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function type(rule, value, callback, source, options) {
  var ruleType = rule.type;
  var errors = [];
  var validate = rule.required || !rule.required && source.hasOwnProperty(rule.field);
  if (validate) {
    if ((0, _util.isEmptyValue)(value, ruleType) && !rule.required) {
      return callback();
    }
    _rule2['default'].required(rule, value, source, errors, options, ruleType);
    if (!(0, _util.isEmptyValue)(value, ruleType)) {
      _rule2['default'].type(rule, value, source, errors, options);
    }
  }
  callback(errors);
}

exports['default'] = type;

/***/ }),

/***/ 847:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newMessages = newMessages;
function newMessages() {
  return {
    'default': 'Validation error on field %s',
    required: '%s is required',
    'enum': '%s must be one of %s',
    whitespace: '%s cannot be empty',
    date: {
      format: '%s date %s is invalid for format %s',
      parse: '%s date could not be parsed, %s is invalid ',
      invalid: '%s date %s is invalid'
    },
    types: {
      string: '%s is not a %s',
      method: '%s is not a %s (function)',
      array: '%s is not an %s',
      object: '%s is not an %s',
      number: '%s is not a %s',
      date: '%s is not a %s',
      boolean: '%s is not a %s',
      integer: '%s is not an %s',
      float: '%s is not a %s',
      regexp: '%s is not a valid %s',
      email: '%s is not a valid %s',
      url: '%s is not a valid %s',
      hex: '%s is not a valid %s'
    },
    string: {
      len: '%s must be exactly %s characters',
      min: '%s must be at least %s characters',
      max: '%s cannot be longer than %s characters',
      range: '%s must be between %s and %s characters'
    },
    number: {
      len: '%s must equal %s',
      min: '%s cannot be less than %s',
      max: '%s cannot be greater than %s',
      range: '%s must be between %s and %s'
    },
    array: {
      len: '%s must be exactly %s in length',
      min: '%s cannot be less than %s in length',
      max: '%s cannot be greater than %s in length',
      range: '%s must be between %s and %s in length'
    },
    pattern: {
      mismatch: '%s value %s does not match pattern %s'
    },
    clone: function clone() {
      var cloned = JSON.parse(JSON.stringify(this));
      cloned.clone = this.clone;
      return cloned;
    }
  };
}

var messages = exports.messages = newMessages();

/***/ }),

/***/ 848:
/***/ (function(module, exports, __webpack_require__) {

var assignValue = __webpack_require__(787),
    castPath = __webpack_require__(706),
    isIndex = __webpack_require__(487),
    isObject = __webpack_require__(210),
    toKey = __webpack_require__(445);

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = castPath(path, object);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return object;
    }

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

module.exports = baseSet;


/***/ }),

/***/ 849:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = __webpack_require__(42);

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends2 = __webpack_require__(20);

var _extends3 = _interopRequireDefault(_extends2);

var _classCallCheck2 = __webpack_require__(23);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(52);

var _createClass3 = _interopRequireDefault(_createClass2);

exports['default'] = createFieldsStore;

var _set = __webpack_require__(623);

var _set2 = _interopRequireDefault(_set);

var _createFormField = __webpack_require__(624);

var _createFormField2 = _interopRequireDefault(_createFormField);

var _utils = __webpack_require__(409);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function partOf(a, b) {
  return b.indexOf(a) === 0 && ['.', '['].indexOf(b[a.length]) !== -1;
}

function internalFlattenFields(fields) {
  return (0, _utils.flattenFields)(fields, function (_, node) {
    return (0, _createFormField.isFormField)(node);
  }, 'You must wrap field data with `createFormField`.');
}

var FieldsStore = function () {
  function FieldsStore(fields) {
    (0, _classCallCheck3['default'])(this, FieldsStore);

    _initialiseProps.call(this);

    this.fields = internalFlattenFields(fields);
    this.fieldsMeta = {};
  }

  (0, _createClass3['default'])(FieldsStore, [{
    key: 'updateFields',
    value: function updateFields(fields) {
      this.fields = internalFlattenFields(fields);
    }
  }, {
    key: 'flattenRegisteredFields',
    value: function flattenRegisteredFields(fields) {
      var validFieldsName = this.getAllFieldsName();
      return (0, _utils.flattenFields)(fields, function (path) {
        return validFieldsName.indexOf(path) >= 0;
      }, 'You cannot set a form field before rendering a field associated with the value.');
    }
  }, {
    key: 'setFields',
    value: function setFields(fields) {
      var _this = this;

      var fieldsMeta = this.fieldsMeta;
      var nowFields = (0, _extends3['default'])({}, this.fields, fields);
      var nowValues = {};
      Object.keys(fieldsMeta).forEach(function (f) {
        nowValues[f] = _this.getValueFromFields(f, nowFields);
      });
      Object.keys(nowValues).forEach(function (f) {
        var value = nowValues[f];
        var fieldMeta = _this.getFieldMeta(f);
        if (fieldMeta && fieldMeta.normalize) {
          var nowValue = fieldMeta.normalize(value, _this.getValueFromFields(f, _this.fields), nowValues);
          if (nowValue !== value) {
            nowFields[f] = (0, _extends3['default'])({}, nowFields[f], {
              value: nowValue
            });
          }
        }
      });
      this.fields = nowFields;
    }
  }, {
    key: 'resetFields',
    value: function resetFields(ns) {
      var fields = this.fields;

      var names = ns ? this.getValidFieldsFullName(ns) : this.getAllFieldsName();
      return names.reduce(function (acc, name) {
        var field = fields[name];
        if (field && 'value' in field) {
          acc[name] = {};
        }
        return acc;
      }, {});
    }
  }, {
    key: 'setFieldMeta',
    value: function setFieldMeta(name, meta) {
      this.fieldsMeta[name] = meta;
    }
  }, {
    key: 'setFieldsAsDirty',
    value: function setFieldsAsDirty() {
      var _this2 = this;

      Object.keys(this.fields).forEach(function (name) {
        var field = _this2.fields[name];
        var fieldMeta = _this2.fieldsMeta[name];
        if (field && fieldMeta && (0, _utils.hasRules)(fieldMeta.validate)) {
          _this2.fields[name] = (0, _extends3['default'])({}, field, {
            dirty: true
          });
        }
      });
    }
  }, {
    key: 'getFieldMeta',
    value: function getFieldMeta(name) {
      this.fieldsMeta[name] = this.fieldsMeta[name] || {};
      return this.fieldsMeta[name];
    }
  }, {
    key: 'getValueFromFields',
    value: function getValueFromFields(name, fields) {
      var field = fields[name];
      if (field && 'value' in field) {
        return field.value;
      }
      var fieldMeta = this.getFieldMeta(name);
      return fieldMeta && fieldMeta.initialValue;
    }
  }, {
    key: 'getValidFieldsName',
    value: function getValidFieldsName() {
      var _this3 = this;

      var fieldsMeta = this.fieldsMeta;

      return fieldsMeta ? Object.keys(fieldsMeta).filter(function (name) {
        return !_this3.getFieldMeta(name).hidden;
      }) : [];
    }
  }, {
    key: 'getAllFieldsName',
    value: function getAllFieldsName() {
      var fieldsMeta = this.fieldsMeta;

      return fieldsMeta ? Object.keys(fieldsMeta) : [];
    }
  }, {
    key: 'getValidFieldsFullName',
    value: function getValidFieldsFullName(maybePartialName) {
      var maybePartialNames = Array.isArray(maybePartialName) ? maybePartialName : [maybePartialName];
      return this.getValidFieldsName().filter(function (fullName) {
        return maybePartialNames.some(function (partialName) {
          return fullName === partialName || (0, _utils.startsWith)(fullName, partialName) && ['.', '['].indexOf(fullName[partialName.length]) >= 0;
        });
      });
    }
  }, {
    key: 'getFieldValuePropValue',
    value: function getFieldValuePropValue(fieldMeta) {
      var name = fieldMeta.name,
          getValueProps = fieldMeta.getValueProps,
          valuePropName = fieldMeta.valuePropName;

      var field = this.getField(name);
      var fieldValue = 'value' in field ? field.value : fieldMeta.initialValue;
      if (getValueProps) {
        return getValueProps(fieldValue);
      }
      return (0, _defineProperty3['default'])({}, valuePropName, fieldValue);
    }
  }, {
    key: 'getField',
    value: function getField(name) {
      return (0, _extends3['default'])({}, this.fields[name], {
        name: name
      });
    }
  }, {
    key: 'getNotCollectedFields',
    value: function getNotCollectedFields() {
      var _this4 = this;

      var fieldsName = this.getValidFieldsName();
      return fieldsName.filter(function (name) {
        return !_this4.fields[name];
      }).map(function (name) {
        return {
          name: name,
          dirty: false,
          value: _this4.getFieldMeta(name).initialValue
        };
      }).reduce(function (acc, field) {
        return (0, _set2['default'])(acc, field.name, (0, _createFormField2['default'])(field));
      }, {});
    }
  }, {
    key: 'getNestedAllFields',
    value: function getNestedAllFields() {
      var _this5 = this;

      return Object.keys(this.fields).reduce(function (acc, name) {
        return (0, _set2['default'])(acc, name, (0, _createFormField2['default'])(_this5.fields[name]));
      }, this.getNotCollectedFields());
    }
  }, {
    key: 'getFieldMember',
    value: function getFieldMember(name, member) {
      return this.getField(name)[member];
    }
  }, {
    key: 'getNestedFields',
    value: function getNestedFields(names, getter) {
      var fields = names || this.getValidFieldsName();
      return fields.reduce(function (acc, f) {
        return (0, _set2['default'])(acc, f, getter(f));
      }, {});
    }
  }, {
    key: 'getNestedField',
    value: function getNestedField(name, getter) {
      var fullNames = this.getValidFieldsFullName(name);
      if (fullNames.length === 0 || // Not registered
      fullNames.length === 1 && fullNames[0] === name // Name already is full name.
      ) {
          return getter(name);
        }
      var isArrayValue = fullNames[0][name.length] === '[';
      var suffixNameStartIndex = isArrayValue ? name.length : name.length + 1;
      return fullNames.reduce(function (acc, fullName) {
        return (0, _set2['default'])(acc, fullName.slice(suffixNameStartIndex), getter(fullName));
      }, isArrayValue ? [] : {});
    }
  }, {
    key: 'isValidNestedFieldName',


    // @private
    // BG: `a` and `a.b` cannot be use in the same form
    value: function isValidNestedFieldName(name) {
      var names = this.getAllFieldsName();
      return names.every(function (n) {
        return !partOf(n, name) && !partOf(name, n);
      });
    }
  }, {
    key: 'clearField',
    value: function clearField(name) {
      delete this.fields[name];
      delete this.fieldsMeta[name];
    }
  }]);
  return FieldsStore;
}();

var _initialiseProps = function _initialiseProps() {
  var _this6 = this;

  this.setFieldsInitialValue = function (initialValues) {
    var flattenedInitialValues = _this6.flattenRegisteredFields(initialValues);
    var fieldsMeta = _this6.fieldsMeta;
    Object.keys(flattenedInitialValues).forEach(function (name) {
      if (fieldsMeta[name]) {
        _this6.setFieldMeta(name, (0, _extends3['default'])({}, _this6.getFieldMeta(name), {
          initialValue: flattenedInitialValues[name]
        }));
      }
    });
  };

  this.getAllValues = function () {
    var fieldsMeta = _this6.fieldsMeta,
        fields = _this6.fields;

    return Object.keys(fieldsMeta).reduce(function (acc, name) {
      return (0, _set2['default'])(acc, name, _this6.getValueFromFields(name, fields));
    }, {});
  };

  this.getFieldsValue = function (names) {
    return _this6.getNestedFields(names, _this6.getFieldValue);
  };

  this.getFieldValue = function (name) {
    var fields = _this6.fields;

    return _this6.getNestedField(name, function (fullName) {
      return _this6.getValueFromFields(fullName, fields);
    });
  };

  this.getFieldsError = function (names) {
    return _this6.getNestedFields(names, _this6.getFieldError);
  };

  this.getFieldError = function (name) {
    return _this6.getNestedField(name, function (fullName) {
      return (0, _utils.getErrorStrs)(_this6.getFieldMember(fullName, 'errors'));
    });
  };

  this.isFieldValidating = function (name) {
    return _this6.getFieldMember(name, 'validating');
  };

  this.isFieldsValidating = function (ns) {
    var names = ns || _this6.getValidFieldsName();
    return names.some(function (n) {
      return _this6.isFieldValidating(n);
    });
  };

  this.isFieldTouched = function (name) {
    return _this6.getFieldMember(name, 'touched');
  };

  this.isFieldsTouched = function (ns) {
    var names = ns || _this6.getValidFieldsName();
    return names.some(function (n) {
      return _this6.isFieldTouched(n);
    });
  };
};

function createFieldsStore(fields) {
  return new FieldsStore(fields);
}
module.exports = exports['default'];

/***/ }),

/***/ 850:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(23);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(52);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(19);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(26);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(1);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var FieldElemWrapper = function (_React$Component) {
  (0, _inherits3['default'])(FieldElemWrapper, _React$Component);

  function FieldElemWrapper() {
    (0, _classCallCheck3['default'])(this, FieldElemWrapper);
    return (0, _possibleConstructorReturn3['default'])(this, (FieldElemWrapper.__proto__ || Object.getPrototypeOf(FieldElemWrapper)).apply(this, arguments));
  }

  (0, _createClass3['default'])(FieldElemWrapper, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _props = this.props,
          name = _props.name,
          form = _props.form;

      form.domFields[name] = true;
      form.recoverClearedField(name);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _props2 = this.props,
          name = _props2.name,
          form = _props2.form;

      var fieldMeta = form.fieldsStore.getFieldMeta(name);
      if (!fieldMeta.preserve) {
        // after destroy, delete data
        form.clearedFieldMetaCache[name] = {
          field: form.fieldsStore.getField(name),
          meta: fieldMeta
        };
        form.clearField(name);
      }
      delete form.domFields[name];
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.children;
    }
  }]);
  return FieldElemWrapper;
}(_react2['default'].Component);

exports['default'] = FieldElemWrapper;


FieldElemWrapper.propTypes = {
  name: _propTypes2['default'].string,
  form: _propTypes2['default'].shape({
    domFields: _propTypes2['default'].objectOf(_propTypes2['default'].bool),
    recoverClearedField: _propTypes2['default'].func,
    fieldsStore: _propTypes2['default'].shape({
      getFieldMeta: _propTypes2['default'].func,
      getField: _propTypes2['default'].func
    }),
    clearedFieldMetaCache: _propTypes2['default'].objectOf(_propTypes2['default'].shape({
      field: _propTypes2['default'].object,
      meta: _propTypes2['default'].object
    })),
    clearField: _propTypes2['default'].func
  }),
  children: _propTypes2['default'].node
};
module.exports = exports['default'];

/***/ }),

/***/ 851:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mixin = undefined;

var _createBaseForm = __webpack_require__(621);

var _createBaseForm2 = _interopRequireDefault(_createBaseForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var mixin = exports.mixin = {
  getForm: function getForm() {
    return {
      getFieldsValue: this.fieldsStore.getFieldsValue,
      getFieldValue: this.fieldsStore.getFieldValue,
      getFieldInstance: this.getFieldInstance,
      setFieldsValue: this.setFieldsValue,
      setFields: this.setFields,
      setFieldsInitialValue: this.fieldsStore.setFieldsInitialValue,
      getFieldDecorator: this.getFieldDecorator,
      getFieldProps: this.getFieldProps,
      getFieldsError: this.fieldsStore.getFieldsError,
      getFieldError: this.fieldsStore.getFieldError,
      isFieldValidating: this.fieldsStore.isFieldValidating,
      isFieldsValidating: this.fieldsStore.isFieldsValidating,
      isFieldsTouched: this.fieldsStore.isFieldsTouched,
      isFieldTouched: this.fieldsStore.isFieldTouched,
      isSubmitting: this.isSubmitting,
      submit: this.submit,
      validateFields: this.validateFields,
      resetFields: this.resetFields
    };
  }
};

function createForm(options) {
  return (0, _createBaseForm2['default'])(options, [mixin]);
}

exports['default'] = createForm;

/***/ }),

/***/ 852:
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

var _rcAnimate = _interopRequireDefault(__webpack_require__(170));

var _omit = _interopRequireDefault(__webpack_require__(97));

var _row = _interopRequireDefault(__webpack_require__(795));

var _col = _interopRequireDefault(__webpack_require__(796));

var _icon = _interopRequireDefault(__webpack_require__(28));

var _configProvider = __webpack_require__(39);

var _warning = _interopRequireDefault(__webpack_require__(91));

var _type = __webpack_require__(188);

var _constants = __webpack_require__(625);

var _context = _interopRequireDefault(__webpack_require__(626));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var ValidateStatuses = (0, _type.tuple)('success', 'warning', 'error', 'validating', '');
var FormLabelAligns = (0, _type.tuple)('left', 'right');

function intersperseSpace(list) {
  return list.reduce(function (current, item) {
    return [].concat(_toConsumableArray(current), [' ', item]);
  }, []).slice(1);
}

var FormItem =
/*#__PURE__*/
function (_React$Component) {
  _inherits(FormItem, _React$Component);

  function FormItem() {
    var _this;

    _classCallCheck(this, FormItem);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FormItem).apply(this, arguments));
    _this.helpShow = false; // Resolve duplicated ids bug between different forms
    // https://github.com/ant-design/ant-design/issues/7351

    _this.onLabelClick = function () {
      var id = _this.props.id || _this.getId();

      if (!id) {
        return;
      }

      var formItemNode = ReactDOM.findDOMNode(_assertThisInitialized(_this));
      var control = formItemNode.querySelector("[id=\"".concat(id, "\"]"));

      if (control && control.focus) {
        control.focus();
      }
    };

    _this.onHelpAnimEnd = function (_key, helpShow) {
      _this.helpShow = helpShow;

      if (!helpShow) {
        _this.setState({});
      }
    };

    _this.renderFormItem = function (_ref) {
      var _itemClassName;

      var getPrefixCls = _ref.getPrefixCls;

      var _a = _this.props,
          customizePrefixCls = _a.prefixCls,
          style = _a.style,
          className = _a.className,
          restProps = __rest(_a, ["prefixCls", "style", "className"]);

      var prefixCls = getPrefixCls('form', customizePrefixCls);

      var children = _this.renderChildren(prefixCls);

      var itemClassName = (_itemClassName = {}, _defineProperty(_itemClassName, "".concat(prefixCls, "-item"), true), _defineProperty(_itemClassName, "".concat(prefixCls, "-item-with-help"), _this.helpShow), _defineProperty(_itemClassName, "".concat(className), !!className), _itemClassName);
      return React.createElement(_row["default"], _extends({
        className: (0, _classnames["default"])(itemClassName),
        style: style
      }, (0, _omit["default"])(restProps, ['id', 'htmlFor', 'label', 'labelAlign', 'labelCol', 'wrapperCol', 'help', 'extra', 'validateStatus', 'hasFeedback', 'required', 'colon']), {
        key: "row"
      }), children);
    };

    return _this;
  }

  _createClass(FormItem, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          children = _this$props.children,
          help = _this$props.help,
          validateStatus = _this$props.validateStatus,
          id = _this$props.id;
      (0, _warning["default"])(this.getControls(children, true).length <= 1 || help !== undefined || validateStatus !== undefined, 'Form.Item', 'Cannot generate `validateStatus` and `help` automatically, ' + 'while there are more than one `getFieldDecorator` in it.');
      (0, _warning["default"])(!id, 'Form.Item', '`id` is deprecated for its label `htmlFor`. Please use `htmlFor` directly.');
    }
  }, {
    key: "getHelpMessage",
    value: function getHelpMessage() {
      var help = this.props.help;

      if (help === undefined && this.getOnlyControl()) {
        var _this$getField = this.getField(),
            errors = _this$getField.errors;

        if (errors) {
          return intersperseSpace(errors.map(function (e, index) {
            var node = null;

            if (React.isValidElement(e)) {
              node = e;
            } else if (React.isValidElement(e.message)) {
              node = e.message;
            } // eslint-disable-next-line react/no-array-index-key


            return node ? React.cloneElement(node, {
              key: index
            }) : e.message;
          }));
        }

        return '';
      }

      return help;
    }
  }, {
    key: "getControls",
    value: function getControls(children, recursively) {
      var controls = [];
      var childrenArray = React.Children.toArray(children);

      for (var i = 0; i < childrenArray.length; i++) {
        if (!recursively && controls.length > 0) {
          break;
        }

        var child = childrenArray[i];

        if (child.type && (child.type === FormItem || child.type.displayName === 'FormItem')) {
          continue;
        }

        if (!child.props) {
          continue;
        }

        if (_constants.FIELD_META_PROP in child.props) {
          // And means FIELD_DATA_PROP in child.props, too.
          controls.push(child);
        } else if (child.props.children) {
          controls = controls.concat(this.getControls(child.props.children, recursively));
        }
      }

      return controls;
    }
  }, {
    key: "getOnlyControl",
    value: function getOnlyControl() {
      var child = this.getControls(this.props.children, false)[0];
      return child !== undefined ? child : null;
    }
  }, {
    key: "getChildProp",
    value: function getChildProp(prop) {
      var child = this.getOnlyControl();
      return child && child.props && child.props[prop];
    }
  }, {
    key: "getId",
    value: function getId() {
      return this.getChildProp('id');
    }
  }, {
    key: "getMeta",
    value: function getMeta() {
      return this.getChildProp(_constants.FIELD_META_PROP);
    }
  }, {
    key: "getField",
    value: function getField() {
      return this.getChildProp(_constants.FIELD_DATA_PROP);
    }
  }, {
    key: "getValidateStatus",
    value: function getValidateStatus() {
      var onlyControl = this.getOnlyControl();

      if (!onlyControl) {
        return '';
      }

      var field = this.getField();

      if (field.validating) {
        return 'validating';
      }

      if (field.errors) {
        return 'error';
      }

      var fieldValue = 'value' in field ? field.value : this.getMeta().initialValue;

      if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
        return 'success';
      }

      return '';
    }
  }, {
    key: "isRequired",
    value: function isRequired() {
      var required = this.props.required;

      if (required !== undefined) {
        return required;
      }

      if (this.getOnlyControl()) {
        var meta = this.getMeta() || {};
        var validate = meta.validate || [];
        return validate.filter(function (item) {
          return !!item.rules;
        }).some(function (item) {
          return item.rules.some(function (rule) {
            return rule.required;
          });
        });
      }

      return false;
    }
  }, {
    key: "renderHelp",
    value: function renderHelp(prefixCls) {
      var help = this.getHelpMessage();
      var children = help ? React.createElement("div", {
        className: "".concat(prefixCls, "-explain"),
        key: "help"
      }, help) : null;

      if (children) {
        this.helpShow = !!children;
      }

      return React.createElement(_rcAnimate["default"], {
        transitionName: "show-help",
        component: "",
        transitionAppear: true,
        key: "help",
        onEnd: this.onHelpAnimEnd
      }, children);
    }
  }, {
    key: "renderExtra",
    value: function renderExtra(prefixCls) {
      var extra = this.props.extra;
      return extra ? React.createElement("div", {
        className: "".concat(prefixCls, "-extra")
      }, extra) : null;
    }
  }, {
    key: "renderValidateWrapper",
    value: function renderValidateWrapper(prefixCls, c1, c2, c3) {
      var props = this.props;
      var onlyControl = this.getOnlyControl;
      var validateStatus = props.validateStatus === undefined && onlyControl ? this.getValidateStatus() : props.validateStatus;
      var classes = "".concat(prefixCls, "-item-control");

      if (validateStatus) {
        classes = (0, _classnames["default"])("".concat(prefixCls, "-item-control"), {
          'has-feedback': props.hasFeedback || validateStatus === 'validating',
          'has-success': validateStatus === 'success',
          'has-warning': validateStatus === 'warning',
          'has-error': validateStatus === 'error',
          'is-validating': validateStatus === 'validating'
        });
      }

      var iconType = '';

      switch (validateStatus) {
        case 'success':
          iconType = 'check-circle';
          break;

        case 'warning':
          iconType = 'exclamation-circle';
          break;

        case 'error':
          iconType = 'close-circle';
          break;

        case 'validating':
          iconType = 'loading';
          break;

        default:
          iconType = '';
          break;
      }

      var icon = props.hasFeedback && iconType ? React.createElement("span", {
        className: "".concat(prefixCls, "-item-children-icon")
      }, React.createElement(_icon["default"], {
        type: iconType,
        theme: iconType === 'loading' ? 'outlined' : 'filled'
      })) : null;
      return React.createElement("div", {
        className: classes
      }, React.createElement("span", {
        className: "".concat(prefixCls, "-item-children")
      }, c1, icon), c2, c3);
    }
  }, {
    key: "renderWrapper",
    value: function renderWrapper(prefixCls, children) {
      var _this2 = this;

      return React.createElement(_context["default"].Consumer, {
        key: "wrapper"
      }, function (_ref2) {
        var contextWrapperCol = _ref2.wrapperCol,
            vertical = _ref2.vertical;
        var wrapperCol = _this2.props.wrapperCol;
        var mergedWrapperCol = ('wrapperCol' in _this2.props ? wrapperCol : contextWrapperCol) || {};
        var className = (0, _classnames["default"])("".concat(prefixCls, "-item-control-wrapper"), mergedWrapperCol.className); // No pass FormContext since it's useless

        return React.createElement(_context["default"].Provider, {
          value: {
            vertical: vertical
          }
        }, React.createElement(_col["default"], _extends({}, mergedWrapperCol, {
          className: className
        }), children));
      });
    }
  }, {
    key: "renderLabel",
    value: function renderLabel(prefixCls) {
      var _this3 = this;

      return React.createElement(_context["default"].Consumer, {
        key: "label"
      }, function (_ref3) {
        var _classNames;

        var vertical = _ref3.vertical,
            contextLabelAlign = _ref3.labelAlign,
            contextLabelCol = _ref3.labelCol,
            contextColon = _ref3.colon;
        var _this3$props = _this3.props,
            label = _this3$props.label,
            labelCol = _this3$props.labelCol,
            labelAlign = _this3$props.labelAlign,
            colon = _this3$props.colon,
            id = _this3$props.id,
            htmlFor = _this3$props.htmlFor;

        var required = _this3.isRequired();

        var mergedLabelCol = ('labelCol' in _this3.props ? labelCol : contextLabelCol) || {};
        var mergedLabelAlign = 'labelAlign' in _this3.props ? labelAlign : contextLabelAlign;
        var labelClsBasic = "".concat(prefixCls, "-item-label");
        var labelColClassName = (0, _classnames["default"])(labelClsBasic, mergedLabelAlign === 'left' && "".concat(labelClsBasic, "-left"), mergedLabelCol.className);
        var labelChildren = label; // Keep label is original where there should have no colon

        var computedColon = colon === true || contextColon !== false && colon !== false;
        var haveColon = computedColon && !vertical; // Remove duplicated user input colon

        if (haveColon && typeof label === 'string' && label.trim() !== '') {
          labelChildren = label.replace(/[：:]\s*$/, '');
        }

        var labelClassName = (0, _classnames["default"])((_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-item-required"), required), _defineProperty(_classNames, "".concat(prefixCls, "-item-no-colon"), !computedColon), _classNames));
        return label ? React.createElement(_col["default"], _extends({}, mergedLabelCol, {
          className: labelColClassName
        }), React.createElement("label", {
          htmlFor: htmlFor || id || _this3.getId(),
          className: labelClassName,
          title: typeof label === 'string' ? label : '',
          onClick: _this3.onLabelClick
        }, labelChildren)) : null;
      });
    }
  }, {
    key: "renderChildren",
    value: function renderChildren(prefixCls) {
      var children = this.props.children;
      return [this.renderLabel(prefixCls), this.renderWrapper(prefixCls, this.renderValidateWrapper(prefixCls, children, this.renderHelp(prefixCls), this.renderExtra(prefixCls)))];
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(_configProvider.ConfigConsumer, null, this.renderFormItem);
    }
  }]);

  return FormItem;
}(React.Component);

exports["default"] = FormItem;
FormItem.defaultProps = {
  hasFeedback: false
};
FormItem.propTypes = {
  prefixCls: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  labelCol: PropTypes.object,
  help: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  validateStatus: PropTypes.oneOf(ValidateStatuses),
  hasFeedback: PropTypes.bool,
  wrapperCol: PropTypes.object,
  className: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.node,
  colon: PropTypes.bool
};
//# sourceMappingURL=FormItem.js.map


/***/ }),

/***/ 853:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 854:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/logo.png";

/***/ }),

/***/ 855:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(__webpack_require__(0));

var _classnames = _interopRequireDefault(__webpack_require__(8));

var _reactLifecyclesCompat = __webpack_require__(36);

var _toArray = _interopRequireDefault(__webpack_require__(441));

var _findDOMNode = _interopRequireDefault(__webpack_require__(777));

var _copyToClipboard = _interopRequireDefault(__webpack_require__(1762));

var _omit = _interopRequireDefault(__webpack_require__(97));

var _rcResizeObserver = _interopRequireDefault(__webpack_require__(794));

var _configProvider = __webpack_require__(39);

var _context = __webpack_require__(1021);

var _LocaleReceiver = _interopRequireDefault(__webpack_require__(209));

var _warning = _interopRequireDefault(__webpack_require__(91));

var _transButton = _interopRequireDefault(__webpack_require__(793));

var _raf = _interopRequireDefault(__webpack_require__(696));

var _styleChecker = _interopRequireDefault(__webpack_require__(1063));

var _icon = _interopRequireDefault(__webpack_require__(28));

var _tooltip = _interopRequireDefault(__webpack_require__(64));

var _Typography = _interopRequireDefault(__webpack_require__(1089));

var _Editable = _interopRequireDefault(__webpack_require__(1764));

var _util = _interopRequireDefault(__webpack_require__(1765));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var isLineClampSupport = (0, _styleChecker["default"])('webkitLineClamp');
var isTextOverflowSupport = (0, _styleChecker["default"])('textOverflow');

function wrapperDecorations(_ref, content) {
  var mark = _ref.mark,
      code = _ref.code,
      underline = _ref.underline,
      del = _ref["delete"],
      strong = _ref.strong;
  var currentContent = content;

  function wrap(needed, tag) {
    if (!needed) return;
    currentContent = React.createElement(tag, {}, currentContent);
  }

  wrap(strong, 'strong');
  wrap(underline, 'u');
  wrap(del, 'del');
  wrap(code, 'code');
  wrap(mark, 'mark');
  return currentContent;
}

var ELLIPSIS_STR = '...';

var Base =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Base, _React$Component);

  function Base() {
    var _this;

    _classCallCheck(this, Base);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Base).apply(this, arguments));
    _this.state = {
      edit: false,
      copied: false,
      ellipsisText: '',
      ellipsisContent: null,
      isEllipsis: false,
      expanded: false,
      clientRendered: false
    }; // =============== Expend ===============

    _this.onExpandClick = function () {
      var _this$getEllipsis = _this.getEllipsis(),
          onExpand = _this$getEllipsis.onExpand;

      _this.setState({
        expanded: true
      });

      if (onExpand) {
        onExpand();
      }
    }; // ================ Edit ================


    _this.onEditClick = function () {
      _this.triggerEdit(true);
    };

    _this.onEditChange = function (value) {
      var _this$getEditable = _this.getEditable(),
          onChange = _this$getEditable.onChange;

      if (onChange) {
        onChange(value);
      }

      _this.triggerEdit(false);
    };

    _this.onEditCancel = function () {
      _this.triggerEdit(false);
    }; // ================ Copy ================


    _this.onCopyClick = function () {
      var _this$props = _this.props,
          children = _this$props.children,
          copyable = _this$props.copyable;

      var copyConfig = _extends({}, _typeof(copyable) === 'object' ? copyable : null);

      if (copyConfig.text === undefined) {
        copyConfig.text = String(children);
      }

      (0, _copyToClipboard["default"])(copyConfig.text || '');

      _this.setState({
        copied: true
      }, function () {
        if (copyConfig.onCopy) {
          copyConfig.onCopy();
        }

        _this.copyId = window.setTimeout(function () {
          _this.setState({
            copied: false
          });
        }, 3000);
      });
    };

    _this.setContentRef = function (node) {
      _this.content = node;
    };

    _this.setEditRef = function (node) {
      _this.editIcon = node;
    };

    _this.triggerEdit = function (edit) {
      var _this$getEditable2 = _this.getEditable(),
          onStart = _this$getEditable2.onStart;

      if (edit && onStart) {
        onStart();
      }

      _this.setState({
        edit: edit
      }, function () {
        if (!edit && _this.editIcon) {
          _this.editIcon.focus();
        }
      });
    }; // ============== Ellipsis ==============


    _this.resizeOnNextFrame = function () {
      _raf["default"].cancel(_this.rafId);

      _this.rafId = (0, _raf["default"])(function () {
        // Do not bind `syncEllipsis`. It need for test usage on prototype
        _this.syncEllipsis();
      });
    };

    return _this;
  }

  _createClass(Base, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        clientRendered: true
      });
      this.resizeOnNextFrame();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var children = this.props.children;
      var ellipsis = this.getEllipsis();
      var prevEllipsis = this.getEllipsis(prevProps);

      if (children !== prevProps.children || ellipsis.rows !== prevEllipsis.rows) {
        this.resizeOnNextFrame();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.clearTimeout(this.copyId);

      _raf["default"].cancel(this.rafId);
    }
  }, {
    key: "getEditable",
    value: function getEditable(props) {
      var edit = this.state.edit;

      var _ref2 = props || this.props,
          editable = _ref2.editable;

      if (!editable) return {
        editing: edit
      };
      return _extends({
        editing: edit
      }, _typeof(editable) === 'object' ? editable : null);
    }
  }, {
    key: "getEllipsis",
    value: function getEllipsis(props) {
      var _ref3 = props || this.props,
          ellipsis = _ref3.ellipsis;

      if (!ellipsis) return {};
      return _extends({
        rows: 1,
        expandable: false
      }, _typeof(ellipsis) === 'object' ? ellipsis : null);
    }
  }, {
    key: "canUseCSSEllipsis",
    value: function canUseCSSEllipsis() {
      var clientRendered = this.state.clientRendered;
      var _this$props2 = this.props,
          editable = _this$props2.editable,
          copyable = _this$props2.copyable;

      var _this$getEllipsis2 = this.getEllipsis(),
          rows = _this$getEllipsis2.rows,
          expandable = _this$getEllipsis2.expandable; // Can't use css ellipsis since we need to provide the place for button


      if (editable || copyable || expandable || !clientRendered) {
        return false;
      }

      if (rows === 1) {
        return isTextOverflowSupport;
      }

      return isLineClampSupport;
    }
  }, {
    key: "syncEllipsis",
    value: function syncEllipsis() {
      var _this$state = this.state,
          ellipsisText = _this$state.ellipsisText,
          isEllipsis = _this$state.isEllipsis,
          expanded = _this$state.expanded;

      var _this$getEllipsis3 = this.getEllipsis(),
          rows = _this$getEllipsis3.rows;

      var children = this.props.children;
      if (!rows || rows < 0 || !this.content || expanded) return; // Do not measure if css already support ellipsis

      if (this.canUseCSSEllipsis()) return;
      (0, _warning["default"])((0, _toArray["default"])(children).every(function (child) {
        return typeof child === 'string';
      }), 'Typography', '`ellipsis` should use string as children only.');

      var _measure = (0, _util["default"])((0, _findDOMNode["default"])(this.content), rows, children, this.renderOperations(true), ELLIPSIS_STR),
          content = _measure.content,
          text = _measure.text,
          ellipsis = _measure.ellipsis;

      if (ellipsisText !== text || isEllipsis !== ellipsis) {
        this.setState({
          ellipsisText: text,
          ellipsisContent: content,
          isEllipsis: ellipsis
        });
      }
    }
  }, {
    key: "renderExpand",
    value: function renderExpand(forceRender) {
      var _this$getEllipsis4 = this.getEllipsis(),
          expandable = _this$getEllipsis4.expandable;

      var prefixCls = this.props.prefixCls;
      var _this$state2 = this.state,
          expanded = _this$state2.expanded,
          isEllipsis = _this$state2.isEllipsis;
      if (!expandable) return null; // force render expand icon for measure usage or it will cause dead loop

      if (!forceRender && (expanded || !isEllipsis)) return null;
      return React.createElement("a", {
        key: "expand",
        className: "".concat(prefixCls, "-expand"),
        onClick: this.onExpandClick,
        "aria-label": this.expandStr
      }, this.expandStr);
    }
  }, {
    key: "renderEdit",
    value: function renderEdit() {
      var _this$props3 = this.props,
          editable = _this$props3.editable,
          prefixCls = _this$props3.prefixCls;
      if (!editable) return;
      return React.createElement(_tooltip["default"], {
        key: "edit",
        title: this.editStr
      }, React.createElement(_transButton["default"], {
        ref: this.setEditRef,
        className: "".concat(prefixCls, "-edit"),
        onClick: this.onEditClick,
        "aria-label": this.editStr
      }, React.createElement(_icon["default"], {
        role: "button",
        type: "edit"
      })));
    }
  }, {
    key: "renderCopy",
    value: function renderCopy() {
      var copied = this.state.copied;
      var _this$props4 = this.props,
          copyable = _this$props4.copyable,
          prefixCls = _this$props4.prefixCls;
      if (!copyable) return;
      var title = copied ? this.copiedStr : this.copyStr;
      return React.createElement(_tooltip["default"], {
        key: "copy",
        title: title
      }, React.createElement(_transButton["default"], {
        className: (0, _classnames["default"])("".concat(prefixCls, "-copy"), copied && "".concat(prefixCls, "-copy-success")),
        onClick: this.onCopyClick,
        "aria-label": title
      }, React.createElement(_icon["default"], {
        role: "button",
        type: copied ? 'check' : 'copy'
      })));
    }
  }, {
    key: "renderEditInput",
    value: function renderEditInput() {
      var _this$props5 = this.props,
          children = _this$props5.children,
          prefixCls = _this$props5.prefixCls,
          className = _this$props5.className,
          style = _this$props5.style;
      return React.createElement(_Editable["default"], {
        value: typeof children === 'string' ? children : '',
        onSave: this.onEditChange,
        onCancel: this.onEditCancel,
        prefixCls: prefixCls,
        className: className,
        style: style
      });
    }
  }, {
    key: "renderOperations",
    value: function renderOperations(forceRenderExpanded) {
      return [this.renderExpand(forceRenderExpanded), this.renderEdit(), this.renderCopy()].filter(function (node) {
        return node;
      });
    }
  }, {
    key: "renderContent",
    value: function renderContent() {
      var _this2 = this;

      var _this$state3 = this.state,
          ellipsisContent = _this$state3.ellipsisContent,
          isEllipsis = _this$state3.isEllipsis,
          expanded = _this$state3.expanded;

      var _a = this.props,
          component = _a.component,
          children = _a.children,
          className = _a.className,
          prefixCls = _a.prefixCls,
          type = _a.type,
          disabled = _a.disabled,
          style = _a.style,
          restProps = __rest(_a, ["component", "children", "className", "prefixCls", "type", "disabled", "style"]);

      var _this$getEllipsis5 = this.getEllipsis(),
          rows = _this$getEllipsis5.rows;

      var textProps = (0, _omit["default"])(restProps, ['prefixCls', 'editable', 'copyable', 'ellipsis', 'mark', 'underline', 'mark', 'code', 'delete', 'underline', 'strong'].concat(_toConsumableArray(_configProvider.configConsumerProps)));
      var cssEllipsis = this.canUseCSSEllipsis();
      var cssTextOverflow = rows === 1 && cssEllipsis;
      var cssLineClamp = rows && rows > 1 && cssEllipsis;
      var textNode = children;
      var ariaLabel = null; // Only use js ellipsis when css ellipsis not support

      if (rows && isEllipsis && !expanded && !cssEllipsis) {
        ariaLabel = String(children); // We move full content to outer element to avoid repeat read the content by accessibility

        textNode = React.createElement("span", {
          title: String(children),
          "aria-hidden": "true"
        }, ellipsisContent, ELLIPSIS_STR);
      }

      textNode = wrapperDecorations(this.props, textNode);
      return React.createElement(_LocaleReceiver["default"], {
        componentName: "Text"
      }, function (_ref4) {
        var _classNames;

        var edit = _ref4.edit,
            copyStr = _ref4.copy,
            copied = _ref4.copied,
            expand = _ref4.expand;
        _this2.editStr = edit;
        _this2.copyStr = copyStr;
        _this2.copiedStr = copied;
        _this2.expandStr = expand;
        return React.createElement(_rcResizeObserver["default"], {
          onResize: _this2.resizeOnNextFrame,
          disabled: !rows
        }, React.createElement(_Typography["default"], _extends({
          className: (0, _classnames["default"])(className, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-").concat(type), type), _defineProperty(_classNames, "".concat(prefixCls, "-disabled"), disabled), _defineProperty(_classNames, "".concat(prefixCls, "-ellipsis"), rows), _defineProperty(_classNames, "".concat(prefixCls, "-ellipsis-single-line"), cssTextOverflow), _defineProperty(_classNames, "".concat(prefixCls, "-ellipsis-multiple-line"), cssLineClamp), _classNames)),
          style: _extends(_extends({}, style), {
            WebkitLineClamp: cssLineClamp ? rows : null
          }),
          component: component,
          ref: _this2.setContentRef,
          "aria-label": ariaLabel
        }, textProps), textNode, _this2.renderOperations()));
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$getEditable3 = this.getEditable(),
          editing = _this$getEditable3.editing;

      if (editing) {
        return this.renderEditInput();
      }

      return this.renderContent();
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(nextProps) {
      var children = nextProps.children,
          editable = nextProps.editable;
      (0, _warning["default"])(!editable || typeof children === 'string', 'Typography', 'When `editable` is enabled, the `children` should use string.');
      return {};
    }
  }]);

  return Base;
}(React.Component);

Base.defaultProps = {
  children: ''
};
(0, _reactLifecyclesCompat.polyfill)(Base);

var _default = (0, _context.withConfigConsumer)({
  prefixCls: 'typography'
})(Base);

exports["default"] = _default;
//# sourceMappingURL=Base.js.map


/***/ }),

/***/ 955:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "Step", function() { return /* reexport */ Step_Step; });

// EXTERNAL MODULE: delegated ./node_modules/react/index.js from dll-reference dll_library
var reactfrom_dll_reference_dll_library = __webpack_require__(0);
var reactfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(reactfrom_dll_reference_dll_library);

// EXTERNAL MODULE: delegated ./node_modules/prop-types/index.js from dll-reference dll_library
var prop_typesfrom_dll_reference_dll_library = __webpack_require__(1);
var prop_typesfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(prop_typesfrom_dll_reference_dll_library);

// EXTERNAL MODULE: delegated ./node_modules/react-dom/index.js from dll-reference dll_library
var react_domfrom_dll_reference_dll_library = __webpack_require__(11);

// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(8);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);

// EXTERNAL MODULE: ./node_modules/lodash/debounce.js
var debounce = __webpack_require__(361);
var debounce_default = /*#__PURE__*/__webpack_require__.n(debounce);

// CONCATENATED MODULE: ./node_modules/rc-steps/es/utils.js
// eslint-disable-next-line import/prefer-default-export
function isFlexSupported() {
  if (typeof window !== 'undefined' && window.document && window.document.documentElement) {
    var documentElement = window.document.documentElement;
    return 'flex' in documentElement.style || 'webkitFlex' in documentElement.style || 'Flex' in documentElement.style || 'msFlex' in documentElement.style;
  }

  return false;
}
// CONCATENATED MODULE: ./node_modules/rc-steps/es/Steps.js
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint react/no-did-mount-set-state: 0 */







var Steps_Steps =
/*#__PURE__*/
function (_Component) {
  _inherits(Steps, _Component);

  function Steps(props) {
    var _this;

    _classCallCheck(this, Steps);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Steps).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "onStepClick", function (next) {
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          current = _this$props.current;

      if (onChange && current !== next) {
        onChange(next);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "calcStepOffsetWidth", function () {
      if (isFlexSupported()) {
        return;
      }

      var lastStepOffsetWidth = _this.state.lastStepOffsetWidth; // Just for IE9

      var domNode = Object(react_domfrom_dll_reference_dll_library["findDOMNode"])(_assertThisInitialized(_this));

      if (domNode.children.length > 0) {
        if (_this.calcTimeout) {
          clearTimeout(_this.calcTimeout);
        }

        _this.calcTimeout = setTimeout(function () {
          // +1 for fit edge bug of digit width, like 35.4px
          var offsetWidth = (domNode.lastChild.offsetWidth || 0) + 1; // Reduce shake bug

          if (lastStepOffsetWidth === offsetWidth || Math.abs(lastStepOffsetWidth - offsetWidth) <= 3) {
            return;
          }

          _this.setState({
            lastStepOffsetWidth: offsetWidth
          });
        });
      }
    });

    _this.state = {
      flexSupported: true,
      lastStepOffsetWidth: 0
    };
    _this.calcStepOffsetWidth = debounce_default()(_this.calcStepOffsetWidth, 150);
    return _this;
  }

  _createClass(Steps, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.calcStepOffsetWidth();

      if (!isFlexSupported()) {
        this.setState({
          flexSupported: false
        });
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.calcStepOffsetWidth();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.calcTimeout) {
        clearTimeout(this.calcTimeout);
      }

      if (this.calcStepOffsetWidth && this.calcStepOffsetWidth.cancel) {
        this.calcStepOffsetWidth.cancel();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames,
          _this2 = this;

      var _this$props2 = this.props,
          prefixCls = _this$props2.prefixCls,
          _this$props2$style = _this$props2.style,
          style = _this$props2$style === void 0 ? {} : _this$props2$style,
          className = _this$props2.className,
          children = _this$props2.children,
          direction = _this$props2.direction,
          type = _this$props2.type,
          labelPlacement = _this$props2.labelPlacement,
          iconPrefix = _this$props2.iconPrefix,
          status = _this$props2.status,
          size = _this$props2.size,
          current = _this$props2.current,
          progressDot = _this$props2.progressDot,
          initial = _this$props2.initial,
          icons = _this$props2.icons,
          onChange = _this$props2.onChange,
          restProps = _objectWithoutProperties(_this$props2, ["prefixCls", "style", "className", "children", "direction", "type", "labelPlacement", "iconPrefix", "status", "size", "current", "progressDot", "initial", "icons", "onChange"]);

      var isNav = type === 'navigation';
      var _this$state = this.state,
          lastStepOffsetWidth = _this$state.lastStepOffsetWidth,
          flexSupported = _this$state.flexSupported;
      var filteredChildren = reactfrom_dll_reference_dll_library_default.a.Children.toArray(children).filter(function (c) {
        return !!c;
      });
      var lastIndex = filteredChildren.length - 1;
      var adjustedlabelPlacement = progressDot ? 'vertical' : labelPlacement;
      var classString = classnames_default()(prefixCls, "".concat(prefixCls, "-").concat(direction), className, (_classNames = {}, _defineProperty(_classNames, "".concat(prefixCls, "-").concat(size), size), _defineProperty(_classNames, "".concat(prefixCls, "-label-").concat(adjustedlabelPlacement), direction === 'horizontal'), _defineProperty(_classNames, "".concat(prefixCls, "-dot"), !!progressDot), _defineProperty(_classNames, "".concat(prefixCls, "-navigation"), isNav), _defineProperty(_classNames, "".concat(prefixCls, "-flex-not-supported"), !flexSupported), _classNames));
      return reactfrom_dll_reference_dll_library_default.a.createElement("div", _extends({
        className: classString,
        style: style
      }, restProps), reactfrom_dll_reference_dll_library["Children"].map(filteredChildren, function (child, index) {
        if (!child) {
          return null;
        }

        var stepNumber = initial + index;

        var childProps = _objectSpread({
          stepNumber: "".concat(stepNumber + 1),
          stepIndex: stepNumber,
          prefixCls: prefixCls,
          iconPrefix: iconPrefix,
          wrapperStyle: style,
          progressDot: progressDot,
          icons: icons,
          onStepClick: onChange && _this2.onStepClick
        }, child.props);

        if (!flexSupported && direction !== 'vertical') {
          if (isNav) {
            childProps.itemWidth = "".concat(100 / (lastIndex + 1), "%");
            childProps.adjustMarginRight = 0;
          } else if (index !== lastIndex) {
            childProps.itemWidth = "".concat(100 / lastIndex, "%");
            childProps.adjustMarginRight = -Math.round(lastStepOffsetWidth / lastIndex + 1);
          }
        } // fix tail color


        if (status === 'error' && index === current - 1) {
          childProps.className = "".concat(prefixCls, "-next-error");
        }

        if (!child.props.status) {
          if (stepNumber === current) {
            childProps.status = status;
          } else if (stepNumber < current) {
            childProps.status = 'finish';
          } else {
            childProps.status = 'wait';
          }
        }

        childProps.active = stepNumber === current;
        return Object(reactfrom_dll_reference_dll_library["cloneElement"])(child, childProps);
      }));
    }
  }]);

  return Steps;
}(reactfrom_dll_reference_dll_library["Component"]);

_defineProperty(Steps_Steps, "propTypes", {
  type: prop_typesfrom_dll_reference_dll_library_default.a.string,
  prefixCls: prop_typesfrom_dll_reference_dll_library_default.a.string,
  className: prop_typesfrom_dll_reference_dll_library_default.a.string,
  iconPrefix: prop_typesfrom_dll_reference_dll_library_default.a.string,
  direction: prop_typesfrom_dll_reference_dll_library_default.a.string,
  labelPlacement: prop_typesfrom_dll_reference_dll_library_default.a.string,
  children: prop_typesfrom_dll_reference_dll_library_default.a.any,
  status: prop_typesfrom_dll_reference_dll_library_default.a.string,
  size: prop_typesfrom_dll_reference_dll_library_default.a.string,
  progressDot: prop_typesfrom_dll_reference_dll_library_default.a.oneOfType([prop_typesfrom_dll_reference_dll_library_default.a.bool, prop_typesfrom_dll_reference_dll_library_default.a.func]),
  style: prop_typesfrom_dll_reference_dll_library_default.a.object,
  initial: prop_typesfrom_dll_reference_dll_library_default.a.number,
  current: prop_typesfrom_dll_reference_dll_library_default.a.number,
  icons: prop_typesfrom_dll_reference_dll_library_default.a.shape({
    finish: prop_typesfrom_dll_reference_dll_library_default.a.node,
    error: prop_typesfrom_dll_reference_dll_library_default.a.node
  }),
  onChange: prop_typesfrom_dll_reference_dll_library_default.a.func
});

_defineProperty(Steps_Steps, "defaultProps", {
  type: 'default',
  prefixCls: 'rc-steps',
  iconPrefix: 'rc',
  direction: 'horizontal',
  labelPlacement: 'horizontal',
  initial: 0,
  current: 0,
  status: 'process',
  size: '',
  progressDot: false
});


// CONCATENATED MODULE: ./node_modules/rc-steps/es/Step.js
function Step_extends() { Step_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return Step_extends.apply(this, arguments); }

function Step_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function Step_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { Step_ownKeys(source, true).forEach(function (key) { Step_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { Step_ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function Step_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = Step_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function Step_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function Step_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Step_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Step_createClass(Constructor, protoProps, staticProps) { if (protoProps) Step_defineProperties(Constructor.prototype, protoProps); if (staticProps) Step_defineProperties(Constructor, staticProps); return Constructor; }

function Step_possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return Step_assertThisInitialized(self); }

function Step_getPrototypeOf(o) { Step_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return Step_getPrototypeOf(o); }

function Step_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function Step_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) Step_setPrototypeOf(subClass, superClass); }

function Step_setPrototypeOf(o, p) { Step_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return Step_setPrototypeOf(o, p); }

function Step_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





function isString(str) {
  return typeof str === 'string';
}

var Step_Step =
/*#__PURE__*/
function (_React$Component) {
  Step_inherits(Step, _React$Component);

  function Step() {
    var _getPrototypeOf2;

    var _this;

    Step_classCallCheck(this, Step);

    for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
      _args[_key] = arguments[_key];
    }

    _this = Step_possibleConstructorReturn(this, (_getPrototypeOf2 = Step_getPrototypeOf(Step)).call.apply(_getPrototypeOf2, [this].concat(_args)));

    Step_defineProperty(Step_assertThisInitialized(_this), "onClick", function () {
      var _this$props = _this.props,
          onClick = _this$props.onClick,
          onStepClick = _this$props.onStepClick,
          stepIndex = _this$props.stepIndex;

      if (onClick) {
        onClick.apply(void 0, arguments);
      }

      onStepClick(stepIndex);
    });

    return _this;
  }

  Step_createClass(Step, [{
    key: "renderIconNode",
    value: function renderIconNode() {
      var _classNames;

      var _this$props2 = this.props,
          prefixCls = _this$props2.prefixCls,
          progressDot = _this$props2.progressDot,
          stepNumber = _this$props2.stepNumber,
          status = _this$props2.status,
          title = _this$props2.title,
          description = _this$props2.description,
          icon = _this$props2.icon,
          iconPrefix = _this$props2.iconPrefix,
          icons = _this$props2.icons;
      var iconNode;
      var iconClassName = classnames_default()("".concat(prefixCls, "-icon"), "".concat(iconPrefix, "icon"), (_classNames = {}, Step_defineProperty(_classNames, "".concat(iconPrefix, "icon-").concat(icon), icon && isString(icon)), Step_defineProperty(_classNames, "".concat(iconPrefix, "icon-check"), !icon && status === 'finish' && icons && !icons.finish), Step_defineProperty(_classNames, "".concat(iconPrefix, "icon-close"), !icon && status === 'error' && icons && !icons.error), _classNames));
      var iconDot = reactfrom_dll_reference_dll_library_default.a.createElement("span", {
        className: "".concat(prefixCls, "-icon-dot")
      }); // `progressDot` enjoy the highest priority

      if (progressDot) {
        if (typeof progressDot === 'function') {
          iconNode = reactfrom_dll_reference_dll_library_default.a.createElement("span", {
            className: "".concat(prefixCls, "-icon")
          }, progressDot(iconDot, {
            index: stepNumber - 1,
            status: status,
            title: title,
            description: description
          }));
        } else {
          iconNode = reactfrom_dll_reference_dll_library_default.a.createElement("span", {
            className: "".concat(prefixCls, "-icon")
          }, iconDot);
        }
      } else if (icon && !isString(icon)) {
        iconNode = reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: "".concat(prefixCls, "-icon")
        }, icon);
      } else if (icons && icons.finish && status === 'finish') {
        iconNode = reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: "".concat(prefixCls, "-icon")
        }, icons.finish);
      } else if (icons && icons.error && status === 'error') {
        iconNode = reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: "".concat(prefixCls, "-icon")
        }, icons.error);
      } else if (icon || status === 'finish' || status === 'error') {
        iconNode = reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: iconClassName
        });
      } else {
        iconNode = reactfrom_dll_reference_dll_library_default.a.createElement("span", {
          className: "".concat(prefixCls, "-icon")
        }, stepNumber);
      }

      return iconNode;
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames2;

      var _this$props3 = this.props,
          className = _this$props3.className,
          prefixCls = _this$props3.prefixCls,
          style = _this$props3.style,
          itemWidth = _this$props3.itemWidth,
          active = _this$props3.active,
          _this$props3$status = _this$props3.status,
          status = _this$props3$status === void 0 ? 'wait' : _this$props3$status,
          iconPrefix = _this$props3.iconPrefix,
          icon = _this$props3.icon,
          wrapperStyle = _this$props3.wrapperStyle,
          adjustMarginRight = _this$props3.adjustMarginRight,
          stepNumber = _this$props3.stepNumber,
          disabled = _this$props3.disabled,
          description = _this$props3.description,
          title = _this$props3.title,
          subTitle = _this$props3.subTitle,
          progressDot = _this$props3.progressDot,
          tailContent = _this$props3.tailContent,
          icons = _this$props3.icons,
          stepIndex = _this$props3.stepIndex,
          onStepClick = _this$props3.onStepClick,
          onClick = _this$props3.onClick,
          restProps = Step_objectWithoutProperties(_this$props3, ["className", "prefixCls", "style", "itemWidth", "active", "status", "iconPrefix", "icon", "wrapperStyle", "adjustMarginRight", "stepNumber", "disabled", "description", "title", "subTitle", "progressDot", "tailContent", "icons", "stepIndex", "onStepClick", "onClick"]);

      var classString = classnames_default()("".concat(prefixCls, "-item"), "".concat(prefixCls, "-item-").concat(status), className, (_classNames2 = {}, Step_defineProperty(_classNames2, "".concat(prefixCls, "-item-custom"), icon), Step_defineProperty(_classNames2, "".concat(prefixCls, "-item-active"), active), Step_defineProperty(_classNames2, "".concat(prefixCls, "-item-disabled"), disabled === true), _classNames2));

      var stepItemStyle = Step_objectSpread({}, style);

      if (itemWidth) {
        stepItemStyle.width = itemWidth;
      }

      if (adjustMarginRight) {
        stepItemStyle.marginRight = adjustMarginRight;
      }

      var accessibilityProps = {};

      if (onStepClick && !disabled) {
        accessibilityProps.role = 'button';
        accessibilityProps.tabIndex = 0;
        accessibilityProps.onClick = this.onClick;
      }

      return reactfrom_dll_reference_dll_library_default.a.createElement("div", Step_extends({}, restProps, {
        className: classString,
        style: stepItemStyle
      }), reactfrom_dll_reference_dll_library_default.a.createElement("div", Step_extends({
        onClick: onClick
      }, accessibilityProps, {
        className: "".concat(prefixCls, "-item-container")
      }), reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: "".concat(prefixCls, "-item-tail")
      }, tailContent), reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: "".concat(prefixCls, "-item-icon")
      }, this.renderIconNode()), reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: "".concat(prefixCls, "-item-content")
      }, reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: "".concat(prefixCls, "-item-title")
      }, title, subTitle && reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        title: subTitle,
        className: "".concat(prefixCls, "-item-subtitle")
      }, subTitle)), description && reactfrom_dll_reference_dll_library_default.a.createElement("div", {
        className: "".concat(prefixCls, "-item-description")
      }, description))));
    }
  }]);

  return Step;
}(reactfrom_dll_reference_dll_library_default.a.Component);

Step_defineProperty(Step_Step, "propTypes", {
  className: prop_typesfrom_dll_reference_dll_library_default.a.string,
  prefixCls: prop_typesfrom_dll_reference_dll_library_default.a.string,
  style: prop_typesfrom_dll_reference_dll_library_default.a.object,
  wrapperStyle: prop_typesfrom_dll_reference_dll_library_default.a.object,
  itemWidth: prop_typesfrom_dll_reference_dll_library_default.a.oneOfType([prop_typesfrom_dll_reference_dll_library_default.a.number, prop_typesfrom_dll_reference_dll_library_default.a.string]),
  active: prop_typesfrom_dll_reference_dll_library_default.a.bool,
  disabled: prop_typesfrom_dll_reference_dll_library_default.a.bool,
  status: prop_typesfrom_dll_reference_dll_library_default.a.string,
  iconPrefix: prop_typesfrom_dll_reference_dll_library_default.a.string,
  icon: prop_typesfrom_dll_reference_dll_library_default.a.node,
  adjustMarginRight: prop_typesfrom_dll_reference_dll_library_default.a.oneOfType([prop_typesfrom_dll_reference_dll_library_default.a.number, prop_typesfrom_dll_reference_dll_library_default.a.string]),
  stepNumber: prop_typesfrom_dll_reference_dll_library_default.a.string,
  stepIndex: prop_typesfrom_dll_reference_dll_library_default.a.number,
  description: prop_typesfrom_dll_reference_dll_library_default.a.any,
  title: prop_typesfrom_dll_reference_dll_library_default.a.any,
  subTitle: prop_typesfrom_dll_reference_dll_library_default.a.any,
  progressDot: prop_typesfrom_dll_reference_dll_library_default.a.oneOfType([prop_typesfrom_dll_reference_dll_library_default.a.bool, prop_typesfrom_dll_reference_dll_library_default.a.func]),
  tailContent: prop_typesfrom_dll_reference_dll_library_default.a.any,
  icons: prop_typesfrom_dll_reference_dll_library_default.a.shape({
    finish: prop_typesfrom_dll_reference_dll_library_default.a.node,
    error: prop_typesfrom_dll_reference_dll_library_default.a.node
  }),
  onClick: prop_typesfrom_dll_reference_dll_library_default.a.func,
  onStepClick: prop_typesfrom_dll_reference_dll_library_default.a.func
});


// CONCATENATED MODULE: ./node_modules/rc-steps/es/index.js


Steps_Steps.Step = Step_Step;

/* harmony default export */ var es = __webpack_exports__["default"] = (Steps_Steps);

/***/ })

/******/ });