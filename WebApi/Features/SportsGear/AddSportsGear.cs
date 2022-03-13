using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Common.Exceptions;
using WebApi.Domain;
using WebApi.Persistence;

namespace WebApi.Features.SportsGear
{
    public class AddSportsGear
    {
        public class Command : IRequest<Unit>
        {
            public double ReservationPrice { get; set; }

            public string RegistrationNumber { get; set; }

            public double ShoppingPrice { get; set; }

            public string Name { get; set; }

            public DateTime ProductionYear { get; set; }

            public PhysicalState PhysicalState { get; set; }

            public string Manufacturer { get; set; }
        }

        public class Handler : IRequestHandler<Command, Unit>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                if (await _db.SportsGear.AnyAsync(x => x.RegistrationNumber == request.RegistrationNumber, cancellationToken))
                    throw new BadRequestException(ErrorCodes.AlreadyExists);

                var court = new WebApi.Domain.SportsGear(request.ReservationPrice, DateTime.Now, request.RegistrationNumber, request.ShoppingPrice, request.Name, request.ProductionYear, request.PhysicalState, request.Manufacturer);

                var result = await _db.SportsGear.AddAsync(court, cancellationToken);
                await _db.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }

        public class Validator : AbstractValidator<Command>
        {
            public Validator()
            {
                RuleFor(x => x.ReservationPrice)
                    .NotEmpty().WithErrorCode(ErrorCodes.Required)
                    .Must(x => x > 0).WithErrorCode(ErrorCodes.MinimalValue).WithState(_ => new { Min = 0 });

                RuleFor(x => x.ShoppingPrice)
                   .NotEmpty().WithErrorCode(ErrorCodes.Required)
                   .Must(x => x > 0).WithErrorCode(ErrorCodes.MinimalValue).WithState(_ => new { Min = 0 });

                RuleFor(x => x.Name)
                    .NotEmpty().WithErrorCode(ErrorCodes.Required)
                    .MinimumLength(3).WithErrorCode(ErrorCodes.MinLength).WithState(_ => new { MinLength = 3 })
                    .MaximumLength(30).WithErrorCode(ErrorCodes.MaxLength).WithState(_ => new { MaxLength = 30 });

                RuleFor(x => x.RegistrationNumber)
                  .NotEmpty().WithErrorCode(ErrorCodes.Required)
                  .MinimumLength(3).WithErrorCode(ErrorCodes.MinLength).WithState(_ => new { MinLength = 3 })
                  .MaximumLength(30).WithErrorCode(ErrorCodes.MaxLength).WithState(_ => new { MaxLength = 30 });

                RuleFor(x => x.ProductionYear)
                    .NotEmpty().WithErrorCode(ErrorCodes.Required)
                    .LessThanOrEqualTo(DateTime.Now.Date).WithErrorCode(ErrorCodes.MustBeInThePast);

                RuleFor(x => x.Manufacturer)
                 .NotEmpty().WithErrorCode(ErrorCodes.Required)
                 .MinimumLength(3).WithErrorCode(ErrorCodes.MinLength).WithState(_ => new { MinLength = 3 })
                 .MaximumLength(30).WithErrorCode(ErrorCodes.MaxLength).WithState(_ => new { MaxLength = 30 });

                RuleFor(x => x.PhysicalState).Must(x => x > 0 && (int)x < 6).WithErrorCode(ErrorCodes.NotSupported);
            }
        }
    }
}
