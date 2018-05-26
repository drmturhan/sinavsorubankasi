using Core.Base.Hatalar;
using Core.EntityFramework;
using Microsoft.EntityFrameworkCore;
using SoruDeposu.DataAccess.Dtos;
using SoruDeposu.DataAccess.Entities;
using SoruDeposu.DataAccess.Mappers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SoruDeposu.DataAccess
{


    public class SoruStore : ISoruStore
    {
        private readonly StoreWriteBase<SoruDepoDbContext, Soru> store;
        private readonly IPropertyMappingService propertyMappingService;
        private readonly ITypeHelperService typeHelperService;

        public SoruStore(
            SoruDepoDbContext soruDb,
            IPropertyMappingService propertyMappingService,
            ITypeHelperService typeHelperService)
        {


            this.store = new StoreWriteBase<SoruDepoDbContext, Soru>(soruDb);
            this.propertyMappingService = propertyMappingService;
            this.typeHelperService = typeHelperService;

            propertyMappingService.AddMap<SoruListeDto, Soru>(SoruPropertyMap.Values);

            store.Sorgu = store.Sorgu
                    .Include(soru => soru.Dersi)
                    .Include(soru => soru.Konusu)
                    .Include(soru => soru.SoruHedefleri).ThenInclude(shb => shb.Hedefi)
                    .Include(soru => soru.SoruTipi)
                    .Include(soru => soru.SoruZorluk)
                    .Include(soru => soru.BilisselDuzeyi)
                    .Include(soru => soru.TekDogruluSecenekleri)
                    .Include(soru => soru.SoruKoku);

            store.Kayit = store.Kayit
                    .Include(soru => soru.SoruHedefleri).ThenInclude(shb => shb.Hedefi)
                    .Include(soru => soru.SoruTipi)
                    .Include(soru => soru.SoruZorluk)
                    .Include(soru => soru.BilisselDuzeyi)
                    .Include(soru => soru.TekDogruluSecenekleri)
                    .Include(soru => soru.SoruKoku);

        }



        public async Task<SayfaliListe<Soru>> ListeGetirPersonelSorulariAsync(SoruSorgu sorguNesnesi, int? personelNo)
        {
            if (personelNo == null || personelNo <= 0)
                throw new Exception("Hoca bilgisi yanlış");

            store.Sorgu = store.Sorgu.Where(soru => soru.PersonelNo == personelNo.Value && soru.Silindi == null);
            FiltreleriAyarla(sorguNesnesi);

            SayfaliListe<Soru> sonuc = await Listele(sorguNesnesi);
            return sonuc;

        }

        public async Task<SayfaliListe<Soru>> ListeGetirSorularAsync(SoruSorgu sorguNesnesi)
        {
            if (sorguNesnesi.DersNo == null && sorguNesnesi.KonuNo == null && sorguNesnesi.BirimNo == null && sorguNesnesi.ProgramNo == null && sorguNesnesi.DonemNo == null && sorguNesnesi.DersGrubuNo == null)
                throw new Exception("Kriterler eksik");

            if (!propertyMappingService.ValidMappingsExistsFor<SoruListeDto, Soru>(sorguNesnesi.SiralamaCumlesi))
                throw new ArgumentException("Sıralama bilgisi yanlış!");

            if (!typeHelperService.TryHastProperties<SoruListeDto>(sorguNesnesi.Alanlar))
                throw new ArgumentException("Gösterilmek istenen alanlar hatalı!");
            FiltreleriAyarla(sorguNesnesi);
            store.Sorgu = store.Sorgu.Where(s => s.Silindi == null);
            SayfaliListe<Soru> sonuc = await Listele(sorguNesnesi);
            return sonuc;
        }

        private async Task<SayfaliListe<Soru>> Listele(SoruSorgu sorguNesnesi)
        {
            var siralamaBilgisi = propertyMappingService.GetPropertyMapping<SoruListeDto, Soru>();
            var siralanmisSorgu = store.Sorgu.SiralamayiAyarla(sorguNesnesi.SiralamaCumlesi, siralamaBilgisi);
            var sonuc = await SayfaliListe<Soru>.SayfaListesiYarat(siralanmisSorgu, sorguNesnesi.Sayfa, sorguNesnesi.SayfaBuyuklugu);
            return sonuc;
        }

        private void FiltreleriAyarla(SoruSorgu sorguNesnesi)
        {
            if (!string.IsNullOrEmpty(sorguNesnesi.AramaCumlesi))
            {

                AramaCumlesineGoreFiltrele(sorguNesnesi);
            }


            if (sorguNesnesi.BirimNo.HasValue)
            {

                store.Sorgu = store.Sorgu.Where(s => s.BirimNo == sorguNesnesi.BirimNo.Value);
            }


            if (sorguNesnesi.ProgramNo.HasValue)
            {

                store.Sorgu = store.Sorgu.Where(s => s.ProgramNo == sorguNesnesi.ProgramNo.Value);
            }


            if (sorguNesnesi.DonemNo.HasValue)
            {

                store.Sorgu = store.Sorgu.Where(s => s.DonemNo == sorguNesnesi.DonemNo.Value);
            }


            if (sorguNesnesi.DersGrubuNo.HasValue)
            {

                store.Sorgu = store.Sorgu.Where(s => s.DersGrubuNo == sorguNesnesi.DersGrubuNo.Value);
            }


            if (sorguNesnesi.OgrenimCiktilar != null)
            {

                store.Sorgu = store.Sorgu.Where(s => s.SoruHedefleri.Any(h => h.OgrenimHedefNo.HasValue && sorguNesnesi.OgrenimCiktilar.Contains(h.OgrenimHedefNo.Value)));
            }


            if (sorguNesnesi.DersNo.HasValue)
            {

                store.Sorgu = store.Sorgu.Where(s => s.DersNo == sorguNesnesi.DersNo.Value);
            }

            if (sorguNesnesi.KonuNo.HasValue)
            {

                store.Sorgu = store.Sorgu.Where(s => s.KonuNo == sorguNesnesi.KonuNo.Value);
            }
            if (sorguNesnesi.SoruTipNo.HasValue)
            {

                store.Sorgu = store.Sorgu.Where(s => s.SoruTipNo == sorguNesnesi.SoruTipNo.Value);
            }

            if (sorguNesnesi.BilisselDuzeyNo.HasValue)
            {

                store.Sorgu = store.Sorgu.Where(s => s.BilisselDuzeyNo == sorguNesnesi.BilisselDuzeyNo.Value);
            }
        }

        private void AramaCumlesineGoreFiltrele(SoruSorgu sorguNesnesi)
        {

            string[] anahtarKelimeler = sorguNesnesi.AramaCumlesi.Split(' ');
            if (anahtarKelimeler.Length > 0)
            {
                foreach (var kelime in anahtarKelimeler)
                {
                    store.Sorgu = store.Sorgu.Where(s => s.AnahtarKelimeler.Contains(kelime));
                }
            }


        }

        public async Task<Soru> YaratAsync(SoruYaratDto yeniSoru)
        {
            var soru = yeniSoru.ToSoru();
            await store.EkleAsync(soru);
            return soru;

        }

        public async Task<Soru> DegistirAsync(SoruDegistirDto soru)
        {

            var veritabanindakiKayit = await store.Kayit.SingleOrDefaultAsync(s => s.SoruId == soru.SoruId);
            if (veritabanindakiKayit == null) throw new BadRequestError("Soru bulunamadı");
            soru.Yaz(veritabanindakiKayit);
            return veritabanindakiKayit;

        }
        public async Task<Soru> KismenDegistirAsync(SoruAlanDegistirDto degisimBilgisi)
        {

            var veritabanindakiKayit = await store.Kayit.SingleOrDefaultAsync(s => s.SoruId == degisimBilgisi.SoruNo);
            if (veritabanindakiKayit == null) throw new BadRequestError("Soru bulunamadı");

            if (degisimBilgisi.Silindi.HasValue)
            {
                veritabanindakiKayit.Silindi = true;
                return veritabanindakiKayit;

            }
            if (degisimBilgisi.Ac.HasValue)
            {
                veritabanindakiKayit.Aktif = degisimBilgisi.Ac.Value;
            }
            if (degisimBilgisi.Favori.HasValue)
            {
                veritabanindakiKayit.Favori = degisimBilgisi.Favori.Value;
            }
            store.Context.Update(veritabanindakiKayit);
            return veritabanindakiKayit;

        }
        public void Sil(Soru silinecekSoru)
        {
            store.Sil(silinecekSoru);
        }

        public async Task<bool> KaydetAsync()
        {
            return await store.KaydetAsync();
        }

        public Task<Soru> BulAsync(int soruId)
        {
            return store.Sorgu.SingleAsync(s => s.SoruId == soruId && s.Silindi == null);
        }

        public async Task<int[]> CokluSil(int[] soruNumaralari)
        {
            var silinenler = new List<int>();
            foreach (var soruNo in soruNumaralari)
            {
                var soru = store.Kayit.SingleOrDefault(s => s.SoruId == soruNo);
                if (soru != null)
                {
                    soru.Silindi = true;
                    silinenler.Add(soru.SoruId);
                }
            }
            var silinenSayi = await store.Context.SaveChangesAsync();
            return silinenler.ToArray();
        }
    }


    public class SoruPropertyMap
    {

        public static Dictionary<string, PropertyMappingValue> Values = new Dictionary<string, PropertyMappingValue>(StringComparer.OrdinalIgnoreCase)
        {
            { "SoruId",new PropertyMappingValue(new List<string>{"SoruId" })},

        };

    }

    public class SoruKokuPropertyMap
    {

        public static Dictionary<string, PropertyMappingValue> Values = new Dictionary<string, PropertyMappingValue>(StringComparer.OrdinalIgnoreCase)
        {
            { "SoruKokuId",new PropertyMappingValue(new List<string>{"SoruKokuId" })},

        };

    }

}
