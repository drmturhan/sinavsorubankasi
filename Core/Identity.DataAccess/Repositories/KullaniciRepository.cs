using Core.EntityFramework;
using Identity.DataAccess.Dtos;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.DataAccess.Repositories
{



    public interface IKullaniciRepository : IRepository
    {

        Task<Kullanici> BulAsync(int id);
        Task<SayfaliListe<Kullanici>> ListeGetirKullanicilarTumuAsync(KullaniciSorgu sorgu);
        Task<KisiFoto> FotografBulAsync(int id);
        Task<KisiFoto> KullanicininAsilFotosunuGetirAsync(int kullaniciNo);
        void KisileriniSil(KullaniciKisi entity);

    }
    public class KullaniciSorgu : SorguBase
    {
        public KullaniciSorgu()
        {
            SiralamaCumlesi = "AdSoyad";
        }
    }



    public class KullaniciRepository : IKullaniciRepository
    {
        private readonly MTIdentityDbContext db;
        private readonly IPropertyMappingService propertyMappingService;
        private readonly ITypeHelperService typeHelperService;


        public IQueryable<Kullanici> Sorgu { get; private set; }

        public KullaniciRepository(MTIdentityDbContext db, IPropertyMappingService propertyMappingService, ITypeHelperService typeHelperService)
        {
            this.db = db;
            this.propertyMappingService = propertyMappingService;
            this.typeHelperService = typeHelperService;
            propertyMappingService.AddMap<KullaniciListeDto, Kullanici>(KullaniciPropertyMap.Values);


            Sorgu = db.Users.Include(kul => kul.Kisi)
                    .ThenInclude(k => k.Cinsiyeti)
                    .Include(kul => kul.Kisi).ThenInclude(kul => kul.Fotograflari);
        }

        public async Task<Kullanici> BulAsync(int id)
        {
            return await db.Users
                .Include(k => k.Kisi).ThenInclude(kisi => kisi.Cinsiyeti)
                .Include(k => k.Kisi).ThenInclude(k => k.Fotograflari).FirstOrDefaultAsync(k => k.Id == id);
        }

        public async Task EkleAsync<T>(T entity) where T : class
        {
            await db.AddAsync<T>(entity);
        }

        public async Task<KisiFoto> FotografBulAsync(int id)
        {
            var foto = await db.KisiFotograflari.FirstOrDefaultAsync(p => p.FotoId == id);
            return foto;
        }
        public async Task<KisiFoto> KullanicininAsilFotosunuGetirAsync(int kullaniciNo)
        {
            var foto = await db.KisiFotograflari.Where(f => f.Kisi.Kullanicilari.Count(k => k.Id == kullaniciNo) == 1).FirstOrDefaultAsync(p => p.ProfilFotografi);
            return foto;
        }

        public async Task<bool> KaydetAsync()
        {
            var sonuc = await db.SaveChangesAsync();
            return sonuc > 0;
        }



        public async Task<SayfaliListe<Kullanici>> ListeGetirKullanicilarTumuAsync(KullaniciSorgu sorguNesnesi)
        {

            if (!propertyMappingService.ValidMappingsExistsFor<KullaniciListeDto, Kullanici>(sorguNesnesi.SiralamaCumlesi))
                throw new ArgumentException("Sıralama bilgisi yanlış!");

            if (!typeHelperService.TryHastProperties<KullaniciListeDto>(sorguNesnesi.Alanlar))
                throw new ArgumentException("Gösterilmek istenen alanlar hatalı!");


            if (!string.IsNullOrEmpty(sorguNesnesi.AramaCumlesi))
            {
                var anahtarKelimeler = sorguNesnesi.AramaCumlesi.Split(' ');
                if (anahtarKelimeler.Length > 0)
                {
                    switch (anahtarKelimeler.Length)
                    {
                        case 1:
                            var tekKelime = anahtarKelimeler[0].Trim().ToLower();
                            Sorgu = Sorgu.Where(k => k.Kisi.Ad.ToLower().Contains(tekKelime) || k.Kisi.Soyad.ToLower().Contains(tekKelime));
                            break;
                        case 2:
                            var ad = anahtarKelimeler[0].Trim().ToLower();
                            var soyad = anahtarKelimeler[1].Trim().ToLower();
                            Sorgu = Sorgu.Where(k => k.Kisi.Ad.ToLower().Contains(ad) && k.Kisi.Soyad.ToLower().Contains(soyad));
                            break;
                        case 3:
                            var ad2 = anahtarKelimeler[0].Trim().ToLower();
                            var soyad2 = anahtarKelimeler[1].Trim().ToLower();
                            var digerAd = anahtarKelimeler[2].Trim().ToLower();
                            Sorgu = Sorgu.Where(k => k.Kisi.Ad.ToLower().Contains(ad2) && k.Kisi.DigerAd.ToLower().Contains(digerAd) && k.Kisi.Soyad.ToLower().Contains(soyad2));
                            break;
                    }

                }
            }
            var siralamaBilgisi = propertyMappingService.GetPropertyMapping<KullaniciListeDto, Kullanici>();
            var siralanmisSorgu = Sorgu.SiralamayiAyarla(sorguNesnesi.SiralamaCumlesi, siralamaBilgisi);
            var sonuc = await SayfaliListe<Kullanici>.SayfaListesiYarat(siralanmisSorgu, sorguNesnesi.Sayfa, sorguNesnesi.SayfaBuyuklugu);
            return sonuc;
        }
        public void Sil<T>(T entity) where T : class
        {
            db.Remove<T>(entity);
        }
        public void KisileriniSil(KullaniciKisi entity)
        {
            db.Kisiler.Remove(entity);
        }



    }
    public class KullaniciPropertyMap
    {

        public static Dictionary<string, PropertyMappingValue> Values = new Dictionary<string, PropertyMappingValue>(StringComparer.OrdinalIgnoreCase)
        {
            { "Id",new PropertyMappingValue(new List<string>{"Id" })},
            { "AdSoyad",new PropertyMappingValue(new List<string>{"Kisi.Ad","Kisi.Soyad"})},
            { "Yas",new PropertyMappingValue(new List<string>{"Kisi.DogumTarihi" })},
        };

    }
}
