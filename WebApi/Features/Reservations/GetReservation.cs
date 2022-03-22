using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;

namespace WebApi.Features.Reservations
{
    public class GetReservation
    {
        public class Query : IRequest<ReservationDto>
        {
            [JsonIgnore]
            public string ReservationId { get; set; }
        }

        public class Handler : IRequestHandler<Query, ReservationDto>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<ReservationDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var reservation = await _db.Reservations.Include(x => x.Court).Include(x => x.Customer).ThenInclude(x => x.IdentityUser).Include(x => x.SportsGear).ThenInclude(x => x.SportsGear).Include(x => x.Trainer).ThenInclude(x => x.IdentityUser).SingleOrNotFoundAsync(x => x.Id == request.ReservationId);
                return ReservationDto.Map(reservation);
            }
        }
    }
}
