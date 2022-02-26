using Microsoft.AspNetCore.Identity;
using System;
using WebApi.Common.Constants;

namespace WebApi.Domain
{
    public class User : IdentityUser<string>
    {
        public User(string email, string givenName, string surname, string phoneNumber, RoleEnum role)
        {
            Id = Guid.NewGuid().ToString();
            Email = email;
            UserName = email;
            GivenName = givenName;
            Surname = surname;
            PhoneNumber = phoneNumber;
            Role = role;
        }

        public string GivenName { get; private set; }

        public string Surname { get; private set; }

        public string RefreshToken { get; private set; }

        public RoleEnum Role { get; private set; }

        public void Login(string refreshToken) => RefreshToken = refreshToken;

        public void Logout() => RefreshToken = null;
    }
}
