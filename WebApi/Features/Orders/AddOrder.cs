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
using WebApi.Domain;
using WebApi.Persistence;

namespace WebApi.Features.Orders
{
    public class AddOrder
    {
        public class Command : IRequest<Unit>
        {
            [JsonIgnore]
            public string CustomerId { get; set; }

            [JsonIgnore]
            public string EmployeeId { get; set; }

            public PaymentMethod PaymentMethod { get; set; }

            public OrderState OrderState { get; set; }

            public double TotalSum { get; set; }

            public string SubscriptionCardId { get; set; }

            public List<string> GiftCardIds { get; set; }

            public List<string> ConsumerGoodsIds { get; set; }

            public List<string> ReservationIds { get; set; }
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
                if (request.CustomerId is null && request.EmployeeId is null)
                    throw new BadRequestException(ErrorCodes.InvalidId);

                var customer = await _db.Customers.Include(x => x.IdentityUser).Include(x => x.Orders).SingleOrDefaultAsync(x => x.Id == request.CustomerId);

                var employee = await _db.Employees.Include(x => x.IdentityUser).Include(x => x.Orders).SingleOrDefaultAsync(x => x.Id == request.EmployeeId);

                if (customer is null && employee is null)
                    throw new BadRequestException(ErrorCodes.InvalidId);

                var trackingNumber = _db.Orders.Any() ? _db.Orders.Select(x => x.TrackingNumber).Max(x => x) + 1 : 1;
                var subscriptionCard = await _db.SubscriptionCards.Include(x => x.Order).SingleOrDefaultAsync(x => x.Id == request.SubscriptionCardId);

                var order = new Order(new DateTime(), trackingNumber, request.PaymentMethod, request.OrderState, request.TotalSum, subscriptionCard, customer, employee);
                await _db.Orders.AddAsync(order, cancellationToken);

                if (customer is not null)
                {
                    var giftCards = await _db.GiftCards.Include(x => x.Order).Where(x => request.GiftCardIds.Any(y => y == x.Id)).ToListAsync(cancellationToken);
                    var reservations = await _db.Reservations.Include(x => x.Order).Where(x => request.ReservationIds.Any(y => y == x.Id)).ToListAsync(cancellationToken);

                    foreach (var giftCard in giftCards)
                    {
                        giftCard.BuyGiftCard(customer, order, 30);
                    }

                    foreach (var reservation in reservations)
                    {
                        reservation.ConfirmReservation(order);
                    }
                }

                if (employee is not null)
                {
                    var consumerGoods = await _db.ConsumerGoods.Include(x => x.Order).Where(x => request.ConsumerGoodsIds.Any(y => y == x.Id)).ToListAsync(cancellationToken);

                    foreach (var item in consumerGoods)
                    {
                        item.SellConsumerGoods(employee, order);
                    }
                }

                await _db.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }

        public class Validator : AbstractValidator<Command>
        {
            public Validator()
            {
                RuleFor(x => x.TotalSum)
                    .NotEmpty().WithErrorCode(ErrorCodes.Required)
                    .Must(x => x > 0).WithErrorCode(ErrorCodes.MinimalValue).WithState(_ => new { Min = 0 });

                RuleFor(x => x.PaymentMethod).Must(x => x > 0 && (int)x < 4).WithErrorCode(ErrorCodes.NotSupported);

                RuleFor(x => x.OrderState).Must(x => x > 0 && (int)x < 4).WithErrorCode(ErrorCodes.NotSupported);
            }
        }
    }
}
