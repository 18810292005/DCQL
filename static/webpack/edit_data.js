!function(c){function e(e){for(var t,n,r=e[0],a=e[1],o=e[2],i=0,u=[];i<r.length;i++)n=r[i],Object.prototype.hasOwnProperty.call(s,n)&&s[n]&&u.push(s[n][0]),s[n]=0;for(t in a)Object.prototype.hasOwnProperty.call(a,t)&&(c[t]=a[t]);for(p&&p(e);u.length;)u.shift()();return f.push.apply(f,o||[]),l()}function l(){for(var e,t=0;t<f.length;t++){for(var n=f[t],r=!0,a=1;a<n.length;a++){var o=n[a];0!==s[o]&&(r=!1)}r&&(f.splice(t--,1),e=i(i.s=n[0]))}return e}var n={},s={6:0},f=[];function i(e){if(n[e])return n[e].exports;var t=n[e]={i:e,l:!1,exports:{}};return c[e].call(t.exports,t,t.exports,i),t.l=!0,t.exports}i.m=c,i.c=n,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(n,r,function(e){return t[e]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/dist/static/webpack/";var t=(r=window.webpackJsonp=window.webpackJsonp||[]).push.bind(r);r.push=e;for(var r=r.slice(),a=0;a<r.length;a++)e(r[a]);var p=t;f.push([1498,0]),l()}({1498:function(e,t,n){n(87),n(88),n(90),e.exports=n(1528)},1528:function(e,t,n){"use strict";n.r(t);var m=n(0),y=n.n(m),r=n(13),t=n.n(r),b=n(2),a=n(59),o=n(200),i=n(149),u=n(64),c=n(83),r=(n(29),n(6)),v=n.n(r),r=(n(123),n(46)),h=n.n(r),r=(n(44),n(10)),g=n.n(r),r=(n(34),n(11)),j=n.n(r),w=n(50),O=n(203),E=n(37),_=n(4),S=n(3),x=n(492),k=n(260),C=n(491);function R(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,a,o=[],i=!0,u=!1;try{for(n=n.call(e);!(i=(r=n.next()).done)&&(o.push(r.value),!t||o.length!==t);i=!0);}catch(e){u=!0,a=e}finally{try{i||null==n.return||n.return()}finally{if(u)throw a}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return l(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Map"===(n="Object"===n&&e.constructor?e.constructor.name:n)||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?l(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function s(e){var t=e.className,n=e.style,r=e.dataID,a=(s=R(Object(m.useState)({title:"",keywords:[],abstract:"",project:void 0,subject:void 0,tid:0,visibility:0}),2))[0],o=s[1],i=(e=R(Object(m.useState)({}),2))[0],u=e[1],c=(s=R(Object(m.useState)([]),2))[0],l=s[1],s=(e=R(Object(m.useState)(!1),2))[0],f=e[1];function p(e){var t=Object(E.a)("leave_confirm");return(e||window.event).returnValue=t}Object(m.useEffect)(function(){Object(k.a)(r).then(function(e){l(e.template.content),o(e.meta),u(e.content)})},[r]),Object(m.useEffect)(function(){return window.addEventListener("beforeunload",p),function(){window.removeEventListener("beforeunload",p)}},[]);var d=function(){Object(C.b)(r,a,i,c).then(function(e){e=e,j.a.success({title:Object(E.a)("data_commit_success"),content:y.a.createElement("a",{href:S.b.storage.show_data(e)},Object(E.a)("data:view_data"))})}).catch(function(e){var t;t="","id"in(e=e)?t=Object(E.a)(e.id):e instanceof _.b&&(t="".concat(e.message,": ").concat(e.detail)),g.a.error({message:Object(E.a)("error"),description:t,onClick:function(){console.log("Notification Clicked!")}})})};return y.a.createElement("div",{className:"".concat(t||""),style:n},y.a.createElement("p",{style:{padding:"12px 0"}},y.a.createElement(b.a,{id:"data:star_required",defaultMessage:"所有带星号的字段都为必填"})),y.a.createElement(h.a,null,y.a.createElement(b.a,{id:"metadata",defaultMessage:"元数据"})),y.a.createElement(x.a,{meta:a,informUpdate:function(){o(Object.assign({},a))},is_edit:!0}),y.a.createElement(h.a,null,y.a.createElement(b.a,{id:"data:data_content",defaultMessage:"数据内容"})),0===c.length?y.a.createElement(w.a,null):y.a.createElement("div",null,Object(O.b)(c,function(){u(Object.assign({},i))},i)),y.a.createElement(h.a,null),y.a.createElement("div",{style:{textAlign:"center",paddingBottom:"16px"}},y.a.createElement(v.a,{size:"large",type:"primary",onClick:function(){f(!0)},style:{minWidth:"120px"}},y.a.createElement(b.a,{id:"submit",defaultMessage:"提交"}))),y.a.createElement(j.a,{title:"提示",visible:s,onOk:function(){f(!1),d()},onCancel:function(){f(!1)},okText:"确认",cancelText:"取消"},y.a.createElement("p",null,"如果数据可见范围不是私有，则修改后将需要重新审核，是否确定提交修改？")))}b.a;t.a.render(y.a.createElement(function(){var e=Number(window.location.href.split("/").pop());return y.a.createElement(u.a,{loginRequired:!0,selectedMenu:c.a.Data},y.a.createElement(o.a,{title:y.a.createElement(b.a,{id:"data:edit_data",defaultMessage:"修改数据"})},y.a.createElement("div",{style:{margin:"0 56px",display:"flex",flexDirection:"column",flex:1}},y.a.createElement(i.a,{forbidMessage:y.a.createElement(b.a,{id:"data:forbid",defaultMessage:"您没有上传/查看数据的权限，请点击申请"}),requiredRoles:[a.b.RESEARCHER]},y.a.createElement(s,{dataID:e})))))},null),document.getElementById("wrap"))},174:function(e,t,n){"use strict";n.d(t,"b",function(){return a}),n.d(t,"a",function(){return l}),n.d(t,"c",function(){return f}),n.d(t,"d",function(){return d});var o=n(3),i=n(4);function c(e,t,n,r,a,o,i){try{var u=e[o](i),c=u.value}catch(e){return void n(e)}u.done?t(c):Promise.resolve(c).then(r,a)}function r(u){return function(){var e=this,i=arguments;return new Promise(function(t,n){var r=u.apply(e,i);function a(e){c(r,t,n,a,o,"next",e)}function o(e){c(r,t,n,a,o,"throw",e)}a(void 0)})}}function a(e,t){return u.apply(this,arguments)}function u(){return(u=r(regeneratorRuntime.mark(function e(t,n){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(i.j)(o.b.api_v1_storage.get_material_projects));case 1:case"end":return e.stop()}},e)}))).apply(this,arguments)}function l(){return s.apply(this,arguments)}function s(){return(s=r(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(i.j)(o.b.api_v1_storage.get_projects_all));case 1:case"end":return e.stop()}},e)}))).apply(this,arguments)}function f(e,t,n){return p.apply(this,arguments)}function p(){return(p=r(regeneratorRuntime.mark(function e(t,n,r){var a;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a="/api/v1.1/storage/projects/?total="+t+"&page="+n+"&page_size="+r,e.next=3,Object(i.j)(a,"GET");case 3:return a=e.sent,e.abrupt("return",a);case 5:case"end":return e.stop()}},e)}))).apply(this,arguments)}function d(e,t,n){return m.apply(this,arguments)}function m(){return(m=r(regeneratorRuntime.mark(function e(t,n,r){var a;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=o.b.api_v1_1_storage.material_project_query,e.next=3,Object(i.j)(a+"?query="+t+"&page="+n+"&page_size="+r,"GET");case 3:return e.abrupt("return",e.sent);case 4:case"end":return e.stop()}},e)}))).apply(this,arguments)}},202:function(e,t,n){"use strict";n.d(t,"a",function(){return i}),n.d(t,"b",function(){return l});var r=n(3),o=n(4);function c(e,t,n,r,a,o,i){try{var u=e[o](i),c=u.value}catch(e){return void n(e)}u.done?t(c):Promise.resolve(c).then(r,a)}function a(u){return function(){var e=this,i=arguments;return new Promise(function(t,n){var r=u.apply(e,i);function a(e){c(r,t,n,a,o,"next",e)}function o(e){c(r,t,n,a,o,"throw",e)}a(void 0)})}}function i(e){return u.apply(this,arguments)}function u(){return(u=a(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(o.j)(r.b.api_v1_storage.get_material_subjects(t)));case 1:case"end":return e.stop()}},e)}))).apply(this,arguments)}function l(e,t,n){return s.apply(this,arguments)}function s(){return(s=a(regeneratorRuntime.mark(function e(t,n,r){var a;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a="/api/v1.1/storage/subjects/search/?query="+t+"&page="+n+"&page_size="+r,e.next=3,Object(o.j)(a,"GET");case 3:return a=e.sent,e.abrupt("return",a);case 5:case"end":return e.stop()}},e)}))).apply(this,arguments)}},260:function(e,t,n){"use strict";n.d(t,"b",function(){return f}),n.d(t,"a",function(){return d});var r,a=n(4),o=n(3),i=n(171);function u(t,e){var n,r=Object.keys(t);return Object.getOwnPropertySymbols&&(n=Object.getOwnPropertySymbols(t),e&&(n=n.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),r.push.apply(r,n)),r}function c(r){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?u(Object(a),!0).forEach(function(e){var t,n;t=r,e=a[n=e],n in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(a)):u(Object(a)).forEach(function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(a,e))})}return r}function l(e,t,n,r,a,o,i){try{var u=e[o](i),c=u.value}catch(e){return void n(e)}u.done?t(c):Promise.resolve(c).then(r,a)}function s(u){return function(){var e=this,i=arguments;return new Promise(function(t,n){var r=u.apply(e,i);function a(e){l(r,t,n,a,o,"next",e)}function o(e){l(r,t,n,a,o,"throw",e)}a(void 0)})}}function f(e){return p.apply(this,arguments)}function p(){return(p=s(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",Object(a.a)(o.b.api_v2_storage.get_data(t)));case 1:case"end":return e.stop()}},e)}))).apply(this,arguments)}function d(e){return m.apply(this,arguments)}function m(){return(m=s(regeneratorRuntime.mark(function e(t){var n;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(a.a)(o.b.api_v2_storage.get_data(t));case 2:return n=e.sent,e.abrupt("return",{meta:r.fromRawDataMeta(n),content:n.content,template:i.a.fromRaw(n.template)});case 4:case"end":return e.stop()}},e)}))).apply(this,arguments)}(r||(r={})).fromRawDataMeta=function(e){return c(c({},e),{},{category_name:e.category})}},491:function(e,t,n){"use strict";n.d(t,"a",function(){return o}),n.d(t,"b",function(){return p});var i=n(3),u=n(4);function c(e,t,n,r,a,o,i){try{var u=e[o](i),c=u.value}catch(e){return void n(e)}u.done?t(c):Promise.resolve(c).then(r,a)}function r(u){return function(){var e=this,i=arguments;return new Promise(function(t,n){var r=u.apply(e,i);function a(e){c(r,t,n,a,o,"next",e)}function o(e){c(r,t,n,a,o,"throw",e)}a(void 0)})}}var a=function(e){return null==e||0===e.trim().length};function l(e){if(a(e.title))throw{id:"error_data_title_empty"};if(a(e.abstract))throw{id:"error_data_abstract_empty"};if(0===e.keywords.length)throw{id:"error_data_keywords_empty"};if(a(e.project))throw{id:"error_data_project_empty"};if(a(e.subject))throw{id:"error_data_subject_empty"}}function s(e){if(0===Object.keys(e).length)throw{id:"error_data_content_empty"}}function o(e,t,n){return f.apply(this,arguments)}function f(){return(f=r(regeneratorRuntime.mark(function e(t,n,r){var a;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a=i.b.api_v1_1_storage.data_full,l(t),s(n),e.abrupt("return",Object(u.j)(a,"POST",{meta:{title:t.title,abstract:t.abstract,keywords:t.keywords.join(","),tid:t.tid,visibility:t.visibility,project:t.project,subject:t.subject},content:n}));case 4:case"end":return e.stop()}},e)}))).apply(this,arguments)}function p(e,t,n,r){return d.apply(this,arguments)}function d(){return(d=r(regeneratorRuntime.mark(function e(t,n,r,a){var o;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return o=i.b.api_v2_storage.get_data(t),l(n),s(r),e.abrupt("return",Object(u.j)(o,"PATCH",{meta:{title:n.title,abstract:n.abstract,keywords:n.keywords.join(","),tid:n.tid,visibility:n.visibility,project:n.project,subject:n.subject},content:r}));case 4:case"end":return e.stop()}},e)}))).apply(this,arguments)}},492:function(e,t,n){"use strict";n.d(t,"a",function(){return q});n(105);var r=n(26),a=n.n(r),t=(n(121),n(45)),o=n.n(t),i=n(0),u=n.n(i),c=n(2),l=n(133),s=n(269),r=(n(110),n(27)),f=n.n(r),t=(n(41),n(9)),p=n.n(t),r=(n(143),n(61)),d=n.n(r),t=(n(328),n(151)),m=n.n(t),r=n(18),t=n(19);function y(e){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function b(e){return function(e){if(Array.isArray(e))return v(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(e){if("string"==typeof e)return v(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Map"===(n="Object"===n&&e.constructor?e.constructor.name:n)||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?v(e,t):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function v(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function h(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function g(e,t){return(g=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function j(n){var r=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}();return function(){var e,t=w(n);return e=r?(e=w(this).constructor,Reflect.construct(t,arguments,e)):t.apply(this,arguments),t=this,!(e=e)||"object"!==y(e)&&"function"!=typeof e?function(e){if(void 0!==e)return e;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}}function w(e){return(w=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}var O=function(){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&g(e,t)}(a,u.a.Component);var e,t,n,r=j(a);function a(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),(n=r.call(this,e)).handleInputConfirm=function(){var e=n.state.inputValue,t=b(n.props.tags);e&&-1===t.indexOf(e)&&(t=[].concat(b(t),[e])),n.setState({inputValue:""}),n.props.onTagsChange(t)},n.handleBlur=function(){var e=n.state.inputValue,t=b(n.props.tags);e&&-1===t.indexOf(e)&&(t=[].concat(b(t),[e])),n.setState({inputVisible:!1,inputValue:""}),n.props.onTagsChange(t)},n.saveInputRef=function(e){return n.input=e},n.state={inputValue:"",inputVisible:!1},n}return e=a,(t=[{key:"handleClose",value:function(t){var e=this.props.tags.filter(function(e){return e!==t});this.props.onTagsChange(e)}},{key:"showInput",value:function(){var e=this;this.setState({inputVisible:!0},function(){return e.input.focus()})}},{key:"handleInputChange",value:function(e){this.setState({inputValue:e.target.value})}},{key:"render",value:function(){var a=this,e=this.state,t=e.inputVisible,e=e.inputValue;return u.a.createElement("div",null,this.props.tags.map(function(e,t){var n=20<e.length,r=u.a.createElement(m.a,{key:e,closable:!0,onClose:function(){return a.handleClose(e)}},n?"".concat(e.slice(0,20),"..."):e);return n?u.a.createElement(d.a,{title:e,key:e},r):r}),t&&u.a.createElement(p.a,{ref:this.saveInputRef,type:"text",size:this.props.size,style:{width:78},value:e,onChange:this.handleInputChange,onBlur:this.handleBlur,onPressEnter:this.handleInputConfirm}),!t&&u.a.createElement(m.a,{onClick:this.showInput,style:{background:"#fff",borderStyle:"dashed"}},u.a.createElement(f.a,{type:"plus"}),u.a.createElement(c.a,{id:"data:new_tag",defaultMessage:"新标签"})))}}])&&h(e.prototype,t),n&&h(e,n),a}();Object(r.a)([t.a],O.prototype,"handleClose",null),Object(r.a)([t.a],O.prototype,"showInput",null),Object(r.a)([t.a],O.prototype,"handleInputChange",null);n(70);var t=n(17),E=n.n(t),_=n(174);function S(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,a,o=[],i=!0,u=!1;try{for(n=n.call(e);!(i=(r=n.next()).done)&&(o.push(r.value),!t||o.length!==t);i=!0);}catch(e){u=!0,a=e}finally{try{i||null==n.return||n.return()}finally{if(u)throw a}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return x(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Map"===(n="Object"===n&&e.constructor?e.constructor.name:n)||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?x(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function x(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function k(e){var t=(a=S(Object(i.useState)(!0),2))[0],n=a[1],r=S(Object(i.useState)([]),2),a=r[0],o=r[1];return Object(i.useEffect)(function(){Object(_.b)(0,1).then(function(e){n(!1),o(e),console.log(e)})},[]),u.a.createElement(E.a,{style:e.style,loading:t,onChange:e.onChange,value:e.value,allowClear:!0},a.map(function(e){return u.a.createElement(C,{key:e.id,value:e.id},e.id,"/",e.name)}))}var C=E.a.Option,R=n(202);function P(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,a,o=[],i=!0,u=!1;try{for(n=n.call(e);!(i=(r=n.next()).done)&&(o.push(r.value),!t||o.length!==t);i=!0);}catch(e){u=!0,a=e}finally{try{i||null==n.return||n.return()}finally{if(u)throw a}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return I(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Map"===(n="Object"===n&&e.constructor?e.constructor.name:n)||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?I(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function I(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function A(e){var t=(a=P(Object(i.useState)(!0),2))[0],n=a[1],r=P(Object(i.useState)([]),2),a=r[0],o=r[1];return Object(i.useEffect)(function(){n(!0),console.log(e.projectID),null!=e.projectID&&""!=e.projectID&&Object(R.a)(e.projectID).then(function(e){n(!1),o(e)})},[e.projectID]),u.a.createElement(E.a,{style:e.style,loading:t,onChange:e.onChange,value:e.value,allowClear:!0},a.map(function(e){return u.a.createElement(T,{key:e.id,value:e.id},e.id,"/",e.name)}))}function M(e){return u.a.createElement(E.a,{style:e.style,value:e.value,onChange:e.onChange},u.a.createElement(D,{value:"0"},"公开"),u.a.createElement(D,{value:"1"},"本一级机构成员可见（包括一级机构下所有二级机构）"),u.a.createElement(D,{value:"2"},"本二级机构成员可见"),u.a.createElement(D,{value:"3"},"仅自己可见（私有数据）"))}var T=E.a.Option,t=(n(481),n(177)),D=(n.n(t).a.TreeNode,E.a.Option),V=(E.a.OptGroup,n(7)),q=function(e){var t=e.meta,n=e.informUpdate,e=e.is_edit;return u.a.createElement(u.a.Fragment,null,u.a.createElement(l.a,{name:u.a.createElement(c.a,{id:"data:title",defaultMessage:"名称"}),extra:"*"}),u.a.createElement(s.a,{field:{type:V.a.String,title:"title",required:!1},name:"title",parent:t,informUpdate:n}),u.a.createElement(l.a,{name:u.a.createElement(c.a,{id:"data:abstract",defaultMessage:"摘要"}),extra:"*"}),u.a.createElement(s.a,{field:{type:V.a.String,title:"abstract",required:!1},name:"abstract",parent:t,informUpdate:n}),u.a.createElement(o.a,null,u.a.createElement(a.a,{span:12},u.a.createElement(l.a,{name:u.a.createElement(c.a,{id:"data:keywords",defaultMessage:"关键词"}),extra:"*"}),u.a.createElement("div",null,u.a.createElement(O,{size:"small",tags:t.keywords,onTagsChange:function(e){t.keywords=e,n()}})))),u.a.createElement(o.a,null,u.a.createElement(a.a,{span:24},u.a.createElement(l.a,{name:u.a.createElement(c.a,{id:"data:project",defaultMessage:"一级机构"}),extra:"*"}),u.a.createElement(k,{style:{width:"100%"},value:t.project,onChange:function(e){t.project=e,n()}}))),u.a.createElement(o.a,null,u.a.createElement(a.a,{span:24},u.a.createElement(l.a,{name:u.a.createElement(c.a,{id:"data:subject",defaultMessage:"二级机构"}),extra:"*"}),u.a.createElement(A,{style:{width:"100%"},value:t.subject,onChange:function(e){t.subject=e,n()},projectID:t.project}))),u.a.createElement(o.a,null,u.a.createElement(a.a,{span:24},u.a.createElement(l.a,{name:u.a.createElement(c.a,{id:"data:public_time_range",defaultMessage:"数据可见范围"}),extra:"*"}),u.a.createElement(M,{style:{width:"100%"},is_edit:!0===e,value:""+t.visibility,onChange:function(e){t.visibility=Number(e.split("")[0]),n()}}))))}},60:function(e,t){e.exports=dll_library}});