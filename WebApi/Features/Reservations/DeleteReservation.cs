using MediatR;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Common.Exceptions;
using WebApi.Persistence;

namespace WebApi.Features.Reservations
{
    public class DeleteReservation
    {
        public class Command : IRequest<Unit>
        {
            [JsonIgnore]
            public string ReservationId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Unit>
        {
            private readonly ForehandContext _db;
            private readonly IHubContext<ReservationsHub, IReservationsClient> _reservationsHub;

            public Handler(ForehandContext db, IHubContext<ReservationsHub, IReservationsClient> reservationsHub)
            {
                _db = db;
                _reservationsHub = reservationsHub;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var reservation = await _db.Reservations.SingleOrNotFoundAsync(x => x.Id == request.ReservationId);
                var currentDate = DateTime.Now;

                if (reservation.StartDate < currentDate || reservation.EndDate < currentDate)
                    throw new BadRequestException(ErrorCodes.MustBeInTheFuture);

                _db.Reservations.Remove(reservation);

                await _reservationsHub.Clients.All.RemoveReservation(request.ReservationId);

                await _db.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }
    }
}
