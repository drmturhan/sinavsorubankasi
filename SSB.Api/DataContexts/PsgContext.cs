using Microsoft.EntityFrameworkCore;
using Psg.Api.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Psg.Api.DbContexts
{
    public class PsgContext : DbContext
    {
        public PsgContext(DbContextOptions<PsgContext> options) : base(options)
        { }

        public DbSet<Hasta> Hastalar { get; set; }
        public DbSet<UykuTest> UykuTestleri { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasDefaultSchema("Polisomnografi");
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<UykuTest>(entity => {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Hasta).WithMany(h => h.UykuTestleri).HasForeignKey(fk => fk.HastaNo);

            });
        }
    }
}
