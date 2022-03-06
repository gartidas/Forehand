using System.Collections.Generic;

namespace WebApi.Domain
{
    public class Customer : Entity<string>
    {
        private List<Reservation> _reservations;
        private List<GiftCard> _giftCards;
        private List<Order> _orders;
        private List<CustomerRating> _ratedTrainers;

        public Customer(User identityUser)
        {
            IdentityUser = identityUser;
            Id = identityUser.Id;
            _reservations = new();
            _giftCards = new();
            _orders = new();
            _ratedTrainers = new();
        }

        private Customer()
        {
        }

        public User IdentityUser { get; private set; }

        public SubscriptionCard SubscriptionCard { get; private set; }

        public string SubscriptionCardId { get; private set; }

        public IReadOnlyCollection<Reservation> Reservations => _reservations;

        public IReadOnlyCollection<GiftCard> GiftCards => _giftCards;

        public IReadOnlyCollection<Order> Orders => _orders;

        public IReadOnlyCollection<CustomerRating> RatedTrainers => _ratedTrainers;

        public void AddSubscriptionCard(SubscriptionCard subscriptionCard)
        {
            SubscriptionCard = subscriptionCard;
            SubscriptionCardId = subscriptionCard.Id;
        }
    }
}
