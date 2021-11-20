using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blazor.Polyfill.Server.Model
{
    internal class RequestFileMetadata
    {
        public string SourcePath { get; set; }

        public string SourceContent { get; set; }
        
        /// <summary>
        /// The file Checksum hashed with SHA256
        /// </summary>
        public string SourceCheckSum { get; set; }

        public string ES5Content { get; set; }
    }
}
