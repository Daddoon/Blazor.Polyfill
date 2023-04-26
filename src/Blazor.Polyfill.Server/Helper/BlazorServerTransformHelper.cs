using Blazor.Polyfill.Server.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Blazor.Polyfill.Server.Helper
{
    internal static class BlazorServerTransformHelper
    {
        public static string GetPackagedBlazorServerLibrary()
        {
            //Get packaged blazor.server.js
            var assembly = BlazorPolyfillMiddlewareExtensions.GetBlazorPolyfillAssembly();

            var resources = assembly.GetManifestResourceNames();
            var resourceName = resources.Single(str => str.EndsWith("blazor.server.packaged.js"));

            using (Stream stream = assembly.GetManifestResourceStream(resourceName))
            {
                using (StreamReader reader = new StreamReader(stream))
                {
                    string js = reader.ReadToEnd();

                    return js;
                }
            }
        }

        /// <summary>
        /// Fixs that must be done in source JS code before calling Babel
        /// </summary>
        /// <param name="js"></param>
        /// <returns></returns>
        public static string BeforeES5Transform(string path, string js)
        {
            #region Patch Regex

            //Patch Descriptor Regex as it make Babel crash during transform
            js = js.Replace("/\\W*Blazor:[^{]*(?<descriptor>.*)$/;", @"/[\0-\/:-@\[-\^`\{-\uFFFF]*Blazor:(?:(?!\{)[\s\S])*(.*)$/;");

            //.NET 6 Pattern (Should be removed ?)
            js = js.Replace("/^\\s*Blazor-Component-State:(?<state>[a-zA-Z0-9\\+\\/=]+)$/", @"/^[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*Blazor\x2DComponent\x2DState:([\+\/-9=A-Za-z]+)$/");

            //NET 7 Pattern
            js = js.Replace("/^\\s*Blazor-Component-State:(?<state>[a-zA-Z0-9+/=]+)$/", @"/^[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*Blazor\x2DComponent\x2DState:([\+\/-9=A-Za-z]+)$/");

            js = js.Replace("/^\\s*Blazor:[^{]*(?<descriptor>.*)$/", @"/^[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*Blazor:(?:(?!\{)[\s\S])*(.*)$/");

            #endregion Patch Regex

            return js;
        }

        /// <summary>
        /// Fixs that must be done in JS code before being minified. The given es5JS variable should be the Transformed
        /// Javascript code by Babel done in <see cref="BeforeES5Transform(string)"/>
        /// </summary>
        /// <param name="es5JS"></param>
        /// <returns></returns>
        public static string BeforeMinification(string es5JS)
        {
            #region Regex named groups fix

            //At this point, Babel has unminified the code, and fixed IE11 issues, like 'import' method calls.

            //We still need to fix 'descriptor' regex evaluation code, as it was expecting a named capture group.
            es5JS = Regex.Replace(es5JS, "([_a-zA-Z0-9]+)(.groups[ ]*&&[ ]*[_a-zA-Z0-9]+.groups.descriptor)", "$1[1]");

            //We still need to fix 'state' regex evaluation code, as it was expecting a named capture group.
            es5JS = Regex.Replace(es5JS, "([_a-zA-Z0-9]+)(.groups[ ]*&&[ ]*[_a-zA-Z0-9]+.groups.state)", "$1[1]");

            //Here we fix invalids interopRequireWildcard(require(''.concat(n))) to _interopRequireWildcard(''.concat(n)) (works for '' or "")
            //Warning: " is written "" here but must be read as " from the regex logic: We are in a verbatim string
            es5JS = Regex.Replace(es5JS, @"(require\((['""]['""].concat\([a-zA-Z]+\))\))", "$2");

            #endregion Regex named groups fix

            return es5JS;
        }
    }
}
