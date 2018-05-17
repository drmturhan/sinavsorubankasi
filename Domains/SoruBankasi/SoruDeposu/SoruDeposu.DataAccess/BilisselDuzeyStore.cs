using Core.EntityFramework;
using SoruDeposu.DataAccess.Dtos;
using SoruDeposu.DataAccess.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SoruDeposu.DataAccess
{
    public class BilisselDuzeyStore : IBilisselDuzeyStore
    {

        private readonly SoruDepoDbContext db;
        private readonly IPropertyMappingService propertyMappingService;
        private readonly ITypeHelperService typeHelperService;

        public BilisselDuzeyStore(SoruDepoDbContext db,
            IPropertyMappingService propertyMappingService,
            ITypeHelperService typeHelperService)
        {
            this.db = db;
            this.propertyMappingService = propertyMappingService;
            this.typeHelperService = typeHelperService;

            propertyMappingService.AddMap<BilisselDuzeyDto, BilisselDuzey>(BilisselDuzeyPropertyMap.Values);
            Sorgu = db.BilisselDuzeyler;

        }
        public IQueryable<BilisselDuzey> Sorgu { get; private set; }

        public async Task<SayfaliListe<BilisselDuzey>> ListeGetirBilisselDuzeylerAsync(BilisselDuzeySorgusu sorguNesnesi)
        {
            SayfaliListe<BilisselDuzey> sonuc = await Listele(sorguNesnesi);
            return sonuc;

        }

        private async Task<SayfaliListe<BilisselDuzey>> Listele(BilisselDuzeySorgusu sorguNesnesi)
        {
            var siralamaBilgisi = propertyMappingService.GetPropertyMapping<BilisselDuzeyDto, BilisselDuzey>();
            var siralanmisSorgu = Sorgu.SiralamayiAyarla(sorguNesnesi.SiralamaCumlesi, siralamaBilgisi);
            var sonuc = await SayfaliListe<BilisselDuzey>.SayfaListesiYarat(siralanmisSorgu, sorguNesnesi.Sayfa, sorguNesnesi.SayfaBuyuklugu);
            return sonuc;
        }
    }
    public class BilisselDuzeyPropertyMap
    {

        public static Dictionary<string, PropertyMappingValue> Values = new Dictionary<string, PropertyMappingValue>(StringComparer.OrdinalIgnoreCase)
        {
            { "Id",new PropertyMappingValue(new List<string>{"BilisselDuzyeId" })},

        };

    }

    public class BilisselDuzeySorgusu : SorguBase
    {


    }
}
