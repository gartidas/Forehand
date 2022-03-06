using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;

namespace WebApi.Features.Users
{
    public class AddRating
    {
        public class Command : IRequest<Unit>
        {
            [JsonIgnore]
            public string UserId { get; set; }

            [JsonIgnore]
            public string CurrentUserId { get; set; }

            public int Rating { get; set; }
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
                var customer = await _db.Customers.Include(x => x.RatedTrainers).SingleOrNotFoundAsync(x => x.Id == request.CurrentUserId);
                var trainer = await _db.Trainers.Include(x => x.RatedBy).SingleOrNotFoundAsync(x => x.Id == request.UserId);

                if (!trainer.HasCustomerRatedTrainer(request.CurrentUserId))
                {
                    trainer.AddRating(customer, request.Rating);
                }

                await _db.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }
    }
}
