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
        /// <summary>
        /// Warning: onBodyWriteReady ready will only be called when the result of the method is a 200 (Statut OK)
        /// </summary>
        /// <param name="context"></param>
        /// <param name="contentType"></param>
        /// <param name="ETag"></param>
        /// <param name="ContentLength"></param>
        /// <param name="onBodyWriteReady"></param>
        /// <returns></returns>
        private static async Task ManageRequestHeaders(HttpContext context, string contentType, string ETag, string ContentLength, Func<Task> onBodyWriteReady)
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
            //Removing LastModified header
            if (context.Response.Headers.ContainsKey(HeaderNames.LastModified))
            {
                context.Response.Headers.Remove(HeaderNames.LastModified);
            }

            if (!context.Response.Headers.ContainsKey(HeaderNames.ETag))
            {
                context.Response.Headers.Append(HeaderNames.ETag, ETag);
            }
            else
            {
                context.Response.Headers[HeaderNames.ETag] = ETag;
            }

            //In this case we should return the entire response
            if (RequestHasTheNoCacheHeaderSet(context.Request)
            || RequestHasNoCachingFeatureSet(context.Request)
            || RequestHasCacheFeaturesExpired(context.Request, ETag))
            {
                if (ContentLength != null)
                {
                    if (!context.Response.Headers.ContainsKey(HeaderNames.ContentLength))
                    {
                        context.Response.Headers.Append(HeaderNames.ContentLength, ContentLength);
                    }
                    else
                    {
                        context.Response.Headers[HeaderNames.ContentLength] = ContentLength;
                    }
                }

                context.Response.StatusCode = (int)HttpStatusCode.OK;

                //onBodyWriteReady should only be called if the statut is OK, at least for the moment.
                if (onBodyWriteReady != null)
                {
                    await onBodyWriteReady();
                }
            }
            else
            {
                context.Response.StatusCode = (int)HttpStatusCode.NotModified;
            }
        }

        internal static async Task ManageRequest(HttpContext context, FileContentReference fileContent, string contentType = "application/javascript")
        {
            await ManageRequestHeaders(context, contentType, fileContent.ETag, fileContent.ContentLength, async () =>
            {
                await context.Response.WriteAsync(fileContent.Value);
            });
        }

        internal static async Task ManageRequest(HttpContext context, string filePath, string ETag, string ContentLength, string contentType = "application/javascript")
        {
            await ManageRequestHeaders(context, contentType, ETag, ContentLength, async () =>
            {
                await context.Response.SendFileAsync(filePath);
            });
        }

        /// <summary>
        /// Should only alter headers.
        /// Default current body state should be returned
        /// </summary>
        /// <param name="context"></param>
        /// <param name="ETag"></param>
        /// <param name="ContentLength"></param>
        /// <param name="Content">SHOULD ONLY BE SET WHEN NOT HAVING THE REQUEST BODY PREFILLED AFTER A FIRST FALLBACK REQUEST FAILURE</param>
        /// <param name="contentType"></param>
        /// <returns></returns>
        internal static async Task ManageFallbackRequest(HttpContext context, string ETag, string ContentLength, string Content = null, string contentType = "application/javascript")
        {
            await ManageRequestHeaders(context, contentType, ETag, ContentLength, async () =>
            {
                if (Content != null)
                {
                    await context.Response.WriteAsync(Content);
                }
            });
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

        private static bool RequestHasCacheFeaturesExpired(HttpRequest request, string ETag)
        {
            string IfNoneMatch = null;

            if (request.Headers.ContainsKey(HeaderNames.IfNoneMatch))
            {
                IfNoneMatch = request.Headers[HeaderNames.IfNoneMatch].ToString();

                if (ETag == IfNoneMatch)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }

            return true;
        }
    }
}
