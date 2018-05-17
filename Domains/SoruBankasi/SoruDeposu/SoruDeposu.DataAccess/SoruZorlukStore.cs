using Core.EntityFramework;
using SoruDeposu.DataAccess.Dtos;
using SoruDeposu.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SoruDeposu.DataAccess
{
    public interface ISoruZorlukStore
    {
        Task<SayfaliListe<SoruZorluk>> ListeGetirSoruZorluklariAsync(SoruZorlukSorgusu sorguNesnesi);
    }


    public class SoruZorlukStore : ISoruZorlukStore
    {
        private readonly SoruDepoDbContext db;
        private readonly IPropertyMappingService propertyMappingService;
        private readonly ITypeHelperService typeHelperService;

        public SoruZorlukStore(SoruDepoDbContext db,
            IPropertyMappingService propertyMappingService,
            ITypeHelperService typeHelperService)
        {
            this.db = db;
            this.propertyMappingService = propertyMappingService;
            this.typeHelperService = typeHelperService;

            propertyMappingService.AddMap<SoruZorlukDto, SoruZorluk>(SoruZorlukPropertyMap.Values);
            Sorgu = db.SoruZorluklari;

        }
        public IQueryable<SoruZorluk> Sorgu { get; private set; }

        public async Task<SayfaliListe<SoruZorluk>> ListeGetirSoruZorluklariAsync(SoruZorlukSorgusu sorguNesnesi)
        {
            SayfaliListe<SoruZorluk> sonuc = await Listele(sorguNesnesi);
            return sonuc;

        }

        private async Task<SayfaliListe<SoruZorluk>> Listele(SoruZorlukSorgusu sorguNesnesi)
        {
            var siralamaBilgisi = propertyMappingService.GetPropertyMapping<SoruZorlukDto, SoruZorluk>();
            var siralanmisSorgu = Sorgu.SiralamayiAyarla(sorguNesnesi.SiralamaCumlesi, siralamaBilgisi);
            var sonuc = await SayfaliListe<SoruZorluk>.SayfaListesiYarat(siralanmisSorgu, sorguNesnesi.Sayfa, sorguNesnesi.SayfaBuyuklugu);
            return sonuc;
        }
    }
    public class SoruZorlukPropertyMap
    {

        public static Dictionary<string, PropertyMappingValue> Values = new Dictionary<string, PropertyMappingValue>(StringComparer.OrdinalIgnoreCase)
        {
            { "SoruZorlukId",new PropertyMappingValue(new List<string>{"SoruZorlukId" })},

        };

    }
    public class SoruZorlukSorgusu : SorguBase
    {


    }
}
