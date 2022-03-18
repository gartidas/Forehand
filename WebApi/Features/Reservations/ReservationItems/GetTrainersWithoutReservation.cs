using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;
using static WebApi.Features.Users.GetUser;

namespace WebApi.Features.Reservations.ReservationItems
{
    public class GetTrainersWithoutReservation
    {
        public class Query : IRequest<List<UserDto>>
        {
            public DateTime FromDate { get; set; }
            public DateTime ToDate { get; set; }
        }

        public class Handler : IRequestHandler<Query, List<UserDto>>
        {
            private readonly ForehandContext _db;

            public Handler(ForehandContext db)
            {
                _db = db;
            }

            public async Task<List<UserDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _db.Trainers.Include(x => x.Reservations)
                    .Where(x => x.Reservations.All(x => x.EndDate < request.FromDate || x.StartDate > request.ToDate))
                    .Select(x => new UserDto
                    {
                        Id = x.IdentityUser.Id,
                        Email = x.IdentityUser.Email,
                        GivenName = x.IdentityUser.GivenName,
                        Surname = x.IdentityUser.Surname,
                        Role = x.IdentityUser.Role,
                        ReservationPrice = x.ReservationPrice
                    })
                  .OrderBy(x => x.Email)
                  .ThenBy(x => x.GivenName)
                  .ThenBy(x => x.Surname)
                  .ToListAsync(cancellationToken);
            }
        }
    }
}
