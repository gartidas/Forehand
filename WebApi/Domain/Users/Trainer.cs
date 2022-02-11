using System.Collections.Generic;
using System.Linq;
using WebApi.Domain.Common;

namespace WebApi.Domain.Users
{
    public class Trainer : Entity<string>
    {
        public Trainer(string bio, double price, User identityUser)
        {
            RegistrationConfirmed = false;
            _ratings = new List<int>();
            Bio = bio;
            Price = price;
            IdentityUser = identityUser;
            Id = identityUser.Id;
        }

        private Trainer()
        {
        }

        private List<int> _ratings;

        public User IdentityUser { get; private set; }

        public bool RegistrationConfirmed { get; private set; }

        public string Bio { get; private set; }

        public double Rating { get => _ratings.Count > 0 ? _ratings.Average() : 0.0; }

        public double Price { get; private set; }

        public void ConfirmRegistration() => RegistrationConfirmed = true;

        public void AddRating(int rating) => _ratings.Add(rating);

        public void UpdateProfile(string bio, double price)
        {
            Bio = bio;
            Price = price;
        }
    }
}
