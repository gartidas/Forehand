using MediatR;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;

namespace WebApi.Features.GiftCards
{
    public class DeleteGiftCard
    {
        public class Command : IRequest<Unit>
        {
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
                var giftCard = await _db.GiftCards.SingleOrNotFoundAsync(x => x.Id == request.GiftCardId);
                _db.GiftCards.Remove(giftCard);
                await _db.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }
    }
}
