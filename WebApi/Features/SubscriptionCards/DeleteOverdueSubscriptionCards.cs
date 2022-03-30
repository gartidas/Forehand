using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;

namespace WebApi.Features.SubscriptionCards
{
    public class DeleteOverdueSubscriptionCards
    {
        public class Command : IRequest<Unit>
        {
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
                var currentDate = DateTime.Now;
                var subscriptionCards = await _db.SubscriptionCards.Where(x => x.DueDate < currentDate).ToListAsync(cancellationToken);

                _db.SubscriptionCards.RemoveRange(subscriptionCards);
                await _db.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }
    }
}
