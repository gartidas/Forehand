using MediatR;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;

namespace WebApi.Features.Courts
{
    public class DeleteCourt
    {
        public class Command : IRequest<Unit>
        {
            [JsonIgnore]
            public string CourtId { get; set; }
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
                var court = await _db.Courts.SingleOrNotFoundAsync(x => x.Id == request.CourtId);
                _db.Courts.Remove(court);
                await _db.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }
    }
}
