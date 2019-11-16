# Blazor.Polyfill

Polyfills for Blazor and fixes for Internet Explorer 11 support with server-side mode.

### WARNING: BREAK SINCE BLAZOR 3.1.0-preview3.19555.2

Since **Blazor 3.1.0-preview3.19555.2**, previous version of Blazor.Polyfill doesn't work correctly if they are included in a **blazor.webassembly.js** project, as it seem to break some Blazor functionnalities on **Edge**.
I think this is related to some Blazor change and some race condition / module loading with **Webpack** and **core-js**.

I don't have yet found a clean way to workaround and include everything in one package due to theses problems.
However, things works correctly when including **core-js 2.1.0** and only if outside the Blazor.Polyfill package.

Taking this in consideration, this release of Blazor.Polyfill doesn't have **core-js** included.
See the installation guide for more info.

**NOTE:** You may still keep the previous Blazor.Polyfill version if you manage to include it only on a server-side, **blazor.server.js**, app. 


# ABOUT

This are the required polyfills in order to launch Blazor from Internet Explorer 11 in server-side mode, and maybe some other unsupported browsers too.

This project is using [*core-js*](https://github.com/zloirock/core-js), [*fetch*](https://github.com/github/fetch) and also [webcomponents/template](https://github.com/webcomponents/template) polyfills, with some tweak at startup for **Internet Explorer 11**.

# INSTALLATION

The easiest way to install is to download the [*latest release*](https://github.com/Daddoon/Blazor.Polyfill/releases) and include the **blazor.polyfill.js** or **blazor.polyfill.min.js** file before the **blazor.webassembly.js** (client-mode) or **blazor.server.js** (server-mode) script tag in your **wwwroot\index.html** file like:

```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/core-js/2.1.0/core.min.js"></script>
<script type="text/javascript" src="blazor.polyfill.min.js"></script>
<script src="_framework/blazor.server.js"></script>
```


