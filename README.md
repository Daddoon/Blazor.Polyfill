# Blazor.Polyfill[<img src="logo_blazorpolyfill.png_256x256.png?raw=true" align="right" width="200">]() 

Blazor server-side Polyfills and fixes for **Internet Explorer 11** & **Edge Legacy** (EdgeHTML engine).

# SUMMARY

- [Installation](#installation)
- [Recommendations & Troubleshooting](#recommendations--troubleshooting)
  - [OS & CPU Compatibilities](#os--cpu-compatibilities)
  - [What should i do if i'm on an unsupported environment ?](#what-should-i-do-if-im-on-an-unsupported-environment-)
  - [I would like instead to choose the JS engine for transpilation by myself](#i-would-like-instead-to-choose-the-js-engine-for-transpilation-by-myself)
- [About](#about)
- [Using Telerik Blazor Component or MatBlazor on IE11](#using-telerik-blazor-component-or-matblazor-on-ie11)

# INSTALLATION

- [.NET 5.0+](#net-50)
  - [Installation](#installation)
  - [(Optional) Javascript isolation & module import support](#optional-javascript-isolation--module-import-support)
  - [Additional options](#additional-options)
- [.NET 3.1](#net-31)

## .NET 5.0+

### Installation

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
```csharp
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddRazorPages();
            services.AddServerSideBlazor();
            services.AddSingleton<WeatherForecastService>();
            services.AddBlazorPolyfill();
        }
```

- In your **Startup.cs** file, in your **Configure** method, add **app.UseBlazorPolyfill()** just before **app.UseStaticFiles()**:
```csharp
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

### (Optional) Javascript isolation & module import support

Due to the lack ES6 and dynamic module import support on old browsers like Internet Explorer 11, some powerful functionalities like javascript isolation is not available.
This cannot be polyfilled directly as it's a missing browser and language feature.

However this can be done by creating a ES5 compatible bundle library, that will mimic the dynamic import behavior at runtime.

The NuGet package [BlazorPolyfill.Build](https://www.nuget.org/packages/BlazorPolyfill.Build/) has been done to make this automatic at build time.

Here are the step to install it:

- Install NPM on your system.
- Install BlazorPolyfill.Build NuGet package on your Blazor server project.
- Move your Javascript modules that you want to be bundled in the **wwwroot/js/modules** of your project. The current implementation will only look in this folder by Design, during the bundling process.
- Build your Blazor server project.
- If everything goes right, initial build step and bundling with **webpack**, your project build should succeed. An **es5module.js** file and an **es5module.min.js** file should be now visible in **/wwwroot** path.
- (Optional) You may add theses files in your **.gitignore** file, as they will be generated at build time.
- Open your **Startup.cs** file and in configure, enable the **JavascriptModuleImportEmulation** option:
    ```csharp
            app.UseBlazorPolyfill((options) =>
            {
                options.JavascriptModuleImportEmulation = true;

                /* This is the default value if not set */
                options.JavascriptModuleImportEmulationLibraryPath = "/es5module.min.js";
            });
    ```
- Replace any **import** keyword in your web project by **\_import\_** instead.
- Launch your web application. If your browser need ES5 fallback, or if your have forced it through the additional options (See [Additional options](#additional-options)), the **es5module.min.js** will be automatically loaded in the page, and will try to emulate module import calls. If the browser is not in ES5 falback mode, it will call the regular **import** keyword instead.
- Here an example like on this [Microsoft documentation: Blazor JavaScript isolation and object references](https://docs.microsoft.com/en-us/aspnet/core/blazor/call-javascript-from-dotnet?view=aspnetcore-5.0#blazor-javascript-isolation-and-object-references) should now work, with our little changes:

  Assuming a js file called **exampleJsInterop.js** placed in **/wwwroot/js/modules** folder:
  ```js
  export function showPrompt(message) {
    return prompt(message, 'Type anything here');
  }
  ```

  In your **.razor** page will be written like this:
  ```razor
  var module = await js.InvokeAsync<IJSObjectReference>(
    "_import_", "/js/modules/exampleJsInterop.js");
  ```

  See the Microsoft documentation for the Blazor API usage.

  With the **es5module.js** library loaded, when the expected module path and name is detected, it will internally return an object scoped on what it should have exported with a native import call. It has also converted all ES6/ES2015 syntax back to ES5.

#### Limitations

- File path and name are case-sensitive, but this may be changed in the future.

- All given path with **\_import\_** are considered as absolute path. Any other kind of input will be internally converted to an absolute path format. You should take this into consideration while calling your JS file in code.

- Only the modules placed in the **/wwwroot/js/modules** folder will be bundled. This is by Design. This mean that there is no Razor Class Library (**RCL**) bundling support, like **\_content/\*** js libraries.

  However feel free provide a **PR** that implement this !


### Additional options

You can configure additional options through the **UseBlazorPolyfill** method with a **BlazorPolyfillOptions** object instance or configuration delegate.
Here some kind of example:

```csharp
app.UseBlazorPolyfill(
    (options) => {
        options.ForceES5Fallback = false;
        options.ES5FallbackValidation = (HttpRequest request) =>
        {
            //Add your custom polyfill validation logic here.

            //The current example always validate polyfill behavior
            //but you can check User-Agent or other things
            //in the 'request' parameter.
            return true;
        };
    });
```

Options:

```csharp
// If the ForceES5Fallback parameter is set to true,
// the blazor.polyfill.js library content will always be returned
// and the blazor.server.js library will always be transpiled to ES5 with the needed fixes.
//
// If this parameter is set to false, only Internet Explorer 11 and Edge Legacy will have
// the ES5 fallback behavior.
//
// Default value is false.
public bool ForceES5Fallback { get; set; }

// Provide a method that validate if the current request should return the ES5 Fallback behavior or not.
// This can be useful if you want to extend the polyfill to some other browsers and/or conditions specific values.
// 
// Note that if ForceES5Fallback option is set to true, the ES5FallbackValidation return value
// will have no effect.
// 
// Also, Internet Explorer 11 and Edge Legacy will always return the ES5 Fallback behavior in all scenarios.
public Func<HttpRequest, bool> ES5FallbackValidation { get; set; }

// If enabled, the polyfill library will assume that you have added the BlazorPolyfill.Build library to your project
// and will try to load the generated ES5 scripts version of your javascript modules at boot after the polyfill library
// initialization on client side.
// 
// You can customize the expected library path and name to load through JavascriptModuleImportEmulationLibraryPath property
public bool JavascriptModuleImportEmulation { get; set; }

// Get or set the value of the path location of your ES5 javascript library file that emulate your regular javascript modules,
// generated from the BlazorPolyfill.Build package. The path given will be used to load your modules after the polyfill
// initialization. Default value is: "/es5module.min.js"
public string JavascriptModuleImportEmulationLibraryPath { get; set; }

// If set to true, the returned blazor.server.js file for ES5 compatibility will be a packaged one in this library
// instead of the one generated dynamically. It's not recommended in the sense that this usage prevent the automatic update
// of the blazor.server.js library if you install newer version of Blazor Server, and would maybe add issue. This option
// is a convenience for users who cannot dynamically transpile with React.NET/Babel because of missing JS engines for their
// platform or having issue with it, typically like ARM32v7 OS's.
public bool UsePackagedBlazorServerLibrary { get; set; }
```


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

# RECOMMENDATIONS & TROUBLESHOOTING

## OS & CPU Compatibilities

Not all OS's or CPU architectures are supported for the dynamic transpilation, or some environments like Azure, base Docker images, or else, may miss some required depdendencies.

**Everything should work out of the box on:**

- Windows (x86, x64, ARM64)
- OSX (x64)
- Linux (x64)

**Theses platforms are supported but the environment requirements may have issue depending the configuration:**

- Linux (ARM64)
- Microsoft Azure

**Theses platforms are unsupported:**

- Linux (x86)
- Any Docker Linux image on ARM64 or Linux on ARM64 that don't have the **GLIBCXX_3.4.26** lib installed on the system.
  This lib is required by the V8 JS Engine. ChakraCore does not support ARM64 on Linux at all.
- Any ARM32v7 environment.

### What should i do if i'm on an unsupported environment ?

If you are on an unsupported environment, consider disabling the transpilation process with BlazorPolyfill, and use a packaged versions of the fixed **blazor.server.js**. Here are the steps:

- In your **Startup** class, set the **preventReactServicesRegistration** parameter to true on **AddBlazorPolyfill**, like below:
  ```csharp
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            /* Other services registrations */
            services.AddBlazorPolyfill(true);
        }
    }
  ```
- In your **Startup** class, set the **UsePackagedBlazorServerLibrary** option on **UseBlazorPolyfill** to true, like below:
  ```csharp
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        /* Other method calls */
        app.UseBlazorPolyfill((options) =>
        {
            options.UsePackagedBlazorServerLibrary = true;
        });
    }
  ```
### I would like instead to choose the JS engine for transpilation by myself

- As stated for unsupported platforms, you may stop the automatic behavior by disabling automatic registration by setting the **preventReactServicesRegistration** parameter to true:

  ```csharp
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            /* Other services registrations */
            services.AddBlazorPolyfill(true);
        }
    }
  ```
  
- Then you will have to do all the registration by yourself. This include calling in your **Startup** class:
  - **AddReact** (ConfigureServices)
  - **AddJsEngineSwitcher** (ConfigureServices)
  - **UseReact** (Configure), ideally before **UseBlazorPolyfill**

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
