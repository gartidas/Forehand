using System.Collections.Generic;
using System.Linq;

namespace WebApi.Domain
{
    public class Trainer : Entity<string>
    {
        private List<Reservation> _reservations;
        private List<int> _ratings;

        public Trainer(string bio, double reservationPrice, User identityUser)
        {
            RegistrationConfirmed = false;
            Bio = bio;
            ReservationPrice = reservationPrice;
            IdentityUser = identityUser;
            Id = identityUser.Id;
            _ratings = new();
            _reservations = new();
        }

        private Trainer()
        {
        }

        public User IdentityUser { get; private set; }

        public bool RegistrationConfirmed { get; private set; }

        public string Bio { get; private set; }

        public double ReservationPrice { get; private set; }

        public double Rating => _ratings.Count > 0 ? _ratings.Average() : 0.0;

        public IReadOnlyCollection<Reservation> Reservations => _reservations;

        public IEnumerable<int> Ratings => _ratings;

        public void ChangeRegistrationStatus(bool registrationConfirmed) => RegistrationConfirmed = registrationConfirmed;

        public void AddRating(int rating) => _ratings.Add(rating);

        public void UpdateProfile(string bio, double price)
        {
            Bio = bio;
            ReservationPrice = price;
        }
    }
}
