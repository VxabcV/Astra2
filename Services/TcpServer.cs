using System.Net;
using System.Net.Sockets;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Serilog;

public class TcpServer : BackgroundService
{
    private readonly IConfiguration _configuration;
    private TcpListener _listener;

    public TcpServer(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var port = _configuration.GetValue<int>("TcpServer:Port", 8887);
        _listener = new TcpListener(IPAddress.Any, port);

        try
        {
            _listener.Start();
            Log.Information("TCP Server is listening on port {Port}", port);

            while (!stoppingToken.IsCancellationRequested)
            {
                var client = await _listener.AcceptTcpClientAsync(stoppingToken);
                _ = HandleClientAsync(client, stoppingToken);
            }
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            Log.Error(ex, "Error in TCP server");
        }
        finally
        {
            _listener.Stop();
        }
    }

    private async Task HandleClientAsync(TcpClient client, CancellationToken stoppingToken)
    {
        try
        {
            using (client)
            using (var stream = client.GetStream())
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    byte[] buffer = new byte[1024];
                    int bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length, stoppingToken);
                    
                    if (bytesRead == 0) break;

                    string message = System.Text.Encoding.ASCII.GetString(buffer, 0, bytesRead);
                    Log.Information("Received: {Message}", message);

                    // Send ACK packet: 0x0F (15 in decimal) as response
                    // await stream.WriteAsync(new byte[] { 0x0F }, 0, 1, stoppingToken);
                    await stream.WriteAsync(new byte[] { 0x06 }, 0, 1, stoppingToken);

                    // TODO: #1 Integrate the NodeServices

                    // TODO: #2 Load the npm module
                    // Load astra_parser.ts file and run the default function code with data parameter.
                    // data parameter: message or buffer


                    // TODO: #3 push to test Queue or Gen3 Main QUEUE
                }
            }
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error handling client connection");
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        _listener?.Stop();
        await base.StopAsync(cancellationToken);
    }
}