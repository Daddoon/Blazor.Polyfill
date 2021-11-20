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
                object[] args = new object[] { input, BabelrcJSON, filename };

                var env = React.AssemblyRegistration.Container.Resolve<IReactEnvironment>();
                str = env.ExecuteWithBabel<string>("ReactNET_transform", args);
            }
            catch (Exception exception)
            {
                throw new BabelException(exception.Message, exception);
            }

            return str;
        }
    }
}
