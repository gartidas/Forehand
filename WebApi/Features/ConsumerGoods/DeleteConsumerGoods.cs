using MediatR;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;

namespace WebApi.Features.ConsumerGoods
{
    public class DeleteConsumerGoods
    {
        public class Command : IRequest<Unit>
        {
            [JsonIgnore]
            public string ConsumerGoodsId { get; set; }
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
                var consumerGoods = await _db.ConsumerGoods.SingleOrNotFoundAsync(x => x.Id == request.ConsumerGoodsId);
                _db.ConsumerGoods.Remove(consumerGoods);
                await _db.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }
    }
}
