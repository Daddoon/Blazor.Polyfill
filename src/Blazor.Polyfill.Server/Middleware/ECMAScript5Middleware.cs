using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Blazor.Polyfill.Server.Enums;
using Blazor.Polyfill.Server.Helper;
using Blazor.Polyfill.Server.Model;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using NUglify;

namespace Blazor.Polyfill.Server.Middleware
{
    /// <summary>
    /// Inspiration from:
    /// This: https://github.com/saturn72/tethys/blob/851ac6d6235c5e2d2f62c3d4343b8e862062a3c2/src/Tethys.Server/Middlewares/RequestResponseLoggingMiddleware.cs
    /// Linking this: https://www.carlrippon.com/adding-useful-information-to-asp-net-core-web-api-serilog-logs/
    /// </summary>
    internal class ECMAScript5Middleware
    {
        #region Fields
        private readonly RequestDelegate _next;

        #endregion

        #region ctor
        public ECMAScript5Middleware(RequestDelegate next)
        {
            _next = next;
        }
        #endregion

        public static bool RequestedFileIsBlazorServerJS(HttpRequest request)
        {
            if (request.Path.StartsWithSegments("/_framework", StringComparison.InvariantCultureIgnoreCase)
                && request.Path.StartsWithSegments("/_framework/blazor.server.js", StringComparison.InvariantCultureIgnoreCase))
            {
                return true;
            }

            return false;
        }

        public static bool RequestedFileIsBlazorPolyfill(HttpRequest request, out bool isMinified)
        {
            isMinified = false;

            if (request.Path.StartsWithSegments("/_framework", StringComparison.InvariantCultureIgnoreCase))
            {
                if (request.Path.StartsWithSegments("/_framework/blazor.polyfill.js", StringComparison.InvariantCultureIgnoreCase))
                {
                    isMinified = false;
                    return true;
                }
                else if (request.Path.StartsWithSegments("/_framework/blazor.polyfill.min.js", StringComparison.InvariantCultureIgnoreCase))
                {
                    isMinified = true;
                    return true;
                }
            }

            return false;
        }

        public static bool RequestedFileIsRazorClassLibraryFile(HttpRequest request)
        {
            if (request.Path.StartsWithSegments("/_content", StringComparison.InvariantCultureIgnoreCase) && request.Path.Value.EndsWith(".js", StringComparison.InvariantCultureIgnoreCase))
            {
                return true;
            }

            return false;
        }

        public static bool RequestedFileIsJavascriptFile(HttpRequest request)
        {
            if (request.Path.HasValue && request.Path.Value.EndsWith(".js", StringComparison.InvariantCultureIgnoreCase))
            {
                return true;
            }

            return false;
        }

        public static bool RequestedFileIsJavascriptModuleImportEmulationLibraryFile(HttpRequest request, BlazorPolyfillOptions options)
        {
            if (options.JavascriptModuleImportEmulation
                && !string.IsNullOrEmpty(options.JavascriptModuleImportEmulationLibraryPath)
                && options.JavascriptModuleImportEmulationLibraryPath.EndsWith(".js", StringComparison.InvariantCultureIgnoreCase))
            {
                if (request.Path.HasValue && request.Path.StartsWithSegments(options.JavascriptModuleImportEmulationLibraryPath, StringComparison.InvariantCultureIgnoreCase))
                {
                    return true;
                }
            }

            return false;
        }

        private bool ShouldInterceptRequest(HttpContext context)
        {
            var options = BlazorPolyfillMiddlewareExtensions.GetOptions();

            //Some specific case before the standard checking:
            //We must not intercept BlazorPolyfill and BlazorServer files
            //as they are managed differently with a terminal pipeline with
            //a IApplicationBuilder.MapWhen. See UseBlazorPolyfill method
            //in BlazorPolyfillMiddlewareExtension.
            //We want to avoid the pre-caching mecanism specially on blazor.server.js
            //file just in case a future update invalidate the file features, we don't
            //want to have to ask people to clear the cache if the file is then fixed
            //in a next version but with the original source checksum unchanged.

            //Also we must not transpile the JavascriptModuleImportEmulationLibrary file
            //as it should be already transpiled and packed by BlazorPolyfill.Build if used.
            if (RequestedFileIsBlazorPolyfill(context.Request, out bool bmin)
                || RequestedFileIsBlazorServerJS(context.Request)
                || RequestedFileIsJavascriptModuleImportEmulationLibraryFile(context.Request, options))
            {
                return false;
            }

            switch (options.ES5ConversionScope)
            {
                case ES5ConversionScope.None:
                    //Should never go here as the specific previous case is targeted
                    //for ES5ConversionScope.None
                    return false;
                case ES5ConversionScope.RazorClassLibrary:
                    if (RequestedFileIsRazorClassLibraryFile(context.Request))
                    {
                        return true;
                    }
                    return false;
                case ES5ConversionScope.All:
                    if (RequestedFileIsJavascriptFile(context.Request))
                    {
                        return true;
                    }
                    return false;
                default:
                    return false;
            }
        }

