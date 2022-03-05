using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Domain;

namespace WebApi.Persistence
{
    public class ForehandContext : DbContext
    {
        private readonly IMediator _mediator;

        public ForehandContext(DbContextOptions options, IMediator mediator) : base(options)
        {
            _mediator = mediator;
        }

        public DbSet<ConsumerGoods> ConsumerGoods { get; set; }

        public DbSet<Court> Courts { get; set; }

        public DbSet<GiftCard> GiftCards { get; set; }

        public DbSet<Order> Orders { get; set; }

        public DbSet<Reservation> Reservations { get; set; }

        public DbSet<ReservationSportsGear> ReservationSportsGears { get; set; }

        public DbSet<SportsGear> SportsGear { get; set; }

        public DbSet<SubscriptionCard> SubscriptionCards { get; set; }

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

            builder.Entity<Employee>().HasOne(x => x.IdentityUser).WithMany().IsRequired();
            builder.Entity<Trainer>().HasOne(x => x.IdentityUser).WithMany().IsRequired();
            builder.Entity<Customer>().HasOne(x => x.IdentityUser).WithMany().IsRequired();

            builder.Entity<Trainer>().Property(x => x.Ratings).HasConversion(
                i => string.Join(",", i),
                s => string.IsNullOrWhiteSpace(s) ? new List<int>() : s.Split(new[] { ',' }).Select(v => int.Parse(v)).ToList()
                );

            builder.Entity<ConsumerGoods>(cg =>
            {
                cg.HasOne(x => x.Employee).WithMany(x => x.ConsumerGoods).OnDelete(DeleteBehavior.NoAction);
                cg.HasOne(x => x.Order).WithMany(x => x.ConsumerGoods).OnDelete(DeleteBehavior.NoAction);
            });

            builder.Entity<GiftCard>(gc =>
            {
                gc.HasOne(x => x.Customer).WithMany(x => x.GiftCards).OnDelete(DeleteBehavior.NoAction);
                gc.HasOne(x => x.Order).WithMany(x => x.GiftCards).OnDelete(DeleteBehavior.NoAction);
            });

            builder.Entity<Order>(o =>
            {
                o.HasOne(x => x.Customer).WithMany(x => x.Orders).OnDelete(DeleteBehavior.NoAction);
                o.HasOne(x => x.Employee).WithMany(x => x.Orders).OnDelete(DeleteBehavior.NoAction);
            });

            builder.Entity<Reservation>(r =>
            {
                r.HasOne(x => x.Court).WithMany(x => x.Reservations).IsRequired();
                r.HasOne(x => x.Customer).WithMany(x => x.Reservations).IsRequired();
                r.HasOne(x => x.Trainer).WithMany(x => x.Reservations).OnDelete(DeleteBehavior.NoAction);
                r.HasOne(x => x.Order).WithMany(x => x.Reservations).OnDelete(DeleteBehavior.NoAction);
            });

            builder.Entity<ReservationSportsGear>(rsg =>
            {
                rsg.HasKey(x => new { x.ReservationId, x.SportsGearId });
                rsg.HasOne(x => x.Reservation).WithMany(x => x.SportsGear);
                rsg.HasOne(x => x.SportsGear).WithMany(x => x.Reservations).OnDelete(DeleteBehavior.NoAction);
            });

            builder.Entity<SubscriptionCard>(sc =>
            {
                sc.HasOne(x => x.Customer).WithOne(x => x.SubscriptionCard).HasForeignKey<SubscriptionCard>(x => x.CustomerId).IsRequired();
                sc.HasOne(x => x.Order).WithOne(x => x.SubscriptionCard).HasForeignKey<SubscriptionCard>(x => x.OrderId).IsRequired().OnDelete(DeleteBehavior.NoAction);
            });
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
