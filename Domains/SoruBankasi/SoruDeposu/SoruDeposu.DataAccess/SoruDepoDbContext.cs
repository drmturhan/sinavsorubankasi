using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using SoruDeposu.DataAccess.Entities;
using System.Collections.Generic;
using System.Text;

namespace SoruDeposu.DataAccess
{
    public class SoruDepoDbContext : DbContext
    {

        public SoruDepoDbContext(DbContextOptions<SoruDepoDbContext> options) : base(options)
        {

        }

        public DbSet<SoruKoku> SoruKokleri { get; set; }
        public DbSet<Soru> Sorular { get; set; }
        public DbSet<SoruTip> SoruTipleri { get; set; }
        //public DbSet<OgrenmeDuzey> OgrenmeDuzeyleri{ get; set; }
        public DbSet<BilisselDuzey> BilisselDuzeyler { get; set; }
        public DbSet<DersHoca> DersAnlatanHocalar { get; set; }
        public DbSet<Cinsiyet> Cinsiyetler { get; set; }
        public DbSet<MedeniHal> MedeniHaller { get; set; }
        public DbSet<Pozisyon> Pozisyonlar { get; set; }
        public DbSet<BirimGrup> BirimGruplari { get; set; }
        public DbSet<SoruZorluk> SoruZorluklari { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {

            base.OnModelCreating(builder);
            builder.Entity<Kisi>(entity =>
            {
                entity.ToTable("Kisiler", "Kisi");
                entity.HasKey(k => k.KisiId);
                entity.HasMany(k => k.Personellikleri).WithOne(p => p.KisiBilgisi).HasForeignKey(fk => fk.KisiNo);

            });

            builder.Entity<Cinsiyet>(entity =>
            {
                entity.ToTable("Cinsiyetler", "Kisi");
                entity.HasKey(k => k.CinsiyetId);
                entity.HasMany(k => k.Kisiler).WithOne(p => p.Cinsiyeti).HasForeignKey(fk => fk.CinsiyetNo);

            });

            builder.Entity<MedeniHal>(entity =>
            {
                entity.ToTable("MedeniHaller", "Kisi");
                entity.HasKey(k => k.MedeniHalId);
                entity.HasMany(k => k.Kisiler).WithOne(p => p.MedeniHali).HasForeignKey(fk => fk.MedeniHalNo);

            });

            builder.Entity<Personel>(entity =>
            {
                entity.ToTable("Personeller", "Personel");
                entity.HasKey(k => k.PersonelId);


            });



            builder.Entity<Universite>(entity =>
            {
                entity.ToTable("Universiteler", "Universite");
                entity.HasKey(k => k.UniversiteId);

                entity.HasOne(u => u.AkademikAmir).WithMany(p => p.AkademikYonettigiUniversiteler).HasForeignKey(fk => fk.AkademikAmirPersonelNo);
                entity.HasOne(u => u.IdariAmir).WithMany(p => p.IdariYonettigiUniversiteler).HasForeignKey(fk => fk.IdariAmirPersonelNo);


            });

            builder.Entity<BirimGrup>(entity =>
            {
                entity.ToTable("BirimGruplari", "Universite");
                entity.HasKey(k => k.BirimGrupId);
                entity.HasOne(bg => bg.UstGrubu).WithMany(ubg => ubg.AltBirimleri).HasForeignKey(fk => fk.UstBirimGrupNo);
                entity.HasOne(k => k.AkademikAmirPozisyonu).WithMany(p => p.AkademikYonettigiBirimGruplari).HasForeignKey(fk => fk.AkademikAmirPozisyonNo);
                entity.HasOne(k => k.IdariAmirPozisyonu).WithMany(p => p.IdariYonettigiBirimGruplari).HasForeignKey(fk => fk.IdariAmirPozisyonNo);


            });

            builder.Entity<Birim>(entity =>
            {
                entity.ToTable("Birimler", "Universite");
                entity.HasKey(k => k.BirimId);
                entity.HasOne(b => b.Grubu).WithMany(bg => bg.Birimleri).HasForeignKey(fk => fk.BirimGrupNo);
                entity.HasOne(b => b.UstBirim).WithMany(bg => bg.AltBirimleri).HasForeignKey(fk => fk.BagliBirimNo);
                entity.HasOne(k => k.Universitesi).WithMany(p => p.Birimleri).HasForeignKey(fk => fk.UniversiteNo);
                entity.HasOne(k => k.AkademikAmir).WithMany(p => p.AkademikYonettigiBirimler).HasForeignKey(fk => fk.AkademikAmirPersonelNo);
                entity.HasOne(k => k.IdariAmir).WithMany(p => p.IdariYonettigiBirimler).HasForeignKey(fk => fk.IdariAmirPersonelNo);

            });

            builder.Entity<PozisyonGrupTanim>(entity =>
            {
                entity.ToTable("PozisyonGrupTanimlari", "Universite");
                entity.HasKey(k => k.PozisyonGrupTanimId);


            });
            builder.Entity<Pozisyon>(entity =>
            {
                entity.ToTable("Pozisyonlar", "Universite");
                entity.HasKey(k => k.PozisyonId);


            });
            builder.Entity<PozisyonGrup>(entity =>
            {
                entity.ToTable("PozisyonGruplari", "Universite");
                entity.HasKey(k => new { k.PozisyonNo, k.PozisyonGrupTanimNo });
                entity.HasOne(p => p.PozisyonGrupTanimi).WithMany(pg => pg.Pozisyonlari).HasForeignKey(fk => fk.PozisyonGrupTanimNo);
                entity.HasOne(p => p.Pozisyonu).WithMany(pg => pg.GrupTanimlari).HasForeignKey(fk => fk.PozisyonNo);


            });

            builder.Entity<BirimPersonel>(entity =>
            {
                entity.ToTable("BirimPersonelleri", "Universite");
                entity.HasKey(k => k.BirimPersonelId);
                entity.HasOne(bp => bp.PersonelBilgisi).WithMany(p => p.CalistigiBirimler).HasForeignKey(fk => fk.PersonelNo);
                entity.HasOne(bp => bp.Pozsiyonu).WithMany(p => p.BirimPersonelListesi).HasForeignKey(fk => fk.PozisyonNo);
                entity.HasOne(bp => bp.Birimi).WithMany(p => p.Personelleri).HasForeignKey(fk => fk.BirimNo);

            });

            builder.Entity<AlanKod>(entity =>
            {
                entity.ToTable("AlanKodlari", "Ders");
                entity.HasKey(d => d.AlanKodId);


            });

            builder.Entity<Ders>(entity =>
            {
                entity.ToTable("Dersler", "Ders");
                entity.HasKey(d => d.DersId);
                entity.HasOne(d => d.AlanKodu).WithMany(ak => ak.Dersleri).HasForeignKey(fk => fk.AlanKodNo);


            });
            builder.Entity<Konu>(entity =>
            {
                entity.ToTable("Konular", "Ders");
                entity.HasKey(d => d.KonuId);
                entity.HasOne(d => d.Dersi).WithMany(ak => ak.Konulari).HasForeignKey(fk => fk.DersNo);

            });
            builder.Entity<OgrenimHedef>(entity =>
            {
                entity.ToTable("DersKonuOgrenimHedefleri", "Ders");
                entity.HasKey(d => d.OgrenimHedefId);
                entity.HasOne(d => d.Dersi).WithMany(oh => oh.OgrenimHedefleri).HasForeignKey(fk => fk.DersNo);
                entity.HasOne(d => d.Konusu).WithMany(oh => oh.OgrenimHedefleri).HasForeignKey(fk => fk.KonuNo);

            });


            builder.Entity<OgrenimHedef>(entity =>
            {
                entity.ToTable("DersKonuOgrenimHedefleri", "Ders");
                entity.HasKey(d => d.OgrenimHedefId);
                entity.HasOne(d => d.Dersi).WithMany(oh => oh.OgrenimHedefleri).HasForeignKey(fk => fk.DersNo);
                entity.HasOne(d => d.Konusu).WithMany(oh => oh.OgrenimHedefleri).HasForeignKey(fk => fk.KonuNo);

            });

            builder.Entity<DersHoca>(entity =>
            {
                entity.ToTable("DersiAnlatanHocalar", "Ogrenci");
                entity.HasKey(d => d.DersHocaId);
                entity.HasOne(d => d.PersonelBilgisi).WithMany(oh => oh.Anlattiklari).HasForeignKey(fk => fk.PersonelNo);
                entity.HasOne(d => d.Dersi).WithMany(oh => oh.AnlatanHocalar).HasForeignKey(fk => fk.DersNo);
                entity.HasOne(d => d.Konusu).WithMany(oh => oh.AnlatanHocalar).HasForeignKey(fk => fk.KonuNo);

            });

            builder.Entity<Program>(entity =>
            {
                entity.ToTable("Programlar", "Ogrenci");
                entity.HasKey(d => d.ProgramId);
                entity.HasOne(d => d.Birimi).WithMany(oh => oh.Programlari).HasForeignKey(fk => fk.BirimNo);

            });

            builder.Entity<Donem>(entity =>
            {
                entity.ToTable("Donemleri", "Ogrenci");
                entity.HasKey(d => d.DonemId);
                entity.HasOne(d => d.Programi).WithMany(oh => oh.Donemleri).HasForeignKey(fk => fk.ProgramNo);

            });
            builder.Entity<DersGrup>(entity =>
            {
                entity.ToTable("DersGruplari", "Ogrenci");
                entity.HasKey(d => d.DersGrupId);
                entity.HasOne(d => d.Donemi).WithMany(d => d.DersGruplari).HasForeignKey(fk => fk.DonemNo);
                entity.HasOne(d => d.Mufredati).WithMany(d => d.DersGruplari).HasForeignKey(fk => fk.MufredatNo);


            });

            builder.Entity<GrupDers>(entity =>
            {
                entity.ToTable("GrupDersleri", "Ogrenci");
                entity.HasKey(d => new { d.DersGrupNo, d.DersNo });
                entity.HasOne(d => d.DersGrubu).WithMany(oh => oh.Dersleri).HasForeignKey(fk => fk.DersGrupNo);
                entity.HasOne(d => d.Dersi).WithMany(oh => oh.Gruplari).HasForeignKey(fk => fk.DersNo);

            });


            builder.Entity<Soru>(entity =>
            {
                entity.ToTable("Sorular", "Soru");
                entity.HasKey(d => d.SoruId);
                entity.HasOne(d => d.Dersi).WithMany(oh => oh.Sorulari).HasForeignKey(fk => fk.DersNo);
                entity.HasOne(d => d.Konusu).WithMany(oh => oh.Sorulari).HasForeignKey(fk => fk.KonuNo);
                entity.HasOne(d => d.SoruTipi).WithMany(oh => oh.Sorulari).HasForeignKey(fk => fk.SoruTipNo);
                entity.HasOne(d => d.SoruKoku).WithMany(oh => oh.Sorulari).HasForeignKey(fk => fk.SoruKokuNo);
                entity.HasOne(d => d.BilisselDuzeyi).WithMany(oh => oh.Sorulari).HasForeignKey(fk => fk.BilisselDuzeyNo);
                entity.HasOne(z => z.SoruZorluk).WithMany(sz => sz.Sorulari).HasForeignKey(fk => fk.SoruZorlukNo);

            });

            builder.Entity<TekDogruluSoruSecenek>(entity =>
            {
                entity.ToTable("TekDoguruluSoruSecenekleri", "Soru");
                entity.HasKey(d => d.TekDogruluSoruSecenekId);
                entity.HasOne(d => d.Sorusu).WithMany(oh => oh.TekDogruluSecenekleri).HasForeignKey(fk => fk.SoruNo);


            });
            builder.Entity<SoruKoku>(entity =>
            {
                entity.ToTable("SoruKokleri", "Soru");
                entity.HasKey(d => d.SoruKokuId);

            });

            builder.Entity<SoruTip>(entity =>
            {
                entity.ToTable("SoruTipleri", "Soru");
                entity.HasKey(d => d.SoruTipId);

            });

            builder.Entity<BilisselDuzey>(entity =>
            {
                entity.ToTable("SoruBilisselDuzeyler", "Soru");
                entity.HasKey(d => d.BilisselDuzeyId);

            });

            builder.Entity<SoruHedefBag>(entity =>
            {
                entity.ToTable("SoruOgrenimHedefleri", "Soru");
                entity.HasKey(d => new { d.SoruNo, d.OgrenimHedefNo });
                entity.HasOne(d => d.Sorusu).WithMany(oh => oh.SoruHedefleri).HasForeignKey(fk => fk.SoruNo);
                entity.HasOne(d => d.Hedefi).WithMany(oh => oh.Sorulari).HasForeignKey(fk => fk.OgrenimHedefNo);

            });

            builder.Entity<Mufredat>(entity =>
            {
                entity.ToTable("Mufredatlar", "Ogrenci");
                entity.HasKey(m => m.MufredatId);


            });

            builder.Entity<SoruZorluk>(entity =>
            {

                entity.ToTable("SoruZorluklari", "Soru");
                entity.HasKey(sz => sz.ZorlukId);
            });


            //builder.Entity<OgrenmeDuzey>(entity =>
            //{

            //    entity.ToTable("OgrenmeDuzeyleri", "Cep");
            //    entity.HasKey(sz => sz.Kod);
            //});



            builder.Entity<KontrolListesiGrupTanim>(entity =>
            {

                entity.ToTable("KontrolListeGruplari", "Soru");
                entity.HasKey(kl => kl.Id);
            });


            builder.Entity<KontrolListesiMaddeTanim>(entity =>
            {

                entity.ToTable("KontrolListeTanimlari", "Soru");
                entity.HasKey(klt => klt.Id);
                entity.HasOne(m => m.ListeGrubu).WithMany(d => d.Listeleri).HasForeignKey(fk => fk.KontrolListeGrupNo);
                entity.HasOne(m => m.DegerGrubu).WithMany(d => d.MaddeTanimListesi).HasForeignKey(fk => fk.KontrolListeGrupNo);
            });

            builder.Entity<KontrolListesiDegerGrupTanim>(entity =>
            {
                entity.ToTable("KontrolDegerGruplari", "Soru");
                entity.HasKey(kldt => kldt.Id);


            });

            builder.Entity<KontrolListesiDegerTanim>(entity =>
            {

                entity.ToTable("KontrolListeDegerTanimlari", "Soru");
                entity.HasKey(kldt => kldt.Id);
                entity.HasOne(m => m.DegerGrubu).WithMany(d => d.DegerListesi).HasForeignKey(fk => fk.KontrolDegerGrupTanimNo);
            });

            builder.Entity<SoruKontrol>(entity =>
            {

                entity.ToTable("SoruKontrolleri", "Soru");
                entity.HasKey(sk => sk.Id);
                entity.HasOne(m => m.Sorusu).WithMany(d => d.SoruKontrolleri).HasForeignKey(fk => fk.SoruNo);
                entity.HasOne(m => m.PersonelBilgisi).WithMany(d => d.SoruKontrolleri).HasForeignKey(fk => fk.PersonelNo);

            });

            builder.Entity<SoruKontrolDetay>(entity =>
            {

                entity.ToTable("SoruKontrolDetaylari", "Soru");
                entity.HasKey(sk => sk.Id);
                entity.HasOne(m => m.KontrolBilgisi).WithMany(d => d.Detaylari).HasForeignKey(fk => fk.SoruKontrolNo);
                
            });
        }
    }
}


