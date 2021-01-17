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
using System.Globalization;
using System.Net;
using Blazor.Polyfill.Server.Model;
using JavaScriptEngineSwitcher.ChakraCore;

namespace Blazor.Polyfill.Server
{
    public static class BlazorPolyfillMiddlewareExtensions
    {
        public static IServiceCollection AddBlazorPolyfill(
            this IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddReact();

            services.AddJsEngineSwitcher(options => options.DefaultEngineName = ChakraCoreJsEngine.EngineName)
                .AddChakraCore()
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

            //Instanciate with a delegate inheriting from default values given by the extension method
            return UseBlazorPolyfill(builder, (options) => { });
        }

        public static IApplicationBuilder UseBlazorPolyfill(
            this IApplicationBuilder builder, Action<BlazorPolyfillOptions> configureOptions)
        {
            if (builder is null)
            {
                throw new ArgumentNullException(nameof(builder));
            }

            if (configureOptions is null)
            {
                throw new ArgumentNullException(nameof(configureOptions));
            }

            BlazorPolyfillOptions options = new BlazorPolyfillOptions();

            //Let the user configure the options in it's delegate method
            configureOptions(options);

            return UseBlazorPolyfill(builder, options);
        }


        public static IApplicationBuilder UseBlazorPolyfill(
            this IApplicationBuilder builder, BlazorPolyfillOptions options)
        {
            if (builder is null)
            {
                throw new ArgumentNullException(nameof(builder));
            }

            if (options is null)
            {
                throw new ArgumentNullException(nameof(options));
            }

            HttpRequestExtensions.ProvideBlazorPolyfillOptions(options);

            InitReact(builder);

            //This is a kind of hack for caching the data at boot
            //It's better to prevent anything at first request by caching instead of
            //making the user wait the file generation
            builder.Use((context, next) =>
            {
                if (!IsBlazorPolyfillLibCached())
                {
                    //Avoiding first client to await the file generation
                    CacheBlazorPolyfillLib();
                }

                //Normal behavior
                return next();
            });

            //BrowserNeedES5Fallback is written hiere and not in the builder
            //because we only want to use MapWhen when we need ES5 fallback.
            //If this is false, the request will be redirected to the Microsoft
            //default request management for this file.
            builder.MapWhen(ctx =>
            ctx.Request.Path.StartsWithSegments("/_framework")
            && ctx.Request.Path.StartsWithSegments("/_framework/blazor.server.js")
            && ctx.Request.BrowserNeedES5Fallback(),
            subBuilder =>
            {
                subBuilder.Run(async (context) =>
                {
                    var fileContent = GetPatchedBlazorServerFile();
                    await HttpRequestManager.ManageRequest(context, fileContent);
                });
            });

            //As blazor.polyfill.js files does not exist really on theses path and
            //does not have a real fallback request mangement (as for blazor.server.js)
            //we should intercept them at any time with MapWhen, but change the result
            //behavior lately in the builder. Otherwise this would return a 404 error.
            builder.MapWhen(ctx =>
            ctx.Request.Path.StartsWithSegments("/_framework")
            && (
                ctx.Request.Path.StartsWithSegments("/_framework/blazor.polyfill.js")
                || ctx.Request.Path.StartsWithSegments("/_framework/blazor.polyfill.min.js")
            ),
            subBuilder =>
            {
                subBuilder.Run(async (context) =>
                {
                    //Eval if the requested file is the minified version or not
                    bool isMinified = context.Request.Path.StartsWithSegments("/_framework/blazor.polyfill.min.js");

                    var fileContent = GetBlazorPolyfillFile(context.Request.BrowserNeedES5Fallback(), isMinified);
                    await HttpRequestManager.ManageRequest(context, fileContent);
                });
            });

            return builder;
        }


        private static bool _blazorPolyfillLibCached = false;
        private static bool IsBlazorPolyfillLibCached() => _blazorPolyfillLibCached;

