# Blazor.Polyfill

Polyfills for Blazor and fixes for Internet Explorer 11 support with server-side mode.

# ABOUT

This are the required polyfills in order to launch Blazor from Internet Explorer 11 in server-side mode, and maybe some other unsupported browsers too.

This project is using [*core-js*](https://github.com/zloirock/core-js), [*fetch*](https://github.com/github/fetch) and also [webcomponents/template](https://github.com/webcomponents/template) polyfills, with some tweak at startup for **Internet Explorer 11**.

# INSTALLATION

The easiest way to install is to download the [*latest release*](https://github.com/Daddoon/Blazor.Polyfill/releases) and include the **blazor.polyfill.js** or **blazor.polyfill.min.js** file before the **blazor.webassembly.js** (client-mode) or **blazor.server.js** (server-mode) script tag in your **wwwroot\index.html** file like:

## For Blazor in Web client mode

```html
<script type="text/javascript" src="blazor.polyfill.min.js"></script>
<script src="_framework/blazor.webassembly.js"></script>
```

## For Blazor in Server-side mode

```html
<script type="text/javascript" src="blazor.polyfill.min.js"></script>
<script src="_framework/blazor.server.js"></script>
```