        public async Task Invoke(HttpContext context)
        {
            //Our middle must not do anything if any of the ES5Fallback option is set to off
            if (!context.Request.BrowserNeedES5Fallback())
            {
                await _next(context);
                return;
            }

            //Should intercept if any .js request.
            //Behavior may change depending the ES5 transpilation option.
            if (ShouldInterceptRequest(context))
                await ManageES5Conversion(context);
            else
                await _next(context);
        }

        /// <summary>
        /// Like copy stream but with automatic Seek Handling.
        /// Assuming the Source can be read
        /// Return the Destination Stream
        /// </summary>
        /// <param name="source"></param>
        /// <param name="destination"></param>
        private async Task<Stream> CopyStreamAsync(Stream source, Stream destination)
        {
            source.Seek(0, SeekOrigin.Begin);
            await source.CopyToAsync(destination);
            return destination;
        }

        private RequestFileMetadata ES5Convert(RequestFileMetadata source)
        {
            RequestFileMetadata destination = null;

            try
            {
                //Transpile code to ES5 for IE11
                source.ES5Content = BabelHelper.Transform(source.SourceContent, Path.GetFileName(source.SourcePath));

                //Minify with AjaxMin (we don't want an additional external tool with NPM or else for managing this
                //kind of thing here...
                source.ES5Content = Uglify.Js(source.ES5Content).Code;
                destination = source;
            }
            catch (Exception ex)
            {
                //TODO: Need to add a file logger ?
                Console.WriteLine($"ERROR: On path '{source.SourcePath}': {ex.Message}.");
            }

            return destination;
        }

        private async Task ManageES5Conversion(HttpContext context)
        {
            //If this return true here, this mean this is a subsequent call to a file
            //and that the file has already been cached in the internal dictionary
            //Otherwise we must try to seek the file hash of the current request and see
            //if it has been converted at least once in the app lifetime
            if (ES5CacheHelper.HasES5FileInCacheByPath(context.Request.Path))
            {
                var fileCache = ES5CacheHelper.GetES5FileFromCache(context.Request.Path);

                //Manage request specificity
                await HttpRequestManager.ManageRequest(context, fileCache.ES5Path, fileCache.ETag, fileCache.ContentLength);
                return;
            }

            //Here we are tricking the StaticFile handler by modifying the Body Stream type before it try to write in it.
            //Using a MemoryStream in order to be able to catch and modify the content afterward
            var originalResponseStream = context.Response.Body;
            using (var fakeResponseStream = new MemoryStream())
            {
                context.Response.Body = fakeResponseStream;

                //Awaiting StaticFile to fill the content
                await _next(context);

                //If the requested file return 304 status code, we should not try to cache / resolve this file
                //as StaticFileMiddleware does not return the data in this case
                //Same as if there is any other behavior that is not a success (not 200) we must retrieve and return the initial stream modified by the other context
                //without any alteration
                if (context.Response.StatusCode != 200)
                {
                    //Restoring the original response WriteOnly Stream
                    context.Response.Body = await CopyStreamAsync(fakeResponseStream, originalResponseStream);
                    return;
                }

                var response = await ExtractResponseAsync(context.Request, context.Response);

                RequestFileCacheMetadata _cacheMetadata = null;

                //From here we must see if we have a corresponding hash for this fetched resource in the cache store. Subsequent call will short-circuit at the top of this method because
                //the cache entry dictionary will be populated. If the data is not present we will have
                //to cache the file in disk
                if (ES5CacheHelper.HasES5FileInCacheWithChecksum(context.Request.Path, response.SourceCheckSum))
                {
                    _cacheMetadata = ES5CacheHelper.GetES5FileFromCache(context.Request.Path);
                }
                else
                {
                    //Convert to ES5 the current response
                    var fileContent = ES5Convert(response);

                    if (fileContent == null)
                    {
                        //If here that mean that conversion failed.
                        //We will take the original object but will add
                        //current content as ES5 even if not
                        fileContent = response;
                        fileContent.ES5Content = fileContent.SourceContent;
                    }

                    _cacheMetadata = ES5CacheHelper.SetES5FileInCache(fileContent);
                }

                //As we have interverted the original Http Stream in our 'using' above, we
                //must restore it in order to make the thing work normally
                context.Response.Body = originalResponseStream;

                //Manage request specificity
                await HttpRequestManager.ManageRequest(context, _cacheMetadata.ES5Path, _cacheMetadata.ETag, _cacheMetadata.ContentLength);
            }
        }

        private async Task<RequestFileMetadata> ExtractResponseAsync(HttpRequest request, HttpResponse response)
        {
            var reqBody = response.Body;
            var buffer = new byte[Convert.ToInt32(response.ContentLength)];

            response.Body.Seek(0, SeekOrigin.Begin);

            await response.Body.ReadAsync(buffer, 0, buffer.Length);
            var responseBody = Encoding.UTF8.GetString(buffer);
            reqBody.Seek(0, SeekOrigin.Begin);
            response.Body = reqBody;

            return new RequestFileMetadata()
            {
                SourcePath = request.Path.Value,
                SourceContent = responseBody,
                SourceCheckSum = CryptographyHelper.CreateSHA256(responseBody)
            };
        }
    }
}