        private static void CacheBlazorPolyfillLib()
        {
            //Assuming that everything succeed even if it fail.
            //We don't want to hang the app for next request if something fail for any reason, as something
            //critical may happened in file generation depending the environment.
            _blazorPolyfillLibCached = true;

            try
            {
                GetPatchedBlazorServerFile();

                GetBlazorPolyfillFile(true, false);
                GetBlazorPolyfillFile(false, true);

                //In this case the parameter does not change anything
                GetBlazorPolyfillFile(false, true);
            }
            catch (Exception)
            {
                throw;
            }
        }

        private static string Transform(string input, string filename, string babelrcJSON)
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

        #region PATCHED BLAZOR.SERVER.JS

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
                    js = Transform(js, "blazor.server.js", "{\"plugins\":[\"proposal-class-properties\",\"proposal-object-rest-spread\"],\"presets\":[[\"env\",{\"targets\":{\"browsers\":[\"ie 11\"]}}], \"es2015\",\"es2016\",\"es2017\",\"stage-3\"], \"sourceType\": \"script\"}");

                    //At this point, Babel has unminified the code, and fixed IE11 issues, like 'import' method calls.
                    //We still need to fix 'descriptor' regex evaluation code, as it was expecting a named capture group.
                    js = Regex.Replace(js, "([a-zA-Z]+)(.groups[ ]*&&[ ]*[a-zA-Z]+.groups.descriptor)", "$1[1]");

                    //Minify with AjaxMin (we don't want an additional external tool with NPM or else for managing this
                    //kind of thing here...
                    js = Uglify.Js(js).Code;

                    //Computing ETag. Should be computed last !
                    string Etag = EtagGenerator.GenerateEtagFromString(js);

                    //Computing Build time for the Last-Modified Http Header
                    //We should rely on the creation date of the Microsoft API
                    //not the Blazor.Polyfill.Server one as the Microsoft.AspNetCore.Components.Server
                    //assembly may be updated in time. We will rely on the current creation/modification date on disk
                    DateTime buildTime = GetAssemblyCreationDate(assembly);

