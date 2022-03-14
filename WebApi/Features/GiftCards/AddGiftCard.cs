using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Common.Exceptions;
using WebApi.Domain;
using WebApi.Persistence;

namespace WebApi.Features.GiftCards
{
    public class AddGiftCard
    {
        public class Command : IRequest<Unit>
        {
            public double Price { get; set; }

            public double Value { get; set; }

            public string Code { get; set; }

            public string Name { get; set; }
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
                if (await _db.GiftCards.AnyAsync(x => x.Code == request.Code, cancellationToken))
                    throw new BadRequestException(ErrorCodes.AlreadyExists);

                var giftCard = new GiftCard(request.Price, request.Value, request.Code, request.Name);

                var result = await _db.GiftCards.AddAsync(giftCard, cancellationToken);
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

                RuleFor(x => x.Value)
                   .NotEmpty().WithErrorCode(ErrorCodes.Required)
                   .Must(x => x > 0).WithErrorCode(ErrorCodes.MinimalValue).WithState(_ => new { Min = 0 });

                RuleFor(x => x.Name)
                    .NotEmpty().WithErrorCode(ErrorCodes.Required)
                    .MinimumLength(3).WithErrorCode(ErrorCodes.MinLength).WithState(_ => new { MinLength = 3 })
                    .MaximumLength(30).WithErrorCode(ErrorCodes.MaxLength).WithState(_ => new { MaxLength = 30 });

                RuleFor(x => x.Code)
                  .NotEmpty().WithErrorCode(ErrorCodes.Required)
                  .MinimumLength(3).WithErrorCode(ErrorCodes.MinLength).WithState(_ => new { MinLength = 3 })
                  .MaximumLength(30).WithErrorCode(ErrorCodes.MaxLength).WithState(_ => new { MaxLength = 30 });
            }
        }
    }
}
