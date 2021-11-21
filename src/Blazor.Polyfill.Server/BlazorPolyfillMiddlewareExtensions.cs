using Blazor.Polyfill.Server.Helper;
using Blazor.Polyfill.Server.Middleware;
using Blazor.Polyfill.Server.Model;
using JavaScriptEngineSwitcher.ChakraCore;
using JavaScriptEngineSwitcher.Extensions.MsDependencyInjection;
using JavaScriptEngineSwitcher.V8;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Components.Server;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using NUglify;
using React;
using React.AspNet;
using React.Exceptions;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;

namespace Blazor.Polyfill.Server
{
    public static class BlazorPolyfillMiddlewareExtensions
    {
        private const string _platformNotSupportedMessage = "Platform not supported. Consider to set the preventReactServicesRegistration parameter to true, and activate the UsePackagedBlazorServerLibrary option in your Startup Configure method.";

        private static bool _preventReactServicesRegistration = false;

        /// <summary>
        /// Add the required services for BlazorPolyfill.
        /// If the preventReactServicesRegistration parameter is set to true,
        /// the React.NET library used for transpilation with Babel will not
        /// be registered automatically. You will have to write yourself the
        /// AddReact and AddJsEngineSwitcher logic in your Startup ConfigureServices method.
        /// You will also have to call by yourself UseReact in Startup Configure method
        /// before UseBlazorPolyfill.
        /// 
        /// You can use this to have control over the transpilation process.
        /// 
        /// Also, if you are on an unsupported platform or CPU for transpilation, like
        /// ARM32v7, you should set this option to true, and enable UsePackagedBlazorServerLibrary
        /// in BlazorPolyfillOptions in the UseBlazorPolyfill method call in Startup Configure method.
        /// </summary>
        /// <param name="services"></param>
        /// <param name="preventReactServicesRegistration"></param>
        /// <returns></returns>
        public static IServiceCollection AddBlazorPolyfill(
    this IServiceCollection services, bool preventReactServicesRegistration)
        {
            //If the user alread added the service, we must not register it twice
            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            _preventReactServicesRegistration = preventReactServicesRegistration;

            if (_preventReactServicesRegistration)
            {
                //Use will configure this by himself
                return services;
            }

            //Not totally accurate, in the sense that the given class to search is internal
            //and the third library code may change in the future. But if not found, we will
            //try to call AddReact by ourselves.
            if (!services.Any(x => x.ServiceType.Name.Equals("PerRequestRegistrations", StringComparison.InvariantCultureIgnoreCase)))
            {
                services.AddReact();
            }

            string defaultEngine = null;

            bool isWindows = System.Runtime.InteropServices.RuntimeInformation
                .IsOSPlatform(OSPlatform.Windows);

            bool isOSX = System.Runtime.InteropServices.RuntimeInformation
                .IsOSPlatform(OSPlatform.OSX);

            bool isLinux = System.Runtime.InteropServices.RuntimeInformation
                .IsOSPlatform(OSPlatform.Linux);

            //Prefer ChakraCore on Windows, even if V8 should work.
            //NOTE: No test have been made on OSX for this
            if (isWindows || isOSX)
            {
                defaultEngine = ChakraCoreJsEngine.EngineName;
            }
            else if (isLinux)
            {
                //The default engine will depend of the CPU here. ChakraCore does not support ARM64 on Linux, and don't support ARM32v7 at all
                switch (System.Runtime.InteropServices.RuntimeInformation.ProcessArchitecture)
                {
                    case Architecture.X64:
                        defaultEngine = ChakraCoreJsEngine.EngineName;
                        break;
                    case Architecture.Arm64:
                        defaultEngine = V8JsEngine.EngineName;
                        break;
                    default:
                        throw new PlatformNotSupportedException(_platformNotSupportedMessage);
                }
            }
            else
            {
                throw new PlatformNotSupportedException(_platformNotSupportedMessage);
            }

            LogHelper.LogInformation($"For dependency or compatibility reasons, the current JS engine used for transpilation has been set to: {defaultEngine}.");

            services.AddJsEngineSwitcher(options => options.DefaultEngineName = defaultEngine)
                .AddChakraCore()
                .AddV8();

            return services;
        }

