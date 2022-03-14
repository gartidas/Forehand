using FluentValidation;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Persistence;

namespace WebApi.Features.ConsumerGoods
{
    public class AddConsumerGoods
    {
        public class Command : IRequest<Unit>
        {
            public double Price { get; set; }

            public DateTime ExpirationDate { get; set; }

            public DateTime ProductionDate { get; set; }

            public string Name { get; set; }

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
                var consumerGoods = new WebApi.Domain.ConsumerGoods(request.Price, request.ExpirationDate, request.ProductionDate, request.Name, request.Manufacturer);
                await _db.ConsumerGoods.AddAsync(consumerGoods, cancellationToken);
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
