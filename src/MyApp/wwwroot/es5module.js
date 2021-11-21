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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjg4MDExM2RkM2ZhZjA3OTFjZTYiLCJ3ZWJwYWNrOi8vLy4vQzovMkJlZS9Tb3VyY2VzL0JsYXpvci5Qb2x5ZmlsbC9zcmMvTXlBcHAvb2JqL0RlYnVnL25ldDYuMC9CbGF6b3JQb2x5ZmlsbEJ1aWxkL2VzNW1vZHVsZV9lbnRyeS5qcyIsIndlYnBhY2s6Ly8vLi9DOi8yQmVlL1NvdXJjZXMvQmxhem9yLlBvbHlmaWxsL3NyYy9NeUFwcC93d3dyb290L2pzL21vZHVsZXMvY291bnRlci5qcyIsIndlYnBhY2s6Ly8vLi9DOi8yQmVlL1NvdXJjZXMvQmxhem9yLlBvbHlmaWxsL3NyYy9NeUFwcC93d3dyb290L2pzL21vZHVsZXMvbGlnaHRyLmpzIiwid2VicGFjazovLy8uL0M6LzJCZWUvU291cmNlcy9CbGF6b3IuUG9seWZpbGwvc3JjL015QXBwL3d3d3Jvb3QvanMvbW9kdWxlcy9wYWdlLmpzIl0sIm5hbWVzIjpbIl9qc19tb2R1bGVzX2NvdW50ZXJfanMiLCJfanNfbW9kdWxlc19saWdodHJfanMiLCJfanNfbW9kdWxlc19wYWdlX2pzIiwid2luZG93IiwiX2VzNUV4cG9ydCIsInVuZGVmaW5lZCIsInNheUhpIiwibmFtZSIsImFsZXJ0Il0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLEtBQUs7UUFDTDtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOztRQUVBO1FBQ0E7Ozs7Ozs7Ozs7QUM3REE7O0lBQVlBLHNCOztBQUNaOztJQUFZQyxxQjs7QUFDWjs7SUFBWUMsbUI7Ozs7QUFHWixDQUFDLFlBQVk7O0FBRVQsUUFBSUMsT0FBT0MsVUFBUCxLQUFzQkMsU0FBdEIsSUFBbUNGLE9BQU9DLFVBQVAsS0FBc0IsSUFBN0QsRUFBbUU7QUFDL0RELGVBQU9DLFVBQVAsR0FBb0IsRUFBcEI7QUFDSDs7QUFFREQsV0FBT0MsVUFBUCxDQUFrQix3QkFBbEIsSUFBOENKLHNCQUE5QztBQUNBRyxXQUFPQyxVQUFQLENBQWtCLHVCQUFsQixJQUE2Q0gscUJBQTdDO0FBQ0FFLFdBQU9DLFVBQVAsQ0FBa0IscUJBQWxCLElBQTJDRixtQkFBM0M7QUFFSCxDQVZELEk7Ozs7Ozs7Ozs7OztRQ0xnQkksSyxHQUFBQSxLO0FBQVQsU0FBU0EsS0FBVCxDQUFlQyxJQUFmLEVBQXFCO0FBQ3hCQyxVQUFNLGVBQU47QUFDQUEsVUFBTSxlQUFOO0FBQ0gsQzs7Ozs7Ozs7Ozs7O1FDSGVGLEssR0FBQUEsSztBQUFULFNBQVNBLEtBQVQsQ0FBZUMsSUFBZixFQUFxQjtBQUN4QkMsVUFBTSxhQUFOO0FBQ0gsQzs7Ozs7Ozs7Ozs7O1FDRmVGLEssR0FBQUEsSztBQUFULFNBQVNBLEtBQVQsQ0FBZUMsSUFBZixFQUFxQjtBQUN4QkMsVUFBTSxhQUFOO0FBQ0gsQyIsImZpbGUiOiJlczVtb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA2ODgwMTEzZGQzZmFmMDc5MWNlNiIsImltcG9ydCAqIGFzIF9qc19tb2R1bGVzX2NvdW50ZXJfanMgZnJvbSAnQzpcXFxcMkJlZVxcXFxTb3VyY2VzXFxcXEJsYXpvci5Qb2x5ZmlsbFxcXFxzcmNcXFxcTXlBcHAvd3d3cm9vdC9qcy9tb2R1bGVzXFxcXGNvdW50ZXIuanMnO1xyXG5pbXBvcnQgKiBhcyBfanNfbW9kdWxlc19saWdodHJfanMgZnJvbSAnQzpcXFxcMkJlZVxcXFxTb3VyY2VzXFxcXEJsYXpvci5Qb2x5ZmlsbFxcXFxzcmNcXFxcTXlBcHAvd3d3cm9vdC9qcy9tb2R1bGVzXFxcXGxpZ2h0ci5qcyc7XHJcbmltcG9ydCAqIGFzIF9qc19tb2R1bGVzX3BhZ2VfanMgZnJvbSAnQzpcXFxcMkJlZVxcXFxTb3VyY2VzXFxcXEJsYXpvci5Qb2x5ZmlsbFxcXFxzcmNcXFxcTXlBcHAvd3d3cm9vdC9qcy9tb2R1bGVzXFxcXHBhZ2UuanMnO1xyXG5cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgaWYgKHdpbmRvdy5fZXM1RXhwb3J0ID09PSB1bmRlZmluZWQgfHwgd2luZG93Ll9lczVFeHBvcnQgPT09IG51bGwpIHtcclxuICAgICAgICB3aW5kb3cuX2VzNUV4cG9ydCA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvdy5fZXM1RXhwb3J0WydfanNfbW9kdWxlc19jb3VudGVyX2pzJ10gPSBfanNfbW9kdWxlc19jb3VudGVyX2pzO1xyXG4gICAgd2luZG93Ll9lczVFeHBvcnRbJ19qc19tb2R1bGVzX2xpZ2h0cl9qcyddID0gX2pzX21vZHVsZXNfbGlnaHRyX2pzO1xyXG4gICAgd2luZG93Ll9lczVFeHBvcnRbJ19qc19tb2R1bGVzX3BhZ2VfanMnXSA9IF9qc19tb2R1bGVzX3BhZ2VfanM7XHJcblxyXG59KSgpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0M6LzJCZWUvU291cmNlcy9CbGF6b3IuUG9seWZpbGwvc3JjL015QXBwL29iai9EZWJ1Zy9uZXQ2LjAvQmxhem9yUG9seWZpbGxCdWlsZC9lczVtb2R1bGVfZW50cnkuanMiLCJleHBvcnQgZnVuY3Rpb24gc2F5SGkobmFtZSkge1xyXG4gICAgYWxlcnQoXCJoZWxsbyBjb3VudGVyXCIpO1xyXG4gICAgYWxlcnQoXCJoZWxsbyBjb3VudGVyXCIpO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQzovMkJlZS9Tb3VyY2VzL0JsYXpvci5Qb2x5ZmlsbC9zcmMvTXlBcHAvd3d3cm9vdC9qcy9tb2R1bGVzL2NvdW50ZXIuanMiLCJleHBvcnQgZnVuY3Rpb24gc2F5SGkobmFtZSkge1xyXG4gICAgYWxlcnQoXCJoZWxsbyBQYWdlIVwiKTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0M6LzJCZWUvU291cmNlcy9CbGF6b3IuUG9seWZpbGwvc3JjL015QXBwL3d3d3Jvb3QvanMvbW9kdWxlcy9saWdodHIuanMiLCJleHBvcnQgZnVuY3Rpb24gc2F5SGkobmFtZSkge1xyXG4gICAgYWxlcnQoXCJoZWxsbyBQYWdlIVwiKTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0M6LzJCZWUvU291cmNlcy9CbGF6b3IuUG9seWZpbGwvc3JjL015QXBwL3d3d3Jvb3QvanMvbW9kdWxlcy9wYWdlLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==