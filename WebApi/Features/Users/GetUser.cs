using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Common.Exceptions;
using WebApi.Domain;
using WebApi.Persistence;

namespace WebApi.Features.Users
{
    public class GetUser
    {
        public class Query : IRequest<UserDto>
        {
            [JsonIgnore]
            public string UserId { get; set; }

            [JsonIgnore]
            public string CurrentUserId { get; set; }
        }

        public class QueryHandler : IRequestHandler<Query, UserDto>
        {
            private UserManager<User> _userManager;
            private ForehandContext _db;

            public QueryHandler(UserManager<User> userManager, ForehandContext db)
            {
                _userManager = userManager;
                _db = db;
            }

            public async Task<UserDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUser = await _userManager.FindByIdAsync(request.CurrentUserId);
                var user = await _userManager.FindByIdAsync(request.UserId);

                if (user is null)
                    throw new BadRequestException(ErrorCodes.InvalidId);

                var result = new UserDto
                {
                    Id = user.Id,
                    Email = user.Email,
                    GivenName = user.GivenName,
                    Surname = user.Surname,
                    Role = user.Role,
                    PhoneNumber = user.PhoneNumber
                };

                if (user.Role == RoleEnum.Trainer)
                {
                    var trainer = await _db.Trainers.Include(x => x.RatedBy).SingleOrNotFoundAsync(x => x.Id == request.UserId);
                    result.Bio = trainer.Bio;
                    result.Rating = trainer.Rating;
                    result.NumberOfRatings = trainer.NumberOfRatings;
                    result.ReservationPrice = trainer.ReservationPrice;

                    if (currentUser.Role == RoleEnum.BasicUser)
                        result.HasCurrentUserRatedUser = trainer.HasCustomerRatedTrainer(currentUser.Id);
                }

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

            public string PhoneNumber { get; set; }

            public string Bio { get; set; }

            public double Rating { get; set; }

            public int NumberOfRatings { get; set; }

            public double ReservationPrice { get; set; }

            public bool HasCurrentUserRatedUser { get; set; }
        }
    }
}
