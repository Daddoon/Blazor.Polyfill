# Blazor.Polyfill
Polyfills for Blazor for Internet Explorer 11 support and some fix for some other browsers, like buggy Safari with WebAssembly

# ABOUT

This are the required polyfills in order to launch Blazor from Internet Explorer 11, maybe some other unsupported browsers too.

Please note that this project is only for compatibility conveniences and no one knows if Blazor will still work even with theses polyfills in the future. There is also no guarantee about full Blazor support.

This project is using [*core-js*](https://github.com/zloirock/core-js) and [*fetch*](https://github.com/github/fetch) polyfills, with some tweak at startup for **Internet Explorer 11**, and detecting buggy WebAssembly on Webkit, including **Chrome** and **Safari**.

Falling back on **asmjs** for theses buggy Webkit version.

# INSTALLATION

The easiest way to install is to download the [*latest release*](https://github.com/Daddoon/Blazor.Polyfill/releases) and include the **blazor.polyfill.js** or **blazor.polyfill.min.js** file before the blazor-boot script tag in your **wwwroot\index.html** file like:

```html
<script type="text/javascript" src="blazor.polyfill.min.js"></script>
<script type="blazor-boot">
</script>
```

That's all !

# DISCLAIMER

This project is not affiliated with the Blazor project.
