using Microsoft.AspNetCore.Mvc;

namespace Core.EntityFramework
{
    public class StandartSayfaBilgiYaratici : ISayfaBilgiYaratici
    {

        private readonly string kaynakMetodAdi;
        private readonly IUrlHelper urlHelper;
        private readonly SorguBase sorgu;

        public StandartSayfaBilgiYaratici(SorguBase sorgu, string kaynakMetodAdi, IUrlHelper urlHelper)
        {
            this.kaynakMetodAdi = kaynakMetodAdi;
            this.urlHelper = urlHelper;
            this.sorgu = sorgu;
        }


        public string UriYarat(ResourceUriType type)
        {
            int sayfa = 0;
            switch (type)
            {
                case ResourceUriType.OncekiSayfa:
                    sayfa = sorgu.Sayfa - 1;
                    break;
                case ResourceUriType.SonrakiSayfa:
                    sayfa = sorgu.Sayfa + 1;
                    break;
                default:
                    sayfa = sorgu.Sayfa;
                    break;
            }
            string uri = UriUret(sayfa);
            return uri;
        }

        protected virtual string UriUret(int sayfa)
        {
            return urlHelper.Link(kaynakMetodAdi,
                new
                {
                    siralamaAlani = sorgu.SiralamaCumlesi,
                    aramaCumlesi = sorgu.AramaCumlesi,
                    sayfa = sayfa,
                    sayfaBuyuklugu = sorgu.SayfaBuyuklugu
                });
        }
    }
}
