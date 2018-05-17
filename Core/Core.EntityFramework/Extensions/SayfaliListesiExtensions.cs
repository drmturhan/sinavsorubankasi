using System;
using Newtonsoft.Json;

namespace Core.EntityFramework
{
    public static class SayfaliListesiExtensions
    {
        public static string SayfalamaMetaDataYarat<T>(this SayfaliListe<T> kayitlar, ISayfaBilgiYaratici sayfaBilgiYaratici)
        {
            if (sayfaBilgiYaratici == null)
                throw new Exception("Sayfa bilgi yaratıcı yok!");

            var sayfalamaMetadatasi = new
            {
                kayitSayisi = kayitlar.SayfaBilgisi.KayitSayisi,
                sayfaBuyuklugu = kayitlar.SayfaBilgisi.SayfaBuyuklugu,
                sayfa = kayitlar.SayfaBilgisi.Sayfa,
                sayfaSayisi = kayitlar.SayfaBilgisi.SayfaSayisi,
                oncekiSayfa = kayitlar.SayfaBilgisi.OncesiVar ? sayfaBilgiYaratici.UriYarat(ResourceUriType.OncekiSayfa) : null,
                sonrakiSayfa = kayitlar.SayfaBilgisi.SonrasiVar ? sayfaBilgiYaratici.UriYarat(ResourceUriType.SonrakiSayfa) : null,
            };
            return JsonConvert.SerializeObject(sayfalamaMetadatasi);
        }

    }
}
