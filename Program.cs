using Serilog;
using Microsoft.Extensions.Hosting;
using System.Diagnostics;
using Serilog.Extensions.Hosting;  // Add this line

var processName = Process.GetCurrentProcess().ProcessName;
var logFileName = $"{processName}.{DateTime.Now:yyyy-MM-dd}.log";

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File(logFileName)
    .CreateLogger();

try
{
    var host = Host.CreateDefaultBuilder(args)
        .UseSerilog()
        .UseConsoleLifetime()
        .ConfigureServices((context, services) =>
        {
            var startup = new Startup();
            startup.ConfigureServices(services);
        })
        .Build();

    await host.RunAsync();
}
catch (Exception ex)
{
    Log.Error(ex, "Application exception");
}
finally
{
    Log.CloseAndFlush();
}
