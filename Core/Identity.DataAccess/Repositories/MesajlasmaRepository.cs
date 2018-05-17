using Core.EntityFramework;
using Identity.DataAccess.Dtos;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Identity.DataAccess.Repositories
{
    public interface IMesajlasmaRepository : IRepository
    {
        Task<Kullanici> KullaniciBulAsyn(int alanNo);
        Task<SayfaliListe<Mesaj>> ListeleKullaniciyaGelenMesajlarAsync(MesajSorgu sorguNesnesi);
        Task<SayfaliListe<Mesaj>> ListeleMesajYiginiAsync(MesajSorgu sorguNesnesi);

        Task<Mesaj> BulAsync(int mesajNo);
    }


    public class MesajSorgu : SorguBase
    {

        public int? KullaniciNo { get; set; }
        public int? DigerKullaniciNo { get; set; }
        public bool? GelenMesajlar { get; set; }
        public bool? GidenMesajlar { get; set; }
        public bool? OkunmamisMesajlar { get; set; }
        public MesajSorgu()
        {
            SiralamaCumlesi = "Tarih";
        }
    }
    public class MesajlarPropertyMap
    {

        public static Dictionary<string, PropertyMappingValue> Values = new Dictionary<string, PropertyMappingValue>(StringComparer.OrdinalIgnoreCase)
        {
            { "Id",new PropertyMappingValue(new List<string>{"MesajId" })},
            { "Tarih",new PropertyMappingValue(new List<string>{"GonderilmeZamani" })},
            { "Gonderen",new PropertyMappingValue(new List<string>{"Gonderen.Kisi.Ad","Gonderen.Kisi.Soyad" })},
            { "Alan",new PropertyMappingValue(new List<string>{"Alan.Kisi.Ad","Alan.Kisi.Soyad" })},

        };

    }

    public class MesajlasmaRepository : IMesajlasmaRepository
    {
        private readonly MTIdentityDbContext db;
        private readonly IPropertyMappingService propertyMappingService;
        private readonly ITypeHelperService typeHelperService;
        public IQueryable<Mesaj> Sorgu { get; private set; }
        public MesajlasmaRepository(MTIdentityDbContext db, IPropertyMappingService propertyMappingService, ITypeHelperService typeHelperService)
        {
            this.db = db;
            this.propertyMappingService = propertyMappingService;
            this.typeHelperService = typeHelperService;
            propertyMappingService.AddMap<MesajListeDto, Mesaj>(MesajlarPropertyMap.Values);
            Sorgu = db.Mesajlasmalar
                .Include(m => m.Gonderen).ThenInclude(k => k.Kisi).ThenInclude(kisi => kisi.Cinsiyeti)
                .Include(m => m.Gonderen).ThenInclude(k => k.Kisi).ThenInclude(kisi => kisi.Fotograflari)
                .Include(m => m.Alan).ThenInclude(k => k.Kisi).ThenInclude(kisi => kisi.Cinsiyeti)
                .Include(m => m.Alan).ThenInclude(k => k.Kisi).ThenInclude(kisi => kisi.Fotograflari).AsQueryable<Mesaj>();
        }

        public async Task<Mesaj> BulAsync(int mesajNo)
        {
            return await Sorgu.SingleOrDefaultAsync(m => m.MesajId == mesajNo);
        }

        public async Task EkleAsync<T>(T entity) where T : class
        {
            await db.AddAsync(entity);
        }

        public async Task<bool> KaydetAsync()
        {
            var sonuc = await db.SaveChangesAsync() > 0;
            return sonuc;
        }

        public async Task<Kullanici> KullaniciBulAsyn(int alanNo)
        {
            return await db.Users.FindAsync(alanNo);
        }

        public async Task<SayfaliListe<Mesaj>> ListeleKullaniciyaGelenMesajlarAsync(MesajSorgu sorguNesnesi)
        {
            if (sorguNesnesi.KullaniciNo == null)
                throw new ArgumentException("Sisteme giriş yapmış kullanıcı bilgisi yok");

            if (!propertyMappingService.ValidMappingsExistsFor<MesajListeDto, Mesaj>(sorguNesnesi.SiralamaCumlesi))
                throw new ArgumentException("Sıralama bilgisi yanlış!");

            if (!typeHelperService.TryHastProperties<MesajListeDto>(sorguNesnesi.Alanlar))
                throw new ArgumentException("Gösterilmek istenen alanlar hatalı!");


            if (!string.IsNullOrEmpty(sorguNesnesi.AramaCumlesi))
            {
                var anahtarKelimeler = sorguNesnesi.AramaCumlesi.Split(' ');
                if (anahtarKelimeler.Length > 0)
                {
                    //Anahtar kelimeler ile ne aranmak isteniyorsa buraya yaz

                }
            }

            if (sorguNesnesi.GelenMesajlar == true)
            {
                Sorgu = Sorgu.Where(m => m.AlanNo == sorguNesnesi.KullaniciNo.Value);
            }
            else if (sorguNesnesi.GidenMesajlar == true)
            {
                Sorgu = Sorgu.Where(m => m.GonderenNo == sorguNesnesi.KullaniciNo.Value);
            }

            if (sorguNesnesi.OkunmamisMesajlar == true)
            {
                Sorgu = Sorgu.Where(m => m.Okundu == false);
            }

            Sorgu = Sorgu.Where(m => (m.GonderenNo == sorguNesnesi.KullaniciNo && m.GonderenSildi == false) || (m.AlanNo == sorguNesnesi.KullaniciNo && m.AlanSildi == false));
            var siralamaBilgisi = propertyMappingService.GetPropertyMapping<MesajListeDto, Mesaj>();

            var siralanmisSorgu = Sorgu.SiralamayiAyarla(sorguNesnesi.SiralamaCumlesi, siralamaBilgisi);
            var sonuc = await SayfaliListe<Mesaj>.SayfaListesiYarat(siralanmisSorgu, sorguNesnesi.Sayfa, sorguNesnesi.SayfaBuyuklugu);
            return sonuc;
        }

        public void Sil<T>(T entity) where T : class
        {
            db.Remove(entity);
        }

        public async Task<SayfaliListe<Mesaj>> ListeleMesajYiginiAsync(MesajSorgu sorguNesnesi)
        {
            Sorgu = Sorgu.Where(m => (m.GonderenNo == sorguNesnesi.KullaniciNo && m.GonderenSildi == false && m.AlanNo == sorguNesnesi.DigerKullaniciNo) || (m.GonderenNo == sorguNesnesi.DigerKullaniciNo && m.AlanSildi == false && m.AlanNo == sorguNesnesi.KullaniciNo))
                .OrderByDescending(mesaj => mesaj.GonderilmeZamani);
            var sonuc = await SayfaliListe<Mesaj>.SayfaListesiYarat(Sorgu, sorguNesnesi.Sayfa, sorguNesnesi.SayfaBuyuklugu);
            return sonuc;
        }
    }
}
