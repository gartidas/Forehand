using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NCrontab;
using System;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Features.SubscriptionCards;

namespace WebApi.BackgroundWorkes
{
    public class DeleteOverdueSubscriptionCardsWorker : BackgroundService
    {
        private CrontabSchedule _schedule;
        private DateTime _nextRun;
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<DeleteOverdueSubscriptionCardsWorker> _logger;

        private string Schedule => "0 0 23 * * *"; //Runs every day at 23:00

        public DeleteOverdueSubscriptionCardsWorker(IServiceProvider serviceProvider, ILogger<DeleteOverdueSubscriptionCardsWorker> logger)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
            _schedule = CrontabSchedule.Parse(Schedule, new CrontabSchedule.ParseOptions { IncludingSeconds = true });
            _nextRun = _schedule.GetNextOccurrence(DateTime.UtcNow);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("DeleteOverdueSubscriptionCards starting...");

            try
            {
                do
                {
                    if (DateTime.UtcNow > _nextRun)
                    {
                        try
                        {
                            using (var scope = _serviceProvider.CreateScope())
                            {
                                var mediator = scope.ServiceProvider.GetRequiredService<IMediator>();
                                await mediator.Send(new DeleteOverdueSubscriptionCards.Command(), stoppingToken);
                                _logger.LogInformation("DeleteOverdueSubscriptionCards executed at {0}", DateTime.UtcNow);
                            }
                        }
                        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
                        {
                            // Pass
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError(ex, "Error occured during DeleteOverdueSubscriptionCards execution.");
                        }

                        _nextRun = _schedule.GetNextOccurrence(DateTime.UtcNow);
                    }

                    await Task.Delay(TimeSpan.FromMinutes(20), stoppingToken);
                }
                while (!stoppingToken.IsCancellationRequested);
            }
            finally
            {
                _logger.LogDebug("DeleteOverdueSubscriptionCards stopped.");
            }
        }
    }
}
