using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Domain;
using WebApi.Persistence;

namespace WebApi.Features.SubscriptionCards
{
    public class GetSubscriptionCardForCustomer
    {
        public class Query : IRequest<SubscriptionCardDto>
        {
            [JsonIgnore]
            public string CustomerId { get; set; }
        }

        public class Handler : IRequestHandler<Query, SubscriptionCardDto>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<SubscriptionCardDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var subscriptionCard = await _db.SubscriptionCards
                    .Include(x => x.Customer)
                    .SingleOrNotFoundAsync(x => x.Customer.Id == request.CustomerId, cancellationToken);

                return new SubscriptionCardDto
                {
                    Id = subscriptionCard.Id,
                    Price = subscriptionCard.Price,
                    DueDate = subscriptionCard.DueDate,
                    SubscriptionType = subscriptionCard.SubscriptionType,
                }; ;
            }
        }

        public class SubscriptionCardDto
        {
            public string Id { get; set; }

            public double Price { get; set; }

            public DateTime DueDate { get; set; }

            public SubscriptionType SubscriptionType { get; set; }
        }
    }
}
