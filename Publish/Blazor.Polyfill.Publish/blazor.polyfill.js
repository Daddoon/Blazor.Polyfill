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

/* BLAZOR.POLYFILL Version 0.3.1 */
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(1);
__webpack_require__(2);
__webpack_require__(3);
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
        //Adding document.baseURI for IE and maybe other browser that would not have it
        if (document.baseURI == null || document.baseURI == undefined) {
            try {
                document.baseURI = document.getElementsByTagName("base")[0].href;
            }
            catch (e) {
                //This should not happen as <base> tag must be present at page loading
                var port = "";
                if (window.location.port != undefined && window.location.port != null && window.location.port != "")
                    port = ":" + location.port;
                var path = window.location.pathname;
                if (path === undefined || path === null || path === "") {
                    path = "/";
                }
                document.baseURI = window.location.protocol + "//" + window.location.hostname + port + "/";
            }
        }
        if (IsIE()) {
            //IE doesn't auto start blazor.server.js. Forcing it after Blazor loaded in the DOM
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


/***/ }),
/* 1 */
/***/ (function(module, exports) {

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status === undefined ? 200 : options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

// minimal template polyfill
(function() {
  'use strict';

  var needsTemplate = (typeof HTMLTemplateElement === 'undefined');
  var brokenDocFragment = !(document.createDocumentFragment().cloneNode() instanceof DocumentFragment);
  var needsDocFrag = false;

  // NOTE: Replace DocumentFragment to work around IE11 bug that
  // causes children of a document fragment modified while
  // there is a mutation observer to not have a parentNode, or
  // have a broken parentNode (!?!)
  if (/Trident/.test(navigator.userAgent)) {
    (function() {

      needsDocFrag = true;

      var origCloneNode = Node.prototype.cloneNode;
      Node.prototype.cloneNode = function cloneNode(deep) {
        var newDom = origCloneNode.call(this, deep);
        if (this instanceof DocumentFragment) {
          newDom.__proto__ = DocumentFragment.prototype;
        }
        return newDom;
      };

      // IE's DocumentFragment querySelector code doesn't work when
      // called on an element instance
      DocumentFragment.prototype.querySelectorAll = HTMLElement.prototype.querySelectorAll;
      DocumentFragment.prototype.querySelector = HTMLElement.prototype.querySelector;

      Object.defineProperties(DocumentFragment.prototype, {
        'nodeType': {
          get: function () {
            return Node.DOCUMENT_FRAGMENT_NODE;
          },
          configurable: true
        },

        'localName': {
          get: function () {
            return undefined;
          },
          configurable: true
        },

        'nodeName': {
          get: function () {
            return '#document-fragment';
          },
          configurable: true
        }
      });

      var origInsertBefore = Node.prototype.insertBefore;
      function insertBefore(newNode, refNode) {
        if (newNode instanceof DocumentFragment) {
          var child;
          while ((child = newNode.firstChild)) {
            origInsertBefore.call(this, child, refNode);
          }
        } else {
          origInsertBefore.call(this, newNode, refNode);
        }
        return newNode;
      }
      Node.prototype.insertBefore = insertBefore;

      var origAppendChild = Node.prototype.appendChild;
      Node.prototype.appendChild = function appendChild(child) {
        if (child instanceof DocumentFragment) {
          insertBefore.call(this, child, null);
        } else {
          origAppendChild.call(this, child);
        }
        return child;
      };

      var origRemoveChild = Node.prototype.removeChild;
      var origReplaceChild = Node.prototype.replaceChild;
      Node.prototype.replaceChild = function replaceChild(newChild, oldChild) {
        if (newChild instanceof DocumentFragment) {
          insertBefore.call(this, newChild, oldChild);
          origRemoveChild.call(this, oldChild);
        } else {
          origReplaceChild.call(this, newChild, oldChild);
        }
        return oldChild;
      };

      Document.prototype.createDocumentFragment = function createDocumentFragment() {
        var frag = this.createElement('df');
        frag.__proto__ = DocumentFragment.prototype;
        return frag;
      };

      var origImportNode = Document.prototype.importNode;
      Document.prototype.importNode = function importNode(impNode, deep) {
        deep = deep || false;
        var newNode = origImportNode.call(this, impNode, deep);
        if (impNode instanceof DocumentFragment) {
          newNode.__proto__ = DocumentFragment.prototype;
        }
        return newNode;
      };
    })();
  }

  // NOTE: we rely on this cloneNode not causing element upgrade.
  // This means this polyfill must load before the CE polyfill and
  // this would need to be re-worked if a browser supports native CE
  // but not <template>.
  var capturedCloneNode = Node.prototype.cloneNode;
  var capturedCreateElement = Document.prototype.createElement;
  var capturedImportNode = Document.prototype.importNode;
  var capturedRemoveChild = Node.prototype.removeChild;
  var capturedAppendChild = Node.prototype.appendChild;
  var capturedReplaceChild = Node.prototype.replaceChild;
  var capturedParseFromString = DOMParser.prototype.parseFromString;
  var capturedHTMLElementInnerHTML = Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'innerHTML') || {
    /**
     * @this {!HTMLElement}
     * @return {string}
     */
    get: function() {
      return this.innerHTML;
    },
    /**
     * @this {!HTMLElement}
     * @param {string}
     */
    set: function(text) {
      this.innerHTML = text;
    }
  };
  var capturedChildNodes = Object.getOwnPropertyDescriptor(window.Node.prototype, 'childNodes') || {
    /**
     * @this {!Node}
     * @return {!NodeList}
     */
    get: function() {
      return this.childNodes;
    }
  };

  var elementQuerySelectorAll = Element.prototype.querySelectorAll;
  var docQuerySelectorAll = Document.prototype.querySelectorAll;
  var fragQuerySelectorAll = DocumentFragment.prototype.querySelectorAll;

  var scriptSelector = 'script:not([type]),script[type="application/javascript"],script[type="text/javascript"]';

  function QSA(node, selector) {
    // IE 11 throws a SyntaxError with `scriptSelector` if the node has no children due to the `:not([type])` syntax
    if (!node.childNodes.length) {
      return [];
    }
    switch (node.nodeType) {
      case Node.DOCUMENT_NODE:
        return docQuerySelectorAll.call(node, selector);
      case Node.DOCUMENT_FRAGMENT_NODE:
        return fragQuerySelectorAll.call(node, selector);
      default:
        return elementQuerySelectorAll.call(node, selector);
    }
  }

  // returns true if nested templates cannot be cloned (they cannot be on
  // some impl's like Safari 8 and Edge)
  // OR if cloning a document fragment does not result in a document fragment
  var needsCloning = (function() {
    if (!needsTemplate) {
      var t = document.createElement('template');
      var t2 = document.createElement('template');
      t2.content.appendChild(document.createElement('div'));
      t.content.appendChild(t2);
      var clone = t.cloneNode(true);
      return (clone.content.childNodes.length === 0 || clone.content.firstChild.content.childNodes.length === 0
        || brokenDocFragment);
    }
  })();

  var TEMPLATE_TAG = 'template';
  var PolyfilledHTMLTemplateElement = function() {};

  if (needsTemplate) {

    var contentDoc = document.implementation.createHTMLDocument('template');
    var canDecorate = true;

    var templateStyle = document.createElement('style');
    templateStyle.textContent = TEMPLATE_TAG + '{display:none;}';

    var head = document.head;
    head.insertBefore(templateStyle, head.firstElementChild);

    /**
      Provides a minimal shim for the <template> element.
    */
    PolyfilledHTMLTemplateElement.prototype = Object.create(HTMLElement.prototype);


    // if elements do not have `innerHTML` on instances, then
    // templates can be patched by swizzling their prototypes.
    var canProtoPatch =
      !(document.createElement('div').hasOwnProperty('innerHTML'));

    /**
      The `decorate` method moves element children to the template's `content`.
      NOTE: there is no support for dynamically adding elements to templates.
    */
    PolyfilledHTMLTemplateElement.decorate = function(template) {
      // if the template is decorated or not in HTML namespace, return fast
      if (template.content ||
          template.namespaceURI !== document.documentElement.namespaceURI) {
        return;
      }
      template.content = contentDoc.createDocumentFragment();
      var child;
      while ((child = template.firstChild)) {
        capturedAppendChild.call(template.content, child);
      }
      // NOTE: prefer prototype patching for performance and
      // because on some browsers (IE11), re-defining `innerHTML`
      // can result in intermittent errors.
      if (canProtoPatch) {
        template.__proto__ = PolyfilledHTMLTemplateElement.prototype;
      } else {
        template.cloneNode = function(deep) {
          return PolyfilledHTMLTemplateElement._cloneNode(this, deep);
        };
        // add innerHTML to template, if possible
        // Note: this throws on Safari 7
        if (canDecorate) {
          try {
            defineInnerHTML(template);
            defineOuterHTML(template);
          } catch (err) {
            canDecorate = false;
          }
        }
      }
      // bootstrap recursively
      PolyfilledHTMLTemplateElement.bootstrap(template.content);
    };

    // Taken from https://github.com/jquery/jquery/blob/73d7e6259c63ac45f42c6593da8c2796c6ce9281/src/manipulation/wrapMap.js
    var topLevelWrappingMap = {
      'option': ['select'],
      'thead': ['table'],
      'col': ['colgroup', 'table'],
      'tr': ['tbody', 'table'],
      'th': ['tr', 'tbody', 'table'],
      'td': ['tr', 'tbody', 'table']
    };

    var getTagName = function(text) {
      // Taken from https://github.com/jquery/jquery/blob/73d7e6259c63ac45f42c6593da8c2796c6ce9281/src/manipulation/var/rtagName.js
      return ( /<([a-z][^/\0>\x20\t\r\n\f]+)/i.exec(text) || ['', ''])[1].toLowerCase();
    };

    var defineInnerHTML = function defineInnerHTML(obj) {
      Object.defineProperty(obj, 'innerHTML', {
        get: function() {
          return getInnerHTML(this);
        },
        set: function(text) {
          // For IE11, wrap the text in the correct (table) context
          var wrap = topLevelWrappingMap[getTagName(text)];
          if (wrap) {
            for (var i = 0; i < wrap.length; i++) {
              text = '<' + wrap[i] + '>' + text + '</' + wrap[i] + '>';
            }
          }
          contentDoc.body.innerHTML = text;
          PolyfilledHTMLTemplateElement.bootstrap(contentDoc);
          while (this.content.firstChild) {
            capturedRemoveChild.call(this.content, this.content.firstChild);
          }
          var body = contentDoc.body;
          // If we had wrapped, get back to the original node
          if (wrap) {
            for (var j = 0; j < wrap.length; j++) {
              body = body.lastChild;
            }
          }
          while (body.firstChild) {
            capturedAppendChild.call(this.content, body.firstChild);
          }
        },
        configurable: true
      });
    };

    var defineOuterHTML = function defineOuterHTML(obj) {
      Object.defineProperty(obj, 'outerHTML', {
        get: function() {
          return '<' + TEMPLATE_TAG + '>' + this.innerHTML + '</' + TEMPLATE_TAG + '>';
        },
        set: function(innerHTML) {
          if (this.parentNode) {
            contentDoc.body.innerHTML = innerHTML;
            var docFrag = this.ownerDocument.createDocumentFragment();
            while (contentDoc.body.firstChild) {
              capturedAppendChild.call(docFrag, contentDoc.body.firstChild);
            }
            capturedReplaceChild.call(this.parentNode, docFrag, this);
          } else {
            throw new Error("Failed to set the 'outerHTML' property on 'Element': This element has no parent node.");
          }
        },
        configurable: true
      });
    };

    defineInnerHTML(PolyfilledHTMLTemplateElement.prototype);
    defineOuterHTML(PolyfilledHTMLTemplateElement.prototype);

    /**
      The `bootstrap` method is called automatically and "fixes" all
      <template> elements in the document referenced by the `doc` argument.
    */
    PolyfilledHTMLTemplateElement.bootstrap = function bootstrap(doc) {
      var templates = QSA(doc, TEMPLATE_TAG);
      for (var i=0, l=templates.length, t; (i<l) && (t=templates[i]); i++) {
        PolyfilledHTMLTemplateElement.decorate(t);
      }
    };

    // auto-bootstrapping for main document
    document.addEventListener('DOMContentLoaded', function() {
      PolyfilledHTMLTemplateElement.bootstrap(document);
    });

    // Patch document.createElement to ensure newly created templates have content
    Document.prototype.createElement = function createElement() {
      var el = capturedCreateElement.apply(this, arguments);
      if (el.localName === 'template') {
        PolyfilledHTMLTemplateElement.decorate(el);
      }
      return el;
    };

    DOMParser.prototype.parseFromString = function() {
      var el = capturedParseFromString.apply(this, arguments);
      PolyfilledHTMLTemplateElement.bootstrap(el);
      return el;
    };

    Object.defineProperty(HTMLElement.prototype, 'innerHTML', {
      get: function() {
        return getInnerHTML(this);
      },
      set: function(text) {
        capturedHTMLElementInnerHTML.set.call(this, text);
        PolyfilledHTMLTemplateElement.bootstrap(this);
      },
      configurable: true,
      enumerable: true
    });

    // http://www.whatwg.org/specs/web-apps/current-work/multipage/the-end.html#escapingString
    var escapeAttrRegExp = /[&\u00A0"]/g;
    var escapeDataRegExp = /[&\u00A0<>]/g;

    var escapeReplace = function(c) {
      switch (c) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case '\u00A0':
          return '&nbsp;';
      }
    };

    var escapeAttr = function(s) {
      return s.replace(escapeAttrRegExp, escapeReplace);
    };

    var escapeData = function(s) {
      return s.replace(escapeDataRegExp, escapeReplace);
    };

    var makeSet = function(arr) {
      var set = {};
      for (var i = 0; i < arr.length; i++) {
        set[arr[i]] = true;
      }
      return set;
    };

    // http://www.whatwg.org/specs/web-apps/current-work/#void-elements
    var voidElements = makeSet([
      'area',
      'base',
      'br',
      'col',
      'command',
      'embed',
      'hr',
      'img',
      'input',
      'keygen',
      'link',
      'meta',
      'param',
      'source',
      'track',
      'wbr'
    ]);

    var plaintextParents = makeSet([
      'style',
      'script',
      'xmp',
      'iframe',
      'noembed',
      'noframes',
      'plaintext',
      'noscript'
    ]);

    /**
     * @param {Node} node
     * @param {Node} parentNode
     * @param {Function=} callback
     */
    var getOuterHTML = function(node, parentNode, callback) {
      switch (node.nodeType) {
        case Node.ELEMENT_NODE: {
          var tagName = node.localName;
          var s = '<' + tagName;
          var attrs = node.attributes;
          for (var i = 0, attr; (attr = attrs[i]); i++) {
            s += ' ' + attr.name + '="' + escapeAttr(attr.value) + '"';
          }
          s += '>';
          if (voidElements[tagName]) {
            return s;
          }
          return s + getInnerHTML(node, callback) + '</' + tagName + '>';
        }
        case Node.TEXT_NODE: {
          var data = /** @type {Text} */ (node).data;
          if (parentNode && plaintextParents[parentNode.localName]) {
            return data;
          }
          return escapeData(data);
        }
        case Node.COMMENT_NODE: {
          return '<!--' + /** @type {Comment} */ (node).data + '-->';
        }
        default: {
          window.console.error(node);
          throw new Error('not implemented');
        }
      }
    };

    /**
     * @param {Node} node
     * @param {Function=} callback
     */
    var getInnerHTML = function(node, callback) {
      if (node.localName === 'template') {
        node =  /** @type {HTMLTemplateElement} */ (node).content;
      }
      var s = '';
      var c$ = callback ? callback(node) : capturedChildNodes.get.call(node);
      for (var i=0, l=c$.length, child; (i<l) && (child=c$[i]); i++) {
        s += getOuterHTML(child, node, callback);
      }
      return s;
    };

  }

  // make cloning/importing work!
  if (needsTemplate || needsCloning) {

    PolyfilledHTMLTemplateElement._cloneNode = function _cloneNode(template, deep) {
      var clone = capturedCloneNode.call(template, false);
      // NOTE: decorate doesn't auto-fix children because they are already
      // decorated so they need special clone fixup.
      if (this.decorate) {
        this.decorate(clone);
      }
      if (deep) {
        // NOTE: use native clone node to make sure CE's wrapped
        // cloneNode does not cause elements to upgrade.
        capturedAppendChild.call(clone.content, capturedCloneNode.call(template.content, true));
        // now ensure nested templates are cloned correctly.
        fixClonedDom(clone.content, template.content);
      }
      return clone;
    };

    // Given a source and cloned subtree, find <template>'s in the cloned
    // subtree and replace them with cloned <template>'s from source.
    // We must do this because only the source templates have proper .content.
    var fixClonedDom = function fixClonedDom(clone, source) {
      // do nothing if cloned node is not an element
      if (!source.querySelectorAll) return;
      // these two lists should be coincident
      var s$ = QSA(source, TEMPLATE_TAG);
      if (s$.length === 0) {
        return;
      }
      var t$ = QSA(clone, TEMPLATE_TAG);
      for (var i=0, l=t$.length, t, s; i<l; i++) {
        s = s$[i];
        t = t$[i];
        if (PolyfilledHTMLTemplateElement && PolyfilledHTMLTemplateElement.decorate) {
          PolyfilledHTMLTemplateElement.decorate(s);
        }
        capturedReplaceChild.call(t.parentNode, cloneNode.call(s, true), t);
      }
    };

    // make sure scripts inside of a cloned template are executable
    var fixClonedScripts = function fixClonedScripts(fragment) {
      var scripts = QSA(fragment, scriptSelector);
      for (var ns, s, i = 0; i < scripts.length; i++) {
        s = scripts[i];
        ns = capturedCreateElement.call(document, 'script');
        ns.textContent = s.textContent;
        var attrs = s.attributes;
        for (var ai = 0, a; ai < attrs.length; ai++) {
          a = attrs[ai];
          ns.setAttribute(a.name, a.value);
        }
        capturedReplaceChild.call(s.parentNode, ns, s);
      }
    };

    // override all cloning to fix the cloned subtree to contain properly
    // cloned templates.
    var cloneNode = Node.prototype.cloneNode = function cloneNode(deep) {
      var dom;
      // workaround for Edge bug cloning documentFragments
      // https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/8619646/
      if (!needsDocFrag && brokenDocFragment && this instanceof DocumentFragment) {
        if (!deep) {
          return this.ownerDocument.createDocumentFragment();
        } else {
          dom = importNode.call(this.ownerDocument, this, true);
        }
      } else if (this.nodeType === Node.ELEMENT_NODE &&
                 this.localName === TEMPLATE_TAG &&
                 this.namespaceURI == document.documentElement.namespaceURI) {
        dom = PolyfilledHTMLTemplateElement._cloneNode(this, deep);
      } else {
        dom = capturedCloneNode.call(this, deep);
      }
      // template.content is cloned iff `deep`.
      if (deep) {
        fixClonedDom(dom, this);
      }
      return dom;
    };

    // NOTE: we are cloning instead of importing <template>'s.
    // However, the ownerDocument of the cloned template will be correct!
    // This is because the native import node creates the right document owned
    // subtree and `fixClonedDom` inserts cloned templates into this subtree,
    // thus updating the owner doc.
    var importNode = Document.prototype.importNode = function importNode(element, deep) {
      deep = deep || false;
      if (element.localName === TEMPLATE_TAG) {
        return PolyfilledHTMLTemplateElement._cloneNode(element, deep);
      } else {
        var dom = capturedImportNode.call(this, element, deep);
        if (deep) {
          fixClonedDom(dom, element);
          fixClonedScripts(dom);
        }
        return dom;
      }
    };
  }

  if (needsTemplate) {
    window.HTMLTemplateElement = PolyfilledHTMLTemplateElement;
  }

})();


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

!function(t,e){ true?e():"function"==typeof define&&define.amd?define(e):e()}(0,function(){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}var e=function(t){return"string"==typeof t},n=function(t){return t instanceof Blob};(function(){if(function(){return"navigator"in this&&"sendBeacon"in this.navigator}.call(this))return;"navigator"in this||(this.navigator={});"function"!=typeof this.navigator.sendBeacon&&(this.navigator.sendBeacon=function(t,o){var i=this.event&&this.event.type,r="unload"===i||"beforeunload"===i,s="XMLHttpRequest"in this?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");s.open("POST",t,!r),s.withCredentials=!0,s.setRequestHeader("Accept","*/*"),e(o)?(s.setRequestHeader("Content-Type","text/plain;charset=UTF-8"),s.responseType="text"):n(o)&&o.type&&s.setRequestHeader("Content-Type",o.type);try{s.send(o)}catch(t){return!1}return!0}.bind(this))}).call("object"===("undefined"==typeof window?"undefined":t(window))?window:{})});


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWQwYWMzMjllNzFlZjQwY2FjN2QiLCJ3ZWJwYWNrOi8vLy4vc3JjL0Jvb3QudHMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3doYXR3Zy1mZXRjaC9mZXRjaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdGVtcGxhdGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL25hdmlnYXRvci5zZW5kYmVhY29uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDN0RBLG1DQUFtQzs7QUFFbkMsdUJBQXNCO0FBQ3RCLHVCQUE0QjtBQUM1Qix1QkFBd0M7QUFPeEMsQ0FBQztJQUNHO1FBRUksRUFBRSxDQUFDLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQ7UUFFSSx3REFBd0Q7UUFDeEQscURBQXFEO1FBQ3JELHNCQUFzQjtRQUN0QixFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDVCxNQUFNLENBQUMsU0FBUyxF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QUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZELFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVCw4RUFBOEU7QUFDOUU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4QkFBOEIsdUJBQXVCO0FBQ3JEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsdUNBQXVD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QWMsaUZBQWlGLGdCQUFnQixhQUFhLG9HQUFvRyxLQUFLLGtCQUFrQix5QkFBeUIsZUFBZSwwQkFBMEIsWUFBWSxjQUFjLHdEQUF3RCxtQkFBbUIsc0NBQXNDLEVBQUUsdUZBQXVGLHlKQUF5SixnSUFBZ0ksK0ZBQStGLElBQUksVUFBVSxTQUFTLFNBQVMsU0FBUyxhQUFhLDhFQUE4RSxFQUFFIiwiZmlsZSI6ImJsYXpvci5wb2x5ZmlsbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGFkMGFjMzI5ZTcxZWY0MGNhYzdkIiwiLyogQkxBWk9SLlBPTFlGSUxMIFZlcnNpb24gMC4zLjEgKi9cclxuXHJcbmltcG9ydCAnd2hhdHdnLWZldGNoJztcclxuaW1wb3J0ICcuLi9zcmMvdGVtcGxhdGUuanMnO1xyXG5pbXBvcnQgJy4uL3NyYy9uYXZpZ2F0b3Iuc2VuZGJlYWNvbi5qcyc7XHJcblxyXG5kZWNsYXJlIHZhciBTeW1ib2w7XHJcbmRlY2xhcmUgdmFyIGRvY3VtZW50O1xyXG5kZWNsYXJlIHZhciB3aW5kb3c7XHJcbmRlY2xhcmUgdmFyIEJsYXpvcjtcclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBJc0lFKCkge1xyXG5cclxuICAgICAgICBpZiAoL01TSUUgXFxkfFRyaWRlbnQuKnJ2Oi8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBibGF6b3JQb2x5ZmlsbCgpIHtcclxuXHJcbiAgICAgICAgLy8gSUUxMSBoYXMgc29tbWUgaXNzdWUgYWJvdXQgc2V0dGVyIHdpdGggZGVlcCByZWN1cnNpb25cclxuICAgICAgICAvLyB3aXRoIFN5bWJvbCBwb2x5ZmlsbC4gV2UgbmVlZCB0byB1c2UgdGhlIHVzZVNpbXBsZVxyXG4gICAgICAgIC8vIG9wdGlvbiBmcm9tIGNvcmUtanNcclxuICAgICAgICBpZiAoSXNJRSgpKSB7XHJcbiAgICAgICAgICAgIFN5bWJvbC51c2VTaW1wbGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vQWRkaW5nIGRvY3VtZW50LmJhc2VVUkkgZm9yIElFIGFuZCBtYXliZSBvdGhlciBicm93c2VyIHRoYXQgd291bGQgbm90IGhhdmUgaXRcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYmFzZVVSSSA9PSBudWxsIHx8IGRvY3VtZW50LmJhc2VVUkkgPT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYmFzZVVSSSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYmFzZVwiKVswXS5ocmVmO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9UaGlzIHNob3VsZCBub3QgaGFwcGVuIGFzIDxiYXNlPiB0YWcgbXVzdCBiZSBwcmVzZW50IGF0IHBhZ2UgbG9hZGluZ1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBwb3J0ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24ucG9ydCAhPSB1bmRlZmluZWQgJiYgd2luZG93LmxvY2F0aW9uLnBvcnQgIT0gbnVsbCAmJiB3aW5kb3cubG9jYXRpb24ucG9ydCAhPSBcIlwiKVxyXG4gICAgICAgICAgICAgICAgICAgIHBvcnQgPSBcIjpcIiArIGxvY2F0aW9uLnBvcnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XHJcbiAgICAgICAgICAgICAgICBpZiAocGF0aCA9PT0gdW5kZWZpbmVkIHx8IHBhdGggPT09IG51bGwgfHwgcGF0aCA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhdGggPSBcIi9cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5iYXNlVVJJID0gd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lICsgcG9ydCArIFwiL1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoSXNJRSgpKSB7XHJcbiAgICAgICAgICAgIC8vSUUgZG9lc24ndCBhdXRvIHN0YXJ0IGJsYXpvci5zZXJ2ZXIuanMuIEZvcmNpbmcgaXQgYWZ0ZXIgQmxhem9yIGxvYWRlZCBpbiB0aGUgRE9NXHJcbiAgICAgICAgICAgIGZvcmNlQmxhem9yTG9hZE9uSUUoMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIEJsYXpvck9iamVjdElzRm91bmQoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKEJsYXpvciAhPT0gdW5kZWZpbmVkICYmIEJsYXpvciAhPT0gbnVsbCAmJiBCbGF6b3Iuc3RhcnQgIT09IHVuZGVmaW5lZCAmJiBCbGF6b3Iuc3RhcnQgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBmb3JjZUJsYXpvckxvYWRPbklFKGNvdW50ZXIpIHtcclxuXHJcbiAgICAgICAgaWYgKEJsYXpvck9iamVjdElzRm91bmQoKSkge1xyXG4gICAgICAgICAgICBCbGF6b3Iuc3RhcnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY291bnRlciA8PSAyMDApIHtcclxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgZm9yY2VCbGF6b3JMb2FkT25JRSgrK2NvdW50ZXIpXHJcbiAgICAgICAgICAgIH0sIDUwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYmxhem9yUG9seWZpbGwoKTtcclxufSkoKTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0Jvb3QudHMiLCIoZnVuY3Rpb24oc2VsZikge1xuICAndXNlIHN0cmljdCc7XG5cbiAgaWYgKHNlbGYuZmV0Y2gpIHtcbiAgICByZXR1cm5cbiAgfVxuXG4gIHZhciBzdXBwb3J0ID0ge1xuICAgIHNlYXJjaFBhcmFtczogJ1VSTFNlYXJjaFBhcmFtcycgaW4gc2VsZixcbiAgICBpdGVyYWJsZTogJ1N5bWJvbCcgaW4gc2VsZiAmJiAnaXRlcmF0b3InIGluIFN5bWJvbCxcbiAgICBibG9iOiAnRmlsZVJlYWRlcicgaW4gc2VsZiAmJiAnQmxvYicgaW4gc2VsZiAmJiAoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBuZXcgQmxvYigpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfSkoKSxcbiAgICBmb3JtRGF0YTogJ0Zvcm1EYXRhJyBpbiBzZWxmLFxuICAgIGFycmF5QnVmZmVyOiAnQXJyYXlCdWZmZXInIGluIHNlbGZcbiAgfVxuXG4gIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyKSB7XG4gICAgdmFyIHZpZXdDbGFzc2VzID0gW1xuICAgICAgJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50OENsYW1wZWRBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDE2QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEludDMyQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBGbG9hdDMyQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEZsb2F0NjRBcnJheV0nXG4gICAgXVxuXG4gICAgdmFyIGlzRGF0YVZpZXcgPSBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgRGF0YVZpZXcucHJvdG90eXBlLmlzUHJvdG90eXBlT2Yob2JqKVxuICAgIH1cblxuICAgIHZhciBpc0FycmF5QnVmZmVyVmlldyA9IEFycmF5QnVmZmVyLmlzVmlldyB8fCBmdW5jdGlvbihvYmopIHtcbiAgICAgIHJldHVybiBvYmogJiYgdmlld0NsYXNzZXMuaW5kZXhPZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSkgPiAtMVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWUgPSBTdHJpbmcobmFtZSlcbiAgICB9XG4gICAgaWYgKC9bXmEtejAtOVxcLSMkJSYnKisuXFxeX2B8fl0vaS50ZXN0KG5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGNoYXJhY3RlciBpbiBoZWFkZXIgZmllbGQgbmFtZScpXG4gICAgfVxuICAgIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcbiAgfVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZVZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIC8vIEJ1aWxkIGEgZGVzdHJ1Y3RpdmUgaXRlcmF0b3IgZm9yIHRoZSB2YWx1ZSBsaXN0XG4gIGZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0ge1xuICAgICAgbmV4dDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcbiAgICAgICAgcmV0dXJuIHtkb25lOiB2YWx1ZSA9PT0gdW5kZWZpbmVkLCB2YWx1ZTogdmFsdWV9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICAgIGl0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZXJhdG9yXG4gIH1cblxuICBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgICB0aGlzLm1hcCA9IHt9XG5cbiAgICBpZiAoaGVhZGVycyBpbnN0YW5jZW9mIEhlYWRlcnMpIHtcbiAgICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCB2YWx1ZSlcbiAgICAgIH0sIHRoaXMpXG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24oaGVhZGVyKSB7XG4gICAgICAgIHRoaXMuYXBwZW5kKGhlYWRlclswXSwgaGVhZGVyWzFdKVxuICAgICAgfSwgdGhpcylcbiAgICB9IGVsc2UgaWYgKGhlYWRlcnMpIHtcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuICAgICAgICB0aGlzLmFwcGVuZChuYW1lLCBoZWFkZXJzW25hbWVdKVxuICAgICAgfSwgdGhpcylcbiAgICB9XG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5hcHBlbmQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gICAgdmFsdWUgPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLm1hcFtuYW1lXVxuICAgIHRoaXMubWFwW25hbWVdID0gb2xkVmFsdWUgPyBvbGRWYWx1ZSsnLCcrdmFsdWUgOiB2YWx1ZVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGVbJ2RlbGV0ZSddID0gZnVuY3Rpb24obmFtZSkge1xuICAgIGRlbGV0ZSB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICAgIG5hbWUgPSBub3JtYWxpemVOYW1lKG5hbWUpXG4gICAgcmV0dXJuIHRoaXMuaGFzKG5hbWUpID8gdGhpcy5tYXBbbmFtZV0gOiBudWxsXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZU5hbWUobmFtZSkpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbihuYW1lLCB2YWx1ZSkge1xuICAgIHRoaXMubWFwW25vcm1hbGl6ZU5hbWUobmFtZSldID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oY2FsbGJhY2ssIHRoaXNBcmcpIHtcbiAgICBmb3IgKHZhciBuYW1lIGluIHRoaXMubWFwKSB7XG4gICAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB0aGlzLm1hcFtuYW1lXSwgbmFtZSwgdGhpcylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGl0ZW1zID0gW11cbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHsgaXRlbXMucHVzaChuYW1lKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7IGl0ZW1zLnB1c2godmFsdWUpIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2goW25hbWUsIHZhbHVlXSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBpZiAoc3VwcG9ydC5pdGVyYWJsZSkge1xuICAgIEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzXG4gIH1cblxuICBmdW5jdGlvbiBjb25zdW1lZChib2R5KSB7XG4gICAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKSlcbiAgICB9XG4gICAgYm9keS5ib2R5VXNlZCA9IHRydWVcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdClcbiAgICAgIH1cbiAgICAgIHJlYWRlci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChyZWFkZXIuZXJyb3IpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gICAgcmV0dXJuIHByb21pc2VcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcbiAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKVxuICAgIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgICByZWFkZXIucmVhZEFzVGV4dChibG9iKVxuICAgIHJldHVybiBwcm9taXNlXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQXJyYXlCdWZmZXJBc1RleHQoYnVmKSB7XG4gICAgdmFyIHZpZXcgPSBuZXcgVWludDhBcnJheShidWYpXG4gICAgdmFyIGNoYXJzID0gbmV3IEFycmF5KHZpZXcubGVuZ3RoKVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjaGFyc1tpXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUodmlld1tpXSlcbiAgICB9XG4gICAgcmV0dXJuIGNoYXJzLmpvaW4oJycpXG4gIH1cblxuICBmdW5jdGlvbiBidWZmZXJDbG9uZShidWYpIHtcbiAgICBpZiAoYnVmLnNsaWNlKSB7XG4gICAgICByZXR1cm4gYnVmLnNsaWNlKDApXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmLmJ5dGVMZW5ndGgpXG4gICAgICB2aWV3LnNldChuZXcgVWludDhBcnJheShidWYpKVxuICAgICAgcmV0dXJuIHZpZXcuYnVmZmVyXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gQm9keSgpIHtcbiAgICB0aGlzLmJvZHlVc2VkID0gZmFsc2VcblxuICAgIHRoaXMuX2luaXRCb2R5ID0gZnVuY3Rpb24oYm9keSkge1xuICAgICAgdGhpcy5fYm9keUluaXQgPSBib2R5XG4gICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSAnJ1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYmxvYiAmJiBCbG9iLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlCbG9iID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlGb3JtRGF0YSA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgc3VwcG9ydC5ibG9iICYmIGlzRGF0YVZpZXcoYm9keSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keS5idWZmZXIpXG4gICAgICAgIC8vIElFIDEwLTExIGNhbid0IGhhbmRsZSBhIERhdGFWaWV3IGJvZHkuXG4gICAgICAgIHRoaXMuX2JvZHlJbml0ID0gbmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuYXJyYXlCdWZmZXIgJiYgKEFycmF5QnVmZmVyLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpIHx8IGlzQXJyYXlCdWZmZXJWaWV3KGJvZHkpKSkge1xuICAgICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCd1bnN1cHBvcnRlZCBCb2R5SW5pdCB0eXBlJylcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSkge1xuICAgICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ3RleHQvcGxhaW47Y2hhcnNldD1VVEYtOCcpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUJsb2IgJiYgdGhpcy5fYm9keUJsb2IudHlwZSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpXG4gICAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5zZWFyY2hQYXJhbXMgJiYgVVJMU2VhcmNoUGFyYW1zLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICAgICAgdGhpcy5oZWFkZXJzLnNldCgnY29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDtjaGFyc2V0PVVURi04JylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICAgIHRoaXMuYmxvYiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUJsb2IpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSkpXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjb3VsZCBub3QgcmVhZCBGb3JtRGF0YSBib2R5IGFzIGJsb2InKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlUZXh0XSkpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5hcnJheUJ1ZmZlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnN1bWVkKHRoaXMpIHx8IFByb21pc2UucmVzb2x2ZSh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuYmxvYigpLnRoZW4ocmVhZEJsb2JBc0FycmF5QnVmZmVyKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgcmVqZWN0ZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgIHJldHVybiByZWplY3RlZFxuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShyZWFkQXJyYXlCdWZmZXJBc1RleHQodGhpcy5fYm9keUFycmF5QnVmZmVyKSlcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyB0ZXh0JylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnQuZm9ybURhdGEpIHtcbiAgICAgIHRoaXMuZm9ybURhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oZGVjb2RlKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuanNvbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oSlNPTi5wYXJzZSlcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLy8gSFRUUCBtZXRob2RzIHdob3NlIGNhcGl0YWxpemF0aW9uIHNob3VsZCBiZSBub3JtYWxpemVkXG4gIHZhciBtZXRob2RzID0gWydERUxFVEUnLCAnR0VUJywgJ0hFQUQnLCAnT1BUSU9OUycsICdQT1NUJywgJ1BVVCddXG5cbiAgZnVuY3Rpb24gbm9ybWFsaXplTWV0aG9kKG1ldGhvZCkge1xuICAgIHZhciB1cGNhc2VkID0gbWV0aG9kLnRvVXBwZXJDYXNlKClcbiAgICByZXR1cm4gKG1ldGhvZHMuaW5kZXhPZih1cGNhc2VkKSA+IC0xKSA/IHVwY2FzZWQgOiBtZXRob2RcbiAgfVxuXG4gIGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgIHZhciBib2R5ID0gb3B0aW9ucy5ib2R5XG5cbiAgICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgICBpZiAoaW5wdXQuYm9keVVzZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJylcbiAgICAgIH1cbiAgICAgIHRoaXMudXJsID0gaW5wdXQudXJsXG4gICAgICB0aGlzLmNyZWRlbnRpYWxzID0gaW5wdXQuY3JlZGVudGlhbHNcbiAgICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKGlucHV0LmhlYWRlcnMpXG4gICAgICB9XG4gICAgICB0aGlzLm1ldGhvZCA9IGlucHV0Lm1ldGhvZFxuICAgICAgdGhpcy5tb2RlID0gaW5wdXQubW9kZVxuICAgICAgaWYgKCFib2R5ICYmIGlucHV0Ll9ib2R5SW5pdCAhPSBudWxsKSB7XG4gICAgICAgIGJvZHkgPSBpbnB1dC5fYm9keUluaXRcbiAgICAgICAgaW5wdXQuYm9keVVzZWQgPSB0cnVlXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudXJsID0gU3RyaW5nKGlucHV0KVxuICAgIH1cblxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBvcHRpb25zLmNyZWRlbnRpYWxzIHx8IHRoaXMuY3JlZGVudGlhbHMgfHwgJ29taXQnXG4gICAgaWYgKG9wdGlvbnMuaGVhZGVycyB8fCAhdGhpcy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gICAgfVxuICAgIHRoaXMubWV0aG9kID0gbm9ybWFsaXplTWV0aG9kKG9wdGlvbnMubWV0aG9kIHx8IHRoaXMubWV0aG9kIHx8ICdHRVQnKVxuICAgIHRoaXMubW9kZSA9IG9wdGlvbnMubW9kZSB8fCB0aGlzLm1vZGUgfHwgbnVsbFxuICAgIHRoaXMucmVmZXJyZXIgPSBudWxsXG5cbiAgICBpZiAoKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSAmJiBib2R5KSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdCb2R5IG5vdCBhbGxvd2VkIGZvciBHRVQgb3IgSEVBRCByZXF1ZXN0cycpXG4gICAgfVxuICAgIHRoaXMuX2luaXRCb2R5KGJvZHkpXG4gIH1cblxuICBSZXF1ZXN0LnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzLCB7IGJvZHk6IHRoaXMuX2JvZHlJbml0IH0pXG4gIH1cblxuICBmdW5jdGlvbiBkZWNvZGUoYm9keSkge1xuICAgIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKClcbiAgICBib2R5LnRyaW0oKS5zcGxpdCgnJicpLmZvckVhY2goZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAgIGlmIChieXRlcykge1xuICAgICAgICB2YXIgc3BsaXQgPSBieXRlcy5zcGxpdCgnPScpXG4gICAgICAgIHZhciBuYW1lID0gc3BsaXQuc2hpZnQoKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICB2YXIgdmFsdWUgPSBzcGxpdC5qb2luKCc9JykucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgZm9ybS5hcHBlbmQoZGVjb2RlVVJJQ29tcG9uZW50KG5hbWUpLCBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGZvcm1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlSGVhZGVycyhyYXdIZWFkZXJzKSB7XG4gICAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycygpXG4gICAgLy8gUmVwbGFjZSBpbnN0YW5jZXMgb2YgXFxyXFxuIGFuZCBcXG4gZm9sbG93ZWQgYnkgYXQgbGVhc3Qgb25lIHNwYWNlIG9yIGhvcml6b250YWwgdGFiIHdpdGggYSBzcGFjZVxuICAgIC8vIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmM3MjMwI3NlY3Rpb24tMy4yXG4gICAgdmFyIHByZVByb2Nlc3NlZEhlYWRlcnMgPSByYXdIZWFkZXJzLnJlcGxhY2UoL1xccj9cXG5bXFx0IF0rL2csICcgJylcbiAgICBwcmVQcm9jZXNzZWRIZWFkZXJzLnNwbGl0KC9cXHI/XFxuLykuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgICB2YXIgcGFydHMgPSBsaW5lLnNwbGl0KCc6JylcbiAgICAgIHZhciBrZXkgPSBwYXJ0cy5zaGlmdCgpLnRyaW0oKVxuICAgICAgaWYgKGtleSkge1xuICAgICAgICB2YXIgdmFsdWUgPSBwYXJ0cy5qb2luKCc6JykudHJpbSgpXG4gICAgICAgIGhlYWRlcnMuYXBwZW5kKGtleSwgdmFsdWUpXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gaGVhZGVyc1xuICB9XG5cbiAgQm9keS5jYWxsKFJlcXVlc3QucHJvdG90eXBlKVxuXG4gIGZ1bmN0aW9uIFJlc3BvbnNlKGJvZHlJbml0LCBvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0ge31cbiAgICB9XG5cbiAgICB0aGlzLnR5cGUgPSAnZGVmYXVsdCdcbiAgICB0aGlzLnN0YXR1cyA9IG9wdGlvbnMuc3RhdHVzID09PSB1bmRlZmluZWQgPyAyMDAgOiBvcHRpb25zLnN0YXR1c1xuICAgIHRoaXMub2sgPSB0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDBcbiAgICB0aGlzLnN0YXR1c1RleHQgPSAnc3RhdHVzVGV4dCcgaW4gb3B0aW9ucyA/IG9wdGlvbnMuc3RhdHVzVGV4dCA6ICdPSydcbiAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gICAgdGhpcy51cmwgPSBvcHRpb25zLnVybCB8fCAnJ1xuICAgIHRoaXMuX2luaXRCb2R5KGJvZHlJbml0KVxuICB9XG5cbiAgQm9keS5jYWxsKFJlc3BvbnNlLnByb3RvdHlwZSlcblxuICBSZXNwb25zZS5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKHRoaXMuX2JvZHlJbml0LCB7XG4gICAgICBzdGF0dXM6IHRoaXMuc3RhdHVzLFxuICAgICAgc3RhdHVzVGV4dDogdGhpcy5zdGF0dXNUZXh0LFxuICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnModGhpcy5oZWFkZXJzKSxcbiAgICAgIHVybDogdGhpcy51cmxcbiAgICB9KVxuICB9XG5cbiAgUmVzcG9uc2UuZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzcG9uc2UgPSBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogMCwgc3RhdHVzVGV4dDogJyd9KVxuICAgIHJlc3BvbnNlLnR5cGUgPSAnZXJyb3InXG4gICAgcmV0dXJuIHJlc3BvbnNlXG4gIH1cblxuICB2YXIgcmVkaXJlY3RTdGF0dXNlcyA9IFszMDEsIDMwMiwgMzAzLCAzMDcsIDMwOF1cblxuICBSZXNwb25zZS5yZWRpcmVjdCA9IGZ1bmN0aW9uKHVybCwgc3RhdHVzKSB7XG4gICAgaWYgKHJlZGlyZWN0U3RhdHVzZXMuaW5kZXhPZihzdGF0dXMpID09PSAtMSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgc3RhdHVzIGNvZGUnKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUmVzcG9uc2UobnVsbCwge3N0YXR1czogc3RhdHVzLCBoZWFkZXJzOiB7bG9jYXRpb246IHVybH19KVxuICB9XG5cbiAgc2VsZi5IZWFkZXJzID0gSGVhZGVyc1xuICBzZWxmLlJlcXVlc3QgPSBSZXF1ZXN0XG4gIHNlbGYuUmVzcG9uc2UgPSBSZXNwb25zZVxuXG4gIHNlbGYuZmV0Y2ggPSBmdW5jdGlvbihpbnB1dCwgaW5pdCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoaW5wdXQsIGluaXQpXG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KClcblxuICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICBzdGF0dXM6IHhoci5zdGF0dXMsXG4gICAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgICAgaGVhZGVyczogcGFyc2VIZWFkZXJzKHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSB8fCAnJylcbiAgICAgICAgfVxuICAgICAgICBvcHRpb25zLnVybCA9ICdyZXNwb25zZVVSTCcgaW4geGhyID8geGhyLnJlc3BvbnNlVVJMIDogb3B0aW9ucy5oZWFkZXJzLmdldCgnWC1SZXF1ZXN0LVVSTCcpXG4gICAgICAgIHZhciBib2R5ID0gJ3Jlc3BvbnNlJyBpbiB4aHIgPyB4aHIucmVzcG9uc2UgOiB4aHIucmVzcG9uc2VUZXh0XG4gICAgICAgIHJlc29sdmUobmV3IFJlc3BvbnNlKGJvZHksIG9wdGlvbnMpKVxuICAgICAgfVxuXG4gICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfVxuXG4gICAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChuZXcgVHlwZUVycm9yKCdOZXR3b3JrIHJlcXVlc3QgZmFpbGVkJykpXG4gICAgICB9XG5cbiAgICAgIHhoci5vcGVuKHJlcXVlc3QubWV0aG9kLCByZXF1ZXN0LnVybCwgdHJ1ZSlcblxuICAgICAgaWYgKHJlcXVlc3QuY3JlZGVudGlhbHMgPT09ICdpbmNsdWRlJykge1xuICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZVxuICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnb21pdCcpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IGZhbHNlXG4gICAgICB9XG5cbiAgICAgIGlmICgncmVzcG9uc2VUeXBlJyBpbiB4aHIgJiYgc3VwcG9ydC5ibG9iKSB7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYidcbiAgICAgIH1cblxuICAgICAgcmVxdWVzdC5oZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIobmFtZSwgdmFsdWUpXG4gICAgICB9KVxuXG4gICAgICB4aHIuc2VuZCh0eXBlb2YgcmVxdWVzdC5fYm9keUluaXQgPT09ICd1bmRlZmluZWQnID8gbnVsbCA6IHJlcXVlc3QuX2JvZHlJbml0KVxuICAgIH0pXG4gIH1cbiAgc2VsZi5mZXRjaC5wb2x5ZmlsbCA9IHRydWVcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3doYXR3Zy1mZXRjaC9mZXRjaC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAoYykgMjAxNiBUaGUgUG9seW1lciBQcm9qZWN0IEF1dGhvcnMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBUaGlzIGNvZGUgbWF5IG9ubHkgYmUgdXNlZCB1bmRlciB0aGUgQlNEIHN0eWxlIGxpY2Vuc2UgZm91bmQgYXQgaHR0cDovL3BvbHltZXIuZ2l0aHViLmlvL0xJQ0VOU0UudHh0XG4gKiBUaGUgY29tcGxldGUgc2V0IG9mIGF1dGhvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9BVVRIT1JTLnR4dFxuICogVGhlIGNvbXBsZXRlIHNldCBvZiBjb250cmlidXRvcnMgbWF5IGJlIGZvdW5kIGF0IGh0dHA6Ly9wb2x5bWVyLmdpdGh1Yi5pby9DT05UUklCVVRPUlMudHh0XG4gKiBDb2RlIGRpc3RyaWJ1dGVkIGJ5IEdvb2dsZSBhcyBwYXJ0IG9mIHRoZSBwb2x5bWVyIHByb2plY3QgaXMgYWxzb1xuICogc3ViamVjdCB0byBhbiBhZGRpdGlvbmFsIElQIHJpZ2h0cyBncmFudCBmb3VuZCBhdCBodHRwOi8vcG9seW1lci5naXRodWIuaW8vUEFURU5UUy50eHRcbiAqL1xuXG4vLyBtaW5pbWFsIHRlbXBsYXRlIHBvbHlmaWxsXG4oZnVuY3Rpb24oKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgbmVlZHNUZW1wbGF0ZSA9ICh0eXBlb2YgSFRNTFRlbXBsYXRlRWxlbWVudCA9PT0gJ3VuZGVmaW5lZCcpO1xuICB2YXIgYnJva2VuRG9jRnJhZ21lbnQgPSAhKGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKS5jbG9uZU5vZGUoKSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpO1xuICB2YXIgbmVlZHNEb2NGcmFnID0gZmFsc2U7XG5cbiAgLy8gTk9URTogUmVwbGFjZSBEb2N1bWVudEZyYWdtZW50IHRvIHdvcmsgYXJvdW5kIElFMTEgYnVnIHRoYXRcbiAgLy8gY2F1c2VzIGNoaWxkcmVuIG9mIGEgZG9jdW1lbnQgZnJhZ21lbnQgbW9kaWZpZWQgd2hpbGVcbiAgLy8gdGhlcmUgaXMgYSBtdXRhdGlvbiBvYnNlcnZlciB0byBub3QgaGF2ZSBhIHBhcmVudE5vZGUsIG9yXG4gIC8vIGhhdmUgYSBicm9rZW4gcGFyZW50Tm9kZSAoIT8hKVxuICBpZiAoL1RyaWRlbnQvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAoZnVuY3Rpb24oKSB7XG5cbiAgICAgIG5lZWRzRG9jRnJhZyA9IHRydWU7XG5cbiAgICAgIHZhciBvcmlnQ2xvbmVOb2RlID0gTm9kZS5wcm90b3R5cGUuY2xvbmVOb2RlO1xuICAgICAgTm9kZS5wcm90b3R5cGUuY2xvbmVOb2RlID0gZnVuY3Rpb24gY2xvbmVOb2RlKGRlZXApIHtcbiAgICAgICAgdmFyIG5ld0RvbSA9IG9yaWdDbG9uZU5vZGUuY2FsbCh0aGlzLCBkZWVwKTtcbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KSB7XG4gICAgICAgICAgbmV3RG9tLl9fcHJvdG9fXyA9IERvY3VtZW50RnJhZ21lbnQucHJvdG90eXBlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXdEb207XG4gICAgICB9O1xuXG4gICAgICAvLyBJRSdzIERvY3VtZW50RnJhZ21lbnQgcXVlcnlTZWxlY3RvciBjb2RlIGRvZXNuJ3Qgd29yayB3aGVuXG4gICAgICAvLyBjYWxsZWQgb24gYW4gZWxlbWVudCBpbnN0YW5jZVxuICAgICAgRG9jdW1lbnRGcmFnbWVudC5wcm90b3R5cGUucXVlcnlTZWxlY3RvckFsbCA9IEhUTUxFbGVtZW50LnByb3RvdHlwZS5xdWVyeVNlbGVjdG9yQWxsO1xuICAgICAgRG9jdW1lbnRGcmFnbWVudC5wcm90b3R5cGUucXVlcnlTZWxlY3RvciA9IEhUTUxFbGVtZW50LnByb3RvdHlwZS5xdWVyeVNlbGVjdG9yO1xuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhEb2N1bWVudEZyYWdtZW50LnByb3RvdHlwZSwge1xuICAgICAgICAnbm9kZVR5cGUnOiB7XG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH0sXG5cbiAgICAgICAgJ2xvY2FsTmFtZSc6IHtcbiAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfSxcblxuICAgICAgICAnbm9kZU5hbWUnOiB7XG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJyNkb2N1bWVudC1mcmFnbWVudCc7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBvcmlnSW5zZXJ0QmVmb3JlID0gTm9kZS5wcm90b3R5cGUuaW5zZXJ0QmVmb3JlO1xuICAgICAgZnVuY3Rpb24gaW5zZXJ0QmVmb3JlKG5ld05vZGUsIHJlZk5vZGUpIHtcbiAgICAgICAgaWYgKG5ld05vZGUgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KSB7XG4gICAgICAgICAgdmFyIGNoaWxkO1xuICAgICAgICAgIHdoaWxlICgoY2hpbGQgPSBuZXdOb2RlLmZpcnN0Q2hpbGQpKSB7XG4gICAgICAgICAgICBvcmlnSW5zZXJ0QmVmb3JlLmNhbGwodGhpcywgY2hpbGQsIHJlZk5vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcmlnSW5zZXJ0QmVmb3JlLmNhbGwodGhpcywgbmV3Tm9kZSwgcmVmTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld05vZGU7XG4gICAgICB9XG4gICAgICBOb2RlLnByb3RvdHlwZS5pbnNlcnRCZWZvcmUgPSBpbnNlcnRCZWZvcmU7XG5cbiAgICAgIHZhciBvcmlnQXBwZW5kQ2hpbGQgPSBOb2RlLnByb3RvdHlwZS5hcHBlbmRDaGlsZDtcbiAgICAgIE5vZGUucHJvdG90eXBlLmFwcGVuZENoaWxkID0gZnVuY3Rpb24gYXBwZW5kQ2hpbGQoY2hpbGQpIHtcbiAgICAgICAgaWYgKGNoaWxkIGluc3RhbmNlb2YgRG9jdW1lbnRGcmFnbWVudCkge1xuICAgICAgICAgIGluc2VydEJlZm9yZS5jYWxsKHRoaXMsIGNoaWxkLCBudWxsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcmlnQXBwZW5kQ2hpbGQuY2FsbCh0aGlzLCBjaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgfTtcblxuICAgICAgdmFyIG9yaWdSZW1vdmVDaGlsZCA9IE5vZGUucHJvdG90eXBlLnJlbW92ZUNoaWxkO1xuICAgICAgdmFyIG9yaWdSZXBsYWNlQ2hpbGQgPSBOb2RlLnByb3RvdHlwZS5yZXBsYWNlQ2hpbGQ7XG4gICAgICBOb2RlLnByb3RvdHlwZS5yZXBsYWNlQ2hpbGQgPSBmdW5jdGlvbiByZXBsYWNlQ2hpbGQobmV3Q2hpbGQsIG9sZENoaWxkKSB7XG4gICAgICAgIGlmIChuZXdDaGlsZCBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpIHtcbiAgICAgICAgICBpbnNlcnRCZWZvcmUuY2FsbCh0aGlzLCBuZXdDaGlsZCwgb2xkQ2hpbGQpO1xuICAgICAgICAgIG9yaWdSZW1vdmVDaGlsZC5jYWxsKHRoaXMsIG9sZENoaWxkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcmlnUmVwbGFjZUNoaWxkLmNhbGwodGhpcywgbmV3Q2hpbGQsIG9sZENoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2xkQ2hpbGQ7XG4gICAgICB9O1xuXG4gICAgICBEb2N1bWVudC5wcm90b3R5cGUuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCA9IGZ1bmN0aW9uIGNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSB7XG4gICAgICAgIHZhciBmcmFnID0gdGhpcy5jcmVhdGVFbGVtZW50KCdkZicpO1xuICAgICAgICBmcmFnLl9fcHJvdG9fXyA9IERvY3VtZW50RnJhZ21lbnQucHJvdG90eXBlO1xuICAgICAgICByZXR1cm4gZnJhZztcbiAgICAgIH07XG5cbiAgICAgIHZhciBvcmlnSW1wb3J0Tm9kZSA9IERvY3VtZW50LnByb3RvdHlwZS5pbXBvcnROb2RlO1xuICAgICAgRG9jdW1lbnQucHJvdG90eXBlLmltcG9ydE5vZGUgPSBmdW5jdGlvbiBpbXBvcnROb2RlKGltcE5vZGUsIGRlZXApIHtcbiAgICAgICAgZGVlcCA9IGRlZXAgfHwgZmFsc2U7XG4gICAgICAgIHZhciBuZXdOb2RlID0gb3JpZ0ltcG9ydE5vZGUuY2FsbCh0aGlzLCBpbXBOb2RlLCBkZWVwKTtcbiAgICAgICAgaWYgKGltcE5vZGUgaW5zdGFuY2VvZiBEb2N1bWVudEZyYWdtZW50KSB7XG4gICAgICAgICAgbmV3Tm9kZS5fX3Byb3RvX18gPSBEb2N1bWVudEZyYWdtZW50LnByb3RvdHlwZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3Tm9kZTtcbiAgICAgIH07XG4gICAgfSkoKTtcbiAgfVxuXG4gIC8vIE5PVEU6IHdlIHJlbHkgb24gdGhpcyBjbG9uZU5vZGUgbm90IGNhdXNpbmcgZWxlbWVudCB1cGdyYWRlLlxuICAvLyBUaGlzIG1lYW5zIHRoaXMgcG9seWZpbGwgbXVzdCBsb2FkIGJlZm9yZSB0aGUgQ0UgcG9seWZpbGwgYW5kXG4gIC8vIHRoaXMgd291bGQgbmVlZCB0byBiZSByZS13b3JrZWQgaWYgYSBicm93c2VyIHN1cHBvcnRzIG5hdGl2ZSBDRVxuICAvLyBidXQgbm90IDx0ZW1wbGF0ZT4uXG4gIHZhciBjYXB0dXJlZENsb25lTm9kZSA9IE5vZGUucHJvdG90eXBlLmNsb25lTm9kZTtcbiAgdmFyIGNhcHR1cmVkQ3JlYXRlRWxlbWVudCA9IERvY3VtZW50LnByb3RvdHlwZS5jcmVhdGVFbGVtZW50O1xuICB2YXIgY2FwdHVyZWRJbXBvcnROb2RlID0gRG9jdW1lbnQucHJvdG90eXBlLmltcG9ydE5vZGU7XG4gIHZhciBjYXB0dXJlZFJlbW92ZUNoaWxkID0gTm9kZS5wcm90b3R5cGUucmVtb3ZlQ2hpbGQ7XG4gIHZhciBjYXB0dXJlZEFwcGVuZENoaWxkID0gTm9kZS5wcm90b3R5cGUuYXBwZW5kQ2hpbGQ7XG4gIHZhciBjYXB0dXJlZFJlcGxhY2VDaGlsZCA9IE5vZGUucHJvdG90eXBlLnJlcGxhY2VDaGlsZDtcbiAgdmFyIGNhcHR1cmVkUGFyc2VGcm9tU3RyaW5nID0gRE9NUGFyc2VyLnByb3RvdHlwZS5wYXJzZUZyb21TdHJpbmc7XG4gIHZhciBjYXB0dXJlZEhUTUxFbGVtZW50SW5uZXJIVE1MID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih3aW5kb3cuSFRNTEVsZW1lbnQucHJvdG90eXBlLCAnaW5uZXJIVE1MJykgfHwge1xuICAgIC8qKlxuICAgICAqIEB0aGlzIHshSFRNTEVsZW1lbnR9XG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbm5lckhUTUw7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBAdGhpcyB7IUhUTUxFbGVtZW50fVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHNldDogZnVuY3Rpb24odGV4dCkge1xuICAgICAgdGhpcy5pbm5lckhUTUwgPSB0ZXh0O1xuICAgIH1cbiAgfTtcbiAgdmFyIGNhcHR1cmVkQ2hpbGROb2RlcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iod2luZG93Lk5vZGUucHJvdG90eXBlLCAnY2hpbGROb2RlcycpIHx8IHtcbiAgICAvKipcbiAgICAgKiBAdGhpcyB7IU5vZGV9XG4gICAgICogQHJldHVybiB7IU5vZGVMaXN0fVxuICAgICAqL1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5jaGlsZE5vZGVzO1xuICAgIH1cbiAgfTtcblxuICB2YXIgZWxlbWVudFF1ZXJ5U2VsZWN0b3JBbGwgPSBFbGVtZW50LnByb3RvdHlwZS5xdWVyeVNlbGVjdG9yQWxsO1xuICB2YXIgZG9jUXVlcnlTZWxlY3RvckFsbCA9IERvY3VtZW50LnByb3RvdHlwZS5xdWVyeVNlbGVjdG9yQWxsO1xuICB2YXIgZnJhZ1F1ZXJ5U2VsZWN0b3JBbGwgPSBEb2N1bWVudEZyYWdtZW50LnByb3RvdHlwZS5xdWVyeVNlbGVjdG9yQWxsO1xuXG4gIHZhciBzY3JpcHRTZWxlY3RvciA9ICdzY3JpcHQ6bm90KFt0eXBlXSksc2NyaXB0W3R5cGU9XCJhcHBsaWNhdGlvbi9qYXZhc2NyaXB0XCJdLHNjcmlwdFt0eXBlPVwidGV4dC9qYXZhc2NyaXB0XCJdJztcblxuICBmdW5jdGlvbiBRU0Eobm9kZSwgc2VsZWN0b3IpIHtcbiAgICAvLyBJRSAxMSB0aHJvd3MgYSBTeW50YXhFcnJvciB3aXRoIGBzY3JpcHRTZWxlY3RvcmAgaWYgdGhlIG5vZGUgaGFzIG5vIGNoaWxkcmVuIGR1ZSB0byB0aGUgYDpub3QoW3R5cGVdKWAgc3ludGF4XG4gICAgaWYgKCFub2RlLmNoaWxkTm9kZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xuICAgICAgY2FzZSBOb2RlLkRPQ1VNRU5UX05PREU6XG4gICAgICAgIHJldHVybiBkb2NRdWVyeVNlbGVjdG9yQWxsLmNhbGwobm9kZSwgc2VsZWN0b3IpO1xuICAgICAgY2FzZSBOb2RlLkRPQ1VNRU5UX0ZSQUdNRU5UX05PREU6XG4gICAgICAgIHJldHVybiBmcmFnUXVlcnlTZWxlY3RvckFsbC5jYWxsKG5vZGUsIHNlbGVjdG9yKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBlbGVtZW50UXVlcnlTZWxlY3RvckFsbC5jYWxsKG5vZGUsIHNlbGVjdG9yKTtcbiAgICB9XG4gIH1cblxuICAvLyByZXR1cm5zIHRydWUgaWYgbmVzdGVkIHRlbXBsYXRlcyBjYW5ub3QgYmUgY2xvbmVkICh0aGV5IGNhbm5vdCBiZSBvblxuICAvLyBzb21lIGltcGwncyBsaWtlIFNhZmFyaSA4IGFuZCBFZGdlKVxuICAvLyBPUiBpZiBjbG9uaW5nIGEgZG9jdW1lbnQgZnJhZ21lbnQgZG9lcyBub3QgcmVzdWx0IGluIGEgZG9jdW1lbnQgZnJhZ21lbnRcbiAgdmFyIG5lZWRzQ2xvbmluZyA9IChmdW5jdGlvbigpIHtcbiAgICBpZiAoIW5lZWRzVGVtcGxhdGUpIHtcbiAgICAgIHZhciB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICAgIHZhciB0MiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gICAgICB0Mi5jb250ZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpKTtcbiAgICAgIHQuY29udGVudC5hcHBlbmRDaGlsZCh0Mik7XG4gICAgICB2YXIgY2xvbmUgPSB0LmNsb25lTm9kZSh0cnVlKTtcbiAgICAgIHJldHVybiAoY2xvbmUuY29udGVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCB8fCBjbG9uZS5jb250ZW50LmZpcnN0Q2hpbGQuY29udGVudC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMFxuICAgICAgICB8fCBicm9rZW5Eb2NGcmFnbWVudCk7XG4gICAgfVxuICB9KSgpO1xuXG4gIHZhciBURU1QTEFURV9UQUcgPSAndGVtcGxhdGUnO1xuICB2YXIgUG9seWZpbGxlZEhUTUxUZW1wbGF0ZUVsZW1lbnQgPSBmdW5jdGlvbigpIHt9O1xuXG4gIGlmIChuZWVkc1RlbXBsYXRlKSB7XG5cbiAgICB2YXIgY29udGVudERvYyA9IGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZUhUTUxEb2N1bWVudCgndGVtcGxhdGUnKTtcbiAgICB2YXIgY2FuRGVjb3JhdGUgPSB0cnVlO1xuXG4gICAgdmFyIHRlbXBsYXRlU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIHRlbXBsYXRlU3R5bGUudGV4dENvbnRlbnQgPSBURU1QTEFURV9UQUcgKyAne2Rpc3BsYXk6bm9uZTt9JztcblxuICAgIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZDtcbiAgICBoZWFkLmluc2VydEJlZm9yZSh0ZW1wbGF0ZVN0eWxlLCBoZWFkLmZpcnN0RWxlbWVudENoaWxkKTtcblxuICAgIC8qKlxuICAgICAgUHJvdmlkZXMgYSBtaW5pbWFsIHNoaW0gZm9yIHRoZSA8dGVtcGxhdGU+IGVsZW1lbnQuXG4gICAgKi9cbiAgICBQb2x5ZmlsbGVkSFRNTFRlbXBsYXRlRWxlbWVudC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEhUTUxFbGVtZW50LnByb3RvdHlwZSk7XG5cblxuICAgIC8vIGlmIGVsZW1lbnRzIGRvIG5vdCBoYXZlIGBpbm5lckhUTUxgIG9uIGluc3RhbmNlcywgdGhlblxuICAgIC8vIHRlbXBsYXRlcyBjYW4gYmUgcGF0Y2hlZCBieSBzd2l6emxpbmcgdGhlaXIgcHJvdG90eXBlcy5cbiAgICB2YXIgY2FuUHJvdG9QYXRjaCA9XG4gICAgICAhKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLmhhc093blByb3BlcnR5KCdpbm5lckhUTUwnKSk7XG5cbiAgICAvKipcbiAgICAgIFRoZSBgZGVjb3JhdGVgIG1ldGhvZCBtb3ZlcyBlbGVtZW50IGNoaWxkcmVuIHRvIHRoZSB0ZW1wbGF0ZSdzIGBjb250ZW50YC5cbiAgICAgIE5PVEU6IHRoZXJlIGlzIG5vIHN1cHBvcnQgZm9yIGR5bmFtaWNhbGx5IGFkZGluZyBlbGVtZW50cyB0byB0ZW1wbGF0ZXMuXG4gICAgKi9cbiAgICBQb2x5ZmlsbGVkSFRNTFRlbXBsYXRlRWxlbWVudC5kZWNvcmF0ZSA9IGZ1bmN0aW9uKHRlbXBsYXRlKSB7XG4gICAgICAvLyBpZiB0aGUgdGVtcGxhdGUgaXMgZGVjb3JhdGVkIG9yIG5vdCBpbiBIVE1MIG5hbWVzcGFjZSwgcmV0dXJuIGZhc3RcbiAgICAgIGlmICh0ZW1wbGF0ZS5jb250ZW50IHx8XG4gICAgICAgICAgdGVtcGxhdGUubmFtZXNwYWNlVVJJICE9PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubmFtZXNwYWNlVVJJKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRlbXBsYXRlLmNvbnRlbnQgPSBjb250ZW50RG9jLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICAgIHZhciBjaGlsZDtcbiAgICAgIHdoaWxlICgoY2hpbGQgPSB0ZW1wbGF0ZS5maXJzdENoaWxkKSkge1xuICAgICAgICBjYXB0dXJlZEFwcGVuZENoaWxkLmNhbGwodGVtcGxhdGUuY29udGVudCwgY2hpbGQpO1xuICAgICAgfVxuICAgICAgLy8gTk9URTogcHJlZmVyIHByb3RvdHlwZSBwYXRjaGluZyBmb3IgcGVyZm9ybWFuY2UgYW5kXG4gICAgICAvLyBiZWNhdXNlIG9uIHNvbWUgYnJvd3NlcnMgKElFMTEpLCByZS1kZWZpbmluZyBgaW5uZXJIVE1MYFxuICAgICAgLy8gY2FuIHJlc3VsdCBpbiBpbnRlcm1pdHRlbnQgZXJyb3JzLlxuICAgICAgaWYgKGNhblByb3RvUGF0Y2gpIHtcbiAgICAgICAgdGVtcGxhdGUuX19wcm90b19fID0gUG9seWZpbGxlZEhUTUxUZW1wbGF0ZUVsZW1lbnQucHJvdG90eXBlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGVtcGxhdGUuY2xvbmVOb2RlID0gZnVuY3Rpb24oZGVlcCkge1xuICAgICAgICAgIHJldHVybiBQb2x5ZmlsbGVkSFRNTFRlbXBsYXRlRWxlbWVudC5fY2xvbmVOb2RlKHRoaXMsIGRlZXApO1xuICAgICAgICB9O1xuICAgICAgICAvLyBhZGQgaW5uZXJIVE1MIHRvIHRlbXBsYXRlLCBpZiBwb3NzaWJsZVxuICAgICAgICAvLyBOb3RlOiB0aGlzIHRocm93cyBvbiBTYWZhcmkgN1xuICAgICAgICBpZiAoY2FuRGVjb3JhdGUpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZGVmaW5lSW5uZXJIVE1MKHRlbXBsYXRlKTtcbiAgICAgICAgICAgIGRlZmluZU91dGVySFRNTCh0ZW1wbGF0ZSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjYW5EZWNvcmF0ZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gYm9vdHN0cmFwIHJlY3Vyc2l2ZWx5XG4gICAgICBQb2x5ZmlsbGVkSFRNTFRlbXBsYXRlRWxlbWVudC5ib290c3RyYXAodGVtcGxhdGUuY29udGVudCk7XG4gICAgfTtcblxuICAgIC8vIFRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2pxdWVyeS9qcXVlcnkvYmxvYi83M2Q3ZTYyNTljNjNhYzQ1ZjQyYzY1OTNkYThjMjc5NmM2Y2U5MjgxL3NyYy9tYW5pcHVsYXRpb24vd3JhcE1hcC5qc1xuICAgIHZhciB0b3BMZXZlbFdyYXBwaW5nTWFwID0ge1xuICAgICAgJ29wdGlvbic6IFsnc2VsZWN0J10sXG4gICAgICAndGhlYWQnOiBbJ3RhYmxlJ10sXG4gICAgICAnY29sJzogWydjb2xncm91cCcsICd0YWJsZSddLFxuICAgICAgJ3RyJzogWyd0Ym9keScsICd0YWJsZSddLFxuICAgICAgJ3RoJzogWyd0cicsICd0Ym9keScsICd0YWJsZSddLFxuICAgICAgJ3RkJzogWyd0cicsICd0Ym9keScsICd0YWJsZSddXG4gICAgfTtcblxuICAgIHZhciBnZXRUYWdOYW1lID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgLy8gVGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vanF1ZXJ5L2pxdWVyeS9ibG9iLzczZDdlNjI1OWM2M2FjNDVmNDJjNjU5M2RhOGMyNzk2YzZjZTkyODEvc3JjL21hbmlwdWxhdGlvbi92YXIvcnRhZ05hbWUuanNcbiAgICAgIHJldHVybiAoIC88KFthLXpdW14vXFwwPlxceDIwXFx0XFxyXFxuXFxmXSspL2kuZXhlYyh0ZXh0KSB8fCBbJycsICcnXSlbMV0udG9Mb3dlckNhc2UoKTtcbiAgICB9O1xuXG4gICAgdmFyIGRlZmluZUlubmVySFRNTCA9IGZ1bmN0aW9uIGRlZmluZUlubmVySFRNTChvYmopIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosICdpbm5lckhUTUwnLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGdldElubmVySFRNTCh0aGlzKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgLy8gRm9yIElFMTEsIHdyYXAgdGhlIHRleHQgaW4gdGhlIGNvcnJlY3QgKHRhYmxlKSBjb250ZXh0XG4gICAgICAgICAgdmFyIHdyYXAgPSB0b3BMZXZlbFdyYXBwaW5nTWFwW2dldFRhZ05hbWUodGV4dCldO1xuICAgICAgICAgIGlmICh3cmFwKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdyYXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgdGV4dCA9ICc8JyArIHdyYXBbaV0gKyAnPicgKyB0ZXh0ICsgJzwvJyArIHdyYXBbaV0gKyAnPic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRlbnREb2MuYm9keS5pbm5lckhUTUwgPSB0ZXh0O1xuICAgICAgICAgIFBvbHlmaWxsZWRIVE1MVGVtcGxhdGVFbGVtZW50LmJvb3RzdHJhcChjb250ZW50RG9jKTtcbiAgICAgICAgICB3aGlsZSAodGhpcy5jb250ZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIGNhcHR1cmVkUmVtb3ZlQ2hpbGQuY2FsbCh0aGlzLmNvbnRlbnQsIHRoaXMuY29udGVudC5maXJzdENoaWxkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIGJvZHkgPSBjb250ZW50RG9jLmJvZHk7XG4gICAgICAgICAgLy8gSWYgd2UgaGFkIHdyYXBwZWQsIGdldCBiYWNrIHRvIHRoZSBvcmlnaW5hbCBub2RlXG4gICAgICAgICAgaWYgKHdyYXApIHtcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgd3JhcC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICBib2R5ID0gYm9keS5sYXN0Q2hpbGQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHdoaWxlIChib2R5LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIGNhcHR1cmVkQXBwZW5kQ2hpbGQuY2FsbCh0aGlzLmNvbnRlbnQsIGJvZHkuZmlyc3RDaGlsZCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgZGVmaW5lT3V0ZXJIVE1MID0gZnVuY3Rpb24gZGVmaW5lT3V0ZXJIVE1MKG9iaikge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgJ291dGVySFRNTCcsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICByZXR1cm4gJzwnICsgVEVNUExBVEVfVEFHICsgJz4nICsgdGhpcy5pbm5lckhUTUwgKyAnPC8nICsgVEVNUExBVEVfVEFHICsgJz4nO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKGlubmVySFRNTCkge1xuICAgICAgICAgIGlmICh0aGlzLnBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIGNvbnRlbnREb2MuYm9keS5pbm5lckhUTUwgPSBpbm5lckhUTUw7XG4gICAgICAgICAgICB2YXIgZG9jRnJhZyA9IHRoaXMub3duZXJEb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgICAgICB3aGlsZSAoY29udGVudERvYy5ib2R5LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgICAgY2FwdHVyZWRBcHBlbmRDaGlsZC5jYWxsKGRvY0ZyYWcsIGNvbnRlbnREb2MuYm9keS5maXJzdENoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhcHR1cmVkUmVwbGFjZUNoaWxkLmNhbGwodGhpcy5wYXJlbnROb2RlLCBkb2NGcmFnLCB0aGlzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIHNldCB0aGUgJ291dGVySFRNTCcgcHJvcGVydHkgb24gJ0VsZW1lbnQnOiBUaGlzIGVsZW1lbnQgaGFzIG5vIHBhcmVudCBub2RlLlwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGRlZmluZUlubmVySFRNTChQb2x5ZmlsbGVkSFRNTFRlbXBsYXRlRWxlbWVudC5wcm90b3R5cGUpO1xuICAgIGRlZmluZU91dGVySFRNTChQb2x5ZmlsbGVkSFRNTFRlbXBsYXRlRWxlbWVudC5wcm90b3R5cGUpO1xuXG4gICAgLyoqXG4gICAgICBUaGUgYGJvb3RzdHJhcGAgbWV0aG9kIGlzIGNhbGxlZCBhdXRvbWF0aWNhbGx5IGFuZCBcImZpeGVzXCIgYWxsXG4gICAgICA8dGVtcGxhdGU+IGVsZW1lbnRzIGluIHRoZSBkb2N1bWVudCByZWZlcmVuY2VkIGJ5IHRoZSBgZG9jYCBhcmd1bWVudC5cbiAgICAqL1xuICAgIFBvbHlmaWxsZWRIVE1MVGVtcGxhdGVFbGVtZW50LmJvb3RzdHJhcCA9IGZ1bmN0aW9uIGJvb3RzdHJhcChkb2MpIHtcbiAgICAgIHZhciB0ZW1wbGF0ZXMgPSBRU0EoZG9jLCBURU1QTEFURV9UQUcpO1xuICAgICAgZm9yICh2YXIgaT0wLCBsPXRlbXBsYXRlcy5sZW5ndGgsIHQ7IChpPGwpICYmICh0PXRlbXBsYXRlc1tpXSk7IGkrKykge1xuICAgICAgICBQb2x5ZmlsbGVkSFRNTFRlbXBsYXRlRWxlbWVudC5kZWNvcmF0ZSh0KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gYXV0by1ib290c3RyYXBwaW5nIGZvciBtYWluIGRvY3VtZW50XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgUG9seWZpbGxlZEhUTUxUZW1wbGF0ZUVsZW1lbnQuYm9vdHN0cmFwKGRvY3VtZW50KTtcbiAgICB9KTtcblxuICAgIC8vIFBhdGNoIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgdG8gZW5zdXJlIG5ld2x5IGNyZWF0ZWQgdGVtcGxhdGVzIGhhdmUgY29udGVudFxuICAgIERvY3VtZW50LnByb3RvdHlwZS5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gY3JlYXRlRWxlbWVudCgpIHtcbiAgICAgIHZhciBlbCA9IGNhcHR1cmVkQ3JlYXRlRWxlbWVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKGVsLmxvY2FsTmFtZSA9PT0gJ3RlbXBsYXRlJykge1xuICAgICAgICBQb2x5ZmlsbGVkSFRNTFRlbXBsYXRlRWxlbWVudC5kZWNvcmF0ZShlbCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gZWw7XG4gICAgfTtcblxuICAgIERPTVBhcnNlci5wcm90b3R5cGUucGFyc2VGcm9tU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZWwgPSBjYXB0dXJlZFBhcnNlRnJvbVN0cmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgUG9seWZpbGxlZEhUTUxUZW1wbGF0ZUVsZW1lbnQuYm9vdHN0cmFwKGVsKTtcbiAgICAgIHJldHVybiBlbDtcbiAgICB9O1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEhUTUxFbGVtZW50LnByb3RvdHlwZSwgJ2lubmVySFRNTCcsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBnZXRJbm5lckhUTUwodGhpcyk7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgIGNhcHR1cmVkSFRNTEVsZW1lbnRJbm5lckhUTUwuc2V0LmNhbGwodGhpcywgdGV4dCk7XG4gICAgICAgIFBvbHlmaWxsZWRIVE1MVGVtcGxhdGVFbGVtZW50LmJvb3RzdHJhcCh0aGlzKTtcbiAgICAgIH0sXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlXG4gICAgfSk7XG5cbiAgICAvLyBodHRwOi8vd3d3LndoYXR3Zy5vcmcvc3BlY3Mvd2ViLWFwcHMvY3VycmVudC13b3JrL211bHRpcGFnZS90aGUtZW5kLmh0bWwjZXNjYXBpbmdTdHJpbmdcbiAgICB2YXIgZXNjYXBlQXR0clJlZ0V4cCA9IC9bJlxcdTAwQTBcIl0vZztcbiAgICB2YXIgZXNjYXBlRGF0YVJlZ0V4cCA9IC9bJlxcdTAwQTA8Pl0vZztcblxuICAgIHZhciBlc2NhcGVSZXBsYWNlID0gZnVuY3Rpb24oYykge1xuICAgICAgc3dpdGNoIChjKSB7XG4gICAgICAgIGNhc2UgJyYnOlxuICAgICAgICAgIHJldHVybiAnJmFtcDsnO1xuICAgICAgICBjYXNlICc8JzpcbiAgICAgICAgICByZXR1cm4gJyZsdDsnO1xuICAgICAgICBjYXNlICc+JzpcbiAgICAgICAgICByZXR1cm4gJyZndDsnO1xuICAgICAgICBjYXNlICdcIic6XG4gICAgICAgICAgcmV0dXJuICcmcXVvdDsnO1xuICAgICAgICBjYXNlICdcXHUwMEEwJzpcbiAgICAgICAgICByZXR1cm4gJyZuYnNwOyc7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBlc2NhcGVBdHRyID0gZnVuY3Rpb24ocykge1xuICAgICAgcmV0dXJuIHMucmVwbGFjZShlc2NhcGVBdHRyUmVnRXhwLCBlc2NhcGVSZXBsYWNlKTtcbiAgICB9O1xuXG4gICAgdmFyIGVzY2FwZURhdGEgPSBmdW5jdGlvbihzKSB7XG4gICAgICByZXR1cm4gcy5yZXBsYWNlKGVzY2FwZURhdGFSZWdFeHAsIGVzY2FwZVJlcGxhY2UpO1xuICAgIH07XG5cbiAgICB2YXIgbWFrZVNldCA9IGZ1bmN0aW9uKGFycikge1xuICAgICAgdmFyIHNldCA9IHt9O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc2V0W2FycltpXV0gPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHNldDtcbiAgICB9O1xuXG4gICAgLy8gaHR0cDovL3d3dy53aGF0d2cub3JnL3NwZWNzL3dlYi1hcHBzL2N1cnJlbnQtd29yay8jdm9pZC1lbGVtZW50c1xuICAgIHZhciB2b2lkRWxlbWVudHMgPSBtYWtlU2V0KFtcbiAgICAgICdhcmVhJyxcbiAgICAgICdiYXNlJyxcbiAgICAgICdicicsXG4gICAgICAnY29sJyxcbiAgICAgICdjb21tYW5kJyxcbiAgICAgICdlbWJlZCcsXG4gICAgICAnaHInLFxuICAgICAgJ2ltZycsXG4gICAgICAnaW5wdXQnLFxuICAgICAgJ2tleWdlbicsXG4gICAgICAnbGluaycsXG4gICAgICAnbWV0YScsXG4gICAgICAncGFyYW0nLFxuICAgICAgJ3NvdXJjZScsXG4gICAgICAndHJhY2snLFxuICAgICAgJ3dicidcbiAgICBdKTtcblxuICAgIHZhciBwbGFpbnRleHRQYXJlbnRzID0gbWFrZVNldChbXG4gICAgICAnc3R5bGUnLFxuICAgICAgJ3NjcmlwdCcsXG4gICAgICAneG1wJyxcbiAgICAgICdpZnJhbWUnLFxuICAgICAgJ25vZW1iZWQnLFxuICAgICAgJ25vZnJhbWVzJyxcbiAgICAgICdwbGFpbnRleHQnLFxuICAgICAgJ25vc2NyaXB0J1xuICAgIF0pO1xuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICAgICogQHBhcmFtIHtOb2RlfSBwYXJlbnROb2RlXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbj19IGNhbGxiYWNrXG4gICAgICovXG4gICAgdmFyIGdldE91dGVySFRNTCA9IGZ1bmN0aW9uKG5vZGUsIHBhcmVudE5vZGUsIGNhbGxiYWNrKSB7XG4gICAgICBzd2l0Y2ggKG5vZGUubm9kZVR5cGUpIHtcbiAgICAgICAgY2FzZSBOb2RlLkVMRU1FTlRfTk9ERToge1xuICAgICAgICAgIHZhciB0YWdOYW1lID0gbm9kZS5sb2NhbE5hbWU7XG4gICAgICAgICAgdmFyIHMgPSAnPCcgKyB0YWdOYW1lO1xuICAgICAgICAgIHZhciBhdHRycyA9IG5vZGUuYXR0cmlidXRlcztcbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgYXR0cjsgKGF0dHIgPSBhdHRyc1tpXSk7IGkrKykge1xuICAgICAgICAgICAgcyArPSAnICcgKyBhdHRyLm5hbWUgKyAnPVwiJyArIGVzY2FwZUF0dHIoYXR0ci52YWx1ZSkgKyAnXCInO1xuICAgICAgICAgIH1cbiAgICAgICAgICBzICs9ICc+JztcbiAgICAgICAgICBpZiAodm9pZEVsZW1lbnRzW3RhZ05hbWVdKSB7XG4gICAgICAgICAgICByZXR1cm4gcztcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHMgKyBnZXRJbm5lckhUTUwobm9kZSwgY2FsbGJhY2spICsgJzwvJyArIHRhZ05hbWUgKyAnPic7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBOb2RlLlRFWFRfTk9ERToge1xuICAgICAgICAgIHZhciBkYXRhID0gLyoqIEB0eXBlIHtUZXh0fSAqLyAobm9kZSkuZGF0YTtcbiAgICAgICAgICBpZiAocGFyZW50Tm9kZSAmJiBwbGFpbnRleHRQYXJlbnRzW3BhcmVudE5vZGUubG9jYWxOYW1lXSkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBlc2NhcGVEYXRhKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgTm9kZS5DT01NRU5UX05PREU6IHtcbiAgICAgICAgICByZXR1cm4gJzwhLS0nICsgLyoqIEB0eXBlIHtDb21tZW50fSAqLyAobm9kZSkuZGF0YSArICctLT4nO1xuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICB3aW5kb3cuY29uc29sZS5lcnJvcihub2RlKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb249fSBjYWxsYmFja1xuICAgICAqL1xuICAgIHZhciBnZXRJbm5lckhUTUwgPSBmdW5jdGlvbihub2RlLCBjYWxsYmFjaykge1xuICAgICAgaWYgKG5vZGUubG9jYWxOYW1lID09PSAndGVtcGxhdGUnKSB7XG4gICAgICAgIG5vZGUgPSAgLyoqIEB0eXBlIHtIVE1MVGVtcGxhdGVFbGVtZW50fSAqLyAobm9kZSkuY29udGVudDtcbiAgICAgIH1cbiAgICAgIHZhciBzID0gJyc7XG4gICAgICB2YXIgYyQgPSBjYWxsYmFjayA/IGNhbGxiYWNrKG5vZGUpIDogY2FwdHVyZWRDaGlsZE5vZGVzLmdldC5jYWxsKG5vZGUpO1xuICAgICAgZm9yICh2YXIgaT0wLCBsPWMkLmxlbmd0aCwgY2hpbGQ7IChpPGwpICYmIChjaGlsZD1jJFtpXSk7IGkrKykge1xuICAgICAgICBzICs9IGdldE91dGVySFRNTChjaGlsZCwgbm9kZSwgY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHM7XG4gICAgfTtcblxuICB9XG5cbiAgLy8gbWFrZSBjbG9uaW5nL2ltcG9ydGluZyB3b3JrIVxuICBpZiAobmVlZHNUZW1wbGF0ZSB8fCBuZWVkc0Nsb25pbmcpIHtcblxuICAgIFBvbHlmaWxsZWRIVE1MVGVtcGxhdGVFbGVtZW50Ll9jbG9uZU5vZGUgPSBmdW5jdGlvbiBfY2xvbmVOb2RlKHRlbXBsYXRlLCBkZWVwKSB7XG4gICAgICB2YXIgY2xvbmUgPSBjYXB0dXJlZENsb25lTm9kZS5jYWxsKHRlbXBsYXRlLCBmYWxzZSk7XG4gICAgICAvLyBOT1RFOiBkZWNvcmF0ZSBkb2Vzbid0IGF1dG8tZml4IGNoaWxkcmVuIGJlY2F1c2UgdGhleSBhcmUgYWxyZWFkeVxuICAgICAgLy8gZGVjb3JhdGVkIHNvIHRoZXkgbmVlZCBzcGVjaWFsIGNsb25lIGZpeHVwLlxuICAgICAgaWYgKHRoaXMuZGVjb3JhdGUpIHtcbiAgICAgICAgdGhpcy5kZWNvcmF0ZShjbG9uZSk7XG4gICAgICB9XG4gICAgICBpZiAoZGVlcCkge1xuICAgICAgICAvLyBOT1RFOiB1c2UgbmF0aXZlIGNsb25lIG5vZGUgdG8gbWFrZSBzdXJlIENFJ3Mgd3JhcHBlZFxuICAgICAgICAvLyBjbG9uZU5vZGUgZG9lcyBub3QgY2F1c2UgZWxlbWVudHMgdG8gdXBncmFkZS5cbiAgICAgICAgY2FwdHVyZWRBcHBlbmRDaGlsZC5jYWxsKGNsb25lLmNvbnRlbnQsIGNhcHR1cmVkQ2xvbmVOb2RlLmNhbGwodGVtcGxhdGUuY29udGVudCwgdHJ1ZSkpO1xuICAgICAgICAvLyBub3cgZW5zdXJlIG5lc3RlZCB0ZW1wbGF0ZXMgYXJlIGNsb25lZCBjb3JyZWN0bHkuXG4gICAgICAgIGZpeENsb25lZERvbShjbG9uZS5jb250ZW50LCB0ZW1wbGF0ZS5jb250ZW50KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjbG9uZTtcbiAgICB9O1xuXG4gICAgLy8gR2l2ZW4gYSBzb3VyY2UgYW5kIGNsb25lZCBzdWJ0cmVlLCBmaW5kIDx0ZW1wbGF0ZT4ncyBpbiB0aGUgY2xvbmVkXG4gICAgLy8gc3VidHJlZSBhbmQgcmVwbGFjZSB0aGVtIHdpdGggY2xvbmVkIDx0ZW1wbGF0ZT4ncyBmcm9tIHNvdXJjZS5cbiAgICAvLyBXZSBtdXN0IGRvIHRoaXMgYmVjYXVzZSBvbmx5IHRoZSBzb3VyY2UgdGVtcGxhdGVzIGhhdmUgcHJvcGVyIC5jb250ZW50LlxuICAgIHZhciBmaXhDbG9uZWREb20gPSBmdW5jdGlvbiBmaXhDbG9uZWREb20oY2xvbmUsIHNvdXJjZSkge1xuICAgICAgLy8gZG8gbm90aGluZyBpZiBjbG9uZWQgbm9kZSBpcyBub3QgYW4gZWxlbWVudFxuICAgICAgaWYgKCFzb3VyY2UucXVlcnlTZWxlY3RvckFsbCkgcmV0dXJuO1xuICAgICAgLy8gdGhlc2UgdHdvIGxpc3RzIHNob3VsZCBiZSBjb2luY2lkZW50XG4gICAgICB2YXIgcyQgPSBRU0Eoc291cmNlLCBURU1QTEFURV9UQUcpO1xuICAgICAgaWYgKHMkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgdCQgPSBRU0EoY2xvbmUsIFRFTVBMQVRFX1RBRyk7XG4gICAgICBmb3IgKHZhciBpPTAsIGw9dCQubGVuZ3RoLCB0LCBzOyBpPGw7IGkrKykge1xuICAgICAgICBzID0gcyRbaV07XG4gICAgICAgIHQgPSB0JFtpXTtcbiAgICAgICAgaWYgKFBvbHlmaWxsZWRIVE1MVGVtcGxhdGVFbGVtZW50ICYmIFBvbHlmaWxsZWRIVE1MVGVtcGxhdGVFbGVtZW50LmRlY29yYXRlKSB7XG4gICAgICAgICAgUG9seWZpbGxlZEhUTUxUZW1wbGF0ZUVsZW1lbnQuZGVjb3JhdGUocyk7XG4gICAgICAgIH1cbiAgICAgICAgY2FwdHVyZWRSZXBsYWNlQ2hpbGQuY2FsbCh0LnBhcmVudE5vZGUsIGNsb25lTm9kZS5jYWxsKHMsIHRydWUpLCB0KTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gbWFrZSBzdXJlIHNjcmlwdHMgaW5zaWRlIG9mIGEgY2xvbmVkIHRlbXBsYXRlIGFyZSBleGVjdXRhYmxlXG4gICAgdmFyIGZpeENsb25lZFNjcmlwdHMgPSBmdW5jdGlvbiBmaXhDbG9uZWRTY3JpcHRzKGZyYWdtZW50KSB7XG4gICAgICB2YXIgc2NyaXB0cyA9IFFTQShmcmFnbWVudCwgc2NyaXB0U2VsZWN0b3IpO1xuICAgICAgZm9yICh2YXIgbnMsIHMsIGkgPSAwOyBpIDwgc2NyaXB0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBzID0gc2NyaXB0c1tpXTtcbiAgICAgICAgbnMgPSBjYXB0dXJlZENyZWF0ZUVsZW1lbnQuY2FsbChkb2N1bWVudCwgJ3NjcmlwdCcpO1xuICAgICAgICBucy50ZXh0Q29udGVudCA9IHMudGV4dENvbnRlbnQ7XG4gICAgICAgIHZhciBhdHRycyA9IHMuYXR0cmlidXRlcztcbiAgICAgICAgZm9yICh2YXIgYWkgPSAwLCBhOyBhaSA8IGF0dHJzLmxlbmd0aDsgYWkrKykge1xuICAgICAgICAgIGEgPSBhdHRyc1thaV07XG4gICAgICAgICAgbnMuc2V0QXR0cmlidXRlKGEubmFtZSwgYS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2FwdHVyZWRSZXBsYWNlQ2hpbGQuY2FsbChzLnBhcmVudE5vZGUsIG5zLCBzKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gb3ZlcnJpZGUgYWxsIGNsb25pbmcgdG8gZml4IHRoZSBjbG9uZWQgc3VidHJlZSB0byBjb250YWluIHByb3Blcmx5XG4gICAgLy8gY2xvbmVkIHRlbXBsYXRlcy5cbiAgICB2YXIgY2xvbmVOb2RlID0gTm9kZS5wcm90b3R5cGUuY2xvbmVOb2RlID0gZnVuY3Rpb24gY2xvbmVOb2RlKGRlZXApIHtcbiAgICAgIHZhciBkb207XG4gICAgICAvLyB3b3JrYXJvdW5kIGZvciBFZGdlIGJ1ZyBjbG9uaW5nIGRvY3VtZW50RnJhZ21lbnRzXG4gICAgICAvLyBodHRwczovL2RldmVsb3Blci5taWNyb3NvZnQuY29tL2VuLXVzL21pY3Jvc29mdC1lZGdlL3BsYXRmb3JtL2lzc3Vlcy84NjE5NjQ2L1xuICAgICAgaWYgKCFuZWVkc0RvY0ZyYWcgJiYgYnJva2VuRG9jRnJhZ21lbnQgJiYgdGhpcyBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQpIHtcbiAgICAgICAgaWYgKCFkZWVwKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMub3duZXJEb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9tID0gaW1wb3J0Tm9kZS5jYWxsKHRoaXMub3duZXJEb2N1bWVudCwgdGhpcywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiZcbiAgICAgICAgICAgICAgICAgdGhpcy5sb2NhbE5hbWUgPT09IFRFTVBMQVRFX1RBRyAmJlxuICAgICAgICAgICAgICAgICB0aGlzLm5hbWVzcGFjZVVSSSA9PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQubmFtZXNwYWNlVVJJKSB7XG4gICAgICAgIGRvbSA9IFBvbHlmaWxsZWRIVE1MVGVtcGxhdGVFbGVtZW50Ll9jbG9uZU5vZGUodGhpcywgZGVlcCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkb20gPSBjYXB0dXJlZENsb25lTm9kZS5jYWxsKHRoaXMsIGRlZXApO1xuICAgICAgfVxuICAgICAgLy8gdGVtcGxhdGUuY29udGVudCBpcyBjbG9uZWQgaWZmIGBkZWVwYC5cbiAgICAgIGlmIChkZWVwKSB7XG4gICAgICAgIGZpeENsb25lZERvbShkb20sIHRoaXMpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRvbTtcbiAgICB9O1xuXG4gICAgLy8gTk9URTogd2UgYXJlIGNsb25pbmcgaW5zdGVhZCBvZiBpbXBvcnRpbmcgPHRlbXBsYXRlPidzLlxuICAgIC8vIEhvd2V2ZXIsIHRoZSBvd25lckRvY3VtZW50IG9mIHRoZSBjbG9uZWQgdGVtcGxhdGUgd2lsbCBiZSBjb3JyZWN0IVxuICAgIC8vIFRoaXMgaXMgYmVjYXVzZSB0aGUgbmF0aXZlIGltcG9ydCBub2RlIGNyZWF0ZXMgdGhlIHJpZ2h0IGRvY3VtZW50IG93bmVkXG4gICAgLy8gc3VidHJlZSBhbmQgYGZpeENsb25lZERvbWAgaW5zZXJ0cyBjbG9uZWQgdGVtcGxhdGVzIGludG8gdGhpcyBzdWJ0cmVlLFxuICAgIC8vIHRodXMgdXBkYXRpbmcgdGhlIG93bmVyIGRvYy5cbiAgICB2YXIgaW1wb3J0Tm9kZSA9IERvY3VtZW50LnByb3RvdHlwZS5pbXBvcnROb2RlID0gZnVuY3Rpb24gaW1wb3J0Tm9kZShlbGVtZW50LCBkZWVwKSB7XG4gICAgICBkZWVwID0gZGVlcCB8fCBmYWxzZTtcbiAgICAgIGlmIChlbGVtZW50LmxvY2FsTmFtZSA9PT0gVEVNUExBVEVfVEFHKSB7XG4gICAgICAgIHJldHVybiBQb2x5ZmlsbGVkSFRNTFRlbXBsYXRlRWxlbWVudC5fY2xvbmVOb2RlKGVsZW1lbnQsIGRlZXApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGRvbSA9IGNhcHR1cmVkSW1wb3J0Tm9kZS5jYWxsKHRoaXMsIGVsZW1lbnQsIGRlZXApO1xuICAgICAgICBpZiAoZGVlcCkge1xuICAgICAgICAgIGZpeENsb25lZERvbShkb20sIGVsZW1lbnQpO1xuICAgICAgICAgIGZpeENsb25lZFNjcmlwdHMoZG9tKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZG9tO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBpZiAobmVlZHNUZW1wbGF0ZSkge1xuICAgIHdpbmRvdy5IVE1MVGVtcGxhdGVFbGVtZW50ID0gUG9seWZpbGxlZEhUTUxUZW1wbGF0ZUVsZW1lbnQ7XG4gIH1cblxufSkoKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3RlbXBsYXRlLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiIWZ1bmN0aW9uKHQsZSl7XCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGU/ZSgpOlwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZD9kZWZpbmUoZSk6ZSgpfSgwLGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gdChlKXtyZXR1cm4odD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkoZSl9dmFyIGU9ZnVuY3Rpb24odCl7cmV0dXJuXCJzdHJpbmdcIj09dHlwZW9mIHR9LG49ZnVuY3Rpb24odCl7cmV0dXJuIHQgaW5zdGFuY2VvZiBCbG9ifTsoZnVuY3Rpb24oKXtpZihmdW5jdGlvbigpe3JldHVyblwibmF2aWdhdG9yXCJpbiB0aGlzJiZcInNlbmRCZWFjb25cImluIHRoaXMubmF2aWdhdG9yfS5jYWxsKHRoaXMpKXJldHVybjtcIm5hdmlnYXRvclwiaW4gdGhpc3x8KHRoaXMubmF2aWdhdG9yPXt9KTtcImZ1bmN0aW9uXCIhPXR5cGVvZiB0aGlzLm5hdmlnYXRvci5zZW5kQmVhY29uJiYodGhpcy5uYXZpZ2F0b3Iuc2VuZEJlYWNvbj1mdW5jdGlvbih0LG8pe3ZhciBpPXRoaXMuZXZlbnQmJnRoaXMuZXZlbnQudHlwZSxyPVwidW5sb2FkXCI9PT1pfHxcImJlZm9yZXVubG9hZFwiPT09aSxzPVwiWE1MSHR0cFJlcXVlc3RcImluIHRoaXM/bmV3IFhNTEh0dHBSZXF1ZXN0Om5ldyBBY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTEhUVFBcIik7cy5vcGVuKFwiUE9TVFwiLHQsIXIpLHMud2l0aENyZWRlbnRpYWxzPSEwLHMuc2V0UmVxdWVzdEhlYWRlcihcIkFjY2VwdFwiLFwiKi8qXCIpLGUobyk/KHMuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLFwidGV4dC9wbGFpbjtjaGFyc2V0PVVURi04XCIpLHMucmVzcG9uc2VUeXBlPVwidGV4dFwiKTpuKG8pJiZvLnR5cGUmJnMuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLG8udHlwZSk7dHJ5e3Muc2VuZChvKX1jYXRjaCh0KXtyZXR1cm4hMX1yZXR1cm4hMH0uYmluZCh0aGlzKSl9KS5jYWxsKFwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIHdpbmRvdz9cInVuZGVmaW5lZFwiOnQod2luZG93KSk/d2luZG93Ont9KX0pO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbmF2aWdhdG9yLnNlbmRiZWFjb24uanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiXSwic291cmNlUm9vdCI6IiJ9