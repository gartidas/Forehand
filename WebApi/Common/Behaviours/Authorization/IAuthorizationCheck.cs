using System.Threading;
using System.Threading.Tasks;
using WebApi.Persistence;
using WebApi.Services.Interfaces;

namespace WebApi.Common.Behaviours.Authorization
{
    public interface IAuthorizationCheck<TRequest>
    {
        public Task<bool> IsAuthorized(TRequest request, ForehandContext db, ICurrentUserService currentUserService, CancellationToken cancellationToken);
    }
}
