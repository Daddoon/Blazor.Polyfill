using Blazor.Polyfill.Build.Cli.Helper;
using Microsoft.CodeAnalysis;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace Blazor.Polyfill.Build.Core
{
    internal class JSFileRefs
    {
        public string WebpackRelativePath { get; set; }

        public string JSImportAbsolutePathComputedVariableName { get; set; }
    }

    internal static class JSModuleReferenceHelper
    {
        private static List<JSFileRefs> ComputeFileRefs(List<string> jsFiles)
        {
            List<JSFileRefs> fileRefList = new List<JSFileRefs>();

            string wwwroot = "wwwroot";

            foreach (string js in jsFiles)
            {
                JSFileRefs fileRef = new JSFileRefs();
                string absoluteImportPath = js
                    .Substring(js.LastIndexOf(wwwroot) + wwwroot.Length)
                    .Replace("\\", "/");

                fileRef.JSImportAbsolutePathComputedVariableName = absoluteImportPath
                    .Replace("/", "_")
                    .Replace(".", "_");
                fileRef.WebpackRelativePath = "." + absoluteImportPath;

                fileRefList.Add(fileRef);
            }

            return fileRefList;
        }

        private static string BuildES5EntryFile(List<JSFileRefs> jsFilesRef)
        {
            string js = string.Empty;

            //This project assembly object
            var assembly = typeof(JSModuleReferenceHelper).Assembly;

            var resources = assembly.GetManifestResourceNames();

            //Fetching the js template file
            var resourceName = resources.Single(str => str.EndsWith(ES5EntryFileName));

            using (Stream stream = assembly.GetManifestResourceStream(resourceName))
            using (StreamReader reader = new StreamReader(stream))
            {
                js = reader.ReadToEnd();

                StringBuilder sbImport = new StringBuilder();
                StringBuilder sbExport = new StringBuilder();

                foreach (JSFileRefs importRef in jsFilesRef)
                {
                    sbImport.AppendLine($"import * as {importRef.JSImportAbsolutePathComputedVariableName} from '{HttpUtility.JavaScriptStringEncode(importRef.WebpackRelativePath)}';");
                    sbExport.AppendLine($"    window._es5Export['{HttpUtility.JavaScriptStringEncode(importRef.JSImportAbsolutePathComputedVariableName)}'] = {importRef.JSImportAbsolutePathComputedVariableName};");
                }

                js = js.Replace("/*_IMPORT_ZONE_*/", sbImport.ToString());
                js = js.Replace("/*_EXPORT_ZONE_*/", sbExport.ToString());
            }

            return js;
        }

        public static void GenerateES5EntryForWebpack(string inputDir)
        {
            inputDir = PathHelper.MSBuildQuoteFixer(inputDir);

            string wwwFolder = inputDir + "/wwwroot";
            string modulesFolder = wwwFolder + "/js/modules";

            if (!Directory.Exists(modulesFolder))
            {
                //If the modules folder does not exist, this is not valid, but we shouldn't go into exception.
                //Doing nothing instead.
                return;
            }

            List<string> jsFiles = System.IO.Directory.GetFiles(modulesFolder, "*.js").ToList();

            var jsFileRefs = ComputeFileRefs(jsFiles);
            string jsResult = BuildES5EntryFile(jsFileRefs);

            string outputFile = wwwFolder + Path.DirectorySeparatorChar + ES5EntryFileName;

            File.WriteAllText(outputFile, jsResult);

            Console.WriteLine($"Blazor.Polyfill.Build -> {ES5EntryFileName} written in \"{Path.GetDirectoryName(outputFile)}\"");
        }

        private const string ES5EntryFileName = "es5module_entry.js";
    }
}
