using Blazor.Polyfill.Build.Core;
using Microsoft.Extensions.CommandLineUtils;
using System;

namespace Blazor.Polyfill.Build.Commands
{
    internal static class ES5EntryGeneratorCommand
    {
        public static void Command(CommandLineApplication command)
        {
            var referencesFile = command.Option("--input",
                "The path to your project root folder",
                CommandOptionType.SingleValue);

            var intermediateDir = command.Option("--intermediate-dir",
                "The path to your intermediate directory",
                CommandOptionType.SingleValue);

            command.OnExecute(() =>
            {
                if (!referencesFile.HasValue())
                {
                    command.ShowHelp(command.Name);
                    return 1;
                }

                try
                {
                    JSModuleReferenceHelper.GenerateES5EntryForWebpack(referencesFile.Value(), intermediateDir.Value());
                    return 0;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"ERROR: {ex.Message}");
                    Console.WriteLine(ex.StackTrace);
                    return 1;
                }
            });
        }
    }
}
