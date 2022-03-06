namespace WebApi.Domain
{
    public class CustomerRatings
    {
        public CustomerRatings(Customer ratedBy, Trainer ratedTrainer)
        {
            RatedBy = ratedBy;
            RatedTrainer = ratedTrainer;
            RatedById = ratedBy.Id;
            RatedTrainerId = ratedTrainer.Id;
        }

        private CustomerRatings()
        {
        }

        public string RatedById { get; private set; }

        public string RatedTrainerId { get; private set; }

        public Customer RatedBy { get; private set; }

        public Trainer RatedTrainer { get; private set; }
    }
}
