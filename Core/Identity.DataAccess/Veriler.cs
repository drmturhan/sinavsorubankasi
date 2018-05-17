using System.Collections.Generic;

namespace Identity.DataAccess
{
    public static class Veriler
    {

        public static List<KisiCinsiyet> CinsiyetleriAl()
        {

            var sonuc = new List<KisiCinsiyet> {
                new KisiCinsiyet{CinsiyetAdi="Erkek" },
                new KisiCinsiyet{CinsiyetAdi="Kadın" }
            };
            return sonuc;
        }
        public static List<MedeniHal> MedeniHalleriAl()
        {

            var sonuc = new List<MedeniHal> {
                new MedeniHal{MedeniHalAdi="Bekar" },
                new MedeniHal{MedeniHalAdi="Evli" }
            };
            return sonuc;
        }
    }
}
