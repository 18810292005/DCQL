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
/******/ 		14: 0
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
/******/ 	deferredModules.push([1675,0]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 1075:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 116:
/***/ (function(module, exports) {

module.exports = window.django;

/***/ }),

/***/ 1675:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(85);
__webpack_require__(86);
__webpack_require__(87);
module.exports = __webpack_require__(1832);


/***/ }),

/***/ 1676:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1677:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1678:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1679:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 1680:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 178:
/***/ (function(module, exports) {

module.exports = window.jQuery;

/***/ }),

/***/ 1832:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/antd/lib/modal/style/index.js
var style = __webpack_require__(45);

// EXTERNAL MODULE: ./node_modules/antd/lib/modal/index.js
var modal = __webpack_require__(15);
var modal_default = /*#__PURE__*/__webpack_require__.n(modal);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/style/index.js
var button_style = __webpack_require__(32);

// EXTERNAL MODULE: ./node_modules/antd/lib/button/index.js
var lib_button = __webpack_require__(5);
var button_default = /*#__PURE__*/__webpack_require__.n(lib_button);

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

// EXTERNAL MODULE: ./components/layout/Container.tsx
var Container = __webpack_require__(79);

// EXTERNAL MODULE: ./components/layout/MgeLayout.tsx + 7 modules
var MgeLayout = __webpack_require__(48);

// EXTERNAL MODULE: ./utils/global.ts
var global = __webpack_require__(214);

// EXTERNAL MODULE: ./node_modules/antd/lib/icon/style/index.js
var icon_style = __webpack_require__(125);

// EXTERNAL MODULE: ./node_modules/antd/lib/icon/index.js
var icon = __webpack_require__(28);
var icon_default = /*#__PURE__*/__webpack_require__.n(icon);

// EXTERNAL MODULE: ./apis/template/Get.ts
var Get = __webpack_require__(65);

// EXTERNAL MODULE: ./apis/define/FieldType.ts
var FieldType = __webpack_require__(6);

// EXTERNAL MODULE: ./views/SelectorView.less
var SelectorView = __webpack_require__(1676);

// CONCATENATED MODULE: ./views/SelectorView.ts
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var $ = __webpack_require__(178);


