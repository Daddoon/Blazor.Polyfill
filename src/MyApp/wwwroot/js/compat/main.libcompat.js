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

var counter_js = _interopRequireWildcard(_counter);

var _page = __webpack_require__(2);

var page_js = _interopRequireWildcard(_page);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

(function () {

    if (window._es5Export === undefined || window._es5Export === null) {
        window._es5Export = {};
    }

    window._es5Export["counter_js"] = counter_js;
    window._es5Export["page_js"] = page_js;

    window.es5Import = function (fileName) {

        //Remove any param pollution
        var moduleName = fileName.split('?')[0];

        var lastSeparator = moduleName.lastIndexOf('/');

        if (lastSeparator != -1) {
            moduleName = moduleName.substring(moduleName.lastIndexOf('/') + 1);
        }

        moduleName = moduleName.replace(/\./gi, "_");

        if (window.es5Export[moduleName] !== this.undefined && window.es5Export[moduleName] !== null) {
            return Promise.resolve(window.es5Export[moduleName]);
        } else {
            return Promise.reject(new Error('es5Export: Module not found in cache entries'));
        }
    };
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

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzkzM2NlNjNlZDVmYmM2YWM5NDIiLCJ3ZWJwYWNrOi8vLy4vd3d3cm9vdC9qcy9tb2R1bGVzL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi93d3dyb290L2pzL21vZHVsZXMvY291bnRlci5qcyIsIndlYnBhY2s6Ly8vLi93d3dyb290L2pzL21vZHVsZXMvcGFnZS5qcyJdLCJuYW1lcyI6WyJjb3VudGVyX2pzIiwicGFnZV9qcyIsIndpbmRvdyIsIl9lczVFeHBvcnQiLCJ1bmRlZmluZWQiLCJlczVJbXBvcnQiLCJmaWxlTmFtZSIsIm1vZHVsZU5hbWUiLCJzcGxpdCIsImxhc3RTZXBhcmF0b3IiLCJsYXN0SW5kZXhPZiIsInN1YnN0cmluZyIsInJlcGxhY2UiLCJlczVFeHBvcnQiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsIkVycm9yIiwic2F5SGkiLCJuYW1lIiwiYWxlcnQiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7O1FBRUE7UUFDQTs7Ozs7Ozs7OztBQzdEQTs7SUFBWUEsVTs7QUFDWjs7SUFBWUMsTzs7OztBQUVaLENBQUMsWUFBWTs7QUFFVCxRQUFJQyxPQUFPQyxVQUFQLEtBQXNCQyxTQUF0QixJQUFtQ0YsT0FBT0MsVUFBUCxLQUFzQixJQUE3RCxFQUFtRTtBQUMvREQsZUFBT0MsVUFBUCxHQUFvQixFQUFwQjtBQUNIOztBQUVERCxXQUFPQyxVQUFQLENBQWtCLFlBQWxCLElBQWtDSCxVQUFsQztBQUNBRSxXQUFPQyxVQUFQLENBQWtCLFNBQWxCLElBQStCRixPQUEvQjs7QUFFQUMsV0FBT0csU0FBUCxHQUFtQixVQUFVQyxRQUFWLEVBQW9COztBQUVuQztBQUNBLFlBQUlDLGFBQWFELFNBQVNFLEtBQVQsQ0FBZSxHQUFmLEVBQW9CLENBQXBCLENBQWpCOztBQUVBLFlBQUlDLGdCQUFnQkYsV0FBV0csV0FBWCxDQUF1QixHQUF2QixDQUFwQjs7QUFFQSxZQUFJRCxpQkFBaUIsQ0FBQyxDQUF0QixFQUF5QjtBQUNyQkYseUJBQWFBLFdBQVdJLFNBQVgsQ0FBcUJKLFdBQVdHLFdBQVgsQ0FBdUIsR0FBdkIsSUFBOEIsQ0FBbkQsQ0FBYjtBQUNIOztBQUVESCxxQkFBYUEsV0FBV0ssT0FBWCxDQUFtQixNQUFuQixFQUEyQixHQUEzQixDQUFiOztBQUVBLFlBQUlWLE9BQU9XLFNBQVAsQ0FBaUJOLFVBQWpCLE1BQWlDLEtBQUtILFNBQXRDLElBQW1ERixPQUFPVyxTQUFQLENBQWlCTixVQUFqQixNQUFpQyxJQUF4RixFQUE4RjtBQUMxRixtQkFBT08sUUFBUUMsT0FBUixDQUFnQmIsT0FBT1csU0FBUCxDQUFpQk4sVUFBakIsQ0FBaEIsQ0FBUDtBQUNILFNBRkQsTUFHSztBQUNELG1CQUFPTyxRQUFRRSxNQUFSLENBQWUsSUFBSUMsS0FBSixDQUFVLDhDQUFWLENBQWYsQ0FBUDtBQUNIO0FBQ0osS0FuQkQ7QUFvQkgsQ0E3QkQsSTs7Ozs7Ozs7Ozs7O1FDSGdCQyxLLEdBQUFBLEs7QUFBVCxTQUFTQSxLQUFULENBQWVDLElBQWYsRUFBcUI7QUFDeEJDLFVBQU0sZUFBTjtBQUNILEM7Ozs7Ozs7Ozs7OztRQ0ZlRixLLEdBQUFBLEs7QUFBVCxTQUFTQSxLQUFULENBQWVDLElBQWYsRUFBcUI7QUFDeEJDLFVBQU0sYUFBTjtBQUNILEMiLCJmaWxlIjoibWFpbi5saWJjb21wYXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAzOTMzY2U2M2VkNWZiYzZhYzk0MiIsImltcG9ydCAqIGFzIGNvdW50ZXJfanMgZnJvbSAnLi9jb3VudGVyLmpzJztcclxuaW1wb3J0ICogYXMgcGFnZV9qcyBmcm9tICcuL3BhZ2UuanMnO1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBpZiAod2luZG93Ll9lczVFeHBvcnQgPT09IHVuZGVmaW5lZCB8fCB3aW5kb3cuX2VzNUV4cG9ydCA9PT0gbnVsbCkge1xyXG4gICAgICAgIHdpbmRvdy5fZXM1RXhwb3J0ID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93Ll9lczVFeHBvcnRbXCJjb3VudGVyX2pzXCJdID0gY291bnRlcl9qcztcclxuICAgIHdpbmRvdy5fZXM1RXhwb3J0W1wicGFnZV9qc1wiXSA9IHBhZ2VfanM7XHJcblxyXG4gICAgd2luZG93LmVzNUltcG9ydCA9IGZ1bmN0aW9uIChmaWxlTmFtZSkge1xyXG5cclxuICAgICAgICAvL1JlbW92ZSBhbnkgcGFyYW0gcG9sbHV0aW9uXHJcbiAgICAgICAgdmFyIG1vZHVsZU5hbWUgPSBmaWxlTmFtZS5zcGxpdCgnPycpWzBdO1xyXG5cclxuICAgICAgICB2YXIgbGFzdFNlcGFyYXRvciA9IG1vZHVsZU5hbWUubGFzdEluZGV4T2YoJy8nKTtcclxuXHJcbiAgICAgICAgaWYgKGxhc3RTZXBhcmF0b3IgIT0gLTEpIHtcclxuICAgICAgICAgICAgbW9kdWxlTmFtZSA9IG1vZHVsZU5hbWUuc3Vic3RyaW5nKG1vZHVsZU5hbWUubGFzdEluZGV4T2YoJy8nKSArIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbW9kdWxlTmFtZSA9IG1vZHVsZU5hbWUucmVwbGFjZSgvXFwuL2dpLCBcIl9cIik7XHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cuZXM1RXhwb3J0W21vZHVsZU5hbWVdICE9PSB0aGlzLnVuZGVmaW5lZCAmJiB3aW5kb3cuZXM1RXhwb3J0W21vZHVsZU5hbWVdICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUod2luZG93LmVzNUV4cG9ydFttb2R1bGVOYW1lXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEVycm9yKCdlczVFeHBvcnQ6IE1vZHVsZSBub3QgZm91bmQgaW4gY2FjaGUgZW50cmllcycpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pKCk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vd3d3cm9vdC9qcy9tb2R1bGVzL2FwcC5qcyIsImV4cG9ydCBmdW5jdGlvbiBzYXlIaShuYW1lKSB7XHJcbiAgICBhbGVydChcImhlbGxvIGNvdW50ZXJcIik7XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi93d3dyb290L2pzL21vZHVsZXMvY291bnRlci5qcyIsImV4cG9ydCBmdW5jdGlvbiBzYXlIaShuYW1lKSB7XHJcbiAgICBhbGVydChcImhlbGxvIFBhZ2UhXCIpO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vd3d3cm9vdC9qcy9tb2R1bGVzL3BhZ2UuanMiXSwic291cmNlUm9vdCI6IiJ9