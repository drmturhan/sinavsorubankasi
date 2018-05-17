using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace SoruDeposu.DataAccess
{
    public class SoruDepoDbContextFactory : IDesignTimeDbContextFactory<SoruDepoDbContext>
    {
        public SoruDepoDbContext CreateDbContext(string[] args)
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json")
            .Build();

            bool useSqLite = false;
            //SqlLite için ilgili nuget leri eklemek gerek.
            bool.TryParse(configuration["Data:useSqLite"], out useSqLite);
            string baglantiSatiri = useSqLite ? configuration["Data:SqlLiteConnectionString"] : configuration["Data:SqlServerConnectionString"];

            if (string.IsNullOrEmpty(baglantiSatiri))
                throw new Exception(baglantiSatiri + " boş.");

            DbContextOptionsBuilder builder = null;
            if (useSqLite)
            {
                //Nuget leri ekledikten sonra burayı ayarlayabiliriz.

            }
            else
            {
                builder = new DbContextOptionsBuilder<SoruDepoDbContext>();
                builder.UseSqlServer(baglantiSatiri);
            }
            return new SoruDepoDbContext(builder.Options as DbContextOptions<SoruDepoDbContext>);
        }
        private static void UserDbProvider(bool useSqLite, string baglantiSatiri, DbContextOptionsBuilder options)
        {
            if (useSqLite)
            {
                //options.UseSqlite(baglantiSatiri);
            }
            else
                options.UseSqlServer(baglantiSatiri);
        }
    }
}


