using FluentValidation;
using MediatR;
using Newtonsoft.Json;
using System;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Persistence;
using static WebApi.Features.ConsumerGoods.GetConsumerGoods;

namespace WebApi.Features.ConsumerGoods
{
    public class EditConsumerGoods
    {
        public class Command : IRequest<ConsumerGoodsDto>
        {
            [JsonIgnore]
            public string ConsumerGoodsId { get; set; }

            public double Price { get; set; }

            public DateTime ExpirationDate { get; set; }

            public DateTime ProductionDate { get; set; }

            public string Name { get; set; }

            public string Manufacturer { get; set; }
        }

        public class Handler : IRequestHandler<Command, ConsumerGoodsDto>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<ConsumerGoodsDto> Handle(Command request, CancellationToken cancellationToken)
            {
                var consumerGoods = await _db.ConsumerGoods.SingleOrNotFoundAsync(x => x.Id == request.ConsumerGoodsId);

                consumerGoods.Price = request.Price;
                consumerGoods.ExpirationDate = request.ExpirationDate;
                consumerGoods.ProductionDate = request.ProductionDate;
                consumerGoods.Name = request.Name;
                consumerGoods.Manufacturer = request.Manufacturer;

                await _db.SaveChangesAsync(cancellationToken);
                return new ConsumerGoodsDto
                {
                    Id = consumerGoods.Id,
                    Price = consumerGoods.Price,
                    ExpirationDate = consumerGoods.ExpirationDate,
                    ProductionDate = consumerGoods.ProductionDate,
                    Name = consumerGoods.Name,
                    Manufacturer = consumerGoods.Manufacturer,
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

                RuleFor(x => x.Name)
                    .NotEmpty().WithErrorCode(ErrorCodes.Required)
                    .MinimumLength(3).WithErrorCode(ErrorCodes.MinLength).WithState(_ => new { MinLength = 3 })
                    .MaximumLength(30).WithErrorCode(ErrorCodes.MaxLength).WithState(_ => new { MaxLength = 30 });

                RuleFor(x => x.ProductionDate)
                     .NotEmpty().WithErrorCode(ErrorCodes.Required)
                     .LessThanOrEqualTo(DateTime.Now.Date).WithErrorCode(ErrorCodes.MustBeInThePast);

                RuleFor(x => x.ExpirationDate)
                    .NotEmpty().WithErrorCode(ErrorCodes.Required)
                    .GreaterThanOrEqualTo(DateTime.Now.Date).WithErrorCode(ErrorCodes.MustBeInThePast)
                    .GreaterThanOrEqualTo(x => x.ProductionDate).WithErrorCode(ErrorCodes.MustBeAfterStartDate);

                RuleFor(x => x.Manufacturer)
                 .NotEmpty().WithErrorCode(ErrorCodes.Required)
                 .MinimumLength(3).WithErrorCode(ErrorCodes.MinLength).WithState(_ => new { MinLength = 3 })
                 .MaximumLength(30).WithErrorCode(ErrorCodes.MaxLength).WithState(_ => new { MaxLength = 30 });
            }
        }
    }
}
