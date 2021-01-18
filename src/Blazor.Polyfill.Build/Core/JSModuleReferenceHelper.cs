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
        public string WebpackFullPath { get; set; }

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
                fileRef.WebpackFullPath = js;

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
                    sbImport.AppendLine($"import * as {importRef.JSImportAbsolutePathComputedVariableName} from '{HttpUtility.JavaScriptStringEncode(importRef.WebpackFullPath)}';");
                    sbExport.AppendLine($"    window._es5Export['{HttpUtility.JavaScriptStringEncode(importRef.JSImportAbsolutePathComputedVariableName)}'] = {importRef.JSImportAbsolutePathComputedVariableName};");
                }

                js = js.Replace("/*_IMPORT_ZONE_*/", sbImport.ToString());
                js = js.Replace("/*_EXPORT_ZONE_*/", sbExport.ToString());
            }

            return js;
        }

        private static string GetMSBuildPackageWorkingDir()
        {
            return Path.GetDirectoryName(typeof(JSModuleReferenceHelper).Assembly.Location);
        }

        private const string SuccessInstallFile = "node_modules_installed.tmp";

        private static bool InstallRequiredNPMPackages()
        {
            string workingDir = GetMSBuildPackageWorkingDir();

            if (File.Exists(Path.Combine(workingDir, SuccessInstallFile)))
            {
                //Nothing to do if we have already flagged that node module is installed in Nuget package cache
                return true;
            }

            string[] npmPackages =
            {
                "babel-core@6.24.1",
                "babel-loader@7.1.5",
                "babel-preset-env@1.7.0",
                "babel-preset-es2015@6.24.1",
                "webpack@3.8.1"
            };

            string nullOutput = " > NUL";

            ProcessStartInfo info = new ProcessStartInfo();
            info.WorkingDirectory = workingDir;
            info.FileName = "cmd";
            info.Arguments = $"/C \"npm install -D {string.Join(" ", npmPackages.Select(p => $"\"\"{p}\"\""))} {nullOutput}\"";

            Process process = null;
            try
            {
                Console.WriteLine("BlazorPolyfill.Build: Installing required NPM packages for build mecanism. This should be done only once.");
                process = Process.Start(info);
                bool exited = process.WaitForExit(60000);

                if (exited && process.ExitCode == 0)
                {
                    Console.WriteLine("BlazorPolyfill.Build: NPM packages successfully installed.");
                    File.WriteAllText(Path.Combine(workingDir, SuccessInstallFile), "");
                    return true;
                }

                if (!exited)
                {
                    process.Kill();
                }
            }
            catch (Exception)
            {
                if (process != null && !process.HasExited)
                {
                    try
                    {
                        process.Kill();
                    }
                    catch (Exception)
                    {
                    }
                }
            }

            Console.WriteLine("BlazorPolyfill.Build: Unable to install required NPM packages. This build target will be ignored.");
            return false;
        }

        private static bool FindNPM()
        {
            string nullOutput = " > NUL";

            string workingDir = GetMSBuildPackageWorkingDir();
            ProcessStartInfo info = new ProcessStartInfo();
            info.WorkingDirectory = workingDir;
            info.FileName = "cmd";
            info.Arguments = $"/C \"npm -v {nullOutput}\"";

            Process process = null;
            try
            {
                process = Process.Start(info);
                bool exited = process.WaitForExit(5000);

                if (!exited)
                {
                    process.Kill();
                    return false;
                }

                if (process.ExitCode == 0)
                {
                    return true;
                }
            }
            catch (Exception)
            {
                if (process != null && !process.HasExited)
                {
                    try
                    {
                        process.Kill();
                    }
                    catch (Exception)
                    {
                    }
                }
            }

            return false;
        }

        /// <summary>
        /// Return null if installed .bin folder not found
        /// </summary>
        /// <returns></returns>
        private static string GetNPMBinFolder()
        {
            string workingDir = GetMSBuildPackageWorkingDir();

            string installFile = Path.Combine(workingDir, SuccessInstallFile);

            if (!File.Exists(installFile))
            {
                return null;
            }

            string installFileContent = File.ReadAllText(installFile).Trim().Trim('\n').Trim('\r');
            if (string.IsNullOrEmpty(installFileContent))
            {
                installFileContent = null;

                ProcessStartInfo info = new ProcessStartInfo();
                info.WorkingDirectory = workingDir;
                info.FileName = "cmd";
                info.Arguments = $"/C \"npm bin > {SuccessInstallFile}\"";

                Process process = null;
                try
                {
                    process = Process.Start(info);
                    bool exited = process.WaitForExit(5000);

                    if (!exited)
                    {
                        process.Kill();
                        return null;
                    }

                    if (process.ExitCode == 0)
                    {
                        installFileContent = File.ReadLines(installFile)
                            ?.FirstOrDefault()
                            ?.Trim()
                            ?.Trim('\n') //Should not be possible btw
                            ?.Trim('\r'); //Should not be possible btw
                    }
                }
                catch (Exception)
                {
                    if (process != null && !process.HasExited)
                    {
                        try
                        {
                            process.Kill();
                        }
                        catch (Exception)
                        {
                        }
                    }
                }
            }

            return installFileContent;
        }

        public static string GetWebpackExecutable()
        {
            string binFolder = GetNPMBinFolder();
            string webpackFile = null;

            if (string.IsNullOrEmpty(binFolder) || !File.Exists(webpackFile = Path.Combine(binFolder, "webpack")))
            {
                Console.WriteLine("BlazorPolyfill.Build: Unable to find Webpack in environment. This build target will be ignored");
                return null;
            }

            return webpackFile;
        }

        private const string WebpackConfigFileName = "webpack.config.js";
        private const string ES5EntryFileName = "es5module_entry.js";
        private const string ES5ModuleFileName = "es5module.js";
        private const string ES5ModuleMinFileName = "es5module.min.js";

        private static string GetWebpackConfigFileContent()
        {
            //This project assembly object
            var assembly = typeof(JSModuleReferenceHelper).Assembly;

            var resources = assembly.GetManifestResourceNames();

            //Fetching the js template file
            var resourceName = resources.Single(str => str.EndsWith(WebpackConfigFileName));

            using (Stream stream = assembly.GetManifestResourceStream(resourceName))
            using (StreamReader reader = new StreamReader(stream))
            {
                return reader.ReadToEnd();
            }
        }

        private static bool WebpackBuild(string webpackBin, string intermediatePath)
        {
            string workingDir = GetMSBuildPackageWorkingDir();
            string nodeModulePath = Path.Combine(workingDir, "node_modules");

            intermediatePath = $"\"\"{intermediatePath}\"\"";
            string presetEnvPath = $"\"\"{Path.Combine(nodeModulePath, "babel-preset-env")}\"\"";
            string preset2015Path = $"\"\"{Path.Combine(nodeModulePath, "babel-preset-es2015")}\"\"";

            //Escaping path for cmd
            webpackBin = "\"\"" + webpackBin + "\"\"";

            ProcessStartInfo info = new ProcessStartInfo();
            info.WorkingDirectory = workingDir;
            info.FileName = "cmd";
            info.Arguments = $"/C \"{webpackBin} --env.intermediatePath={intermediatePath} --env.presetEnvPath={presetEnvPath} --env.preset2015Path={preset2015Path} --config webpack.config.js --display none\"";

            Process process = null;
            try
            {
                process = Process.Start(info);
                bool exited = process.WaitForExit(60000);

                if (!exited)
                {
                    process.Kill();
                    return false;
                }

                if (process.ExitCode == 0)
                {
                    return true;
                }
            }
            catch (Exception)
            {
                if (process != null && !process.HasExited)
                {
                    try
                    {
                        process.Kill();
                    }
                    catch (Exception)
                    {
                    }
                }
            }

            return false;
        }

        public static void GenerateES5EntryForWebpack(string inputDir, string intermediateDir)
        {
            if (!FindNPM())
            {
                Console.WriteLine("BlazorPolyfill.Build: Unable to find NPM in environment. This build target will be ignored");
                return;
            }

            if (!InstallRequiredNPMPackages())
            {
                return;
            }

            string webpackBin = GetWebpackExecutable();
            if (string.IsNullOrEmpty(webpackBin))
            {
                return;
            }
            
            //At this step, environment seems OK.
            //We should copy the webpack.config.js template directly in the intermediate path of the user
            //and copy our generated es5module_entry.js file.

            //Then when build is finished, we must copy the 2 output files to the wwwroot of the user

            inputDir = PathHelper.MSBuildQuoteFixer(inputDir);
            intermediateDir = PathHelper.GetIntermediateOutputPath(inputDir, PathHelper.MSBuildQuoteFixer(intermediateDir));

            string blazorPolyfillIntermediatePath = Path.Combine(intermediateDir, "BlazorPolyfillBuild");

            if (!Directory.Exists(blazorPolyfillIntermediatePath))
            {
                Directory.CreateDirectory(blazorPolyfillIntermediatePath);
            }

            string workingDir = GetMSBuildPackageWorkingDir();

            string webpackConfigPath = Path.Combine(workingDir, WebpackConfigFileName);

            if (!File.Exists(webpackConfigPath))
            {
                //We must copy our webpack.config.js file in the nuget package folder if it does not already exist
                File.WriteAllText(webpackConfigPath, GetWebpackConfigFileContent());
            }

            //Here we fetch the required modules to generate
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

            string outputFile = Path.Combine(blazorPolyfillIntermediatePath, ES5EntryFileName);

            File.WriteAllText(outputFile, jsResult);

            //The es5module_entry.js and webpack.config.js now exist in current intermediate path.
            //We should call webpack and copy the result to the wwwroot folder

            if (!WebpackBuild(webpackBin, blazorPolyfillIntermediatePath))
            {
                Console.WriteLine($"BlazorPolyfill.Build: Webpack build failed.");
                return;
            }

            string genModuleFile = Path.Combine(blazorPolyfillIntermediatePath, ES5ModuleFileName);
            string genModuleMinFile = Path.Combine(blazorPolyfillIntermediatePath, ES5ModuleMinFileName);

            if (File.Exists(genModuleFile))
            {
                File.Copy(genModuleFile, Path.Combine(wwwFolder, ES5ModuleFileName), true);
            }

            if (File.Exists(genModuleMinFile))
            {
                File.Copy(genModuleMinFile, Path.Combine(wwwFolder, ES5ModuleMinFileName), true);
            }

            Console.WriteLine($"BlazorPolyfill.Build: {ES5ModuleFileName} written in \"{wwwFolder}\"");
        }
    }
}
