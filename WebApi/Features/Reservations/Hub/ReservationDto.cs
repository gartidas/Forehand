using System;
using System.Collections.Generic;
using System.Linq;
using WebApi.Domain;

namespace WebApi.Features.Reservations
{
    public class ReservationDto
    {
        public string Id { get; set; }

        public double Price { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public ReservationState ReservationState { get; set; }

        public Court Court { get; set; }

        public Trainer Trainer { get; set; }

        public Customer Customer { get; set; }

        public Order Order { get; set; }

        public List<Domain.SportsGear> SportsGear { get; set; }

        public static ReservationDto Map(Reservation reservation)
            => new ReservationDto()
            {
                Id = reservation.Id,
                Court = reservation.Court,
                Customer = reservation.Customer,
                EndDate = reservation.EndDate,
                Order = reservation.Order,
                Price = reservation.Price,
                ReservationState = reservation.ReservationState,
                SportsGear = reservation.SportsGear.Select(x => x.SportsGear).ToList(),
                StartDate = reservation.StartDate,
                Trainer = reservation.Trainer
            };
    }
}
