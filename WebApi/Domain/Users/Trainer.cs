using System.Collections.Generic;
using System.Linq;

namespace WebApi.Domain
{
    public class Trainer : Entity<string>
    {
        private List<Reservation> _reservations;
        private List<CustomerRating> _ratedBy;

        public Trainer(string bio, double reservationPrice, User identityUser)
        {
            RegistrationConfirmed = false;
            Bio = bio;
            ReservationPrice = reservationPrice;
            IdentityUser = identityUser;
            Id = identityUser.Id;
            _reservations = new();
            _ratedBy = new();
        }

        private Trainer()
        {
        }

        public User IdentityUser { get; private set; }

        public bool RegistrationConfirmed { get; private set; }

        public string Bio { get; private set; }

        public double ReservationPrice { get; private set; }

        public double Rating => _ratedBy.Count > 0 ? _ratedBy.Select(x => x.Rating).Average() : 0.0;

        public int NumberOfRatings => _ratedBy.Count;

        public IReadOnlyCollection<Reservation> Reservations => _reservations;

        public IReadOnlyCollection<CustomerRating> RatedBy => _ratedBy;

        public void ChangeRegistrationStatus(bool registrationConfirmed) => RegistrationConfirmed = registrationConfirmed;

        public void AddRating(Customer ratedBy, int rating)
        {
            if (_ratedBy is null)
                _ratedBy = new();

            _ratedBy.Add(new CustomerRating(ratedBy, this, rating));
        }

        public bool HasCustomerRatedTrainer(string customerId) => _ratedBy.Any(x => x.RatedById == customerId);

        public void UpdateProfile(string bio, double price)
        {
            Bio = bio;
            ReservationPrice = price;
        }
    }
}
