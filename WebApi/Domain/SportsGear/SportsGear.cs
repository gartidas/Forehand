using System;
using System.Collections.Generic;

namespace WebApi.Domain
{
    public class SportsGear : Entity<string>
    {
        private List<ReservationSportsGear> _reservations;

        public SportsGear(double reservationPrice, DateTime registrationDate, string registrationNumber,
            double shoppingPrice, string name, DateTime productionYear,
            PhysicalState physicalState, string manufacturer)
        {
            Id = Guid.NewGuid().ToString();
            ReservationPrice = reservationPrice;
            RegistrationDate = registrationDate;
            RegistrationNumber = registrationNumber;
            ShoppingPrice = shoppingPrice;
            Name = name;
            ProductionYear = productionYear;
            PhysicalState = physicalState;
            Manufacturer = manufacturer;
            _reservations = new();
        }

        public double ReservationPrice { get; set; }

        public DateTime RegistrationDate { get; set; }

        public string RegistrationNumber { get; set; }

        public double ShoppingPrice { get; set; }

        public string Name { get; set; }

        public DateTime ProductionYear { get; set; }

        public PhysicalState PhysicalState { get; set; }

        public string Manufacturer { get; set; }

        public IReadOnlyCollection<ReservationSportsGear> Reservations => _reservations;
    }

    public enum PhysicalState
    {
        Unknown = 0,
        New = 1,
        Used = 2,
        WornOut = 3,
        Damaged = 4,
        Discarded = 5
    }
}
