import * as counter_js from './counter.js';
import * as page_js from './page.js';

(function () {
    window.es5Export = {
        counter_js: counter_js,
        page_js: page_js
    };

    window.es5Import = function (fileName) {
        //TODO: If import supported, fallback on native import

        //Remove any param pollution
        var moduleName = fileName.split('?')[0];

        var lastSeparator = moduleName.lastIndexOf('/');

        if (lastSeparator != -1) {
            moduleName = moduleName.substring(moduleName.lastIndexOf('/') + 1);
        }

        moduleName = moduleName.replace(/\./gi, "_");

        if (window.es5Export[moduleName] !== this.undefined && window.es5Export[moduleName] !== null) {
            return Promise.resolve(window.es5Export[moduleName]);
        }
        else {
            return Promise.reject(new Error('es5Export: Module not found in cache entries'));
        }
    }
})();