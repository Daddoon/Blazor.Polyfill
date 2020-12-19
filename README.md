# Blazor.Polyfill[<img src="logo_blazorpolyfill.png_256x256.png?raw=true" align="right" width="200">]() 

Blazor server-side Polyfills and fixes for **Internet Explorer 11** & **Edge Legacy** (EdgeHTML engine).

# SUMMARY

- [Installation](#installation)
- [Known issue](#known-issue)
- [About](#about)
- [Using Telerik Blazor Component or MatBlazor on IE11](#using-telerik-blazor-component-or-matblazor-on-ie11)

# INSTALLATION

- [.NET 5.0+](#net-50)
- [.NET 3.1](#net-31)

## .NET 5.0+

**BlazorPolyfill.Server** NuGet package can be either found [on nuget.org](https://www.nuget.org/packages/BlazorPolyfill.Server/) or from the [*latest release*](https://github.com/Daddoon/Blazor.Polyfill/releases) page on this repository.

- (Optional) If updating from Blazor.Polyfill **3.0.8**, please remove any reference to **blazor.polyfill.js** or **blazor.polyfill.min.js** from your **_Host.cshtml** code, or any static file about the library you would link to in your code, as the library is now embedded is the NuGet package, and managed by **_framework/blazor.polyfill.min.js** as a magic path.


- Install the **BlazorPolyfill.Server** package interactively from the NuGet Package manager in Visual Studio
- **Or** install it from the Package Manager CLI with this command:
```
Install-Package BlazorPolyfill.Server
```
- **Or** additional syntax and possibilities available from the [NuGet package page](https://www.nuget.org/packages/BlazorPolyfill.Server/)

- In your **_Host.cshtml** page, include **_framework/blazor.polyfill.min.js** file before the **_framework/blazor.server.js** script tag.
  The end of your page should look like this:
```html
<script src="_framework/blazor.polyfill.min.js"></script>
<script src="_framework/blazor.server.js"></script>
```

- In your **Startup.cs** file, in your **ConfigureServices** method, add **services.AddBlazorPolyfill()** at the end of your services declaration:
```cs
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddRazorPages();
            services.AddServerSideBlazor();
            services.AddSingleton<WeatherForecastService>();
            services.AddBlazorPolyfill();
        }
```

- In your **Startup.cs** file, in your **Configure** method, add **app.UseBlazorPolyfill()** just before **app.UseStaticFiles()**:
```cs
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            /* Some code */
            app.UseBlazorPolyfill();
            app.UseStaticFiles();
            /* Some code */
        }
```

- You are good to go ! Blazor server-side with .NET 5 should be able load on Internet Explorer 11 & Edge

**NOTE:** blazor.polyfill.js content will be kind of empty automatically if the detected browser, through the user-agent, is something else than Internet Explorer or Edge Legacy.

## .NET 3.1

- Download the [*Blazor.Polyfill 3.0.8 release*](https://github.com/Daddoon/Blazor.Polyfill/releases/tag/3.0.8) and include the **blazor.polyfill.js** or **blazor.polyfill.min.js** file before the **blazor.server.js** script tag in your **wwwroot\index.html** or **_Host.cshtml** file like:

```html
<script type="text/javascript" src="js/blazor.polyfill.min.js"></script>
<script src="_framework/blazor.server.js"></script>
```

...considering you have copied the file in a **wwwroot/js** folder.

- If you want this file to be loaded only if this is Internet Explorer actually running, you may write this instead:

```html
<script type="text/javascript">
    if (/MSIE \d|Trident.*rv:/.test(navigator.userAgent)) {
        document.write('<script src="js/blazor.polyfill.min.js"><\/script>');
    }
</script>
<script src="_framework/blazor.server.js"></script>
```

## KNOWN ISSUE

### Error 500 with blazor.server.js

The current library components have been tested working on a **Windows environment** concerning the 'altered on-the-fly' **blazor.server.js** file generation.

Some components relies on **ReactJS.NET** for the use of **babel-standalone**, needing a **JavaScriptEngine image**, shipped with this library.

The following **Microsoft.ClearScript.V8** Native images are used:

- win-x64
- win-x86
- linux-x64
- osx-x64

Following theses statements, unfortunately it has been reported that it fail on **Azur WebApp** if using a **Linux** OS image.

Test on regular Linux distribution has not been done yet.

You can [follow the issue here](https://github.com/Daddoon/Blazor.Polyfill/issues/40)

# ABOUT

## Polyfills

This are the required polyfills and fixes in order to launch Blazor from Internet Explorer 11 & Edge Legacy (EdgeHTML engine).

This project is using the following polyfills internally:

- [*core-js*](https://github.com/zloirock/core-js)
- [*web-animations-js*](https://github.com/web-animations/web-animations-js)
- [*fetch*](https://github.com/github/fetch)
- [*template*](https://github.com/webcomponents/template)
- [*Navigator.sendBeacon*](https://github.com/miguelmota/Navigator.sendBeacon)
- [*abortcontroller-polyfill*](https://github.com/mo/abortcontroller-polyfill)
- [*after*](https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/after)
- [*canvas-to-blob*](https://github.com/blueimp/JavaScript-Canvas-to-Blob)

Also an usage of **babel-standalone** through **ReactJS.NET** library for the alteration of the **blazor.server.js** library on-the-fly, in order to transpile code to **ES5**.

**NOTE:** that the **blazor.polyfill.js** file return an "empty" javascript content if the browser is not Internet Explorer 11 or Edge Legacy.

## blazor.server.js file alteration on Internet Explorer 11 & Edge Legacy

Only using Polyfills was not sufficient in order to make it working on IE11 and Edge.

The **blazor.server.js** library is dynamicaly altered at the first app request.
The altered returned version is **ONLY** returned for IE11 and Edge, other browsers will receive the regular file packaged by Microsoft.

The library is altered on the fly because the Microsoft library may update in the future in your app, and we always want to have the current latest version of the library to be modified at startup.

Some events are done before the final file result is cached on the server:

- Fixing Regular Expressions issues for IE11, by removing named capturing groups in the library and related regexp properties expecting to be accessed this way.
- Transpiling the **blazor.server.js** file to ES5 with **babel-standalone** for the IE11 profile.
  That's why there is some dependencies on **ReactJS.NET** package, that is embedding **babel-standalone** internally.
- Minifying the library content again as **babel** return a non-minified version of the code
- Then the result is cached for application lifetime for all IE11 requests, and so for the browser caching logic (ETag, Modified-Since headers...)

# Using Telerik Blazor Component or MatBlazor on IE11

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
    }
</script>
<!-- Your blazor.polyfill.js and blazor.server.js scripts -->
```
