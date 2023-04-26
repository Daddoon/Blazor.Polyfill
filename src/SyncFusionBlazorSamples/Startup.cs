using System.IO;
using Syncfusion.Blazor;
using Syncfusion.Licensing;
using System.Globalization;
using BlazorDemos.Shared;
using System.Collections.Generic;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Blazor.Polyfill.Server;
using Blazor.Polyfill.Server.Enums;
using Microsoft.AspNetCore.Http;
using System;
using System.Text;

namespace BlazorDemos
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            if (File.Exists(System.IO.Directory.GetCurrentDirectory() + "/SyncfusionLicense.txt"))
            {
                string licenseKey = System.IO.File.ReadAllText(System.IO.Directory.GetCurrentDirectory() + "/SyncfusionLicense.txt");
                SyncfusionLicenseProvider.RegisterLicense(licenseKey);
            }
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            #region Localization
            // Set the resx file folder path to access
            services.AddLocalization(options => options.ResourcesPath = "Resources");
            services.AddSyncfusionBlazor(options =>
            {
                options.IgnoreScriptIsolation = true;
            });
            // Register the Syncfusion locale service to customize the  SyncfusionBlazor component locale culture
            services.AddSingleton(typeof(ISyncfusionStringLocalizer), typeof(SyncfusionLocalizer));
            services.Configure<RequestLocalizationOptions>(options =>
            {
                // Define the list of cultures your app will support
                var supportedCultures = new List<CultureInfo>()
            {
                new CultureInfo("en-US"),
                new CultureInfo("de"),
                new CultureInfo("fr-CH"),
                new CultureInfo("zh")
            };
                // Set the default culture
                options.DefaultRequestCulture = new RequestCulture("en-US");
                options.SupportedCultures = supportedCultures;
                options.SupportedUICultures = supportedCultures;
            });
            #endregion

            services.AddRazorPages();
            services.AddServerSideBlazor();
            services.AddServerSideBlazor().AddCircuitOptions(options => { options.DetailedErrors = true; });
            services.AddServerSideBlazor().AddHubOptions(o =>
            {
                o.MaximumReceiveMessageSize = 102400000;
            });

            services.AddBlazorPolyfill();

#if (!DEBUG)
            // services.AddSignalR().AddAzureSignalR(options =>
            // {
            //     options.ServerStickyMode = Microsoft.Azure.SignalR.ServerStickyMode.Required;
            // });
#endif
            services.AddScoped<SampleService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
#region Localization
            app.UseRequestLocalization(app.ApplicationServices.GetService<IOptions<RequestLocalizationOptions>>().Value);

#endregion
		    
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseBlazorPolyfill((options) =>
            {
                options.ES5ConversionScope = ES5ConversionScope.All;
                options.ForceES5Fallback = true;
                options.OnES5ConvertFailure = (string path, Exception ex) =>
                {
                    #if DEBUG

                    //For tracking during debug time
                    throw ex;

                    #endif
                };
                options.BeforeES5TransformHandler = (string path, string content) =>
                {
                    if (!string.IsNullOrEmpty(path))
                    {
                        #region Syncfusion Library Fix

                        //Syncfusion Libary fix
                        //Tested on version 19.3.0.53

                        //Fix '<' and '>' unescaped characters in a specific regex
                        //that make NUGlify minification crash with C# Regex evaluator
                        //as it detect a named capturing group with incorrect syntax
                        //but this is actually NOT a named capturing group.

                        //Error occur on some version but not on all versions of Library / .NET Version

                        //COMMENT ALL THESES LINE FOR TESTING ERROR HANDLING
                        //AT TRANSFORM
                        if (path.EndsWith("syncfusion-blazor.min.js", StringComparison.InvariantCultureIgnoreCase)
                        || path.EndsWith("syncfusion-blazor.js", StringComparison.InvariantCultureIgnoreCase))
                        {
                            content = content
                            .Replace(@"\<sub>", @"\<sub\>") //SET 1
                            .Replace(@"\<sup>", @"\<sup\>") //SET 1
                            .Replace(@"\<\/sub>", @"\<\/sub\>") //SET 2
                            .Replace(@"\<\/sup>", @"\<\/sup\>") //SET 2
                            .Replace(@"<\/sub>", @"\<\/sub\>") //SET 3
                            .Replace(@"<\/sup>", @"\<\/sup\>") //SET 3
                            .Replace(@"<sub>", @"\<sub\>") //SET 4
                            .Replace(@"<sup>", @"\<sup\>"); //SET 4
                        }

                        #endregion Syncfusion Library Fix
                    }
                    return content;
                };
            });

            #region DEBUG FILE INTERCEPTION

            //var staticFileOptions = new StaticFileOptions
            //{
            //    OnPrepareResponse = async (context) =>
            //    {
            //        var fn = context.File.Name.ToLowerInvariant();
            //        if (fn.EndsWith(".js"))
            //        {
            //            context.Context.Request.EnableBuffering();
            //            var reqBody = context.Context.Request.Body;
            //            var buffer = new byte[Convert.ToInt32(context.Context.Request.ContentLength)];

            //            await context.Context.Request.Body.ReadAsync(buffer, 0, buffer.Length);
            //            var requestBody = Encoding.UTF8.GetString(buffer);
            //            reqBody.Seek(0, SeekOrigin.Begin);
            //            context.Context.Request.Body = reqBody;
            //        }
            //    }
            //};

            //DEBUG TEST: For see if we can intercept file content globally
            //app.UseStaticFiles(staticFileOptions);

            #endregion END DEBUG FILE INTERCEPTION

            app.UseStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapBlazorHub();
                endpoints.MapFallbackToPage("/_Host");
            });
        }
    }
}
