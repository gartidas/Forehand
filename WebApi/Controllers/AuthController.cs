using Fiesta.Application.Features.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Common.Exceptions;
using WebApi.Common.Options;
using WebApi.Features.Auth;
using WebApi.Services.Interfaces;

namespace WebApi.Controllers
{
    [Route("api/auth")]
    public class AuthController : BaseController
    {
        private readonly JwtOptions _jwtOptions;
        private readonly IAuthService _authService;

        public AuthController(JwtOptions jwtOptions, IAuthService authService)
        {
            _jwtOptions = jwtOptions;
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(EmailPasswordRequest request, CancellationToken cancellationToken)
        {
            var result = await _authService.Login(request.Email, request.Password, cancellationToken);
            if (result.Failed)
                throw new BadRequestException(result.Errors);

            var (accessToken, refreshToken) = result.Data;
            Response.Cookies.Append(Cookies.RefreshToken, refreshToken, GetRefreshTokenCookieOptions());
            return Ok(new AuthResponse { AccessToken = accessToken });
        }

        [HttpPost("logout")]
        public async Task<ActionResult> Logout(CancellationToken cancellationToken)
        {
            Request.Cookies.TryGetValue(Cookies.RefreshToken, out string refreshToken);
            var result = await _authService.Logout(refreshToken, cancellationToken);
            if (result.Failed)
                throw new BadRequestException(result.Errors);

            Response.Cookies.Append(Cookies.RefreshToken, string.Empty, GetRefreshTokenCookieOptions(TimeSpan.FromSeconds(0)));
            return NoContent();
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register(Register.Command request, CancellationToken cancellationToken)
        {
            await Mediator.Send(request, cancellationToken);
            return NoContent();
        }

        [HttpGet("refresh-token")]
        public async Task<ActionResult<AuthResponse>> RefreshToken(CancellationToken cancellationToken)
        {
            Request.Cookies.TryGetValue(Cookies.RefreshToken, out string refreshToken);
            var result = await _authService.RefreshJwt(refreshToken, cancellationToken);
            if (result.Failed)
                throw new BadRequestException(result.Errors);

            var (accessToken, newRefreshToken) = result.Data;
            Response.Cookies.Append(Cookies.RefreshToken, newRefreshToken, GetRefreshTokenCookieOptions());
            return Ok(new AuthResponse { AccessToken = accessToken });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<GetMe.Response>> GetMe(CancellationToken cancellationToken)
           => await Mediator.Send(new GetMe.Query { CurrentUserId = CurrentUserService.UserId }, cancellationToken);

        private CookieOptions GetRefreshTokenCookieOptions(TimeSpan? maxAge = null)
          => new CookieOptions
          {
              MaxAge = maxAge ?? _jwtOptions.RefreshTokenLifeTime,
              SameSite = SameSiteMode.Strict,
              HttpOnly = true,
              Path = "/",
          };

        public class EmailPasswordRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }
    }
}
