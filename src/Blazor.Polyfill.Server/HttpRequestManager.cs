using Blazor.Polyfill.Server.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Blazor.Polyfill.Server
{
    public static class HttpRequestManager
    {
        internal static async Task ManageRequest(HttpContext context, FileContentReference fileContent, string contentType = "application/javascript")
        {
            context.Response.ContentType = contentType;
            if (!context.Response.Headers.ContainsKey(HeaderNames.CacheControl))
            {
                context.Response.Headers.Append(HeaderNames.CacheControl, "no-cache");
            }
            else
            {
                context.Response.Headers[HeaderNames.CacheControl] = "no-cache";
            }

            //We will try to only rely on ETag checksum
            //if (!context.Response.Headers.ContainsKey(HeaderNames.LastModified))
            //{
            //    context.Response.Headers.Append(HeaderNames.LastModified, fileContent.LastModified.ToString("r"));
            //}
            //else
            //{
            //    context.Response.Headers[HeaderNames.LastModified] = fileContent.LastModified.ToString("r");
            //}

            if (!context.Response.Headers.ContainsKey(HeaderNames.ETag))
            {
                context.Response.Headers.Append(HeaderNames.ETag, fileContent.ETag);
            }
            else
            {
                context.Response.Headers[HeaderNames.ETag] = fileContent.ETag;
            }

            //In this case we should return the entire response
            if (RequestHasTheNoCacheHeaderSet(context.Request)
            || RequestHasNoCachingFeatureSet(context.Request)
            || RequestHasCacheFeaturesExpired(context.Request, fileContent))
            {
                if (!context.Response.Headers.ContainsKey(HeaderNames.ContentLength))
                {
                    context.Response.Headers.Append(HeaderNames.ContentLength, fileContent.ContentLength);
                }
                else
                {
                    context.Response.Headers[HeaderNames.ContentLength] = fileContent.ContentLength;
                }

                context.Response.StatusCode = (int)HttpStatusCode.OK;
                await context.Response.WriteAsync(fileContent.Value);
            }
            else
            {
                context.Response.StatusCode = (int)HttpStatusCode.NotModified;
            }
        }

        private static bool RequestHasTheNoCacheHeaderSet(HttpRequest request)
        {
            return request.Headers.ContainsKey(HeaderNames.CacheControl)
                && request.Headers[HeaderNames.CacheControl] == "no-cache";
        }


        private static bool RequestHasNoCachingFeatureSet(HttpRequest request)
        {
            return !request.Headers.ContainsKey(HeaderNames.IfModifiedSince) && !request.Headers.ContainsKey(HeaderNames.IfNoneMatch);
        }

        private static bool RequestHasCacheFeaturesExpired(HttpRequest request, FileContentReference fileContent)
        {
            string IfModifiedSince = null;
            string IfNoneMatch = null;

            DateTime IfModifiedSinceDate = default;

            //Must be in first check, as the library may update in the future but we can't be totally aware of the modification
            //date as it's related to the Microsoft library, not this one.
            if (request.Headers.ContainsKey(HeaderNames.IfNoneMatch))
            {
                IfNoneMatch = request.Headers[HeaderNames.IfNoneMatch].ToString();

                if (fileContent.ETag == IfNoneMatch)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
            else if (request.Headers.ContainsKey(HeaderNames.IfModifiedSince))
            {
                IfModifiedSince = request.Headers[HeaderNames.IfModifiedSince].ToString();
                if (DateTime.TryParseExact(IfModifiedSince, "r", CultureInfo.InvariantCulture, DateTimeStyles.None, out IfModifiedSinceDate))
                {
                    if (IfModifiedSinceDate == fileContent.LastModified)
                    {
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                }
            }

            return true;
        }
    }
}
