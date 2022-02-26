using FluentValidation;
using MediatR;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Common.Exceptions;
using WebApi.Services.Interfaces;

namespace Fiesta.Application.Features.Auth
{
    public class Register
    {
        public class Command : IRequest<string>
        {
            public string Email { get; set; }

            public string Password { get; set; }

            public string GivenName { get; set; }

            public string Surname { get; set; }

            public RoleEnum Role { get; set; }

            public string PhoneNumber { get; set; }

            public string Bio { get; set; }

            public double? ReservationPrice { get; set; }
        }

        public class Handler : IRequestHandler<Command, string>
        {
            private readonly IAuthService _authService;

            public Handler(IAuthService authService)
            {
                _authService = authService;
            }

            public async Task<string> Handle(Command request, CancellationToken cancellationToken)
            {
                var userIdResult = await _authService.Register(request, cancellationToken);
                if (userIdResult.Failed)
                    throw new BadRequestException(userIdResult.Errors);

                return userIdResult.Data;
            }
        }

        public class Validator : AbstractValidator<Command>
        {
            private readonly IAuthService _authService;

            public Validator(IAuthService authService)
            {
                _authService = authService;
                RuleFor(x => x.Email)
                    .NotEmpty().WithErrorCode(ErrorCodes.Required)
                    .EmailAddress().WithErrorCode(ErrorCodes.InvalidEmailAddress)
                    .MustAsync(BeUnique).WithErrorCode(ErrorCodes.MustBeUnique);

                RuleFor(x => x.Password)
                    .NotEmpty().WithErrorCode(ErrorCodes.Required)
                    .MinimumLength(6).WithErrorCode(ErrorCodes.MinLength).WithState(_ => new { MinLength = 6 })
                    .MaximumLength(30).WithErrorCode(ErrorCodes.MaxLength).WithState(_ => new { MaxLength = 30 });

                RuleFor(x => x.GivenName)
                    .NotEmpty().WithErrorCode(ErrorCodes.Required)
                    .MinimumLength(2).WithErrorCode(ErrorCodes.MinLength).WithState(_ => new { MinLength = 2 })
                    .MaximumLength(30).WithErrorCode(ErrorCodes.MaxLength).WithState(_ => new { MaxLength = 30 });

                RuleFor(x => x.Surname)
                    .NotEmpty().WithErrorCode(ErrorCodes.Required)
                    .MinimumLength(2).WithErrorCode(ErrorCodes.MinLength).WithState(_ => new { MinLength = 2 })
                    .MaximumLength(30).WithErrorCode(ErrorCodes.MaxLength).WithState(_ => new { MaxLength = 30 });

                RuleFor(x => x.Role).Must(x => x > 0 && (int)x < 4).WithErrorCode(ErrorCodes.NotSupported);

                RuleFor(x => x.ReservationPrice).Must((command, reservationPrice) => NotBeEmptyForTrainer(command, reservationPrice)).WithErrorCode(ErrorCodes.MustNotBeEmpty);
            }

            private async Task<bool> BeUnique(string email, CancellationToken cancellationToken)
            {
                return await _authService.IsEmailUnique(email, cancellationToken);
            }

            private bool NotBeEmptyForTrainer(Command command, double? reservationPrice)
            {
                if (command.Role == RoleEnum.Trainer && reservationPrice is null)
                    return false;

                return true;
            }
        }
    }
}