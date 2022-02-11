using WebApi.Domain.Common;

namespace WebApi.Domain.Users
{
    public class Customer : Entity<string>
    {
        public Customer(User identityUser)
        {
            IdentityUser = identityUser;
            Id = identityUser.Id;
        }

        private Customer()
        {
        }

        public User IdentityUser { get; private set; }
    }
}
