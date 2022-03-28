using System;

namespace WebApi.Domain
{
    public class SubscriptionCard : Entity<string>
    {
        public SubscriptionCard(double price, DateTime dueDate,
            SubscriptionType subscriptionType)
        {
            Id = Guid.NewGuid().ToString();
            Price = price;
            DueDate = dueDate;
            SubscriptionType = subscriptionType;
        }

        private SubscriptionCard()
        {
        }

        public double Price { get; private set; }

        public DateTime DueDate { get; private set; }

        public SubscriptionType SubscriptionType { get; private set; }

        public Customer Customer { get; private set; }

        public string CustomerId { get; private set; }

        public Order Order { get; private set; }

        public string OrderId { get; private set; }
    }

    public enum SubscriptionType
    {
        Unknown = 0,
        Basic = 1,
        Silver = 2,
        Gold = 3,
    }
}
