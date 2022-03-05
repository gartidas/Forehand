using System.Collections.Generic;

namespace WebApi.Domain
{
    public class Employee : Entity<string>
    {
        private List<Order> _orders;
        private List<ConsumerGoods> _consumerGoods;

        public Employee(User identityUser)
        {
            RegistrationConfirmed = false;
            IdentityUser = identityUser;
            Id = identityUser.Id;
            _orders = new();
            _consumerGoods = new();
        }

        private Employee()
        {
        }

        public User IdentityUser { get; private set; }

        public bool RegistrationConfirmed { get; private set; }

        public IReadOnlyCollection<Order> Orders => _orders;

        public IReadOnlyCollection<ConsumerGoods> ConsumerGoods => _consumerGoods;

        public void ChangeRegistrationStatus(bool registrationConfirmed) => RegistrationConfirmed = registrationConfirmed;
    }
}
