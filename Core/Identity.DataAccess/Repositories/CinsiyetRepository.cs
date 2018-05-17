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
    public interface ICinsiyetRepository
    {
        Task<SayfaliListe<KisiCinsiyet>> ListeGetirCinsiyetAsync(CinsiyetSorgu sorguNesnesi);
    }
    public class CinsiyetSorgu : SorguBase
    {
        public CinsiyetSorgu()
        {
            SiralamaCumlesi = "CinsiyetAdi";
        }
    }
    public class CinsiyetRepository : ICinsiyetRepository
    {
        private readonly MTIdentityDbContext db;
        private readonly IPropertyMappingService propertyMappingService;
        private readonly ITypeHelperService typeHelperService;


        public IQueryable<KisiCinsiyet> Sorgu { get; private set; }

        public CinsiyetRepository(MTIdentityDbContext db, IPropertyMappingService propertyMappingService, ITypeHelperService typeHelperService)
        {
            this.db = db;
            this.propertyMappingService = propertyMappingService;
            this.typeHelperService = typeHelperService;
            propertyMappingService.AddMap<CinsiyetDto, KisiCinsiyet>(CinsiyetPropertyMap.Values);

            Sorgu = db.Cinsiyetler;
        }
        public async Task<SayfaliListe<KisiCinsiyet>> ListeGetirCinsiyetAsync(CinsiyetSorgu sorguNesnesi = null)
        {
            if (sorguNesnesi != null)
            {

                if (!propertyMappingService.ValidMappingsExistsFor<CinsiyetDto, KisiCinsiyet>(sorguNesnesi.SiralamaCumlesi))
                    throw new ArgumentException("Sıralama bilgisi yanlış!");

                if (!typeHelperService.TryHastProperties<CinsiyetDto>(sorguNesnesi.Alanlar))
                    throw new ArgumentException("Gösterilmek istenen alanlar hatalı!");


                if (!string.IsNullOrEmpty(sorguNesnesi.AramaCumlesi))
                {
                    var anahtarKelimeler = sorguNesnesi.AramaCumlesi.Split(' ');
                    if (anahtarKelimeler.Length > 0)
                    {
                        switch (anahtarKelimeler.Length)
                        {
                            case 1:
                                Sorgu = Sorgu.Where(k => k.CinsiyetAdi.Contains(anahtarKelimeler[0]));
                                break;

                            default:
                                Sorgu = Sorgu;
                                break;
                        }
                    }

                }
                var siralamaBilgisi = propertyMappingService.GetPropertyMapping<CinsiyetDto, KisiCinsiyet>();
                var siralanmisSorgu = Sorgu.SiralamayiAyarla(sorguNesnesi.SiralamaCumlesi, siralamaBilgisi);
                var siraliSonuc = await SayfaliListe<KisiCinsiyet>.SayfaListesiYarat(siralanmisSorgu, sorguNesnesi.Sayfa, sorguNesnesi.SayfaBuyuklugu);
                return siraliSonuc;
            }
            else
            {
                var sonuc= await Sorgu.SayfaListesiYarat<KisiCinsiyet>();
                return sonuc;
            }

        }


    }
    public class CinsiyetPropertyMap
    {

        public static Dictionary<string, PropertyMappingValue> Values = new Dictionary<string, PropertyMappingValue>(StringComparer.OrdinalIgnoreCase)
        {
            { "CinsiyetAdi",new PropertyMappingValue(new List<string>{"CinsiyetAdi" })}

        };

    }
}
