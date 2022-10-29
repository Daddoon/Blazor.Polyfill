using Blazor.Polyfill.Server.Middleware;
using Blazor.Polyfill.Server.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Blazor.Polyfill.Server.Helper
{
    internal static class ES5CacheHelper
    {
        internal const string ES5CacheFolderName = "es5cache";

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

            string basePath = ECMAScript5Middleware.GetWebHostEnvironment().WebRootPath;

            if (string.IsNullOrEmpty(basePath))
            {
                throw new InvalidOperationException($"BlazorPolyfill: Unable to retrieve the ES5 Cache Store folder. {nameof(IWebHostEnvironment)}.{nameof(IWebHostEnvironment.WebRootPath)} returned null, but is needed for computing the current cache store");
            }

            _computedCacheFolder = Path.Combine(basePath, ES5CacheFolderName);
            if (!Directory.Exists(_computedCacheFolder))
            {
                Directory.CreateDirectory(_computedCacheFolder);
            }

            return _computedCacheFolder;
        }

        private static readonly Uri _httpLocalHost = new Uri("http://localhost/");

        /// <summary>
        /// Assuming inputPath is a relative path with no host or scheme info.
        /// Something like "_content//toto//tata\\totototo\\test/../titi/./file.js?tototata=5&titi=rara";
        /// will return "_content/toto/tata/totototo/titi/file.js";
        /// </summary>
        /// <param name="inputPath"></param>
        /// <returns></returns>
        private static string RationalizePath(string inputPath)
        {
            return new Uri(_httpLocalHost, inputPath).AbsolutePath.Replace("//", "/");
        }

        private static string GetES5FilePath(string path)
        {
            //Path.DirectorySeparatorChar will differ depending the platform
            return Path.Combine(
                GetES5CacheStoreFolder(),
                RationalizePath(path)
                .TrimStart('/') //We must trim start the path slash, otherwise Path.Combine will assume that we are rooting the path
                .Replace('/', Path.DirectorySeparatorChar));
        }

        /// <summary>
        /// The internal ES5 cached files dictionnary in memory.
        /// </summary>
        private static ConcurrentDictionary<string, RequestFileCacheMetadata> _cachedFiles = new ConcurrentDictionary<string, RequestFileCacheMetadata>();

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

        /// <summary>
        /// Actually the source ETag with an alternate ending
        /// </summary>
        /// <returns></returns>
        private static string GetETagForES5File(string sourceChecksum)
        {
            BlazorPolyfillOptions option = BlazorPolyfillMiddlewareExtensions.GetOptions();
            if (option.UsePackagedBlazorServerLibrary)
            {
                //The "appended" value for Etag change if we are on Packaged version or not in order to avoid some caching if we go from one mod to another
                return sourceChecksum + "2";
            }
            else
            {
                return sourceChecksum + "1";
            }
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
                //If unable to add, that mean an other thread added the file. Returning the file from the other thread
                if (!_cachedFiles.TryAdd(requestPath, rfc))
                {
                    rfc = _cachedFiles.GetOrAdd(requestPath, rfc);
                }
            }
            else
            {
                rfc = _cachedFiles.AddOrUpdate(requestPath, rfc, (requestKeyPath, existingRFC) =>
                {
                    return rfc;
                });
            }

            return rfc;
        }

        public static bool HasES5FileInCacheWithChecksum(string path, string checksum)
        {
            if (HasES5FileInCacheByPath(path))
            {
                return true;
            }

            string es5FilePath = GetES5FilePath(path);
            if (File.Exists(es5FilePath))
            {
                //If the file exist, then we must ensure that the provided checksum in the file is correct
                if (IsFileChecksumEqual(es5FilePath, checksum))
                {
                    AddFileCacheEntry(path, es5FilePath, checksum);
                    return true;
                }
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
                RequestFileCacheMetadata resultValue = null;
                _cachedFiles.TryGetValue(path, out resultValue);

                //As we don't remove data from dictionary, this should be OK. Assuring we don't have any concurrency by using the previous method
                return resultValue;
            }

            return null;
        }

        public static RequestFileCacheMetadata SetES5FileInCache(RequestFileMetadata file)
        {
            if (file == null)
            {
                throw new NullReferenceException(nameof(file));
            }

            string es5FilePath = GetES5FilePath(file.SourcePath);
            string sourceES5Path = Path.GetDirectoryName(es5FilePath);

            if (!Directory.Exists(sourceES5Path))
            {
                Directory.CreateDirectory(sourceES5Path);
            }

            //Should behave as an overwrite behavior if applicable
            WriteTextToFile(es5FilePath, file.SourceCheckSum, file.ES5Content);
            return AddFileCacheEntry(file.SourcePath, es5FilePath, file.SourceCheckSum);
        }


        private static readonly ReaderWriterLockSlim _readWriteLock = new ReaderWriterLockSlim();

        private const string ChecksumHeader = "//SHA256: {0}";

        /// <summary>
        /// Return true if the file given with <paramref name="fileSystemPathToFileWithChecksum"/> contain a Checksum header that match
        /// the <paramref name="sourceChecksum"/> checksum.
        /// <paramref name="sourceChecksum"/> parameter does not need to be formatted as a header, only the raw checksum is expected.
        /// </summary>
        /// <param name="fileSystemPathToFileWithChecksum"></param>
        /// <param name="sourceChecksum"></param>
        /// <returns></returns>
        private static bool IsFileChecksumEqual(string fileSystemPathToFileWithChecksum, string sourceChecksum)
        {
            var sourceValue = string.Format(ChecksumHeader, sourceChecksum).TrimEnd('\r').TrimEnd('\n');
            var destinationValue = "";

            // Set Status to Locked
            //Not expecting a Writing but more to prevent concurrency with WriteTextToFile method.
            //As future call when files will be asked will be already in the dictionary cache, we should not lock anymore any file during
            //check
            _readWriteLock.EnterWriteLock();
            try
            {
                using (var file = new FileStream(fileSystemPathToFileWithChecksum, FileMode.Open, FileAccess.Read, FileShare.Read))
                {
                    try
                    {
                        using (var reader = new StreamReader(file, Encoding.UTF8))
                        {
                            try
                            {
                                destinationValue = reader.ReadLine();
                            }
                            catch (Exception)
                            {
                                return false;
                            }
                        }
                    }
                    finally
                    {
                        //Should be closed by the 'using' btw
                        file.Close();
                    }
                }
            }
            catch (Exception)
            {
                return false;
            }
            finally
            {
                // Release lock
                _readWriteLock.ExitWriteLock();
            }

            if (destinationValue != null)
            {
                destinationValue = destinationValue.TrimEnd('\r').TrimEnd('\n');
            }
            else
            {
                //Not a valid header / file
                return false;
            }

            if (sourceValue.Equals(destinationValue))
            {
                return true;
            }

            return false;
        }

        private static void WriteTextToFile(string path, string sourceChecksum, string text)
        {
            // Set Status to Locked
            _readWriteLock.EnterWriteLock();
            try
            {
                // Append text to the file
                using (StreamWriter sw = File.CreateText(path))
                {
                    //First line: Checksum of the original file
                    sw.WriteLine(string.Format(ChecksumHeader, sourceChecksum));

                    //Second line: The ES5 Js code
                    sw.WriteLine(text);
                    sw.Close();
                }
            }
            finally
            {
                // Release lock
                _readWriteLock.ExitWriteLock();
            }
        }
    }
}
