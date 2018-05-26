using Core.Base.Hatalar;
using Core.EntityFramework;
using Microsoft.EntityFrameworkCore;
using SoruDeposu.DataAccess.Dtos;
using SoruDeposu.DataAccess.Entities;
using SoruDeposu.DataAccess.Mappers;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SoruDeposu.DataAccess
{
    public class SoruKokuStore : ISoruKokuStore
    {
        private readonly StoreWriteBase<SoruDepoDbContext, SoruKoku> store;
        private readonly IPropertyMappingService propertyMappingService;
        private readonly ITypeHelperService typeHelperService;

        public SoruKokuStore(
            SoruDepoDbContext soruDb,
            IPropertyMappingService propertyMappingService,
            ITypeHelperService typeHelperService)
        {
            this.store = new StoreWriteBase<SoruDepoDbContext, SoruKoku>(soruDb);
            this.propertyMappingService = propertyMappingService;
            this.typeHelperService = typeHelperService;


            propertyMappingService.AddMap<SoruKokuListeDto, SoruKoku>(SoruKokuPropertyMap.Values);


            store.Sorgu = store.Sorgu
                    .Include(soru => soru.Sorulari).ThenInclude(soru => soru.Dersi)
                    .Include(soru => soru.Sorulari).ThenInclude(soru => soru.Konusu)
                    .Include(soru => soru.Sorulari).ThenInclude(soru => soru.SoruHedefleri).ThenInclude(shb => shb.Hedefi)
                    .Include(soru => soru.Sorulari).ThenInclude(soru => soru.SoruTipi)
                    .Include(soru => soru.Sorulari).ThenInclude(soru => soru.SoruZorluk)
                    .Include(soru => soru.Sorulari).ThenInclude(soru => soru.BilisselDuzeyi)
                    .Include(soru => soru.Sorulari).ThenInclude(soru => soru.TekDogruluSecenekleri);

            store.Kayit = store.Kayit
                    .Include(soru => soru.Sorulari).ThenInclude(soru => soru.Dersi)
                    .Include(soru => soru.Sorulari).ThenInclude(soru => soru.Konusu)
                    .Include(soru => soru.Sorulari).ThenInclude(soru => soru.SoruHedefleri).ThenInclude(shb => shb.Hedefi)
                    .Include(soru => soru.Sorulari).ThenInclude(soru => soru.SoruTipi)
                    .Include(soru => soru.Sorulari).ThenInclude(soru => soru.SoruZorluk)
                    .Include(soru => soru.Sorulari).ThenInclude(soru => soru.BilisselDuzeyi)
                    .Include(soru => soru.Sorulari).ThenInclude(soru => soru.TekDogruluSecenekleri);

        }

        public async Task<SoruKoku> BulAsync(int soruKokuId)
        {
            return await store.Sorgu.SingleAsync(s => s.SoruKokuId == soruKokuId);
        }

        public async Task<SoruKoku> DegistirAsync(SoruKokuDegistirDto degisecekKayit)
        {
            var veritabanindakiKayit = await store.Kayit.SingleOrDefaultAsync(s => s.SoruKokuId == degisecekKayit.SoruKokuId);
            if (veritabanindakiKayit == null) throw new BadRequestError("Soru bulunamadı");
            degisecekKayit.Yaz(veritabanindakiKayit);
            return veritabanindakiKayit;
        }

        public async Task<bool> KaydetAsync()
        {
            return await store.KaydetAsync();
        }

        public async Task<SoruKoku> KismenDegistirAsync(SoruKokuAlanDegistirDto degisimBilgisi)
        {
            var veritabanindakiKayit = await store.Kayit.SingleOrDefaultAsync(s => s.SoruKokuId == degisimBilgisi.SoruNo);

            if (veritabanindakiKayit == null) throw new BadRequestError("Soru bulunamadı");
            if (degisimBilgisi.Silindi.HasValue)
            {
                foreach (var item in veritabanindakiKayit.Sorulari)
                {
                    item.Silindi = true;
                }
                return veritabanindakiKayit;

            }
            if (degisimBilgisi.Ac.HasValue)
            {
                foreach (var item in veritabanindakiKayit.Sorulari)
                {
                    item.Aktif = degisimBilgisi.Ac.Value; ;
                }

            }
            if (degisimBilgisi.Favori.HasValue)
            {
                foreach (var item in veritabanindakiKayit.Sorulari)
                {
                    item.Favori = degisimBilgisi.Favori.Value; ;
                }

            }
            return veritabanindakiKayit;
        }

        public async Task<SayfaliListe<SoruKoku>> ListeGetirAsync(SoruKokuSorgu sorguNesnesi)
        {

            if (sorguNesnesi.DersNo == null && sorguNesnesi.KonuNo == null && sorguNesnesi.BirimNo == null && sorguNesnesi.ProgramNo == null && sorguNesnesi.DonemNo == null && sorguNesnesi.DersGrubuNo == null)
                throw new Exception("Kriterler eksik");

            if (!propertyMappingService.ValidMappingsExistsFor<SoruKokuListeDto, SoruKoku>(sorguNesnesi.SiralamaCumlesi))
                throw new ArgumentException("Sıralama bilgisi yanlış!");

            if (!typeHelperService.TryHastProperties<SoruKokuListeDto>(sorguNesnesi.Alanlar))
                throw new ArgumentException("Gösterilmek istenen alanlar hatalı!");
            FiltreleriAyarla(sorguNesnesi);
            store.Sorgu = store.Sorgu.SelectMany(soruKoku => soruKoku.Sorulari.Where(soru => soru.Silindi == null).Select(s => s.SoruKoku));
            SayfaliListe<SoruKoku> sonuc = await Listele(sorguNesnesi);
            return sonuc;
        }

        public async Task<SayfaliListe<SoruKoku>> ListeGetirPersonelSorulariAsync(SoruKokuSorgu sorguNesnesi, int? personelNo)
        {
            if (personelNo == null || personelNo <= 0)
                throw new Exception("Hoca bilgisi yanlış");

            store.Sorgu = store.Sorgu.SelectMany(soruKoku => soruKoku.Sorulari.Where(soru => soru.PersonelNo == personelNo.Value && soru.Silindi == null).Select(s => s.SoruKoku));
            FiltreleriAyarla(sorguNesnesi);

            SayfaliListe<SoruKoku> sonuc = await Listele(sorguNesnesi);
            return sonuc;
        }





        public void Sil(SoruKoku silinecekSoru)
        {
            store.Sil(silinecekSoru);
        }

        public async Task<SoruKoku> YaratAsync(SoruKokuYaratDto yeniDto)
        {
            var soruKoku = yeniDto.ToSoruKoku();
            await store.EkleAsync(soruKoku);
            return soruKoku;
        }

        private async Task<SayfaliListe<SoruKoku>> Listele(SoruKokuSorgu sorguNesnesi)
        {
            var siralamaBilgisi = propertyMappingService.GetPropertyMapping<SoruKokuListeDto, SoruKoku>();
            var siralanmisSorgu = store.Sorgu.SiralamayiAyarla(sorguNesnesi.SiralamaCumlesi, siralamaBilgisi);
            var sonuc = await SayfaliListe<SoruKoku>.SayfaListesiYarat(siralanmisSorgu, sorguNesnesi.Sayfa, sorguNesnesi.SayfaBuyuklugu);
            return sonuc;
        }

        private void FiltreleriAyarla(SoruKokuSorgu sorguNesnesi)
        {
            if (!string.IsNullOrEmpty(sorguNesnesi.AramaCumlesi))
            {

                AramaCumlesineGoreFiltrele(sorguNesnesi);
            }


            if (sorguNesnesi.BirimNo.HasValue)
            {

                store.Sorgu = store.Sorgu.SelectMany(s => s.Sorulari.Where(soru => soru.BirimNo == sorguNesnesi.BirimNo.Value).Select(soru => soru.SoruKoku));
            }


            if (sorguNesnesi.ProgramNo.HasValue)
            {
                store.Sorgu = store.Sorgu.SelectMany(s => s.Sorulari.Where(soru => soru.ProgramNo == sorguNesnesi.ProgramNo.Value).Select(soru => soru.SoruKoku));
            }


            if (sorguNesnesi.DonemNo.HasValue)
            {
                store.Sorgu = store.Sorgu.SelectMany(s => s.Sorulari.Where(soru => soru.DonemNo == sorguNesnesi.DonemNo.Value).Select(soru => soru.SoruKoku));
            }


            if (sorguNesnesi.DersGrubuNo.HasValue)
            {
                store.Sorgu = store.Sorgu.SelectMany(s => s.Sorulari.Where(soru => soru.DersGrubuNo == sorguNesnesi.DersGrubuNo.Value).Select(soru => soru.SoruKoku));
            }


            if (sorguNesnesi.OgrenimCiktilar != null)
            {
                store.Sorgu = store.Sorgu.SelectMany(s => s.Sorulari.Where(soru => soru.SoruHedefleri.Any(h => h.OgrenimHedefNo.HasValue && sorguNesnesi.OgrenimCiktilar.Contains(h.OgrenimHedefNo.Value))).Select(soru => soru.SoruKoku));
            }

            if (sorguNesnesi.DersNo.HasValue)
            {

                store.Sorgu = store.Sorgu.SelectMany(s => s.Sorulari.Where(soru => soru.DersNo == sorguNesnesi.DersNo.Value).Select(soru => soru.SoruKoku));

            }

            if (sorguNesnesi.KonuNo.HasValue)
            {
                store.Sorgu = store.Sorgu.SelectMany(s => s.Sorulari.Where(soru => soru.KonuNo == sorguNesnesi.KonuNo.Value).Select(soru => soru.SoruKoku));
            }
            if (sorguNesnesi.SoruTipNo.HasValue)
            {
                store.Sorgu = store.Sorgu.SelectMany(s => s.Sorulari.Where(soru => soru.SoruTipNo == sorguNesnesi.SoruTipNo.Value).Select(soru => soru.SoruKoku));
            }

            if (sorguNesnesi.BilisselDuzeyNo.HasValue)
            {
                store.Sorgu = store.Sorgu.SelectMany(s => s.Sorulari.Where(soru => soru.BilisselDuzeyNo == sorguNesnesi.BilisselDuzeyNo.Value).Select(soru => soru.SoruKoku));
            }
        }
        private void AramaCumlesineGoreFiltrele(SoruSorgu sorguNesnesi)
        {

            string[] anahtarKelimeler = sorguNesnesi.AramaCumlesi.Split(' ');
            if (anahtarKelimeler.Length > 0)
            {
                foreach (var kelime in anahtarKelimeler)
                {
                    store.Sorgu = store.Sorgu.SelectMany(sk => sk.Sorulari.Where(s => s.AnahtarKelimeler.Contains(kelime)).Select(s => s.SoruKoku));
                }
            }


        }


    }

}
