using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;

namespace WebApi.Features.Reservations
{
    public class GetReservationsForTrainer
    {
        public class Query : IRequest<List<ReservationDto>>
        {
            [JsonIgnore]
            public string TrainerId { get; set; }
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
                var currentDate = DateTime.Now;
                return await _db.Reservations.Include(x => x.Court).Include(x => x.Customer).ThenInclude(x => x.IdentityUser).Include(x => x.SportsGear).ThenInclude(x => x.SportsGear).Include(x => x.Trainer).ThenInclude(x => x.IdentityUser)
                .Where(x => x.EndDate > currentDate)
                .Where(x => x.Trainer.Id == request.TrainerId)
                .Where(x => x.ReservationState == Domain.ReservationState.Confirmed)
                .OrderBy(x => x.StartDate)
                .ThenBy(x => x.EndDate)
                .Select(reservation => ReservationDto.Map(reservation))
                .ToListAsync(cancellationToken);
            }
        }
    }
}
