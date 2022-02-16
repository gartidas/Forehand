using System;
using System.Collections.Generic;

namespace WebApi.Domain
{
    public class Court : Entity<string>
    {
        private List<Reservation> _reservations;

        public Court(double reservationPrice, string label, string description)
        {
            Id = Guid.NewGuid().ToString();
            ReservationPrice = reservationPrice;
            Label = label;
            Description = description;
            _reservations = new();
        }

        public double ReservationPrice { get; private set; }

        public string Label { get; private set; }

        public string Description { get; private set; }

        public IReadOnlyCollection<Reservation> Reservations => _reservations;
    }
}
