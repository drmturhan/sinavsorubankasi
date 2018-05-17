using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Core.Base;
using Identity.DataAccess;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Psg.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = BuildWebHost(args);
            var services = (IServiceScopeFactory)host.Services.GetService(typeof(IServiceScopeFactory));
            var identitySeeder = (MTIdentitySeeder)host.Services.GetService(typeof(MTIdentitySeeder));
            var seederManager = (ISeederManager)host.Services.GetService(typeof(ISeederManager));
            identitySeeder.Seed().Wait();
            seederManager.SeedAll();
            host.Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>

            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();
    }
}
