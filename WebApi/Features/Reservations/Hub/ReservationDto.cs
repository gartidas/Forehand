using System;
using System.Collections.Generic;
using System.Linq;
using WebApi.Domain;
using static WebApi.Features.Courts.GetCourts;
using static WebApi.Features.SportsGear.GetSportsGear;
using static WebApi.Features.Users.GetUser;

namespace WebApi.Features.Reservations
{
    public class ReservationDto
    {
        public string Id { get; set; }

        public double Price { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public ReservationState ReservationState { get; set; }

        public CourtDto Court { get; set; }

        public UserDto Trainer { get; set; }

        public UserDto Customer { get; set; }

        //public OrderDto Order { get; set; }

        public List<SportsGearDto> SportsGear { get; set; }

        public static ReservationDto Map(Reservation reservation)
            => new ReservationDto()
            {
                Id = reservation.Id,
                Court = new CourtDto()
                {
                    Id = reservation.Court.Id,
                    Label = reservation.Court.Label,
                    Description = reservation.Court.Description,
                    ReservationPrice = reservation.Court.ReservationPrice,
                },
                Customer = new UserDto()
                {
                    Id = reservation.Customer.IdentityUser.Id,
                    Email = reservation.Customer.IdentityUser.Email,
                    GivenName = reservation.Customer.IdentityUser.GivenName,
                    Surname = reservation.Customer.IdentityUser.Surname,
                    Role = reservation.Customer.IdentityUser.Role,
                },
                EndDate = reservation.EndDate,
                //Order = reservation.Order,
                Price = reservation.Price,
                ReservationState = reservation.ReservationState,
                SportsGear = reservation.SportsGear.Select(x => new SportsGearDto()
                {
                    Id = x.SportsGear.Id,
                    ReservationPrice = x.SportsGear.ReservationPrice,
                    RegistrationDate = x.SportsGear.RegistrationDate,
                    RegistrationNumber = x.SportsGear.RegistrationNumber,
                    ShoppingPrice = x.SportsGear.ShoppingPrice,
                    Name = x.SportsGear.Name,
                    ProductionYear = x.SportsGear.ProductionYear,
                    PhysicalState = x.SportsGear.PhysicalState,
                    Manufacturer = x.SportsGear.Manufacturer,
                }).ToList(),
                StartDate = reservation.StartDate,
                Trainer = reservation.Trainer is not null ? new UserDto()
                {
                    Id = reservation.Trainer.IdentityUser.Id,
                    Email = reservation.Trainer.IdentityUser.Email,
                    GivenName = reservation.Trainer.IdentityUser.GivenName,
                    Surname = reservation.Trainer.IdentityUser.Surname,
                    Role = reservation.Trainer.IdentityUser.Role,
                    ReservationPrice = reservation.Trainer.ReservationPrice,
                    Bio = reservation.Trainer.Bio
                } : null
            };
    }
}
