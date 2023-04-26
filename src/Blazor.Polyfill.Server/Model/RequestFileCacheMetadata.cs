using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blazor.Polyfill.Server.Model
{
    internal enum RequestFileCacheType
    {
        ES5Cache = 0,
        FailureCache = 1
    }

    internal class RequestFileCacheMetadata
    {
        public RequestFileCacheMetadata(RequestFileCacheType cacheType)
        {
            CacheType = cacheType;
        }

        public string Path { get; set; }

        public string ES5Path { get; set; }

        public string SourceETag { get; set; }

        public string ETag { get; set; }

        /// <summary>
        /// WARNING: DO NOT USE THIS PROPERTY IF CacheType IS FAILURE CACHE
        /// AS THE VALUE WILL BE SET TO 0.
        /// </summary>
        public string ContentLength { get; set; }

        public RequestFileCacheType CacheType { get; set; }

    }
}
