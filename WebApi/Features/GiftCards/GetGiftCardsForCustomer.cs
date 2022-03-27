using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;
using static WebApi.Features.GiftCards.GetGiftCards;

namespace WebApi.Features.GiftCards
{
    public class GetGiftCardsForCustomer
    {
        public class Query : IRequest<List<GiftCardDto>>
        {
            [JsonIgnore]
            public string CustomerId { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<GiftCardDto>>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<List<GiftCardDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _db.GiftCards
                    .Include(x => x.Customer)
                    .Where(x => x.Customer.Id == request.CustomerId)
                    .Select(x => new GiftCardDto
                    {
                        Id = x.Id,
                        Price = x.Price,
                        Value = x.Value,
                        Code = x.Code,
                        Name = x.Name,
                    })
                    .OrderBy(x => x.Name)
                    .ToListAsync(cancellationToken);
            }
        }
    }
}
