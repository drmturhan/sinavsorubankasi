using Core.EntityFramework;
using SoruDeposu.DataAccess.Dtos;
using SoruDeposu.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SoruDeposu.DataAccess
{
    public class SoruTipStore : ISoruTipStore
    {
        private readonly SoruDepoDbContext db;
        private readonly IPropertyMappingService propertyMappingService;
        private readonly ITypeHelperService typeHelperService;

        public SoruTipStore(SoruDepoDbContext db,
            IPropertyMappingService propertyMappingService,
            ITypeHelperService typeHelperService)
        {
            this.db = db;
            this.propertyMappingService = propertyMappingService;
            this.typeHelperService = typeHelperService;

            propertyMappingService.AddMap<SoruTipDto, SoruTip>(SoruTipPropertyMap.Values);
            Sorgu = db.SoruTipleri;

        }
        public IQueryable<SoruTip> Sorgu { get; private set; }

        public async Task<SayfaliListe<SoruTip>> ListeGetirSoruTipleriAsync(SoruTipSorgusu sorguNesnesi)
        {
            SayfaliListe<SoruTip> sonuc = await Listele(sorguNesnesi);
            return sonuc;

        }

        private async Task<SayfaliListe<SoruTip>> Listele(SoruTipSorgusu sorguNesnesi)
        {
            var siralamaBilgisi = propertyMappingService.GetPropertyMapping<SoruTipDto, SoruTip>();
            var siralanmisSorgu = Sorgu.SiralamayiAyarla(sorguNesnesi.SiralamaCumlesi, siralamaBilgisi);
            var sonuc = await SayfaliListe<SoruTip>.SayfaListesiYarat(siralanmisSorgu, sorguNesnesi.Sayfa, sorguNesnesi.SayfaBuyuklugu);
            return sonuc;
        }
    }
    public class SoruTipPropertyMap
    {

        public static Dictionary<string, PropertyMappingValue> Values = new Dictionary<string, PropertyMappingValue>(StringComparer.OrdinalIgnoreCase)
        {
            { "SoruTipId",new PropertyMappingValue(new List<string>{"SoruTipId" })},

        };

    }
    public class SoruTipSorgusu : SorguBase
    {


    }
}
