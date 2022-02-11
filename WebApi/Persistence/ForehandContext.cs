using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Domain.Common;
using WebApi.Domain.Users;

namespace WebApi.Persistence
{
    public class ForehandContext : DbContext
    {
        private readonly IMediator _mediator;

        public ForehandContext(DbContextOptions options, IMediator mediator) : base(options)
        {
            _mediator = mediator;
        }

        public DbSet<Employee> Employees { get; set; }

        public DbSet<Trainer> Trainers { get; set; }

        public DbSet<Customer> Customers { get; set; }

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
            builder.RemovePluralizingTableNameConvention();
            base.OnModelCreating(builder);

            builder.Entity<Employee>().HasOne(x => x.IdentityUser).WithMany().IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Trainer>().HasOne(x => x.IdentityUser).WithMany().IsRequired().OnDelete(DeleteBehavior.Cascade);
            builder.Entity<Customer>().HasOne(x => x.IdentityUser).WithMany().IsRequired().OnDelete(DeleteBehavior.Cascade);
        }

    }

    internal static class PersistenceExtensions
    {
        public static void RemovePluralizingTableNameConvention(this ModelBuilder modelBuilder)
        {
            foreach (IMutableEntityType entity in modelBuilder.Model.GetEntityTypes())
                entity.SetTableName(entity.DisplayName());
        }
    }
}
