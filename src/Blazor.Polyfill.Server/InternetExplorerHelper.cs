using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blazor.Polyfill.Server
{
    internal static class HttpRequestExtensions
    {
        public static bool IsInternetExplorer(this HttpRequest request)
        {
            return IsInternetExplorer(request.Headers["User-Agent"]);
        }

        private static bool IsInternetExplorer(string userAgent)
        {
            return userAgent.Contains("MSIE")
                   || userAgent.Contains("Trident");
        }
    }
}
