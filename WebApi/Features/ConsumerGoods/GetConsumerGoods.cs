using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;

namespace WebApi.Features.ConsumerGoods
{
    public class GetConsumerGoods
    {
        public class Query : IRequest<List<ConsumerGoodsDto>>
        {
            [JsonIgnore]
            public string Search { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<ConsumerGoodsDto>>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<List<ConsumerGoodsDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                if (request.Search is null)
                    return await _db.ConsumerGoods
                    .Select(x => new ConsumerGoodsDto
                    {
                        Id = x.Id,
                        Price = x.Price,
                        ExpirationDate = x.ExpirationDate,
                        ProductionDate = x.ProductionDate,
                        Name = x.Name,
                        Manufacturer = x.Manufacturer,
                    })
                    .OrderBy(x => x.Name)
                    .ToListAsync(cancellationToken);

                return await _db.ConsumerGoods
                    .Where(x => (x.Name).Contains(request.Search))
                    .Select(x => new ConsumerGoodsDto
                    {
                        Id = x.Id,
                        Price = x.Price,
                        ExpirationDate = x.ExpirationDate,
                        ProductionDate = x.ProductionDate,
                        Name = x.Name,
                        Manufacturer = x.Manufacturer,
                    })
                    .OrderBy(x => x.Name)
                    .ToListAsync(cancellationToken);
            }
        }

        public class ConsumerGoodsDto
        {
            public string Id { get; set; }

            public double Price { get; set; }

            public DateTime ExpirationDate { get; set; }

            public DateTime ProductionDate { get; set; }

            public string Name { get; set; }

            public string Manufacturer { get; set; }
        }
    }
}
