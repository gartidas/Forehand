using System;
using System.Collections.Generic;

namespace WebApi.Domain
{
    public class Order : Entity<string>
    {
        private List<GiftCard> _giftCards;
        private List<ConsumerGoods> _consumerGoods;
        private List<Reservation> _reservations;

        public Order(DateTime creationDate, long trackingNumber, PaymentMethod paymentMethod,
            OrderState orderState, double totalSum, SubscriptionCard subscriptionCard,
            Customer customer, Employee employee)
        {
            Id = Guid.NewGuid().ToString();
            CreationDate = creationDate;
            TrackingNumber = trackingNumber;
            PaymentMethod = paymentMethod;
            OrderState = orderState;
            TotalSum = totalSum;
            _giftCards = new();
            _consumerGoods = new();

            if (subscriptionCard is not null)
            {
                SubscriptionCard = subscriptionCard;
                SubscriptionCardId = subscriptionCard.Id;
            }

            if (customer is not null)
            {
                Customer = customer;
                CustomerId = customer.Id;
            }

            if (employee is not null)
            {
                Employee = employee;
                EmployeeId = employee.Id;
            }
        }

        private Order()
        {
        }

        public DateTime CreationDate { get; private set; }

        public long TrackingNumber { get; private set; }

        public PaymentMethod PaymentMethod { get; private set; }

        public OrderState OrderState { get; private set; }

        public double TotalSum { get; private set; }

        public SubscriptionCard SubscriptionCard { get; private set; }

        public string SubscriptionCardId { get; private set; }

        public Customer Customer { get; private set; }

        public string CustomerId { get; private set; }

        public Employee Employee { get; private set; }

        public string EmployeeId { get; private set; }

        public IReadOnlyCollection<GiftCard> GiftCards => _giftCards;

        public IReadOnlyCollection<ConsumerGoods> ConsumerGoods => _consumerGoods;

        public IReadOnlyCollection<Reservation> Reservations => _reservations;

        public void FulfillOrder() => OrderState = OrderState.Fulfilled;

        public void RefundOrder() => OrderState = OrderState.Refunded;
    }

    public enum PaymentMethod
    {
        Unknown = 0,
        Cash = 1,
        CreditCard = 2,
        DebitCard = 3,
    }

    public enum OrderState
    {
        Unknown = 0,
        NotFulfilled = 1,
        Fulfilled = 2,
        Refunded = 3,
    }
}
