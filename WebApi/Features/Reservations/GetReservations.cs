using MediatR;
using Microsoft.EntityFrameworkCore;
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
                return await _db.Reservations.Include(x => x.Court).Include(x => x.Customer).ThenInclude(x => x.IdentityUser).Include(x => x.SportsGear).ThenInclude(x => x.SportsGear).Include(x => x.Trainer).ThenInclude(x => x.IdentityUser)
                .OrderBy(x => x.StartDate)
                .ThenBy(x => x.EndDate)
                .Select(reservation => ReservationDto.Map(reservation))
                .ToListAsync(cancellationToken);
            }
        }
    }
}
