# Blazor.Polyfill
Polyfills for Blazor for Internet Explorer 11 support and some fix for some other browsers, like buggy Safari with WebAssembly

# ABOUT

This are the required polyfills in order to launch Blazor from Internet Explorer 11, maybe some other unsupported browsers too.

Please note that this project is only for compatibility conveniences and no one knows if Blazor will still work even with theses polyfills in the future. There is also no guarantee about full Blazor support.

This project is using [*core-js*](https://github.com/zloirock/core-js), [*fetch*](https://github.com/github/fetch) and also [webcomponents/template](https://github.com/webcomponents/template) polyfills, with some tweak at startup for **Internet Explorer 11**, and detecting buggy WebAssembly on Webkit, including **Chrome** and **Safari**.

Falling back on **asmjs** for theses buggy Webkit version.

# INSTALLATION

The easiest way to install is to download the [*latest release*](https://github.com/Daddoon/Blazor.Polyfill/releases) and include the **blazor.polyfill.js** or **blazor.polyfill.min.js** file before the **blazor-boot** (client-mode) script tag, or **blazor.server.js** (server-mode) script tag in your **wwwroot\index.html** file like:

## For Blazor in Web client mode

```html
<script type="text/javascript" src="blazor.polyfill.min.js"></script>
<script type="blazor-boot">
</script>
```

## For Blazor in Server-side mode

```html
<script type="text/javascript" src="blazor.polyfill.min.js"></script>
<script src="_framework/blazor.server.js"></script>
```

That's all !

# TROUBLESHOOT

## Missing .mem file (404 error)
Not directly related to **Blazor.Polyfill**, but depending your environment (IIS, IIS Express, Kestrel etC.) you may encounter this kind of error in the browser console at Blazor startup:

```
[Error] Failed to load resource: the server responded with a status of 404 (Not Found) (mono.js.mem, line 0)
```

This is surely related to a missing mime-type in your web configuration.
If you are using IIS hosting (or similar) edit your **web.config** file and at this node level:

```xml
<configuration>
  <system.webServer>
    <staticContent>
```
add a child node like:

```xml
<mimeMap fileExtension=".mem" mimeType="application/octet-stream" /> 
```

# DISCLAIMER

This project is not affiliated with the Blazor project.
