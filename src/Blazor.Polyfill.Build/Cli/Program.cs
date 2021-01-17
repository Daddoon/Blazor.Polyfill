using Blazor.Polyfill.Build.Commands;
using Microsoft.Extensions.CommandLineUtils;

namespace Blazor.Polyfill.Build
{
    static class Program
    {
        static int Main(string[] args)
        {
            var app = new CommandLineApplication
            {
                Name = "Blazor.Polyfill.Build"
            };
            app.HelpOption("-?|-h|--help");

            app.Command("es5-entry-generator", ES5EntryGeneratorCommand.Command);

            if (args.Length > 0)
            {
                return app.Execute(args);
            }
            else
            {
                app.ShowHelp();
                return 0;
            }
        }
    }
}
