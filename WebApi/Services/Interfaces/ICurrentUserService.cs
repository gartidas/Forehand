using Microsoft.AspNetCore.Http;
using WebApi.Common.Constants;

namespace WebApi.Services.Interfaces
{
    public interface ICurrentUserService
    {
        string UserId { get; }

        RoleEnum Role { get; }

        HttpContext HttpContext { get; }
    }
}
