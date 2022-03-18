using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Linq;
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
                var reservation = await _db.Reservations.Include(x => x.Court).Include(x => x.Customer).Include(x => x.SportsGear).ThenInclude(x => x.SportsGear).Include(x => x.Trainer).SingleOrNotFoundAsync(x => x.Id == request.ReservationId);
                return new ReservationDto
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
                };
            }
        }
    }
}
