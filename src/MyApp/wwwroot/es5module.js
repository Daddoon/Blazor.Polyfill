/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _counter = __webpack_require__(1);

var _js_modules_counter_js = _interopRequireWildcard(_counter);

var _lightr = __webpack_require__(2);

var _js_modules_lightr_js = _interopRequireWildcard(_lightr);

var _page = __webpack_require__(3);

var _js_modules_page_js = _interopRequireWildcard(_page);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

(function () {

    if (window._es5Export === undefined || window._es5Export === null) {
        window._es5Export = {};
    }

    window._es5Export['_js_modules_counter_js'] = _js_modules_counter_js;
    window._es5Export['_js_modules_lightr_js'] = _js_modules_lightr_js;
    window._es5Export['_js_modules_page_js'] = _js_modules_page_js;
})();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sayHi = sayHi;
function sayHi(name) {
    alert("hello counter");
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sayHi = sayHi;
function sayHi(name) {
    alert("hello Page!");
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sayHi = sayHi;
function sayHi(name) {
    alert("hello Page!");
}

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMGRiZTYzN2MxODgyZjQxOGU2ZjciLCJ3ZWJwYWNrOi8vLy4vQzovMkJlZS9Tb3VyY2VzL0JsYXpvci5Qb2x5ZmlsbC9zcmMvTXlBcHAvb2JqL1JlbGVhc2UvbmV0NS4wL0JsYXpvclBvbHlmaWxsQnVpbGQvZXM1bW9kdWxlX2VudHJ5LmpzIiwid2VicGFjazovLy8uL0M6LzJCZWUvU291cmNlcy9CbGF6b3IuUG9seWZpbGwvc3JjL015QXBwL3d3d3Jvb3QvanMvbW9kdWxlcy9jb3VudGVyLmpzIiwid2VicGFjazovLy8uL0M6LzJCZWUvU291cmNlcy9CbGF6b3IuUG9seWZpbGwvc3JjL015QXBwL3d3d3Jvb3QvanMvbW9kdWxlcy9saWdodHIuanMiLCJ3ZWJwYWNrOi8vLy4vQzovMkJlZS9Tb3VyY2VzL0JsYXpvci5Qb2x5ZmlsbC9zcmMvTXlBcHAvd3d3cm9vdC9qcy9tb2R1bGVzL3BhZ2UuanMiXSwibmFtZXMiOlsiX2pzX21vZHVsZXNfY291bnRlcl9qcyIsIl9qc19tb2R1bGVzX2xpZ2h0cl9qcyIsIl9qc19tb2R1bGVzX3BhZ2VfanMiLCJ3aW5kb3ciLCJfZXM1RXhwb3J0IiwidW5kZWZpbmVkIiwic2F5SGkiLCJuYW1lIiwiYWxlcnQiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7O1FBRUE7UUFDQTs7Ozs7Ozs7OztBQzdEQTs7SUFBWUEsc0I7O0FBQ1o7O0lBQVlDLHFCOztBQUNaOztJQUFZQyxtQjs7OztBQUdaLENBQUMsWUFBWTs7QUFFVCxRQUFJQyxPQUFPQyxVQUFQLEtBQXNCQyxTQUF0QixJQUFtQ0YsT0FBT0MsVUFBUCxLQUFzQixJQUE3RCxFQUFtRTtBQUMvREQsZUFBT0MsVUFBUCxHQUFvQixFQUFwQjtBQUNIOztBQUVERCxXQUFPQyxVQUFQLENBQWtCLHdCQUFsQixJQUE4Q0osc0JBQTlDO0FBQ0FHLFdBQU9DLFVBQVAsQ0FBa0IsdUJBQWxCLElBQTZDSCxxQkFBN0M7QUFDQUUsV0FBT0MsVUFBUCxDQUFrQixxQkFBbEIsSUFBMkNGLG1CQUEzQztBQUVILENBVkQsSTs7Ozs7Ozs7Ozs7O1FDTGdCSSxLLEdBQUFBLEs7QUFBVCxTQUFTQSxLQUFULENBQWVDLElBQWYsRUFBcUI7QUFDeEJDLFVBQU0sZUFBTjtBQUNILEM7Ozs7Ozs7Ozs7OztRQ0ZlRixLLEdBQUFBLEs7QUFBVCxTQUFTQSxLQUFULENBQWVDLElBQWYsRUFBcUI7QUFDeEJDLFVBQU0sYUFBTjtBQUNILEM7Ozs7Ozs7Ozs7OztRQ0ZlRixLLEdBQUFBLEs7QUFBVCxTQUFTQSxLQUFULENBQWVDLElBQWYsRUFBcUI7QUFDeEJDLFVBQU0sYUFBTjtBQUNILEMiLCJmaWxlIjoiZXM1bW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMGRiZTYzN2MxODgyZjQxOGU2ZjciLCJpbXBvcnQgKiBhcyBfanNfbW9kdWxlc19jb3VudGVyX2pzIGZyb20gJ0M6XFxcXDJCZWVcXFxcU291cmNlc1xcXFxCbGF6b3IuUG9seWZpbGxcXFxcc3JjXFxcXE15QXBwL3d3d3Jvb3QvanMvbW9kdWxlc1xcXFxjb3VudGVyLmpzJztcclxuaW1wb3J0ICogYXMgX2pzX21vZHVsZXNfbGlnaHRyX2pzIGZyb20gJ0M6XFxcXDJCZWVcXFxcU291cmNlc1xcXFxCbGF6b3IuUG9seWZpbGxcXFxcc3JjXFxcXE15QXBwL3d3d3Jvb3QvanMvbW9kdWxlc1xcXFxsaWdodHIuanMnO1xyXG5pbXBvcnQgKiBhcyBfanNfbW9kdWxlc19wYWdlX2pzIGZyb20gJ0M6XFxcXDJCZWVcXFxcU291cmNlc1xcXFxCbGF6b3IuUG9seWZpbGxcXFxcc3JjXFxcXE15QXBwL3d3d3Jvb3QvanMvbW9kdWxlc1xcXFxwYWdlLmpzJztcclxuXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGlmICh3aW5kb3cuX2VzNUV4cG9ydCA9PT0gdW5kZWZpbmVkIHx8IHdpbmRvdy5fZXM1RXhwb3J0ID09PSBudWxsKSB7XHJcbiAgICAgICAgd2luZG93Ll9lczVFeHBvcnQgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICB3aW5kb3cuX2VzNUV4cG9ydFsnX2pzX21vZHVsZXNfY291bnRlcl9qcyddID0gX2pzX21vZHVsZXNfY291bnRlcl9qcztcclxuICAgIHdpbmRvdy5fZXM1RXhwb3J0WydfanNfbW9kdWxlc19saWdodHJfanMnXSA9IF9qc19tb2R1bGVzX2xpZ2h0cl9qcztcclxuICAgIHdpbmRvdy5fZXM1RXhwb3J0WydfanNfbW9kdWxlc19wYWdlX2pzJ10gPSBfanNfbW9kdWxlc19wYWdlX2pzO1xyXG5cclxufSkoKTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DOi8yQmVlL1NvdXJjZXMvQmxhem9yLlBvbHlmaWxsL3NyYy9NeUFwcC9vYmovUmVsZWFzZS9uZXQ1LjAvQmxhem9yUG9seWZpbGxCdWlsZC9lczVtb2R1bGVfZW50cnkuanMiLCJleHBvcnQgZnVuY3Rpb24gc2F5SGkobmFtZSkge1xyXG4gICAgYWxlcnQoXCJoZWxsbyBjb3VudGVyXCIpO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQzovMkJlZS9Tb3VyY2VzL0JsYXpvci5Qb2x5ZmlsbC9zcmMvTXlBcHAvd3d3cm9vdC9qcy9tb2R1bGVzL2NvdW50ZXIuanMiLCJleHBvcnQgZnVuY3Rpb24gc2F5SGkobmFtZSkge1xyXG4gICAgYWxlcnQoXCJoZWxsbyBQYWdlIVwiKTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0M6LzJCZWUvU291cmNlcy9CbGF6b3IuUG9seWZpbGwvc3JjL015QXBwL3d3d3Jvb3QvanMvbW9kdWxlcy9saWdodHIuanMiLCJleHBvcnQgZnVuY3Rpb24gc2F5SGkobmFtZSkge1xyXG4gICAgYWxlcnQoXCJoZWxsbyBQYWdlIVwiKTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0M6LzJCZWUvU291cmNlcy9CbGF6b3IuUG9seWZpbGwvc3JjL015QXBwL3d3d3Jvb3QvanMvbW9kdWxlcy9wYWdlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==