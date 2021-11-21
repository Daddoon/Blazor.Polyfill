using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Blazor.Polyfill.Server.Helper
{
    internal class LogHelper
    {
        public const string LoggerName = "Blazor.Polyfill";

        public static bool IsLoggerSet()
        {
            return _logger != null;
        }

        private static ILogger _logger;

        public static void SetLogger(ILogger logger)
        {
            _logger = logger;
        }

        public static void LogError(string message)
        {
            if (IsLoggerSet())
            {
                _logger?.LogError(message);
            }
            else
            {
                Console.WriteLine($"error: {LoggerName}");
                Console.WriteLine(message);
            }
        }

        public static void LogError(Exception exception, string message, params object?[] args)
        {
            _logger?.LogError(exception, message, args);
        }

        public static void LogError(string message, params object?[] args)
        {
            _logger?.LogError(message, args);
        }

        public static void LogInformation(string message)
        {
            if (IsLoggerSet())
            {
                _logger?.LogInformation(message);
            }
            else
            {
                Console.WriteLine($"info: {LoggerName}");
                Console.WriteLine(message);
            }
        }

        public static void LogInformation(string message, params object?[] args)
        {
            _logger?.LogInformation(message, args);
        }

        public static void LogWarning(string message)
        {
            if (IsLoggerSet())
            {
                _logger?.LogWarning(message);
            }
            else
            {
                Console.WriteLine($"warn: {LoggerName}");
                Console.WriteLine(message);
            }
        }

        public static void LogWarning(string message, params object?[] args)
        {
            _logger?.LogWarning(message, args);
        }
    }
}
