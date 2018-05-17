using System;

namespace DersYonetimi.DataAccess.Entities
{
    public class OgrenimHedefBase
    {
        public int OgrenimHedefId { get; set; }
        public int? DersNo { get; set; }
        public int? KonuNo { get; set; }
        public string OgrenimHedefAdi { get; set; }
        public DateTime Baslangic { get; set; }
        public DateTime? Bitis { get; set; }
    }
}
