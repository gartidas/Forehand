using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Common.Exceptions;
using WebApi.Persistence;

namespace WebApi.Features.Reservations
{
    public class EditReservation
    {
        public class Command : IRequest<Unit>
        {
            [JsonIgnore]
            public string ReservationId { get; set; }

            [JsonIgnore]
            public string CustomerId { get; set; }

            public double Price { get; set; }

            public DateTime StartDate { get; set; }

            public DateTime EndDate { get; set; }

            public string CourtId { get; set; }

            public string TrainerId { get; set; }

            public List<string> SportsGearIds { get; set; }
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

                var customer = await _db.Customers.SingleOrNotFoundAsync(x => x.Id == request.CustomerId);

                var court = await _db.Courts.SingleOrNotFoundAsync(x => x.Id == request.CourtId);

                if (court.Reservations.Any(x => x.EndDate > request.StartDate && x.StartDate < request.EndDate))
                    throw new BadRequestException(ErrorCodes.ReservationForThisDateNotValid);

                var trainer = await _db.Trainers.SingleOrNotFoundAsync(x => x.Id == request.TrainerId);

                if (trainer.Reservations.Any(x => x.EndDate > request.StartDate && x.StartDate < request.EndDate))
                    throw new BadRequestException(ErrorCodes.ReservationForThisDateNotValid);

                var sportsGear = await _db.SportsGear.Where(x => request.SportsGearIds.Any(y => y == x.Id)).ToListAsync(cancellationToken);

                foreach (var item in sportsGear)
                {
                    if (item.Reservations.Any(x => x.Reservation.EndDate > request.StartDate && x.Reservation.StartDate < request.EndDate))
                        throw new BadRequestException(ErrorCodes.ReservationForThisDateNotValid);
                }

                reservation.EditReservation(request.Price, request.StartDate, request.EndDate, court, customer, trainer, sportsGear);

                await _reservationsHub.Clients.All.ReceiveReservation(ReservationDto.Map(reservation));

                await _db.SaveChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }

        public class Validator : AbstractValidator<Command>
        {
            public Validator()
            {
                RuleFor(x => x.Price)
                    .NotEmpty().WithErrorCode(ErrorCodes.Required)
                    .Must(x => x > 0).WithErrorCode(ErrorCodes.MinimalValue).WithState(_ => new { Min = 0 });

                RuleFor(x => x.StartDate)
                      .NotEmpty().WithErrorCode(ErrorCodes.Required)
                      .GreaterThanOrEqualTo(DateTime.Now.Date).WithErrorCode(ErrorCodes.MustBeInTheFuture);

                RuleFor(x => x.EndDate)
                    .NotEmpty().WithErrorCode(ErrorCodes.Required)
                    .GreaterThanOrEqualTo(DateTime.Now.Date).WithErrorCode(ErrorCodes.MustBeInTheFuture)
                    .GreaterThanOrEqualTo(x => x.StartDate).WithErrorCode(ErrorCodes.MustBeAfterStartDate);
            }
        }
    }
}