var SelectorView_SelectorView = /*#__PURE__*/function () {
  function SelectorView(members, defaultValue, dividers) {
    var _this = this;

    _classCallCheck(this, SelectorView);

    this.members = members;
    this.onChooseListeners = [];
    this.view = $("\n      <div class=\"selector\">\n        <button class=\"btn btn-default\">".concat(django.gettext('[Select a choice]'), "</button>\n        <span class=\"caret\"></span>\n        <ul class=\"hide\">\n        </ul>\n      </div>\n    "));
    var ul = this.view.find('ul');
    var button = this.view.find('button');

    var globalClickListener = function globalClickListener(event) {
      if (!$(event.target).closest('#menucontainer').length) {
        if (!ul.hasClass('hide')) {
          ul.addClass('hide');
          $(document).unbind('click', globalClickListener);
        }
      }
    };

    button.click(function (e) {
      $(this).blur();
      e.stopPropagation();
      ul.removeClass('hide');
      $(document).bind('click', globalClickListener);
    });
    members.ForEach(function (name, value) {
      var li = $("<li><a href=\"javascript:void(0)\">".concat(name, "</a></li>"));
      li.click(function () {
        if (_this._value === value) {
          return;
        }

        var ret = true;

        var _iterator = _createForOfIteratorHelper(_this.onChooseListeners),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var i = _step.value;
            ret = ret && i(_this._value, value);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        if (ret) {
          _this._value = value;

          _this.view.find('button').text(name);

          ul.addClass('hide');
          $(document).unbind('click', globalClickListener);
        }
      });

      if (dividers != null) {
        var _iterator2 = _createForOfIteratorHelper(dividers),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var i = _step2.value;

            if (i.before === value) {
              ul.append($("<li class=\"divider\"><a href=\"javascript:void(0)\"><bold>".concat(i.name, "</bold></a></li>")));
              break;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      ul.append(li);
    });
    this.Choose(defaultValue);
  }

  _createClass(SelectorView, [{
    key: "Choose",
    value: function Choose(value) {
      this._value = value;
      this.view.find('button').text(this.members.ValueToName(value));
    }
  }, {
    key: "AddOnChooseListener",
    value: function AddOnChooseListener(listener) {
      this.onChooseListeners.push(listener);
    }
  }, {
    key: "GetView",
    value: function GetView() {
      return this.view;
    }
  }, {
    key: "Value",
    value: function Value() {
      return this._value;
    }
  }]);

  return SelectorView;
}();
// CONCATENATED MODULE: ./utils/Enum.ts
function Enum_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Enum_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Enum_createClass(Constructor, protoProps, staticProps) { if (protoProps) Enum_defineProperties(Constructor.prototype, protoProps); if (staticProps) Enum_defineProperties(Constructor, staticProps); return Constructor; }

/**
 * 枚举类
 * 使用一个名字的字符串数组初始化
 */
var Enum = /*#__PURE__*/function () {
  function Enum(names, values) {
    Enum_classCallCheck(this, Enum);

    this.names = names;
    this.values = values;

    if (this.names.length !== this.values.length) {
      throw new Error('Enum: Unmatch names and values');
    }
  }
  /**
   * 获得所有枚举值的数组
   */


  Enum_createClass(Enum, [{
    key: "GetValueArray",
    value: function GetValueArray() {
      return this.values;
    }
    /**
     * 获得所有枚举值名字的数组
     * 保证和GetValueArray的返回值一一对应
     */

  }, {
    key: "GetNameArray",
    value: function GetNameArray() {
      return this.names;
    }
    /**
     * 名字转换为值，如果没有找到返回-1
     * @param name 名字
     */

  }, {
    key: "NameToValue",
    value: function NameToValue(name) {
      var index = this.names.indexOf(name);
      return this.values[index];
    }
    /**
     * 值转换为名字，如果没有找到返回undefined
     * @param value 值
     */

  }, {
    key: "ValueToName",
    value: function ValueToName(value) {
      var index = this.values.indexOf(value);
      return this.names[index];
    }
  }, {
    key: "ForEach",
    value: function ForEach(callback) {
      var length = this.names.length;

      for (var i = 0; i < length; ++i) {
        callback(this.names[i], this.values[i]);
      }
    }
  }]);

  return Enum;
}();
// CONCATENATED MODULE: ./utils/Template.ts
function Template_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = Template_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function Template_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return Template_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return Template_arrayLikeToArray(o, minLen); }

function Template_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function Template_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function Template_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function Template_createClass(Constructor, protoProps, staticProps) { if (protoProps) Template_defineProperties(Constructor.prototype, protoProps); if (staticProps) Template_defineProperties(Constructor, staticProps); return Constructor; }




var TokenType;

(function (TokenType) {
  TokenType[TokenType["Field"] = 0] = "Field";
  TokenType[TokenType["RangeValue"] = 1] = "RangeValue";
  TokenType[TokenType["ArrayContent"] = 2] = "ArrayContent";
  TokenType[TokenType["GeneratorOption"] = 3] = "GeneratorOption";
  TokenType[TokenType["TableColumn"] = 4] = "TableColumn";
})(TokenType || (TokenType = {}));

function FieldTypeToString(f) {
  switch (f) {
    case FieldType["a" /* FieldType */].String:
      return "[".concat(django.gettext('String'), "]");

    case FieldType["a" /* FieldType */].Number:
      return "[".concat(django.gettext('Number'), "]");

    case FieldType["a" /* FieldType */].Range:
      return "[".concat(django.gettext('Range'), "]");

    case FieldType["a" /* FieldType */].Image:
      return "[".concat(django.gettext('Image'), "]");

    case FieldType["a" /* FieldType */].File:
      return "[".concat(django.gettext('File'), "]");

    case FieldType["a" /* FieldType */].Choice:
      return "[".concat(django.gettext('Choice'), "]");

    case FieldType["a" /* FieldType */].Array:
      return "[".concat(django.gettext('Array'), "]");

    case FieldType["a" /* FieldType */].Table:
      return "[".concat(django.gettext('Table'), "]");

    case FieldType["a" /* FieldType */].Container:
      return "[".concat(django.gettext('Container'), "]");

    case FieldType["a" /* FieldType */].Generator:
      return "[".concat(django.gettext('Generator'), "]");

    default:
      {
        return "[".concat(django.gettext('Parse error'), "]");
      }
  }
}
var Template_Parser = /*#__PURE__*/function () {
  function Parser(handler) {
    Template_classCallCheck(this, Parser);

    this.handler = handler;
  }

  Template_createClass(Parser, [{
    key: "Parse",
    value: function Parse(template) {
      var rootNode = this.handler.onCreateRoot();
      this.ContainerParser(rootNode, template);
      return rootNode;
    }
    /**
     * 解析一个字段，注意它会返回一个wrapper
     * @param template 对应模板的misc
     * @param name 给这个字段的名字
     * @param rootPath 根路径
     */

  }, {
    key: "ParseOneField",
    value: function ParseOneField(template, name, tokenType, rootPath) {
      var rootNode = this.handler.onCreateRoot();

      if (tokenType == null) {
        tokenType = TokenType.Field;
      }

      this.FieldParser(rootNode, tokenType, name, template);
      return rootNode;
    }
  }, {
    key: "FieldParser",
    value: function FieldParser(parent, tokenType, name, template) {
      var ret = this.handler.handleField(parent, name, template.t, tokenType, template);

      if (ret.returnNode == null) {
        return;
      }

      parent.children.push(ret.returnNode);

      if (!FieldType["a" /* FieldType */].isPrimitive(template.t) && ret.parseChild) {
        if (template.t === FieldType["a" /* FieldType */].Container) {
          this.ContainerParser(ret.returnNode, template.misc);
        } else if (template.t === FieldType["a" /* FieldType */].Array) {
          this.ArrayParser(ret.returnNode, template.misc);
        } else if (template.t === FieldType["a" /* FieldType */].Table) {
          this.TableParser(ret.returnNode, template.misc);
        } else if (template.t === FieldType["a" /* FieldType */].Generator) {
          this.GeneratorParser(ret.returnNode, template.misc);
        }
      }
    }
  }, {
    key: "AbstractCompositeParser",
    value: function AbstractCompositeParser(parent, template, cursorName, tokenType) {
      var cursor = template[cursorName];

      var _iterator = Template_createForOfIteratorHelper(cursor),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var name = _step.value;
          this.FieldParser(parent, tokenType, name, template[name]);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "ContainerParser",
    value: function ContainerParser(parent, template) {
      this.AbstractCompositeParser(parent, template, '_ord', TokenType.Field);
    }
  }, {
    key: "GeneratorParser",
    value: function GeneratorParser(parent, template) {
      this.AbstractCompositeParser(parent, template, '_opt', TokenType.GeneratorOption);
    }
  }, {
    key: "ArrayParser",
    value: function ArrayParser(parent, template) {
      this.FieldParser(parent, TokenType.ArrayContent, String(Number(template.t)), template);
    }
  }, {
    key: "TableParser",
    value: function TableParser(parent, template) {
      this.AbstractCompositeParser(parent, template, '_head', TokenType.TableColumn);
    }
  }]);

  return Parser;
}();
function ChoiceToSelectorView(choiceMisc) {
  var option = [];
  var dividers = [];
  option = option.concat(choiceMisc.opt);
  choiceMisc.grp.map(function (value) {
    dividers.push({
      name: value.name,
      before: value.items[0]
    });
    option = option.concat(value.items);
  });
  var en = new Enum(option, option);
  return new SelectorView_SelectorView(en, en.values[0], dividers);
}
// EXTERNAL MODULE: ./utils/GenerateUniqueID.ts
var GenerateUniqueID = __webpack_require__(151);

// EXTERNAL MODULE: ./views/TreeView.scss
var views_TreeView = __webpack_require__(1677);

// CONCATENATED MODULE: ./views/TreeView.ts
function TreeView_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = TreeView_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function TreeView_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return TreeView_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return TreeView_arrayLikeToArray(o, minLen); }

function TreeView_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function TreeView_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function TreeView_createClass(Constructor, protoProps, staticProps) { if (protoProps) TreeView_defineProperties(Constructor.prototype, protoProps); if (staticProps) TreeView_defineProperties(Constructor, staticProps); return Constructor; }

function TreeView_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var TreeView_$ = __webpack_require__(178);


/**
 * UserNode
 * 用户提供的节点信息
 * TreeView会将其中的内容提取出来构造树结构
 */

var UserNode = function UserNode(info, content, isLeaf) {
  TreeView_classCallCheck(this, UserNode);

  this.info = info;
  this.content = content;
  this.children = [];
  this.isLeaf = isLeaf;
};
/**
 * 树结构的节点
 * 实际上整个树就是一个根节点
 */

var Node = /*#__PURE__*/function () {
  function Node(provider, userNode, parent) {
    TreeView_classCallCheck(this, Node);

    // 设置好各项参数
    this.info = userNode.info;
    this.content = userNode.content;
    this.isLeaf = userNode.isLeaf;
    this.children = [];
    this.provider = provider;
    this.parent = parent;
    this.view = this.provider.onContructItem(this, parent == null);

    if (!this.isLeaf) {
      var _iterator = TreeView_createForOfIteratorHelper(userNode.children),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var i = _step.value;
          this.Append(i);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }

  TreeView_createClass(Node, [{
    key: "Append",
    value: function Append(node) {
      if (this.isLeaf) {
        return;
      }

      var newNode = new Node(this.provider, node, this);
      this.children.push(newNode); // 调用这个函数完成对View的操作

      this.provider.onAppendNode(this, newNode);
    }
  }, {
    key: "Delete",
    value: function Delete() {
      this.provider.onDeleteNode(this.parent, this); // 然后从父元素的children删除自己

      if (this.parent != null) {
        var brothers = this.parent.children;
        var index = brothers.indexOf(this);

        if (index !== -1) {
          brothers.splice(brothers.indexOf(this), 1);
        }
      }
    }
  }, {
    key: "DeleteChild",
    value: function DeleteChild(node) {
      if (this.isLeaf) {
        return;
      }

      var _iterator2 = TreeView_createForOfIteratorHelper(this.children),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var i = _step2.value;
          this.provider.onDeleteNode(this, i);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      this.children = [];
    }
  }, {
    key: "FindUnique",
    value: function FindUnique(comparator) {
      if (comparator(this.info)) {
        return this;
      } else {
        if (this.isLeaf) {
          return null;
        }

        var _iterator3 = TreeView_createForOfIteratorHelper(this.children),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var i = _step3.value;
            var result = i.FindUnique(comparator);

            if (result != null) {
              return result;
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }

      return null;
    }
  }, {
    key: "Children",
    value: function Children() {
      if (this.isLeaf) {
        return;
      }

      return this.children;
    }
  }]);

  return Node;
}();
var TreeViewConfig = function TreeViewConfig() {
  TreeView_classCallCheck(this, TreeViewConfig);
};
/**
 * TreeView的事件
 */

var TreeViewEvent;

(function (TreeViewEvent) {
  TreeViewEvent[TreeViewEvent["Click"] = 0] = "Click";
  TreeViewEvent[TreeViewEvent["Delete"] = 1] = "Delete";
})(TreeViewEvent || (TreeViewEvent = {}));

var TreeView_TreeView = /*#__PURE__*/function () {
  function TreeView(nodes, config) {
    TreeView_classCallCheck(this, TreeView);

    this.config = config;
    this.onEventListeners = [];

    if (this.config.showIcon) {
      this.rootView = TreeView_$('<ul class="tree-view animated"></ul>');
    } else {
      this.rootView = TreeView_$('<ul class="tree-view-no-icon animated"></ul>');
    }

    this.nodes = [];

    var _iterator4 = TreeView_createForOfIteratorHelper(nodes),
        _step4;

    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var i = _step4.value;
        var node = new Node(this, i, null);
        this.nodes.push(node);
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  }

  TreeView_createClass(TreeView, [{
    key: "GetView",
    value: function GetView() {
      return this.rootView;
    }
    /**
     * 添加事件监听器
     * @param listener 监听器
     * @returns 返回true则该事件会发生实际作用，反之不会
     * 例如，非叶子节点的Click事件导致列表收起或展开，如果返回false那么没有对应的效果
     */

  }, {
    key: "AddEventListener",
    value: function AddEventListener(listener) {
      this.onEventListeners.push(listener);
    }
    /**
     * 获取所有根节点
     * 用户使用这种方式拿到树结构并进行操作
     */

  }, {
    key: "GetRootNodes",
    value: function GetRootNodes() {
      return this.nodes;
    }
  }, {
    key: "onContructItem",
    value: function onContructItem(node, isRoot) {
      var _this = this;

      var view = TreeView_$('<li></li>');
      var contentWrapper = null;

      if (node.isLeaf) {
        var a = TreeView_$("<a class=\"item\" href=\"javascript:void(0)\">".concat(node.content, "</a>"));
        contentWrapper = a;
        a.click(function () {
          var _iterator5 = TreeView_createForOfIteratorHelper(_this.onEventListeners),
              _step5;

          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var listener = _step5.value;
              listener(node, TreeViewEvent.Click);
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
        });
        view.append(a);
      } else {
        var id = Object(GenerateUniqueID["a" /* GenerateUniqueID */])();
        var checkbox = TreeView_$("<input class=\"item\" type=\"checkbox\" id=\"".concat(id, "\">"));

        if (this.config.expandAll) {
          checkbox.prop('checked', true);
        }

        checkbox.change(function () {
          var checked = checkbox.prop('checked');
          var result = true;

          var _iterator6 = TreeView_createForOfIteratorHelper(_this.onEventListeners),
              _step6;

          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var listener = _step6.value;
              result = result && listener(node, TreeViewEvent.Click);
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }

          if (result) {
            if (checkbox.prop('checked')) {
              checkbox.siblings('ul').attr('style', 'display:none;').slideDown(200);
            } else {
              checkbox.siblings('ul').attr('style', 'display:block;').slideUp(200);
            }
          } else {
            checkbox.prop('checked', !checked);
          }
        });
        var label = TreeView_$("<label class=\"item\" for=\"".concat(id, "\">").concat(node.content, "</label>"));
        contentWrapper = label;
        var ul = TreeView_$('<ul></ul>');
        view.append(checkbox, label, ul);
      }

      if (this.config.showDelete) {
        var deleteBtn = TreeView_$("<button class=\"delete-button\">\n          <i class=\"material-icons\">close</i>\n        </button>");
        var that = this;
        deleteBtn.click(function (e) {
          e.stopPropagation();
          TreeView_$(this).blur();

          var _iterator7 = TreeView_createForOfIteratorHelper(that.onEventListeners),
              _step7;

          try {
            for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
              var listener = _step7.value;
              listener(node, TreeViewEvent.Delete);
            }
          } catch (err) {
            _iterator7.e(err);
          } finally {
            _iterator7.f();
          }
        });
        contentWrapper.append(deleteBtn);
      }

      if (isRoot) {
        this.rootView.append(view);
      }

      return view;
    }
  }, {
    key: "onAppendNode",
    value: function onAppendNode(parent, child) {
      parent.view.find('>ul').append(child.view);
    }
  }, {
    key: "onDeleteNode",
    value: function onDeleteNode(parent, child) {
      child.view.remove();
    }
  }]);

  return TreeView;
}();
// CONCATENATED MODULE: ./TemplateToTreeForSearch.ts





function createSearchParserHandler(rootPath) {
  return {
    onCreateRoot: function onCreateRoot() {
      // 这里用一下Null类，最后提取时会把它丢掉
      return new UserNode({
        path: rootPath,
        type: FieldType["a" /* FieldType */].Null,
        name: rootPath
      }, rootPath, false);
    },
    handleField: function handleField(parent, name, fieldType, tokenType, templateContent) {
      var required = templateContent.r || false;
      var misc = templateContent.misc;
      var returnNode = null;
      var parseChild = true;
      var path = parent.info.path + '.' + name;

      if (parent.info.path.length === 0) {
        path = name;
      }

      if (tokenType === TokenType.ArrayContent) {
        path = parent.info.path + '.' + String(fieldType);
      }

      if (FieldType["a" /* FieldType */].isPrimitive(fieldType)) {
        returnNode = new UserNode({
          path: path,
          type: fieldType,
          required: required,
          misc: misc,
          name: name
        }, name, true);

        if (fieldType === FieldType["a" /* FieldType */].Range) {
          var lb = 'lb';
          var lbText = name + ': ' + django.gettext('Lower bound');
          var ub = 'ub';
          var ubText = name + ': ' + django.gettext('Upper bound');

          if (templateContent.misc.type === 1) {
            lb = 'val', ub = 'err';
            lbText = name + ': ' + django.gettext('Value');
            ubText = name + ': ' + django.gettext('Error value');
          }

          returnNode.isLeaf = false;
          returnNode.children = [new UserNode({
            path: path + '.' + lb,
            type: FieldType["a" /* FieldType */].Number,
            required: required,
            misc: {},
            name: lbText
          }, lbText, true), new UserNode({
            path: path + '.' + ub,
            type: FieldType["a" /* FieldType */].Number,
            required: required,
            misc: {},
            name: ubText
          }, ubText, true)];
        }
      } else if (FieldType["a" /* FieldType */].isComposite(fieldType) || FieldType["a" /* FieldType */].isArray(fieldType)) {
        returnNode = new UserNode({
          path: path,
          type: fieldType,
          required: required,
          misc: misc,
          name: name
        }, name, false);

        if (fieldType === FieldType["a" /* FieldType */].Array || fieldType === FieldType["a" /* FieldType */].Table) {
          parseChild = false;
          returnNode.isLeaf = true;
        }
      }

      return {
        returnNode: returnNode,
        parseChild: parseChild
      };
    }
  };
}

function TemplateToUserNode(template, root) {
  if (root == null) {
    root = '';
  }

  var handler = createSearchParserHandler(root);
  var parser = new Template_Parser(handler);
  var result = parser.Parse(template);
  return result;
}

function CreateTemplateTreeView(template) {
  var nodes = TemplateToUserNode(template); // 去掉顶层节点

  return new TreeView_TreeView(nodes.children, {
    showDelete: false,
    showIcon: false,
    expandAll: true,
    slideUpOthers: false,
    scrollToView: false
  });
}

function AsyncTemplateIDToTreeViewForSearch(templateID, callback) {
  Object(Get["d" /* RawGetTemplate */])(templateID).then(function (data) {
    callback(CreateTemplateTreeView(data.content));
  });
}
function TableMiscToUserNode(misc, tablePath) {
  misc._ord = misc._head;
  return TemplateToUserNode(misc, tablePath);
}
function ArrayMiscToUserNode(misc, arrayPath) {
  var handler = createSearchParserHandler(arrayPath);
  var parser = new Template_Parser(handler);
  var rootNode = parser.ParseOneField(misc, FieldTypeToString(misc.t), TokenType.ArrayContent, arrayPath);
  return rootNode.children[0];
}
// EXTERNAL MODULE: ./apis/define/search.ts
var search = __webpack_require__(18);

// EXTERNAL MODULE: ./apis/Fetch.ts
var Fetch = __webpack_require__(7);

// CONCATENATED MODULE: ./apis/Search.ts
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// import * as $ from 'jquery';




var GroupSearchSortType;

(function (GroupSearchSortType) {
  GroupSearchSortType["TemplateTitle"] = "t-title";
  GroupSearchSortType["TemplateCount"] = "t-count";
})(GroupSearchSortType || (GroupSearchSortType = {}));

var SearchSortType;

(function (SearchSortType) {
  SearchSortType["DataTitle"] = "d-title";
  SearchSortType["DataTime"] = "d-time";
  SearchSortType["DataDOI"] = "d-doi";
  SearchSortType["DataAuthor"] = "d-author";
  SearchSortType["DataDownlaods"] = "d-downloads";
  SearchSortType["DataViews"] = "d-views";
  SearchSortType["DataScore"] = "d-score";
})(SearchSortType || (SearchSortType = {}));

var SearchOrderType;

(function (SearchOrderType) {
  SearchOrderType["Descending"] = "desc";
  SearchOrderType["Ascending"] = "asc";
})(SearchOrderType || (SearchOrderType = {}));

var ConditionType;

(function (ConditionType) {
  ConditionType["Field"] = "field";
  ConditionType["And"] = "and";
  ConditionType["Or"] = "or";
})(ConditionType || (ConditionType = {}));

function RawSearch(_x) {
  return _RawSearch.apply(this, arguments);
}

function _RawSearch() {
  _RawSearch = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(config) {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", Object(Fetch["k" /* default */])(Urls["b" /* default */].api_v1_search.query, 'POST', config));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _RawSearch.apply(this, arguments);
}

function FieldTypeToOperatorList(type, required) {
  if (required == null) {
    required = false;
  }

  var ret = [];

  if (type === FieldType["a" /* FieldType */].String || type === FieldType["a" /* FieldType */].Choice) {
    ret.push(search["a" /* Search */].Operator.Equal, search["a" /* Search */].Operator.NotEqual, search["a" /* Search */].Operator.StrBeginWith, search["a" /* Search */].Operator.StrContain, search["a" /* Search */].Operator.StrEndWith, search["a" /* Search */].Operator.StrNotBeginWith, search["a" /* Search */].Operator.StrNotCotain, search["a" /* Search */].Operator.StrNotEndWith);
  } else if (type === FieldType["a" /* FieldType */].Number) {
    ret.push(search["a" /* Search */].Operator.Equal, search["a" /* Search */].Operator.NotEqual, search["a" /* Search */].Operator.Greater, search["a" /* Search */].Operator.GreaterOrEqual, search["a" /* Search */].Operator.Less, search["a" /* Search */].Operator.LessOrEqual);
  } else if (type === FieldType["a" /* FieldType */].Table || type === FieldType["a" /* FieldType */].Array) {
    ret.push(search["a" /* Search */].Operator.T_All, search["a" /* Search */].Operator.T_AllNot, search["a" /* Search */].Operator.T_Exist);
  } else if (type === FieldType["a" /* FieldType */].Container || type === FieldType["a" /* FieldType */].Generator || type === FieldType["a" /* FieldType */].Image || type === FieldType["a" /* FieldType */].File) {// do nothing
  } else {
    throw new Error('Invalid field type');
  }

  if (!required) {
    ret.push(search["a" /* Search */].Operator.Null, search["a" /* Search */].Operator.NotNull);
  }

  return ret;
}
// CONCATENATED MODULE: ./views/ButtonGroupView.ts
function ButtonGroupView_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = ButtonGroupView_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function ButtonGroupView_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return ButtonGroupView_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ButtonGroupView_arrayLikeToArray(o, minLen); }

function ButtonGroupView_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ButtonGroupView_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ButtonGroupView_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ButtonGroupView_createClass(Constructor, protoProps, staticProps) { if (protoProps) ButtonGroupView_defineProperties(Constructor.prototype, protoProps); if (staticProps) ButtonGroupView_defineProperties(Constructor, staticProps); return Constructor; }

var ButtonGroupView_$ = __webpack_require__(178);

var ButtonSize;

(function (ButtonSize) {
  ButtonSize[ButtonSize["Small"] = 0] = "Small";
  ButtonSize[ButtonSize["Normal"] = 1] = "Normal";
  ButtonSize[ButtonSize["Large"] = 2] = "Large";
})(ButtonSize || (ButtonSize = {}));

function CreateButtonGroupView(names, values, onClickHandler) {
  var buttonSize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ButtonSize.Normal;
  var isSingle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  var defaultValue = arguments.length > 5 ? arguments[5] : undefined;
  var rootView = ButtonGroupView_$('<div class="btn-group" role="group"></div>');

  if (buttonSize === ButtonSize.Large) {
    rootView.addClass('btn-group-lg');
  } else if (buttonSize === ButtonSize.Small) {
    rootView.addClass('btn-group-sm');
  }

  var _loop = function _loop(i) {
    var name = names[i];
    var view = ButtonGroupView_$('<button type="button" class="btn btn-default">' + name + '</button>');

    if (defaultValue === values[i]) {
      view.addClass('btn-primary');
    }

    view.click(function () {
      var ret = onClickHandler(values[i]);

      if (ret) {
        if (isSingle) {
          rootView.children('button').removeClass('btn-primary');
        }

        view.addClass('btn-primary');
      }
    });
    rootView.append(view);
  };

  for (var i = 0; i < names.length; ++i) {
    _loop(i);
  }

  return rootView;
}
var ButtonGroupView = /*#__PURE__*/function () {
  function ButtonGroupView(names, values, defaultValue) {
    var _this = this;

    ButtonGroupView_classCallCheck(this, ButtonGroupView);

    this.onChangeListeners = [];
    this.values = values;
    this.defaultValue = defaultValue;
    this._value = this.defaultValue;
    this.view = ButtonGroupView_$('<div class="btn-group btn-group-lg" role="group"></div>');

    var _loop2 = function _loop2(i) {
      var name = names[i];
      var value = values[i];
      var view = ButtonGroupView_$("<button type=\"button\" class=\"btn btn-default\">".concat(name, "</button>"));

      if (defaultValue === value) {
        view.addClass('btn-primary');
      }

      view.click(function () {
        _this.view.children('button').removeClass('btn-primary');

        view.addClass('btn-primary');
        _this.value = value;
      });

      _this.view.append(view);
    };

    for (var i = 0; i < names.length; ++i) {
      _loop2(i);
    }
  }

  ButtonGroupView_createClass(ButtonGroupView, [{
    key: "value",
    get: function get() {
      return this._value;
    },
    set: function set(src) {
      if (this._value !== src) {
        var old = this._value;
        this._value = src;
        var index = this.values.indexOf(src);
        this.view.children('button').removeClass('btn-primary');

        if (index !== -1) {
          ButtonGroupView_$(this.view.children('button').get(index)).addClass('btn-primary');
        }

        var _iterator = ButtonGroupView_createForOfIteratorHelper(this.onChangeListeners),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var i = _step.value;
            i(old, this.value);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
    /**
     * 禁用某个选项，如果该选项刚好是当前选中的，则使用用户给出的newValue值
     * @param value
     * @param newValue
     */

  }, {
    key: "Disable",
    value: function Disable(value, newValue) {
      var index = this.values.indexOf(value);
      ButtonGroupView_$(this.view.children('button').get(index)).prop('disabled', true);

      if (this.value === value) {
        this.value = newValue;
      }
    }
  }, {
    key: "Enable",
    value: function Enable(value) {
      var index = this.values.indexOf(value);
      ButtonGroupView_$(this.view.children('button').get(index)).prop('disabled', false);
    }
  }, {
    key: "EnableAll",
    value: function EnableAll() {
      var _iterator2 = ButtonGroupView_createForOfIteratorHelper(this.values),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var i = _step2.value;
          this.Enable(i);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    /**
     * 值改变时触发
     * @param listener
     */

  }, {
    key: "addOnChangeListener",
    value: function addOnChangeListener(listener) {
      this.onChangeListeners.push(listener);
    }
  }, {
    key: "GetView",
    value: function GetView() {
      return this.view;
    }
  }]);

  return ButtonGroupView;
}();
// EXTERNAL MODULE: external "window.django"
var external_window_django_ = __webpack_require__(116);

// EXTERNAL MODULE: ./views/ModalWindowView.scss
var ModalWindowView = __webpack_require__(1678);

// CONCATENATED MODULE: ./views/ModalWindowView.ts
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function ModalWindowView_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ModalWindowView_createClass(Constructor, protoProps, staticProps) { if (protoProps) ModalWindowView_defineProperties(Constructor.prototype, protoProps); if (staticProps) ModalWindowView_defineProperties(Constructor, staticProps); return Constructor; }

function ModalWindowView_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModalWindowView_$ = __webpack_require__(178);



var Effect;

(function (Effect) {
  Effect[Effect["FadeInAndScale"] = 1] = "FadeInAndScale";
  Effect[Effect["SlideInFromRight"] = 2] = "SlideInFromRight";
  Effect[Effect["SlideInFromBottom"] = 3] = "SlideInFromBottom";
  Effect[Effect["StickyUp"] = 7] = "StickyUp";
})(Effect || (Effect = {}));

var ModalWindowViewConfig = function ModalWindowViewConfig() {
  ModalWindowView_classCallCheck(this, ModalWindowViewConfig);
};
/**
 * 用户构造内容的jQuery传递给ModalView
 * 然后调用GetView方法获得Modal的jQuery对象加入到DOM树
 * 最后在符合条件情况下调用Show显示它
 * ModalWindow是自管理的，不需要用户手动把它加入到某个对象中
 */

var overlay = ModalWindowView_$('<div class="md-overlay"></div>');
var BaseModalWindowView = /*#__PURE__*/function () {
  function BaseModalWindowView(config) {
    ModalWindowView_classCallCheck(this, BaseModalWindowView);

    this.config = config;
    this.isShown = false;
    this.view = ModalWindowView_$("<div class=\"md-modal md-effect-".concat(this.config.effect, " ").concat(this.config.blur ? 'md-effect-blur' : '', "\">\n        <div class=\"md-content\"></div>\n      </div>"));
    this.view.find('.md-content').append(config.content);

    if (ModalWindowView_$('body').find('.md-overlay').length === 0) {
      ModalWindowView_$('body').append(overlay);
    }
  }
  /**
   * 显示模态窗口
   */


  ModalWindowView_createClass(BaseModalWindowView, [{
    key: "Show",
    value: function Show() {
      var _this = this;

      this.isShown = true;

      if (this.config.clickOverlayToClose) {
        this.view.unbind('click').click(function () {
          _this.Hide();
        });
        this.view.find('.md-content').unbind('click').click(function (event) {
          event.stopPropagation();
        });
      }

      ModalWindowView_$('body').prepend(this.view);
      setTimeout(function () {
        _this.view.addClass('md-show');
      }, 100); // this.view.addClass('md-show');
    }
    /**
     * 隐藏模态窗口
     */

  }, {
    key: "Hide",
    value: function Hide(anim) {
      var _this2 = this;

      this.isShown = false;
      this.view.removeClass('md-show');

      if (anim) {
        if (!this.isShown) {
          this.view.detach();
        }

        return;
      }

      this.isShown = false;
      this.view.removeClass('md-show');
      setTimeout(function () {
        if (!_this2.isShown) {
          _this2.view.detach();
        }
      }, 1500);
    }
    /**
     * 从页面中删除
     */

  }, {
    key: "Remove",
    value: function Remove() {
      this.view.remove();
    }
  }]);

  return BaseModalWindowView;
}();
var MgeModalType;

(function (MgeModalType) {
  MgeModalType[MgeModalType["Info"] = 0] = "Info";
  MgeModalType[MgeModalType["Warn"] = 1] = "Warn";
  MgeModalType[MgeModalType["Error"] = 2] = "Error";
})(MgeModalType || (MgeModalType = {}));

var ModalWindowView_MgeModalWindow = /*#__PURE__*/function (_BaseModalWindowView) {
  _inherits(MgeModalWindow, _BaseModalWindowView);

  var _super = _createSuper(MgeModalWindow);

  function MgeModalWindow(config) {
    var _this3;

    ModalWindowView_classCallCheck(this, MgeModalWindow);

    var title = config.title || external_window_django_["gettext"]('Info');
    var content = ModalWindowView_$("\n    <div class=\"modal-header\">\n      <h4 class=\"modal-title\">".concat(title, "</h4>\n    </div>\n    <div id=\"modal-content\" class=\"modal-body\">\n    </div>\n    <div class=\"modal-footer\">\n      <button id=\"close\" type=\"button\" class=\"btn btn-primary\">").concat(external_window_django_["gettext"]('OK'), "</button>\n    </div>"));

    if (config.content) {
      content.filter('#modal-content').append(config.content);
    }

    content.find('#close').click(function () {
      if (_this3.mgeConfig.onClickOK) {
        var ret = _this3.mgeConfig.onClickOK();

        if (ret) {
          _this3.Hide();
        }

        return;
      }

      _this3.Hide();
    });
    _this3 = _super.call(this, {
      effect: Effect.FadeInAndScale,
      clickOverlayToClose: config.clickOverlayToClose,
      content: content,
      blur: false
    });
    _this3.mgeConfig = config;
    return _this3;
  }

  ModalWindowView_createClass(MgeModalWindow, [{
    key: "setContent",
    value: function setContent(content) {
      this.view.find('#modal-content').empty().append(content);
    }
  }, {
    key: "setOnClickOK",
    value: function setOnClickOK(onClickOK) {
      this.mgeConfig.onClickOK = onClickOK;
    }
  }, {
    key: "setTitle",
    value: function setTitle(title) {
      this.view.find('.modal-title').text(title);
    }
  }, {
    key: "setOKButtonText",
    value: function setOKButtonText(text) {
      this.view.find('#close').text(text);
    }
  }, {
    key: "HideTitle",
    value: function HideTitle() {
      this.view.find('.modal-header').css('display', 'none');
    }
  }, {
    key: "ShowTitle",
    value: function ShowTitle() {
      this.view.find('.modal-header').css('display', 'block');
    }
  }, {
    key: "HideFooter",
    value: function HideFooter() {
      this.view.find('.modal-footer').addClass('hide');
    }
  }, {
    key: "ShowFooter",
    value: function ShowFooter() {
      this.view.find('.modal-footer').removeClass('hide');
    }
  }]);

  return MgeModalWindow;
}(BaseModalWindowView);
// EXTERNAL MODULE: ./views/ConditionSelector.scss
var views_ConditionSelector = __webpack_require__(1679);

// EXTERNAL MODULE: ./views/ConditionView.scss
var ConditionView = __webpack_require__(1075);

// CONCATENATED MODULE: ./views/ConditionSelector.ts
function ConditionSelector_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ConditionSelector_typeof = function _typeof(obj) { return typeof obj; }; } else { ConditionSelector_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ConditionSelector_typeof(obj); }

function ConditionSelector_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ConditionSelector_createClass(Constructor, protoProps, staticProps) { if (protoProps) ConditionSelector_defineProperties(Constructor.prototype, protoProps); if (staticProps) ConditionSelector_defineProperties(Constructor, staticProps); return Constructor; }

function ConditionSelector_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ConditionSelector_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) ConditionSelector_setPrototypeOf(subClass, superClass); }

function ConditionSelector_setPrototypeOf(o, p) { ConditionSelector_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return ConditionSelector_setPrototypeOf(o, p); }

function ConditionSelector_createSuper(Derived) { var hasNativeReflectConstruct = ConditionSelector_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = ConditionSelector_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = ConditionSelector_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return ConditionSelector_possibleConstructorReturn(this, result); }; }

