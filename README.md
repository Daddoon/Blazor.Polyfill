# Blazor.Polyfill

Polyfills for Blazor and fixes for Internet Explorer 11 support with server-side mode.

### NOTICE

Since **Blazor 3.1.0-preview3.19555.2**, including the polyfill on a **Blazor WebAssembly** project can cause some break, especially on **Edge**.
As the current library is only aimed for the **Blazor server-side** project and only for **Internet Explorer 11**, you must include this polyfill only on this browser.

See the updated documentation.

# ABOUT

This are the required polyfills and fixes in order to launch Blazor from Internet Explorer 11.

This project is using the following polyfills internally:

- [*core-js*](https://github.com/zloirock/core-js)
- [*fetch*](https://github.com/github/fetch)
- [webcomponents/template](https://github.com/webcomponents/template)
- [miguelmota/Navigator.sendBeacon](https://github.com/miguelmota/Navigator.sendBeacon)
- [mo/abortcontroller-polyfill](https://github.com/mo/abortcontroller-polyfill)

# INSTALLATION

The easiest way to install is to download the [*latest release*](https://github.com/Daddoon/Blazor.Polyfill/releases) and include the **blazor.polyfill.js** or **blazor.polyfill.min.js** file before the **blazor.server.js** (server-mode) script tag in your **wwwroot\index.html** or **_Host.cshtml** file like:

```html
<script type="text/javascript">
    if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
        document.write('<script src="js/blazor.polyfill.min.js"><\/script>');
    }
</script>
<script src="_framework/blazor.server.js"></script>
```

...considering you have copied the file in a **wwwroot/js** folder.

## Using Telerik Blazor Component or MatBlazor on IE11

**Telerik Blazor Component** or **MatBlazor** may not work out of the box on IE11.

This is not related to a missing functionnality of Blazor.Polyfill, as it is sufficient to launch Blazor on IE11 with it, but just the fact that some functionnalities used by Telerik Blazor component are not available on it.

Some additionnal polyfills will be required in addition of Blazor.Polyfill, to make the **Telerik Blazor Component** library work on it.

You will need:

- Element.prototype.closest polyfill
- document.IntersectionObserver polyfill
- document.QuerySelector polyfill
- Array.prototype.forEach
- NodeList.prototype.forEach

Using **polyfill.io** you could load your Blazor app like this instead:


```html
<script type="text/javascript">
    if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
        document.write('<script src="https://polyfill.io/v3/polyfill.min.js?features=Element.prototype.closest%2CIntersectionObserver%2Cdocument.querySelector%2Cfeatures=Array.prototype.forEach%2CNodeList.prototype.forEach"><\/script>');
        document.write('<script src="js/blazor.polyfill.min.js"><\/script>');
    }
</script>
<script src="_framework/blazor.server.js"></script>
```
