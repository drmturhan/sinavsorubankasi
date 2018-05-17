using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class Konu
    {
        public int KonuId { get; set; }
        public string KonuAdi { get; set; }
        public int DersNo { get; set; }
        public Ders Dersi { get; set; }
        public int KuramsalSaati { get; set; }
        public int UygualamaSaati { get; set; }
        public ICollection<OgrenimHedef> OgrenimHedefleri { get; set; } = new List<OgrenimHedef>();
        public ICollection<DersHoca> AnlatanHocalar { get; set; } = new List<DersHoca>();
        public ICollection<Soru> Sorulari { get; set; } = new List<Soru>();
    }
}
