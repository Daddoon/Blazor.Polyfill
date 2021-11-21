using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blazor.Polyfill.Server.Enums
{
    /// <summary>
    /// Specify the Javascript conversion scope to ES5
    /// </summary>
    public enum ES5ConversionScope
    {
        /// <summary>
        /// If None is selected, only the blazor.server.js file will be converted to ES5.
        /// This is the minimum requirement and goal of this library.
        /// </summary>
        None = 0,

        /// <summary>
        /// If RazorClassLibraries is selected, only the blazor.server.js file and any Razor Class Library loaded in the project will be converted to ES5.
        /// Razor Class Library are any library loaded from a package that you reference through a special URI starting by '_content/' in your project.
        /// </summary>
        RazorClassLibrary = 1,

        /// <summary>
        /// If All is selected, any Javascript file will be converted to ES5
        /// </summary>
        All = 2
    }
}
