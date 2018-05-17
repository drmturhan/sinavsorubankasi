using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class Ders
    {
        public int DersId { get; set; }
        public int? AlanKodNo { get; set; }
        public AlanKod AlanKodu { get; set; }
        public string DersAdi { get; set; }
        public int KuramsalSaat { get; set; }
        public int UygulamaSaati { get; set; }
        public int HaftalikHesaplanacak { get; set; }
        public ICollection<Konu> Konulari { get; set; } = new List<Konu>();
        public ICollection<DersHoca> AnlatanHocalar { get; set; } = new List<DersHoca>();
        public ICollection<OgrenimHedef> OgrenimHedefleri { get; set; } = new List<OgrenimHedef>();
        public ICollection<Soru> Sorulari { get; set; } = new List<Soru>();
        public ICollection<GrupDers>  Gruplari { get; set; } = new List<GrupDers>();
    }

}
