using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;
using static WebApi.Features.Users.GetUser;

namespace WebApi.Features.Reservations.Statistics
{
    public class GetTrainerReservationStatistics
    {
        public class Query : IRequest<List<TrainerStatisticsDto>>
        {
        }

        public class Handler : IRequestHandler<Query, List<TrainerStatisticsDto>>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<List<TrainerStatisticsDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _db.Trainers.Include(x => x.Reservations).Include(x => x.IdentityUser)
                    .Select(x => new TrainerStatisticsDto
                    {
                        Trainer = new UserDto()
                        {
                            Id = x.IdentityUser.Id,
                            Email = x.IdentityUser.Email,
                            GivenName = x.IdentityUser.GivenName,
                            Surname = x.IdentityUser.Surname,
                            Role = x.IdentityUser.Role,
                            ReservationPrice = x.ReservationPrice,
                            Bio = x.Bio
                        },
                        NumberOfReservations = x.Reservations.Count(),
                    })
                    .OrderBy(x => x.NumberOfReservations)
                    .ToListAsync(cancellationToken);
            }
        }

        public class TrainerStatisticsDto
        {
            public UserDto Trainer { get; set; }

            public int NumberOfReservations { get; set; }
        }
    }
}
