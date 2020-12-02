using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using System;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Net.Http.Headers;
using System.IO;
using System.Reflection;
using System.Linq;
using Microsoft.AspNetCore.Components.Server;
using React;
using React.AspNet;
using JavaScriptEngineSwitcher.Extensions.MsDependencyInjection;
using JavaScriptEngineSwitcher.V8;
using React.Exceptions;
using System.Text.RegularExpressions;
using NUglify;

namespace Blazor.Polyfill.Server
{
    public static class BlazorPolyfillMiddlewareExtensions
    {
        public static IServiceCollection AddBlazorPolyfill(
            this IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddReact();

            services.AddJsEngineSwitcher(options => options.DefaultEngineName = V8JsEngine.EngineName)
                .AddV8();

            return services;
        }

        private static void InitReact(IApplicationBuilder builder)
        {
            // Initialise ReactJS.NET. Must be before static files.
            builder.UseReact(config =>
            {
            });

        }

        public static IApplicationBuilder UseBlazorPolyfill(
            this IApplicationBuilder builder)
        {
            if (builder is null)
            {
                throw new ArgumentNullException(nameof(builder));
            }

            InitReact(builder);

            builder.MapWhen(ctx =>
            ctx.Request.IsInternetExplorer()
            && ctx.Request.Path.StartsWithSegments("/_framework")
            && ctx.Request.Path.StartsWithSegments("/_framework/blazor.server.js"),
            subBuilder =>
            {
                subBuilder.Run(async (context) =>
                {
                    var fileContent = GetPatchedBlazorServerFile();

                    context.Response.ContentType = "application/javascript";
                    context.Response.Headers.Append(HeaderNames.CacheControl, "no-cache");
                    await context.Response.WriteAsync(fileContent.Value);
                });
            });

            return builder;
        }

        public static string Transform(string input, string filename, string babelrcJSON)
        {
            string str;
            try
            {
                object[] args = new object[] { input, babelrcJSON, filename };

                var env = React.AssemblyRegistration.Container.Resolve<IReactEnvironment>();
                str = env.ExecuteWithBabel<string>("ReactNET_transform", args);
            }
            catch (Exception exception)
            {
                throw new BabelException(exception.Message, exception);
            }

            return str;
        }

        private static FileContentReference _patchedBlazorServerFile = null;

        private static FileContentReference GetPatchedBlazorServerFile()
        {
            if (_patchedBlazorServerFile == null)
            {
                var assembly = GetAspNetCoreComponentsServerAssembly();

                var resources = assembly.GetManifestResourceNames();
                var resourceName = resources.Single(str => str.EndsWith("blazor.server.js"));

                using (Stream stream = assembly.GetManifestResourceStream(resourceName))
                using (StreamReader reader = new StreamReader(stream))
                {
                    string js = reader.ReadToEnd();

                    //Patch Descriptor Regex as it make Babel crash during transform
                    js = js.Replace("/\\W*Blazor:[^{]*(?<descriptor>.*)$/;", @"/[\0-\/:-@\[-\^`\{-\uFFFF]*Blazor:(?:(?!\{)[\s\S])*(.*)$/;");

                    //Transpile code to ES5 for IE11 before manual patching
                    js = Transform(js, "blazor.server.js", "{\"plugins\":[\"proposal-class-properties\",\"proposal-object-rest-spread\"],\"presets\":[[\"env\",{\"targets\":{\"browsers\":[\"ie 11\"]}}], \"es2015\",\"es2016\",\"es2017\",\"stage-3\"]}");

                    //At this point, Babel has unminified the code, and fixed IE11 issues, like 'import' method calls.
                    //We still need to fix 'descriptor' regex evaluation code, as it was expecting a named capture group.
                    js = Regex.Replace(js, "([a-zA-Z]+)(.groups[ ]*&&[ ]*[a-zA-Z]+.groups.descriptor)", "$1[1]");

                    //Minify with AjaxMin (we don't want an additional external tool with NPM or else for managing this
                    //kind of thing here...
                    js = Uglify.Js(js).Code;

                    _patchedBlazorServerFile = new FileContentReference()
                    {
                        Value = js
                    };
                }
            }

            return _patchedBlazorServerFile;
        }

        /// <summary>
        /// This class is intentionally a kind of placeholder in order to avoid "value" copy of the file stored
        /// with the string class. We want a kind of "ref" behavior, with the value copied/written only 
        /// </summary>
        internal class FileContentReference
        {
            public string Value { get; set; }
        }

        private static Assembly _serverAssembly = null;

        private static Assembly GetAspNetCoreComponentsServerAssembly()
        {
            if (_serverAssembly == null)
            {
                //Getting Assembly reference through a currently loaded class type issued
                //from the Microsoft.AspNetCore.Components.Server assembly.
                _serverAssembly = Assembly.GetAssembly(typeof(ServerAuthenticationStateProvider));

                //Should not happen, but if we are unable to retrieve the assembly from the type, trying to load
                //it from in the current domain
                if (_serverAssembly == null)
                {
                    _serverAssembly = Assembly.Load("Microsoft.AspNetCore.Components.Server");
                }
            }

            return _serverAssembly;
        }
    }
}
