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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjg4MDExM2RkM2ZhZjA3OTFjZTYiLCJ3ZWJwYWNrOi8vLy4vQzovMkJlZS9Tb3VyY2VzL0JsYXpvci5Qb2x5ZmlsbC9zcmMvTXlBcHAvb2JqL1JlbGVhc2UvbmV0Ny4wL0JsYXpvclBvbHlmaWxsQnVpbGQvZXM1bW9kdWxlX2VudHJ5LmpzIiwid2VicGFjazovLy8uL0M6LzJCZWUvU291cmNlcy9CbGF6b3IuUG9seWZpbGwvc3JjL015QXBwL3d3d3Jvb3QvanMvbW9kdWxlcy9jb3VudGVyLmpzIiwid2VicGFjazovLy8uL0M6LzJCZWUvU291cmNlcy9CbGF6b3IuUG9seWZpbGwvc3JjL015QXBwL3d3d3Jvb3QvanMvbW9kdWxlcy9saWdodHIuanMiLCJ3ZWJwYWNrOi8vLy4vQzovMkJlZS9Tb3VyY2VzL0JsYXpvci5Qb2x5ZmlsbC9zcmMvTXlBcHAvd3d3cm9vdC9qcy9tb2R1bGVzL3BhZ2UuanMiXSwibmFtZXMiOlsiX2pzX21vZHVsZXNfY291bnRlcl9qcyIsIl9qc19tb2R1bGVzX2xpZ2h0cl9qcyIsIl9qc19tb2R1bGVzX3BhZ2VfanMiLCJ3aW5kb3ciLCJfZXM1RXhwb3J0IiwidW5kZWZpbmVkIiwic2F5SGkiLCJuYW1lIiwiYWxlcnQiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7O1FBRUE7UUFDQTs7Ozs7Ozs7OztBQzdEQTs7SUFBWUEsc0I7O0FBQ1o7O0lBQVlDLHFCOztBQUNaOztJQUFZQyxtQjs7OztBQUdaLENBQUMsWUFBWTs7QUFFVCxRQUFJQyxPQUFPQyxVQUFQLEtBQXNCQyxTQUF0QixJQUFtQ0YsT0FBT0MsVUFBUCxLQUFzQixJQUE3RCxFQUFtRTtBQUMvREQsZUFBT0MsVUFBUCxHQUFvQixFQUFwQjtBQUNIOztBQUVERCxXQUFPQyxVQUFQLENBQWtCLHdCQUFsQixJQUE4Q0osc0JBQTlDO0FBQ0FHLFdBQU9DLFVBQVAsQ0FBa0IsdUJBQWxCLElBQTZDSCxxQkFBN0M7QUFDQUUsV0FBT0MsVUFBUCxDQUFrQixxQkFBbEIsSUFBMkNGLG1CQUEzQztBQUVILENBVkQsSTs7Ozs7Ozs7Ozs7O1FDTGdCSSxLLEdBQUFBLEs7QUFBVCxTQUFTQSxLQUFULENBQWVDLElBQWYsRUFBcUI7QUFDeEJDLFVBQU0sZUFBTjtBQUNBQSxVQUFNLGVBQU47QUFDSCxDOzs7Ozs7Ozs7Ozs7UUNIZUYsSyxHQUFBQSxLO0FBQVQsU0FBU0EsS0FBVCxDQUFlQyxJQUFmLEVBQXFCO0FBQ3hCQyxVQUFNLGFBQU47QUFDSCxDOzs7Ozs7Ozs7Ozs7UUNGZUYsSyxHQUFBQSxLO0FBQVQsU0FBU0EsS0FBVCxDQUFlQyxJQUFmLEVBQXFCO0FBQ3hCQyxVQUFNLGFBQU47QUFDSCxDIiwiZmlsZSI6ImVzNW1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDY4ODAxMTNkZDNmYWYwNzkxY2U2IiwiaW1wb3J0ICogYXMgX2pzX21vZHVsZXNfY291bnRlcl9qcyBmcm9tICdDOlxcXFwyQmVlXFxcXFNvdXJjZXNcXFxcQmxhem9yLlBvbHlmaWxsXFxcXHNyY1xcXFxNeUFwcC93d3dyb290L2pzL21vZHVsZXNcXFxcY291bnRlci5qcyc7XHJcbmltcG9ydCAqIGFzIF9qc19tb2R1bGVzX2xpZ2h0cl9qcyBmcm9tICdDOlxcXFwyQmVlXFxcXFNvdXJjZXNcXFxcQmxhem9yLlBvbHlmaWxsXFxcXHNyY1xcXFxNeUFwcC93d3dyb290L2pzL21vZHVsZXNcXFxcbGlnaHRyLmpzJztcclxuaW1wb3J0ICogYXMgX2pzX21vZHVsZXNfcGFnZV9qcyBmcm9tICdDOlxcXFwyQmVlXFxcXFNvdXJjZXNcXFxcQmxhem9yLlBvbHlmaWxsXFxcXHNyY1xcXFxNeUFwcC93d3dyb290L2pzL21vZHVsZXNcXFxccGFnZS5qcyc7XHJcblxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBpZiAod2luZG93Ll9lczVFeHBvcnQgPT09IHVuZGVmaW5lZCB8fCB3aW5kb3cuX2VzNUV4cG9ydCA9PT0gbnVsbCkge1xyXG4gICAgICAgIHdpbmRvdy5fZXM1RXhwb3J0ID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93Ll9lczVFeHBvcnRbJ19qc19tb2R1bGVzX2NvdW50ZXJfanMnXSA9IF9qc19tb2R1bGVzX2NvdW50ZXJfanM7XHJcbiAgICB3aW5kb3cuX2VzNUV4cG9ydFsnX2pzX21vZHVsZXNfbGlnaHRyX2pzJ10gPSBfanNfbW9kdWxlc19saWdodHJfanM7XHJcbiAgICB3aW5kb3cuX2VzNUV4cG9ydFsnX2pzX21vZHVsZXNfcGFnZV9qcyddID0gX2pzX21vZHVsZXNfcGFnZV9qcztcclxuXHJcbn0pKCk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQzovMkJlZS9Tb3VyY2VzL0JsYXpvci5Qb2x5ZmlsbC9zcmMvTXlBcHAvb2JqL1JlbGVhc2UvbmV0Ny4wL0JsYXpvclBvbHlmaWxsQnVpbGQvZXM1bW9kdWxlX2VudHJ5LmpzIiwiZXhwb3J0IGZ1bmN0aW9uIHNheUhpKG5hbWUpIHtcclxuICAgIGFsZXJ0KFwiaGVsbG8gY291bnRlclwiKTtcclxuICAgIGFsZXJ0KFwiaGVsbG8gY291bnRlclwiKTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0M6LzJCZWUvU291cmNlcy9CbGF6b3IuUG9seWZpbGwvc3JjL015QXBwL3d3d3Jvb3QvanMvbW9kdWxlcy9jb3VudGVyLmpzIiwiZXhwb3J0IGZ1bmN0aW9uIHNheUhpKG5hbWUpIHtcclxuICAgIGFsZXJ0KFwiaGVsbG8gUGFnZSFcIik7XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DOi8yQmVlL1NvdXJjZXMvQmxhem9yLlBvbHlmaWxsL3NyYy9NeUFwcC93d3dyb290L2pzL21vZHVsZXMvbGlnaHRyLmpzIiwiZXhwb3J0IGZ1bmN0aW9uIHNheUhpKG5hbWUpIHtcclxuICAgIGFsZXJ0KFwiaGVsbG8gUGFnZSFcIik7XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DOi8yQmVlL1NvdXJjZXMvQmxhem9yLlBvbHlmaWxsL3NyYy9NeUFwcC93d3dyb290L2pzL21vZHVsZXMvcGFnZS5qcyJdLCJzb3VyY2VSb290IjoiIn0=