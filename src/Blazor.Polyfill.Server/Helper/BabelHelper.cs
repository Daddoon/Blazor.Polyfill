using React;
using React.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blazor.Polyfill.Server.Helper
{
    internal static class BabelHelper
    {
        /// <summary>
        /// The babelrc.json config equivalence used internally
        /// </summary>
        private const string BabelrcJSON = "{\"plugins\":[\"proposal-class-properties\",\"proposal-object-rest-spread\"],\"presets\":[[\"env\",{\"targets\":{\"browsers\":[\"ie 11\",\"Chrome 78\"]}}], \"es2015\",\"es2016\",\"es2017\",\"stage-3\"], \"sourceType\": \"script\"}";

        /// <summary>
        /// Transform the current JS input to an ES5 compliant JS code thanks to Babel through ReactNET.
        /// </summary>
        /// <param name="input">Javascript code</param>
        /// <param name="filename">A filename to specify to Babel. Not sure if used</param>
        /// <returns></returns>
        /// <exception cref="BabelException"></exception>
        public static string Transform(string input, string filename)
        {
            string str;
            try
            {
                LogHelper.LogWarning($"Babel is now transpiling the file '{filename}' to a ECMAScript5 version. Depending the file complexity and size, this conversion can take some time. This operation should be done only once in your application lifetime. Cache will be regenerated only if the source file has changed in the future.");
                object[] args = new object[] { input, BabelrcJSON, filename };

                var env = React.AssemblyRegistration.Container.Resolve<IReactEnvironment>();
                str = env.ExecuteWithBabel<string>("ReactNET_transform", args);
                LogHelper.LogWarning($"Babel transpilation of file '{filename}' finished successfully");
            }
            catch (Exception exception)
            {
                LogHelper.LogError(exception, $"An error occured during Babel transpilation of file '{filename}'");
                throw new BabelException(exception.Message, exception);
            }

            return str;
        }
    }
}
