using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Domain.Common;

namespace WebApi.Persistence
{
    public class ForehandContext : DbContext
    {
        private readonly IMediator _mediator;

        public ForehandContext(DbContextOptions options, IMediator mediator) : base(options)
        {
            _mediator = mediator;
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
        {
            for (var i = 0; i < 3; i++) // To prevent infinite loop, number of iteration is capped to 3.
            {
                var events = ChangeTracker.Entries<BaseEntity>().SelectMany(po => po.Entity.ConsumeEvents()).ToList();
                if (events.Count == 0)
                    break;

                foreach (var @event in events)
                    await _mediator.Publish(@event, cancellationToken);
            }

            return await base.SaveChangesAsync(cancellationToken);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
