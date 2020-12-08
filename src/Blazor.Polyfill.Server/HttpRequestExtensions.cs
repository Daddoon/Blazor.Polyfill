using Microsoft.AspNetCore.Http;

namespace Blazor.Polyfill.Server
{
    internal static class HttpRequestExtensions
    {
        #region Internet Explorer

        /// <summary>
        /// If Internet Explorer is detected, return true
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public static bool IsInternetExplorer(this HttpRequest request)
        {
            return IsInternetExplorer(request.Headers["User-Agent"]);
        }

        /// <summary>
        /// If Internet Explorer is detected, return true
        /// </summary>
        /// <param name="userAgent"></param>
        /// <returns></returns>
        public static bool IsInternetExplorer(string userAgent)
        {
            if (userAgent == null)
            {
                return false;
            }

            return userAgent.Contains("MSIE")
                   || userAgent.Contains("Trident");
        }

        #endregion Internet Explorer

        #region Edge Legacy

        /// <summary>
        /// This is about Edge Legacy / EdgeHTML, not the new Chromium one
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public static bool IsEdgeHTML(this HttpRequest request)
        {
            return IsEdgeHTML(request.Headers["User-Agent"]);
        }

        /// <summary>
        /// This is about Edge Legacy / EdgeHTML, not the new Chromium one
        /// </summary>
        /// <param name="userAgent"></param>
        /// <returns></returns>
        public static bool IsEdgeHTML(string userAgent)
        {
            if (userAgent == null)
            {
                return false;
            }

            return userAgent.Contains("Edge");
        }

        #endregion Internet Explorer

        /// <summary>
        /// If the current user-agent in the request is eligible for ES5 fallback, return true
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public static bool BrowserNeedES5Fallback(this HttpRequest request)
        {
            return BrowserNeedES5Fallback(request.Headers["User-Agent"]);
        }

        /// <summary>
        /// If the current user-agent is eligible for ES5 fallback, return true
        /// </summary>
        /// <param name="userAgent"></param>
        /// <returns></returns>
        public static bool BrowserNeedES5Fallback(string userAgent)
        {
            if (userAgent == null)
            {
                return false;
            }

            return IsInternetExplorer(userAgent)
                   || IsEdgeHTML(userAgent);
        }
    }
}
