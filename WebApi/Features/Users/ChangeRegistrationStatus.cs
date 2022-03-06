using MediatR;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Domain;
using WebApi.Persistence;

namespace WebApi.Features.Users
{
    public class ChangeRegistrationStatus
    {
        public class Command : IRequest<Unit>
        {
            [JsonIgnore]
            public string UserId { get; set; }

            public bool RegistrationStatus { get; set; }
        }

        public class Handler : IRequestHandler<Command, Unit>
        {
            private readonly ForehandContext _db;
            private readonly UserManager<User> _userManager;

            public Handler(ForehandContext db, UserManager<User> userManager)
            {
                _db = db;
                _userManager = userManager;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByIdAsync(request.UserId);

                if (user.Role == RoleEnum.Trainer)
                {
                    var trainer = await _db.Trainers.SingleOrNotFoundAsync(x => x.Id == request.UserId);
                    trainer.ChangeRegistrationStatus(request.RegistrationStatus);
                }
                if (user.Role == RoleEnum.Employee)
                {
                    var employee = await _db.Employees.SingleOrNotFoundAsync(x => x.Id == request.UserId);
                    employee.ChangeRegistrationStatus(request.RegistrationStatus);
                }

                await _db.SaveChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }
    }
}
