using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace Blazor.Polyfill.Server
{
    public class BlazorPolyfillOptions
    {
        internal const string DefaultJSModuleImportEmulationLibraryPath = "/es5module.min.js";

        /// <summary>
        /// The returned value will be injected before the polyfill content
        /// </summary>
        /// <returns></returns>
        internal string GetJavascriptToInject()
        {
            string esload = JavascriptModuleImportEmulation.ToString().ToLowerInvariant();
            string espath = HttpUtility.JavaScriptStringEncode(JavascriptModuleImportEmulationLibraryPath);

            return $"window._es5ShouldLoadModuleAfterBoot = {esload};window._es5modulePath = '{espath}';";
        }

        public BlazorPolyfillOptions()
        {
            UsePackagedBlazorServerLibrary = false;
            ForceES5Fallback = false;
            ES5FallbackValidation = null;
            JavascriptModuleImportEmulation = false;
            JavascriptModuleImportEmulationLibraryPath = DefaultJSModuleImportEmulationLibraryPath;
            CustomES5PathList = new List<string>();
        }

        /// <summary>
        /// If the <see cref="BlazorPolyfillOptions.ForceES5Fallback"/> parameter is set to <see cref="true"/>,
        /// the blazor.polyfill.js library content will always be returned
        /// and the blazor.server.js library will always be transpiled to ES5 with the needed fixes.
        /// 
        /// If this parameter is set to <see cref="false"/>, only Internet Explorer 11 and Edge Legacy will have
        /// the ES5 fallback behavior.
        /// 
        /// Default value is <see cref="false"/>.
        /// </summary>
        public bool ForceES5Fallback { get; set; }

        /// <summary>
        /// Provide a method that validate if the current request should return the ES5 Fallback behavior or not.
        /// This can be useful if you want to extend the polyfill to some other browsers and/or conditions specific values.
        /// 
        /// Note that if <see cref="ForceES5Fallback"/> option is set to true, the <see cref="ES5FallbackValidation"/> return value
        /// will have no effect.
        /// 
        /// Also, Internet Explorer 11 and Edge Legacy will always return the ES5 Fallback behavior in all scenarios.
        /// </summary>
        public Func<HttpRequest, bool> ES5FallbackValidation { get; set; }

        /// <summary>
        /// If enabled, the polyfill library will assume that you have added the BlazorPolyfill.Build library to your project
        /// and will try to load the generated ES5 scripts version of your javascript modules at boot after the polyfill library
        /// initialization on client side.
        /// 
        /// You can customize the expected library path and name to load through <see cref="JavascriptModuleImportEmulationLibraryPath"/> property
        /// </summary>
        public bool JavascriptModuleImportEmulation { get; set; }

        /// <summary>
        /// Get or set the value of the path location of your ES5 javascript library file that emulate your regular javascript modules,
        /// generated from the BlazorPolyfill.Build package. The path given will be used to load your modules after the polyfill
        /// initialization. Default value is: "/es5module.min.js"
        /// </summary>
        public string JavascriptModuleImportEmulationLibraryPath { get; set; }

        /// <summary>
        /// If set to true, the returned blazor.server.js file for ES5 compatibility will be a packaged one in this library
        /// instead of the one generated dynamically. It's not recommended in the sense that this usage prevent the automatic update
        /// of the blazor.server.js library if you install newer version of Blazor Server, and would maybe add issue. This option
        /// is a convenience for users who cannot dynamically transpile with React.NET/Babel because of missing JS engines for their
        /// platform or having issue with it, typically like ARM32v7 OS's.
        /// </summary>
        public bool UsePackagedBlazorServerLibrary { get; set; }

        /// <summary>
        /// A list of JS absolute path for your app that need to be transpiled to ES5 when fetched.
        /// This usage can workaround some third party JS libraries that are not directly compliant to ES6 that would return
        /// from a server request.
        /// </summary>
        public List<string> CustomES5PathList { get; set; }
    }
}