function ConditionSelector_possibleConstructorReturn(self, call) { if (call && (ConditionSelector_typeof(call) === "object" || typeof call === "function")) { return call; } return ConditionSelector_assertThisInitialized(self); }

function ConditionSelector_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function ConditionSelector_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ConditionSelector_getPrototypeOf(o) { ConditionSelector_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return ConditionSelector_getPrototypeOf(o); }







var ConditionSelector_$ = __webpack_require__(178);


 // class CondTypeSelector extends BaseModalWindowView {
//   constructor(callback: (type: ConditionType) => void) {
//     const buttonGroup = new ButtonGroupView<ConditionType>(
//       [django.gettext('Field'), django.gettext('AND'), django.gettext('OR')],
//       [ConditionType.Field, ConditionType.And, ConditionType.Or]);
//     buttonGroup.addOnChangeListener((old, newValue) => {
//       callback(newValue);
//       this.Hide();
//     });
//     const wrapper = $(`<div class="button-group-wrapper"><h4>${django.gettext('Select condition type')}</h4></div>`);
//     wrapper.append(buttonGroup.GetView());
//     super({
//       clickOverlayToClose: true,
//       content: wrapper,
//       effect: Effect.FadeInAndScale,
//       blur: true,
//     });
//   }
// }

var ConditionSelector_TemplateFieldSelector = /*#__PURE__*/function (_BaseModalWindowView) {
  ConditionSelector_inherits(TemplateFieldSelector, _BaseModalWindowView);

  var _super = ConditionSelector_createSuper(TemplateFieldSelector);

  function TemplateFieldSelector(nodes, callback) {
    var _this;

    ConditionSelector_classCallCheck(this, TemplateFieldSelector);

    var treeView = new TreeView_TreeView(nodes, {
      showIcon: false,
      showDelete: false,
      slideUpOthers: false,
      scrollToView: false,
      expandAll: true
    });
    treeView.AddEventListener(function (node, e) {
      if (e === TreeViewEvent.Click) {
        if (node.info.type === FieldType["a" /* FieldType */].Range) {
          return false;
        } else {
          callback(node);

          _this.Hide();
        }
      }

      return false;
    });
    return _this = _super.call(this, {
      clickOverlayToClose: true,
      content: treeView.GetView(),
      effect: Effect.FadeInAndScale,
      blur: true
    });
  }

  return TemplateFieldSelector;
}(BaseModalWindowView);

