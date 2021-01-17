using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blazor.Polyfill.Server
{
    public class BlazorPolyfillOptions
    {
        public BlazorPolyfillOptions()
        {
            ForceES5Fallback = false;
            ES5FallbackValidation = null;
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
    }
}
