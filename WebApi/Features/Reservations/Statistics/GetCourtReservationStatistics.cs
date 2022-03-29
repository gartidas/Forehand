using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;
using static WebApi.Features.Courts.GetCourts;

namespace WebApi.Features.Reservations.Statistics
{
    public class GetCourtReservationStatistics
    {
        public class Query : IRequest<List<CourtStatisticsDto>>
        {
        }

        public class Handler : IRequestHandler<Query, List<CourtStatisticsDto>>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<List<CourtStatisticsDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _db.Courts.Include(x => x.Reservations).Select(x => new CourtStatisticsDto
                {
                    Court = new CourtDto()
                    {
                        Id = x.Id,
                        Description = x.Description,
                        Label = x.Label,
                        ReservationPrice = x.ReservationPrice
                    },
                    NumberOfReservations = x.Reservations.Count(),
                }).OrderBy(x => x.NumberOfReservations).ToListAsync(cancellationToken);
            }
        }

        public class CourtStatisticsDto
        {
            public CourtDto Court { get; set; }

            public int NumberOfReservations { get; set; }
        }
    }
}