        /// <summary>
        /// Add the required services for BlazorPolyfill
        /// </summary>
        /// <param name="services"></param>
        /// <returns></returns>
        public static IServiceCollection AddBlazorPolyfill(
            this IServiceCollection services)
        {
            return AddBlazorPolyfill(services, false);
        }

        private static void InitReact(IApplicationBuilder builder)
        {
            if (_preventReactServicesRegistration)
            {
                return;
            }

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

        private static BlazorPolyfillOptions _options = null;

        private static void SetOptions(BlazorPolyfillOptions options)
        {
            _options = options;
        }

        internal static BlazorPolyfillOptions GetOptions()
        {
            return _options;
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

            SetOptions(options);

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

            //This is used in order to transpile dynamically StaticFiles to ES5 when needed
            builder.UseMiddleware<ECMAScript5Middleware>();

            //BrowserNeedES5Fallback is written hiere and not in the builder
            //because we only want to use MapWhen when we need ES5 fallback.
            //If this is false, the request will be redirected to the Microsoft
            //default request management for this file.
            builder.MapWhen(ctx =>
            ECMAScript5Middleware.RequestedFileIsBlazorServerJS(ctx.Request)
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
            ECMAScript5Middleware.RequestedFileIsBlazorPolyfill(ctx.Request, out bool isMinified),
            subBuilder =>
            {
                subBuilder.Run(async (context) =>
                {
                    ECMAScript5Middleware.RequestedFileIsBlazorPolyfill(context.Request, out bool isMinified);

                    //Eval if the requested file is the minified version or not
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

        #region PATCHED BLAZOR.SERVER.JS

        private static FileContentReference _patchedBlazorServerFile = null;

        private static FileContentReference GetPatchedBlazorServerFile()
        {
            if (_patchedBlazorServerFile == null)
            {
                BlazorPolyfillOptions option = GetOptions();

                if (option.UsePackagedBlazorServerLibrary)
                {
                    //Get packaged blazor.server.js
                    var assembly = GetBlazorPolyfillAssembly();

                    var resources = assembly.GetManifestResourceNames();
                    var resourceName = resources.Single(str => str.EndsWith("blazor.server.packaged.js"));

                    using (Stream stream = assembly.GetManifestResourceStream(resourceName))
                    {
                        using (StreamReader reader = new StreamReader(stream))
                        {
                            string js = reader.ReadToEnd();

                            string Etag = CryptographyHelper.CreateSHA256(js);

                            //We should rely on ETag and not on LastModifed informations
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
                }
                else
                {
                    var assembly = GetAspNetCoreComponentsServerAssembly();

                    var resources = assembly.GetManifestResourceNames();
                    var resourceName = resources.Single(str => str.EndsWith("blazor.server.js"));

                    using (Stream stream = assembly.GetManifestResourceStream(resourceName))
                    {
                        using (StreamReader reader = new StreamReader(stream))
                        {
                            string js = reader.ReadToEnd();


                            #region Patch Regex

                            //Patch Descriptor Regex as it make Babel crash during transform
                            js = js.Replace("/\\W*Blazor:[^{]*(?<descriptor>.*)$/;", @"/[\0-\/:-@\[-\^`\{-\uFFFF]*Blazor:(?:(?!\{)[\s\S])*(.*)$/;");

                            js = js.Replace("/^\\s*Blazor-Component-State:(?<state>[a-zA-Z0-9\\+\\/=]+)$/", @"/^[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*Blazor\x2DComponent\x2DState:([\+\/-9=A-Za-z]+)$/");

                            js = js.Replace("/^\\s*Blazor:[^{]*(?<descriptor>.*)$/", @"/^[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*Blazor:(?:(?!\{)[\s\S])*(.*)$/");

                            #endregion Patch Regex

                            //Transpile code to ES5 for IE11 before manual patching
                            js = BabelHelper.Transform(js, "blazor.server.js");

                            #region Regex named groups fix

                            //At this point, Babel has unminified the code, and fixed IE11 issues, like 'import' method calls.

                            //We still need to fix 'descriptor' regex evaluation code, as it was expecting a named capture group.
                            js = Regex.Replace(js, "([_a-zA-Z0-9]+)(.groups[ ]*&&[ ]*[_a-zA-Z0-9]+.groups.descriptor)", "$1[1]");

                            //We still need to fix 'state' regex evaluation code, as it was expecting a named capture group.
                            js = Regex.Replace(js, "([_a-zA-Z0-9]+)(.groups[ ]*&&[ ]*[_a-zA-Z0-9]+.groups.state)", "$1[1]");

                            #endregion Regex named groups fix

                            //Minify with AjaxMin (we don't want an additional external tool with NPM or else for managing this
                            //kind of thing here...
                            js = Uglify.Js(js).Code;

                            //Computing ETag. Should be computed last !
                            string Etag = CryptographyHelper.CreateSHA256(js);

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
                    var assembly = GetBlazorPolyfillAssembly();

                    var resources = assembly.GetManifestResourceNames();
                    var resourceName = resources.Single(str => str.EndsWith("fake.polyfill.js"));

                    using (Stream stream = assembly.GetManifestResourceStream(resourceName))
                    {
                        using (StreamReader reader = new StreamReader(stream))
                        {
                            string js = reader.ReadToEnd();

                            //Computing ETag. Should be computed last !
                            string Etag = CryptographyHelper.CreateSHA256(js);

                            //Computing Build time for the Last-Modified Http Header
                            DateTime buildTime = GetBlazorPolyfillServerBuildDate();

                            _fakeie11Polyfill = new FileContentReference()
                            {
                                Value = js,
                                ETag = Etag,
                                LastModified = buildTime,
                                ContentLength = System.Text.UTF8Encoding.UTF8.GetByteCount(js).ToString(CultureInfo.InvariantCulture)
                            };
                        }
                    }
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
                        {
                            using (StreamReader reader = new StreamReader(stream))
                            {
                                string js = reader.ReadToEnd();

                                //Should inject es5 module override before launch
                                js = GetOptions().GetJavascriptToInject() + js;

                                //Computing ETag. Should be computed last !
                                string Etag = CryptographyHelper.CreateSHA256(js);

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
                        {
                            using (StreamReader reader = new StreamReader(stream))
                            {
                                string js = reader.ReadToEnd();

                                //Should inject es5 module override before launch
                                js = GetOptions().GetJavascriptToInject() + js;

                                //Computing ETag. Should be computed last !
                                string Etag = CryptographyHelper.CreateSHA256(js);

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
                    }

                    return _ie11Polyfill;
                }
            }
        }

        #endregion IE11 BLAZOR.POLYFILL.JS

        internal static DateTime GetBlazorPolyfillServerBuildDate()
        {
            //This class Assembly
            var thisAssembly = GetBlazorPolyfillAssembly();

            var attribute = thisAssembly.GetCustomAttribute<BlazorPolyfillBuildDateAttribute>();
            return attribute != null ? attribute.DateTime : default(DateTime);
        }

        #region ASSEMBLY RELATED

        private static DateTime? _assemblyCreationDate = null;

        internal static DateTime GetAssemblyCreationDate(Assembly assembly)
        {
            if (_assemblyCreationDate != null)
            {
                return (DateTime)_assemblyCreationDate;
            }

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

                _assemblyCreationDate = fi.LastWriteTime != DateTime.MinValue ? fi.LastWriteTime : fi.CreationTime;

                return (DateTime)_assemblyCreationDate;
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