                    _patchedBlazorServerFile = new FileContentReference()
                    {
                        Value = js,
                        ETag = Etag,
                        LastModified = buildTime,
                        ContentLength = System.Text.UTF8Encoding.UTF8.GetByteCount(js).ToString(CultureInfo.InvariantCulture)
                    };
                }
            }

            return _patchedBlazorServerFile;
        }

        #endregion PATCHED BLAZOR.SERVER.JS

        #region IE11 BLAZOR.POLYFILL.JS

        private static FileContentReference _ie11Polyfill = null;
        private static FileContentReference _ie11PolyfillMin = null;

        /// <summary>
        /// Used to return an empty file but hashed with some dummy valid values in order to generate a usable Hash/ETag for browser caching
        /// </summary>
        private static FileContentReference _fakeie11Polyfill = null;

        private static FileContentReference GetBlazorPolyfillFile(bool isIE11, bool isMinified)
        {
            if (!isIE11)
            {
                if (_fakeie11Polyfill == null)
                {
                    string fakeContent = "var _fakeBlazorPolyfill = { }; window._import_ = function (fileName) { if (fileName.length > 0 && fileName[0] === '.') { throw new Error(\"_import_: For compatibility reason please use absolute path\"); }  return import(fileName); }; ";

                    //Computing ETag. Should be computed last !
                    string Etag = EtagGenerator.GenerateEtagFromString(fakeContent);

                    //Computing Build time for the Last-Modified Http Header
                    DateTime buildTime = GetBlazorPolyfillServerBuildDate();

                    _fakeie11Polyfill = new FileContentReference()
                    {
                        Value = fakeContent,
                        ETag = Etag,
                        LastModified = buildTime,
                        ContentLength = System.Text.UTF8Encoding.UTF8.GetByteCount(fakeContent).ToString(CultureInfo.InvariantCulture)
                    };
                }

                return _fakeie11Polyfill;
            }
            else
            {
                if (isMinified)
                {
                    if (_ie11PolyfillMin == null)
                    {
                        var assembly = GetBlazorPolyfillAssembly();

                        var resources = assembly.GetManifestResourceNames();
                        var resourceName = resources.Single(str => str.EndsWith("blazor.polyfill.min.js"));

                        using (Stream stream = assembly.GetManifestResourceStream(resourceName))
                        using (StreamReader reader = new StreamReader(stream))
                        {
                            string js = reader.ReadToEnd();

                            //Computing ETag. Should be computed last !
                            string Etag = EtagGenerator.GenerateEtagFromString(js);

                            //Computing Build time for the Last-Modified Http Header
                            DateTime buildTime = GetBlazorPolyfillServerBuildDate();

                            _ie11PolyfillMin = new FileContentReference()
                            {
                                Value = js,
                                ETag = Etag,
                                LastModified = buildTime,
                                ContentLength = System.Text.UTF8Encoding.UTF8.GetByteCount(js).ToString(CultureInfo.InvariantCulture)
                            };
                        }
                    }

                    return _ie11PolyfillMin;
                }
                else
                {
                    if (_ie11Polyfill == null)
                    {
                        var assembly = GetBlazorPolyfillAssembly();

                        var resources = assembly.GetManifestResourceNames();
                        var resourceName = resources.Single(str => str.EndsWith("blazor.polyfill.js"));

                        using (Stream stream = assembly.GetManifestResourceStream(resourceName))
                        using (StreamReader reader = new StreamReader(stream))
                        {
                            string js = reader.ReadToEnd();

                            //Computing ETag. Should be computed last !
                            string Etag = EtagGenerator.GenerateEtagFromString(js);

                            //Computing Build time for the Last-Modified Http Header
                            DateTime buildTime = GetBlazorPolyfillServerBuildDate();

                            _ie11Polyfill = new FileContentReference()
                            {
                                Value = js,
                                ETag = Etag,
                                LastModified = buildTime,
                                ContentLength = System.Text.UTF8Encoding.UTF8.GetByteCount(js).ToString(CultureInfo.InvariantCulture)
                            };
                        }
                    }

                    return _ie11Polyfill;
                }
            }
        }

        #endregion IE11 BLAZOR.POLYFILL.JS

        private static DateTime GetBlazorPolyfillServerBuildDate()
        {
            //This class Assembly
            var thisAssembly = GetBlazorPolyfillAssembly();

            var attribute = thisAssembly.GetCustomAttribute<BlazorPolyfillBuildDateAttribute>();
            return attribute != null ? attribute.DateTime : default(DateTime);
        }

        #region ASSEMBLY RELATED

        public static DateTime GetAssemblyCreationDate(Assembly assembly)
        {
            if (assembly == null)
            {
                throw new NullReferenceException(nameof(assembly));
            }

            try
            {
                FileInfo fi = new FileInfo(assembly.Location);
                var created = fi.CreationTime;
                var lastmodified = fi.LastWriteTime;

                if (created == DateTime.MinValue)
                {
                    throw new InvalidOperationException($"Unable to stat '{assembly.GetName()}' assembly file. Check file existence at this location and permissions");
                }

                return fi.LastWriteTime != DateTime.MinValue ? fi.LastWriteTime : fi.CreationTime;
            }
            catch (Exception)
            {
                //Shoud not go into exception. If we are here, that mean that there is some access rights exception
                //We bubble here in order to differenciate an unexisting FileInfo or something else at the same code area
                throw;
            }
        }

        private static Assembly _blazorPolyfillAssembly = null;

        private static Assembly GetBlazorPolyfillAssembly()
        {
            if (_blazorPolyfillAssembly == null)
            {
                //Getting Assembly reference through a currently loaded class type issued
                //from this assembly
                _blazorPolyfillAssembly = Assembly.GetAssembly(typeof(BlazorPolyfillMiddlewareExtensions));
            }

            return _blazorPolyfillAssembly;
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

        #endregion ASSEMBLY RELATED
    }
}
