using System;

namespace WebApi.Domain
{
    public class ConsumerGoods : Entity<string>
    {
        public ConsumerGoods(double price, DateTime expirationDate, DateTime productionDate,
            string name, string manufacturer)
        {
            Id = Guid.NewGuid().ToString();
            Price = price;
            ExpirationDate = expirationDate;
            ProductionDate = productionDate;
            Name = name;
            Manufacturer = manufacturer;
        }

        public double Price { get; set; }

        public DateTime ExpirationDate { get; set; }

        public DateTime ProductionDate { get; set; }

        public string Name { get; set; }

        public string Manufacturer { get; set; }

        public Employee Employee { get; private set; }

        public string EmployeeId { get; private set; }

        public Order Order { get; private set; }

        public string OrderId { get; private set; }

        public void SellConsumerGoods(Employee employee, Order order)
        {
            Employee = employee;
            EmployeeId = employee.Id;
            Order = order;
            OrderId = order.Id;
        }
    }
}
