using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Reflection;

namespace Identity.DataAccess
{
    public static class MTIdentityExtensions
    {
        public static IServiceCollection AddMTIdentity(this IServiceCollection services, IConfiguration configuration)
        {

            bool useSqLite = false;
            bool.TryParse(configuration["Data:useSqLite"], out useSqLite);
            string baglantiSatiri = useSqLite ? configuration["Data:SqlLiteConnectionString"] : configuration["Data:SqlServerConnectionString"];

            var migrationsAssembly = typeof(MTIdentityDbContext).GetTypeInfo().Assembly.GetName().Name;

            
            services.AddDbContext<MTIdentityDbContext>(options =>
                options.UseSqlServer(baglantiSatiri)
              );


            services.AddTransient<IKullaniciStore<Kullanici>, KullaniciStore>();
            services.AddTransient<KullaniciYonetici>();
            services.AddTransient<RolYonetici>();


            services.AddScoped<IPasswordHasher<Kullanici>, PasswordHasher<Kullanici>>();
            services.AddTransient<IUserClaimsPrincipalFactory<Kullanici>, MTClaimsPrincipalFactory>();
            services.Configure<DataProtectionTokenProviderOptions>(o =>
            {
                o.Name = "Default";
                o.TokenLifespan = TimeSpan.FromMinutes(15);
            });
            services.AddIdentity<Kullanici, Rol>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
                //options.Password.RequiredUniqueChars = 3;

                options.User.RequireUniqueEmail = true;

                options.Tokens.PasswordResetTokenProvider = TokenOptions.DefaultEmailProvider;


                options.SignIn.RequireConfirmedEmail = true;
                options.SignIn.RequireConfirmedPhoneNumber = false;
                
                //cfg.SignIn.RequireConfirmedPhoneNumber= true;
                options.Lockout = new LockoutOptions
                {
                    DefaultLockoutTimeSpan = TimeSpan.FromMinutes(10),
                    AllowedForNewUsers=true,
                    MaxFailedAccessAttempts = 5
                };
                
            })
            .AddEntityFrameworkStores<MTIdentityDbContext>()
            .AddDefaultTokenProviders()
            .AddPasswordValidator<KullaniciAdSoyadOlamazPasswordValidator>();


            services.AddTransient<MTIdentitySeeder>();
            

            return services;
        }




        public static void MTIdentityAyarlariniYap(this IServiceCollection services)
        {

            services.Configure<IdentityOptions>(options =>
            {
                // Password settings
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
                options.Lockout.MaxFailedAccessAttempts = 3;
                // User settings
                options.User.RequireUniqueEmail = true;
            });
        }

    }



}
