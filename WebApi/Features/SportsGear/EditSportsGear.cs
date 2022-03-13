using FluentValidation;
using MediatR;
using Newtonsoft.Json;
using System;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Domain;
using WebApi.Persistence;
using static WebApi.Features.SportsGear.GetSportsGear;

namespace WebApi.Features.SportsGear
{
    public class EditSportsGear
    {
        public class Command : IRequest<SportsGearDto>
        {
            [JsonIgnore]
            public string SportsGearId { get; set; }

            public double ReservationPrice { get; set; }

            public string RegistrationNumber { get; set; }

            public double ShoppingPrice { get; set; }

            public string Name { get; set; }

            public DateTime ProductionYear { get; set; }

            public PhysicalState PhysicalState { get; set; }

            public string Manufacturer { get; set; }
        }

        public class Handler : IRequestHandler<Command, SportsGearDto>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<SportsGearDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var sportsGear = await _db.SportsGear.SingleOrNotFoundAsync(x => x.Id == request.SportsGearId);

                sportsGear.ReservationPrice = request.ReservationPrice;
                sportsGear.RegistrationNumber = request.RegistrationNumber;
                sportsGear.ShoppingPrice = request.ShoppingPrice;
                sportsGear.Name = request.Name;
                sportsGear.ProductionYear = request.ProductionYear;
                sportsGear.PhysicalState = request.PhysicalState;
                sportsGear.Manufacturer = request.Manufacturer;

                await _db.SaveChangesAsync(cancellationToken);
                return new SportsGearDto
                {
                    Id = sportsGear.Id,
                    ReservationPrice = sportsGear.ReservationPrice,
                    RegistrationDate = sportsGear.RegistrationDate,
                    RegistrationNumber = sportsGear.RegistrationNumber,
                    ShoppingPrice = sportsGear.ShoppingPrice,
                    Name = sportsGear.Name,
                    ProductionYear = sportsGear.ProductionYear,
                    PhysicalState = sportsGear.PhysicalState,
                    Manufacturer = sportsGear.Manufacturer,
                };
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
