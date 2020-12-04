"use strict";
/* BLAZOR.POLYFILL Version 5.0.100.1 */
Object.defineProperty(exports, "__esModule", { value: true });
require("core-js/es");
require("web-animations-js");
require("whatwg-fetch");
require("abortcontroller-polyfill/dist/polyfill-patch-fetch");
require("../src/template.js");
require("../src/navigator.sendbeacon.js");
//Polyfill for 'after' method not existing on ChildNode on IE9+
require("../src/after.js");
(function () {
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
        if (IsIE()) {
            // Function to make IE9+ support forEach:
            if (window.NodeList && !NodeList.prototype.forEach) {
                NodeList.prototype.forEach = Array.prototype.forEach;
            }
        }
        //Adding document.baseURI for IE and maybe other browser that would not have it
        if (document.baseURI == null || document.baseURI == undefined) {
            try {
                document.baseURI = document.getElementsByTagName("base")[0].href;
            }
            catch (e) {
                console.error("Blazor.Polyfill: Unable to define the undefined 'document.baseURI' property: No <base> tag present in the <head> of the current document.");
                console.error("On a Blazor server-side project, check that '<base href=\"~/\" />' is present as a child tag of your <head> tag.");
            }
        }
        if (IsIE()) {
            //IE doesn't auto start blazor.server.js due to a lacking of currentScript, used in blazor.server.js.
            //Forcing it after Blazor loaded in the DOM
            forceBlazorLoadOnIE(0);
        }
    }
    function BlazorObjectIsFound() {
        try {
            if (Blazor !== undefined && Blazor !== null && Blazor.start !== undefined && Blazor.start !== null) {
                return true;
            }
        }
        catch (e) {
        }
        return false;
    }
    function forceBlazorLoadOnIE(counter) {
        if (BlazorObjectIsFound()) {
            Blazor.start();
        }
        else if (counter <= 200) {
            window.setTimeout(function () {
                forceBlazorLoadOnIE(++counter);
            }, 50);
        }
    }
    blazorPolyfill();
})();
//# sourceMappingURL=Boot.js.map