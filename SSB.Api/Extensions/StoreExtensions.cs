using Core.EntityFramework;
using Identity.DataAccess.Repositories;
using Microsoft.Extensions.DependencyInjection;
using SoruDeposu.DataAccess;

namespace Psg.Api.Extensions
{
    public static class StoreExtensions
    {

        public static IServiceCollection AddSoruRepositories(this IServiceCollection services)
        {
            services.AddScoped<IDersAnlatanHocaStore, DersAnlatanHocaStore>();
            services.AddScoped<ISoruStore, SoruStore>();
            services.AddScoped<ISoruKokuStore, SoruKokuStore>();
            services.AddScoped<ISoruTipStore, SoruTipStore>();
            services.AddScoped<ISoruZorlukStore, SoruZorlukStore>();
            services.AddScoped<IBilisselDuzeyStore, BilisselDuzeyStore>();
            


            return services;
        }


        public static IServiceCollection AddApplicationRepositories(this IServiceCollection services)
        {
            services.AddScoped<IKullaniciRepository, KullaniciRepository>();
            services.AddScoped<ICinsiyetRepository, CinsiyetRepository>();
            services.AddScoped<IArkadaslikRepository, ArkadaslikRepository>();
            services.AddScoped<IMesajlasmaRepository, MesajlasmaRepository>();
            return services;
        }

    }
}
