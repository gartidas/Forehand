using Fiesta.Application.Features.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common;
using WebApi.Common.Constants;
using WebApi.Common.Options;
using WebApi.Domain;
using WebApi.Persistence;
using WebApi.Services.Interfaces;

namespace WebApi.Services
{
    public class AuthService : IAuthService
    {
        private readonly ForehandContext _db;
        private readonly JwtOptions _jwtOptions;
        private readonly TokenValidationParameters _tokenValidationParameters;
        private readonly UserManager<User> _userManager;

        public AuthService(JwtOptions jwtOptions, ForehandContext db, TokenValidationParameters tokenValidationParameters, UserManager<User> userManager)
        {
            _db = db;
            _jwtOptions = jwtOptions;
            _tokenValidationParameters = tokenValidationParameters;
            _userManager = userManager;
        }

        public async Task<Result<string>> Register(Register.Command command, CancellationToken cancellationToken)
        {
            var newUser = new User(command.Email, command.GivenName, command.Surname, command.PhoneNumber, command.Role);

            var result = await _userManager.CreateAsync(newUser, command.Password);
            if (!result.Succeeded)
                return Result<string>.Failure(result.Errors.Select(x => x.Description));

            var createdUser = await _userManager.FindByEmailAsync(command.Email);

            switch (command.Role)
            {
                case RoleEnum.BasicUser:
                    _db.Customers.Add(new Customer(createdUser));
                    break;
                case RoleEnum.Employee:
                    _db.Employees.Add(new Employee(createdUser));
                    break;
                case RoleEnum.Trainer:
                    _db.Trainers.Add(new Trainer(command.Bio, command.ReservationPrice ?? default, createdUser));
                    break;
                default:
                    return Result<string>.Failure(ErrorCodes.NotSupported);
            }

            await _db.SaveChangesAsync(cancellationToken);
            return Result.Success(newUser.Id);
        }

        public async Task<Result<(string accessToken, string refreshToken)>> Login(string emailOrUsername, string password, CancellationToken cancellationToken)
        {
            var user = await _userManager.FindByEmailAsync(emailOrUsername.Trim());

            if (user is null)
                return Result<(string, string)>.Failure(ErrorCodes.InvalidLoginCredentials);

            var passValid = await _userManager.CheckPasswordAsync(user, password);
            if (!passValid)
                return Result<(string, string)>.Failure(ErrorCodes.InvalidLoginCredentials);

            return Result.Success(await Login(user, cancellationToken));
        }

        public async Task<Result> Logout(string refreshToken, CancellationToken cancellationToken)
        {
            var userId = GetPrincipalFromJwt(refreshToken)?.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;

            if (userId is null)
                return Result.Failure(ErrorCodes.InvalidRefreshToken);

            var user = await GetUser(userId);

            if (refreshToken != user.RefreshToken)
                return Result.Failure(ErrorCodes.InvalidRefreshToken);

            user.Logout();
            await _db.SaveChangesAsync(cancellationToken);
            return Result.Success();
        }

        public async Task<Result<(string accessToken, string refreshToken)>> RefreshJwt(string refreshToken, CancellationToken cancellationToken)
        {
            var validatedRefreshToken = GetPrincipalFromJwt(refreshToken);

            if (validatedRefreshToken?.Claims.SingleOrDefault(x => x.Type == CustomClaims.IsRefreshToken) is null)
                return Result<(string, string)>.Failure(ErrorCodes.InvalidRefreshToken);

            var expiryDateUnix =
                    long.Parse(validatedRefreshToken.Claims.Single(x => x.Type == JwtRegisteredClaimNames.Exp).Value);

            var expiryDateUtc =
                new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddSeconds(expiryDateUnix);

            if (expiryDateUtc < DateTime.UtcNow)
                return Result<(string, string)>.Failure(ErrorCodes.RefreshTokenExpired);

            var appUserId = validatedRefreshToken.Claims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value;

            var appUser = await GetUser(appUserId);

            var storedRefreshToken = appUser.RefreshToken;

            if (storedRefreshToken != refreshToken)
                return Result<(string, string)>.Failure(ErrorCodes.InvalidRefreshToken);

            return Result.Success(await Login(appUser, cancellationToken));
        }

        public async Task<bool> IsEmailUnique(string email, CancellationToken cancellationToken)
        {
            var emailExists = await _db.Employees.AsQueryable().Where(x => x.IdentityUser.Email == email).AnyAsync(cancellationToken);
            if (!emailExists)
                emailExists = await _db.Trainers.AsQueryable().Where(x => x.IdentityUser.Email == email).AnyAsync(cancellationToken);
            if (!emailExists)
                emailExists = await _db.Customers.AsQueryable().Where(x => x.IdentityUser.Email == email).AnyAsync(cancellationToken);
            return !emailExists;
        }

        public async Task<User> GetUser(string userId) => await _userManager.FindByIdAsync(userId);

        private async Task<(string accessToken, string refreshToken)> Login(User user, CancellationToken cancellationToken)
        {
            var accessToken = CreateAccessToken(user);
            var refreshToken = CreateRefreshToken(user);

            user.Login(refreshToken);
            await _db.SaveChangesAsync(cancellationToken);

            return (accessToken, refreshToken);
        }

        private string CreateAccessToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtOptions.Secret);
            var jti = Guid.NewGuid().ToString();
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti,  jti),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Iss, _jwtOptions.Issuer),
                new Claim(CustomClaims.Role, user.Role.ToString()),
                new Claim(CustomClaims.IsAccessToken,"true")
            };

            var accessTokenObject = new JwtSecurityToken(
                _jwtOptions.Issuer,
                null,
                claims,
                DateTime.UtcNow,
                DateTime.UtcNow.Add(_jwtOptions.TokenLifeTime),
                new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
                );

            return tokenHandler.WriteToken(accessTokenObject);
        }

        private ClaimsPrincipal GetPrincipalFromJwt(string jwt)
        {
            var jwtHandler = new JwtSecurityTokenHandler();
            var tokenValidationParameters = _tokenValidationParameters.Clone();
            tokenValidationParameters.ValidateLifetime = false;

            try
            {
                var principal = jwtHandler.ValidateToken(jwt, tokenValidationParameters, out var validatedJwt);

                var hasJwtValidSecurityAlgorithm =
                    (validatedJwt is JwtSecurityToken jwtSecurityToken) && jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase);

                if (!hasJwtValidSecurityAlgorithm) return null;

                return principal;
            }
            catch
            {
                return null;
            }
        }

        private string CreateRefreshToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtOptions.Secret);
            var jti = Guid.NewGuid().ToString();
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti,  jti),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Iss, _jwtOptions.Issuer),
                new Claim(CustomClaims.IsRefreshToken, "true")
            };

            var refreshTokenObject = new JwtSecurityToken(
                _jwtOptions.Issuer,
                null,
                claims,
                DateTime.UtcNow,
                DateTime.UtcNow.Add(_jwtOptions.RefreshTokenLifeTime),
                new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
                );

            return tokenHandler.WriteToken(refreshTokenObject);
        }
    }
}
