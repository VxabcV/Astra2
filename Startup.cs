using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // Register the TCP server as a hosted service
        services.AddHostedService<TcpServer>();
    }
}
