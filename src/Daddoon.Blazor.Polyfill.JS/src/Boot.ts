/** IE9, IE10 and IE11 requires all of the following polyfills. **/
import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/weak-map';
import 'core-js/es6/set';
import 'core-js/es6/promise'
import 'whatwg-fetch';

declare var Symbol;

function IsIE() {

    if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
        return true;
    }

    return false;
}

function blazorPolyfill() {

    // IE11 has somme issue about setter with deep recursion
    // with Symbol polyfill. We need to use the useSimple
    // option from core-js
    if (IsIE()) {
        Symbol.useSimple();
    }
}

blazorPolyfill();
