using Core.EntityFramework;
using Core.EntityFramework.SharedEntity;
using Identity.DataAccess.Dtos;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Identity.DataAccess.Repositories
{


    public class ArkadaslikSorgusu : SorguBase
    {
        public int? KullaniciNo { get; set; }
        public bool? TeklifEdilenler { get; set; }
        public bool? TeklifEdenler { get; set; }
        public bool? KabulEdilenler { get; set; }
        public bool? CevapBeklenenler { get; set; }
        public bool? Cevaplananlar { get; set; }
        public bool? Silinenler { get; set; }

    }
    public interface IArkadaslikRepository : IRepository
    {
        Task<List<Kullanici>> ListeGetirKullanicilarAsync();
        Task<SayfaliListe<ArkadaslikTeklif>> ListeGetirTekliflerAsync(ArkadaslikSorgusu sorgu);
        Task<Kullanici> KullaniciBulAsync(int kullaniciNo);
        Task<Foto> FotografBulAsync(int fotografNo);
        Task<Foto> ProfilFotografiniAlAsync(int kullaniciNo);
        Task<ArkadaslikTeklif> TeklifiBulAsync(int isteyenKullaniciNo, int cevaplayanKullaniciNo);

    }
    public class ArkadaslikRepository : IArkadaslikRepository
    {
        private readonly MTIdentityDbContext db;
        private readonly IPropertyMappingService propertyMappingService;
        private readonly ITypeHelperService typeHelperService;

        public ArkadaslikRepository(MTIdentityDbContext db, IPropertyMappingService propertyMappingService, ITypeHelperService typeHelperService)
        {
            this.db = db;
            this.propertyMappingService = propertyMappingService;
            this.typeHelperService = typeHelperService;


            propertyMappingService.AddMap<ArkadaslarimListeDto, ArkadaslikTeklif>(ArkadaslikTeklifPropertyMap.Values);
            propertyMappingService.AddMap<ArkadaslarimListeDto, ArkadaslikTeklif>(ArkadaslikTeklifPropertyMap.Values);

            sorgu = db.ArkadaslikTeklifleri
                .Include(t => t.TeklifEden).ThenInclude(k => k.Kisi).ThenInclude(kisi => kisi.Cinsiyeti)
                .Include(t => t.TeklifEden).ThenInclude(k => k.Kisi).ThenInclude(kisi => kisi.Fotograflari)
                .Include(t => t.TeklifEdilen).ThenInclude(k => k.Kisi).ThenInclude(kisi => kisi.Cinsiyeti)
                .Include(t => t.TeklifEdilen).ThenInclude(k => k.Kisi).ThenInclude(kisi => kisi.Fotograflari).AsQueryable();

        }
        public async Task EkleAsync<T>(T entity) where T : class
        {
            await db.AddAsync(entity);
        }

        public async Task<Foto> FotografBulAsync(int fotografNo)
        {
            return await db.KisiFotograflari.FirstOrDefaultAsync(f => f.FotoId == fotografNo);
        }

        public async Task<bool> KaydetAsync()
        {
            var sonuc = await db.SaveChangesAsync();
            return sonuc > 0;
        }

        public async Task<Kullanici> KullaniciBulAsync(int kullaniciNo)
        {
            return await db.Users.SingleOrDefaultAsync(k => k.Id == kullaniciNo);
        }

        IQueryable<ArkadaslikTeklif> sorgu;
        public async Task<ArkadaslikTeklif> TeklifiBulAsync(int isteyenKullaniciNo, int cevaplayanKullaniciNo)
        {
            return await sorgu.FirstOrDefaultAsync(a => a.TeklifEdenNo == isteyenKullaniciNo && a.TeklifEdilenNo == cevaplayanKullaniciNo);
        }

        public async Task<SayfaliListe<ArkadaslikTeklif>> ListeGetirTekliflerAsync(ArkadaslikSorgusu sorguNesnesi)
        {
            if (!propertyMappingService.ValidMappingsExistsFor<ArkadaslarimListeDto, ArkadaslikTeklif>(sorguNesnesi.SiralamaCumlesi))
                throw new ArgumentException("Sıralama bilgisi yanlış!");

            if (!typeHelperService.TryHastProperties<ArkadaslarimListeDto>(sorguNesnesi.Alanlar))
                throw new ArgumentException("Gösterilmek istenen alanlar hatalı!");


            var siralamaBilgisi = propertyMappingService.GetPropertyMapping<ArkadaslarimListeDto, ArkadaslikTeklif>();

            sorgu = sorgu.SiralamayiAyarla(sorguNesnesi.SiralamaCumlesi, siralamaBilgisi);

            sorgu = sorgu.Where(teklif => teklif.TeklifEdenNo == sorguNesnesi.KullaniciNo || teklif.TeklifEdilenNo == sorguNesnesi.KullaniciNo);

            if (sorguNesnesi.KabulEdilenler == true)
                sorgu = sorgu.Where(teklif => teklif.Karar == true);
            if (sorguNesnesi.TeklifEdenler == true)
                sorgu = sorgu.Where(teklif => teklif.TeklifEdilenNo == sorguNesnesi.KullaniciNo);
            if (sorguNesnesi.TeklifEdilenler == true)
                sorgu = sorgu.Where(teklif => teklif.TeklifEdenNo == sorguNesnesi.KullaniciNo);
            if (sorguNesnesi.CevapBeklenenler == true)
                sorgu = sorgu.Where(teklif => teklif.Karar == null);
            if (sorguNesnesi.Silinenler == true)
                sorgu = sorgu.Where(teklif => teklif.IptalEdildi==true);
            if (sorguNesnesi.Cevaplananlar == true)
                sorgu = sorgu.Where(teklif => teklif.Karar != null);
            if (!string.IsNullOrWhiteSpace(sorguNesnesi.AramaCumlesi))
                sorgu = AramaCumlesiniAyarla(sorguNesnesi);


            //sorgu = sorgu.Where(ark => ark.IptalEdildi == null || ark.IptalEdildi.Value != true);

            var sonuc = await SayfaliListe<ArkadaslikTeklif>.SayfaListesiYarat(sorgu, sorguNesnesi.Sayfa, sorguNesnesi.SayfaBuyuklugu);
            return sonuc;
        }

        private IQueryable<ArkadaslikTeklif> AramaCumlesiniAyarla(ArkadaslikSorgusu sorguNesnesi)
        {
            var aramalar = sorguNesnesi.AramaCumlesi.Split(' ');

            switch (aramalar.Length)
            {
                case 1:
                    var tekKelime = aramalar[0].Trim().ToLower();
                    return sorgu.Where(s =>
                        (s.TeklifEdenNo != sorguNesnesi.KullaniciNo && (s.TeklifEden.Kisi.Ad.ToLower().Contains(tekKelime) || s.TeklifEden.Kisi.Soyad.ToLower().Contains(tekKelime)))
                        || (s.TeklifEdilenNo != sorguNesnesi.KullaniciNo && (s.TeklifEdilen.Kisi.Ad.ToLower().Contains(tekKelime) || s.TeklifEdilen.Kisi.Soyad.ToLower().Contains(tekKelime)))
                    );
                case 2:
                    var ad = aramalar[0].Trim().ToLower();
                    var soyad = aramalar[1].Trim().ToLower();
                    return sorgu.Where(s =>
                        (s.TeklifEdenNo != sorguNesnesi.KullaniciNo && (s.TeklifEden.Kisi.Ad.ToLower().Contains(ad) && s.TeklifEden.Kisi.Soyad.ToLower().Contains(soyad)))
                        || (s.TeklifEdilenNo != sorguNesnesi.KullaniciNo && (s.TeklifEdilen.Kisi.Ad.ToLower().Contains(ad) && s.TeklifEdilen.Kisi.Soyad.ToLower().Contains(soyad)))
                    );

                default:
                    return sorgu;
            }
        }

        public async Task<List<Kullanici>> ListeGetirKullanicilarAsync()
        {
            return await db.Users.ToListAsync();
        }

        public async Task<Foto> ProfilFotografiniAlAsync(int kullaniciNo)
        {
            return await db.KisiFotograflari.Where(f => f.Kisi.Kullanicilari.Count(k => k.Id == kullaniciNo) == 1).FirstOrDefaultAsync(p => p.ProfilFotografi);
        }

        public void Sil<T>(T entity) where T : class
        {
            db.Remove(entity);
        }

        


    }
    public class ArkadaslikTeklifPropertyMap
    {

        public static Dictionary<string, PropertyMappingValue> Values = new Dictionary<string, PropertyMappingValue>(StringComparer.OrdinalIgnoreCase)
        {
            { "Id",new PropertyMappingValue(new List<string>{"Id" })},
            { "TeklifEdenAdSoyad",new PropertyMappingValue(new List<string>{"TeklifEden.Kisi.Ad","TeklifEden.Kisi.Soyad" })},
            { "TeklifEdilenAdSoyad",new PropertyMappingValue(new List<string>{"TeklifEdilen.Kisi.Ad","TeklifEdilen.Kisi.Soyad" })},
            { "Karar",new PropertyMappingValue(new List<string>{"Karar" })},
            { "TeklifTarihi",new PropertyMappingValue(new List<string>{"IstekTarihi" })},
            { "CevapTarihi",new PropertyMappingValue(new List<string>{"CevapTarihi" })}
        };

    }
}

