using MediatR;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;
using static WebApi.Features.Courts.GetCourts;

namespace WebApi.Features.Courts
{
    public class GetCourt
    {
        public class Query : IRequest<CourtDto>
        {
            [JsonIgnore]
            public string CourtId { get; set; }
        }

        public class Handler : IRequestHandler<Query, CourtDto>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<CourtDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var court = await _db.Courts.SingleOrNotFoundAsync(x => x.Id == request.CourtId);
                return new CourtDto { Id = court.Id, Label = court.Label, Description = court.Description, ReservationPrice = court.ReservationPrice };
            }
        }
    }
}
