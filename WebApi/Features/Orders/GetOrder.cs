using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;
using static WebApi.Features.Orders.GetOrders;

namespace WebApi.Features.Orders
{
    public class GetOrder
    {
        public class Query : IRequest<OrderDto>
        {
            [JsonIgnore]
            public string OrderId { get; set; }
        }

        public class Handler : IRequestHandler<Query, OrderDto>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<OrderDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var order = await _db.Orders.Include(x => x.GiftCards).Include(x => x.Customer).ThenInclude(x => x.IdentityUser)
                    .Include(x => x.ConsumerGoods).Include(x => x.Employee).ThenInclude(x => x.IdentityUser).Include(x => x.Reservations)
                    .SingleOrNotFoundAsync(x => x.Id == request.OrderId);
                return OrderDto.Map(order);
            }
        }
    }
}
