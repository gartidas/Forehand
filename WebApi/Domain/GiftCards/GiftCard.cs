using System;

namespace WebApi.Domain
{
    public class GiftCard : Entity<string>
    {
        public GiftCard(double price, DateTime startDate, DateTime endDate, double value,
            string code, string name)
        {
            Id = Guid.NewGuid().ToString();
            Price = price;
            StartDate = startDate;
            EndDate = endDate;
            Value = value;
            Code = code;
            Name = name;
        }

        public double Price { get; private set; }

        public DateTime StartDate { get; private set; }

        public DateTime EndDate { get; private set; }

        public double Value { get; private set; }

        public string Code { get; private set; }

        public string Name { get; private set; }

        public Customer Customer { get; private set; }

        public string CustomerId { get; private set; }

        public Order Order { get; private set; }

        public string OrderId { get; private set; }

        public void BuyGiftCard(Customer customer, Order order)
        {
            Customer = customer;
            CustomerId = customer.Id;
            Order = order;
            OrderId = order.Id;
        }
    }
}
