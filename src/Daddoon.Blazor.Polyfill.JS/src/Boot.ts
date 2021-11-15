/* BLAZOR.POLYFILL Version 6.0.100.2 */

//Polyfill for Object.assign on IE (used for SyncFusion)
import '../src/assign.polyfill.js';

import 'core-js/stable';
import "regenerator-runtime/runtime";
import 'web-animations-js';
import 'whatwg-fetch';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import '../src/template.js';
import '../src/navigator.sendbeacon.js';

//CanvasToBlob Polyfill
import '../src/canvas-to-blob.js';

//Polyfill for 'after' method not existing on ChildNode on IE9+
import '../src/after.js';

//Polyfill for composedPath on IE
import '../src/composedpath.polyfill.js';

//Polyfill getRootNode
import "get-root-node-polyfill/implement";

declare var Symbol;
declare var document;
declare var window;
declare var Blazor;
declare var NodeList;
declare var File;

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

        //Function emulate lastModified property on File object, missing on IE11 and some Edge Legacy:
        if (window.File && !File.prototype.hasOwnProperty("lastModified")) {
            File.prototype.__defineGetter__("lastModified", function lastModified() {
                // @ts-ignore
                return this.lastModifiedDate;
            });
        }

        //Adding document.baseURI for IE and maybe other browser that would not have it
        if (document.baseURI == null || document.baseURI == undefined) {

            try {
                document.baseURI = document.getElementsByTagName("base")[0].href;
            } catch (e) {
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
        } catch (e) {

        }

        return false;
    }

    function forceBlazorLoadOnIE(counter) {

        if (BlazorObjectIsFound()) {
            Blazor.start();
        }
        else if (counter <= 200) {
            window.setTimeout(function () {
                forceBlazorLoadOnIE(++counter)
            }, 50);
        }
    }

    function absolutePathParser(base, relative) {
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); // remove current file name (or empty string)
        // (omit if "base" is the current folder without trailing slash)
        for (var i = 0; i < parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }

    function pathJoin(path1, path2) {

        if (path1 === null || path1 === undefined) {
            path1 = "";
        }

        if (path2 === null || path2 === undefined) {
            path2 = "";
        }

        var needTrail = true;
        var path1hasTrail = false;
        var path2hasTrail = false;

        if (path1.length - 1 >= 0 && (path1[path1.length - 1] == '/' || path1[path1.length - 1] == '\\')) {
            needTrail = false;
            path1hasTrail = true;
        }

        if (path2.length > 0 && (path2[0] == '/' || path2[0] == '\\')) {
            needTrail = false;
            path2hasTrail = true;
        }

        if (needTrail) {
            return path1 + "/" + path2;
        }
        else {
            if (path1hasTrail && path2hasTrail) {
                return path1 + path2.substring(1);
            }
            else if (path1hasTrail && !path2hasTrail) {
                return path1 + path2;
            }
            else if (!path1hasTrail && path2hasTrail) {
                return path1 + path2;
            }
        }
    }

    blazorPolyfill();

    //Must be set by prior by the server but sanity checking here
    if (window._es5ShouldLoadModuleAfterBoot === undefined || window._es5ShouldLoadModuleAfterBoot === null) {
        window._es5ShouldLoadModuleAfterBoot = false;
    }

    if (window._es5modulePath === undefined || window._es5modulePath === null) {
        window._es5modulePath = "/es5module.min.js";
    }

    window._es5Export = {};
    window._es5Import = function (fileName) {

        if (fileName.length > 0 && fileName[0] !== '/') {
            console.log("_import_: For compatibility reasons, assuming current path '" + fileName + "' as absolute.");
        }

        //Remove any param pollution
        var moduleName = fileName.split('?')[0];

        //Replace all ambigeous "\" to "/"
        moduleName = moduleName.replace(/\\/gi, "/");

        //Parse any strange URI path
        moduleName = absolutePathParser("", moduleName);

        //Add a "/" to the start if not present
        if (moduleName[0] !== '/') {
            moduleName = "/" + moduleName;
        }

        //Normalize path. Replace ".", "/" and "\" with "_".
        moduleName = moduleName
            .replace(/\./gi, "_")
            .replace(/\//gi, "_");

        if (window._es5Export[moduleName] !== this.undefined && window._es5Export[moduleName] !== null) {
            // @ts-ignore
            return Promise.resolve(window._es5Export[moduleName]);
        }
        else {
            // @ts-ignore
            return Promise.reject(new Error('es5Export: Cannot find module "' + fileName + '"'));
        }
    }

    window._import_ = function (fileName, webRootPath) {
        //Assuming that if this polyfill is loaded the user want a full ES5 compliant
        //behavior, even with imports.

        //Actually webRootPath is only use for the real import version that may not retrieve the right base path when
        //trying to load the real isolated file from absolute

        //The "no polyfill" version does integrate an _import_ that call the native import
        return window._es5Import(fileName);
    };

    //After this script is finished, we must "inject" the ES5 fallback user lib, if configured from the server
    if (window._es5ShouldLoadModuleAfterBoot) {
        const script = document.createElement("script");

        //We should compute the script path in adequation of the current app root executing path
        //Either done automatically or overidden

        var relativeBaseURI = new URL(document.baseURI).pathname;
        var absoluteES5ModulePath = pathJoin(relativeBaseURI, window._es5modulePath);

        script.src = absoluteES5ModulePath;
        document.body.appendChild(script);
    }
})();
