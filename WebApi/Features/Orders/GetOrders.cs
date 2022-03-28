using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Domain;
using WebApi.Features.Reservations;
using WebApi.Persistence;
using static WebApi.Features.ConsumerGoods.GetConsumerGoods;
using static WebApi.Features.GiftCards.GetGiftCards;
using static WebApi.Features.SubscriptionCards.GetSubscriptionCardForCustomer;
using static WebApi.Features.Users.GetUser;

namespace WebApi.Features.Orders
{
    public class GetOrders
    {
        public class Query : IRequest<List<OrderDto>>
        {
            [JsonIgnore]
            public string Search { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<OrderDto>>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<List<OrderDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                if (request.Search is null)
                    return await _db.Orders.Include(x => x.GiftCards).Include(x => x.Customer).ThenInclude(x => x.IdentityUser)
                    .Include(x => x.ConsumerGoods).Include(x => x.Employee).ThenInclude(x => x.IdentityUser).Include(x => x.Reservations)
                    .Include(x => x.SubscriptionCard)
                    .Select(x => OrderDto.Map(x))
                    .OrderBy(x => x.CreationDate)
                    .ToListAsync(cancellationToken);

                return await _db.Orders.Include(x => x.GiftCards).Include(x => x.Customer).ThenInclude(x => x.IdentityUser)
                    .Include(x => x.ConsumerGoods).Include(x => x.Employee).ThenInclude(x => x.IdentityUser).Include(x => x.Reservations)
                    .Include(x => x.SubscriptionCard)
                    .Where(x => (x.TrackingNumber.ToString()).Contains(request.Search))
                    .Select(x => OrderDto.Map(x))
                    .OrderBy(x => x.CreationDate)
                    .ToListAsync(cancellationToken);
            }
        }

        public class OrderDto
        {
            public string Id { get; set; }

            public DateTime CreationDate { get; set; }

            public long TrackingNumber { get; set; }

            public PaymentMethod PaymentMethod { get; set; }

            public OrderState OrderState { get; set; }

            public double TotalSum { get; set; }

            public SubscriptionCardDto SubscriptionCard { get; set; }

            public UserDto Customer { get; set; }

            public UserDto Employee { get; set; }

            public List<GiftCardDto> GiftCards { get; set; }

            public List<ConsumerGoodsDto> ConsumerGoods { get; set; }

            public List<ReservationDto> Reservations { get; set; }

            public static OrderDto Map(Order order)
           => new OrderDto()
           {
               Id = order.Id,
               CreationDate = order.CreationDate,
               TrackingNumber = order.TrackingNumber,
               PaymentMethod = order.PaymentMethod,
               OrderState = order.OrderState,
               TotalSum = order.TotalSum,
               Customer = order.Customer is not null ? new UserDto()
               {
                   Id = order.Customer.IdentityUser.Id,
                   Email = order.Customer.IdentityUser.Email,
                   GivenName = order.Customer.IdentityUser.GivenName,
                   Surname = order.Customer.IdentityUser.Surname,
                   Role = order.Customer.IdentityUser.Role,
               } : null,
               Employee = order.Employee is not null ? new UserDto()
               {
                   Id = order.Employee.IdentityUser.Id,
                   Email = order.Employee.IdentityUser.Email,
                   GivenName = order.Employee.IdentityUser.GivenName,
                   Surname = order.Employee.IdentityUser.Surname,
                   Role = order.Employee.IdentityUser.Role,
               } : null,
               GiftCards = order.GiftCards.Select(x => new GiftCardDto()
               {
                   Id = x.Id,
                   Price = x.Price,
                   Value = x.Value,
                   Code = x.Code,
                   Name = x.Name,
               }).ToList(),
               ConsumerGoods = order.ConsumerGoods.Select(x => new ConsumerGoodsDto()
               {
                   Id = x.Id,
                   Price = x.Price,
                   ExpirationDate = x.ExpirationDate,
                   ProductionDate = x.ProductionDate,
                   Name = x.Name,
                   Manufacturer = x.Manufacturer,
               }).ToList(),
               Reservations = order.Reservations.Select(x => ReservationDto.Map(x)).ToList(),
               SubscriptionCard = order.SubscriptionCard is not null ? new SubscriptionCardDto
               {
                   Id = order.SubscriptionCard.Id,
                   DueDate = order.SubscriptionCard.DueDate,
                   Price = order.SubscriptionCard.Price,
                   SubscriptionType = order.SubscriptionCard.SubscriptionType,
               } : null
           };
        }
    }
}
