using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Domain;

namespace WebApi.Startup
{
    public static class SetupAdminHelper
    {
        public static async Task CreateAdmin(this IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
            var adminEmail = "admin@forehand.com";
            var existingUser = await userManager.FindByEmailAsync(adminEmail);
            var user = new User(adminEmail, "Admin", "Forehand", "", RoleEnum.Admin);

            if (existingUser is null)
            {
                await userManager.CreateAsync(user, "admin123");
            }
        }
    }
}