var ConditionSelector_ConditionSelector = /*#__PURE__*/function () {
  function ConditionSelector(nodes) {
    ConditionSelector_classCallCheck(this, ConditionSelector);

    this.view = ConditionSelector_$("<div class=\"condition-selector\">".concat(django.gettext('Click to add condition.'), "</div>"));
    this.listener = null;
    this.SetTemplate(nodes);
  }

  ConditionSelector_createClass(ConditionSelector, [{
    key: "SetTemplate",
    value: function SetTemplate(nodes) {
      var _this2 = this;

      // 无论如何都要清空内容
      this.view.empty();

      if (nodes == null) {
        this.Disable();
      } else {
        this.templateFieldSelector = new ConditionSelector_TemplateFieldSelector(nodes, function (node) {
          if (_this2.listener) {
            _this2.listener(ConditionType.Field, node.info);
          }
        });
        this.Enable();
      }
    }
  }, {
    key: "SetOnConditionSelectedListener",
    value: function SetOnConditionSelectedListener(listener) {
      this.listener = listener;
    }
  }, {
    key: "GetView",
    value: function GetView() {
      return this.view;
    }
    /**
     * 禁用选择器。在模板未设置时自动禁用
     * 只在用户没有选择字段时有用
     */

  }, {
    key: "Disable",
    value: function Disable() {
      this.view.unbind('click').addClass('disabled').text(django.gettext('Select a template first.'));
    }
    /**
     * 启用选择器。在模板未设置时没有作用
     * 只在用户没有选择字段时有用
     * 用户设置模板后自动启用
     */

  }, {
    key: "Enable",
    value: function Enable() {
      var _this3 = this;

      this.view.removeClass('disabled').text(django.gettext('Click to add condition.'));
      var buttonGroup = new ButtonGroupView([django.gettext('Field'), django.gettext('AND'), django.gettext('OR')], [ConditionType.Field, ConditionType.And, ConditionType.Or]);
      buttonGroup.addOnChangeListener(function (old, t) {
        buttonGroup.value = null;

        if (t === ConditionType.And || t === ConditionType.Or) {
          if (_this3.listener) {
            _this3.listener(t);
          }
        } else if (t === ConditionType.Field) {
          _this3.templateFieldSelector.Show();
        }
      });
      var wrapper = ConditionSelector_$("<div class=\"button-group-wrapper\"><h4>".concat(django.gettext('Click to add condition.'), "</h4></div>"));
      wrapper.append(buttonGroup.GetView());
      this.view.empty().append(wrapper);
    }
  }]);

  return ConditionSelector;
}();
// CONCATENATED MODULE: ./views/ConditionContentView.ts
function ConditionContentView_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ConditionContentView_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ConditionContentView_createClass(Constructor, protoProps, staticProps) { if (protoProps) ConditionContentView_defineProperties(Constructor.prototype, protoProps); if (staticProps) ConditionContentView_defineProperties(Constructor, staticProps); return Constructor; }





