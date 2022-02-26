using Autofac;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Reflection;
using WebApi.Common.Behaviours;
using WebApi.Common.Behaviours.Authorization;
using WebApi.Common.Exceptions;
using WebApi.Domain;
using WebApi.Persistence;
using WebApi.Startup.ExceptionHandling;

namespace WebApi.Startup
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSwagger();
            services.AddAuth(Configuration);
            services.AddHttpClient();
            services.AddControllersWithViews();
            services.AddSpaStaticFiles(configuration => configuration.RootPath = "ClientApp/build");

            services.AddMediatR(Assembly.GetExecutingAssembly());
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(AuthorizationCheckBehaviour<,>)); // Register this IPipelineBehavior before other IPipelineBehavior-s so AuthCheck is executed first
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));

            services.AddDbContext<ForehandContext>(options =>
               options.UseSqlServer(
                   Configuration.GetConnectionString("ForehandContext"),
                   builder => builder.MigrationsAssembly(typeof(ForehandContext).Assembly.FullName)));

            services.AddIdentity<User, IdentityRole>(o =>
             {
                 o.Password.RequiredLength = 6;
                 o.Password.RequireDigit = false;
                 o.Password.RequireUppercase = false;
                 o.Password.RequireLowercase = false;
                 o.Password.RequireNonAlphanumeric = false;
                 o.User.RequireUniqueEmail = true;
             })
          .AddRoles<IdentityRole>()
          .AddEntityFrameworkStores<ForehandContext>()
          .AddDefaultTokenProviders();
        }

        public void ConfigureContainer(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(typeof(BadRequestException).Assembly)
                .AsClosedTypesOf(typeof(IAuthorizationCheck<>))
                .AsImplementedInterfaces()
                .InstancePerLifetimeScope();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseHttpsRedirection();
            app.UseCustomExceptionHandlingMiddleware();

            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "forehand-api v1"));

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
