﻿using FluentValidation;
using MediatR;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Common.Exceptions;
using WebApi.Services.Interfaces;

namespace WebApi.Features.Auth
{
    public class ChangePassword
    {
        public class Command : IRequest
        {
            [JsonIgnore]
            public string UserId { get; set; }

            public string CurrentPassword { get; set; }

            public string NewPassword { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly IAuthService _authService;

            public Handler(IAuthService authService)
            {
                _authService = authService;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var result = await _authService.ChangePassword(request.UserId, request.CurrentPassword, request.NewPassword, cancellationToken);
                if (result.Failed)
                    throw new BadRequestException(result.Errors);

                return Unit.Value;
            }
        }

        public class Validator : AbstractValidator<Command>
        {
            public Validator()
            {
                RuleFor(x => x.NewPassword)
                     .NotEmpty().WithErrorCode(ErrorCodes.Required)
                     .MinimumLength(6).WithErrorCode(ErrorCodes.MinLength).WithState(_ => new { MinLength = 6 })
                     .MaximumLength(30).WithErrorCode(ErrorCodes.MaxLength).WithState(_ => new { MaxLength = 30 });
            }
        }
    }
}
