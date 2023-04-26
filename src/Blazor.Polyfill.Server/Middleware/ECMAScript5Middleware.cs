using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Blazor.Polyfill.Server.Enums;
using Blazor.Polyfill.Server.Helper;
using Blazor.Polyfill.Server.Model;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileSystemGlobbing;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
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
        public ECMAScript5Middleware(RequestDelegate next, ILoggerFactory loggerFactory)
        {
            if (loggerFactory != null && !LogHelper.IsLoggerSet())
            {
                LogHelper.SetLogger(loggerFactory.CreateLogger(LogHelper.LoggerName));
            }

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

        public static bool RequestFileIsFromES5CacheStore(HttpRequest request)
        {
            if (request.Path.StartsWithSegments($"/{ES5CacheHelper.ES5CacheFolderName}", StringComparison.InvariantCultureIgnoreCase))
            {
                return true;
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
                || RequestedFileIsJavascriptModuleImportEmulationLibraryFile(context.Request, options)
                || RequestFileIsFromES5CacheStore(context.Request))
            {
                return false;
            }

            //Specific case for blazor.server.js. It should now always be taken as to be cached, but should managed differently
            //when the ES5 behavior will occur.
            if (RequestedFileIsBlazorServerJS(context.Request))
            {
                return true;
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

        /// <summary>
        /// Cached IWebHostEnvironment configuration
        /// </summary>
        private static IWebHostEnvironment _env;

        /// <summary>
        /// Return a cached IWebHostEnvironment set from the middleware.
        /// Mainly used if some informations are needed in an internal helper
        /// </summary>
        /// <returns></returns>
        internal static IWebHostEnvironment GetWebHostEnvironment()
        {
            return _env;
        }

        private static void CacheIWebHostEnvironment(IWebHostEnvironment env)
        {
            if (_env == null)
            {
                _env = env;
            }
        }

        public async Task Invoke(HttpContext context, IWebHostEnvironment env)
        {
            CacheIWebHostEnvironment(env);

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
            return ES5Convert(source, null, null);
        }

        private RequestFileMetadata ES5Convert(RequestFileMetadata source, Func<string, string, string> beforeTransform, Func<string, string> beforeMinification)
        {
            RequestFileMetadata destination = null;
            bool BeforeTransformSuccess = true;
            bool BeforeMinificationSuccess = true;
            bool TransformSuccess = true;
            bool MinificationSuccess = true;
            List<UglifyError> uglifyErrors = new List<UglifyError>();

            try
            {
                #region Before Transform

                //If provided, this event will be called before the ECMA transformation
                if (beforeTransform != null)
                {
                    BeforeTransformSuccess = false;

                    source.SourceContent = beforeTransform(source.SourcePath, source.SourceContent);

                    BeforeTransformSuccess = true;
                }

                #endregion Before Transform

                #region Transform

                TransformSuccess = false;

                //Transpile code to ES5 for IE11
                source.ES5Content = BabelHelper.Transform(source.SourceContent, Path.GetFileName(source.SourcePath));

                TransformSuccess = true;

                #endregion Transform

                #region Before Minification

                //If provided, this event will be called before the Minification
                if (beforeMinification != null)
                {
                    BeforeMinificationSuccess = false;

                    source.ES5Content = beforeMinification(source.ES5Content);

                    BeforeMinificationSuccess = true;
                }

                #endregion Before Minification

                #region Minification

                MinificationSuccess = false;

                //Minify with AjaxMin (we don't want an additional external tool with NPM or else for managing this
                //kind of thing here...
                var uglifyResult = Uglify.Js(source.ES5Content);

                source.ES5Content = uglifyResult.Code;
                destination = source;

                if (uglifyResult.HasErrors)
                {
                    MinificationSuccess = false;

                    string errorsList = string.Join('\n', uglifyResult.Errors.Where(p => p.IsError).Select(p => $"Line {p.StartLine} to {p.EndLine}, Column {p.StartColumn} to {p.EndColumn} - Error code: {p.ErrorCode}, Message: {p.Message}").ToArray());

                    throw new Exception($"Errors occured during minification, see details below:\n{errorsList}");
                }
                else
                {
                    MinificationSuccess = true;
                }

                #endregion Minification
            }
            catch (Exception ex)
            {
                string es5ConvertExceptionString = $"On path '{source.SourcePath}' - [Events success status] BeforeTransform: {BeforeTransformSuccess}, Transform: {TransformSuccess}, BeforeMinification: {BeforeMinificationSuccess}, Minification: {MinificationSuccess}\nError Message: {ex.Message}.\nConsider exception analysis with '{nameof(BlazorPolyfillOptions)}.{nameof(BlazorPolyfillOptions.OnES5ConvertFailure)}' method and prior code fixing before transform through '{nameof(BlazorPolyfillOptions)}.{nameof(BlazorPolyfillOptions.BeforeES5TransformHandler)}'";

                LogHelper.LogError(es5ConvertExceptionString);
                Exception es5exception = new Exception(es5ConvertExceptionString, ex);

                BlazorPolyfillOptions option = BlazorPolyfillMiddlewareExtensions.GetOptions();
                if (option.OnES5ConvertFailure != null)
                {
                    try
                    {
                        //Should allow user to track and do anything but we should continue our behavior if this throw
                        option.OnES5ConvertFailure(source.SourcePath, ex);
                    }
                    catch (Exception)
                    {
                    }
                }

                return null;
            }

            return destination;
        }

        private async Task ManageES5Conversion(HttpContext context)
        {
            if (ES5CacheHelper.IsFileInErrorFallbackStream(context.Request.Path))
            {
                //Should return original file if flagged in fallback stream
                var fallbackCache = ES5CacheHelper.GetFallbackStream(context.Request.Path);

                //Here we cannot use the convenient "SendFileAsync" method in the ManageRequest method
                //because the file may not be present in wwwroot while development time.
                //Assuming that all files in FileInErrorFallbackStream are files that must be
                //fixed by the developer during development time for optimal usage in Production

                var currentResponseStream = context.Response.Body;
                using (var fakeResponseStream = new MemoryStream())
                {
                    context.Response.Body = fakeResponseStream;

                    //Awaiting StaticFile to fill request content
                    await _next(context);

                    //If the requested file return 304 status code, we should not try to cache / resolve this file
                    //as StaticFileMiddleware does not return the data in this case
                    //Same as if there is any other behavior that is not a success (not 200) we must retrieve and return the initial stream modified by the other context
                    //without any alteration
                    if (context.Response.StatusCode != 200)
                    {
                        //Restoring the original response WriteOnly Stream
                        context.Response.Body = await CopyStreamAsync(fakeResponseStream, currentResponseStream);
                        return;
                    }

                    var response = await ExtractResponseAsync(context.Request, context.Response);

                    //must restore it in order to make the thing work normally
                    context.Response.Body = currentResponseStream;

                    //Update headers with our logic
                    await HttpRequestManager.ManageFallbackRequest(
                        context,
                        fallbackCache.ETag,
                        null,
                        response.SourceContent);
                }

                return;
            }

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

                if (ES5CacheHelper.HasES5FileInCacheWithChecksum(context.Request.Path, response.SourceCheckSum))
                {
                    //From here we must see if we have a corresponding hash for this fetched resource in the cache store. Subsequent call will short-circuit at the top of this method because
                    //the cache entry dictionary will be populated. If the data is not present we will have
                    //to cache the file in disk
                    _cacheMetadata = ES5CacheHelper.GetES5FileFromCache(context.Request.Path);
                }
                else
                {
                    //Convert to ES5 the current response
                    RequestFileMetadata fileContent = null;

                    BlazorPolyfillOptions option = BlazorPolyfillMiddlewareExtensions.GetOptions();

                    //Manage specific behavior for Blazor.server.js
                    if (RequestedFileIsBlazorServerJS(context.Request))
                    {
                        if (option.UsePackagedBlazorServerLibrary)
                        {
                            fileContent = response;
                            fileContent.ES5Content = BlazorServerTransformHelper.GetPackagedBlazorServerLibrary();
                        }
                        else
                        {
                            fileContent = ES5Convert(response,
                                BlazorServerTransformHelper.BeforeES5Transform,
                                BlazorServerTransformHelper.BeforeMinification);
                        }
                    }
                    else
                    {
                        //Convert to ES5 the current response
                        fileContent = ES5Convert(response, option.BeforeES5TransformHandler, null);
                    }

                    if (fileContent == null)
                    {
                        //If here that mean that conversion failed.
                        //We will take the original object but will add
                        //current content as ES5 even if not
                        fileContent = response;
                        fileContent.ES5Content = fileContent.SourceContent;

                        //Cache to "fallback to source stream"
                        _cacheMetadata = ES5CacheHelper.SetFileInErrorFallbackStream(fileContent);
                    }
                    else
                    {
                        _cacheMetadata = ES5CacheHelper.SetES5FileInCache(fileContent);
                    }
                }

                //As we have interverted the original Http Stream in our 'using' above, we
                //must restore it in order to make the thing work normally
                context.Response.Body = originalResponseStream;

                if (_cacheMetadata.CacheType == RequestFileCacheType.ES5Cache)
                {
                    //Manage request specificity
                    await HttpRequestManager.ManageRequest(context, _cacheMetadata.ES5Path, _cacheMetadata.ETag, _cacheMetadata.ContentLength);
                }
                else
                {
                    //Manage request specificity
                    await HttpRequestManager.ManageFallbackRequest(context, _cacheMetadata.ETag, null, response.SourceContent);
                }
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
                SourceCheckSum = CryptographyHelper.CreateSHA256(responseBody),
            };
        }
    }
}
