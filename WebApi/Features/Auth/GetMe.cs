using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Persistence;
using WebApi.Services.Interfaces;

namespace WebApi.Features.Auth
{
    public class GetMe
    {
        public class Query : IRequest<Response>
        {
            public string CurrentUserId { get; set; }
        }

        public class Handler : IRequestHandler<Query, Response>
        {
            private readonly IAuthService _authService;
            private readonly ForehandContext _db;

            public Handler(IAuthService authService, ForehandContext db)
            {
                _authService = authService;
                _db = db;
            }

            public async Task<Response> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _authService.GetUser(request.CurrentUserId);
                var response = new Response
                {
                    Id = user.Id,
                    Email = user.Email,
                    GivenName = user.GivenName,
                    Surname = user.Surname,
                    Role = user.Role,
                };

                if (user.Role == RoleEnum.Trainer)
                {
                    var trainer = await _db.Trainers.Include(x => x.RatedBy).AsQueryable().Where(x => x.Id == request.CurrentUserId).SingleOrDefaultAsync(cancellationToken);
                    response.Bio = trainer.Bio;
                    response.Rating = trainer.Rating;
                    response.ReservationPrice = trainer.ReservationPrice;
                    response.RegistrationConfirmed = trainer.RegistrationConfirmed;
                }

                if (user.Role == RoleEnum.Employee)
                {
                    var employee = await _db.Employees.AsQueryable().Where(x => x.Id == request.CurrentUserId).SingleOrDefaultAsync(cancellationToken);
                    response.RegistrationConfirmed = employee.RegistrationConfirmed;
                }

                return response;
            }
        }

        public class Response
        {
            public string Id { get; set; }

            public string Email { get; set; }

            public string GivenName { get; set; }

            public string Surname { get; set; }

            public RoleEnum Role { get; set; }

            public string Bio { get; set; }

            public double Rating { get; set; }

            public double ReservationPrice { get; set; }

            public bool RegistrationConfirmed { get; set; }
        }
    }
}
