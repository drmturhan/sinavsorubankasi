using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Identity.DataAccess
{

    public partial class MTIdentityDbContext : IdentityDbContext<Kullanici, Rol, int>
    {
        public MTIdentityDbContext(DbContextOptions<MTIdentityDbContext> options) : base(options)
        {
        }

        public DbSet<KullaniciKisi> Kisiler { get; set; }
        public DbSet<KisiCinsiyet> Cinsiyetler { get; set; }
        public DbSet<MedeniHal> MedeniHaller { get; set; }
        public DbSet<KisiFoto> KisiFotograflari { get; set; }
        public DbSet<ArkadaslikTeklif> ArkadaslikTeklifleri { get; set; }
        public DbSet<Mesaj> Mesajlasmalar{ get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.HasDefaultSchema("Yetki");
            base.OnModelCreating(builder);
            

            builder.Entity<Rol>(entity =>
            {
                entity.ToTable("Roller");
            });

            builder.Entity<IdentityUserRole<int>>(entity =>
            {
                entity.ToTable("KullaniciRolleri");
            });
            builder.Entity<IdentityUserClaim<int>>(entity =>
            {
                entity.ToTable("KullaniciHaklari");
            });

            builder.Entity<IdentityUserClaim<int>>(entity =>
            {
                entity.ToTable("KullaniciHaklari");
            });
            builder.Entity<IdentityRoleClaim<int>>(entity =>
            {
                entity.ToTable("RolHaklari");
            });
            builder.Entity<IdentityUserToken<int>>(entity =>
            {
                entity.ToTable("KullaniciBiletleri");
            });
            builder.Entity<IdentityUserLogin<int>>(entity =>
            {
                entity.ToTable("KullaniciGirisleri");
            });
            builder.Entity<Kullanici>(entity =>
            {
                entity.ToTable("Kullanicilar");
                entity.HasOne(k => k.Kisi).WithMany(kul => kul.Kullanicilari).HasForeignKey(fk => fk.KisiNo);
            });
            builder.Entity<KullaniciKisi>(entity =>
            {
                entity.ToTable("Kisiler", "Kisi");
                entity.HasKey(k => k.KisiId);
                
                entity.Property(k => k.Unvan).HasMaxLength(15);
                entity.Property(k => k.Ad).HasMaxLength(50).IsRequired(false);
                entity.Property(k => k.Soyad).HasMaxLength(50).IsRequired(false);
                entity.HasIndex(k => new { k.Ad, k.Soyad, k.DogumTarihi,k.CinsiyetNo }).HasName("KisiAdSoyadDogumTarihiCinsiyetIndeks").IsUnique();
            });

            builder.Entity<KullaniciPersonel>(entity =>
            {
                entity.ToTable("Personeller", "Personel");
                entity.HasKey(k => k.PersonelId);
                entity.HasOne(k => k.KisiBilgisi).WithMany(kisi => kisi.Personellikleri).HasForeignKey(fk => fk.KisiNo);
                
            });

            builder.Entity<KisiCinsiyet>(entity =>
            {
                entity.ToTable("Cinsiyetler", "Kisi");
                entity.HasKey(c => c.CinsiyetId);

                entity.HasMany(c => c.Kisileri).WithOne(k => k.Cinsiyeti).HasForeignKey(fk => fk.CinsiyetNo);
            });
            builder.Entity<MedeniHal>(entity =>
            {
                entity.ToTable("MedeniHaller", "Kisi");
                entity.HasMany(c => c.Kisileri).WithOne(k => k.MedeniHali).HasForeignKey(fk => fk.MedeniHalNo);
            });

            builder.Entity<KisiFoto>(entity =>
            {

                entity.ToTable("KisiFotograflari", "Kisi");
                entity.HasKey(f => f.FotoId);
                entity.HasOne(c => c.Kisi).WithMany(k => k.Fotograflari).HasForeignKey(fk => fk.KisiNo);
            });
            builder.Entity<ArkadaslikTeklif>(entity =>
            {
                entity.ToTable("ArkadaslikTeklifleri");
                entity.HasKey(e => new { e.TeklifEdenNo, e.TeklifEdilenNo });
                entity.HasOne(e => e.TeklifEden).WithMany(m => m.GelenTeklifler).HasForeignKey(fk => fk.TeklifEdenNo).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.TeklifEdilen).WithMany(m => m.YapilanTeklifler).HasForeignKey(fk => fk.TeklifEdilenNo).OnDelete(DeleteBehavior.Restrict);
            });
            builder.Entity<Mesaj>(entity =>
            {
                entity.ToTable("Mesajlasmalar");
                entity.HasKey(e => e.MesajId);
                entity.HasOne(e => e.Gonderen).WithMany(m => m.GonderdigiMesajlar).HasForeignKey(fk => fk.GonderenNo).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Alan).WithMany(m => m.AldigiMesajlar).HasForeignKey(fk => fk.AlanNo).OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
