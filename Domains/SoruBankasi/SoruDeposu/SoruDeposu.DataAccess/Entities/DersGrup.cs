using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class DersGrup
    {
        public int DersGrupId { get; set; }
        public int MufredatNo { get; set; }
        public Mufredat Mufredati { get; set; }
        public int DonemNo { get; set; }
        public Donem Donemi { get; set; }
        public string GrupAdi { get; set; }
        public bool Staj { get; set; }
        public bool DersKurulu { get; set; }
        
        public ICollection<GrupDers> Dersleri { get; set; } = new List<GrupDers>();

    }
}
