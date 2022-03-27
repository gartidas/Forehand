using FluentValidation;
using MediatR;
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
        public class Command : IRequest<ReservationDto>
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

        public class Handler : IRequestHandler<Command, ReservationDto>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<ReservationDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var reservation = await _db.Reservations.Include(x => x.Court).Include(x => x.Customer).ThenInclude(x => x.IdentityUser)
                    .Include(x => x.SportsGear).ThenInclude(x => x.SportsGear).Include(x => x.Trainer).ThenInclude(x => x.IdentityUser)
                    .SingleOrNotFoundAsync(x => x.Id == request.ReservationId);

                var currentDate = DateTime.Now;

                if (reservation.StartDate < currentDate || reservation.EndDate < currentDate)
                    throw new BadRequestException(ErrorCodes.MustBeInTheFuture);

                var customer = await _db.Customers.Include(x => x.IdentityUser).Include(x => x.Reservations).SingleOrNotFoundAsync(x => x.Id == request.CustomerId);

                var court = await _db.Courts.Include(x => x.Reservations).SingleOrNotFoundAsync(x => x.Id == request.CourtId);

                if (court.Reservations.Any(x => x.EndDate > request.StartDate && x.StartDate < request.EndDate && x.Id != request.ReservationId))
                    throw new BadRequestException(ErrorCodes.ReservationForThisDateNotValid);

                var trainer = await _db.Trainers.Include(x => x.IdentityUser).Include(x => x.Reservations).SingleOrDefaultAsync(x => x.Id == request.TrainerId, cancellationToken);

                if (trainer.Reservations.Any(x => x.EndDate > request.StartDate && x.StartDate < request.EndDate && x.Id != request.ReservationId))
                    throw new BadRequestException(ErrorCodes.ReservationForThisDateNotValid);

                var sportsGear = await _db.SportsGear.Include(x => x.Reservations).ThenInclude(x => x.Reservation).Where(x => request.SportsGearIds.Any(y => y == x.Id)).ToListAsync(cancellationToken);

                foreach (var item in sportsGear)
                {
                    if (item.Reservations.Any(x => x.Reservation.EndDate > request.StartDate && x.Reservation.StartDate < request.EndDate && x.Reservation.Id != request.ReservationId))
                        throw new BadRequestException(ErrorCodes.ReservationForThisDateNotValid);
                }

                reservation.EditReservation(request.Price, request.StartDate, request.EndDate, court, customer, trainer, sportsGear);

                await _db.SaveChangesAsync(cancellationToken);

                return ReservationDto.Map(reservation);
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
