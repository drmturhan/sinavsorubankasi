using Microsoft.Extensions.Configuration;
using System;
using System.IO;

namespace Identity.DataAccess
{
    class Program
    {
        public static IConfigurationRoot Configuration { get; set; }
        static void Main(string[] args)
        {
            var builder = new ConfigurationBuilder()
               .SetBasePath(Directory.GetCurrentDirectory())
               .AddJsonFile("appsettings.json");

            Configuration = builder.Build();
            Console.Write(Configuration["Data:SoruBankasiBaglantiSatiri"]);
        }
    }

}
