using System;
using System.Globalization;

[AttributeUsage(AttributeTargets.Assembly)]
internal class BlazorPolyfillBuildDateAttribute : Attribute
{
    public BlazorPolyfillBuildDateAttribute(string value)
    {
        DateTime = DateTime.ParseExact(value, "yyyyMMddHHmmss", CultureInfo.InvariantCulture, DateTimeStyles.None);
    }

    public DateTime DateTime { get; }
}