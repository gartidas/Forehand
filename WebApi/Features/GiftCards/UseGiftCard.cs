using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;

namespace WebApi.Features.GiftCards
{
    public class UseGiftCard
    {
        public class Command : IRequest<Unit>
        {
            [JsonIgnore]
            public string CustomerId { get; set; }

            [JsonIgnore]
            public string GiftCardId { get; set; }
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
                var giftCard = await _db.GiftCards.Include(x => x.Customer).SingleOrNotFoundAsync(x => x.Customer.Id == request.CustomerId && x.Id == request.GiftCardId);
                var result = _db.GiftCards.Remove(giftCard);
                await _db.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }
    }
}
