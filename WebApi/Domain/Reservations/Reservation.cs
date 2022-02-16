using System;
using System.Collections.Generic;

namespace WebApi.Domain
{
    public class Reservation : Entity<string>
    {
        private List<ReservationSportsGear> _sportsGear;

        public Reservation(double price, DateTime startDate, DateTime endDate, Court court,
            Customer customer, Trainer trainer)
        {
            Id = Guid.NewGuid().ToString();
            Price = price;
            StartDate = startDate;
            EndDate = endDate;
            Court = court;
            CourtId = court.Id;
            Customer = customer;
            CustomerId = customer.Id;
            ReservationState = ReservationState.Planned;
            _sportsGear = new();

            if (trainer is not null)
            {
                Trainer = trainer;
                TrainerId = trainer.Id;
            }
        }

        private Reservation()
        {
        }

        public double Price { get; private set; }

        public DateTime StartDate { get; private set; }

        public DateTime EndDate { get; private set; }

        public ReservationState ReservationState { get; private set; }

        public Court Court { get; private set; }

        public string CourtId { get; private set; }

        public Trainer Trainer { get; private set; }

        public string TrainerId { get; private set; }

        public Customer Customer { get; private set; }

        public string CustomerId { get; private set; }

        public Order Order { get; private set; }

        public string OrderId { get; private set; }

        public IReadOnlyCollection<ReservationSportsGear> SportsGear => _sportsGear;

        public void FulfillReservation(Order order)
        {
            Order = order;
            OrderId = order.Id;
            ReservationState = ReservationState.Fulfilled;
        }

        public void AddSportsGear(SportsGear sportsGear)
        {
            if (_sportsGear is null)
                _sportsGear = new();

            _sportsGear.Add(new ReservationSportsGear(this, sportsGear));
        }
    }

    public enum ReservationState
    {
        Unknown = 0,
        Planned = 1,
        Confirmed = 2,
        Declined = 3,
        Fulfilled = 4,
        NotFulfilled = 5
    }
}