var ConditionContentView_$ = __webpack_require__(178);
/**
 * 1-6，等于类，文本框，需要额外处理number和单位
 * 7-12，字符串匹配类，文本框
 * 13-14，输入多个条件，需要额外处理number和单位
 * 0，15，Null判断，没有内容
 * 16-18，表格量词，不处理
 * 0和19，存在性操作符，没有内容
 *
 * 如果字段是选项，那么要根据misc渲染一个selector
 */


var ConditionContentView_ConditionContentView = /*#__PURE__*/function () {
  function ConditionContentView(op, fieldType, misc) {
    ConditionContentView_classCallCheck(this, ConditionContentView);

    this.view = null;
    this.choiceView = null;
    this.valView = null;

    if (op === 'eq' || op === 'ne' || op === 'gt' || op === 'gte' || op === 'lt' || op === 'lte' || op === 'contains' || op === 'ncontains' || op === 'startswith' || op === 'nstartswith' || op === 'endswith' || op === 'nendswith') {
      if (fieldType !== FieldType["a" /* FieldType */].Choice) {
        this.view = ConditionContentView_$('<input type="text" class="form-control" ></input>');
        this.valView = this.view;
      } else {
        this.choiceView = ChoiceToSelectorView(misc);
        this.view = this.choiceView.GetView();
      }
    } // 否则两个都是null

  }

  ConditionContentView_createClass(ConditionContentView, [{
    key: "GetValue",
    value: function GetValue() {
      if (this.choiceView != null) {
        return this.choiceView.Value();
      }

      if (this.valView != null) {
        return this.valView.val().toString();
      }

      return null;
    }
  }, {
    key: "GetView",
    value: function GetView() {
      return this.view;
    }
  }]);

  return ConditionContentView;
}();
var ConditionContentView_NumberConditionContentView = /*#__PURE__*/function () {
  function NumberConditionContentView(op, fieldType, misc) {
    ConditionContentView_classCallCheck(this, NumberConditionContentView);

    this.view = null;

    if (op === search["a" /* Search */].Operator.Equal || op === search["a" /* Search */].Operator.NotEqual || op === search["a" /* Search */].Operator.Greater || op === search["a" /* Search */].Operator.GreaterOrEqual || op === search["a" /* Search */].Operator.Less || op === search["a" /* Search */].Operator.LessOrEqual) {
      if (misc != null && misc.unit != null) {
        this.view = ConditionContentView_$("<div class=\"input-group\"><input type=\"number\" class=\"form-control\" ><span class=\"input-group-addon\">".concat(misc.unit, "</span></div>"));
        this.valView = this.view.find('input');
      } else {
        this.view = ConditionContentView_$('<input type="number" class="form-control" ></input>');
        this.valView = this.view;
      }
    }
  }

  ConditionContentView_createClass(NumberConditionContentView, [{
    key: "GetView",
    value: function GetView() {
      return this.view;
    }
  }, {
    key: "GetValue",
    value: function GetValue() {
      return Number(this.valView.val());
    }
  }]);

  return NumberConditionContentView;
}();
// CONCATENATED MODULE: ./views/ConditionView.ts
function ConditionView_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ConditionView_typeof = function _typeof(obj) { return typeof obj; }; } else { ConditionView_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ConditionView_typeof(obj); }

function ConditionView_createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = ConditionView_unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function ConditionView_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return ConditionView_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return ConditionView_arrayLikeToArray(o, minLen); }

function ConditionView_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ConditionView_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) ConditionView_setPrototypeOf(subClass, superClass); }

function ConditionView_setPrototypeOf(o, p) { ConditionView_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return ConditionView_setPrototypeOf(o, p); }

function ConditionView_createSuper(Derived) { var hasNativeReflectConstruct = ConditionView_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = ConditionView_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = ConditionView_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return ConditionView_possibleConstructorReturn(this, result); }; }

function ConditionView_possibleConstructorReturn(self, call) { if (call && (ConditionView_typeof(call) === "object" || typeof call === "function")) { return call; } return ConditionView_assertThisInitialized(self); }

function ConditionView_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function ConditionView_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ConditionView_getPrototypeOf(o) { ConditionView_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return ConditionView_getPrototypeOf(o); }

function ConditionView_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ConditionView_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ConditionView_createClass(Constructor, protoProps, staticProps) { if (protoProps) ConditionView_defineProperties(Constructor.prototype, protoProps); if (staticProps) ConditionView_defineProperties(Constructor, staticProps); return Constructor; }











var ConditionView_$ = __webpack_require__(178);


var ConditionView_ConditionView = /*#__PURE__*/function () {
  function ConditionView(onDelete) {
    ConditionView_classCallCheck(this, ConditionView);

    this.onDeleteListener = onDelete;
  }

  ConditionView_createClass(ConditionView, [{
    key: "GetView",
    value: function GetView() {
      return this.view;
    }
  }, {
    key: "SetOnDeleteListener",
    value: function SetOnDeleteListener(listener) {
      this.onDeleteListener = listener;
    }
  }]);

  return ConditionView;
}();
/**
 * 一般字段条件
 */

var ConditionView_FieldConditionView = /*#__PURE__*/function (_ConditionView) {
  ConditionView_inherits(FieldConditionView, _ConditionView);

  var _super = ConditionView_createSuper(FieldConditionView);

  function FieldConditionView(info, onDelete) {
    var _this;

    ConditionView_classCallCheck(this, FieldConditionView);

    _this = _super.call(this, onDelete);
    _this.info = info;
    _this.view = ConditionView_$("\n      <div class=\"condition\" style=\"background: #FFF\">\n        <div class=\"selector-view-wrapper\">\n          <div class=\"title-wrapper\">\n            <span>".concat(_this.info.name, "&nbsp;</span>\n            <div class=\"dropdown-wrapper\">\n            </div>\n          </div>\n          <a class=\"delete-button\" href=\"javascript:void(0)\"><i class=\"fa fa-times\" aria-hidden=\"true\"></i></a>\n        </div>\n        <div class=\"content-wrapper\">\n        </div>\n      </div>\n    "));

    _this.view.find('.delete-button').click(function () {
      if (_this.onDeleteListener) {
        _this.onDeleteListener();
      }
    });

    var ops = FieldTypeToOperatorList(_this.info.type, _this.info.required);
    var opNames = ops.map(search["a" /* Search */].Operator.toString);
    var en = new Enum(opNames, ops);
    _this.opDropdown = new SelectorView_SelectorView(en, ops[0]);

    _this.opDropdown.AddOnChooseListener(function (old, newValue) {
      // 选项改变时触发下面content的更新
      _this.SetContent(newValue);

      return true;
    });

    _this.view.find('.dropdown-wrapper').append(_this.opDropdown.GetView());

    _this.SetContent(ops[0]);

    return _this;
  }

  ConditionView_createClass(FieldConditionView, [{
    key: "GetCondition",
    value: function GetCondition() {
      var c = {
        field: this.info.path,
        op: this.opDropdown.Value(),
        val: ''
      };

      if (c.op !== search["a" /* Search */].Operator.NotNull && c.op !== search["a" /* Search */].Operator.Null) {
        c.val = this.contentView.GetValue();

        if (c.val == null) {
          return null;
        }
      }

      return c;
    }
  }, {
    key: "SetContent",
    value: function SetContent(op) {
      var wrapper = this.view.find('> .content-wrapper');

      if (this.contentView != null) {
        var view = this.contentView.GetView();

        if (view != null) {
          view.detach();
        }

        this.contentView = null;
      }

      wrapper.empty();

      if (this.info.type !== FieldType["a" /* FieldType */].Number) {
        this.contentView = new ConditionContentView_ConditionContentView(op, this.info.type, this.info.misc);
      } else {
        this.contentView = new ConditionContentView_NumberConditionContentView(op, this.info.type, this.info.misc);
      }

      wrapper.append(this.contentView.GetView());
    }
  }]);

  return FieldConditionView;
}(ConditionView_ConditionView);
/**
 * 数组和表格的条件
 */

