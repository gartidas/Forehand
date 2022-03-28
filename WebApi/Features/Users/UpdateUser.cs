using FluentValidation;
using MediatR;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Persistence;
using WebApi.Services.Interfaces;

namespace WebApi.Features.Users
{
    public class UpdateUser
    {
        public class Command : IRequest<string>
        {
            [JsonIgnore]
            public string UserId { get; set; }

            public string GivenName { get; set; }

            public string Surname { get; set; }

            public string PhoneNumber { get; set; }

            public string Bio { get; set; }

            public double? ReservationPrice { get; set; }
        }

        public class Handler : IRequestHandler<Command, string>
        {
            private readonly IAuthService _authService;
            private readonly ForehandContext _db;

            public Handler(IAuthService authService, ForehandContext db)
            {
                _authService = authService;
                _db = db;
            }

            public async Task<string> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _authService.GetUser(request.UserId);

                user.GivenName = request.GivenName;
                user.Surname = request.Surname;
                user.PhoneNumber = request.PhoneNumber;

                if (user.Role == RoleEnum.Trainer)
                {
                    var trainer = await _db.Trainers.SingleOrNotFoundAsync(x => x.Id == request.UserId, cancellationToken);
                    trainer.Bio = request.Bio;
                    trainer.ReservationPrice = request.ReservationPrice ?? default;
                }

                await _db.SaveChangesAsync(cancellationToken);
                return user.Id;
            }
        }

        public class Validator : AbstractValidator<Command>
        {
            private readonly IAuthService _authService;
            private readonly ICurrentUserService _currentUserService;

            public Validator(IAuthService authService, ICurrentUserService currentUserService)
            {
                _authService = authService;
                _currentUserService = currentUserService;

                RuleFor(x => x.GivenName)
                    .NotEmpty().WithErrorCode(ErrorCodes.Required)
                    .MinimumLength(2).WithErrorCode(ErrorCodes.MinLength).WithState(_ => new { MinLength = 2 })
                    .MaximumLength(30).WithErrorCode(ErrorCodes.MaxLength).WithState(_ => new { MaxLength = 30 });

                RuleFor(x => x.PhoneNumber)
                   .NotEmpty().WithErrorCode(ErrorCodes.Required);

                RuleFor(x => x.Surname)
                    .NotEmpty().WithErrorCode(ErrorCodes.Required)
                    .MinimumLength(2).WithErrorCode(ErrorCodes.MinLength).WithState(_ => new { MinLength = 2 })
                    .MaximumLength(30).WithErrorCode(ErrorCodes.MaxLength).WithState(_ => new { MaxLength = 30 });

                RuleFor(x => x.ReservationPrice).Must((command, reservationPrice) => NotBeEmptyForTrainer(command, reservationPrice)).WithErrorCode(ErrorCodes.MustNotBeEmpty);
            }

            private bool NotBeEmptyForTrainer(Command _, double? reservationPrice)
            {
                if (_currentUserService.Role == RoleEnum.Trainer && reservationPrice is null)
                    return false;

                return true;
            }
        }
    }
}
