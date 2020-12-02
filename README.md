# Blazor.Polyfill[<img src="logo_blazorpolyfill.png_256x256.png?raw=true" align="right" width="200">]() 

Polyfills for Blazor server-side for Internet Explorer 11 support on **.NET 5.0.0**


# INSTALLATION

**BlazorPolyfill.Server** NuGet package can be either found [on nuget.org](https://www.nuget.org/packages/BlazorPolyfill.Server/5.0.0) or from the [*latest release*](https://github.com/Daddoon/Blazor.Polyfill/releases) page on this repository.

- Install the package interactively from the NuGet Package manager in Visual Studio
- **Or** install it from the Package Manager CLI with this command:
```
Install-Package BlazorPolyfill.Server
```
- **Or** additional syntax and possibilities available from the [NuGet package page](https://www.nuget.org/packages/BlazorPolyfill.Server/5.0.0)

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

- You are good to go ! Blazor server-side with .NET 5 should be able load on Internet Explorer 11

# ABOUT

## Polyfills

This are the required polyfills and fixes in order to launch Blazor from Internet Explorer 11.

This project is using the following polyfills internally:

- [*core-js*](https://github.com/zloirock/core-js)
- [*fetch*](https://github.com/github/fetch)
- [*webcomponents/template*](https://github.com/webcomponents/template)
- [*miguelmota/Navigator.sendBeacon*](https://github.com/miguelmota/Navigator.sendBeacon)
- [*mo/abortcontroller-polyfill*](https://github.com/mo/abortcontroller-polyfill)

**NOTE:** that the **blazor.polyfill.js** file return an "empty" javascript content if the browser is not Internet Explorer 11.

## blazor.server.js file alteration on Internet Explorer 11

Only using Polyfills was not sufficient in order to make it working on IE11.

The **blazor.server.js** library is dynamicly altered at the first app request when IE11 is the calling browser.
The altered returned version is **ONLY** returned for IE11, other browsers will receive the regular file packaged by Microsoft.

The library is altered on the fly because the Microsoft library may update in the future in your app, and we always want to have the current latest version of the library to be modified at startup.

Some events are done before the final file result is cached on the server:

- Fixing Regular Expressions issues for IE11, by removing named capturing groups in the library and related regexp properties expecting to be accessed this way.
- Transpiling the **blazor.server.js** file to ES5 with **babel-standalone** for the IE11 profile.
  That's why there is some dependencies on **ReactJS.NET** package, that is embedding **babel-standalone** internally.
- Minifying the library content again as **babel** return a non-minified version of the code
- Then the result is cached for application lifetime for all IE11 requests, and so for the browser caching logic (ETag, Modified-Since headers...)

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
    }
</script>
<script src="_framework/blazor.polyfill.min.js"></script>
<script src="_framework/blazor.server.js"></script>
```
