using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;
using static WebApi.Features.Courts.GetCourts;

namespace WebApi.Features.Reservations.ReservationItems
{
    public class GetCourtsWithoutReservation
    {
        public class Query : IRequest<List<CourtDto>>
        {
            public DateTime FromDate { get; set; }
            public DateTime ToDate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<CourtDto>>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<List<CourtDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _db.Courts.Include(x => x.Reservations)
                    .Where(x => x.Reservations.All(x => x.EndDate < request.FromDate || x.StartDate > request.ToDate))
                    .Select(x => new CourtDto
                    {
                        Id = x.Id,
                        ReservationPrice = x.ReservationPrice,
                        Label = x.Label,
                        Description = x.Description,
                    })
                    .OrderBy(x => x.Label)
                    .ToListAsync(cancellationToken);
            }
        }
    }
}
