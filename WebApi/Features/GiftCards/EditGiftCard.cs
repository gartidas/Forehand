using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Common.Exceptions;
using WebApi.Persistence;
using static WebApi.Features.GiftCards.GetGiftCards;

namespace WebApi.Features.GiftCards
{
    public class EditGiftCard
    {
        public class Command : IRequest<GiftCardDto>
        {
            [JsonIgnore]
            public string GiftCardId { get; set; }

            public double Price { get; set; }

            public double Value { get; set; }

            public string Code { get; set; }

            public string Name { get; set; }
        }

        public class Handler : IRequestHandler<Command, GiftCardDto>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<GiftCardDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var giftCard = await _db.GiftCards.SingleOrNotFoundAsync(x => x.Id == request.GiftCardId);

                if (giftCard.Code != request.Code && await _db.GiftCards.AnyAsync(x => x.Code == request.Code, cancellationToken))
                    throw new BadRequestException(ErrorCodes.AlreadyExists);

                giftCard.Price = request.Price;
                giftCard.Value = request.Value;
                giftCard.Code = request.Code;
                giftCard.Name = request.Name;

                await _db.SaveChangesAsync(cancellationToken);
                return new GiftCardDto
                {
                    Id = giftCard.Id,
                    Price = giftCard.Price,
                    Value = giftCard.Value,
                    Code = giftCard.Code,
                    Name = giftCard.Name,
                };
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
