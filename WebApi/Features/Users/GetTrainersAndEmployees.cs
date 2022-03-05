using MediatR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Persistence;

namespace WebApi.Features.Users
{
    public class GetTrainersAndEmployees
    {
        public class Query : IRequest<List<UserDto>>
        {
            [JsonIgnore]
            public string Search { get; set; }
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
                if (request.Search is null || request.Search.Length < 3)
                    return new List<UserDto>();

                var trainers = _db.Trainers
                    .Include(x => x.IdentityUser)
                    .Where(x => (x.IdentityUser.Email).Contains(request.Search))
                    .Where(x => (x.IdentityUser.GivenName + " " + x.IdentityUser.Surname).Contains(request.Search))
                    .Select(x => new UserDto
                    {
                        Id = x.IdentityUser.Id,
                        Email = x.IdentityUser.Email,
                        GivenName = x.IdentityUser.GivenName,
                        Surname = x.IdentityUser.Surname,
                        Role = x.IdentityUser.Role,
                        RegistrationConfirmed = x.RegistrationConfirmed
                    })
                    .OrderBy(x => x.Email)
                    .ThenBy(x => x.GivenName)
                    .ThenBy(x => x.Surname)
                    .Take(5);

                var employees = _db.Employees
                  .Include(x => x.IdentityUser)
                  .Where(x => (x.IdentityUser.Email).Contains(request.Search))
                  .Where(x => (x.IdentityUser.GivenName + " " + x.IdentityUser.Surname).Contains(request.Search))
                  .Select(x => new UserDto
                  {
                      Id = x.IdentityUser.Id,
                      Email = x.IdentityUser.Email,
                      GivenName = x.IdentityUser.GivenName,
                      Surname = x.IdentityUser.Surname,
                      Role = x.IdentityUser.Role,
                      RegistrationConfirmed = x.RegistrationConfirmed
                  })
                  .OrderBy(x => x.Email)
                  .ThenBy(x => x.GivenName)
                  .ThenBy(x => x.Surname)
                  .Take(5);

                var result = await trainers.Concat(employees)
                  .OrderBy(x => x.Email)
                  .ThenBy(x => x.GivenName)
                  .ThenBy(x => x.Surname).ToListAsync(cancellationToken);

                return result;
            }
        }

        public class UserDto
        {
            public string Id { get; set; }

            public string Email { get; set; }

            public string GivenName { get; set; }

            public string Surname { get; set; }

            public RoleEnum Role { get; set; }

            public bool RegistrationConfirmed { get; set; }
        }
    }
}
