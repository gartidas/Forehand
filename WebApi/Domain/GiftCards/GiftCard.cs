using System;

namespace WebApi.Domain
{
    public class GiftCard : Entity<string>
    {
        public GiftCard(double price, double value, string code, string name)
        {
            Id = Guid.NewGuid().ToString();
            Price = price;
            Value = value;
            Code = code;
            Name = name;
        }

        public double Price { get; set; }

        public DateTime StartDate { get; private set; }

        public DateTime EndDate { get; private set; }

        public double Value { get; set; }

        public string Code { get; set; }

        public string Name { get; set; }

        public Customer Customer { get; private set; }

        public string CustomerId { get; private set; }

        public Order Order { get; private set; }

        public string OrderId { get; private set; }

        public void BuyGiftCard(Customer customer, Order order, double durationInDays)
        {
            Customer = customer;
            CustomerId = customer.Id;
            Order = order;
            OrderId = order.Id;
            var startDate = DateTime.Now;
            StartDate = startDate;
            EndDate = startDate.AddDays(durationInDays);
        }
    }
}
