using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Security.Claims;
using WebApi.Common.Constants;
using WebApi.Services.Interfaces;

namespace WebApi.Services
{
    public class CurrentUserService : ICurrentUserService
    {
        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            HttpContext = httpContextAccessor.HttpContext;
            var userClaims = HttpContext?.User.Claims;

            var roleString = userClaims?.SingleOrDefault(x => x.Type == CustomClaims.Role)?.Value;
            Enum.TryParse<RoleEnum>(roleString, out var roleEnum);

            UserId = userClaims?.SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
            Role = roleEnum;
        }

        public string UserId { get; }

        public RoleEnum Role { get; }

        public HttpContext HttpContext { get; }
    }
}
