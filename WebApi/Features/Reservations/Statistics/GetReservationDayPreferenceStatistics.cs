using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;

namespace WebApi.Features.Reservations.Statistics
{
    public class GetReservationDayPreferenceStatistics
    {
        public class Query : IRequest<List<DayOfWeekStatisticsDto>>
        {
        }

        public class Handler : IRequestHandler<Query, List<DayOfWeekStatisticsDto>>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<List<DayOfWeekStatisticsDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var daysOfWeek = Enum.GetValues(typeof(DayOfWeek)).Cast<DayOfWeek>();
                var numberOfReservationsPerDay = new Dictionary<DayOfWeek, int>();
                foreach (var dayOfWeek in daysOfWeek)
                {
                    numberOfReservationsPerDay.Add(dayOfWeek, 0);
                }

                var reservations = await _db.Reservations.ToListAsync(cancellationToken);
                reservations.ForEach(x => numberOfReservationsPerDay[x.StartDate.DayOfWeek]++);

                return numberOfReservationsPerDay.Select(x => new DayOfWeekStatisticsDto() { DayOfWeek = x.Key, NumberOfReservations = x.Value }).ToList();
            }
        }

        public class DayOfWeekStatisticsDto
        {
            public DayOfWeek DayOfWeek { get; set; }
            public int NumberOfReservations { get; set; }
        }
    }
}
