using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;

namespace WebApi.Features.Reservations.Statistics
{
    public class GetReservationTimePreferenceStatistics
    {
        public class Query : IRequest<List<HourOfDayStatisticsDto>>
        {
        }

        public class Handler : IRequestHandler<Query, List<HourOfDayStatisticsDto>>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<List<HourOfDayStatisticsDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var numberOfReservationsPerHour = new Dictionary<int, int>();

                for (int i = 7; i < 21; i++)
                {
                    numberOfReservationsPerHour.Add(i, 0);
                }

                var reservations = await _db.Reservations.ToListAsync(cancellationToken);
                reservations.ForEach(x => numberOfReservationsPerHour[x.StartDate.Hour]++);

                return numberOfReservationsPerHour.Select(x => new HourOfDayStatisticsDto() { HourOfDay = x.Key, NumberOfReservations = x.Value }).ToList();
            }
        }

        public class HourOfDayStatisticsDto
        {
            public int HourOfDay { get; set; }
            public int NumberOfReservations { get; set; }
        }
    }
}
