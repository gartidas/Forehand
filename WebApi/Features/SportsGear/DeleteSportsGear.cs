using MediatR;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;


namespace WebApi.Features.SportsGear
{
    public class DeleteSportsGear
    {
        public class Command : IRequest<Unit>
        {
            [JsonIgnore]
            public string SportsGearId { get; set; }
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
                var sportsGear = await _db.SportsGear.SingleOrNotFoundAsync(x => x.Id == request.SportsGearId);
                _db.SportsGear.Remove(sportsGear);
                await _db.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }
    }
}
