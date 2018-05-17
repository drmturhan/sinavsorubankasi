using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Base
{
    public interface ISeederManager
    {
        void SeedAll();
    }
    public interface ISeeder
    {
        int Oncelik { get; }
        Task Seed();
    }

    public class SeederManager : ISeederManager
    {

        public SortedList<int, ISeeder> seeders = new SortedList<int, ISeeder>();

        public void SeedAll()
        {

            

            var types = AppDomain.CurrentDomain.GetAssemblies()
                .SelectMany(s => s.GetTypes())
                .Where(p => p.GetInterface("ISeeder") != null);
            foreach (var sinif in types)
            {
                if (sinif.IsClass)
                {
                    ISeeder instance = Activator.CreateInstance(sinif) as ISeeder;
                    seeders.Add(instance.Oncelik, instance);
                }
            }
            foreach (var seederKey in seeders.Keys)
            {
                seeders[seederKey].Seed();
            }
        }
    }
}
