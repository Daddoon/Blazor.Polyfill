using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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

        private bool ShouldInterceptRequest(HttpContext context)
        {
            if (context.Request.Path.HasValue
                && context.Request.Path.StartsWithSegments("/_content")
                && context.Request.Path.Value.EndsWith(".js"))
            {
                return true;
            }
            return false;
        }

        public async Task Invoke(HttpContext context)
        {
            //Our middle must not do anything if any of the ES5Fallback option is set to off
            if (!context.Request.BrowserNeedES5Fallback())
            {
                await _next(context);
            }

            //Should intercept if any .js request.
            //Behavior may change depending the ES5 transpilation option.
            //TODO: Allow ES5 transpilation option. Actually we just transpile _content (RCL) .js files detected on the fly
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

        private async Task<FileContentReference> ES5Convert(RequestFileMetadata source)
        {
            FileContentReference _fileContent = null;

            try
            {
                //Transpile code to ES5 for IE11
                source.ES5Content = BlazorPolyfillMiddlewareExtensions.Transform(source.SourceContent, Path.GetFileName(source.SourcePath), "{\"plugins\":[\"proposal-class-properties\",\"proposal-object-rest-spread\"],\"presets\":[[\"env\",{\"targets\":{\"browsers\":[\"ie 11\",\"Chrome 78\"]}}], \"es2015\",\"es2016\",\"es2017\",\"stage-3\"], \"sourceType\": \"script\"}");

                //Minify with AjaxMin (we don't want an additional external tool with NPM or else for managing this
                //kind of thing here...
                source.ES5Content = Uglify.Js(source.ES5Content).Code;

                DateTime buildTime = BlazorPolyfillMiddlewareExtensions.GetBlazorPolyfillServerBuildDate();

                //Computing ETag. Should be computed last !
                string Etag = EtagGenerator.GenerateEtagFromString(source.ES5Content);

                _fileContent = new FileContentReference()
                {
                    Value = source.ES5Content,
                    ETag = Etag,
                    LastModified = buildTime,
                    ContentLength = System.Text.UTF8Encoding.UTF8.GetByteCount(source.ES5Content).ToString(CultureInfo.InvariantCulture)
                };

                source.ConversionSucceed = true;
            }
            catch (Exception ex)
            {
                //TODO: Need to add a file logger ?
                Console.WriteLine($"ERROR: On path '{source.SourcePath}': {ex.Message}");
            }

            return _fileContent;
        }

        private async Task ManageES5Conversion(HttpContext context)
        {
            //TODO: No need to wait for StaticFile to fill the content when we will check and have the cached file version somewhere
            //TODO: Need MD5 checksum signature in transformed files from original file

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

                //TODO: Need to add succeed value in cache
                //TODO: Need to merge FileContentReference values and RequestFileMetadata models ?
                var response = await ExtractResponseAsync(context.Request, context.Response);

                //Convert to ES5 the current response
                var fileContent = await ES5Convert(response);

                if (fileContent == null)
                {
                    //If the converter is unable to convert, we must assume to return the original file value
                    DateTime buildTime = BlazorPolyfillMiddlewareExtensions.GetBlazorPolyfillServerBuildDate();
                    fileContent = new FileContentReference()
                    {
                        Value = response.SourceContent,
                        ETag = EtagGenerator.GenerateEtagFromString(response.SourceContent),
                        LastModified = buildTime,
                        ContentLength = System.Text.UTF8Encoding.UTF8.GetByteCount(response.SourceContent).ToString(CultureInfo.InvariantCulture)
                    };
                }

                //As we have the result, we must restore the original stream for the request
                //As we will provide the data to return here
                context.Response.Body = originalResponseStream;

                //Manage request specificity
                await HttpRequestManager.ManageRequest(context, fileContent);
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
                SourceCheckSum = CryptographyHelper.CreateMD5(responseBody)
            };
        }
    }
}
