namespace WebApi.Domain
{
    public class ReservationSportsGear
    {
        public ReservationSportsGear(Reservation reservation, SportsGear sportsGear)
        {
            Reservation = reservation;
            SportsGear = sportsGear;
            ReservationId = reservation.Id;
            SportsGearId = sportsGear.Id;
        }

        private ReservationSportsGear()
        {
        }

        public string ReservationId { get; private set; }

        public string SportsGearId { get; private set; }

        public Reservation Reservation { get; private set; }

        public SportsGear SportsGear { get; private set; }
    }
}
