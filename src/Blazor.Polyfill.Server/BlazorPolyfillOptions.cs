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
    }
}
