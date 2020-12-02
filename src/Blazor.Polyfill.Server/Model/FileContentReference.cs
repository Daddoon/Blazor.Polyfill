using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blazor.Polyfill.Server.Model
{
    /// <summary>
    /// This class is intentionally a kind of placeholder in order to avoid "value" copy of the file stored
    /// with the string class. We want a kind of "ref" behavior, with the value copied/written only 
    /// </summary>
    internal class FileContentReference
    {
        public string Value { get; set; }

        public string ETag { get; set; }

        public string ContentLength { get; set; }

        public DateTime LastModified { get; set; }
    }
}
