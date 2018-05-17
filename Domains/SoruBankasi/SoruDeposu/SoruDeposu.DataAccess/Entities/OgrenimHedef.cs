using System;
using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class OgrenimHedef
    {
        public int OgrenimHedefId { get; set; }
        public int? DersNo { get; set; }
        public Ders Dersi { get; set; }
        public int? KonuNo { get; set; }
        public Konu Konusu { get; set; }
        public string OgrenimHedefAdi { get; set; }
        public DateTime Baslangic { get; set; }
        public DateTime? Bitis { get; set; }
        public List<SoruHedefBag> Sorulari { get; set; }

    }
}
