# Blazor.Polyfill
Polyfills for Blazor for Internet Explorer 11 support

## NOTE

This is a support library, packaging needed polyfills for Internet Explorer 11, and some code for workarounding some missing things. Therefore this must be seen as a pre-built package, that's why used dependencies are not shown on the published package.

See the source repository for more info instead.

### WARNING: BREAK SINCE BLAZOR 3.1.0-preview3.19555.2

Since **Blazor 3.1.0-preview3.19555.2**, previous version of Blazor.Polyfill doesn't work correctly if they are included in a **blazor.webassembly.js** project, as it seem to break some Blazor functionnalities on **Edge**.
I think this is related to some Blazor change and some race condition / module loading with **Webpack** and **core-js**.

I don't have yet found a clean way to workaround and include everything in one package due to theses problems.
However, things works correctly when including **core-js 2.1.0** and only if outside the Blazor.Polyfill package.

Taking this in consideration, this release of Blazor.Polyfill doesn't have **core-js** included.
See the installation guide for more info.

**NOTE:** You may still keep the previous Blazor.Polyfill version if you manage to include it only on a server-side, **blazor.server.js**, app. 

## ABOUT

This are the required polyfills in order to launch Blazor from Internet Explorer 11, maybe some other unsupported browsers too.

Please note that this project is only for compatibility conveniences and no one knows if Blazor will still work even with theses polyfills in the future. There is also no guarantee about full Blazor support.

This project is using [*core-js*](https://github.com/zloirock/core-js), [*fetch*](https://github.com/github/fetch) and also [webcomponents/template](https://github.com/webcomponents/template) polyfills, and some others, with some tweak at startup for **Internet Explorer 11**

## INSTALLATION

The easiest way to install is to download the [*latest release*](https://github.com/Daddoon/Blazor.Polyfill/releases) and include the **blazor.polyfill.js** or **blazor.polyfill.min.js** file before the **blazor.server.js** (server-mode) script tag in your **wwwroot\index.html** or **_Host.cshtml** file like:

```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/core-js/2.1.0/core.min.js"></script>
<script type="text/javascript" src="blazor.polyfill.min.js"></script>
<script src="_framework/blazor.server.js"></script>
```
