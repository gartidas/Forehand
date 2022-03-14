using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Common.Exceptions;
using WebApi.Persistence;
using static WebApi.Features.Courts.GetCourts;

namespace WebApi.Features.Courts
{
    public class EditCourt
    {
        public class Command : IRequest<CourtDto>
        {
            [JsonIgnore]
            public string CourtId { get; set; }

            public double ReservationPrice { get; set; }

            public string Label { get; set; }

            public string Description { get; set; }
        }

        public class Handler : IRequestHandler<Command, CourtDto>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<CourtDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var court = await _db.Courts.SingleOrNotFoundAsync(x => x.Id == request.CourtId);

                if (court.Label != request.Label && await _db.Courts.AnyAsync(x => x.Label == request.Label, cancellationToken))
                    throw new BadRequestException(ErrorCodes.AlreadyExists);

                court.ReservationPrice = request.ReservationPrice;
                court.Label = request.Label;
                court.Description = request.Description;

                await _db.SaveChangesAsync(cancellationToken);
                return new CourtDto { Id = court.Id, Label = court.Label, Description = court.Description, ReservationPrice = court.ReservationPrice };
            }
        }

        public class Validator : AbstractValidator<Command>
        {
            public Validator()
            {
                RuleFor(x => x.ReservationPrice)
                    .NotEmpty().WithErrorCode(ErrorCodes.Required)
                    .Must(x => x > 0).WithErrorCode(ErrorCodes.MinimalValue).WithState(_ => new { Min = 0 });

                RuleFor(x => x.Label)
                    .NotEmpty().WithErrorCode(ErrorCodes.Required)
                    .MinimumLength(3).WithErrorCode(ErrorCodes.MinLength).WithState(_ => new { MinLength = 3 })
                    .MaximumLength(30).WithErrorCode(ErrorCodes.MaxLength).WithState(_ => new { MaxLength = 30 });
            }
        }
    }
}
