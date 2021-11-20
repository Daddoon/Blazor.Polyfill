using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blazor.Polyfill.Server.Model
{
    internal class RequestFileCacheMetadata
    {
        public string Path { get; set; }

        public string ES5Path { get; set; }

        public string SourceETag { get; set; }

        public string ETag { get; set; }

        public string ContentLength { get; set; }

    }
}
