using Fiesta.Application.Features.Auth;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common;
using WebApi.Domain;

namespace WebApi.Services.Interfaces
{
    public interface IAuthService
    {
        public Task<Result<string>> Register(Register.Command command, CancellationToken cancellationToken);

        public Task<Result<(string accessToken, string refreshToken)>> Login(string emailOrUsername, string password, CancellationToken cancellationToken);

        public Task<Result> Logout(string refreshToken, CancellationToken cancellationToken);

        public Task<Result<(string accessToken, string refreshToken)>> RefreshJwt(string refreshToken, CancellationToken cancellationToken);

        public Task<bool> IsEmailUnique(string email);

        public Task<User> GetUser(string userId);

        public Task<Result> ChangePassword(string userId, string currentPassword, string newPassword, CancellationToken cancellationToken);
    }
}
