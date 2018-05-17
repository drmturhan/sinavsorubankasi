using DersYonetimi.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Text;

namespace DersYonetimi.DataAccess
{

    public class DersDbContext : DbContext
    {
        public DbSet<Ders> Dersler { get; set; }
        public DersDbContext(DbContextOptions<DersDbContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Ders>(entity =>
            {
                entity.ToTable("Dersler", "Ders");
                entity.HasKey(d => d.DersId);
                entity.HasOne(d => d.AlanKodu).WithMany(ak => ak.Dersleri).HasForeignKey(fk => fk.AlanKodNo);

            });
        }
    }
}