var ConditionView_TableArrayConditionView = /*#__PURE__*/function (_ConditionView2) {
  ConditionView_inherits(TableArrayConditionView, _ConditionView2);

  var _super2 = ConditionView_createSuper(TableArrayConditionView);

  function TableArrayConditionView(info, onDelete) {
    var _this2;

    ConditionView_classCallCheck(this, TableArrayConditionView);

    _this2 = _super2.call(this, onDelete);
    _this2.info = info;
    _this2.condition = null; // 准备nodes

    var nodes = null;

    if (_this2.info.type === FieldType["a" /* FieldType */].Array) {
      nodes = [ArrayMiscToUserNode(_this2.info.misc, _this2.info.path)]; // console.log(ArrayMiscToUserNode(this.info.misc, this.info.path));
    } else {
      nodes = TableMiscToUserNode(_this2.info.misc, _this2.info.path).children; // console.log(TableMiscToUserNode(this.info.misc, this.info.path));
    }

    var id = Object(GenerateUniqueID["a" /* GenerateUniqueID */])();
    _this2.contentID = Object(GenerateUniqueID["a" /* GenerateUniqueID */])();
    _this2.view = ConditionView_$("\n      <div class=\"condition\" style=\"background: #FFF\">\n        <div class=\"selector-view-wrapper\">\n          <div class=\"title-wrapper\">\n            <span>".concat(_this2.info.name, "</span>\n            <div class=\"dropdown-wrapper\">\n            </div>\n          </div>\n          <a id=\"").concat(id, "\" class=\"delete-button\" href=\"javascript:void(0)\"><i class=\"fa fa-times\" aria-hidden=\"true\"></i></a>\n        </div>\n        <div id=\"").concat(_this2.contentID, "\" class=\"condition-content\"></div>\n      </div>\n    "));

    _this2.view.find("#".concat(id)).click(function () {
      // console.log('delete');
      if (_this2.onDeleteListener) {
        _this2.onDeleteListener();
      }
    });

    var ops = FieldTypeToOperatorList(_this2.info.type, _this2.info.required);
    var opNames = ops.map(search["a" /* Search */].Operator.toString);
    var en = new Enum(opNames, ops);
    _this2.opDropdown = new SelectorView_SelectorView(en, ops[0]);

    _this2.opDropdown.AddOnChooseListener(function (old, newValue) {
      // 选项改变时触发下面content的更新
      _this2.SetContent(newValue);

      return true;
    });

    _this2.view.find('.dropdown-wrapper').append(_this2.opDropdown.GetView());

    _this2.condSelector = new ConditionSelector_ConditionSelector(nodes);

    _this2.condSelector.SetOnConditionSelectedListener(function (condType, condInfo) {
      _this2.condSelector.GetView().detach();

      var newCond = CreateConditionView(condType, condInfo, nodes);
      _this2.condition = newCond;
      newCond.SetOnDeleteListener(function () {
        newCond.GetView().detach();
        _this2.condition = null;

        _this2.view.find("#".concat(_this2.contentID)).append(_this2.condSelector.GetView()); //   const index = this.conditions.indexOf(newCond);
        //   this.conditions.splice(index, 1);

      });

      _this2.view.find("#".concat(_this2.contentID)).append(newCond.GetView());
    });

    _this2.SetContent(ops[0]);

    return _this2;
  }

  ConditionView_createClass(TableArrayConditionView, [{
    key: "SetContent",
    value: function SetContent(op) {
      var content = this.view.find("#".concat(this.contentID));
      this.condSelector.GetView().detach();

      if (op === search["a" /* Search */].Operator.Null || op === search["a" /* Search */].Operator.NotNull) {
        content.empty();
      } else {
        content.append(this.condSelector.GetView());
      }
    }
  }, {
    key: "GetCondition",
    value: function GetCondition() {
      var c = {
        field: this.info.path,
        op: this.opDropdown.Value(),
        val: ''
      };

      if (c.op !== search["a" /* Search */].Operator.NotNull && c.op !== search["a" /* Search */].Operator.Null) {
        if (this.condition == null) {
          return null;
        }

        c.val = this.condition.GetCondition();

        if (c.val == null) {
          return null;
        }
      }

      return c;
    }
  }]);

  return TableArrayConditionView;
}(ConditionView_ConditionView);
var logicEnum = new Enum([django.gettext('AND'), django.gettext('OR')], [ConditionType.And, ConditionType.Or]);
var ConditionView_AndOrConditionView = /*#__PURE__*/function (_ConditionView3) {
  ConditionView_inherits(AndOrConditionView, _ConditionView3);

  var _super3 = ConditionView_createSuper(AndOrConditionView);

  function AndOrConditionView(type, info, nodes, onDelete) {
    var _this3;

    ConditionView_classCallCheck(this, AndOrConditionView);

    _this3 = _super3.call(this, onDelete);
    _this3.conditions = [];

    if (type === ConditionType.Field) {
      throw new Error('Invalid condition type');
    }

    _this3.view = ConditionView_$("\n      <div class=\"condition\">\n        <div class=\"selector-view-wrapper\">\n          <div class=\"dropdown-wrapper\">\n          </div>\n          <a class=\"delete-button\" href=\"javascript:void(0)\"><i class=\"fa fa-times\" aria-hidden=\"true\"></i></a>\n        </div>\n      </div>\n    ");
    _this3.dropdown = new SelectorView_SelectorView(logicEnum, type);

    _this3.view.find('.dropdown-wrapper').append(_this3.dropdown.GetView());

    _this3.view.find('.delete-button').click(function () {
      if (_this3.onDeleteListener) {
        _this3.onDeleteListener();
      }
    });

    _this3.condSelector = new ConditionSelector_ConditionSelector(nodes);

    _this3.condSelector.SetOnConditionSelectedListener(function (condType, condInfo) {
      _this3.condSelector.GetView().detach();

      var newCond = CreateConditionView(condType, condInfo, nodes);

      _this3.conditions.push(newCond);

      newCond.SetOnDeleteListener(function () {
        newCond.GetView().detach();

        var index = _this3.conditions.indexOf(newCond);

        _this3.conditions.splice(index, 1);
      });

      _this3.view.append(newCond.GetView()).append(_this3.condSelector.GetView());
    });

    _this3.view.append(_this3.condSelector.GetView());

    return _this3;
  }

  ConditionView_createClass(AndOrConditionView, [{
    key: "GetCondition",
    value: function GetCondition() {
      if (this.dropdown.Value() === ConditionType.Or) {
        var or = {
          or: []
        };

        var _iterator = ConditionView_createForOfIteratorHelper(this.conditions),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var i = _step.value;
            or.or.push(i.GetCondition());
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        if (or.or.length === 0) {
          return null;
        }

        return or;
      } else {
        var and = {
          and: []
        };

        var _iterator2 = ConditionView_createForOfIteratorHelper(this.conditions),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _i = _step2.value;
            and.and.push(_i.GetCondition());
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        if (and.and.length === 0) {
          return null;
        }

        return and;
      }
    }
  }]);

  return AndOrConditionView;
}(ConditionView_ConditionView);
function CreateConditionView(type, info, nodes) {
  if (type === ConditionType.And || type === ConditionType.Or) {
    return new ConditionView_AndOrConditionView(type, info, nodes);
  } else if (type === ConditionType.Field) {
    if (info.type !== FieldType["a" /* FieldType */].Array && info.type !== FieldType["a" /* FieldType */].Table) {
      return new ConditionView_FieldConditionView(info);
    } else {
      // 表格和数组
      return new ConditionView_TableArrayConditionView(info);
    }
  }
}
// EXTERNAL MODULE: ./views/ConditionWrapper.scss
var views_ConditionWrapper = __webpack_require__(1680);

// CONCATENATED MODULE: ./views/ConditionWrapper.ts
function ConditionWrapper_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ConditionWrapper_typeof = function _typeof(obj) { return typeof obj; }; } else { ConditionWrapper_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ConditionWrapper_typeof(obj); }

function ConditionWrapper_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ConditionWrapper_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ConditionWrapper_createClass(Constructor, protoProps, staticProps) { if (protoProps) ConditionWrapper_defineProperties(Constructor.prototype, protoProps); if (staticProps) ConditionWrapper_defineProperties(Constructor, staticProps); return Constructor; }

function ConditionWrapper_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) ConditionWrapper_setPrototypeOf(subClass, superClass); }

function ConditionWrapper_setPrototypeOf(o, p) { ConditionWrapper_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return ConditionWrapper_setPrototypeOf(o, p); }

function ConditionWrapper_createSuper(Derived) { var hasNativeReflectConstruct = ConditionWrapper_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = ConditionWrapper_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = ConditionWrapper_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return ConditionWrapper_possibleConstructorReturn(this, result); }; }

function ConditionWrapper_possibleConstructorReturn(self, call) { if (call && (ConditionWrapper_typeof(call) === "object" || typeof call === "function")) { return call; } return ConditionWrapper_assertThisInitialized(self); }

function ConditionWrapper_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function ConditionWrapper_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function ConditionWrapper_getPrototypeOf(o) { ConditionWrapper_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return ConditionWrapper_getPrototypeOf(o); }







var ConditionWrapper_$ = __webpack_require__(178);


/**
 * 元数据部分和模板使用同一套机制
 * category、time暂时不支持
 */

