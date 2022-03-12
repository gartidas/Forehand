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

        public double ReservationPrice { get; set; }

        public string Label { get; set; }

        public string Description { get; set; }

        public IReadOnlyCollection<Reservation> Reservations => _reservations;
    }
}
