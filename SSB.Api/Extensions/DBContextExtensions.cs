
using Identity.DataAccess;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Psg.Api.Data;
using Psg.Api.DbContexts;
using Psg.Api.Preferences;
using SoruDeposu.DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Psg.Api.Extensions
{
    public static class DBContextExtensions
    {

        public static IServiceCollection AddDbContexts(this IServiceCollection services, bool useSqLite, string baglantiSatiri, ApiTercihleri tercihler)
        {

            AddApplicationDbContext(services, useSqLite, baglantiSatiri);
            AddSoruDepoDbContext(services, useSqLite, baglantiSatiri);
            AddPsgContext(services, useSqLite, baglantiSatiri);
            return services;
        }

        private static void AddApplicationDbContext(IServiceCollection services, bool useSqLite, string baglantiSatiri)
        {
            services.AddDbContext<MTIdentityDbContext>(options =>
            {
                string assemblyName = typeof(MTIdentityDbContext).Namespace;
                UserDbProvider(useSqLite, baglantiSatiri, options);

            });
        }

        private static void AddSoruDepoDbContext(IServiceCollection services, bool useSqLite, string baglantiSatiri)
        {
            services.AddDbContext<SoruDepoDbContext>(options =>
            {
                string assemblyName = typeof(SoruDepoDbContext).Namespace;
                UserDbProvider(useSqLite, baglantiSatiri, options);

            });
        }

        private static void UserDbProvider(bool useSqLite, string baglantiSatiri, DbContextOptionsBuilder options, string assemblyName = null)
        {
            if (useSqLite)
                options.UseSqlite(baglantiSatiri);
            else
            {
                if (!string.IsNullOrEmpty(assemblyName))
                {
                    options.UseSqlServer(baglantiSatiri, optionsBuilder =>
                    optionsBuilder.MigrationsAssembly(assemblyName));
                }
                else
                    options.UseSqlServer(baglantiSatiri);

            }
        }
        private static void AddPsgContext(IServiceCollection services, bool useSqLite, string baglantiSatiri)
        {
            services.AddDbContext<PsgContext>(options =>
            {
                UserDbProvider(useSqLite, baglantiSatiri, options);
            });
        }

    }
}