function GetMetaUserNodes() {
  return [new UserNode({
    path: 'title',
    type: FieldType["a" /* FieldType */].String,
    required: true,
    name: django.gettext('Title')
  }, django.gettext('Title'), true), new UserNode({
    path: 'doi',
    type: FieldType["a" /* FieldType */].String,
    name: django.gettext('DOI')
  }, django.gettext('DOI'), true), new UserNode({
    path: 'abstract',
    type: FieldType["a" /* FieldType */].String,
    name: django.gettext('Abstract')
  }, django.gettext('Abstract'), true), new UserNode({
    path: 'author',
    type: FieldType["a" /* FieldType */].String,
    name: django.gettext('Author')
  }, django.gettext('Author'), true), new UserNode({
    path: 'downloads',
    type: FieldType["a" /* FieldType */].Number,
    name: django.gettext('Downloads')
  }, django.gettext('Downloads'), true), new UserNode({
    path: 'views',
    type: FieldType["a" /* FieldType */].Number,
    name: django.gettext('Views')
  }, django.gettext('Views'), true), new UserNode({
    path: 'score',
    type: FieldType["a" /* FieldType */].Number,
    name: django.gettext('Score')
  }, django.gettext('Score'), true)];
}
var ConditionWrapper_ConditionWrapper = /*#__PURE__*/function (_ConditionView) {
  ConditionWrapper_inherits(ConditionWrapper, _ConditionView);

  var _super = ConditionWrapper_createSuper(ConditionWrapper);

  function ConditionWrapper(nodes) {
    var _this;

    ConditionWrapper_classCallCheck(this, ConditionWrapper);

    _this = _super.call(this, null);
    _this.nodes = nodes;
    _this.conditionView = null;
    _this.view = ConditionWrapper_$("<div class=\"col-xs-12 condition-wrapper-1\"></div>");
    _this.selector = new ConditionSelector_ConditionSelector(nodes);

    _this.selector.SetOnConditionSelectedListener(function (type, info) {
      _this.SelectCondition(type, info);
    }); // this.view.append(this.selector.GetView());


    _this.SelectCondition(ConditionType.And, null);

    return _this;
  }

  ConditionWrapper_createClass(ConditionWrapper, [{
    key: "SelectCondition",
    value: function SelectCondition(type, info) {
      var _this2 = this;

      var condView = CreateConditionView(type, info, this.nodes);
      condView.SetOnDeleteListener(function () {
        _this2.conditionView.GetView().detach();

        _this2.conditionView = null;

        _this2.view.append(_this2.selector.GetView());
      });

      if (this.conditionView != null) {
        this.conditionView.GetView().detach();
      }

      this.conditionView = condView;
      this.selector.GetView().detach();
      this.view.empty();
      this.view.append(this.conditionView.GetView());
    }
  }, {
    key: "SetTemplate",
    value: function SetTemplate(nodes) {
      this.nodes = nodes;
      this.selector.GetView().detach();
      this.selector.SetTemplate(nodes);
      this.SelectCondition(ConditionType.And, null);
    }
  }, {
    key: "Disable",
    value: function Disable() {
      this.selector.Disable();
    }
  }, {
    key: "Enable",
    value: function Enable() {
      this.selector.Enable();
    }
  }, {
    key: "GetCondition",
    value: function GetCondition() {
      if (this.conditionView != null) {
        return this.conditionView.GetCondition();
      } else {
        return null;
      }
    }
  }]);

  return ConditionWrapper;
}(ConditionView_ConditionView);
var ConditionWrapper_ConditionWrapper_2 = /*#__PURE__*/function (_ConditionView2) {
  ConditionWrapper_inherits(ConditionWrapper_2, _ConditionView2);

  var _super2 = ConditionWrapper_createSuper(ConditionWrapper_2);

  function ConditionWrapper_2(nodes) {
    var _this3;

    ConditionWrapper_classCallCheck(this, ConditionWrapper_2);

    _this3 = _super2.call(this, null);
    _this3.nodes = nodes;
    _this3.conditionView = null;
    _this3.view = ConditionWrapper_$("<div class=\"col-xs-12 condition-wrapper-2\"></div>");
    _this3.selector = new ConditionSelector_ConditionSelector(nodes);

    _this3.selector.SetOnConditionSelectedListener(function (type, info) {
      _this3.SelectCondition(type, info);
    }); // this.view.append(this.selector.GetView());


    _this3.SelectCondition(ConditionType.And, null);

    return _this3;
  }

  ConditionWrapper_createClass(ConditionWrapper_2, [{
    key: "SelectCondition",
    value: function SelectCondition(type, info) {
      var _this4 = this;

      var condView = CreateConditionView(type, info, this.nodes);
      condView.SetOnDeleteListener(function () {
        _this4.conditionView.GetView().detach();

        _this4.conditionView = null;

        _this4.view.append(_this4.selector.GetView());
      });

      if (this.conditionView != null) {
        this.conditionView.GetView().detach();
      }

      this.conditionView = condView;
      this.selector.GetView().detach();
      this.view.empty();
      this.view.append(this.conditionView.GetView());
    }
  }, {
    key: "SetTemplate",
    value: function SetTemplate(nodes) {
      this.nodes = nodes;
      this.selector.GetView().detach();
      this.selector.SetTemplate(nodes);
      this.SelectCondition(ConditionType.And, null);
    }
  }, {
    key: "Disable",
    value: function Disable() {
      this.selector.Disable();
    }
  }, {
    key: "Enable",
    value: function Enable() {
      this.selector.Enable();
    }
  }, {
    key: "GetCondition",
    value: function GetCondition() {
      if (this.conditionView != null) {
        return this.conditionView.GetCondition();
      } else {
        return null;
      }
    }
  }]);

  return ConditionWrapper_2;
}(ConditionView_ConditionView);
// EXTERNAL MODULE: ./apis/search/v2/Query.ts + 1 modules
var Query = __webpack_require__(9);

// EXTERNAL MODULE: ./components/common/CategoryTree.tsx
var CategoryTree = __webpack_require__(196);

// EXTERNAL MODULE: ./components/common/TemplateTree.tsx + 1 modules
var TemplateTree = __webpack_require__(663);

// CONCATENATED MODULE: ./oldPage/exprSearch.tsx



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || exprSearch_unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function exprSearch_unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return exprSearch_arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return exprSearch_arrayLikeToArray(o, minLen); }

function exprSearch_arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }










var exprSearch_$ = __webpack_require__(178);

var value = null;
var exprSearch_ExprSearchPage = function ExprSearchPage(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])(undefined),
      _useState2 = _slicedToArray(_useState, 2),
      category = _useState2[0],
      setCategory = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(undefined),
      _useState4 = _slicedToArray(_useState3, 2),
      method = _useState4[0],
      setMethod = _useState4[1];

  var _useState5 = Object(reactfrom_dll_reference_dll_library["useState"])(null),
      _useState6 = _slicedToArray(_useState5, 2),
      templateID = _useState6[0],
      setTemplateID = _useState6[1];

  var _useState7 = Object(reactfrom_dll_reference_dll_library["useState"])(false),
      _useState8 = _slicedToArray(_useState7, 2),
      state = _useState8[0],
      setState = _useState8[1];

  var handleCategoryChange = function handleCategoryChange(newID) {
    setCategory(newID);
    setMethod(null);
    setTemplateID(null);
  };

  var setTemplateIDChange = function setTemplateIDChange(newID) {
    setTemplateID(newID);
    setMethod(null);
  };

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    if (templateID == -1 || templateID == null) {
      var metaConditionView = new ConditionWrapper_ConditionWrapper_2(GetMetaUserNodes());
      exprSearch_$('#metadata-container').append(metaConditionView.GetView());
      value = metaConditionView;
    }

    var dataConditionView = new ConditionWrapper_ConditionWrapper();
    var tid = templateID;

    if (tid === -1 || tid == null) {
      exprSearch_$('.col-xs-12.condition-wrapper-1').remove();
      exprSearch_$('#template-container').append(dataConditionView.GetView());
      dataConditionView.Disable();
    } else {
      Object(Get["d" /* RawGetTemplate */])(tid).then(function (data) {
        var rootNode = TemplateToUserNode(data.content);
        exprSearch_$('.col-xs-12.condition-wrapper-1').remove();
        exprSearch_$('#template-container').append(dataConditionView.GetView());
        dataConditionView.SetTemplate(rootNode.children);
      });
    }

    exprSearch_$('#btn-search').click(function () {
      var metaCondition = value.GetCondition();
      var dataCondition = dataConditionView.GetCondition();

      if (!metaCondition || !dataCondition) {
        return;
      }

      var tid = templateID;
      var isMulti = Query["l" /* TemplateList */].includes(tid);
      setState(true);
      Object(Query["d" /* CreateQuery */])({
        meta: metaCondition,
        data: tid !== -1 ? [{
          tid: tid,
          q: dataCondition
        }] : null
      }).then(function (value) {
        setState(false);
        window.open('/expr_result/?isMulti=' + isMulti + '/#/' + value.id);
      });
    });
  }, [templateID]);
  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(reactfrom_dll_reference_dll_library_default.a.Fragment, null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'row'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'col-xs-12'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("h2", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'search:adv',
    defaultMessage: "\u9AD8\u7EA7\u641C\u7D22  "
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(icon_default.a, {
    type: "search",
    style: {
      fontSize: '16px',
      color: '#08c'
    },
    onClick: props.onVisible
  })))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'dividing'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'row',
    id: 'metadata-container'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'col-xs-12'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("h3", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'metadata',
    defaultMessage: "\u5143\u6570\u636E"
  })))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'dividing'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'row',
    id: 'template-container'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'col-xs-12'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("h3", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'template',
    defaultMessage: "\u6A21\u677F"
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(CategoryTree["a" /* CategoryTree */], {
    style: {
      width: '48%',
      padding: '12px 0'
    },
    value: category,
    onChange: handleCategoryChange
  })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    style: {
      padding: '12px 0'
    }
  }, category == null ? /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'data:select_category',
    defaultMessage: "\u8BF7\u5148\u9009\u62E9\u6A21\u677F\u7684\u5206\u7C7B"
  }) : /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TemplateTree["a" /* TemplateTree */], {
    style: {
      width: '48%'
    },
    methodID: method,
    categoryID: category,
    value: templateID,
    onChange: setTemplateIDChange
  }))), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'dividing'
  }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'row'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", {
    className: 'col-xs-12'
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("button", {
    id: 'btn-search',
    className: 'btn btn-lg btn-primary',
    style: {
      display: 'block',
      margin: '0 auto',
      width: '120px'
    }
  }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("i", {
    className: 'fa fa-search'
  }), "\xA0", /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
    id: 'search',
    defaultMessage: "\u641C\u7D22"
  })))));
};
// CONCATENATED MODULE: ./entry/expr_search.tsx
function expr_search_typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { expr_search_typeof = function _typeof(obj) { return typeof obj; }; } else { expr_search_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return expr_search_typeof(obj); }






