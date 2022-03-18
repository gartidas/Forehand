using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;
using WebApi.Common;
using WebApi.Services.Interfaces;

namespace WebApi.Features.Reservations
{
    [Authorize]
    public class ReservationsHub : HubBase<IReservationsClient>
    {
        public ReservationsHub(ICurrentUserService currentUser) : base(currentUser)
        {
        }
    }

    public interface IReservationsClient
    {
        Task ReceiveReservation(ReservationDto reservation);
        Task RemoveReservation(string reservationId);
    }
}
