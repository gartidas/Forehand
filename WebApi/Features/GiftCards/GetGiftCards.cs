using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;

namespace WebApi.Features.GiftCards
{
    public class GetGiftCards
    {
        public class Query : IRequest<List<GiftCardDto>>
        {
            [JsonIgnore]
            public string Search { get; set; }
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
                if (request.Search is null)
                    return await _db.GiftCards
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

                return await _db.GiftCards
                    .Where(x => (x.Name).Contains(request.Search) || (x.Code).Contains(request.Search))
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

        public class GiftCardDto
        {
            public string Id { get; set; }

            public double Price { get; set; }

            public double Value { get; set; }

            public string Code { get; set; }

            public string Name { get; set; }
        }
    }
}
