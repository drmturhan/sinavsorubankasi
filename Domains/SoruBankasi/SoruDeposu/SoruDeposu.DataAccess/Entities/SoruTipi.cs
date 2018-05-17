using System.Collections.Generic;

namespace SoruDeposu.DataAccess.Entities
{
    public class SoruTip
    {
        public int SoruTipId { get; set; }
        public string SoruTipAdi { get; set; }
        public bool? Aktif { get; set; }
        
        public ICollection<Soru> Sorulari { get; set; } = new List<Soru>();
    }
}