function expr_search_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function expr_search_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function expr_search_createClass(Constructor, protoProps, staticProps) { if (protoProps) expr_search_defineProperties(Constructor.prototype, protoProps); if (staticProps) expr_search_defineProperties(Constructor, staticProps); return Constructor; }

function expr_search_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) expr_search_setPrototypeOf(subClass, superClass); }

function expr_search_setPrototypeOf(o, p) { expr_search_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return expr_search_setPrototypeOf(o, p); }

function expr_search_createSuper(Derived) { var hasNativeReflectConstruct = expr_search_isNativeReflectConstruct(); return function _createSuperInternal() { var Super = expr_search_getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = expr_search_getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return expr_search_possibleConstructorReturn(this, result); }; }

function expr_search_possibleConstructorReturn(self, call) { if (call && (expr_search_typeof(call) === "object" || typeof call === "function")) { return call; } return expr_search_assertThisInitialized(self); }

function expr_search_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function expr_search_isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function expr_search_getPrototypeOf(o) { expr_search_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return expr_search_getPrototypeOf(o); }










Object(global["a" /* GlobalInit */])();

var expr_search_ExprSearchEntry = /*#__PURE__*/function (_Component) {
  expr_search_inherits(ExprSearchEntry, _Component);

  var _super = expr_search_createSuper(ExprSearchEntry);

  function ExprSearchEntry(props) {
    var _this;

    expr_search_classCallCheck(this, ExprSearchEntry);

    _this = _super.call(this, props);
    _this.state = {
      showChoice: false
    };
    return _this;
  }

  expr_search_createClass(ExprSearchEntry, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      // 弹框
      setTimeout(function () {
        return _this2.setState({
          showChoice: true
        });
      }, 500);
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var handleChoiceButtonOk = function handleChoiceButtonOk() {
        _this3.setState({
          showChoice: false
        });
      };

      var onVisi = function onVisi() {
        _this3.setState({
          showChoice: true
        });
      };

      var modalFooter = [/*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(button_default.a, {
        key: 'submit',
        type: 'primary',
        href: "javascript:void(0)",
        onClick: handleChoiceButtonOk
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'template:confirm',
        defaultMessage: "\u6211\u77E5\u9053\u4E86"
      }))];
      return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(MgeLayout["a" /* MgeLayout */], {
        reloadOnSwitchLocale: true
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Breadcrumb["a" /* Breadcrumb */], {
        items: [Breadcrumb["a" /* Breadcrumb */].MGED, Breadcrumb["a" /* Breadcrumb */].MDB, {
          title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("div", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
            id: 'search:adv',
            defaultMessage: "\u9AD8\u7EA7\u641C\u7D22"
          })),
          url: Urls["b" /* default */].search.index
        }]
      }), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(Container["a" /* Container */], null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(exprSearch_ExprSearchPage, {
        onVisible: onVisi
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(modal_default.a, {
        footer: modalFooter,
        visible: this.state.showChoice,
        title: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
          id: 'expr_search:instruction',
          defaultMessage: "\u9AD8\u7EA7\u68C0\u7D22\u8BF4\u660E\uFF1A"
        }),
        onCancel: handleChoiceButtonOk
      }, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'expr_search:instruction',
        defaultMessage: "\u9AD8\u7EA7\u68C0\u7D22\u8BF4\u660E\uFF1A"
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'expr_search:note_1',
        defaultMessage: "1. \u9AD8\u7EA7\u68C0\u7D22\u6761\u4EF6\u5206\u4E3A\u5143\u6570\u636E\u4E0E\u6A21\u677F\u4E24\u90E8\u5206\uFF0C\u9700\u8981\u5168\u90E8\u8FDB\u884C\u6761\u4EF6\u586B\u5145\u540E\u624D\u80FD\u641C\u7D22\u3002"
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'expr_search:note_2',
        defaultMessage: "2. \u7B5B\u9009\u6761\u4EF6\u9ED8\u8BA4\u4E3A\u201C\u4E14\u201D\u533A\u57DF\uFF0C\u533A\u57DF\u5185\u90E8\u6DFB\u52A0\u7684\u6761\u4EF6\u5219\u4E3A A \u4E14 B\uFF1B\u5C06\u201C\u4E14\u201D\u66F4\u6539\u4E3A\u201C\u6216\u201D\u5219\u533A\u57DF\u5185\u90E8\u6DFB\u52A0\u7684\u6761\u4EF6\u4E3AA\u6216B\uFF1B"
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'expr_search:note_3',
        defaultMessage: "3. \u4E14\u6216\u533A\u57DF\u5185\u53EF\u4EE5\u5D4C\u5957\u65B0\u7684\u4E14\u6216\u533A\u57DF\uFF0C\u5728\u201C\u70B9\u51FB\u6DFB\u52A0\u6761\u4EF6\u201D\u4E2D\u9009\u62E9\u201C\u4E14\u201D\u548C\u201C\u6216\u201D\u3002"
      })), /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement("p", null, /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
        id: 'expr_search:note_4',
        defaultMessage: "4. \u6A21\u677F\u90E8\u5206\u9700\u8981\u5148\u9009\u62E9\u4E00\u4E2A\u6A21\u677F\uFF0C\u7CFB\u7EDF\u5C06\u8BFB\u53D6\u8BE5\u6A21\u677F\u5B57\u6BB5\u540D\u4F5C\u4E3A\u53EF\u9009\u7B5B\u9009\u6761\u4EF6\u3002"
      }))));
    }
  }]);

  return ExprSearchEntry;
}(reactfrom_dll_reference_dll_library["Component"]);

react_domfrom_dll_reference_dll_library_default.a.render( /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(expr_search_ExprSearchEntry, null), document.getElementById('wrap'));

/***/ }),

/***/ 59:
/***/ (function(module, exports) {

module.exports = dll_library;

/***/ }),

/***/ 663:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* binding */ TemplateTree_TemplateTree; });

// EXTERNAL MODULE: ./node_modules/antd/lib/tree-select/style/index.js
var style = __webpack_require__(305);

// EXTERNAL MODULE: ./node_modules/antd/lib/tree-select/index.js
var tree_select = __webpack_require__(141);
var tree_select_default = /*#__PURE__*/__webpack_require__.n(tree_select);

// EXTERNAL MODULE: delegated ./node_modules/react/index.js from dll-reference dll_library
var reactfrom_dll_reference_dll_library = __webpack_require__(0);
var reactfrom_dll_reference_dll_library_default = /*#__PURE__*/__webpack_require__.n(reactfrom_dll_reference_dll_library);

// EXTERNAL MODULE: ./node_modules/react-intl/lib/index.es.js + 1 modules
var index_es = __webpack_require__(2);

// EXTERNAL MODULE: ./apis/Fetch.ts
var Fetch = __webpack_require__(7);

// EXTERNAL MODULE: ./apis/Urls.ts
var Urls = __webpack_require__(4);

// CONCATENATED MODULE: ./apis/template/GetTemplateByCategoryID.ts
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }



function GetTemplateByCatetoryID(_x, _x2) {
  return _GetTemplateByCatetoryID.apply(this, arguments);
}

function _GetTemplateByCatetoryID() {
  _GetTemplateByCatetoryID = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(categoryID, methodID) {
    var url, _url;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(methodID != null)) {
              _context.next = 5;
              break;
            }

            url = "".concat(Urls["b" /* default */].api_v1_storage.templates, "?category=").concat(categoryID, "&meta_only=true&per_page=100&method=").concat(methodID);
            return _context.abrupt("return", Object(Fetch["k" /* default */])(url));

          case 5:
            _url = "".concat(Urls["b" /* default */].api_v1_storage.templates, "?category=").concat(categoryID, "&meta_only=true&per_page=100");
            return _context.abrupt("return", Object(Fetch["k" /* default */])(_url));

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _GetTemplateByCatetoryID.apply(this, arguments);
}
// CONCATENATED MODULE: ./components/common/TemplateTree.tsx



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




var TreeNode = tree_select_default.a.TreeNode;
var TemplateTree_TemplateTree = function TemplateTree(props) {
  var _useState = Object(reactfrom_dll_reference_dll_library["useState"])([]),
      _useState2 = _slicedToArray(_useState, 2),
      tree = _useState2[0],
      setTree = _useState2[1];

  var _useState3 = Object(reactfrom_dll_reference_dll_library["useState"])(true),
      _useState4 = _slicedToArray(_useState3, 2),
      loading = _useState4[0],
      setLoading = _useState4[1];

  Object(reactfrom_dll_reference_dll_library["useEffect"])(function () {
    setLoading(true);
    GetTemplateByCatetoryID(props.categoryID, props.methodID).then(function (value) {
      setTree(value.templates);
      setLoading(false);
    });
  }, [props.categoryID, props.methodID]);

  var TemplateToTreeNode = function TemplateToTreeNode(template) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(TreeNode, {
      value: template.id,
      title: template.title,
      key: template.id,
      selectable: true
    });
  };

  if (loading === false && tree.length === 0) {
    return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'data:no_template',
      defaultMessage: "\u8BE5\u5206\u7C7B\u4E0B\u6CA1\u6709\u6A21\u677F"
    });
  }

  return /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(tree_select_default.a, {
    loading: loading,
    className: props.className,
    style: props.style,
    value: props.value,
    dropdownStyle: {
      maxHeight: 400,
      overflow: 'auto'
    },
    placeholder: /*#__PURE__*/reactfrom_dll_reference_dll_library_default.a.createElement(index_es["a" /* FormattedMessage */], {
      id: 'data:select_template',
      defaultMessage: "\u8BF7\u9009\u62E9\u6A21\u677F"
    }),
    allowClear: true,
    treeDefaultExpandAll: true,
    onChange: props.onChange,
    showSearch: true,
    treeNodeFilterProp: 'title'
  }, tree.map(TemplateToTreeNode));
};

/***/ })

/******/ });