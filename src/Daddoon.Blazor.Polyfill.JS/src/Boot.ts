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
declare var document;
declare var self;
declare var window;

(function () {
    function IsIE() {

        if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
            return true;
        }

        return false;
    }

    function IsAndroid() {
        if (/android/i.test(navigator.userAgent)) {
            return true;
        }
    }

    function blazorPolyfill() {

        // IE11 has somme issue about setter with deep recursion
        // with Symbol polyfill. We need to use the useSimple
        // option from core-js
        if (IsIE()) {
            Symbol.useSimple();

            //Adding document.baseURI for IE
            //Additional checks for Internet Explorer"
            if (document.baseURI == null || document.baseURI == undefined) {
                //IE case
                var port = "";
                if (location.port != undefined && location.port != null && location.port != "")
                    port = ":" + location.port;

                document.baseURI = location.protocol + "//" + location.hostname + port + "/";
            }
        }
    }

    function isChrome() {
        if (getChromeVersion() == false)
            return false;
        return true;
    }

    //Return the Chrome version or false
    function getChromeVersion() {
        var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

        //may return true for version == 0 but it's an impossible case
        return raw ? parseInt(raw[2], 10) : false;
    }

    function IsWkWebview() {
        var isWKWebView = false;
        if (navigator.platform.substr(0, 2) === 'iP') {    // iOS detected
            if (window.webkit && window.webkit.messageHandlers) {
                isWKWebView = true;
            }
        }

        return isWKWebView;
    }

    function checkWebAssemblySupport() {

        //Still buggy WkWebview on iOS 11
        if (IsWkWebview()) {
            delete self.WebAssembly;
            return;
        }

        // from https://github.com/brion/min-wasm-fail/blob/master/min-wasm-fail.js

        // detect WebAssembly support and load either WASM or ASM version of Blazor
        // actually, Blazor will fallback to asmjs if the WebAssembly namespace is not
        //found. Removing WebAssembly namespace if buggy iOS browser detected
        var support = (typeof WebAssembly === 'object');
        if (!support) {
            //WebAssembly not supported by default. nothing to do
            return;
        }

        try {
            const bin = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 6, 1, 96, 1, 127, 1, 127, 3, 2, 1, 0, 5, 3, 1, 0, 1, 7, 8, 1, 4, 116, 101, 115, 116, 0, 0, 10, 16, 1, 14, 0, 32, 0, 65, 1, 54, 2, 0, 32, 0, 40, 2, 0, 11]);
            const mod = new WebAssembly.Module(bin);
            const inst = new WebAssembly.Instance(mod, {});
            // test storing to and loading from a non-zero location via a parameter.
            // Safari on iOS 11.2.5 returns 0 unexpectedly at non-zero locations
            support = (inst.exports.test(4) !== 0);
        }
        catch {
            // Some version of iOS crash instead of returning a wrong value. Preventing the crash with this try/catch.
            support = false;
        }

        //Just sanity check for full WebAssembly support on Chrome
        //See https://www.chromestatus.com/feature/5453022515691520
        //This case may not be really effective
        if (isChrome() && getChromeVersion() < 57) {
            support = false;
        }

        if (support == false) {
            //If support value changed, something wrong happened. We must delete WebAssembly namespace then.
            delete self.WebAssembly;
        }
    }

    blazorPolyfill();
    checkWebAssemblySupport();
})();