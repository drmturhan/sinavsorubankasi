using Core.EntityFramework;
using DersYonetimi.DataAccess.Dtos;
using DersYonetimi.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DersYonetimi.DataAccess
{

    public class DersStore : IDersStore
    {
        private readonly DersDbContext db;
        private readonly IPropertyMappingService propertyMappingService;
        private readonly ITypeHelperService typeHelperService;

        public DersStore(
             DersDbContext db,
            IPropertyMappingService propertyMappingService,
            ITypeHelperService typeHelperService)
        {
            this.db = db;
            this.propertyMappingService = propertyMappingService;
            this.typeHelperService = typeHelperService;

            propertyMappingService.AddMap<DersDto, Ders>(DersPropertyMap.Values);

            Sorgu = db.Dersler.Include(ders => ders.Konulari)
                .Include(ders => ders.AlanKodu);
        }

        public IQueryable<Ders> Sorgu { get; private set; }

        public async Task<SayfaliListe<Ders>> ListeGetirPersonelSorulariAsync(DersSorgu sorguNesnesi)
        {
            if (sorguNesnesi.DersNo.HasValue)
            {

                Sorgu = Sorgu.Where(d => d.DersId == sorguNesnesi.DersNo.Value);
            }


            FiltreleriAyarla(sorguNesnesi);

            SayfaliListe<Ders> sonuc = await Listele(sorguNesnesi);
            return sonuc;

        }

        private void FiltreleriAyarla(DersSorgu sorguNesnesi)
        {

        }

        private async Task<SayfaliListe<Ders>> Listele(DersSorgu sorguNesnesi)
        {
            var siralamaBilgisi = propertyMappingService.GetPropertyMapping<DersDto, Ders>();
            var siralanmisSorgu = Sorgu.SiralamayiAyarla(sorguNesnesi.SiralamaCumlesi, siralamaBilgisi);
            var sonuc = await SayfaliListe<Ders>.SayfaListesiYarat(siralanmisSorgu, sorguNesnesi.Sayfa, sorguNesnesi.SayfaBuyuklugu);
            return sonuc;
        }
    }
    public class DersSorgu : SorguBase
    {
        public int? DersNo { get; set; }

    }


    public class DersPropertyMap
    {

        public static Dictionary<string, PropertyMappingValue> Values = new Dictionary<string, PropertyMappingValue>(StringComparer.OrdinalIgnoreCase)
        {
            { "DersId",new PropertyMappingValue(new List<string>{"DersId" })},

        };

    }
}
