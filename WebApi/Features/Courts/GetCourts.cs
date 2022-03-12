using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;

namespace WebApi.Features.Courts
{
    public class GetCourts
    {
        public class Query : IRequest<List<CourtDto>>
        {
            [JsonIgnore]
            public string Search { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<CourtDto>>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<List<CourtDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                if (request.Search is null)
                    return await _db.Courts
                    .Select(x => new CourtDto
                    {
                        Id = x.Id,
                        ReservationPrice = x.ReservationPrice,
                        Label = x.Label,
                        Description = x.Description,
                    })
                    .OrderBy(x => x.Label)
                    .ToListAsync(cancellationToken);

                return await _db.Courts
                    .Where(x => (x.Label).Contains(request.Search))
                    .Select(x => new CourtDto
                    {
                        Id = x.Id,
                        ReservationPrice = x.ReservationPrice,
                        Label = x.Label,
                        Description = x.Description,
                    })
                    .OrderBy(x => x.Label)
                    .ToListAsync(cancellationToken);
            }
        }

        public class CourtDto
        {
            public string Id { get; set; }

            public double ReservationPrice { get; set; }

            public string Label { get; set; }

            public string Description { get; set; }
        }
    }
}
