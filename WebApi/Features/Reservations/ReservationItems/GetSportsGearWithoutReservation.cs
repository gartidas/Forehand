using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;
using static WebApi.Features.SportsGear.GetSportsGear;

namespace WebApi.Features.Reservations.ReservationItems
{
    public class GetSportsGearWithoutReservation
    {
        public class Query : IRequest<List<SportsGearDto>>
        {
            public DateTime FromDate { get; set; }
            public DateTime ToDate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<SportsGearDto>>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<List<SportsGearDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _db.SportsGear.Include(x => x.Reservations).ThenInclude(x => x.Reservation)
                    .Where(x => x.Reservations.All(x => x.Reservation.EndDate < request.FromDate || x.Reservation.StartDate > request.ToDate))
                    .Select(x => new SportsGearDto
                    {
                        Id = x.Id,
                        ReservationPrice = x.ReservationPrice,
                        RegistrationNumber = x.RegistrationNumber,
                        Name = x.Name,
                        PhysicalState = x.PhysicalState,
                    })
                    .OrderBy(x => x.Name)
                    .ToListAsync(cancellationToken);
            }
        }
    }
}
