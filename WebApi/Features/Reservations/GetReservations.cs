using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;

namespace WebApi.Features.Reservations
{
    public class GetReservations
    {
        public class Query : IRequest<List<ReservationDto>>
        {
            public DateTime FromDate { get; set; }
            public DateTime ToDate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<ReservationDto>>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<List<ReservationDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _db.Reservations.Include(x => x.Court).Include(x => x.Customer).Include(x => x.SportsGear).ThenInclude(x => x.SportsGear).Include(x => x.Trainer)
                .Select(reservation => new ReservationDto
                {
                    Id = reservation.Id,
                    Price = reservation.Price,
                    StartDate = reservation.StartDate,
                    EndDate = reservation.EndDate,
                    ReservationState = reservation.ReservationState,
                    Court = reservation.Court,
                    Trainer = reservation.Trainer,
                    Customer = reservation.Customer,
                    SportsGear = reservation.SportsGear.Select(x => x.SportsGear).ToList()
                })
                .Where(x => x.StartDate < request.ToDate && x.EndDate > request.FromDate)
                .OrderBy(x => x.StartDate)
                .ThenBy(x => x.EndDate)
                .ToListAsync(cancellationToken);
            }
        }
    }
}
