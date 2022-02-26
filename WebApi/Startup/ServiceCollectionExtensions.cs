using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApi.Common.Constants;
using WebApi.Common.Options;
using WebApi.Services;
using WebApi.Services.Interfaces;

namespace WebApi.Startup
{

    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(x =>
            {
                x.SwaggerDoc("v1", new OpenApiInfo { Title = "forehand-api", Version = "v1" });

                x.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "Jwt Bearer Token",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey
                });

                x.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                    { new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Id = "Bearer",
                                Type = ReferenceType.SecurityScheme
                            }
                        }, new List<string>()
                    }
            });
            });

            services.ConfigureSwaggerGen(x => x.CustomSchemaIds(xx => xx.FullName));
            return services;
        }

        public static IServiceCollection AddAuth(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtOptions = new JwtOptions();
            configuration.GetSection(nameof(JwtOptions)).Bind(jwtOptions);
            services.AddSingleton(jwtOptions);

            var tokenValidationParams = new TokenValidationParameters
            {
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Secret)),
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtOptions.Issuer,
                ValidateIssuer = true,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            services.AddSingleton(tokenValidationParams);

            services.AddAuthentication(o =>
            {
                o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            })
            .AddJwtBearer(o =>
            {
                o.TokenValidationParameters = tokenValidationParams;

                o.Events = new JwtBearerEvents
                {
                    OnTokenValidated = context =>
                    {
                        var isAccessTokenClaim = context.Principal.Claims.SingleOrDefault(x => x.Type == CustomClaims.IsAccessToken);
                        if (isAccessTokenClaim is null)
                            context.Fail(new Exception("Token is missing 'IsAccessToken' claim."));

                        return Task.CompletedTask;
                    },
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        if (!string.IsNullOrEmpty(accessToken))
                            context.Token = accessToken;

                        return Task.CompletedTask;
                    }
                };

                o.SaveToken = true;
            });


            services.AddAuthorization(options =>
            {
                var roleNames = new[] { RoleEnum.BasicUser, RoleEnum.Employee, RoleEnum.Trainer, RoleEnum.Admin };

                services.AddAuthorization(options =>
                {
                    foreach (var requiredRole in roleNames)
                    {
                        options.AddPolicy(requiredRole.ToString(), x => x.RequireAssertion(ctx =>
                        {
                            var userRole = ctx.User.Claims.SingleOrDefault(x => x.Type == CustomClaims.Role)?.Value;

                            if (!Enum.TryParse<RoleEnum>(userRole, out var userRoleEnum))
                                return false;

                            return userRoleEnum == requiredRole || userRoleEnum == RoleEnum.Admin;
                        }));
                    }
                });
            });

            services.AddTransient<IAuthService, AuthService>();
            services.AddTransient<ICurrentUserService, CurrentUserService>();
            return services;
        }
    }

}
