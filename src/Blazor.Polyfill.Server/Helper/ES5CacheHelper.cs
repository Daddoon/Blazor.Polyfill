using Blazor.Polyfill.Server.Model;
using Microsoft.Extensions.FileProviders;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blazor.Polyfill.Server.Helper
{
    internal static class ES5CacheHelper
    {
        private const string ES5CacheFolderName = "es5cache";

        private static string _computedCacheFolder = null;

        /// <summary>
        /// Return the ES5 Cache Store folder
        /// </summary>
        /// <returns></returns>
        public static string GetES5CacheStoreFolder()
        {
            if (!string.IsNullOrEmpty(_computedCacheFolder))
            {
                return _computedCacheFolder;
            }

            //The assembly that is the process executable in the default application domain, or the first executable that was executed by ExecuteAssembly(String). Can return null when called from unmanaged code.
            //The GetEntryAssembly method can return null when a managed assembly has been loaded from an unmanaged application. For example, if an unmanaged application creates an instance of a COM component written in C#, a call to the GetEntryAssembly method from the C# component returns null, because the entry point for the process was unmanaged code rather than a managed assembly.
            //Assembly.GetEntryAssembly Method https://docs.microsoft.com/en-us/dotnet/api/system.reflection.assembly.getentryassembly
            //Assembly.GetExecutingAssembly Method https://docs.microsoft.com/en-us/dotnet/api/system.reflection.assembly.getexecutingassembly

            string basePath = System.Reflection.Assembly.GetEntryAssembly()?.Location ?? System.Reflection.Assembly.GetExecutingAssembly()?.Location;

            if (string.IsNullOrEmpty(basePath))
            {
                throw new InvalidOperationException("BlazorPolyfill: Unable to retrieve the ES5 Cache Store folder. Both Assembly.GetEntryAssembly or Assembly.GetExecutingAssembly() returned null, but are needed for computing the current cache store");
            }
            
            //Remove the dll entry point, just keeping the directory
            basePath = Path.GetDirectoryName(basePath);

            _computedCacheFolder = Path.Combine(basePath, ES5CacheFolderName);
            if (!Directory.Exists(_computedCacheFolder))
            {
                Directory.CreateDirectory(_computedCacheFolder);
            }

            return _computedCacheFolder;
        }

        /// <summary>
        /// The internal ES5 cached files dictionnary in memory.
        /// </summary>
        private static Dictionary<string, RequestFileCacheMetadata> _cachedFiles = new Dictionary<string, RequestFileCacheMetadata>();

        /// <summary>
        /// This return a ES5 file cached by his path.
        /// As we cannot detect if a file is in cache just by path,
        /// this method will only return something on subsequent call
        /// when the file with it's path and checksum will be provided
        /// in order to know if a real cached version exist of it a new
        /// file creation is needed, then added to this cache entry.
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        /// <exception cref="NullReferenceException"></exception>
        public static bool HasES5FileInCacheByPath(string path)
        {
            if (string.IsNullOrEmpty(path))
            {
                throw new NullReferenceException(nameof(path));
            }

            if (_cachedFiles.ContainsKey(path))
            {
                return true;
            }

            return false;
        }

        private const string ES5CacheFileExtension = ".cache";

        /// <summary>
        /// Actually the source ETag with an alternate ending
        /// </summary>
        /// <returns></returns>
        private static string GetETagForES5File(string sourceChecksum)
        {
            return sourceChecksum + "1";
        }

        private static RequestFileCacheMetadata AddFileCacheEntry(string requestPath, string es5FilePath, string sourceChecksum)
        {
            RequestFileCacheMetadata rfc = new RequestFileCacheMetadata();
            rfc.Path = requestPath;
            rfc.ES5Path = es5FilePath;
            rfc.SourceETag = sourceChecksum;
            rfc.ETag = GetETagForES5File(sourceChecksum);
            rfc.ContentLength = new FileInfo(es5FilePath).Length.ToString();

            if (!_cachedFiles.ContainsKey(requestPath))
            {
                _cachedFiles.Add(requestPath, rfc);
            }
            else
            {
                _cachedFiles[requestPath] = rfc;
            }

            return rfc;
        }

        public static bool HasES5FileInCacheWithChecksum(string path, string checksum)
        {
            if (HasES5FileInCacheByPath(path))
            {
                return true;
            }

            string es5FilePath = Path.Combine(GetES5CacheStoreFolder(), $"{checksum}{ES5CacheFileExtension}");
            if (File.Exists(es5FilePath))
            {
                AddFileCacheEntry(path, es5FilePath, checksum);
                return true;
            }

            return false;
        }

        /// <summary>
        /// Please call <see cref="HasES5FileInCacheByPath"/> and <see cref="HasES5FileInCacheWithChecksum"/> before calling this method, as
        /// theses method may populate the cache the first time.
        /// </summary>
        /// <param name="path"></param>
        /// <returns></returns>
        public static RequestFileCacheMetadata GetES5FileFromCache(string path)
        {
            if (_cachedFiles.ContainsKey(path))
            {
                return _cachedFiles[path];
            }

            return null;
        }

        public static RequestFileCacheMetadata SetES5FileInCache(RequestFileMetadata file)
        {
            if (file == null)
            {
                throw new NullReferenceException(nameof(file));
            }

            string es5FilePath = Path.Combine(GetES5CacheStoreFolder(), $"{file.SourceCheckSum}{ES5CacheFileExtension}");

            //Should behave as an overwrite behavior if applicable
            File.WriteAllText(es5FilePath, file.ES5Content);
            return AddFileCacheEntry(file.SourcePath, es5FilePath, file.SourceCheckSum);
        }
    }
}
