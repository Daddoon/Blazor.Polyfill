using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Blazor.Polyfill.Build.Cli.Helper
{
    public static class PathHelper
    {
        private static string ReplaceLastOccurrence(string Source, string Find, string Replace)
        {
            int place = Source.LastIndexOf(Find);

            if (place == -1)
                return Source;

            string result = Source.Remove(place, Find.Length).Insert(place, Replace);
            return result;
        }

        /// <summary>
        /// CMD and MSBuild seems to escape quote sometime instead
        /// of escaping the path delimiter, even if using MSBuild::Escape
        /// function. This method replace and ending quote by a path
        /// delimiter instead, for fixing this possible behavior
        /// </summary>
        /// <returns></returns>
        public static string MSBuildQuoteFixer(string input)
        {
            if (input.EndsWith('"'))
            {
                input = ReplaceLastOccurrence(input, "\"", Path.DirectorySeparatorChar.ToString());
            }

            return input;
        }

        public static string GetIntermediateOutputPath(string rootPath, string baseIntermediateOutputPath)
        {
            string trimedPath = baseIntermediateOutputPath.TrimStart('\\');

            if (Path.IsPathRooted(trimedPath))
            {
                //Absolute path case
                return baseIntermediateOutputPath;
            }
            else
            {
                //Relative path case (the default one)
                return Path.Combine(rootPath, baseIntermediateOutputPath);
            }
        }

    }
}
